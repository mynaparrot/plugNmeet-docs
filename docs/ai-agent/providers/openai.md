---
title: "OpenAI & Self-Hosted Provider Guide: Realtime Voice Agent, Whisper, TTS & Local LLMs"
description: "Configure OpenAI and OpenAI-compatible endpoints in plugNmeet: Realtime SDK transcription, chat translation, audio speech, MCP tool calling, chunked meeting summarization, and two agent architectures including a self-hosted Live plus delegation stack on vLLM, Ollama or LiteLLM."
keywords: [openai webrtc voice agent, self-hosted llm video conferencing, openai realtime api, openai live sdk, vllm ollama litellm plugnmeet, whisper transcription config, kokoro tts openai compatible, gpt realtime transcription, openai compatible endpoint, multi account provider routing, openai token pricing, delegation model voice agent]
sidebar_label: OpenAI & Self-Hosted
sidebar_position: 2
---

# OpenAI & Self-Hosted Provider Guide

The `openai` provider covers three things at once:

1. **OpenAI Cloud** — all six Insights services.
2. **Any OpenAI-compatible server** — vLLM, Ollama, LiteLLM, LocalAI, Kokoro/openedai-speech, faster-whisper servers, and gateways. Point `options.endpoint` at the server and the same service code runs unchanged.
3. **Multiple accounts** — define several `providers.openai` entries with different `id`s and endpoints, then route each service to the account that should serve it.

Because model names are free-form strings, self-hosted deployments use their own model identifiers (an Ollama tag, a vLLM served name) and their own pricing rates.

## Supported Services

| Service | Transport | Default model |
| --- | --- | --- |
| `transcription` | Realtime WebSocket, `intent=transcription` | `gpt-realtime-whisper` |
| `translation` | `chat.completions` with JSON response mode | `gpt-5.4-mini` |
| `speech-synthesis` | `POST /v1/audio/speech`, raw 24 kHz PCM | `gpt-4o-mini-tts` |
| `ai_text_chat` | Streaming chat completions plus MCP tool calling | `chat_model` required, for example `gpt-5.4` |
| `meeting_summarizing` | `/v1/audio/transcriptions` plus chat summarization | `gpt-4o-transcribe` |
| `ai_agent` | Realtime SDK **or** Live SDK plus delegation | `gpt-realtime-2.1-mini` / `gpt-live-1` |

## Provider Account Configuration

```yaml
insights:
  providers:
    openai:
      - id: "default-openai"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"
          auth_header: "Authorization"
```

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique account name, for example `"default-openai"`, `"local-vllm"`, `"local-whisper"`. |
| `credentials.api_key` | string | Yes | API key. Self-hosted servers that do not check keys still expect a non-empty value. |
| `options.endpoint` | string | No | Base URL. Defaults to `https://api.openai.com/v1`. For the WebSocket services (`/realtime` and `/live`), `http` and `https` are converted to `ws` and `wss` automatically. |
| `options.auth_header` | string | No | Header carrying the key. Default `"Authorization"` sends `Authorization: Bearer <api_key>`. `"api-key"` sends `api-key: <key>`, which is what Azure OpenAI and some gateways expect. Any other name sends `<header>: <key>`. |

Multiple accounts, one per backend:

```yaml
insights:
  providers:
    openai:
      - id: "default-openai"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"
      - id: "local-vllm"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.10:8000/v1"
      - id: "local-whisper"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.11:9000/v1"
```

Services then reference these `id`s independently.

## Service Configuration

### `transcription`

Opens the Realtime WebSocket with `intent=transcription` and streams captured speech as PCM frames. Unlike the chat agent, this connection uses the transcription intent, so the server never receives generated audio back.

