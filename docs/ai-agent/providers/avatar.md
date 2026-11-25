---
title: "Avatar Providers Guide: Real-Time AI Video Avatar for the Voice Agent"
description: "Give the plugNmeet voice agent a real-time, lip-synced AI video avatar with Beyond Presence, Anam or Simli, plus per-room BYOK and per-minute billing."
keywords: [beyond presence avatar, anam ai avatar, simli avatar, real-time ai video avatar, plugnmeet avatar agent, byok ai avatar, plugnmeet avatar providers, lip-sync ai presenter, avatar media participant, avatar per minute pricing, ai tutor video avatar, avatar provider config]
sidebar_label: Avatar Providers
sidebar_position: 4
---

# Avatar Providers Guide

Google Gemini, OpenAI, and Azure power what the agent **says and knows**. An avatar provider gives that voice a **face**: it renders the agent's speech as real-time, lip-synced video inside the plugNmeet room. Three providers are supported: `beyond_presence`, `anam`, and `simli`.

## How It Works

1. `ai_agent` runs the voice session, tool calls, and whiteboard work on your LLM provider.
2. When the session starts, the server invites the avatar provider into the plugNmeet room with a scoped participant token.
3. The provider joins as a media participant, renders the agent's audio as lip-synced video, and publishes audio and video to the room.
4. Barge-in carries through: when a participant interrupts, the agent stops speaking and the avatar follows.
5. When the session ends, the provider leaves the room.

Avatar providers receive room audio only. They never see your LLM credentials or your prompts.

## Supported Avatar Providers

| Provider key | Default endpoint | Default auth header | Configuration options |
| --- | --- | --- | --- |
| `beyond_presence` | `https://api.bey.dev` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `anam` | `https://api.anam.ai` | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |
| `simli` | `https://api.simli.ai` | `x-simli-api-key` | `avatar_id`, `endpoint`, `auth_header` |

- **`avatar_id`** selects the face or avatar on the provider account.
- **`endpoint`** replaces the default base URL, for a gateway or a self-hosted avatar server.
- **`auth_header`** carries the key when an endpoint expects a different header. `Authorization` sends `Authorization: Bearer <api_key>`; any other name sends `<header>: <api_key>`.

The default endpoints target each provider's public API. Check the `config_sample.yaml` of your server version before you point `endpoint` at a custom gateway.

## Server Configuration (`config.yaml`)

Avatar accounts live under `insights.providers`, separate from the LLM accounts:

```yaml
insights:
  providers:
    beyond_presence:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_BEYOND_PRESENCE_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    anam:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_ANAM_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    simli:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_SIMLI_API_KEY"
        options:
          avatar_id: "your-avatar-id"
```

Then pick one default avatar for `ai_agent` and price it per minute:

```yaml
insights:
  services:
    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "gemini-3.8-live"
        avatar_provider: "simli"
        avatar_id: "your-avatar-id"
        avatar_account_id: "default-avatar"
      pricing:
        avatar_model:
          price_per_minute: 0.10
        # Optional: a provider-named block wins over avatar_model.
        simli:
          price_per_minute: 0.08
```

| Key | Type | Description |
| --- | --- | --- |
| `options.avatar_provider` | string | Default avatar provider: `beyond_presence`, `anam`, or `simli`. Rooms can override it. |
| `options.avatar_id` | string | Default face on that provider. Used when the room sets no `avatar_id`. |
| `options.avatar_account_id` | string | `id` of the account under `providers.<avatar_provider>` that holds the key. |
| `pricing.avatar_model.price_per_minute` | number | Rate for each minute of generated avatar video. |
| `pricing.<provider>.price_per_minute` | number | Optional per-provider rate. Takes precedence over `avatar_model`. |

Leave `avatar_provider` empty to keep every room voice-only. An avatar account is used only when the server default or the room asks for one.

## Per-Room Override & BYOK (`ai_agent_features.avatar`)

A host can enable an avatar for a single room without changing server configuration:

```json
{
  "insights_features": {
    "ai_agent_features": {
      "is_enabled": true,
      "avatar": {
        "is_enabled": true,
        "provider": "anam",
        "avatar_id": "your-avatar-id",
        "max_avatar_minutes": 60
      }
    }
  }
}
```

The room can also bring its own key and gateway:

```json
{
  "avatar": {
    "is_enabled": true,
    "provider": "beyond_presence",
    "avatar_id": "your-avatar-id",
    "max_avatar_minutes": 60,
    "api_key": "ROOM_OWNED_KEY",
    "endpoint": "https://your-avatar-gateway.example.com",
    "auth_header": "x-api-key"
  }
}
```

`api_key`, `endpoint`, and `auth_header` are stripped from the room metadata before it is published to NATS, and kept only in the room-scoped Redis record (`pnm:ai_agent:<roomId>:provider_config`). Small-group child sessions inherit that record, so a 1-on-1 session starts without resending the key. Field names and limits are listed in [`avatar`](/docs/ai-agent/developer-guide#avatar).

## Requirements & Billing

### Requirements

- **Publicly reachable server.** The avatar provider connects from its own network, so your plugNmeet server must be reachable from the internet. A server that only resolves inside a private network will fail to connect.
- **E2EE completely disabled.** The provider is an external media participant and cannot join an encrypted room. Room creation with `avatar.is_enabled` and any E2EE mode is rejected.
- **A resolvable provider, avatar, and key.** They come from the room, from `ai_agent.options`, or from both. If none of them resolve, the session runs without video.

### Budget & Billing

- **`max_avatar_minutes`** caps billable avatar video per room, up to `240`. `0` uses the server default. The counter is cumulative across restarts in the same room, so stopping and restarting the agent does not reset it.
- **Separate artifact.** Avatar minutes are written to `AI_AGENT_AVATAR_USAGE` (type `13`) as a duration record. They are never mixed into LLM token totals, and `AI_AGENT_USAGE` stays purely token and audio usage.
- **BYOK sessions record zero cost.** The duration is still recorded, `*_estimated_cost` is omitted, and the breakdown carries `custom_avatar_provider_<provider>: 1`.
- Keep `max_avatar_minutes` in line with `max_audio_minutes` so the two budgets end together.

## Common Pitfalls

- **Avatar enabled in an E2EE room.** Rejected at room creation. Remove every E2EE mode, including server-managed encryption, before you enable an avatar.
- **Private or local-only server URL.** The provider joins from the internet. Make sure your plugNmeet server is publicly reachable and its media ports are open.
- **Empty `pricing` block.** Video still runs, but `AI_AGENT_AVATAR_USAGE` reports zero cost.
- **Unpriced provider block.** A provider-named block without `price_per_minute` silently falls back to `avatar_model`, or to zero when that is also missing.

## Related Pages

- [Server & Provider Setup](/docs/ai-agent/configuration): shared provider structure and pricing.
- [Developer & API Guide](/docs/ai-agent/developer-guide#avatar): every `avatar` field and request example.
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing): the `AI_AGENT_AVATAR_USAGE` payload.
- [Security Overview](/docs/security-overview): how BYOK secrets and E2EE interact with a media participant.
- [Google Gemini Provider Guide](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure): the voice side of the session.
