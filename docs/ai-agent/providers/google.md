---
title: "Google Gemini Provider Guide: Live Speech, TTS, Summarization & Voice Agent"
description: "Configure Google Gemini as the provider for all six plugNmeet Insights services: Gemini Live transcription, JSON-mode chat translation, Gemini TTS, AI text chat with MCP tools, Files API meeting summarization, and the multimodal voice and vision agent."
keywords: [google gemini ai agent, gemini live speech to text, gemini webrtc transcription, gemini meeting summarization, gemini text to speech, bidi generate content, gemini interactions api, plugnmeet gemini provider, gemini realtime voice agent, gemini token pricing, self-hosted gemini ai, gemini api key config]
sidebar_label: Google Gemini
sidebar_position: 1
---

# Google Gemini Provider Guide

A single Google Gemini account can power **all six** Insights services. Gemini is the only provider with a native path to every service, which makes it the simplest single-vendor deployment.

Two Gemini APIs are used, and the distinction matters when you configure options:

- **Gemini Live (`BidiGenerateContent`)** — a bidirectional WebSocket used by `transcription` (text responses) and `ai_agent` (audio responses).
- **Gemini REST models** — `Models.GenerateContent` for translation and chat, the **Interactions API** for speech synthesis, the **Files API + `Batches.Create`** for meeting summarization.

Both Live and the Interactions API require `api_version: "v1beta"`.

## Supported Services

| Service | Gemini path | Default model |
| --- | --- | --- |
| `transcription` | Gemini Live `BidiGenerateContent`, `ResponseModalities=[TEXT]` | `gemini-3.5-transcribe-live` |
| `translation` | `Models.GenerateContent` with `ResponseMIMEType: application/json` | `gemini-3.1-flash-lite` |
| `speech-synthesis` | Gemini Interactions API returning `audio/L16` PCM16 | `gemini-3.8-flash-tts` |
| `ai_text_chat` | Streaming chat, up to 8 rounds of MCP tool calling | required, for example `gemini-3.1-flash` |
| `meeting_summarizing` | Files API upload plus `Batches.Create` batch job | required, for example `gemini-3.1-flash-lite` |
| `ai_agent` | Gemini Live `BidiGenerateContent`, `ResponseModalities=[AUDIO]` | `gemini-3.8-live` |

Get an API key from Google AI Studio or Google Cloud, then define one account and reference it from every service.

## Provider Account Configuration

```yaml
insights:
  providers:
    google:
      - id: "default-gemini-creds"
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"
        options:
          api_version: "v1beta"
```

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique account name. Services reference it, for example `"default-gemini-creds"`. |
| `credentials.api_key` | string | Yes | Gemini API key. |
| `options.api_version` | string | No | API version. Set `"v1beta"`, which is required for Gemini Live (`transcription`, `ai_agent`) and for the Interactions API (`speech-synthesis`). |
| `options.endpoint` | string | No | Custom gateway or proxy base URL. Leave empty to call Google directly. |
| `options.auth_header` | string | No | Header used to carry the key when a gateway is in front of Gemini. `"Authorization"` sends `Authorization: Bearer <api_key>`. Any other name sends `<header>: <api_key>`. |

## Service Configuration

### `transcription`

Streams the microphone tracks of allowed speakers to Gemini Live and receives text deltas. Live is opened with `ResponseModalities=[TEXT]`, so the model never returns audio for this service.

```yaml
transcription:
  provider: "google"
  id: "default-gemini-creds"
  options:
    model: "gemini-3.5-transcribe-live"
    transcribe_mode: "VERBATIM"
    api_version: "v1beta"
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.model` | string | `"gemini-3.5-transcribe-live"` | Live transcription model. |
| `options.transcribe_mode` | string | `"VERBATIM"` | `"VERBATIM"` transcribes word for word. `"SMART"` lets the model normalize and clean up speech. |
| `options.api_version` | string | `"v1beta"` | Required for `BidiGenerateContent`. |
| `options.max_selected_trans_langs` | integer | `2` | Maximum simultaneous caption languages per room. Enforced server-side; a host cannot raise it from the API. |

### `translation`

Translates a batch of strings into every configured target language in a single `GenerateContent` call. The request sets `ResponseMIMEType: application/json`, so the model returns one JSON object instead of prose, which keeps multi-language chat translation to one round trip.

```yaml
translation:
  provider: "google"
  id: "default-gemini-creds"
  options:
    translate_model: "gemini-3.1-flash-lite"
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.translate_model` | string | `"gemini-3.1-flash-lite"` | Translation model. `model` is accepted as an alias. |
| `options.max_selected_trans_langs` | integer | `5` | Maximum target languages for chat and caption translation. Separate from the transcription limit. |

