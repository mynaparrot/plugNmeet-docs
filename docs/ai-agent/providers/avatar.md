---
title: "Avatar Providers Guide: Real-Time AI Video Avatar for the Voice Agent"
description: "Give the plugNmeet voice agent a real-time, lip-synced AI video avatar with Beyond Presence, Anam, Simli, Tavus, HeyGen or a self-hosted LiveKit avatar server, plus per-room BYOK and per-minute billing."
keywords: [beyond presence avatar, anam ai avatar, simli avatar, tavus avatar, tavus pal avatar, heygen avatar, heygen liveavatar, livekit datastream avatar, websocket avatar server, self-hosted avatar server, real-time ai video avatar, plugnmeet avatar agent, byok ai avatar, plugnmeet avatar providers, lip-sync ai presenter, avatar media participant, avatar per minute pricing, ai tutor video avatar, avatar provider config]
sidebar_label: Avatar Providers
sidebar_position: 4
---

# Avatar Providers Guide

Google Gemini, OpenAI, and Azure power what the agent **says and knows**. An avatar provider gives that voice a **face**: it renders the agent's speech as real-time, lip-synced video inside the plugNmeet room. Seven providers are supported: `beyond_presence`, `anam`, `simli`, `tavus`, `heygen`, and the two generic ones, `livekit_datastream` and `websocket`, which point at an avatar server you host yourself.

## How It Works

1. `ai_agent` runs the voice session, tool calls, and whiteboard work on your LLM provider.
2. When the session starts, the server invites the avatar provider into the plugNmeet room with a scoped participant token.
3. The provider joins as a media participant, renders the agent's audio as lip-synced video, and publishes audio and video to the room.
4. Barge-in carries through: when a participant interrupts, the agent stops speaking and the avatar follows.
5. When the session ends, the provider leaves the room.

