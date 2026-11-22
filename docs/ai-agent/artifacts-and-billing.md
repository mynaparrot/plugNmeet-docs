---
title: "AI Agent Session Summary & Usage Artifacts: JSON Schema, Billing & BYOK"
description: "Full reference for the plugNmeet AI_AGENT_SESSION_SUMMARY and AI_AGENT_USAGE artifacts, including the summary JSON schema, per-role and per-modality token and audio cost accounting, parent-room attribution, and billing suppression for bring-your-own-key sessions."
keywords: [ai agent summary json, ai session report, ai usage billing, token usage artifact, ai cost tracking, plugnmeet artifacts, session summary schema, ai agent billing, byok billing, learning analytics ai, lms ai report]
sidebar_label: Summaries & Usage Artifacts
sidebar_position: 11
---

# AI Agent Summaries & Usage Artifacts

Every AI Agent session produces two artifacts, stored against the **parent room**:

| Artifact | Type value | Purpose |
| --- | --- | --- |
| `AI_AGENT_SESSION_SUMMARY` | `11` | A structured JSON report of the session: what was learned, what was practised, quiz results, workspace activity, and the continuation context for the next session. |
| `AI_AGENT_USAGE` | `10` | Token and audio usage, broken down by role and modality, with estimated costs. |

This page describes both, with the exact field names used in `plugnmeet_room_artifacts.proto`.

:::info Under Active Development
**Live transcription (STT), translation, speech synthesis (TTS), AI Text Chat, and meeting summarization are stable production features**, and their artifact formats are stable. Only the Voice AI Agent (`ai_agent`) and the newer agentic MCP tool-calling capabilities are under active development: their artifact fields, and fields not yet listed here, may change before general release. One-click UI integration for **Moodle, WordPress, and Joomla plugins** is planned once the agent is finalized and released.
:::

## How You Receive Artifacts

