---
title: "AI Agent API Developer Guide: ai_agent_features Reference & Examples"
description: "Developer reference for the plugNmeet AI Agent API, covering every ai_agent_features field, JSON examples for NORMAL_ROOM, CONTROLLED_USERS and OPEN_PER_USER rooms, BYOK and MCP configuration, breakout room creation, multi-session continuity, and in-room protobuf endpoints."
keywords: [plugnmeet api, ai_agent_features, create room api, ai agent api, breakout room ai, mcp servers config, byok ai provider api, artifact_created webhook, previous_session_context, protobuf api, aiAgent start stop status]
sidebar_label: Developer & API Guide
sidebar_position: 6
---

# AI Agent Developer & API Guide

This guide is the technical reference for integrating the plugNmeet AI Agent. It covers the server-to-server room creation API, the in-room protobuf endpoints used by the browser client, and the webhook flow for multi-session continuity.

:::info Under Active Development
The AI Agent engine and its APIs are under active development. Field names, validation rules, and endpoint behavior may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the feature is finalized and released. Until then, integrate through the API described below.
:::

## Where the Configuration Lives

The AI Agent is configured in the room's `insights_features` object, under `ai_agent_features`. The object sits inside `metadata.room_features` when you call [`/auth/room/create`](/docs/api/room/create).

```text
metadata
└── room_features
    └── insights_features
        ├── is_allow
        └── ai_agent_features     ← this guide
            ├── auto_session_config
            ├── mcp_servers
            └── custom_provider   (BYOK)
```

Before any room can use the agent, your server must have an `insights.services.ai_agent` entry in `config.yaml`, unless the room provides its own `custom_provider`. See [Server & Provider Setup](/docs/ai-agent/configuration).

## `ai_agent_features` Field Reference

The table lists all 32 fields of `InsightsAIAgentFeatures` in `plugnmeet_create_room_insights.proto`, plus the nested `AIAgentAutoSessionConfig`, `ExternalMCPServerConfig`, and `InsightsAIAgentCustomProvider` messages.