Avatar providers receive room audio only, plus the state-based hint described in [Emotion Hint](#emotion-hint-tavus-and-livekit_datastream) that only `tavus` and `livekit_datastream` get. They never see your LLM credentials or your prompts.

## Supported Avatar Providers

| Provider key | Default endpoint | Default auth header | Configuration options |
| --- | --- | --- | --- |
| `beyond_presence` | `https://api.bey.dev` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `anam` | `https://api.anam.ai` | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |
| `simli` | `https://api.simli.ai` | `x-simli-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `tavus` | `https://tavusapi.com/v2` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `heygen` | `https://api.liveavatar.com/v1/sessions` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `livekit_datastream` | none, `endpoint` is required | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |
| `websocket` | none, `endpoint` is required | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |

- **`avatar_id`** selects the face or avatar on the provider account. Every provider needs one, and the session is refused without it.
- **`endpoint`** replaces the default base URL, for a gateway or a self-hosted avatar server. The two generic providers have no default and cannot start without it.
- **`auth_header`** carries the key when an endpoint expects a different header. `Authorization` sends `Authorization: Bearer <api_key>`; any other name sends `<header>: <api_key>`.

The default endpoints target each provider's public API. Check the `config_sample.yaml` of your server version before you point `endpoint` at a custom gateway. An override replaces the whole base URL, so it must keep the path that the provider appends its own routes to: Tavus adds its routes under `/v2` (`https://tavus-gateway.example.com/v2`) and HeyGen under `/v1/sessions` (`https://heygen-gateway.example.com/v1/sessions`).

Every avatar `endpoint`, whether it comes from `config.yaml` or from the room, must be an explicit public HTTPS or WSS URL: no embedded credentials, no query string, no fragment, a valid port, and a host that resolves to a public address. Private, loopback, and link-local targets are rejected. For `websocket`, a `wss://` endpoint is checked through its `https://` form, and a plain `ws://` endpoint is refused.

### Tavus `avatar_id` Forms

Tavus separates the look of an avatar from its PAL (the persona layer that carries behaviour and voice), and a single `avatar_id` can address either part or both:

- `face_id` — that face with the built-in default PAL. This is enough for a working avatar.
- `face_id/pal_id` — that face with a specific PAL.
- `/pal_id` — that PAL with its own default face.

A custom `pal_id` must already exist in your Tavus account.

### HeyGen

HeyGen runs in `LITE` mode: the plugNmeet agent keeps the LLM, the speech, and the tool calls, and HeyGen only renders the lip-sync of the audio it receives.

1. The server creates a session token at `<endpoint>/token` with the account API key in `x-api-key`, sending the `avatar_id` and the room the avatar must join.
2. It starts that session at `<endpoint>/start`, authenticated with the returned session token as `Authorization: Bearer <session_token>`, and receives the websocket address for the audio.
3. The agent streams its voice over that websocket while the avatar publishes video into the room.
4. At the end of the session the server reports the stop to `<endpoint>/stop`.

Because the default endpoint already ends in `/v1/sessions`, an override must keep that segment: `https://your-gateway.example.com/v1/sessions`. An `auth_header` override changes only the header that carries the API key on the token call.

HeyGen receives no emotion hint. Like every socket-based provider it is told when the agent is listening and when it is not, so the avatar knows when to stay quiet.

### Generic Avatar Servers (`livekit_datastream` and `websocket`)

These two providers do not talk to a vendor API. They start a session on an avatar server that you host, and the contract is small enough to implement in your own service. Both need `endpoint` and `avatar_id`. An `api_key` is still required even when your avatar server never checks it, and `auth_header` selects the header that carries it, `Authorization: Bearer <api_key>` by default.

`livekit_datastream` suits a LiveKit avatar worker (an `AvatarRunner`, such as TruGen):

- The server `POST`s JSON to `endpoint` with `avatar_id`, `livekit_url`, `livekit_token`, `livekit_room`, and `sample_rate` (`24000`).
- Your server answers with a session id in any of `session_id`, `id`, `conversation_id`, or `task_id`, optionally wrapped in `data`. An optional `sample_rate` of `16000` is honoured; anything else stays at `24 kHz`. An optional `end_url` is called with `{"session_id": "..."}` when the session ends.
- The worker joins the LiveKit room and reads the agent's voice from the **byte stream** addressed to it, so no socket is opened and the avatar needs no audio websocket.
- This provider receives the emotion hint described below.

`websocket` suits an avatar server that speaks the session socket protocol:

- `endpoint` may be the `wss://` socket itself, in which case the session config is sent as the first message `{"type": "session.init", ...}`, or an HTTPS endpoint that is `POST`ed the same JSON as above and answers with `ws_url`.
- The agent sends `agent.speak` with base64 mono 16-bit PCM (`24 kHz`, or `16 kHz` when your session asked for it), `agent.speak_end` at the end of an utterance, `agent.interrupt` on barge-in, `agent.start_listening` / `agent.stop_listening` as the agent state changes, and `session.keep_alive` when the socket has been idle for a minute.
- Your server reports `session.state_updated` with `state: "connected"` when its avatar is ready, and may report `agent.state_updated`, `agent.speak_ended`, `agent.speak_interrupted`, or `agent.audio_buffer_cleared`. The server waits up to 15 seconds for that state before it hands the session out; an endpoint that never reports it is not an error, and startup continues after the wait.

`websocket` receives no emotion hint: the agent state reaches it as the listening messages instead.

### Emotion Hint (Tavus and `livekit_datastream`)

The server sends `tavus` and `livekit_datastream` an automatic emotion hint as a LiveKit app message. The value follows the agent's state, not the speech: `happiness` while the agent state is `SPEAKING`, and `neutral` at all other times. Nothing is inferred from what the agent says or from participant audio. The hint is limited to those two values, it cannot be turned off, tuned, or extended from `config.yaml` or from the room `avatar` object, and the other providers render voice alone.

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
    tavus:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_TAVUS_API_KEY"
        options:
          avatar_id: "your-face-id/your-pal-id"
    heygen:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_HEYGEN_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    livekit_datastream:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_AVATAR_SERVER_KEY"
        options:
          endpoint: "https://avatar.example.com/v1/session"
          avatar_id: "your-avatar-id"
    websocket:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_AVATAR_SERVER_KEY"
        options:
          # the wss:// socket itself, or an https endpoint that answers with one
          endpoint: "wss://avatar.example.com/session"
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
| `options.avatar_provider` | string | Default avatar provider: `beyond_presence`, `anam`, `simli`, `tavus`, `heygen`, `livekit_datastream`, or `websocket`. Rooms can override it. |
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
- **Tavus `endpoint` without `/v2`.** Tavus routes live under the `/v2` base path, so a gateway override that drops that segment will not connect.
- **HeyGen `endpoint` without `/v1/sessions`.** The server appends `/token`, `/start`, and `/stop` to the base URL, so an override must keep the `/v1/sessions` segment.
- **Generic provider without `endpoint`.** `livekit_datastream` and `websocket` have no default server, so the endpoint must come from the room or from the account. Missing one is refused where the avatar configuration is resolved: a create request that enables the avatar is refused, and so is starting the agent on a room whose stored or account configuration still has none.
- **`ws://` or a private host as `endpoint`.** Only public HTTPS and WSS URLs are accepted. Plain `ws://`, embedded credentials, a query string, a fragment, and hosts that resolve into your internal network all fail the check.

## Related Pages

- [Server & Provider Setup](/docs/ai-agent/configuration): shared provider structure and pricing.
- [Developer & API Guide](/docs/ai-agent/developer-guide#avatar): every `avatar` field and request example.
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing): the `AI_AGENT_AVATAR_USAGE` payload.
- [Security Overview](/docs/security-overview): how BYOK secrets and E2EE interact with a media participant.
- [Google Gemini Provider Guide](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure): the voice side of the session.
