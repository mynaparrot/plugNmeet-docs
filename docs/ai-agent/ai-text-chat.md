---
title: "In-Meeting AI Text Chat: Moderator Copilot, AI Tutor & Content Tools"
description: "Reference for plugNmeet's AI text chat service: an agentic moderator copilot that runs room operations through MCP tools, a participant learning assistant, embedded AI in notepad, whiteboard and polls, conversation memory, and usage artifacts."
keywords: [ai text chat meeting, moderator ai copilot, agentic room management, ai tutor chat, ai whiteboard assistant, ai notepad assistant, ai poll generator, ai quiz generator, mcp room tools, in-meeting ai assistant, self-hosted ai chat, plugnmeet ai chat]
sidebar_label: AI Text Chat & Room Copilot
sidebar_position: 6
---

# In-Meeting AI Text Chat

The `ai_text_chat` service puts an assistant in the room's chat panel. It has two roles: a moderator copilot that executes room operations on request, and a participant assistant that answers questions, with smaller embedded helpers inside the Shared Notepad, Whiteboard, and Polls.

## Two Roles in One Service

### 1. Agentic Moderator Copilot

When an administrator or moderator talks to AI Text Chat from the chat panel, requests carry `request_from: CHAT` and the server runs the model through `AITextChatStreamWithTools`. The moderator's assistant is connected to the MCP room tool registry, so it can act instead of instruct.

Actions that must happen in the moderator's browser, such as clicking a lock toggle or starting a recording dialog, are delegated to the administrator's connected client over NATS RPC. The moderator sees the result in the room, and the assistant reports what it did.

Core AI Text Chat — the participant Q&A assistant and the embedded notepad, whiteboard, and poll helpers — is a stable production feature. MCP room-management tool calling belongs to the newer agentic expansion, so tool names, limits, and UI surfaces may still change.

### 2. Participant Learning & Meeting Assistant

Participants get a streaming text assistant with rolling conversation memory. Access is granted either to everyone (`is_allowed_everyone: true`) or to a list of users (`allowed_user_ids`). This is the same assistant a student uses to ask for an explanation, or an attendee uses to ask what was decided earlier in the call.

The same service also powers contextual helpers inside the **Shared Notepad**, **Whiteboard**, and **Polls**, described under Multi-Surface AI below.

## Agentic Moderator Capabilities

The moderator copilot's tools are grouped below. Every action is a normal platform operation; the assistant is a faster input method, not a bypass of permissions. If the moderator could not do it in the UI, the tool call fails.

### Insights & AI Service Controls

| Tool | What it does |
| --- | --- |
| `configure_speech_to_text` | Starts or reconfigures live transcription and caption translation, including spoken and target languages. |
| `configure_chat_translation` | Enables or disables public chat translation and sets allowed target languages. |
| `configure_meeting_summarization` | Starts summarization and can set a session prompt. |

Example prompts:

- *"Enable live transcription in English and Spanish."*
- *"Turn on chat translation for English, French, and Arabic."*
- *"Start meeting summarization. Focus on decisions and action items."*

### Participant & Room Operations

| Tool | What it does |
| --- | --- |
| `manage_participants` | Mute, unmute, or remove participants, and manage participant-level permissions. |
| `set_workspace_lock` | Lock or unlock room features for participants, for example chat, screen share, or webcams. |
| `manage_recording` | Start or stop cloud recording. |
| `manage_countdown_timer` | Set a countdown timer from 10 seconds to 2 hours. |
| `manage_external_media` | Control playback of external media, such as a shared video. |
| `get_room_info` | Read live room state: participants, active features, and current settings. |

Example prompts:

- *"Mute all participants."*
- *"Lock the chat for the next ten minutes."*
- *"Start recording, then set a 5 minute timer."*
- *"Who is in the room right now?"*

### Breakout Rooms