```yaml
transcription:
  provider: "openai"
  id: "default-openai"
  options:
    realtime_transcription_model: "gpt-realtime-whisper"
    transcription_turn_detection: "manual"
    input_sample_rate: 16000
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.realtime_transcription_model` | string | `"gpt-realtime-whisper"` | Realtime transcription model. |
| `options.transcription_turn_detection` | string | `"manual"` | `"semantic_vad"` or `"server_vad"` lets the provider decide utterance boundaries. `"manual"` (alias `"none"`) means the server commits segments itself, using the commit timers below. |
| `options.input_sample_rate` | integer | `16000` | Sample rate of audio sent to the provider. |
| `options.transcription_min_commit_ms` | integer | `1500` | Minimum audio buffered before a manual commit. |
| `options.transcription_silence_commit_ms` | integer | `900` | Silence duration that triggers a commit. |
| `options.transcription_max_commit_ms` | integer | `12000` | Hard cap on buffered audio, so a long monologue still produces captions. |
| `options.transcription_max_buffered_silence_ms` | integer | `400` | Silence kept in the buffer for context, so the next segment starts with a little lead-in. |
| `options.transcription_speech_rms` | integer | `500` | RMS amplitude treated as speech. Raise it for noisy rooms, lower it for quiet speakers. |
| `options.max_selected_trans_langs` | integer | `2` | Maximum simultaneous caption languages per room. |

The commit timers only apply with manual commit. With `semantic_vad` or `server_vad` the provider emits segment boundaries itself.

### `translation`

Uses `chat.completions` in JSON response mode to translate every requested target language in one request.

```yaml
translation:
  provider: "openai"
  id: "default-openai"
  options:
    model: "gpt-5.4-mini"
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.model` | string | `"gpt-5.4-mini"` | Translation model. Any chat-capable model works, including a local one. |
| `options.max_selected_trans_langs` | integer | `5` | Maximum target languages per room. |

A local model on vLLM, Ollama, or LiteLLM is a good fit here: translation traffic is high volume and short.

### `speech-synthesis`

Calls `/v1/audio/speech` and receives raw PCM at **24 kHz**, ready to send to participants.

```yaml
speech-synthesis:
  provider: "openai"
  id: "default-openai"
  options:
    model: "gpt-4o-mini-tts"
    default_voice: "alloy"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.model` | string | `"gpt-4o-mini-tts"` | TTS model. |
| `options.default_voice` | string | `"alloy"` | Voice name. Valid values depend on your model or server. |

OpenAI-compatible TTS servers expose their own voice names, for example Kokoro voices on `openedai-speech`. The endpoint returns 24 kHz PCM regardless of voice.

### `ai_text_chat`

Streaming chat completions, with MCP tool calling through `AITextChatStreamWithTools`.

```yaml
ai_text_chat:
  provider: "openai"
  id: "local-vllm"
  options:
    chat_model: "gpt-5.4"
    summarize_model: "gpt-5.4-mini"
    context_window: 5
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `options.chat_model` | string | Yes | Model for the live conversation and tool calls. |
| `options.summarize_model` | string | No, default `"gpt-5.4-mini"` | Model used to condense context. |
| `options.context_window` | integer | No, default `5` | Recent messages kept verbatim per conversation. |

:::tip
For a local server, `chat_model` must be the **served model name** (what `/v1/models` reports), not the model in the upstream registry. Function calling must be supported if moderators should use room tools.
:::

### `meeting_summarizing`

Runs as a Redis-tracked background job. The mixed recording is split into WAV segments of **20 MB or less**, each segment is transcribed with `/v1/audio/transcriptions`, and the combined transcript is summarized with chat completions.

```yaml
meeting_summarizing:
  provider: "openai"
  id: "default-openai"
  options:
    transcription_model: "gpt-4o-transcribe"
    summarize_model: "gpt-5.4-mini"
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.transcription_model` | string | `"gpt-4o-transcribe"` | Model used per audio chunk. |
| `options.summarize_model` | string | `"gpt-5.4-mini"` | Model used for the final summary. |

Chunking keeps long recordings inside upload limits; each chunk is merged into one transcript before summarization.

### `ai_agent`

The agent has **two architectures**. Both speak, see frames, and call tools; they differ in where the reasoning happens.

#### Mode 1: Realtime SDK

End-to-end speech-to-speech over the Realtime API, with native tool calling and vision. Configure `realtime_model` and leave `live_model` unset.

```yaml
ai_agent:
  provider: "openai"
  id: "default-openai"
  options:
    realtime_model: "gpt-realtime-1.5"
    summarize_model: "gpt-5.4-mini"
    default_voice: "marin"
    turn_detection: "semantic_vad"
    input_transcription_model: "gpt-transcribe"
    realtime_auth_header: "Authorization"
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.realtime_model` | string | `"gpt-realtime-2.1-mini"` | Realtime speech-to-speech model. |
| `options.summarize_model` | string | none | Model for the end-of-session summary. |
| `options.default_voice` | string | `"marin"` | Default agent voice. Rooms may pick a different voice with `ai_agent_features.voice`. |
| `options.turn_detection` | string | `"semantic_vad"` | `"semantic_vad"`, `"server_vad"`, or `"none"` for push-to-talk style control. |
| `options.input_transcription_model` | string | `"gpt-transcribe"` | Transcribes participant speech for artifact logging. Set `"none"` to disable. |
| `options.realtime_auth_header` | string | `"Authorization"` | Header used on the Realtime WebSocket. Set `"api-key"` for Azure OpenAI and some gateways. |

#### Mode 2: Live SDK with delegation

A fast speech model handles audio in and audio out, while a separate text and vision model does the reasoning and tool calling.

```yaml
ai_agent:
  provider: "openai"
  id: "local-live"
  options:
    live_model: "gpt-live-1"
    delegation_model: "gpt-5.4-mini"
    summarize_model: "gpt-5.4-mini"
    default_voice: "marin"
  pricing:
    live_model:
      price_per_minute: 0.05
    delegation_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 2.00
    summarize_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 1.50
