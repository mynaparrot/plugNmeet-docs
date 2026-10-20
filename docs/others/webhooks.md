---
title: Webhooks Guide | plugNmeet Developer Docs
description: A guide to using plugNmeet webhooks to receive real-time notifications about room and session events, such as 'room_created', 'room_started' or 'session_ended'.
keywords: [webhook, webhooks, events, real-time, notifications, api, developer]
sidebar_position: 2
sidebar_label: Webhooks
---

# Webhooks

Plug-N-Meet can notify your application about various events by sending webhook requests to a specified URL. You can configure this URL in the server settings or provide it when creating a room.

## Receiving Webhooks

Webhook requests are sent as HTTP POST requests to the URLs you have configured, either in the server's `config.yml` file or during room creation. Each webhook event is encoded as JSON and included in the request body.

The request will have the `Content-Type` header set to `application/json`. Make sure your web server is configured to accept payloads with this content type.

Plug-N-Meet uses the same security pattern as LiveKit. To verify that webhook requests originate from Plug-N-Meet, each request includes `Authorization` and `Hash-Token` headers containing a signed JWT token. The token includes a SHA256 hash of the payload. For a PHP example, see [webhook.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/webhook.php).

Every event contains `event`, `room`, `id`, and `createdAt`. `room` is a `NotifyEventRoom` with at least `room_id` and `sid`. Always match sessions by `room.room_id`. If LiveKit fails to include room info in its callback, plugNmeet drops it and never forwards it.

## Session lifecycle: which event to trust

A plugNmeet session is not the same as a LiveKit media room. `room_created` and `session_ended` are sent by plugNmeet itself and always fire. `room_started` and `room_finished` are relayed from LiveKit and only fire if at least one participant joined and LiveKit notified us.

- Use `room_created` + `session_ended` for reliable session tracking, cleanup, and billing.
- Use `room_started` + `room_finished` only for media state (e.g. someone actually joined, media room closed).

| Event | Sent by | When it fires |
|---|---|---|
| `room_created` | plugNmeet | Right after `CreateRoom` API succeeds. Always fires. |
| `room_started` | LiveKit, relayed by plugNmeet | When the LiveKit room becomes active, i.e. first participant joined. Only fires if someone joined and LiveKit notified us. |
| `room_finished` | LiveKit, relayed by plugNmeet | When the LiveKit room closes. Only fires if the room had started and LiveKit notified us. Missing if nobody ever joined. |
| `session_ended` | plugNmeet | During `EndRoom` flow, whether triggered by API `EndRoom` call or by janitor (empty timeout, duration exceeded). Always fires, even if nobody ever joined. Sent before the LiveKit room is torn down. |

If you end a session via API or janitor ends an empty session, you will always get `session_ended`. You will only get `room_finished` afterwards if the LiveKit room had actually started.

## Events

