---
title: "AI Virtual Teacher for Online Classes: Guide for Educators & School Admins"
description: "A practical guide for teachers, coaches, and school administrators to run AI tutoring in plugNmeet: 1-on-1 AI virtual teacher sessions plus live classroom Insights, including a teacher copilot, multilingual captions and translation, automated lecture notes, assigned student rosters, and mastery reports."
keywords: [ai virtual teacher, ai tutor for students, multilingual virtual classroom, live lecture captions and translation, ai teacher copilot, automated lecture summary, virtual classroom ai, ai study room, online tutoring software, school video conferencing, student mastery report]
sidebar_label: Education & Virtual Teacher
sidebar_position: 2
---

# AI Virtual Teacher: A Guide for Educators

Every student learns at a different pace. The plugNmeet AI Agent gives each learner a patient, private 1-on-1 tutor inside your video classroom. The agent talks with the student, works through problems on the whiteboard, asks questions, and checks understanding with quizzes. You stay in control of the topic, the tone, and the schedule.

:::info Under Active Development
The AI Agent engine and its APIs are under active development. Features described here may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the feature is finalized and released. Your technical team can set up the feature through the plugNmeet API in the meantime.
:::

## What the Agent Does in Your Class

- **Explains** a concept in plain language, in the language you choose, at a speaking pace you set.
- **Draws** diagrams, equations, and worked examples on the whiteboard while it talks.
- **Writes** structured notes into the shared notepad, such as a step-by-step solution or a vocabulary list.
- **Checks understanding** with quizzes and polls, then explains each answer immediately.
- **Stays on topic.** It follows the lesson topic you define and gently steers students back when they go off track.
- **Reports back.** After each session, you get a summary of what the student mastered, what they struggled with, and what to review next.

It does **not** watch students through their webcams or screen shares. The agent sees only the whiteboard and the shared notepad.

## Three Classroom Workflows

plugNmeet supports three ways to use the agent in a class. Choose the one that matches your lesson.

### 1. Teacher-Led Breakouts (`NORMAL_ROOM`)

You run the class. During a lesson, open the **Breakout Rooms** panel and create 1-on-1 AI sessions for the students you choose. Each session is a private breakout room with the agent. The **AI Sessions** panel shows which students are in a session, so you can monitor progress and jump in when needed.

Best for: guided practice during a live lesson, remediation for a few students while the rest of the class works on tasks.

### 2. Assigned Student Roster (`CONTROLLED_USERS`)

You list the students who are allowed to use the agent, up to **32 student IDs**. When an allowed student joins the main room, the platform automatically places them in their own isolated breakout room labelled `<Name> (AI Session)`. The main room acts as a lobby. Students who are not on the list cannot start an AI session.

Best for: homework support, a flipped-classroom course, or a tutoring group with a fixed roster.

### 3. 24/7 Self-Service Study Room (`OPEN_PER_USER`)

Any learner who opens the study room link gets an automatic 1-on-1 session with the agent. Your administrator sets `max_concurrent_sessions` to control how many learners can be in a session at the same time. The server caps this at **16 concurrent sessions**. Webcams and screen sharing are turned off in this mode, so the room stays focused on the lesson and the whiteboard.

Best for: exam preparation, language practice outside school hours, and review before a test.

:::tip Choosing a Mode
Use **Teacher-Led Breakouts** when you want to be present. Use **Assigned Student Roster** for a known group that needs regular practice. Use **24/7 Self-Service** when learners need help outside class hours.
:::

## Ready-to-Use Teaching Prompts

Your technical team enters the prompt in the room's `system_prompt`, along with a `topic` and optional `allowed_subtopics`. Adapt these templates to your course. Keep the tone encouraging, and keep the agent's scope narrow.

### STEM & Math Whiteboard Tutor

```text
You are a patient math tutor for Grade 9 students. Teach linear equations.
Work through problems step by step on the whiteboard, one step at a time.
Ask the student to predict the next step before you show it.
When the student makes a mistake, point to the step on the board, name the error gently,
and ask a guiding question. Do not give the final answer until the student has tried twice.
After every two worked examples, create a short quiz with one multiple-choice question.
Stay within algebra and linear equations. Politely decline other topics.
```

Suggested room settings: `topic: "Linear equations (Grade 9 algebra)"`, `allowed_subtopics: ["solving one-variable equations", "word problems", "checking solutions"]`.

### Language Speaking Coach

```text
You are a friendly Spanish speaking coach for adult beginners. Speak mostly in simple Spanish,
and explain grammar in English when the student is confused.
Ask one question at a time. Correct pronunciation or grammar with a short, kind example.
Use the whiteboard to write new vocabulary with a simple picture or diagram.
Keep each turn short so the student speaks more than you do.
Finish each session by writing three key phrases in the shared notepad.
```

Suggested room settings: `target_lang: "es-ES"`, `spoken_lang: "en-US"`, `instruction_lang: "en-US"`, and a `speaking_rate` between `0.8` and `1.0` for beginners. The `speaking_rate` range is `0.5` to `2.0`, with `1.0` as the normal pace.

### Exam Preparation Tutor

```text
You are an exam preparation tutor for a high-school history test on the causes of World War I.
Ask the student to explain one cause in their own words, then ask a follow-up question.
Every five turns, run a quiz with four questions covering the main causes.
Do not lecture for more than thirty seconds at a time.
If the student scores below 60 percent on a quiz, go back to the weakest topic and explain it again with a timeline on the whiteboard.
```

