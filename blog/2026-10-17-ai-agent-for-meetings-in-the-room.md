---
title: "AI Agent for Meetings: In the Room, Not Just on the Recording"
slug: ai-agent-for-meetings-in-the-room
authors: [bob]
tags: [ai-agent, ai-meeting-assistant, ai-moderator, meeting-productivity, virtual-classroom, ai-for-education, self-hosted]
description: "An AI agent for meetings joins the room as a participant: it speaks, draws on the shared whiteboard and writes in the notepad. What it does, what it sees, and what is still in development."
keywords: ["ai agent for meetings", "ai meeting moderator", "ai copilot for meetings", "in-room ai assistant", "voice ai agent for meetings", "ai agent virtual classroom", "open source ai meeting assistant"]
date: 2026-10-17
---

Many meeting assistants focus on one job: a bot listens to the call and sends notes when it ends. plugNmeet does that too, and for many teams it is enough. This post is about a different feature — an assistant that joins the room as a participant, talks with people, draws on the shared whiteboard, writes in the shared notepad, and leaves a summary behind. Part of that is in production today and part is still in development. The sections below keep the two apart.

<!--truncate-->

---

## A note-taker works after the meeting. An agent works during it

| | AI note-taker | In-room agent |
| --- | --- | --- |
| **Where it is** | Outside the conversation, listening to the audio | In the room, as a visible participant |
| **When it helps** | Captions during, notes afterwards | While the discussion is happening |
| **What it does** | Transcribe, translate, summarize | Speak, draw, write, ask and answer, run a short quiz |
| **What it changes** | The record of the meeting | The meeting itself |

If you only need a reliable record of what was said, captions and summaries cover it. The in-room agent fits a narrower situation: the conversation keeps hitting the same obstacle — an explanation that would be clearer as a drawing, a list of steps someone should write down while people are still listening, a check for understanding that should not wait until next week.

## What it does during a session

Imagine a live class. A participant says the diagram on the board does not make sense. The agent does not repeat the explanation more slowly. It redraws the diagram in smaller steps, marks what changed, and asks a short question to check whether the new version helped.

That is the pattern: a participant, not an observer. In a live session the agent can:

- **Talk and listen**, in the language and voice the host sets. You can cut in mid-sentence.
- **Draw on the shared whiteboard**: shapes, labels, freehand sketches, diagrams generated from a sentence, and a pointer for pointing at something without changing the drawing.
- **Write in the shared notepad**, one block at a time, and open the notepad when it writes.
- **Ask, then react.** It can run a short quiz or poll and receives answers as they arrive, so it can confirm, explain or follow up.
- **Leave a structured summary** that your platform can collect and pass back when the same learner returns.

One limit up front: the voice agent currently works with one person at a time in a private session, usually a breakout room for a single learner or prospect. It is a tutor in a side room, not a voice that talks over your main class.

## The moderator copilot is a separate job

The room agent teaches and explains. A moderator copilot helps you run the room. In plugNmeet that is the AI text chat, used by a host or teacher who already controls the session: "mute everyone except the panelists", "open three breakout rooms and split the class", "start recording", "draft four questions on photosynthesis".

Two limits make it usable in a classroom rather than a demo:

- **It acts with your permissions, not above them.** It works for a moderator who already holds those rights, and it does not bypass room locks or settings you configured.
- **Quiz questions are drafted first and published by you.** The copilot writes them into the chat; nothing goes live on the model's word alone.

It also stays in text, beside the room, so you can see what it did, correct it and keep hosting. That separation is deliberate: muting a class, starting a recording or rebuilding breakout rooms belongs to an authorized person in the main room, not to a voice agent a student is chatting with.

## What it sees, and what it doesn't

The agent's visual context is the shared whiteboard and the shared notepad. Nothing else. It does not watch webcams or screen shares, and in the current per-learner modes both are disabled for those sessions.

In practice it reads the work people create together, not the people. It cannot judge who was paying attention from how they looked, or grade participation from video. Fixed platform rules also sit above the host's instructions, and out-of-scope requests are declined; the [capabilities and guardrails page](/docs/ai-agent/tools-and-capabilities) covers that in detail. The boundary that matters here is the whiteboard and the notepad.

## What is ready, and what is still being built

**Stable in production:** live captions and transcription, translation (including each participant choosing their own caption language), the AI text chat with its helpers inside the notepad, whiteboard and polls, and post-meeting summaries.

**Under active development:** the voice agent, and the newer agentic part of the text chat that lets a moderator copilot run room operations through tool calling. Names, defaults and behavior can still change. Today the agent is configured through the plugNmeet API; one-click setup inside the Moodle, WordPress and Joomla plugins is planned for when the feature is finalized.

## Start with one session

When preview access to the voice agent opens, give it one narrow job: a single 1-on-1 whiteboard exercise, a revision quiz with one learner, or a product walkthrough for one prospect. Until then, keep the AI text chat for yourself as host, read the summary afterwards, and judge whether the session was better for it.

When you compare tools, ours included, ask the same three things: does it join as a participant or only read the transcript, what does it actually see, and what happens when it is wrong or off-topic.

- [AI Agent overview](/docs/ai-agent/overview) — the Insights services and where the agent fits
- [Educator guide](/docs/ai-agent/educator-guide) — classroom workflows and prompts
- [Capabilities and guardrails](/docs/ai-agent/tools-and-capabilities) — what it can see and call
- [AI text chat](/docs/ai-agent/ai-text-chat) — the moderator copilot, with example prompts

Related reading: [5 ways an AI assistant can transform your virtual classroom](/blog/ai-transforms-virtual-classroom), [the AI meeting assistant that writes your notes](/blog/ai-meeting-assistant-automated-summaries), and for developers, [how to add AI meeting assistant features](/blog/how-to-add-ai-meeting-assistant-features).

---

**Try it on your own server.** [Read the docs](/docs/ai-agent/overview) or [run plugNmeet](https://github.com/mynaparrot/plugNmeet-server) with your own AI provider keys. The [public live demo](https://demo.plugnmeet.com/landing.html) shows the meeting platform — whiteboard, polls, breakout rooms — but the AI agent is not part of it.