You can review the event definitions [here](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common.proto#L10).

All webhook events include the following fields:
- `id`: A UUID identifying the event
- `createdAt`: UNIX timestamp in seconds
- `room`: Contains at least `room_id`, `sid`, `creation_time`, and `metadata`

### Room Created

Sent by plugNmeet on session creation. Use it to create your local session record.

```js
interface CommonNotifyEvent {
  event: 'room_created'
  room: Room
}
```

### Room Started

Relayed from LiveKit when the media room starts. Fires only if at least one user joined. plugNmeet enriches it with `sid` and `metadata` before forwarding.

```js
interface CommonNotifyEvent {
  event: 'room_started'
  room: Room
}
```

### Room Finished

Relayed from LiveKit when the media room closes. Fires only if the room had started. If the room was ended via plugNmeet API, this may arrive after `session_ended`.

```js
interface CommonNotifyEvent {
  event: 'room_finished'
  room: Room
}
```

### Session Ended

Special plugNmeet-only event. Sent from `onAfterRoomEnded` (`pkg/models/room_end.go`) before LiveKit teardown, whenever a session is wiped by API call or janitor. Always fires. Use it as the authoritative end-of-session signal for cleanup and billing. Payload is minimal: `room_id`, `sid`, `metadata`, `creation_time`.

```js
interface CommonNotifyEvent {
  event: 'session_ended'
  room: Room
}
```

### Participant Joined

Relayed from LiveKit when a participant joins. plugNmeet overwrites `sid` and `metadata` from its own store before forwarding.

```js
interface CommonNotifyEvent {
  event: 'participant_joined'
  room: Room
  participant: ParticipantInfo
}
```

### Participant Left

Relayed from LiveKit when a participant leaves. Still sent for internal users (SIP, ingress, TTS agents).

```js
interface CommonNotifyEvent {
  event: 'participant_left'
  room: Room
  participant: ParticipantInfo
}
```

### Track Published

Relayed from LiveKit when a mic, camera, or screen-share track is published.

```js
interface CommonNotifyEvent {
  event: 'track_published'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Track Unpublished

Relayed from LiveKit when a track is unpublished/muted by stopping publication.

```js
interface CommonNotifyEvent {
  event: 'track_unpublished'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Recording Started

Sent by the recorder service when recording starts. Contains `recording_info` with record and recorder IDs.

```js
interface CommonNotifyEvent {
  event: 'start_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Recording Ended

Sent by the recorder service when recording stops. File may not be ready yet; wait for `recording_proceeded` for the downloadable file.

```js
interface CommonNotifyEvent {
  event: 'end_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Recording Proceeded

Sent when the recording file is processed and ready. This may arrive after session cleanup.

```js
interface CommonNotifyEvent {
  event: 'recording_proceeded'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Started

Sent by the recorder service when RTMP livestreaming starts.

```js
interface CommonNotifyEvent {
  event: 'start_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Ended

Sent by the recorder service when RTMP livestreaming stops.

```js
interface CommonNotifyEvent {
  event: 'end_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Artifact Created

This single, unified event is triggered whenever a new artifact is generated by the system, such as a transcription or a meeting summary. It replaces multiple older, individual webhooks with a more flexible and scalable model.

For details on the payload structure and possible artifact types, please refer to the [protobuf definition](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_room_artifacts.proto#L91).

```js
interface CommonNotifyEvent {
  event: 'artifact_created'
  room: Room
  room_artifact: RoomArtifactWebhookEvent
}
```

### Analytics Proceeded

Sent when the analytics export for a session is ready. Contains `analytics.file_id` for download.

```js
interface CommonNotifyEvent {
  event: 'analytics_proceeded'
  room: Room
  analytics: AnalyticsEvent
}
```

---

## Example Webhook Handler

The following pseudo-code demonstrates how to handle incoming webhooks. Your application should inspect the `event` property to determine what action to take. The `artifact_created` event is special, as it requires checking a nested `type` field to understand the payload.

```javascript
// A mapping from the enum number to a human-readable string.
// See the protobuf definition for the complete, up-to-date list.
const ArtifactType = {
  0: 'UNKNOWN_ARTIFACT',
  2: 'MEETING_SUMMARY',
  4: 'SPEECH_TRANSCRIPTION',
  5: 'SPEECH_TRANSCRIPTION_USAGE',
};

function handleWebhook(payload) {
  console.log(`Received event: ${payload.event}`);
  // Always match by room_id. Events without room.room_id are never sent.
  const roomId = payload.room?.room_id;

  switch (payload.event) {
    case 'room_created':
      // Reliable session start.
      console.log(`Session '${roomId}' created.`);
      break;

    case 'room_started':
      // Media room started (someone joined).
      console.log(`Room '${roomId}' has started.`);
      break;

    case 'participant_joined':
      console.log(`User '${payload.participant.name}' joined room '${roomId}'.`);
      break;

    case 'artifact_created':
      handleArtifactCreated(payload);
      break;

    case 'room_finished':
      console.log(`Room '${roomId}' has finished.`);
      break;

    case 'session_ended':
      // Authoritative session end. Always fires via API or janitor.
      console.log(`Session '${roomId}' has ended.`);
      break;

    default:
      console.log(`Received an unhandled event: ${payload.event}`);
  }
}

// A dedicated handler for the 'artifact_created' event
function handleArtifactCreated(payload) {
  const artifact = payload.room_artifact;
  const artifactType = ArtifactType[artifact.type] || 'UNKNOWN_ARTIFACT';
  
  console.log(`A new artifact of type '${artifactType}' was created.`);

  switch (artifactType) {
    case 'MEETING_SUMMARY':
    case 'SPEECH_TRANSCRIPTION':
      // These are file-based artifacts.
      if (artifact.metadata && artifact.metadata.file_info) {
        const fileInfo = artifact.metadata.file_info;
        console.log(`File available at: ${fileInfo.file_path}`);
        // Your logic here: e.g., download the file, link it to a recording.
      }
      break;
      
    case 'SPEECH_TRANSCRIPTION_USAGE':
      // This is a usage-based artifact.
      if (artifact.metadata && artifact.metadata.duration_usage) {
        const usage = artifact.metadata.duration_usage;
        console.log(`Transcription usage logged: ${usage.duration_sec} seconds.`);
        // Your logic here: e.g., update billing records.
      }
      break;
      
    default:
      console.log(`Received an unhandled artifact type: ${artifactType}`);
  }
}

// Example incoming payload for 'artifact_created' (a meeting summary)
const samplePayload = {
  "event": "artifact_created",
  "id": "EV_abc123",
  "createdAt": 1761815000,
  "room": {
    "sid": "RM_zG9e4bY2pD-1761814595173",
    "room_id": "room01"
  },
  "room_artifact": {
    "type": 2, // Corresponds to MEETING_SUMMARY
    "artifact_id": "ART_xyz789",
    "metadata": {
      "file_info": {
        "file_path": "/path/to/summary.txt",
        "file_size": 1024,
        "mime_type": "text/plain"
      }
    }
  }
};

// You would call your handler with the body of the POST request.
handleWebhook(samplePayload);
```
