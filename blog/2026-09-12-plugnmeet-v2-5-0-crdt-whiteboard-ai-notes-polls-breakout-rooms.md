---
title: "plugNmeet v2.5.0: CRDT Whiteboard, AI Notes, Polls & Breakout Rooms"
slug: plugnmeet-v2-5-0-crdt-whiteboard-ai-notes-polls-breakout-rooms
authors: [jibon]
tags: [plugnmeet, release-notes, whiteboard, shared-notepad, polls, breakout-rooms, ai, ai-features, self-hosted, open-source, video-conferencing]
description: "plugNmeet v2.5.0 is here: CRDT whiteboard sync with Yjs, BlockNote shared notepad with AI, AI text-to-diagram, AI poll generation, redesigned breakout rooms, and WHIP streaming."
keywords: ["plugnmeet v2.5.0", "open source zoom alternative", "self-hosted video conferencing", "CRDT collaborative whiteboard", "BlockNote shared notepad AI", "AI text to diagram whiteboard", "meeting polls with AI", "breakout rooms self-hosted", "WHIP live streaming"]
date: 2026-09-12
---

Picture this. Your class has been sketching on the whiteboard for twenty minutes. A student joins late — and sees a blank canvas. Or you spent an hour writing meeting notes in the shared notepad, only to lose formatting when you export them. Sound familiar?

We've lived those moments too. That's exactly why we built **plugNmeet v2.5.0**.

This isn't a polish release. We ripped out three collaboration engines and rebuilt them: the whiteboard now runs on **CRDT sync**, the old Etherpad notepad is gone in favor of **BlockNote + AI**, and **breakout rooms** got a completely new architecture. On top of that, **AI now works in three places** — whiteboard, notepad, and polls — and you can push polls into a live room straight from your own backend.

If you're looking for a **free self-hosted video conferencing** platform that actually keeps up with your meetings, this is the version to try.

<!--truncate-->

---

### The Problem: Collaboration Tools That Don't Keep Up

Most **open source Zoom alternatives** get video and audio right. It's everything around the call that falls apart:

*   **Whiteboards** that go out of sync the moment someone rejoins.
*   **Shared notes** stuck on decade-old editors with no AI help.
*   **Polls** that take five minutes to build for a thirty-second vote.
*   **Breakout rooms** that can't carry content with them, so each group starts from zero.

We heard all four complaints from teachers, event hosts, and teams running plugNmeet at scale. So we fixed them together, in one release.

### The Solution: What's New in plugNmeet v2.5.0

Here's the short version:

*   **CRDT whiteboard (Yjs)** with a server-first sync store — late joiners just work.
*   **Shared Notepad rebuilt on BlockNote** with built-in AI: continue writing, summarize, fix grammar, simplify, custom prompts.
*   **AI Text-to-Diagram** on the whiteboard: type a sentence, get a flowchart or ER diagram on the canvas.
*   **Redesigned polls + AI generation**: describe what you need, get a ready poll draft, plus quiz mode, anonymous votes, and a new [Create Poll API](/docs/api/room/create-poll).
*   **Breakout rooms redesigned** — share whiteboard pages, notepad content, and polls into child rooms.
*   **WHIP support** for live broadcasting, plus gzip checkpoints and rolling diffs that cut sync bandwidth noticeably.

Let's walk through each one.

### A Whiteboard That Actually Syncs: CRDT + Yjs

Our old whiteboard worked fine — until it didn't. Reconnects, late joiners, flaky networks. You'd get missing strokes or, worse, divergent boards.

In v2.5.0 the whiteboard runs on **Yjs CRDTs**, the same model we use for the shared notepad. Every page is a `Y.Doc`, cursor presence rides on `y-protocols/awareness`, and sync is **server-first**:

1.  Your client fetches the canonical checkpoint from the server first.
2.  One retry if there's no response, then a diff fetch.
3.  If no presenter is online, the server serves the initial state straight from Redis.
4.  After that, only gzip'd checkpoints + rolling diffs move over the wire — never the full state — and sync requests fan out to max 3 peers.

What does that mean for you? A student joining 20 minutes late sees the full board in a second or two. Pages survive refreshes via IndexedDB. Bandwidth drops. We think it's the single biggest reliability jump we've shipped for the whiteboard since we introduced [the integrated whiteboard experience](/blog/integrated-whiteboard-experience).

Small touches matter too: last page restores when you switch files, private board messages actually stay private, and pointer updates feel smoother.

### Goodbye Etherpad. Hello Shared Notepad with AI.

This one hurts a little — Etherpad served us well for years. But it had to go. It couldn't do modern block editing, and bolting AI onto it felt wrong.

The new **Shared Notepad** is built on **BlockNote**, with real-time collaboration still powered by Yjs under the hood. So you get familiar blocks, markdown import/export, and live cursors — plus an AI menu right where you type.

Select any text (or just place your cursor) and ask AI to:

*   **Continue writing** in the same tone
*   **Summarize** a long discussion into bullets
*   **Improve writing**, **fix spelling & grammar**, or **simplify** for younger readers
*   Run a **custom prompt** — e.g. "turn this into meeting minutes with action items"

Results stream directly into the document, block by block. No copy-paste dance.

One honest note: there's only one notepad per session now, and if you customized Etherpad heavily, treat this as a breaking change. For everyone else, it's simply faster and far more useful. If you use AI elsewhere in plugNmeet, the setup will feel familiar — same Insights backend as [our AI meeting assistant](/blog/how-to-add-ai-meeting-assistant-features).

### AI Text-to-Diagram: From Sentence to Flowchart

Here's my favorite demo. Open the whiteboard, hit the AI button, and type:

> "Onboarding flow: signup → email verify → profile setup → first project, with a retry loop on verification"