```

Mode 2 activates when `live_model` is configured, or when `realtime_model` starts with `gpt-live` (the default Live model is `gpt-live-1`).

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `options.live_model` | string | Yes for Mode 2 | Speech-in, speech-out model, for example `gpt-live-1` or a self-hosted Voxtral or Ultravox deployment. |
| `options.delegation_model` | string | **Yes for Mode 2** | Text and vision reasoning model that receives transcripts, frames, and tool results. Can be any chat-capable model, including a local vLLM model. |
| `options.summarize_model` | string | No | Session summary model. |

:::warning
If `live_model` is set, `delegation_model` is **enforced at server startup**. A missing `delegation_model` stops the server instead of silently falling back to Realtime behavior.
:::

Mode 2 is how self-hosted voice agents usually run: speech models like Voxtral or Ultravox are fast but weak at tool calling, so a separate LLM handles planning, MCP tools, and room lookups.

## Self-Hosted and Hybrid Setup

A practical split — cheap local models for high-volume text, cloud models where quality matters:

```yaml
insights:
  enabled: true
  providers:
    openai:
      # Local text models: vLLM, Ollama, and LiteLLM all expose /v1
      - id: "local-vllm"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.10:8000/v1"

      # Local OpenAI-compatible TTS, e.g. Kokoro via openedai-speech
      - id: "local-tts"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.12:8000/v1"

      # OpenAI Cloud for the agent
      - id: "default-openai"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"

  services:
    transcription:
      provider: "openai"
      id: "default-openai"
      options:
        realtime_transcription_model: "gpt-realtime-whisper"
        input_sample_rate: 16000
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36

    translation:
      provider: "openai"
      id: "local-vllm"
      options:
        model: "Qwen/Qwen3-8B-Instruct"
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 0.00

    speech-synthesis:
      provider: "openai"
      id: "local-tts"
      options:
        model: "kokoro"
        default_voice: "af_heart"
      pricing:
        default:
          price_per_million_characters: 0.00

    ai_text_chat:
      provider: "openai"
      id: "local-vllm"
      options:
        chat_model: "Qwen/Qwen3-8B-Instruct"
        summarize_model: "Qwen/Qwen3-8B-Instruct"
        context_window: 5
      pricing:
        default:
          input_price_per_million_tokens: 0.00
          output_price_per_million_tokens: 0.00

    meeting_summarizing:
      provider: "openai"
      id: "default-openai"
      options:
        transcription_model: "gpt-4o-transcribe"
        summarize_model: "gpt-5.4-mini"
      pricing:
        default:
          input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 10.00

    ai_agent:
      provider: "openai"
      id: "default-openai"
      options:
        realtime_model: "gpt-realtime-1.5"
        summarize_model: "gpt-5.4-mini"
        default_voice: "marin"
        turn_detection: "semantic_vad"