Suggested room settings: `topic: "Causes of World War I"`, `forbidden_topics: ["other wars", "current political events"]`.

## In-Room Controls for Teachers and Students

### The Status Bar

The AI status bar shows what the agent is doing right now. The states are:

| State | Meaning |
| --- | --- |
| **Connecting** | The agent is joining the session. |
| **Listening** | The agent is waiting for the student to speak. |
| **Thinking** | The agent is preparing a response. |
| **Speaking** | The agent is talking. |
| **Drawing** | The agent is working on the whiteboard. |
| **Paused** | The session is paused and the agent is not responding. |
| **Reconnecting** | The connection dropped, and the agent is trying to rejoin. |
| **Stopped** | The session has ended. |

### Talking to the Agent

Students can talk naturally. They can **interrupt the agent mid-sentence** (barge-in), and the agent stops and listens. This is important for language practice and for students who want to ask a quick question.

### Drawing on the Board

Students and teachers can draw on the whiteboard while the agent is talking. The agent sees the latest board state, so it can refer to what the student has drawn. Teachers can also use the laser pointer and other whiteboard tools to point at the agent's work.

### Pause and Local Mute

- **Pause:** A moderator or the session owner can pause the agent. The status bar shows **Paused** until the session resumes.
- **Local mute:** A student can mute their own microphone to think in silence, without stopping the session.

### The AI Chat Box

Typed questions in the AI chat box are routed to the agent in the same session. Use typed messages for spelling, links, or code, when speaking is not practical.

### Workspace Ownership

Work on the whiteboard and in the shared notepad is tied to who created it. The agent's own changes are tracked separately, and the agent can undo its last 20 actions. Students and teachers keep their own drawings and notes.

## Reading Post-Session Mastery Reports

After each session, the platform creates an `AI_AGENT_SESSION_SUMMARY` artifact for the parent room. Your learning system or LMS can fetch it through the API, or your administrator can review it in the artifacts list. A typical report includes:

- **Overall score and mastery level**, with a short note on participation.
- **Concepts mastered, practiced, and struggled with.**
- **Key terms** the student used, useful for vocabulary checks.
- **Quiz results**: total questions, accuracy, and the questions the student got wrong.
- **Progress log**, with each concept and its status over the session.
- **Next steps**: a suggested focus for the next session and an unfinished subtopics list.

Reports are written for teachers. Use them to plan your next lesson, not as a grade on their own. The full structure is described in [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing).

## Live Group Classes: AI Teacher Copilot, Multilingual Captions & Lecture Notes

The 1-on-1 tutor is only half of the picture. The same Insights services also support you in a full live class, inside your normal group room.

### 1. Hands-Free Classroom Management with the AI Teacher Copilot ([In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat))

During a live group lecture, type plain-language commands to the copilot instead of clicking through menus:

- *"Draft a 4-question multiple-choice quiz on photosynthesis."* The copilot runs the `draft_quiz` → teacher review → `publish_quiz` workflow, so a quiz never goes live without your approval.
- *"Create 4 breakout rooms for 15 minutes."*
- *"Draw a labeled plant cell diagram on the whiteboard."*
- *"Start a 5-minute countdown timer."*

**Exam and assessment integrity:** during a live test, disable student AI helpers on the surfaces you choose with `is_notepad_ai_disabled`, `is_whiteboard_ai_disabled`, and `is_poll_ai_disabled`, while keeping moderator tools active for yourself.

### 2. Multilingual Classrooms & Accessibility ([Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation))

For international classes, ESL/EFL courses, and hearing-accessibility requirements, enable live speech-to-text captions, simultaneous subtitle translation, synthesized spoken translation as TTS audio tracks, and multilingual translation of the live chat. Each student follows the lecture in the language they selected.

After class, download the WebVTT (`SPEECH_TRANSCRIPTION`) subtitle file. It carries speaker tags (`<v Name>`), so you can attach it to a recorded lecture in your LMS: Moodle, WordPress, or a custom portal.

### 3. Automated Lecture Notes & Study Guides ([AI Meeting Summarization](/docs/ai-agent/meeting-summarization))

Summarization works even when live captions are off. Set an education-tailored `summarization_prompt`, for example: *"Summarize today's lecture into key definitions, worked examples covered, student questions, and homework assignments."* The server then generates a structured `MEETING_SUMMARY` artifact automatically when the class ends.

## Tips for a Successful Rollout

1. **Start with one class.** Try **Teacher-Led Breakouts** for two lessons, then decide whether to expand.
2. **Set a narrow topic.** A specific topic and a short list of subtopics keeps the agent focused.
3. **Review summaries weekly.** Patterns across students tell you more than any single session.
4. **Tell students what the agent is.** It is an AI tutor, not a human teacher. Explain that it does not watch them on camera.
5. **Check your data policy.** Audio and text are sent to your configured AI provider. See the [Security Overview](/docs/security-overview) for the full data flow.

## Next Steps

- [Overview & Concepts](/docs/ai-agent/overview): how the agent fits into a live room.
- [Capabilities, Vision & Guardrails](/docs/ai-agent/tools-and-capabilities): what the agent can and cannot see or do.
- [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat): the copilot that lets you run the class from the chat box.
- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation): multilingual captions, spoken translation, and downloadable transcripts.
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization): automatic lecture notes and study guides.
- [Developer & API Guide](/docs/ai-agent/developer-guide): how your technical team enables a room for AI sessions.
- [User Guide for Moderators](/docs/user-guide/moderator#using-ai-assistant): general AI assistant controls.
