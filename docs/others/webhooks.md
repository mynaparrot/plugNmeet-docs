---
description: plugNmeet webhooks
sidebar_position: 2
---
# Webhooks

plugNmeet will notify different events to the provided URL. This URL can be added in server configuration or during create room.

## Receiving webhooks
Webhook requests are HTTP POST requests sent to URLs that you had configured either in server `config.yml` file or during create room. A WebhookEvent is encoded as JSON and sent in the body of the request.

The `Content-Type` header of the request is set to `application/webhook+json`. Please ensure your webserver is configured to receive payloads with this content type.

plugNmeet will use same security pattern that livekit is following. In order to ensure webhook requests are coming from plugNmeet, these requests has `Authorization` and `Hash-Token` headers containing a signed JWT token. The token includes a `sha256` hash of the payload. You can quickly have a look example in PHP from [webhook.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/webhook.php).

## Events
You can review the code from [here](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common.proto#L8C9-L8C26).
In addition to the fields below, all webhook events will include the following fields:

- `id` - a UUID identifying the event
- `createdAt` - UNIX timestamp in seconds

### Room created
```js
interface CommonNotifyEvent {
  event: 'room_created'
  room: Room
}
```

### Room started
```js
interface CommonNotifyEvent {
  event: 'room_started'
  room: Room
}
```

### Room finished
```js
interface CommonNotifyEvent {
  event: 'room_finished'
  room: Room
}
```

### Participant joined
```js
interface CommonNotifyEvent {
  event: 'participant_joined'
  room: Room
  participant: ParticipantInfo
}
```

### Participant left
```js
interface CommonNotifyEvent {
  event: 'participant_left'
  room: Room
  participant: ParticipantInfo
}
```

### Track Published

In the Room and Participant objects, only sid, identity, and name are sent.
```js
interface CommonNotifyEvent {
  event: 'track_published'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Track Unpublished

In the Room and Participant objects, only sid, identity, and name are sent.
```js
interface CommonNotifyEvent {
  event: 'track_unpublished'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Recording started
```js
interface CommonNotifyEvent {
  event: 'start_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Recording ended
```js
interface CommonNotifyEvent {
  event: 'end_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Recording proceeded
```js
interface CommonNotifyEvent {
  event: 'recording_proceeded'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP started
```js
interface CommonNotifyEvent {
  event: 'start_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP ended
```js
interface CommonNotifyEvent {
  event: 'end_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Speech to text session started
```js
interface CommonNotifyEvent {
  event: 'speech_to_text_session_started'
  room: Room
  speech_service: SpeechServiceEvent
}
```

### Speech to text session ended
```js
interface CommonNotifyEvent {
  event: 'speech_to_text_session_ended'
  room: Room
  speech_service: SpeechServiceEvent
}
```

### Speech to text total usage
```js
interface CommonNotifyEvent {
  event: 'speech_to_text_total_usage'
  room: Room
  speech_service: SpeechServiceEvent
}
```

### Analytics proceeded
```js
interface CommonNotifyEvent {
  event: 'analytics_proceeded'
  room: Room
  analytics: AnalyticsEvent
}
```