```

Zero rates are valid: usage artifacts then report `estimated_cost: 0`, which is accurate for hardware you already run. To run everything locally, replace the cloud account in `transcription`, `meeting_summarizing`, and `ai_agent` with local accounts. Live and delegation both accept any OpenAI-compatible endpoint.

## Pricing Configuration

| Service | Pricing key |
| --- | --- |
| `transcription` | `pricing.default.price_per_hour` |
| `translation` | `pricing.default.price_per_million_characters` (character-counted `CHAT_TRANSLATION_USAGE`) |
| `speech-synthesis` | `pricing.default.price_per_million_characters` |
| `ai_text_chat` | `pricing.<chat_model>` and `pricing.<summarize_model>`, or `pricing.default` |
| `meeting_summarizing` | `pricing.<summarize_model>`, or `pricing.default` |
| `ai_agent` Mode 1 | `pricing.realtime_model` multimodal token rates |
| `ai_agent` Mode 2 | `pricing.live_model.price_per_minute` plus `pricing.delegation_model` and `pricing.summarize_model` token rates |

### Token rates (Realtime, chat, summarization, delegation)

`input_price_per_million_tokens` and `output_price_per_million_tokens` are the minimum for chat and summarization. Realtime multimodal models add the per-modality fields below, and the same keys are accepted for `delegation_model` when it accepts audio or images directly:

| Key | Covers |
| --- | --- |
| `input_price_per_million_tokens` | Text input |
| `cached_input_price_per_million_tokens` | Cached text input |
| `cache_write_input_price_per_million_tokens` | Text written to the prompt cache |
| `audio_input_price_per_million_tokens` | Participant speech |
| `audio_cached_input_price_per_million_tokens` | Cached audio input |
| `audio_cache_write_input_price_per_million_tokens` | Audio written to the prompt cache |
| `image_input_price_per_million_tokens` | Whiteboard and share frames |
| `image_cached_input_price_per_million_tokens` | Cached image input |
| `image_cache_write_input_price_per_million_tokens` | Images written to the prompt cache |
| `output_price_per_million_tokens` | Text output, including reasoning tokens |
| `audio_output_price_per_million_tokens` | Synthesized agent speech |

Mode 1 example:

```yaml
pricing:
  realtime_model:
    input_price_per_million_tokens: 4.00
    cached_input_price_per_million_tokens: 0.40
    audio_input_price_per_million_tokens: 32.00
    audio_cached_input_price_per_million_tokens: 0.40
    image_input_price_per_million_tokens: 4.00
    output_price_per_million_tokens: 16.00
    audio_output_price_per_million_tokens: 64.00
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 2.00
```

### Live billing (Mode 2)

Mode 2 speech is billed by **audio duration**, so `pricing.live_model.price_per_minute` is the only key under `live_model`. Reasoning is billed per token on `delegation_model`. Usage artifacts record live minutes and delegated tokens separately, which is why both blocks and `summarize_model` are needed for accurate estimates.

## Common Pitfalls

- **Pointing WebSocket services at an HTTP-only server.** `transcription` needs a server that implements the Realtime WebSocket protocol, not just `/v1/audio/transcriptions`. A pure Whisper HTTP server cannot serve live captions; use it for `meeting_summarizing` instead.
- **Wrong auth header.** Azure OpenAI and several gateways reject `Authorization: Bearer`; set `auth_header: "api-key"`, and `realtime_auth_header: "api-key"` on the agent.
- **`live_model` without `delegation_model`.** The server refuses to start.
- **Assuming a model name from the OpenAI registry works locally.** Use the served name reported by `/v1/models`.

## Related Pages

- [Server & Provider Setup](/docs/ai-agent/configuration): provider structure, capability matrix, and BYOK.
- [Google Gemini Provider Guide](/docs/ai-agent/providers/google)
- [Microsoft Azure Provider Guide](/docs/ai-agent/providers/azure): running the agent on Azure OpenAI with `provider: "openai"`.
- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation)
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization)
- [Agent Capabilities & Guardrails](/docs/ai-agent/tools-and-capabilities): tool set shared by both agent architectures.