A few seconds later you've got an editable flowchart on the canvas. Not an image. Real shapes you can move, recolor, and annotate.

Under the hood we send your prompt through `insights/ai/textChat/execute` tagged for the whiteboard, get back raw **Mermaid syntax** (flowchart, sequence, class, state, or ER diagram), and render it with mermaid-to-excalidraw. Follow-up prompts keep context, so "now add a decision step for SSO users" just works.

Teachers use it for lesson diagrams. Dev teams sketch architecture without leaving the call. Honestly, once you try it, going back to drawing boxes by hand feels slow.

### Polls, Redesigned — Now with AI and a Real API

Polls got the full treatment in v2.5.0. If you haven't read [our polls primer](/blog/engaging-audience-with-live-polls), the basics still hold — but creation is completely different.

Click create, and you'll see two paths:

*   **Quick presets** — yes/no, true/false, agree/disagree, A–D, 1–5. One click and you're voting.
*   **Generate with AI** — describe the poll in plain words ("check if my DevOps class understands blue-green deploys, make it a quiz"). The AI returns strict JSON with question, 2–6 options, `is_multiple`, and `is_quiz`, and the form prefills itself. Nothing goes live until you hit Create. You stay in control.

Polls now support **quiz mode** (correct answers hidden until close), **anonymous voting**, **multi-select**, and **auto-close timers** up to 60 minutes. Expiry checks moved server-side into the janitor, so timed polls close reliably even if the moderator's tab sleeps.

And for developers: there's a brand-new **[Create Poll API](/docs/api/room/create-poll)**. `POST /room/createPoll` with `room_id`, `question`, and `options` pushes a poll into a running room from your backend. Perfect for scheduled event votes or automated surveys. The moderator can still close, publish, or reopen it like any other poll.

This isn't just theory — we're already using it. Our **Moodle plugin v3.0.13** ships an **Add Poll from Quiz** button right on the activity page. Pick a Moodle quiz or a question bank category, choose a multiple-choice or true/false question, set quiz vs. vote mode, anonymous voting, and auto-close duration — and the plugin converts it into a live poll via `createPoll` while the room is running. No retyping questions, no context switching. If you run classes in Moodle, see the [Moodle integration guide](/docs/user-guide/moodle-integration).

### Breakout Rooms, Rebuilt for Real Use

The old breakout implementation worked for simple splits. Anything beyond that — carrying content along, managing live rooms — got painful.

v2.5.0 ships a **completely redesigned breakout architecture** on both client and server. The creation form now lets you:

*   Drag, randomize, or pre-assign participants (including API pre-assignments — which our [Moodle plugin already uses](/docs/user-guide/moodle-integration): enable "Pre-assign breakout rooms from course groups" and each Moodle group becomes a room, titled with the group name and filled with its members, from the next session start)
*   Set custom room titles, durations, welcome messages
*   Allow return-to-main-room and self-select
*   **Share specific whiteboard pages** into rooms
*   **Share the notepad** and **selected polls** so groups don't start empty

Here's the clever part: after rooms are created, the creating admin's client seeds each child room's Redis state with the parent's content — same wire format, same E2EE-derived keys per child. Groups open their room and the material is already there.

While rooms run, hosts get a management view: broadcast a message to all rooms, extend duration, jump in, or end everything. If you've struggled with breakouts before, reread [mastering breakout rooms](/blog/mastering-breakout-rooms) — most of those workarounds are now built in.

### Faster Sync, Live Broadcasting via WHIP

Two infrastructure wins worth mentioning.

First, **session-data sync is leaner**. Gzip'd checkpoints plus rolling diffs replace full-state dumps. You'll feel it most in big rooms on weak connections.

Second, **WHIP support** for live broadcasting. If you followed [our OBS + WHIP guide](/blog/obs-rtmp-whip-ingress), you already know the direction — v2.5.0 makes browser-originated WHIP egress a first-class path. Easier to push your session to a CDN or streaming pipeline without RTMP gymnastics.

### For Admins: Upgrading to v2.5.0

For the complete list of changes, see the [v2.5.0 release notes on GitHub](https://github.com/mynaparrot/plugNmeet-server/releases/tag/v2.5.0).

A few things to know before you upgrade:

*   **Etherpad is removed.** No separate Etherpad container, no pad migration. `SharedNotepad` is now part of room features. Clean up old Etherpad config from your `config.yaml`.
*   Both client and server ship the new session-data store — **upgrade them together**.
*   AI features (whiteboard, notepad, polls) all ride on the existing Insights AI text-chat backend. Gate them per-room with `aiTextChatFeatures` (`isWhiteboardAiDisabled`, `isPollAiDisabled`, `allowedUserIds`). Any OpenAI-compatible provider works — see [our OpenAI integration guide](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet).
*   Poll expiry and notepad/whiteboard hydration have new server paths — check the [Installation Guide](/docs/installation) and [API Documentation](/docs/api/intro) if you run custom hooks.

It's not perfect yet — mobile AI menus and very large board histories still have rough edges we're polishing. But for most rooms, this is a straight upgrade.

### Try It Today

v2.5.0 is the release where plugNmeet stops feeling like "video + extras" and starts feeling like one workspace. Whiteboard, notes, polls, and breakout groups finally share the same sync brain — and AI sits inside all three instead of in a sidebar nobody opens.

Spin it up with our [simple installation script](/docs/installation), open the [Moderator Guide](/docs/user-guide/moderator) to walk your hosts through the new flows, or dive into the [Create Poll API](/docs/api/room/create-poll) if you're integrating from an LMS.

And if you like where this is going, star us on [GitHub](https://github.com/mynaparrot/plugNmeet-server) — it genuinely keeps the project moving.
