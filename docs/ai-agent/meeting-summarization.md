---
title: "AI Meeting Summarization: Automated Notes, Webhooks & Artifacts"
description: "How plugNmeet generates post-meeting AI summaries in self-hosted WebRTC rooms: independent mixed-audio capture, Gemini and OpenAI providers, custom prompts, JetStream batch jobs, and artifact retrieval."
keywords: [ai meeting summarization, automated meeting notes, ai meeting summary webhook, self-hosted meeting notes, lecture summary ai, sales call summary, gemini audio summarization, openai meeting summary, virtual classroom notes, meeting transcript alternative, plugnmeet insights, ai notes artifact]
sidebar_label: AI Meeting Summarization
sidebar_position: 7
---

# AI Meeting Summarization

Meeting summarization produces a written summary of a session without anyone taking notes. It is a separate pipeline from live captions: it records a hidden mixed-audio track, processes it after the meeting, and leaves a text summary plus a token-usage record behind.

## How It Works: An Independent Audio Capture Pipeline

Summarization does **not** require live transcription or captions to be enabled. It runs its own capture path:

1. A moderator starts summarization in the room.
2. The server spawns a dedicated hidden `RoomAgent` with `CaptureAllParticipantsTracks: true`.
3. That agent mixes every participant's audio track in real time into an internal 16 kHz mono WAV stream, written as `mixed_audio_<ts>.wav`.
4. The mixed file is used only for the summarization job. It is never exposed as a recording artifact and is deleted after processing.

Because the capture is a mix rather than per-speaker tracks, the summary reflects the conversation as a whole. It does not produce per-speaker attribution, and it is not a replacement for a transcript when you need speaker labels.

## Supported Providers

| Provider | Approach |
| --- | --- |
| Google Gemini (`google`) | Batch audio summarization: the mixed WAV is uploaded through the Gemini Files API and summarized with `Batches.Create` using `summarize_model`. |
| OpenAI (`openai`) | Chunked audio transcription (`/v1/audio/transcriptions`) followed by LLM summarization with `summarize_model`, then the chunks are combined into a single summary. Works with any OpenAI-compatible endpoint. |

Both providers use the `meeting_summarizing` service entry in `config.yaml`, including its `pricing` table. See [Server & Provider Setup](/docs/ai-agent/configuration) and the [Google Gemini](/docs/ai-agent/providers/google) and [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai) provider guides.

:::info Azure
Native Azure Cognitive Services (`provider: "azure"`) does not implement `meeting_summarizing`. To keep summarization on Microsoft Azure, define an Azure OpenAI resource as a `providers.openai` account — see the [Microsoft Azure Provider Guide](/docs/ai-agent/providers/azure).
:::

## Two-Stage Control Lifecycle

### Step 1: Room Creation (`/room/create`)

```json
{
  "room_id": "weekly-sync",
  "metadata": {
    "room_title": "Weekly product sync",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_features": {
          "is_allow": true,
          "meeting_summarization_features": {
            "is_allow": true,
            "summarization_prompt": "Summarize decisions, owners, and due dates. Keep it under 300 words."
          }
        }
      }
    }
  }
}
```

| Field | Required | Effect |
| --- | --- | --- |
| `ai_features.is_allow` | Yes | Master switch for generative AI features, including summarization. |
| `meeting_summarization_features.is_allow` | Yes | Allows summarization in this room. |
| `meeting_summarization_features.summarization_prompt` | No | Custom instruction that shapes the output. |

`summarization_prompt` is where the output format is decided. A lecture prompt can ask for definitions, key claims, and homework; a medical or legal prompt can ask for decisions, risks, and follow-ups; a sales prompt can ask for objections, next steps, and competitors mentioned; a standup prompt can ask for per-person updates and blockers.

### Step 2: In-Meeting Moderator Activation

A moderator starts summarization from the room UI, or through the runtime control endpoint. Starting it can also supply a prompt, which overrides the room-level `summarization_prompt` for that session.