### `speech-synthesis`

Calls the Gemini Interactions API and reads PCM16 audio (`audio/L16`) straight from the response, so no file is written to disk.

```yaml
speech-synthesis:
  provider: "google"
  id: "default-gemini-creds"
  options:
    model: "gemini-3.8-flash-tts"
    default_voice: "Kore"
    tts_sample_rate: 16000
    api_version: "v1beta"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.model` | string | `"gemini-3.8-flash-tts"` | TTS model. |
| `options.default_voice` | string | `"Kore"` | Voice used when a language has no explicit voice mapping. |
| `options.tts_sample_rate` | integer | `16000` | PCM sample rate. Allowed values: `8000`, `16000`, `24000`. |
| `options.api_version` | string | `"v1beta"` | Required by the Interactions API. |

Gemini uses one `default_voice` for every language rather than a per-language voice map. If you need distinct voices per target language, use the [Microsoft Azure guide](/docs/ai-agent/providers/azure).

### `ai_text_chat`

Streaming chat for moderators (room copilot) and participants (learning assistant). The moderator path can call MCP room tools for up to **8 rounds** before it must answer.

```yaml
ai_text_chat:
  provider: "google"
  id: "default-gemini-creds"
  options:
    chat_model: "gemini-3.1-flash-Preview"
    summarize_model: "gemini-3.1-flash-lite"
    context_window: 5
  pricing:
    "gemini-3.1-flash-Preview":
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
    "gemini-3.1-flash-lite":
      input_price_per_million_tokens: 0.10
      output_price_per_million_tokens: 0.40
```

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `options.chat_model` | string | Yes | Model for the live conversation and tool calling. |
| `options.summarize_model` | string | No | Model used to condense long context. |
| `options.context_window` | integer | No, default `5` | Number of recent messages kept verbatim per conversation. |

### `meeting_summarizing`

Uploads the mixed room recording through the Gemini Files API, then runs a batch job with `Batches.Create` and stores the returned summary text. Uploads are removed after the job finishes.

```yaml
meeting_summarizing:
  provider: "google"
  id: "default-gemini-creds"
  options:
    summarize_model: "gemini-3.1-flash-lite"
  pricing:
    default:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
```

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `options.summarize_model` | string | Yes | Model used for the batch summarization job. |

Custom prompts for the summary are set per room, not here. See [AI Meeting Summarization](/docs/ai-agent/meeting-summarization).

### `ai_agent`

Runs the voice and vision agent on Gemini Live with `ResponseModalities=[AUDIO]`: the model hears the room audio, sees whiteboard and share frames, calls agent tools, and speaks back.

```yaml
ai_agent:
  provider: "google"
  id: "default-gemini-creds"
  options:
    realtime_model: "gemini-3.8-live"
    summarize_model: "gemini-3.1-flash-lite"
    api_version: "v1beta"
  pricing:
    realtime_model:
      input_price_per_million_tokens: 0.75
      cached_input_price_per_million_tokens: 0.075
      cache_write_input_price_per_million_tokens: 0.9375
      audio_input_price_per_million_tokens: 3.00
      audio_cached_input_price_per_million_tokens: 0.30
      audio_cache_write_input_price_per_million_tokens: 3.75
      image_input_price_per_million_tokens: 1.00
      image_cached_input_price_per_million_tokens: 0.10
      image_cache_write_input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 4.50
      audio_output_price_per_million_tokens: 12.00
    summarize_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 1.50
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.realtime_model` | string | `"gemini-3.8-live"` | Live model used for the session. |
| `options.summarize_model` | string | none | Model used for the end-of-session summary. If omitted, the server reuses the summary model from `ai_text_chat` or `meeting_summarizing`, and otherwise writes a deterministic local summary with no LLM call. |
| `options.api_version` | string | `"v1beta"` | Required for `BidiGenerateContent`. |

The **agent voice is selected per room** with `ai_agent_features.voice`, not in server configuration. Server-side options only choose models and the API version.

## Pricing Configuration

Prices only drive the `estimated_cost` field on usage artifacts; they never change what Google bills you. Rates are per million tokens for LLM services and per hour or per million characters for speech.

### `transcription`

`pricing.default.price_per_hour` prices `SPEECH_TRANSCRIPTION_USAGE` from transcribed duration.

### `translation`

`pricing.default.price_per_million_characters` prices translation output.

:::tip
`CHAT_TRANSLATION_USAGE` is metered by **character count**, not tokens, and is priced with `pricing.default.price_per_million_characters`. Set an explicit rate or translation cost estimates stay at zero.
:::

### `speech-synthesis`

`pricing.default.price_per_million_characters` prices `SYNTHESIZED_SPEECH_USAGE` from the number of characters sent to TTS.