| Tool | What it does |
| --- | --- |
| `create_breakout_rooms` | Create breakout rooms, including assignment of participants. |
| `manage_breakout_rooms` | Open, join, extend, or end breakout rooms. |

Example prompts:

- *"Create four breakout rooms and split the class evenly."*
- *"Give each group five more minutes, then close the rooms."*

### Polls & Interactive Quizzes

| Tool | What it does |
| --- | --- |
| `create_poll` | Create a poll with options. |
| `close_poll` | Close an active poll. |
| `get_poll_results` | Read current results. |
| `draft_quiz` | Generate a multi-question quiz as a **draft** in the chat. |
| `publish_quiz` | Publish a reviewed draft as a live quiz. |

Quizzes use a draft-then-publish workflow: `draft_quiz` never publishes by itself. The moderator reviews the questions in the chat, then calls `publish_quiz`. A quiz cannot go live without moderator sign-off.

Example prompts:

- *"Create a poll asking which topic to review next."*
- *"Draft five questions on photosynthesis. Don't publish yet."*
- *"Publish the quiz."*

### Whiteboard & Shared Notepad Co-Creation

| Tool | What it does |
| --- | --- |
| `notepad_read` | Read the shared notepad content. |
| `notepad_write` | Write structured notes into the notepad. |
| `whiteboard_write_content` | Add text content to the board. |
| `whiteboard_draw_shapes` | Draw shapes and layout elements. |
| `whiteboard_draw_freehand_svg` | Draw freehand strokes from SVG paths. |
| `whiteboard_draw_diagram` | Draw structured diagrams. |
| `whiteboard_laser_point` | Point at a location on the board. |
| `whiteboard_manage_board` | Manage board pages. |
| `whiteboard_capture_snapshot` | Capture the current board state as a snapshot. |

Example prompts:

- *"Write the agenda into the shared notepad."*
- *"Draw the request flow as a diagram."*
- *"Point at the second equation."*

### External Knowledge & MCP Servers

| Tool | What it does |
| --- | --- |
| `fetch_external_knowledge` | Fetch an approved external reference URL. |
| `mcp_servers` | Query up to 2 external read-only MCP servers configured on `ai_text_chat_features`. |

The external MCP configuration shares its shape and limits with the voice agent: HTTPS URLs, optional headers, an `allowed_tools` allow-list, and read-only tools only. The budget is shared, so a room cannot double its external tool surface by enabling both services.

## Multi-Surface AI & Granular Kill Switches

AI Text Chat serves four surfaces, distinguished by the `request_from` field:

| `request_from` | Where it comes from | Behavior |
| --- | --- | --- |
| `CHAT` | The chat panel | Streaming answer with conversation memory. Moderator requests include the MCP room tools. |
| `NOTEPAD` | Shared Notepad helper | Fast, stateless ephemeral turn. No history, no tool execution. |
| `WHITEBOARD` | Whiteboard helper | Fast, stateless ephemeral turn. No history, no tool execution. |
| `POLL` | Poll creator helper | Fast, stateless ephemeral turn. No history, no tool execution. |

Ephemeral surface turns are deliberately limited: they receive the current surface context and the user's instruction, and return content for that surface. They do not read the conversation, do not write to it, and cannot call tools. That keeps token cost low and prevents a notepad prompt from triggering a room operation.

During exams or assessments, a moderator can disable AI per surface without turning the whole service off:

| Runtime field | Effect |
| --- | --- |
| `is_enabled` | Master switch for AI text chat in the room. |
| `is_allowed_everyone` | Whether every participant may use the chat assistant. |
| `allowed_user_ids` | Explicit list of participants allowed to use it. |
| `is_notepad_ai_disabled` | Disables AI in the Shared Notepad only. |
| `is_whiteboard_ai_disabled` | Disables AI in the Whiteboard only. |
| `is_poll_ai_disabled` | Disables AI in the Poll creator only. |

### 1-on-1 Voice AI Agent Bridge