1. The session ends, and the server writes both artifacts to the parent room.
2. Your server receives an [`artifact_created`](/docs/others/webhooks#artifact-created) webhook for each artifact.
3. Your server retrieves the JSON with [`/auth/artifact/fetch`](/docs/api/artifact/fetch), filtering by `type` (`AI_AGENT_SESSION_SUMMARY` or `AI_AGENT_USAGE`).

:::tip Use the Webhook as the Trigger
Do not poll for artifacts. Listen for `artifact_created`, check `room_artifact.type`, and then fetch only the artifact you need.
:::

## All Insights Artifact Types

`RoomArtifactType` covers every artifact the Insights platform produces. Types `1` through `9` come from the speech, summarization, and text-chat services; types `10` through `12` come from the AI Agent.

| Type | Name | Form | Pricing model | Feature guide |
| --- | --- | --- | --- | --- |
| `1` | `MEETING_ANALYTICS` | Downloadable file | None. Platform analytics, not a provider-billed service. | [Analytics](/docs/others/analytics) |
| `2` | `MEETING_SUMMARY` | Downloadable file (`text/plain`) | None. The billable record is type `3`. | [AI Meeting Summarization](/docs/ai-agent/meeting-summarization) |
| `3` | `MEETING_SUMMARY_USAGE` | Usage metadata | Token usage with `estimated_cost`. | [AI Meeting Summarization](/docs/ai-agent/meeting-summarization) |
| `4` | `SPEECH_TRANSCRIPTION` | Downloadable file (`text/vtt`) | None. The billable record is type `5`. | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `5` | `SPEECH_TRANSCRIPTION_USAGE` | Usage metadata | Duration (`duration_sec`, priced with `price_per_hour`). | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `6` | `SYNTHESIZED_SPEECH_USAGE` | Usage metadata | Character count, priced with `price_per_million_characters`. | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `7` | `CHAT_TRANSLATION_USAGE` | Usage metadata | Character count, priced with `price_per_million_characters`. | [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation) |
| `8` | `AI_TEXT_CHAT_INTERACTION_USAGE` | Usage metadata | Token usage for `chat_model`. | [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat) |
| `9` | `AI_TEXT_CHAT_SUMMARIZATION_USAGE` | Usage metadata | Token usage for `summarize_model`. | [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat) |
| `10` | `AI_AGENT_USAGE` | Usage metadata | Token and audio usage, per role and modality. | This page |
| `11` | `AI_AGENT_SESSION_SUMMARY` | Downloadable file (JSON) | None. The billable record is type `10`. | This page |
| `12` | `AI_AGENT_TRANSCRIPT` | Downloadable file | None. The billable record is type `10`. | [Developer & API Guide](/docs/ai-agent/developer-guide) |

Two rules apply across the table:

- **File artifacts** (`1`, `2`, `4`, `11`, `12`) need a download token from [`/auth/artifact/getDownloadToken`](/docs/api/artifact/download) before your backend can read them.
- **Usage artifacts** (`3`, `5`–`10`) carry their numbers in `room_artifact.metadata` and have no file to download. Their `reference_artifact_id` points at the file they bill for, when one exists.

Usage that occurs in a breakout room is attributed to the parent room for every type. The list of types also appears in the [webhook reference](/docs/others/webhooks#artifact-created).

## `AI_AGENT_SESSION_SUMMARY`

The summary file is JSON, generated with the proto field names (snake_case). Empty strings, empty lists, and zero values are included, so every field is always present. Optional fields are omitted when they are not set.

### Top-Level Fields

| Field | JSON type | Description |
| --- | --- | --- |
| `summary_source` | string | `llm` when a text model refined the summary. `local_fallback` when the summary was built from session telemetry only. |
| `generated_at` | string | ISO-8601 timestamp of when the summary was created. |
| `user_info` | object | The learner or visitor for this session. Always present. See [`user_info`](#user_info). |
| `session` | object | Session facts: times, duration, end reason, topic, and counts. |
| `evaluation` | object | Mastery and participation assessment. |
| `quiz_evaluation` | object | Quiz and poll performance. |
| `progress_log` | array | Concept-by-concept status over the session. |
| `workspace_activity` | object | Which tools and workspaces were used. |
| `continuation` | object | Context and focus for the next session. |
| `narrative_summary` | string | A short, human-readable paragraph for teachers, sales reps, or CRM notes. |
| `usage` | map | Token usage per role: `session`, `delegation`, and `summary`. See [`usage`](#usage-by-role). |

:::note Schema Version
The summary does not include a `schema_version` field. Detect changes by the field names in the table above, and by the artifact's `metadata` in the artifact record.
:::

### `user_info`

| Field | JSON type | Description |
| --- | --- | --- |
| `user_id` | string | The internal participant ID used in the session. |
| `name` | string | Display name, if known. Optional. |
| `ex_user_id` | string | Your system's user ID, passed when the participant joined. Use this to match records. Optional. |
| `extra_data` | string | The participant's custom metadata, as a JSON object string. Optional. |

### `session`

| Field | JSON type | Description |
| --- | --- | --- |
| `room_id` | string | The parent room ID. |
| `room_sid` | string | The LiveKit room SID for the parent room. |
| `session_id` | string | Unique ID of this AI session. |
| `agent_display_name` | string | Name the agent used, for example `Math Tutor`. |
| `topic` | string | The configured topic. |
| `allowed_subtopics` | string[] | The configured subtopics. |
| `started_at` | string (int64) | Start time, Unix milliseconds. Protobuf encodes 64-bit integers as JSON strings. |
| `ended_at` | string (int64) | End time, Unix milliseconds. |
| `duration_seconds` | string (int64) | Session length in seconds. |
| `end_reason` | string | Why the session ended, such as `host_stopped`, `empty_room`, or `budget`. |
| `off_topic_redirects_count` | number | Cumulative count of off-topic redirects for the session. |
| `turns_count` | number | Number of conversational turns. |

### `evaluation`

| Field | JSON type | Description |
| --- | --- | --- |
| `overall_score` | number | An overall score for the session, as set by the evaluation step. |
| `mastery_level` | string | A short descriptor, such as `developing`, `proficient`, or `mastered`. |
| `participation_level` | string | A short descriptor of how actively the participant engaged. |
| `concepts_mastered` | string[] | Concepts the participant demonstrated. |
| `concepts_practiced` | string[] | Concepts covered but not yet secure. |
| `struggled_with` | string[] | Concepts the participant found difficult. |
| `vocabulary_or_key_terms` | string[] | Key terms or vocabulary used in the session. |
| `rubric_notes` | string | Explanation of how the evaluation was reached. |

The `mastery_level` and `participation_level` values are free text generated by the summary step. Build filters on `overall_score` and the concept arrays, not on exact label strings.

### `quiz_evaluation`

| Field | JSON type | Description |
| --- | --- | --- |
| `total_quizzes` | number | Number of quizzes or polls with correct answers in the session. |
| `total_responses` | number | Number of answers submitted. |
| `correct_responses` | number | Number of correct answers. |
| `accuracy_percent` | number | `correct_responses / total_responses` as a percentage. |
| `questions` | array | One entry per question. |

Each entry in `questions` has:

| Field | JSON type | Description |
| --- | --- | --- |
| `poll_id` | string | The poll or quiz ID. |
| `question` | string | The question text. |
| `correct_option` | string | The correct answer text. |
| `total_votes` | string (uint64) | Total votes received. |
| `correct_votes` | string (uint64) | Votes for the correct answer. |
| `passed` | boolean | Whether the question met the passing rule for the quiz. |

### `progress_log`

Each entry describes one concept:

| Field | JSON type | Description |
| --- | --- | --- |
| `concept` | string | The concept name. |
| `status` | string | The status at the end of the session, such as `practiced` or `mastered`. |
| `notes` | string | Optional note about the concept. |

### `workspace_activity`

| Field | JSON type | Description |
| --- | --- | --- |
| `tools_used` | map&lt;string, number&gt; | How many times each tool was called, for example `whiteboard_draw_diagram: 3`. |
| `whiteboard_used` | boolean | Whether the whiteboard was used. |
| `notepad_used` | boolean | Whether the shared notepad was used. |

### `continuation`

| Field | JSON type | Description |
| --- | --- | --- |
| `next_session_focus` | string | Recommended focus for the next session. |
| `recommended_warm_up` | string | A short opening activity for the next session. |
| `unfinished_subtopics` | string[] | Subtopics not yet covered. |
| `previous_session_context_prompt` | string | A ready-made context prompt. Pass it to the next session as `previous_session_context`. |

### Usage by Role

The `usage` map has one entry per role:

| Key | Covers |
| --- | --- |
| `session` | The realtime voice model: the live conversation, including audio. |
| `delegation` | The text model that handles tool calls and delegated turns. Present for providers that use a separate delegation model. |
| `summary` | The text model that wrote the end-of-session summary. |

Each entry is a token usage object, described in the next section.

## Example Summary

The example below is a realistic summary for a 20-minute study session. Values are illustrative.

```json
{
  "summary_source": "llm",
  "generated_at": "2026-03-14T10:42:19Z",
  "user_info": {
    "user_id": "pnm_user-7f3a",
    "name": "Ana Rivera",
    "ex_user_id": "student-204",
    "extra_data": "{\"class\":\"Grade 9B\"}"
  },
  "session": {
    "room_id": "study-room-spanish",
    "room_sid": "RM_kR8w2sXq1ZbA",
    "session_id": "ai-7c1e9b40",
    "agent_display_name": "Lucía",
    "topic": "Everyday Spanish conversation",
    "allowed_subtopics": ["greetings", "ordering food", "travel vocabulary"],
    "started_at": "1773484800000",
    "ended_at": "1773486000000",
    "duration_seconds": "1200",
    "end_reason": "host_stopped",
    "off_topic_redirects_count": 1,
    "turns_count": 34
  },
  "evaluation": {
    "overall_score": 72,
    "mastery_level": "developing",
    "participation_level": "high",
    "concepts_mastered": ["greetings", "ordering with 'quisiera'"],
    "concepts_practiced": ["travel vocabulary"],
    "struggled_with": ["subjunctive after 'quiero que'"],
    "vocabulary_or_key_terms": ["la cuenta", "el menú", "por favor"],
    "rubric_notes": "Confident in greetings and food vocabulary. Needs more practice with the subjunctive."
  },
  "quiz_evaluation": {
    "total_quizzes": 2,
    "total_responses": 6,
    "correct_responses": 4,
    "accuracy_percent": 67,
    "questions": [
      {
        "poll_id": "poll-1a2b",
        "question": "Which phrase politely asks for the bill?",
        "correct_option": "La cuenta, por favor",
        "total_votes": "1",
        "correct_votes": "1",
        "passed": true
      },
      {
        "poll_id": "poll-3c4d",
        "question": "Choose the correct form: Quiero que tú ___ conmigo.",
        "correct_option": "vengas",
        "total_votes": "1",
        "correct_votes": "0",
        "passed": false
      }
    ]
  },
  "progress_log": [
    { "concept": "greetings", "status": "mastered", "notes": "Used formal and informal forms correctly." },
    { "concept": "subjunctive after 'quiero que'", "status": "struggling", "notes": "Needed two corrections." }
  ],
  "workspace_activity": {
    "tools_used": {
      "whiteboard_draw_shapes": 2,
      "whiteboard_write_content": 5,
      "notepad_write": 3,
      "create_quiz": 2
    },
    "whiteboard_used": true,
    "notepad_used": true
  },
  "continuation": {
    "next_session_focus": "Subjunctive after expressions of desire",
    "recommended_warm_up": "Order a meal using a role-play with three menu items",
    "unfinished_subtopics": ["travel vocabulary"],
    "previous_session_context_prompt": "Previous session (Everyday Spanish): mastered greetings and ordering; struggled with the subjunctive after 'quiero que'. Start with a short warm-up, then practise the subjunctive."
  },
  "narrative_summary": "Ana practised greetings and ordering food with confidence. She answered most quiz questions correctly, but the subjunctive after 'quiero que' needs more practice. Start the next session with a meal role-play, then focus on the subjunctive.",
  "usage": {
    "session": {
      "prompt_tokens": 18420,
      "completion_tokens": 3110,
      "total_tokens": 21530,
      "breakdown": {
        "session_prompt_tokens": "18420",
        "session_audio_prompt_tokens": "9800",
        "session_completion_tokens": "3110",
        "session_audio_completion_tokens": "2600",
        "audio_millis": "1200000"
      }
    },
    "delegation": {
      "prompt_tokens": 2950,
      "completion_tokens": 640,
      "total_tokens": 3590,
      "breakdown": {
        "delegation_prompt_tokens": "2950",
        "delegation_completion_tokens": "640"
      }
    },
    "summary": {
      "prompt_tokens": 4100,
      "completion_tokens": 520,
      "total_tokens": 4620,
      "breakdown": {
        "summary_prompt_tokens": "4100",
        "summary_completion_tokens": "520"
      }
    }
  }
}
```

Breakdown values are strings in the JSON because protobuf encodes `int64` as strings. Parse them as integers in your code.

:::caution Field Names in the Example
The example uses the field names listed in this page. Some fields, such as the `breakdown` keys inside `usage`, can differ between providers. Read the values you need, and ignore keys you do not recognise.
:::

## `AI_AGENT_USAGE`

The usage artifact is stored as `RoomArtifactMetadata` with a `token_usage` payload. Its metadata fields are:

| Metadata field | Description |
| --- | --- |
| `token_usage.prompt_tokens` | Total prompt tokens across all roles. |
| `token_usage.completion_tokens` | Total completion tokens across all roles. |
| `token_usage.total_tokens` | Prompt plus completion tokens. |
| `token_usage.breakdown` | Per-role and per-modality counts, described below. |
| `token_usage.prompt_tokens_estimated_cost` | Estimated prompt cost. Optional. Omitted for BYOK sessions. |
| `token_usage.completion_tokens_estimated_cost` | Estimated completion cost. Optional. Omitted for BYOK sessions. |
| `token_usage.total_tokens_estimated_cost` | Estimated total cost. Optional. Omitted for BYOK sessions. |
| `reference_artifact_id` | The artifact ID of the matching `AI_AGENT_SESSION_SUMMARY`. Use it to link the two. |
| `user_info` | The same learner identity as the summary. Included when the summary has one. |
| `occurred_in_breakout_room` | `true` when the session ran in a breakout room. |
| `source_room_table_id` | The database table ID of the room where the session ran. |

### Breakdown Keys

The `breakdown` map uses a prefix for each role: `session_`, `delegation_`, or `summary_`. For example, `session_prompt_tokens` and `delegation_prompt_tokens`.

Each role can report these keys, when the value is greater than zero:

| Key suffix | Meaning |
| --- | --- |
| `_prompt_tokens` | Input tokens. |
| `_completion_tokens` | Output tokens. |
| `_cached_prompt_tokens` | Input tokens served from cache. |
| `_cache_write_prompt_tokens` | Input tokens written to cache. |
| `_text_prompt_tokens` | Text input tokens. |
| `_audio_prompt_tokens` | Audio input tokens. |
| `_image_prompt_tokens` | Image input tokens. |
| `_cached_text_prompt_tokens`, `_cached_audio_prompt_tokens`, `_cached_image_prompt_tokens` | Cached input, per modality. |
| `_cache_write_text_prompt_tokens`, `_cache_write_audio_prompt_tokens`, `_cache_write_image_prompt_tokens` | Cache writes, per modality. |
| `_text_completion_tokens` | Text output tokens. |
| `_audio_completion_tokens` | Audio output tokens. |
| `_thinking_completion_tokens` | Reasoning output tokens, when the model reports them. |

Session-wide keys:

| Key | Meaning |
| --- | --- |
| `audio_millis` | Speech duration in milliseconds, used for audio-priced and minute-priced sessions. |
| `summary_prompt_tokens` | Input tokens used to write the summary. |
| `summary_completion_tokens` | Output tokens used to write the summary. |
| `custom_provider_<provider>` | Set to `1` for BYOK sessions. For example, `custom_provider_openai`. |

### Per-Modality Cost Accounting

Costs are estimated from the `pricing` table in your server's `config.yaml`. Each modality has its own rate:

- **Text input and output** use the text rates.
- **Audio input and output** use the audio rates, which are usually higher.
- **Image input** uses the image rate.
- **Cached input** uses the cached rate when set. Without a cached rate, cached tokens are priced as uncached input.
- **Cache writes** use the cache-write rate when set.
- **Minute-priced live speech** (OpenAI Live) is estimated from `audio_millis` and the `price_per_minute` rate.

The estimate is an accounting aid. It does not replace your provider's invoice. Keep your `pricing` values in line with your provider contract.

### Parent-Room Attribution

Both artifacts are stored under the **parent room**, even when the session ran in a 1-on-1 breakout room. Use these fields to tell them apart:

- `occurred_in_breakout_room: true` identifies a session that ran in a breakout room.
- `source_room_table_id` identifies the room where the session was served.
- `reference_artifact_id` links usage to its summary.

For example, a school can report usage per class by grouping on the parent room ID, and still see which sessions were per-student breakouts.

### BYOK Billing Suppression

When a room uses its own provider through `custom_provider` (BYOK), the server treats the session as **outside platform billing**:

- The three `*_estimated_cost` fields are **not included** in the usage artifact.
- The breakdown includes `custom_provider_<provider>: 1`. Your billing or webhook code can read this flag to skip platform charges.
- Token counts are still recorded, so you can track usage even when you pay the provider directly.

Use this flag in your billing logic:

```js
const usage = artifact.metadata.token_usage;
const isBYOK = Object.keys(usage.breakdown || {}).some(k => k.startsWith('custom_provider_'));

if (!isBYOK) {
  // Charge the platform cost for this room, using usage.total_tokens_estimated_cost
}
```

## Using Artifacts in Your Systems

| Goal | Fields to use |
| --- | --- |
| Show a teacher a student report | `evaluation`, `quiz_evaluation`, `continuation`, `narrative_summary` |
| Feed a CRM | `user_info.ex_user_id`, `session.duration_seconds`, `quiz_evaluation.accuracy_percent`, `narrative_summary` |
| Continue the next session | `continuation.previous_session_context_prompt` |
| Track platform cost | `AI_AGENT_USAGE`, `total_tokens_estimated_cost`, and the absence of `custom_provider_*` |
| Find which tools were used | `workspace_activity.tools_used` |

For the continuity flow, see [Multi-Session Continuity](/docs/ai-agent/developer-guide#multi-session-continuity-flow). For configuring prices, see [Pricing Tables](/docs/ai-agent/configuration#pricing-tables).

## Privacy Notes

- The summary contains learner and visitor information, and quiz answers. Treat it as personal data under your privacy policy.
- The summary is an evaluation, not a transcript. Transcripts are a separate artifact type.
- Your server controls how long artifacts are kept.

See the [Security Overview](/docs/security-overview#86-ai-service-artifacts) for how AI service artifacts are stored and retained.

## Related Pages

- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation)
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization)
- [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat)
- [Developer & API Guide](/docs/ai-agent/developer-guide)
- [Server & Provider Setup](/docs/ai-agent/configuration)
- [Webhooks](/docs/others/webhooks)
- [Fetch Artifacts API](/docs/api/artifact/fetch)
