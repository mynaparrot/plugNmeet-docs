---
title: "Real-Time Speech-to-Text, Live Captions & Spoken Translation Setup"
description: "Configure plugNmeet's transcription, live caption translation, and speech synthesis services: hidden RoomAgent capture, Azure and OpenAI providers, room creation flags, moderator controls, WebVTT transcripts, and usage artifacts."
keywords: [real-time speech to text, live captions video conferencing, live caption translation, speech synthesis tts, self-hosted speech to text, webrtc live transcription, multilingual video conferencing, azure speech to text, openai transcription, webvtt transcript download, chat translation in meetings, plugnmeet insights]
sidebar_label: Live Captions, STT & Translation
sidebar_position: 8
---

# Real-Time Speech-to-Text, Live Captions & Spoken Translation

The Insights platform turns a live room into a captioned, searchable, multilingual session. Three services do the work: `transcription` converts speech to text, `translation` converts that text into other languages (including chat messages), and `speech-synthesis` speaks the translated captions aloud. All three run server-side against your own provider account.

## How It Works: Three Integrated Services

| Service | What the server does | Output |
| --- | --- | --- |
| `transcription` | Spawns a hidden `RoomAgent` participant that subscribes to the microphone tracks of allowed speakers and streams their speech to the provider. | `TRANSCRIPTION_OUTPUT_TEXT` pub/sub events with partial and final chunks. |
| `translation` | Translates final caption chunks into each selected target language, and translates chat messages on demand. | Translated caption text and translated chat messages. |
| `speech-synthesis` | For each allowed target language, spawns a TTS worker that speaks the translated caption chunks. | Synthesized audio tracks published into the plugNmeet room. |

### 1. `transcription`

The server does not capture audio in the browser. It joins the room as a hidden `RoomAgent` participant, subscribes only to the microphone tracks of the speakers the moderator allowed, and forwards that audio to the configured provider.

Results arrive over NATS pub/sub as `TRANSCRIPTION_OUTPUT_TEXT` events. Partial chunks update the live caption line as the speaker talks; final chunks are the text that can be stored, translated, synthesized, and compiled into a transcript file.

### 2. `translation`

Translation is stateless and has two entry points:

- **Live captions.** Every final chunk can be translated into up to `max_selected_trans_langs` target languages at the same time, each rendered as its own caption/subtitle track.
- **Chat messages.** Public chat translation is handled per message, so a participant can translate a message into their own language without changing what other participants see.

The two features are gated separately (`is_allow_translation` vs. `chat_translation_features.is_allow`) and have separate language limits.

### 3. `speech-synthesis` (Spoken Translation / TTS)

When `is_enabled_speech_synthesis` is on together with translation, the server creates one TTS worker per allowed target language. Each worker takes the translated caption chunks and synthesizes speech with the voice configured for that language (`voice-en`, `voice-es`, `voice-fr`, `voice-de`, `voice-bn`, and so on), then publishes the synthesized audio as a track in the plugNmeet room.

Because the audio is published as a normal room track, participants subscribe to it like any other audio. When the room uses E2EE with a server-managed key, the synthesized track is encrypted consistently with the rest of the media.

## Supported Providers

| Provider | `transcription` | `translation` | `speech-synthesis` |
| --- | --- | --- | --- |
| Google Gemini (`google`) | Gemini Live `BidiGenerateContent`, text responses | `GenerateContent` with JSON response mode | Gemini Interactions API, PCM16 audio |
| OpenAI (`openai`) | Realtime WebSocket with `intent=transcription` | `chat.completions` with JSON mode | `/v1/audio/speech`, 24 kHz PCM |
| Azure Cognitive Services (`azure`) | Azure Speech-to-Text (STT and caption translation in one pass) | Azure Translator REST endpoint | Azure neural voices, one per language |

Each service is mapped independently in `config.yaml`, so you can run Azure speech-to-text and Azure neural voices with Gemini translation, or move all three to a single Gemini or OpenAI account. Provider accounts, endpoints, and pricing are documented in [Server & Provider Setup](/docs/ai-agent/configuration), with full option lists in the [Google Gemini](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), and [Microsoft Azure](/docs/ai-agent/providers/azure) provider guides.

## Two-Stage Control Lifecycle

### Step 1: Room Creation (`/room/create`)

The host enables the features in `metadata.room_features.insights_features`. Nothing runs until a moderator also starts a session inside the room.

```json
{
  "room_id": "class-101",
  "metadata": {
    "room_title": "Biology 101",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "transcription_features": {
          "is_allow": true,
          "is_allow_translation": true,
          "is_allow_speech_synthesis": true
        },
        "chat_translation_features": {
          "is_allow": true
        }
      }
    }
  }
}
```

