---
title: "Insights Server Configuration: config.yaml, Providers, Models & Pricing"
description: "Complete reference for configuring the plugNmeet Insights platform on your server: Azure, Google and OpenAI provider accounts, all six services, language limits, pricing tables, artifacts_settings, and per-room BYOK."
keywords: [plugnmeet config, insights providers, transcription config yaml, translation config yaml, speech synthesis config, openai realtime config, gemini live config, azure cognitive services config, ai agent pricing, artifacts settings, byok ai provider, self-hosted ai server]
sidebar_label: Server & Provider Setup
sidebar_position: 9
---

# Insights Server & Provider Setup

This page is the reference for server operators. It explains how to define AI provider accounts in `config.yaml`, how to map each Insights service to a provider and model, how pricing is declared, how artifacts are stored, and which limits the server enforces.

:::info Under Active Development
**Live transcription (STT), translation, speech synthesis (TTS), AI Text Chat, and meeting summarization are stable production features**, and their configuration keys are documented below. Only the Voice AI Agent (`ai_agent`) and the newer agentic MCP tool-calling capabilities are under active development: keys, defaults, and supported providers for the agent may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the agent is finalized and released; until then, enable and configure the agent through the plugNmeet API.
:::

## How Configuration Is Structured

The `insights` section has two parts:

1. **`providers`**: your provider accounts, keyed by provider type (`azure`, `google`, `openai`). Each account has a unique `id` and its credentials.
2. **`services`**: the features that use those accounts. Each service entry names the provider, the account `id`, its `options`, and its `pricing`.

This separation lets you define a credential once and reuse it across services, or use a different account per service, for example Azure for speech and Google for summarization.

```yaml
insights:
  enabled: true
  providers:
    azure:
      - id: "eastus_standard"
        credentials:
          api_key: "YOUR_AZURE_SPEECH_KEY"
          region: "eastus"
      - id: "transGlobal"
        credentials:
          api_key: "YOUR_AZURE_TRANSLATOR_KEY"
          region: "global"
        options:
          endpoint: "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"
    google:
      - id: "default-gemini-creds"
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"
    openai:
      - id: "default-openai-creds"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"

  services:
    transcription:
      provider: "azure"
      id: "eastus_standard"
      options:
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36
    translation:
      provider: "azure"
      id: "transGlobal"
      options:
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 10.00
    speech-synthesis:
      provider: "azure"
      id: "eastus_standard"
      options:
        voice-en: "en-US-JennyNeural"
        voice-bn: "bn-BD-NabanitaNeural"
        voice-fr: "fr-FR-DeniseNeural"
        voice-de: "de-DE-KatjaNeural"
        voice-es: "es-ES-ElviraNeural"
      pricing:
        default:
          price_per_million_characters: 16.00
    meeting_summarizing:
      provider: "google"
      id: "default-gemini-creds"
      options:
        summarize_model: "YOUR_SUMMARIZE_MODEL"
      pricing:
        summarize_model:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50
    ai_text_chat:
      provider: "google"
      id: "default-gemini-creds"
      options:
        chat_model: "YOUR_CHAT_MODEL"
        summarize_model: "YOUR_SUMMARIZE_MODEL"
        context_window: 5
      pricing:
        chat_model:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50
        summarize_model:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50
    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "YOUR_REALTIME_MODEL"
        summarize_model: "YOUR_SUMMARY_MODEL"
```

Replace model names and voice IDs with values your provider account can access. The `config_sample.yaml` file shipped with the server lists current examples.

## `insights.providers`

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `providers.<type>` | list | Yes | Provider type: `azure`, `google`, or `openai`. |
| `id` | string | Yes | A unique name for this account. Services refer to it. |
| `credentials.api_key` | string | Yes | The provider API key. |
| `credentials.region` | string | Azure only | Azure region for speech and translator resources. |
| `options.endpoint` | string | No | Custom base URL. Used for Azure's global translator endpoint, OpenAI-compatible gateways, and self-hosted servers. |

Store API keys in a secure location, and restrict file permissions on `config.yaml`.

## Provider Capability Matrix

Not every provider implements every service. Map each service to an account that supports it.