<div className="pnm-fit-table pnm-fit-table--fields">

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `is_allow` | bool | Yes | Master switch for the AI Agent in this room. |
| `session_mode` | enum | Yes | `AI_AGENT_SESSION_MODE_NORMAL_ROOM` (0), `AI_AGENT_SESSION_MODE_CONTROLLED_USERS` (1), or `AI_AGENT_SESSION_MODE_OPEN_PER_USER` (2). |
| `auto_session_config` | object | Depends on mode | Routing settings for automatic 1-on-1 sessions. See [`auto_session_config`](#auto_session_config). |
| `agent_display_name` | string | No | Name shown for the agent. Default: `AI Assistant`. |
| `system_prompt` | string | Yes, when `is_allow` | Host instructions for the agent's persona and behavior. |
| `previous_session_context` | string | No | Context from a previous session, usually the summary JSON or its `previous_session_context_prompt`. |
| `topic` | string | Yes, when `is_allow` | The lesson, demo, or training topic the agent stays within. |
| `allowed_subtopics` | string[] | No | Up to 64 subtopics that are in scope. |
| `forbidden_topics` | string[] | No | Up to 32 topics the agent must decline. |
| `strict_topic_enforcement` | bool | No | Decline out-of-topic requests. Default: `true`. |
| `topic_anchor_interval_turns` | uint32 | No | Re-inject the topic anchor every N turns. Default `6`, range `3` to `12`. |
| `spoken_lang` | string (BCP-47) | No | The learner's or visitor's language, for example `en-US`. |
| `target_lang` | string (BCP-47) | No | Language being learned. Leave empty for non-language topics. |
| `instruction_lang` | string (BCP-47) | No | Language the agent explains in. If empty, `spoken_lang` is used. |
| `voice` | string | No | Provider voice ID. Must be on the server's allow-list. |
| `speaking_rate` | float | No | Speech speed, `0.5` to `2.0`. Default `1.0`. |
| `allow_whiteboard_write` | bool | No | Allow the agent to draw on the whiteboard. Default `true`. |
| `allow_vision_capture` | bool | No | Allow the agent to receive whiteboard and notepad snapshots. Default `true`. |
| `vision_debounce_ms` | uint32 | No | Snapshot debounce. Default `1200`, maximum `5000`. |
| `vision_max_edge_px` | uint32 | No | Longest snapshot edge. Default `1024`, range `512` to `1600`. |
| `allow_polls` | bool | No | Allow quizzes and polls. Default `true`. |
| `allow_chat_message` | bool | No | Allow the agent to post in the AI chat. Default `true`. |
| `allow_notepad_write` | bool | No | Allow the agent to write to the shared notepad. Default `true`. |
| `allow_web_fetch` | bool | No | Allow the agent to fetch approved HTTPS pages. Default `false`. |
| `allowed_knowledge_urls` | string[] | Recommended when `allow_web_fetch` is `true` | Up to 32 HTTPS URL prefixes the agent may fetch. |
| `knowledge_cache_ttl_seconds` | uint32 | No | Cache time for fetched pages. Default `3600`, range `60` to `86400`. |
| `mcp_servers` | map&lt;string, ExternalMCPServerConfig&gt; | No | Up to 2 external MCP servers. See [External MCP Servers](#external-mcp-servers-mcp_servers). |
| `max_session_seconds` | uint32 | No | Session length cap, `60` to `7200`. Default `1800` when unset. |
| `max_audio_minutes` | uint32 | No | Audio budget per session, up to `240`. `0` uses the server default of `120`. |
| `is_enabled` | bool | Must be `false` | Internal runtime flag. The host cannot set it. |
| `active_session_id` | string | Must be empty | Internal runtime field. The host cannot set it. |
| `custom_provider` | object | No | Per-room BYOK provider. See [`custom_provider`](#custom_provider-byok). |

</div>

### `auto_session_config`

| Field | Type | Description |
| --- | --- | --- |
| `allowed_participant_ids` | string[] | Up to **32** participant IDs. Used in `CONTROLLED_USERS`. |
| `max_concurrent_sessions` | uint32 | Used in `OPEN_PER_USER`. The server caps this at **16**. |
| `auto_start_agent` | bool | Optional. Controls whether the agent starts automatically for routed sessions. |

### `ExternalMCPServerConfig`

| Field | Type | Description |
| --- | --- | --- |
| `url` | string | HTTPS endpoint, maximum 1024 characters. |
| `headers` | map&lt;string, string&gt; | Optional request headers, up to 16 pairs. Key max 128 characters, value max 2048. |
| `allowed_tools` | string[] | Up to **8** tool names. Only these tools are offered to the agent. |
| `scope` | string | Optional owner hint: `shared`, `text_chat`, or `ai_agent`. |

### `custom_provider` (BYOK)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `provider` | string | Yes | `google` or `openai`. |
| `api_key` | string | Yes | Provider API key, 1 to 512 characters. Never broadcast. |
| `endpoint` | string | No | HTTPS base URL for a gateway or self-hosted server, up to 512 characters. |
| `auth_header` | string | No | Header name for the key, up to 128 characters. |
| `realtime_model` | string | No | Overrides the realtime model. |
| `delegation_model` | string | No | Overrides the delegation model. |
| `summarize_model` | string | No | Overrides the summary model. |

## Session Modes

| Mode | Who starts a session | Routing | Webcams & screen share | Typical use |
| --- | --- | --- | --- | --- |
| `NORMAL_ROOM` | A moderator, from the Breakout Rooms panel | Manual 1-on-1 breakout rooms | Unchanged | Teacher-led practice, sales-led demos |
| `CONTROLLED_USERS` | Automatic, for listed participants | Each allowed participant gets `<Name> (AI Session)` | Disabled room-wide | Assigned rosters, onboarding groups |
| `OPEN_PER_USER` | Automatic, for any visitor | Each visitor gets an isolated session, up to `max_concurrent_sessions` | Disabled room-wide | 24/7 study rooms, product demo links |

In the automatic modes, the main room works as a lobby. Participants who are not authorized wait in the main room.

## Request Examples

All examples post to `/auth/room/create`. They use the standard API authentication headers described in the [Create Room API](/docs/api/room/create). Only the relevant parts are shown; other metadata fields are optional.

### 1. `NORMAL_ROOM`: Teacher-Led Breakouts

```json
{
  "room_id": "class-algebra-01",
  "metadata": {
    "room_title": "Algebra Class",
    "room_features": {
      "allow_webcams": true,
      "allow_screen_share": true,
      "breakout_room_features": {
        "is_allow": true
      },
      "insights_features": {
        "is_allow": true,
        "ai_features": {
          "is_allow": true
        },
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_NORMAL_ROOM",
          "agent_display_name": "Math Tutor",
          "system_prompt": "You are a patient algebra tutor. Work step by step on the whiteboard and ask the student to predict each step.",
          "topic": "Linear equations",
          "allowed_subtopics": ["one-variable equations", "word problems"],
          "forbidden_topics": ["homework answers for graded tests"],
          "strict_topic_enforcement": true,
          "topic_anchor_interval_turns": 6,
          "spoken_lang": "en-US",
          "instruction_lang": "en-US",
          "speaking_rate": 1.0,
          "allow_whiteboard_write": true,
          "allow_polls": true,
          "allow_notepad_write": true,
          "allow_web_fetch": false,
          "max_session_seconds": 1800,
          "max_audio_minutes": 60
        }
      }
    }
  }
}
```

### 2. `CONTROLLED_USERS`: Assigned Student Roster

```json
{
  "room_id": "tutoring-group-7",
  "metadata": {
    "room_title": "Tutoring Group 7",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_CONTROLLED_USERS",
          "auto_session_config": {
            "allowed_participant_ids": ["student-101", "student-102", "student-103"],
            "auto_start_agent": true
          },
          "agent_display_name": "Study Coach",
          "system_prompt": "You are a study coach for high-school chemistry. Ask one question at a time and check each answer with a short quiz.",
          "topic": "Chemical bonding",
          "allowed_subtopics": ["ionic bonds", "covalent bonds", "electronegativity"],
          "forbidden_topics": ["exam cheating", "personal advice"],
          "strict_topic_enforcement": true,
          "topic_anchor_interval_turns": 6,
          "allow_polls": true,
          "max_session_seconds": 1800
        }
      }
    }
  }
}
```

`allowed_participant_ids` accepts up to 32 IDs. Each ID must match the `user_id` your application uses when it joins a participant.

### 3. `OPEN_PER_USER`: 24/7 Self-Service Study or Demo Room

```json
{
  "room_id": "study-room-spanish",
  "metadata": {
    "room_title": "Spanish Practice Room",
    "room_features": {
      "allow_webcams": false,
      "allow_screen_share": false,
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_OPEN_PER_USER",
          "auto_session_config": {
            "max_concurrent_sessions": 8,
            "auto_start_agent": true
          },
          "agent_display_name": "Lucía",
          "system_prompt": "You are a friendly Spanish speaking coach for adult beginners. Speak mostly in simple Spanish and explain grammar in English when needed.",
          "topic": "Everyday Spanish conversation",
          "allowed_subtopics": ["greetings", "ordering food", "travel vocabulary"],
          "forbidden_topics": ["politics", "medical advice"],
          "spoken_lang": "en-US",
          "target_lang": "es-ES",
          "instruction_lang": "en-US",
          "speaking_rate": 0.9,
          "voice": "YOUR_PROVIDER_VOICE_ID",
          "max_session_seconds": 1200,
          "max_audio_minutes": 30
        }
      }
    }
  }
}
```

`max_concurrent_sessions` is capped at **16** by the server, even if you send a higher number. Set `voice` to a voice ID from your provider's allow-list, or omit it to use the server's `default_voice`.

### 4. With BYOK (`custom_provider`)

This example uses the host's own OpenAI-compatible gateway for a single room. The key is removed from room metadata before broadcast and stored only in Redis.

```json
{
  "room_id": "demo-acme-visitor-room",
  "metadata": {
    "room_title": "Acme Product Demo",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_OPEN_PER_USER",
          "auto_session_config": {
            "max_concurrent_sessions": 4
          },
          "system_prompt": "You are a visual sales engineer for Acme Analytics. Use the uploaded deck and keep answers short.",
          "topic": "Acme Analytics product demo",
          "forbidden_topics": ["pricing negotiation"],
          "max_session_seconds": 1800,
          "custom_provider": {
            "provider": "openai",
            "api_key": "sk-YOUR-ROOM-SCOPED-KEY",
            "endpoint": "https://gateway.example.com/v1",
            "auth_header": "Authorization",
            "realtime_model": "gpt-realtime-2.1-mini",
            "delegation_model": "gpt-5.4-mini",
            "summarize_model": "gpt-5.4-mini"
          }
        }
      }
    }
  }
}
```

If `custom_provider` is set, the server does not need an `ai_agent` service entry in `config.yaml`. Models you omit fall back to the server defaults for the chosen provider.

### 5. With External MCP Servers (`mcp_servers`)

```json
{
  "room_id": "onboarding-acme-001",
  "metadata": {
    "room_title": "Acme API Onboarding",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_NORMAL_ROOM",
          "system_prompt": "You are a technical onboarding assistant for the Acme API. Check the checklist before each step.",
          "topic": "Acme API authentication and webhooks",
          "allow_web_fetch": true,
          "allowed_knowledge_urls": ["https://docs.acme.example/api/"],
          "knowledge_cache_ttl_seconds": 3600,
          "mcp_servers": {
            "acme-docs": {
              "url": "https://mcp.acme.example/mcp",
              "allowed_tools": ["search_docs", "read_doc"],
              "scope": "ai_agent"
            }
          }
        }
      }
    }
  }
}
```

## Breakout Room AI Sessions

A moderator can start a 1-on-1 AI session inside a breakout room. Use `/api/breakoutRoom/create` with these fields from `CreateBreakoutRoomsReq`:

| Field | Type | Description |
| --- | --- | --- |
| `enable_ai_agent` | bool | Creates the breakout rooms with an AI agent session attached. |
| `ai_agent_context` | string | Optional room-level context for the agent, up to 2000 characters. |

Each breakout room also carries its own `enable_ai_agent`, `ai_agent_context` (up to 2000 characters), and `ai_agent_joined` flags. The `ai_agent_joined` flag tells the moderator's AI Sessions panel whether an agent has joined that room.

```json
{
  "room_id": "class-algebra-01",
  "requested_user_id": "teacher-1",
  "duration": 15,
  "enable_ai_agent": true,
  "ai_agent_context": "Student is practising two-step equations. Start with the warm-up from last session.",
  "allow_return_to_main_room": true,
  "rooms": [
    { "title": "Ana", "users": [{ "id": "student-ana" }] },
    { "title": "Ben", "users": [{ "id": "student-ben" }] }
  ]
}
```

Child breakout rooms inherit the parent room's BYOK provider configuration, so the same key and models apply to every session.

## External Knowledge & External MCP Security

External access is the highest-risk part of the agent's configuration. The rules below are enforced by the server.

### External Knowledge (`allow_web_fetch`)

- Disabled by default. Set `allow_web_fetch: true` only when you need it.
- **HTTPS only.** Plain `http://` URLs are refused.
- **Allow-list required.** The agent may fetch only URLs that start with an entry in `allowed_knowledge_urls` (up to 32 prefixes). Use a trailing path, such as `https://docs.example.com/api/`, to limit scope.
- **Cached.** Fetched pages are cached for `knowledge_cache_ttl_seconds`, which limits repeated requests.
- **Content is untrusted.** Fetched text is wrapped as data. It cannot change the agent's rules.

### External MCP Servers (`mcp_servers`)

- **Maximum 2 servers per room.** The limit applies across `shared`, `ai_agent`, and `text_chat` scopes.
- **Maximum 8 allowed tools per server.** Tools not listed in `allowed_tools` are never offered to the agent.
- **Read-only policy.** The server enforces a strictly read-only tool policy. Tools that write, delete, or send data are not exposed, even if listed. Design your MCP server so that its read tools are the only ones you expose.
- **HTTPS on port 443 only.** Other schemes and ports are refused.
- **SSRF protection.** Connections are checked at dial time. Only globally routable addresses are allowed, so connections to private, loopback, link-local, or otherwise non-global addresses are refused.
- **Headers are secrets.** Put API tokens in `headers`. They are stored server-side and not broadcast to participants.

:::caution Do Not Point MCP at Internal Services
Even with SSRF protection, connect MCP servers only to services you intend to expose to the AI agent and its visitors. Use a dedicated read-only MCP endpoint, not your internal admin API.
:::

## Multi-Session Continuity Flow

Continuity lets a returning learner or prospect pick up where they left off. The flow has four steps:

1. **Session ends.** The server writes an `AI_AGENT_SESSION_SUMMARY` artifact for the parent room and sends an `artifact_created` webhook. See [Webhooks](/docs/others/webhooks#artifact-created).
2. **Your backend fetches the artifact.** Call [`/auth/artifact/fetch`](/docs/api/artifact/fetch) with `type: "AI_AGENT_SESSION_SUMMARY"` (or `11`) and the room ID.
3. **Your backend prepares context.** Either pass the summary JSON, or use its `continuation.previous_session_context_prompt` value, which is a short prompt written for this purpose.
4. **Next session starts.** Send `previous_session_context` with the next `/auth/room/create` request, or with the `/api/aiAgent/start` request.

```json
{
  "room_id": "study-room-spanish",
  "metadata": {
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_OPEN_PER_USER",
          "previous_session_context": "Last session: the learner practised greetings and ordering food. Struggled with the subjunctive. Next focus: travel vocabulary.",
          "topic": "Everyday Spanish conversation"
        }
      }
    }
  }
}
```

Per-user continuity works best with `OPEN_PER_USER` and `CONTROLLED_USERS`, where your backend knows the learner's identity. Use the `user_info.ex_user_id` field from the summary to match the learner to your own records.

## In-Room Endpoints (`/api/aiAgent/*`)

The browser client controls the agent through these endpoints. They are authenticated with the participant's room JWT, not with the server API key. Requests and responses use **protobuf** (`application/x-protobuf`), not JSON.

<div className="pnm-fit-table pnm-fit-table--endpoints">

| Endpoint | Method | Request message | Who may call it | Purpose |
| --- | --- | --- | --- | --- |
| `/api/aiAgent/start` | POST | `AIAgentStartReq` | Room admin only | Starts the agent. Optionally overrides `system_prompt` and `previous_session_context`. |
| `/api/aiAgent/stop` | POST | `AIAgentStopReq` | Admin, current delegate, or pre-authorized participant | Stops the session. Optional `reason`, for example `host_stopped`. |
| `/api/aiAgent/status` | GET or POST | `AIAgentStatusReq` | Any participant in the room | Returns `AIAgentStatusRes` with the current `AIAgentStateMsg`. |
| `/api/aiAgent/pause` | POST | `AIAgentPauseReq` | Admin, delegate, or pre-authorized participant | Pauses the agent. |
| `/api/aiAgent/resume` | POST | `AIAgentResumeReq` | Admin, delegate, or pre-authorized participant | Resumes a paused agent. |
| `/api/aiAgent/sendContext` | POST | `AIAgentSendContextReq` | Admin, delegate, or pre-authorized participant | Injects external context, such as a timer event or LMS data. `source` can be `lms` or `timer`. |
| `/api/aiAgent/redelegate` | POST | `AIAgentRedelegateReq` | Admin, delegate, or pre-authorized participant | Moves control to another participant. An empty `target_user_id` lets the server choose. |

</div>

Responses for start, stop, status, and the other control endpoints use the protobuf `AIAgentStatusRes` message, which has `status`, `msg`, and an optional `state`.

### Runtime States

`AIAgentStateMsg.state` reports one of these runtime states: `CONNECTING`, `LISTENING`, `THINKING`, `SPEAKING`, `DRAWING`, `PAUSED`, `RECONNECTING`, and `STOPPED`.

### Example: Sending Context From an LMS Event

Build an `AIAgentSendContextReq` with your protobuf library (for example `protobufjs` or `plugnmeet-protocol-js`):

```text
AIAgentSendContextReq {
  text: "The student has just submitted quiz 3 with a score of 4 out of 5. Review the missed question."
  source: "lms"
}
```

Post the encoded bytes to `/api/aiAgent/sendContext` with the participant's room JWT in the `Authorization` header.

## Related Pages

- [Overview & Concepts](/docs/ai-agent/overview)
- [Server & Provider Setup](/docs/ai-agent/configuration)
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing)
- [Create Room API](/docs/api/room/create)
- [Fetch Artifacts API](/docs/api/artifact/fetch)
- [Webhooks](/docs/others/webhooks)
