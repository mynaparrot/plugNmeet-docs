---
title: Webhooks Guide | plugNmeet Developer Docs
description: A guide to using plugNmeet webhooks to receive real-time notifications about events in your video conference rooms, such as 'session-started' or 'user-joined'.
keywords: [webhook, webhooks, events, real-time, notifications, api, developer]
sidebar_position: 2
sidebar_label: Webhooks
---

# Webhooks

Plug-N-Meet can notify your application about various events by sending webhook requests to a specified URL. You can configure this URL in the server settings or provide it when creating a room.

## Receiving Webhooks

Webhook requests are sent as HTTP POST requests to the URLs you have configured, either in the server's `config.yml` file or during room creation. Each webhook event is encoded as JSON and included in the request body.

The request will have the `Content-Type` header set to `application/webhook+json`. Make sure your web server is configured to accept payloads with this content type.

Plug-N-Meet uses the same security pattern as LiveKit. To verify that webhook requests originate from Plug-N-Meet, each request includes `Authorization` and `Hash-Token` headers containing a signed JWT token. The token includes a SHA256 hash of the payload. For a PHP example, see [webhook.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/webhook.php).

## Events

You can review the event definitions [here](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common.proto#L8C9-L8C26).

All webhook events include the following fields:
- `id`: A UUID identifying the event
- `createdAt`: UNIX timestamp in seconds

### Room Created

```js
interface CommonNotifyEvent {
  event: 'room_created'
  room: Room
}
```

### Room Started

```js
interface CommonNotifyEvent {
  event: 'room_started'
  room: Room
}
```

### Room Finished

```js
interface CommonNotifyEvent {
  event: 'room_finished'
  room: Room
}
```

### Participant Joined

```js
interface CommonNotifyEvent {
  event: 'participant_joined'
  room: Room
  participant: ParticipantInfo
}
```

### Participant Left

```js
interface CommonNotifyEvent {
  event: 'participant_left'
  room: Room
  participant: ParticipantInfo
}
```

### Track Published

Only `sid`, `identity`, and `name` are included in the Room and Participant objects.

```js
interface CommonNotifyEvent {
  event: 'track_published'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Track Unpublished

Only `sid`, `identity`, and `name` are included in the Room and Participant objects.

```js
interface CommonNotifyEvent {
  event: 'track_unpublished'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Recording Started

```js
interface CommonNotifyEvent {
  event: 'start_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Recording Ended

```js
interface CommonNotifyEvent {
  event: 'end_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Recording Proceeded

```js
interface CommonNotifyEvent {
  event: 'recording_proceeded'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Started

```js
interface CommonNotifyEvent {
  event: 'start_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Ended

```js
interface CommonNotifyEvent {
  event: 'end_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Speech-to-Text Session Started

```js
interface CommonNotifyEvent {
  event: 'speech_to_text_session_started'
  room: Room
  speech_service: SpeechServiceEvent
}
```

### Speech-to-Text Session Ended

```js
interface CommonNotifyEvent {
  event: 'speech_to_text_session_ended'
  room: Room
  speech_service: SpeechServiceEvent
}
```

### Speech-to-Text Total Usage

```js
interface CommonNotifyEvent {
  event: 'speech_to_text_total_usage'
  room: Room
  speech_service: SpeechServiceEvent
}
```

### Analytics Proceeded

```js
interface CommonNotifyEvent {
  event: 'analytics_proceeded'
  room: Room
  analytics: AnalyticsEvent
}
```