| Field | Effect |
| --- | --- |
| `transcription_features.is_allow` | Allows live transcription in this room. |
| `transcription_features.is_allow_translation` | Allows translating live captions. Requires `is_allow`. |
| `transcription_features.is_allow_speech_synthesis` | Allows spoken translation. Requires `is_allow` and `is_allow_translation`. |
| `chat_translation_features.is_allow` | Allows on-demand translation of public chat messages. |

The number of simultaneous caption languages is **not** a room setting. It is enforced from server config: `insights.services.transcription.options.max_selected_trans_langs` (default `2`) for live captions, and `insights.services.translation.options.max_selected_trans_langs` (default `5`) for chat translation. Requests above the limit are clamped.

See [`/room/create` insights features](/docs/api/room/create#insights-features) for the full object.

### Step 2: In-Meeting Moderator & Participant Controls

Room creation only grants permission. A moderator must start transcription inside the room, and the moderator decides who may speak into it.

**Moderator controls**

| Setting | Purpose |
| --- | --- |
| Start/stop live transcription | Opens or closes the transcription session for the room. |
| `allowed_spoken_langs` | Languages the moderator is willing to transcribe. |
| `allowed_speech_users` | Participants whose microphone tracks the hidden `RoomAgent` may subscribe to. Everyone else is never captured. |
| `is_enabled_translation` | Turns live caption translation on for the session. |
| `allowed_trans_langs` | Target caption languages offered to participants, capped by `max_selected_trans_langs`. |
| `default_subtitle_lang` | Subtitle language a participant sees before choosing one. |
| `is_enabled_speech_synthesis` | Enables the per-language TTS workers for spoken translation. |

**Participant controls**

- Start and stop their own microphone transcription session. A participant who never starts a session is never transcribed, even when the room feature is allowed.
- Select their `spoken_lang`, restricted to the moderator's `allowed_spoken_langs`.
- Choose whether their final transcript chunks may be stored, with `allowed_transcription_storage`. When it is off, the participant still sees live captions, but no text is persisted for them.

:::caution E2EE with a self-inserted user key
If the room uses E2EE with `enabled_self_insert_encryption_key: true`, the server cannot decrypt raw audio with a client-only key, and server-side transcription is rejected. E2EE with a server-managed key works normally.
:::

**Chat translation**

The moderator enables public chat translation with `allowed_trans_langs` and `default_lang`. Participants then translate individual chat messages on demand into one of the allowed languages. Translation is stateless: the original message is unchanged, and nothing is stored per message.

## VTT Subtitles, Usage Artifacts & Webhooks

### Transcript file

When `allowed_transcription_storage` is enabled, final chunks are stored per speaker. At room end the server compiles them into a standard WebVTT file with `<v Speaker Name>` voice tags and stores it as a `SPEECH_TRANSCRIPTION` artifact (type `4`, mime type `text/vtt`). The file is downloadable through [`/auth/artifact/getDownloadToken`](/docs/api/artifact/download) and appears in [`/auth/artifact/fetch`](/docs/api/artifact/fetch).

### Usage artifacts

At room end the server emits up to three usage artifacts through the [`artifact_created`](/docs/others/webhooks#artifact-created) webhook:

| Artifact | Type | Payload | Pricing source |
| --- | --- | --- | --- |
| `SPEECH_TRANSCRIPTION_USAGE` | `5` | `duration_usage`: `duration_sec`, per-speaker/per-language breakdown, `estimated_cost`, `reference_artifact_id` pointing at the VTT artifact. | `price_per_hour` of the `transcription` service. |
| `SYNTHESIZED_SPEECH_USAGE` | `6` | `character_count_usage`: `total_characters`, per-language breakdown, `estimated_cost`. | `price_per_million_characters` of the `speech-synthesis` service. |
| `CHAT_TRANSLATION_USAGE` | `7` | `character_count_usage`: `total_characters`, per-language breakdown, `estimated_cost`. | `price_per_million_characters` of the `translation` service. |

Usage that happens in a breakout room is rolled up and attributed to the parent room, so a two-room group exercise still produces one billing trail.

Use `reference_artifact_id` on `SPEECH_TRANSCRIPTION_USAGE` to pair a transcript file with the duration it was billed for. The full artifact and pricing model is in [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing).

## Related Pages

- [Overview & Insights Framework](/docs/ai-agent/overview)
- [Server & Provider Setup](/docs/ai-agent/configuration): provider accounts, language limits, and per-hour/per-character pricing.
- Provider guides: [Google Gemini](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure).
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing): every artifact type and cost field.
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization): summaries that do not depend on live captions.
- [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat): a moderator copilot that can turn these services on by request.
- [`/room/create` insights features](/docs/api/room/create#insights-features)