### `ai_text_chat`

`pricing.<chat_model>` and `pricing.<summarize_model>` use `input_price_per_million_tokens` and `output_price_per_million_tokens`. Quote model names that contain dots or uppercase characters. A `pricing.default` entry applies to any model without its own block.

### `meeting_summarizing`

`pricing.<summarize_model>` (or `pricing.default`) uses `input_price_per_million_tokens` and `output_price_per_million_tokens`.

### `ai_agent`

Token pricing is multimodal. Put rates under `pricing.realtime_model` (or under the concrete model name) and under `pricing.summarize_model`:

| Key | Covers |
| --- | --- |
| `input_price_per_million_tokens` | Text input |
| `cached_input_price_per_million_tokens` | Cached text input |
| `cache_write_input_price_per_million_tokens` | Text written to the prompt cache |
| `audio_input_price_per_million_tokens` | Participant speech sent to the model |
| `audio_cached_input_price_per_million_tokens` | Cached audio input |
| `audio_cache_write_input_price_per_million_tokens` | Audio written to the prompt cache |
| `image_input_price_per_million_tokens` | Whiteboard and share frames |
| `image_cached_input_price_per_million_tokens` | Cached image input |
| `image_cache_write_input_price_per_million_tokens` | Images written to the prompt cache |
| `output_price_per_million_tokens` | Text output, including thinking tokens |
| `audio_output_price_per_million_tokens` | Synthesized agent speech |

Cache rates are optional. Missing cache rates are estimated at the uncached input rate. The usage fields these rates fill are listed in [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing).

## Complete Configuration Example

Every service on Gemini, one account:

```yaml
insights:
  enabled: true
  providers:
    google:
      - id: "default-gemini-creds"
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"
        options:
          api_version: "v1beta"

  services:
    transcription:
      provider: "google"
      id: "default-gemini-creds"
      options:
        model: "gemini-3.5-transcribe-live"
        transcribe_mode: "VERBATIM"
        api_version: "v1beta"
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36

    translation:
      provider: "google"
      id: "default-gemini-creds"
      options:
        translate_model: "gemini-3.1-flash-lite"
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 10.00

    speech-synthesis:
      provider: "google"
      id: "default-gemini-creds"
      options:
        model: "gemini-3.8-flash-tts"
        default_voice: "Kore"
        tts_sample_rate: 16000
        api_version: "v1beta"
      pricing:
        default:
          price_per_million_characters: 16.00

    ai_text_chat:
      provider: "google"
      id: "default-gemini-creds"
      options:
        chat_model: "gemini-3.1-flash-Preview"
        summarize_model: "gemini-3.1-flash-lite"
        context_window: 5
      pricing:
        default:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50

    meeting_summarizing:
      provider: "google"
      id: "default-gemini-creds"
      options:
        summarize_model: "gemini-3.1-flash-lite"
      pricing:
        default:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50

    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "gemini-3.8-live"
        summarize_model: "gemini-3.1-flash-lite"
        api_version: "v1beta"
      pricing:
        realtime_model:
          input_price_per_million_tokens: 0.75
          cached_input_price_per_million_tokens: 0.075
          cache_write_input_price_per_million_tokens: 0.9375
          audio_input_price_per_million_tokens: 3.00
          audio_cached_input_price_per_million_tokens: 0.30
          audio_cache_write_input_price_per_million_tokens: 3.75
          image_input_price_per_million_tokens: 1.00
          image_cached_input_price_per_million_tokens: 0.10
          image_cache_write_input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 4.50
          audio_output_price_per_million_tokens: 12.00
        summarize_model:
          input_price_per_million_tokens: 0.25
          output_price_per_million_tokens: 1.50
```

## Common Pitfalls

- **Missing `api_version: "v1beta"`.** Gemini Live (`transcription`, `ai_agent`) and the Interactions API (`speech-synthesis`) fail on other versions. Set it on the account, on each of those services, or both.
- **Unquoted model names.** Quote model names such as `"gemini-3.1-flash-Preview"`, and always quote pricing keys that contain dots or uppercase characters.
- **Empty pricing block.** Without rates the session still runs, but usage artifacts report zero cost.

## Related Pages

- [Server & Provider Setup](/docs/ai-agent/configuration): shared provider structure, capability matrix, and BYOK.
- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation): how the hidden `RoomAgent` streams audio.
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization): capture, prompts, and batch job behavior.
- [AI Text Chat & Room Copilot](/docs/ai-agent/ai-text-chat): moderator tool calling and memory.
- [OpenAI & Self-Hosted Provider Guide](/docs/ai-agent/providers/openai)
- [Microsoft Azure Provider Guide](/docs/ai-agent/providers/azure)