| Service | `google` (Gemini) | `openai` (OpenAI & OpenAI-compatible / self-hosted) | `azure` (native Cognitive Services) |
| --- | --- | --- | --- |
| `transcription` | Yes, Gemini Live | Yes, Realtime WebSocket | Yes, Azure Speech-to-Text |
| `translation` | Yes, JSON-mode chat | Yes, JSON-mode chat | Yes, Azure Translator |
| `speech-synthesis` | Yes, Gemini TTS | Yes, `/v1/audio/speech` | Yes, neural voice per language |
| `ai_text_chat` | Yes | Yes | No |
| `meeting_summarizing` | Yes, Files API batch job | Yes, chunked transcription + LLM | No |
| `ai_agent` | Yes, Gemini Live | Yes, Realtime SDK or Live + delegation | No |

Native `azure` covers the three speech services only; it has no LLM runtime. To run `ai_text_chat`, `meeting_summarizing`, and `ai_agent` on Azure, add an Azure OpenAI resource as a `providers.openai` account with `auth_header: "api-key"`. Mixing providers per service is supported, and each service keeps its own pricing table.

Dedicated provider guides:

- [Google Gemini Provider Guide](/docs/ai-agent/providers/google): all six services on a single account.
- [OpenAI & Self-Hosted Provider Guide](/docs/ai-agent/providers/openai): OpenAI Cloud, OpenAI-compatible servers (vLLM, Ollama, LiteLLM, Kokoro), and multi-account routing.
- [Microsoft Azure Provider Guide](/docs/ai-agent/providers/azure): native speech services plus Azure OpenAI for the LLM services.

## `insights.services`

Each service accepts the same three top-level keys: `provider`, `id`, and `options`, plus an optional `pricing` map. The options and rates differ per service.

### `transcription`

```yaml
transcription:
  provider: "azure"
  id: "eastus_standard"
  options:
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Key | Type | Description |
| --- | --- | --- |
| `options.max_selected_trans_langs` | integer | Maximum number of simultaneous caption languages a room may select. Default `2`. Requests above the limit are clamped. |
| `pricing.default.price_per_hour` | number | Rate used to estimate `SPEECH_TRANSCRIPTION_USAGE` cost from transcribed duration. |

The number of languages is a server limit, not a room setting. A host cannot raise it from the API.

### `translation`

```yaml
translation:
  provider: "azure"
  id: "transGlobal"
  options:
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Key | Type | Description |
| --- | --- | --- |
| `options.max_selected_trans_langs` | integer | Maximum number of target languages for chat translation. Default `5`. It is a separate limit from the caption limit above. |
| `pricing.default.price_per_million_characters` | number | Rate used to estimate `CHAT_TRANSLATION_USAGE` cost from translated characters. Translation is metered by character count, not tokens. |