When audio capture begins, every participant receives a room notification using the translation key `insights.meeting-summarization.enabled-notification-all`. Capture is announced, not silent. If the moderator stops summarization early, the capture closes and the audio collected so far is processed normally.

## Post-Meeting Batch Processing & Fail-Safe Lifecycle

Summarization is asynchronous. Nothing is generated while the meeting is running except the audio file.

1. **Meeting ends, or the moderator stops summarization.** The audio mixer closes the WAV stream.
2. **A durable job is enqueued.** The server publishes a JetStream job to `pnm-insights-jobs-summarize`. Because the job lives in a durable stream, a server restart does not lose it.
3. **Retries are automatic.** `SummarizeJobMaxDeliverNum = 3` with backoff between attempts. A provider timeout or rate limit is retried rather than dropped.
4. **The background janitor polls the job.** It waits for completion, then creates the artifacts.
5. **Cleanup runs last.** The temporary file uploaded to the provider is deleted, and the local `mixed_audio_<ts>.wav` file is removed. Neither is kept.

## Artifacts, Webhooks & Retrieval

Summarization emits two artifacts through the [`artifact_created`](/docs/others/webhooks#artifact-created) webhook. Both are forced into the reliable webhook queue, so a temporarily unreachable endpoint does not silently drop them.

| Artifact | Type | Payload |
| --- | --- | --- |
| `MEETING_SUMMARY` | `2` | Plain-text file `summary_<roomSid>-<ts>.txt`, mime type `text/plain`. |
| `MEETING_SUMMARY_USAGE` | `3` | `token_usage`: `prompt_tokens`, `completion_tokens`, `total_tokens`, `estimated_cost`, with `reference_artifact_id` pointing at the `MEETING_SUMMARY` artifact. |

`estimated_cost` is calculated from `insights.services.meeting_summarizing.pricing[summarize_model]`. If that pricing entry is missing, the usage record is still written but carries no cost estimate.

### Receiving a summary in your backend

1. Listen for `artifact_created` and check `room_artifact.type`.
2. Call [`/auth/artifact/fetch`](/docs/api/artifact/fetch) with `room_ids` or `room_sid` to list artifacts after a reconnect or a missed webhook.
3. Call [`/auth/artifact/getDownloadToken`](/docs/api/artifact/download) with the `artifact_id` of the summary, then download the file with the returned token.

```javascript
switch (payload.room_artifact.type) {
  case 2: {
    // MEETING_SUMMARY: a file. Ask for a download token.
    const { token } = await api.post('/auth/artifact/getDownloadToken', {
      artifact_id: payload.room_artifact.artifact_id,
    });
    const file = await downloadWithToken(token);
    await saveSummary(payload.room.room_id, file);
    break;
  }
  case 3:
    // MEETING_SUMMARY_USAGE: metadata only, no file to download.
    await recordTokenUsage(payload.room_artifact.metadata.token_usage);
    break;
}
```

:::note Usage records are not files
`MEETING_SUMMARY_USAGE` has no downloadable body. Calling the download-token endpoint for type `3` is not meaningful; read the usage fields directly from the webhook payload or from `/auth/artifact/fetch`.
:::

The shared artifact model, including breakout-room attribution, is described in [Summaries & Usage Artifacts](/docs/ai-agent/artifacts-and-billing). For live captions and transcript files, see [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation).

## Related Pages

- [Overview & Insights Framework](/docs/ai-agent/overview)
- [Server & Provider Setup](/docs/ai-agent/configuration): `meeting_summarizing` providers, models, and token pricing.
- Provider guides: [Google Gemini](/docs/ai-agent/providers/google), [OpenAI & Self-Hosted](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure).
- [In-Meeting AI Text Chat](/docs/ai-agent/ai-text-chat): a moderator copilot that can start summarization on request.
- [`/room/create` insights features](/docs/api/room/create#insights-features)
- [Webhooks](/docs/others/webhooks#artifact-created)
