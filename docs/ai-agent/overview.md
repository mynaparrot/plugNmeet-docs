---
title: "Autonomous AI Agent for Live Video Workspaces: Overview & Concepts"
description: "Learn how the plugNmeet AI Agent works as a voice-first, whiteboard-aware assistant inside a live WebRTC room for virtual teaching, interactive product demos, and technical onboarding."
keywords: [ai agent, agentic ai, ai tutor, virtual teacher, interactive product demo, ai whiteboard, voice ai, webrtc ai, self-hosted ai assistant, plugnmeet ai, sales enablement, customer onboarding]
sidebar_label: Overview & Concepts
sidebar_position: 1
---

# Autonomous AI Agent for Live Video Workspaces

The plugNmeet AI Agent is a **voice-first, agentic assistant** that joins a live video room as a participant. It talks with people in real time, reads and draws on the shared whiteboard, writes into the shared notepad, runs quizzes and polls, and then leaves a structured summary behind. It is built for teaching, guided product demos, and onboarding, where a conversation needs to be backed by visual work.

:::info Under Active Development
**Live transcription (STT), translation, speech synthesis (TTS), AI Text Chat, and meeting summarization are stable production features.** Only the Voice AI Agent (`ai_agent`) and the newer agentic MCP tool-calling capabilities are under active development: field names, defaults, and behavior may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the agent is finalized and released. Until then, the agent is configured through the plugNmeet API.
:::

## The Insights & Agentic AI Framework

The AI Agent is one of six services in the server-side **Insights** platform. All six are configured in `config.yaml` under `insights`, enabled per room in `insights_features`, and billed through the same artifact pipeline. The agent is the only one that speaks; the others listen, translate, write, and take notes on what happened.

| Service | Primary use case | Where it runs | Guide |
| --- | --- | --- | --- |
| `transcription` | Real-time speech-to-text from allowed speakers, delivered as live caption chunks | Hidden `RoomAgent` subscribing to microphone tracks | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `translation` | Live caption translation into several languages, plus on-demand public chat translation | Stateless per-chunk and per-message calls | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `speech-synthesis` | Spoken translation: translated captions synthesized as audio tracks in the room | One TTS worker per allowed target language | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `meeting_summarizing` | Post-meeting written summary from a mixed audio capture, with a custom prompt | Batched job after the room ends | [AI Meeting Summarization](/docs/ai-agent/meeting-summarization) |
| `ai_text_chat` | Moderator copilot with room tools, participant Q&A, and embedded notepad/whiteboard/poll helpers | Streaming text, Redis-backed memory | [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat) |
| `ai_agent` | Voice-first 1-on-1 tutor, demo presenter, and onboarding guide on a shared whiteboard | Real-time voice session in a breakout room | [Developer & API Guide](/docs/ai-agent/developer-guide) |

Two properties hold across the framework:

