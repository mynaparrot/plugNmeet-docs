---
title: "AI Agent Server Configuration: config.yaml, Providers, BYOK & Limits"
description: "Complete reference for configuring the plugNmeet AI Agent on your server, including Google and OpenAI provider accounts, ai_agent model and pricing options, per-room bring-your-own-key (BYOK) setup, Redis key lifecycle, server limits, and E2EE compatibility."
keywords: [plugnmeet config, insights providers, openai realtime config, gemini live config, ai agent config yaml, byok ai provider, bring your own api key, ai agent pricing, ai provider settings, self-hosted ai server]
sidebar_label: Server & Provider Setup
sidebar_position: 5
---

# AI Agent Server & Provider Setup

This page is the reference for server operators. It explains how to define AI provider accounts in `config.yaml`, how to map the AI Agent service to a provider and models, how per-room bring-your-own-key (BYOK) works, and which limits the server enforces.

:::info Under Active Development
The AI Agent engine and its configuration keys are under active development. Keys, defaults, and supported providers may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the feature is finalized and released. Today, enable and configure the agent through the API.
:::

## How Configuration Is Structured

The `insights` section has two parts:

1. **`providers`**: your provider accounts, keyed by provider type (`google`, `openai`, and others). Each account has a unique `id` and its credentials.
2. **`services`**: the features that use those accounts. The AI Agent uses the `services.ai_agent` entry.

This separation lets you define a credential once and reuse it across services, or use a different account for the agent than for text chat.

```yaml
insights:
  enabled: true
  providers:
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
    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "YOUR_REALTIME_MODEL"
        summarize_model: "YOUR_SUMMARY_MODEL"
```

Replace the model names with models your provider account can access. The sample file in the server repository lists current examples.

## `insights.providers`

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `providers.<type>` | list | Yes | Provider type. The AI Agent supports `google` and `openai`. |
| `id` | string | Yes | A unique name for this account. Services refer to it. |
| `credentials.api_key` | string | Yes | The provider API key. |
| `options.endpoint` | string | No | Custom base URL. Use this for OpenAI-compatible gateways or self-hosted servers. |

Store API keys in a secure location, and restrict file permissions on `config.yaml`.

## `insights.services.ai_agent`

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

### Choosing Google or OpenAI

| Aspect | Google | OpenAI |
| --- | --- | --- |
| Voice session | `realtime_model` | `realtime_model` (Realtime SDK) or `live_model` (Live SDK) |
| Tool delegation model | Provider-managed with `realtime_model` | `delegation_model` required with the Live SDK |
| Summary | `summarize_model` | `summarize_model` |
| Turn detection options | Provider default | `semantic_vad`, `server_vad`, `none` |
| Billing style | Per token and per modality | Realtime: per token. Live: per minute for speech, per token for delegation. |

Any model name beginning with `gpt-live` uses the Live SDK. Every other OpenAI model uses the Realtime SDK. This includes OpenAI-compatible self-hosted servers.

## Pricing Tables

The `pricing` block lets you set your own rates so that usage artifacts show estimated cost. Rates are in your currency unit per million tokens, or per minute for Live speech. Prices here are only used for estimates in `AI_AGENT_USAGE`. They do not change what your provider charges you.

Example for a Google realtime model with per-modality rates:

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
| `max_session_seconds` | `1800` (30 min) | `60` to `7200` | Hard cap per session. |
| `max_audio_minutes` | `120` | Up to `240` | `0` means use the server default. |
| `vision_debounce_ms` | `1200` | `500` to `5000` | Minimum time between whiteboard snapshots. The client also applies a 4-second floor. |
| `vision_max_edge_px` | `1024` | `512` to `1600` | Longest edge of the WebP snapshot. |
| `topic_anchor_interval_turns` | `6` | `3` to `12` | How often the topic anchor is re-injected. |
| `knowledge_cache_ttl_seconds` | `3600` | `60` to `86400` | Cache duration for fetched external pages. |
| `speaking_rate` | `1.0` | `0.5` to `2.0` | Speech speed. |
| `max_concurrent_sessions` (`OPEN_PER_USER`) | Host-set | Server cap `16` | Concurrent 1-on-1 sessions in a room. |
| `allowed_participant_ids` (`CONTROLLED_USERS`) | Host-set | Up to `32` | Pre-authorized participants. |
| `mcp_servers` | None | Max `2` per room | See [External MCP Servers](/docs/ai-agent/developer-guide#external-mcp-servers-mcp_servers). |
| `allowed_tools` per MCP server | None | Max `8` | Read-only tools only. |
| `allowed_knowledge_urls` | None | Max `32` entries | HTTPS only. |
| `strict_topic_enforcement` | `true` | | Declines out-of-topic requests. |

## E2EE Compatibility

The AI Agent needs to hear audio, and it needs to read the whiteboard. Those requirements determine which E2EE modes it supports.

| Room E2EE setting | AI Agent | Notes |
| --- | --- | --- |
| **E2EE disabled** | Supported | Full voice, whiteboard, notepad, and tools. |
| **E2EE enabled with a server-managed key** | Supported | The server holds the key, so the agent can receive it. |
| **E2EE enabled with a self-inserted per-device key** (`enabled_self_insert_encryption_key: true`) | **Not supported** | The server cannot read the key, so room creation with the AI Agent is rejected with an E2EE-unsupported error. |

Text-based features are not affected by this table. The rules are described in the [Security Overview](/docs/security-overview#53-the-impact-of-end-to-end-encryption-e2ee).

## Checklist Before Going Live

1. Add a provider account under `insights.providers` and test the API key.
2. Set `insights.services.ai_agent` with a realtime model and a summary model.
3. Add `pricing` entries if you want accurate cost estimates.
4. Restart the server and create a test room with `is_allow: true` for the AI Agent.
5. Confirm that a 1-on-1 session starts, speaks, draws, and produces an `AI_AGENT_SESSION_SUMMARY` artifact.
6. If you use BYOK, confirm that the key is not visible in participant metadata.

## Related Pages

- [Developer & API Guide](/docs/ai-agent/developer-guide)
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing)
- [Security Overview](/docs/security-overview)
- [Installation](/docs/installation)