On Azure, this service must point at the translator account, whose `options.endpoint` is the full request URL `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`. Per-provider option lists are in the [provider guides](#provider-capability-matrix).

### `speech-synthesis`

```yaml
speech-synthesis:
  provider: "azure"
  id: "eastus_standard"
  options:
    voice-en: "en-US-JennyNeural"
    voice-bn: "bn-BD-NabanitaNeural"
    voice-fr: "fr-FR-DeniseNeural"
    voice-de: "de-DE-KatjaNeural"
    voice-es: "es-ES-ElviraNeural"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Key | Type | Description |
| --- | --- | --- |
| `options.voice-<lang>` | string | Azure only. Voice used when synthesizing a target language, for example `voice-en`, `voice-es`, `voice-fr`, `voice-de`, `voice-bn`. A language without a configured voice cannot be spoken. |
| `options.default_voice` | string | Google and OpenAI. Single voice used for every language, for example `"Kore"` or `"alloy"`. |
| `options.tts_sample_rate` | integer | Google only. PCM sample rate: `8000`, `16000` (default), or `24000`. |
| `pricing.default.price_per_million_characters` | number | Rate used to estimate `SYNTHESIZED_SPEECH_USAGE` cost from synthesized characters. |

The server spawns one TTS worker per allowed target language that has a voice. Keep voice IDs to voices your account supports; an invalid ID fails that language, not the whole session.

### `meeting_summarizing`

```yaml
meeting_summarizing:
  provider: "google"
  id: "default-gemini-creds"
  options:
    summarize_model: "YOUR_SUMMARIZE_MODEL"
  pricing:
    summarize_model:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
```

| Key | Type | Description |
| --- | --- | --- |
| `options.summarize_model` | string | Model used for the post-meeting summary. |
| `pricing.<model>.input_price_per_million_tokens` | number | Input token rate for cost estimates. |
| `pricing.<model>.output_price_per_million_tokens` | number | Output token rate for cost estimates. |

Costs appear in `MEETING_SUMMARY_USAGE` and are read from `pricing[summarize_model]`. If the entry is missing, the usage record is written without an estimate. See [AI Meeting Summarization](/docs/ai-agent/meeting-summarization).

### `ai_text_chat`

```yaml
ai_text_chat:
  provider: "google"
  id: "default-gemini-creds"
  options:
    chat_model: "YOUR_CHAT_MODEL"
    summarize_model: "YOUR_SUMMARIZE_MODEL"
    context_window: 5
  pricing:
    chat_model:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
    summarize_model:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
```

| Key | Type | Description |
| --- | --- | --- |
| `options.chat_model` | string | Model for interactive chat turns, including the moderator copilot's tool calls. |
| `options.summarize_model` | string | Model used to compress older turns into the rolling conversation summary (`CheckAndSummarize`). |
| `options.context_window` | integer | Number of recent turns kept verbatim in Redis. Default `5`. |
| `pricing.chat_model` | map | Input and output token rates used for `AI_TEXT_CHAT_INTERACTION_USAGE`. |
| `pricing.summarize_model` | map | Input and output token rates used for `AI_TEXT_CHAT_SUMMARIZATION_USAGE`. |

A cheaper `summarize_model` is usually enough here, because it only compresses history. The full runtime behavior is in [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat).

### `ai_agent`

| Key | Type | Description |
| --- | --- | --- |
| `provider` | string | Provider type to use, `google` or `openai`. |
| `id` | string | Account ID from `providers`. |
| `options.realtime_model` | string | Model for the bidirectional voice session (audio in and out). Used by both providers. |
| `options.live_model` | string | OpenAI only. Speech model for the Live SDK. Use this instead of `realtime_model` when you want the Live SDK. Requires `delegation_model`. |
| `options.delegation_model` | string | OpenAI Live only. The text model that receives tool calls from the speech model. Required when `live_model` is set. |
| `options.summarize_model` | string | Text model used once at the end of a session to refine the `AI_AGENT_SESSION_SUMMARY` artifact. If unset, the server uses the `summarize_model` of `ai_text_chat` or `meeting_summarizing` for the same provider, and then a deterministic local summary. |
| `options.default_voice` | string | Voice ID used when the room does not set `voice`. Must be a voice your provider supports. |
| `options.turn_detection` | string | OpenAI Realtime only. `semantic_vad` (default), `server_vad`, or `none`. Self-hosted servers often need `server_vad` or `none`. |
| `options.input_transcription_model` | string | OpenAI Realtime only. Transcription model for the learner's speech. Set to `none` to disable input transcription. |
| `options.realtime_auth_header` | string | OpenAI Realtime only. Header name for the API key, for example `api-key` on some gateways. |
| `pricing` | map | Per-model price table used for cost estimates in `AI_AGENT_USAGE`. See below. |

#### Choosing Google or OpenAI for the voice agent

| Aspect | Google | OpenAI |
| --- | --- | --- |
| Voice session | `realtime_model` | `realtime_model` (Realtime SDK) or `live_model` (Live SDK) |
| Tool delegation model | Provider-managed with `realtime_model` | `delegation_model` required with the Live SDK |
| Summary | `summarize_model` | `summarize_model` |
| Turn detection options | Provider default | `semantic_vad`, `server_vad`, `none` |
| Billing style | Per token and per modality | Realtime: per token. Live: per minute for speech, per token for delegation. |

Any model name beginning with `gpt-live` uses the Live SDK. Every other OpenAI model uses the Realtime SDK. This includes OpenAI-compatible self-hosted servers.

## Pricing Tables

The `pricing` block lets you set your own rates so that usage artifacts show estimated cost. Prices here are only used for estimates. They do not change what your provider charges you.

Token rates are per million tokens. Speech services use per-hour or per-character rates, as listed above. Example for a Google realtime model with per-modality rates:

```yaml
pricing:
  realtime_model:
    input_price_per_million_tokens: 0.75          # text input
    audio_input_price_per_million_tokens: 3.00    # audio input
    image_input_price_per_million_tokens: 1.00    # image input
    output_price_per_million_tokens: 4.50         # text output
    audio_output_price_per_million_tokens: 12.00  # audio output
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 1.50
```

Example for OpenAI Live, which bills speech per minute and delegation per token:

```yaml
pricing:
  live_model:
    price_per_minute: 0.05
  delegation_model:
    input_price_per_million_tokens: 0.10
    cached_input_price_per_million_tokens: 0.01
    cache_write_input_price_per_million_tokens: 0.125
    output_price_per_million_tokens: 0.50
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 2.00
```

Cached and cache-write rates are optional. Without them, cached tokens are billed as uncached input in the estimate. The full set of usage fields is described in [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing).

## `artifacts_settings`

Artifacts (transcripts, summaries, analytics exports) are written to disk and served through short-lived download tokens. The `artifacts_settings` block controls where they live and how deletion is handled.

```yaml
artifacts_settings:
  storage_path: "./storage/artifacts"
  token_validity: 3600
  enable_del_artifacts_backup: true
  del_artifacts_backup_path: "./storage/artifacts_backup"
  del_artifacts_backup_duration: 30
```

| Key | Type | Description |
| --- | --- | --- |
| `storage_path` | string | Directory where artifact files are written. Must be writable by the server process. |
| `token_validity` | integer | Validity window applied to download tokens issued by `/auth/artifact/getDownloadToken`. |
| `enable_del_artifacts_backup` | boolean | When `true`, deleting an artifact moves a copy to the backup path instead of discarding it. |
| `del_artifacts_backup_path` | string | Directory used for deleted artifact copies. |
| `del_artifacts_backup_duration` | integer | How long deleted artifacts are retained before the backup copy is purged. |

Defaults and units are defined in the `config_sample.yaml` shipped with your server version. If you run multiple instances, point `storage_path` at shared storage, otherwise a download request served by another instance will not find the file.

## Per-Room Bring-Your-Own-Key (BYOK)

A host can supply their own provider account for one room, instead of using the server's account. This is set in the room's `ai_agent_features.custom_provider` object. See the [Developer & API Guide](/docs/ai-agent/developer-guide#custom_provider-byok) for field names and a request example.

### What BYOK Does

- The room uses the **host-supplied provider**, endpoint, and models.
- The server does not use its own `ai_agent` account for that room.
- Usage for that room is **excluded from platform billing artifacts**, because the host pays the provider directly.

### Security Lifecycle of the API Key

The API key is handled as a secret from the moment it arrives:

1. **Accepted in the room creation request.** The key arrives in the `/auth/room/create` request, as part of `ai_agent_features.custom_provider`.
2. **Stripped before broadcast.** Before room metadata is saved to NATS or sent to participants, the server removes the `custom_provider` object. Participants never receive the key.
3. **Stored only in Redis.** The key is saved under `pnm:ai_agent:<roomId>:provider_config`, with a TTL set by the server. It is not written to the database.
4. **Inherited by breakout rooms.** When a 1-on-1 child room starts, the provider configuration is copied to the child room with the same TTL, so the session can run without the parent room's key being sent again.
5. **Removed with the room.** When the room's Redis data expires or the room ends, the key is gone.

:::caution Rotate Keys After Room Use
Treat any key sent through BYOK as exposed to your server's Redis. Use keys with spending limits, and rotate them if your Redis instance is shared or if you are unsure who can read it.
:::

## Server Defaults and Clamping Limits

The server fills in defaults for any field the host leaves unset, and clamps values that are out of range. The table below lists the current limits. Values outside a range are adjusted to the nearest allowed value, not rejected.

| Setting | Default | Allowed range | Notes |
| --- | --- | --- | --- |
| `max_session_seconds` | `1800` (30 min) | `60` to `7200` | Hard cap per AI Agent session. |
| `max_audio_minutes` | `120` | Up to `240` | `0` means use the server default. |
| `vision_debounce_ms` | `1200` | `500` to `5000` | Minimum time between whiteboard snapshots. The client also applies a 4-second floor. |
| `vision_max_edge_px` | `1024` | `512` to `1600` | Longest edge of the WebP snapshot. |
| `topic_anchor_interval_turns` | `6` | `3` to `12` | How often the topic anchor is re-injected. |
| `knowledge_cache_ttl_seconds` | `3600` | `60` to `86400` | Cache duration for fetched external pages. |
| `speaking_rate` | `1.0` | `0.5` to `2.0` | Speech speed. |
| `transcription.options.max_selected_trans_langs` | `2` | Server-wide | Caption languages per room. |
| `translation.options.max_selected_trans_langs` | `5` | Server-wide | Chat translation languages per room. |
| `ai_text_chat.options.context_window` | `5` | Server-wide | Verbatim turns kept before rolling summarization. |
| `max_concurrent_sessions` (`OPEN_PER_USER`) | Host-set | Server cap `16` | Concurrent 1-on-1 sessions in a room. |
| `allowed_participant_ids` (`CONTROLLED_USERS`) | Host-set | Up to `32` | Pre-authorized participants. |
| `mcp_servers` | None | Max `2` per room | See [External MCP Servers](/docs/ai-agent/developer-guide#external-mcp-servers-mcp_servers). |
| `allowed_tools` per MCP server | None | Max `8` | Read-only tools only. |
| `allowed_knowledge_urls` | None | Max `32` entries | HTTPS only. |
| `strict_topic_enforcement` | `true` | | Declines out-of-topic requests. |

## E2EE Compatibility

Server-side speech services and the AI Agent need to hear audio, and the agent needs to read the whiteboard. Those requirements determine which E2EE modes are supported.

| Room E2EE setting | Speech services & AI Agent | Notes |
| --- | --- | --- |
| **E2EE disabled** | Supported | Full voice, captions, whiteboard, notepad, and tools. |
| **E2EE enabled with a server-managed key** | Supported | The server holds the key, so it can decrypt audio and publish synthesized tracks. |
| **E2EE enabled with a self-inserted per-device key** (`enabled_self_insert_encryption_key: true`) | **Not supported** | The server cannot read the key, so server-side transcription cannot decrypt raw audio and AI Agent room creation is rejected with an E2EE-unsupported error. |

Text-based features, such as chat translation and AI text chat, are not affected by this table. The rules are described in the [Security Overview](/docs/security-overview#53-the-impact-of-end-to-end-encryption-e2ee).

## Checklist Before Going Live

1. Add provider accounts under `insights.providers` and test each API key.
2. Map `transcription`, `translation`, and `speech-synthesis` to a provider that supports them, and configure voices for every spoken language.
3. Map `meeting_summarizing` and `ai_text_chat` to an account with access to the configured models.
4. Set `insights.services.ai_agent` with a realtime model and a summary model.
5. Add `pricing` entries if you want accurate cost estimates.
6. Set `artifacts_settings.storage_path` to a writable directory, and to shared storage if you run more than one instance.
7. Restart the server and create a test room with the relevant `insights_features` flags enabled.
8. Confirm that a caption track, a summary artifact, and an AI chat reply are produced, and that usage artifacts carry an estimated cost.
9. If you use BYOK, confirm that the key is not visible in participant metadata.

## Related Pages

- [Overview & Insights Framework](/docs/ai-agent/overview)
- [Google Gemini Provider Guide](/docs/ai-agent/providers/google)
- [OpenAI & Self-Hosted Provider Guide](/docs/ai-agent/providers/openai)
- [Microsoft Azure Provider Guide](/docs/ai-agent/providers/azure)
- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation)
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization)
- [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat)
- [Developer & API Guide](/docs/ai-agent/developer-guide)
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing)
- [Security Overview](/docs/security-overview)
- [Installation](/docs/installation)