In a 1-on-1 AI Agent room (`session_mode: "1on1"`), text messages sent from `CHAT` are routed to the live voice agent when `ai_agent_features.allow_chat_message: true`. The learner types; the voice agent receives the text and replies in the session, with its normal voice and whiteboard behavior.

This is the fallback for students or visitors without a working microphone: they can still hold the session, hear the agent, and see what it draws. The typed message is treated as one normal turn in the voice session, so the agent's reply is spoken and drawn in that session instead of arriving in a separate chat thread.

## Conversation Memory & Rolling Summarization

Conversation context is kept in Redis per user:

- The last `context_window` turns are kept verbatim. The default is `5`, set by `insights.services.ai_text_chat.options.context_window`.
- Earlier turns are compressed into a rolling summary produced by `summarize_model` through the internal `CheckAndSummarize` routine.
- The prompt sent to `chat_model` is the rolling summary plus the recent turns.

This keeps prompt token cost predictable in long sessions. A two-hour class does not send the whole history on every message, and the model still sees what happened at the start.

Memory is scoped to one user in one room. It is not shared between participants, and it does not carry into a future session.

## Room Creation & Runtime Configuration

```json
{
  "room_id": "training-room",
  "metadata": {
    "room_title": "New hire training",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_features": {
          "is_allow": true,
          "ai_text_chat_features": {
            "is_allow": true,
            "mcp_servers": {
              "internal-docs": {
                "url": "https://mcp.example.com/mcp",
                "headers": { "Authorization": "Bearer TOKEN" },
                "allowed_tools": ["search_docs"],
                "scope": "read"
              }
            }
          }
        }
      }
    }
  }
}
```

`ai_text_chat_features` at room creation only enables the service and, optionally, external MCP servers. The rest is decided at runtime by a moderator (`is_enabled`, `is_allowed_everyone`, `allowed_user_ids`, and the three per-surface kill switches above). See [`/room/create` insights features](/docs/api/room/create#insights-features) for the parent object.

## Usage Artifacts & Billing

| Artifact | Type | Payload |
| --- | --- | --- |
| `AI_TEXT_CHAT_INTERACTION_USAGE` | `8` | `token_usage` for `chat_model`: `prompt_tokens`, `completion_tokens`, `total_tokens`, `estimated_cost`. |
| `AI_TEXT_CHAT_SUMMARIZATION_USAGE` | `9` | `token_usage` for the background context-window summarization, priced against `summarize_model`. |

Both are metadata records, not downloadable files, and both are delivered through the [`artifact_created`](/docs/others/webhooks#artifact-created) webhook at room end. Usage from breakout rooms is attributed to the parent room.

Pricing comes from `insights.services.ai_text_chat.pricing`; see [Server & Provider Setup](/docs/ai-agent/configuration) for the token rates and [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing) for the full artifact reference.

`ai_text_chat` runs on Google Gemini or on any OpenAI-compatible endpoint, including a local vLLM, Ollama, or LiteLLM server. The model must support streaming responses and function calling, because that is how the moderator copilot reaches room tools. Per-provider options are in the [Google Gemini](/docs/ai-agent/providers/google) and [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai) guides; on Azure, Azure OpenAI is configured through the [Microsoft Azure guide](/docs/ai-agent/providers/azure).

## Related Pages

- [Overview & Insights Framework](/docs/ai-agent/overview)
- [Agent Capabilities & Guardrails](/docs/ai-agent/tools-and-capabilities): the voice agent's tool set and why it never receives room-admin tools.
- [Server & Provider Setup](/docs/ai-agent/configuration): `ai_text_chat` models, `context_window`, and token pricing.
- Provider guides: [Google Gemini](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure).
- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation)
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization)
- [Developer & API Guide](/docs/ai-agent/developer-guide): runtime `/api/insights/*` endpoints.
- [`/room/create` insights features](/docs/api/room/create#insights-features)