- **Per-service provider mapping.** Each service points at its own provider account and models, so Azure can handle speech while Gemini handles summarization. Google Gemini and OpenAI (including OpenAI-compatible and self-hosted servers) implement all six services; native Azure implements the three speech services, with Azure OpenAI covering the rest. See the [provider capability matrix](/docs/ai-agent/configuration#provider-capability-matrix) and the [Google Gemini](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), and [Microsoft Azure](/docs/ai-agent/providers/azure) guides.
- **One artifact model.** Files and usage records are delivered through the same [`artifact_created`](/docs/others/webhooks#artifact-created) webhook, with usage attributed to the parent room.

## Who It Is For

| Audience | What the AI Agent gives them |
| --- | --- |
| **Teachers, coaches, and trainers** | A patient 1-on-1 tutor for every learner, with a whiteboard for worked examples and quizzes for checking understanding. |
| **School administrators** | Scheduled, self-service study rooms and post-session mastery reports, without adding staff hours. |
| **SaaS founders and product marketers** | A 24/7 interactive demo that walks prospects through slides, diagrams, and live product answers. |
| **Sales and support teams** | Discovery questions, qualification notes, and a structured hand-off summary for the CRM. |
| **Developers and integrators** | A documented REST and protobuf API, per-room provider settings, MCP tool connections, and webhook-driven artifacts. |

## Where Use Cases Fit

### 1. Education & Virtual Teacher

Each learner gets a private 1-on-1 breakout room with the agent. The agent explains a concept, draws a worked example on the whiteboard, asks the learner to answer, and launches a quick quiz. A teacher can run the whole class this way, assign a roster of students, or open a self-service study room that learners use at any time.

See the [Education & Virtual Teacher guide](/docs/ai-agent/educator-guide).

### 2. Interactive Product Demos & Sales Enablement

A prospect opens an embedded link, and the agent presents an uploaded PDF or Office deck page by page. It uses a laser pointer to highlight areas, sketches a custom architecture diagram with Mermaid, answers questions with approved product documentation, and runs discovery polls to qualify the lead. The session summary is sent to the sales team through a webhook.

See [Product Demos, Sales & Business](/docs/ai-agent/business-and-use-cases).

### 3. Technical Documentation & Customer Onboarding

For onboarding engineers and support teams, the agent writes configuration checklists into the Shared Notepad, sketches data flows on the whiteboard, and can read approved live documentation pages over HTTPS. The customer leaves with the checklist and diagram that were built during the call.

See [Product Demos, Sales & Business](/docs/ai-agent/business-and-use-cases).

## How It Differs From Other Tools

| Tool type | What it does | What the plugNmeet AI Agent adds |
| --- | --- | --- |
| **Meeting transcription bot** | Listens passively and produces a transcript after the meeting. | The agent speaks, responds, and acts during the session. It is a participant, not an observer. |
| **Text chatbot** | Answers typed questions in a chat window. | The agent works in voice and on shared visual workspaces, with barge-in (you can interrupt it mid-sentence). |
| **Screen-recording or webcam AI** | Analyzes faces, webcams, or screens. | The agent looks **only** at the whiteboard and shared notepad. It does not watch webcams or screen shares. |
| **Generic voice assistant** | Works from a general-purpose prompt. | A server-owned topic boundary, a locked platform instruction header, and scope locks keep the agent on the lesson or demo. |

## What the AI Agent CAN and CANNOT Do

| Area | Can do | Cannot do |
| --- | --- | --- |
| **Conversation** | Hold a live spoken conversation, respond to barge-in, speak in a configured language and voice rate, and stay within the host-defined topic. | Discuss topics outside the configured topic boundary, or continue after its session ends or budget is exhausted. |
| **Vision** | See the **whiteboard** and the **shared notepad** as image snapshots and a structured scene description. | See webcams, screen shares, or any other video. The agent never captures camera or screen content. |
| **Whiteboard** | Draw shapes, add text, draw freehand SVG, render Mermaid diagrams, use a laser pointer, switch pages or Office/PDF files, zoom, and clear the board. Undo its own last 20 actions. | Erase or change work that participants made, beyond the agent's own undoable actions. |
| **Shared notepad** | Read the notepad and write block-level updates. Opens the notepad automatically when it writes. | Edit the notepad when the host has disabled notepad writes. |
| **Assessment** | Create quizzes and polls, close polls, read results, and react immediately to each answer. | Grade work that was never placed on the board, notepad, or in conversation. |
| **Knowledge** | Fetch approved HTTPS pages (when enabled), and call read-only tools on up to two external MCP servers. | Browse the open web, call write-capable external tools, or reach private or internal network addresses. |
| **Memory across sessions** | Carry forward a structured summary and next-session prompt into a new session when the host passes them in. | Remember a learner or prospect automatically. Continuity happens only through the summaries your system passes back in. |
| **Data & cost** | Produce a session summary and per-role usage artifacts attributed to the parent room. | Bill your platform for usage when you bring your own provider key (BYOK). |

## How a Session Works

1. **Enable.** The host creates a room with `insights_features.ai_agent_features`, or a moderator enables the agent for a breakout room. The host sets the topic, system prompt, and session mode.
2. **Route.** In automatic per-user modes, each learner or visitor is routed to an isolated 1-on-1 breakout room named `<Name> (AI Session)`. The main room acts as a lobby.
3. **Converse and work.** The agent speaks with the participant and uses the whiteboard, notepad, quizzes, and polls. Vision updates are sent when the board or notepad changes.
4. **Guard.** Guardrails keep the agent on topic. Repeated off-topic requests lock side-effect tools for the session.
5. **Close.** When the session ends, the server writes an `AI_AGENT_SESSION_SUMMARY` artifact and an `AI_AGENT_USAGE` artifact to the parent room. Your backend receives an `artifact_created` webhook.
6. **Continue.** Your system fetches the summary and passes it into the next session as `user_metadata.previous_session_context`.

## Where to Go Next

| If you want to… | Start here |
| --- | --- |
| Understand the six services and how they fit together | [Overview & Concepts](/docs/ai-agent/overview) (this page) |
| Run 1-on-1 AI tutoring in a class | [Education & Virtual Teacher](/docs/ai-agent/educator-guide) |
| Build an interactive demo or onboarding flow | [Product Demos, Sales & Business](/docs/ai-agent/business-and-use-cases) |
| Know what the agent can see, call, and refuse | [Agent Capabilities & Guardrails](/docs/ai-agent/tools-and-capabilities) |
| Integrate the API, webhooks, and in-room endpoints | [Developer & API Guide](/docs/ai-agent/developer-guide) |
| Give moderators a copilot and participants an AI assistant | [AI Text Chat & Room Copilot](/docs/ai-agent/ai-text-chat) |
| Generate post-meeting notes from audio | [AI Meeting Summarization](/docs/ai-agent/meeting-summarization) |
| Add live captions, translation, or spoken translation | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| Configure providers, models, and pricing | [Server & Provider Setup](/docs/ai-agent/configuration) |
| Deploy on a specific cloud or local stack | [Google Gemini](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure) |
| Read summary JSON, usage fields, and cost rules | [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing) |

## Related Reading

- [How to Add AI Meeting Assistant Features](/blog/how-to-add-ai-meeting-assistant-features)
- [How AI Transforms the Virtual Classroom](/blog/ai-transforms-virtual-classroom)
- [Self-Hosted Video Conferencing with OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet)
- [Security Overview](/docs/security-overview): how AI data flows and E2EE interact.
