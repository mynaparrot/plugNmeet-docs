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
The AI Agent engine and its APIs are under active development. Field names, defaults, and behavior may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the feature is finalized and released. Until then, the feature is configured through the plugNmeet API.
:::

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
6. **Continue.** Your system fetches the summary and passes it into the next session as `previous_session_context`.

## Explore the Guides

- [Education & Virtual Teacher](/docs/ai-agent/educator-guide): classroom workflows, prompt templates, and reading mastery reports.
- [Product Demos, Sales & Business](/docs/ai-agent/business-and-use-cases): demo, onboarding, coaching, and CRM hand-off workflows.
- [Capabilities, Vision & Guardrails](/docs/ai-agent/tools-and-capabilities): whiteboard vision, notepad, quizzes, timers, and safety layers.
- [Server & Provider Setup](/docs/ai-agent/configuration): `config.yaml` reference, provider accounts, pricing, and BYOK.
- [Developer & API Guide](/docs/ai-agent/developer-guide): every `ai_agent_features` field, request examples, MCP, and continuity.
- [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing): summary JSON schema, usage fields, and cost accounting.

## Related Reading

- [How to Add AI Meeting Assistant Features](/blog/how-to-add-ai-meeting-assistant-features)
- [How AI Transforms the Virtual Classroom](/blog/ai-transforms-virtual-classroom)
- [Self-Hosted Video Conferencing with OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet)
- [Security Overview](/docs/security-overview): how AI data flows and E2EE interact.
