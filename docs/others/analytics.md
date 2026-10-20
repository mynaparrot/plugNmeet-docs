---
title: Meeting Analytics & Reports | Deep Session Insights | plugNmeet
description: Generate meeting analytics reports with plugNmeet — deep analytics on attendance, talk time, engagement, polls, and classroom performance. Raw JSON reference + PHP SDK formatter guide.
keywords: [meeting analytics, deep analytics, analytics report, meeting report, classroom performance report, attendance tracking, participant engagement, talk time report, engagement analytics, virtual classroom analytics, php sdk, AnalyticsFormatter]
sidebar_position: 1
sidebar_label: Analytics
---

# Meeting Analytics & Deep Session Reports

plugNmeet's **meeting analytics** turns every session into a **detailed analytics report**: who joined and for how long, who spoke, who chatted, voted, raised a hand, shared a screen, or struggled with connection quality. Teams use it for **meeting reports** and attendance tracking; educators use it as a **classroom performance report** to measure participation equity, engagement trends, and technology barriers.

If `enable_analytics` was set in the room's `room_features` ([room create API](/docs/api/room/create)), plugNmeet aggregates analytics events in memory during the session and writes a single JSON file when the session ends. The file is stored as an artifact of type `MEETING_ANALYTICS`.

For the why behind these metrics — engagement questions, equitable participation, and privacy-by-default design — see [From Black Box to Blueprint: Using Analytics to Understand Your Online Classroom](/blog/classroom-analytics-for-educators).

## What you can build from this data

- **Meeting attendance report:** per-user `duration` from `joined` / `left` timelines, plus `room_total_users` and `room_duration`.
- **Participant engagement analytics:** `talked` / `talked_duration`, `mic_status`, `webcam_status`, `screen_share_status`, `raise_hand`, `voted_poll`, `public_chat` / `private_chat`.
- **Classroom performance report:** combine talk time, poll votes, whiteboard annotation (`whiteboard_annotated`), chat files, and hand raises to compare participation across students or sessions. The Moodle plugin does this out of the box with cumulative attendance and activity completion rules — see [Moodle integration](/docs/user-guide/moodle-integration).
- **Connection quality report:** `connection_quality` (`excellent` / `good` / `poor`) correlated with early `left` events to distinguish disengagement from network issues.
- **Excel / LMS exports:** the Moodle, WordPress, and Joomla plugins format the same data into per-room and per-user sheets. See [WordPress artifacts](/docs/user-guide/wordPress-integration) for an example.

Analytics is **opt-in and privacy-preserving**: disabled by default, in-memory only, and permanently discarded if `enable_analytics` is false. Only metadata and counters are stored — never chat text, audio, or video content. See [Security overview](/docs/security-overview).

## How to get the analytics file

1. Enable it at room creation: `"enable_analytics": true` in `room_features`.
2. Wait for the session to end. The server exports the JSON and emits the webhook event `analytics_proceeded` with the `artifact_id` — see [Webhooks](/docs/others/webhooks).
3. List files with [`/artifact/fetch`](/docs/api/artifact/fetch) using `"type": "MEETING_ANALYTICS"`.
4. Get a one-time token from [`/artifact/getDownloadToken`](/docs/api/artifact/download), then download:
   `GET https://Your-Server/download/artifact/<TOKEN>`

The deprecated `/analytics/fetch` and `/analytics/getDownloadToken` endpoints still work but will be removed. Use `/artifact/*` for new code.

## Raw analytics JSON format

The raw file is intentionally low level — a complete event log, not a ready-made report. Don't aggregate it by hand; use the [PHP SDK formatter](#format-with-the-php-sdk) below.

Top level is always:

```json
{
  "room": {},
  "users": []
}
```

### Room object

Base fields are written directly (see `AnalyticsRoomInfo` and `exportAnalyticsToJSON` in the server):

| Field | Type | Notes |
| ----- | ---- | ----- |
| `room_id` | string | Your `room_id`. |
| `room_title` | string | Room title at end time. |
| `room_total_users` | int | Number of distinct users seen. |
| `room_creation` | int | Unix seconds. |
| `room_ended` | int | Unix seconds. |
| `room_duration` | int | Seconds, `room_ended - room_creation`. |
| `enabled_e2ee` | bool | From room metadata. |
| `events` | array | Low-level event list, see below. |

### User object

```json
{
  "user_id": "111",
  "name": "Test User",
  "is_admin": false,
  "ex_user_id": "111",
  "events": []
}
```

`user_id` is the internal LiveKit participant ID, `ex_user_id` is the `userId` you passed in the join token (empty if `auto_gen_user_id` was used).

### Event object

Both room and user events share the same shape:

```json
{
  "name": "joined",
  "total": 6,
  "values": [{ "time": 1500000, "value": "1500000" }]
}
```

- `name` is the proto `AnalyticsEvents` name lowercased with the `ANALYTICS_EVENT_ROOM_` / `ANALYTICS_EVENT_USER_` prefix stripped, e.g. `poll_added`, `recording_status`, `joined`, `mic_status`. This stripping is done in `processEventKey`.
- `time` is Unix **milliseconds**.
- `total` / `values` encoding depends on how the server stored the event in Redis:
  - `HSET` (timestamped events like `joined`, `mic_status`): `total` = number of entries, `values` = full list.
  - `INCRBY` (counters like `talked`, `public_chat`): `total` = counter, `values` is empty.
  - `SET` (string values): `total` = `1`, `values` has one entry.

Known event names (from `plugnmeet_analytics.proto`):

Room: `poll_added`, `recording_status`, `rtmp_status`, `breakout_room`, `shared_notepad_status`, `external_display_link_status`, `external_media_player_status`, `speech_service_status`, `speech_service_total_usage`, `ingress_created`, `whiteboard_files`, insights/transcription/translation counters.

User: `joined`, `left`, `mic_status`, `talked`, `talked_duration` (ms), `webcam_status`, `screen_share_status`, `voted_poll`, `public_chat`, `private_chat`, `chat_files`, `whiteboard_annotated`, `whiteboard_files`, `speech_services_usage`, `speech_services_status`, `interface_visibility`, `raise_hand`, `connection_quality`, `reaction`.

Status values inside `mic_status` / `webcam_status` / room status events use prefixes like `ANALYTICS_STATUS_STARTED`, `ANALYTICS_STATUS_ENDED`, `ANALYTICS_STATUS_MUTED`, or `excellent` / `good` / `poor` for connection quality.

:::caution[Fields evolve with new features]
New plugNmeet features can add or extend room fields, user fields, and event names at any time, so the lists above are a snapshot, not a fixed schema. Before parsing strictly or validating against hardcoded field names, always check the release notes and the authoritative [`plugnmeet_analytics.proto`](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_analytics.proto) file. When using the PHP SDK, prefer `getRoomFields()` / `getUserFields()` over hardcoded lists so your code picks up new fields automatically.
:::

## Format with the PHP SDK

The [`plugNmeet-sdk-php`](https://github.com/mynaparrot/plugNmeet-sdk-php) package ships `Mynaparrot\Plugnmeet\AnalyticsFormatter`, which converts the raw JSON into an attendance-ready meeting report. The Moodle, WordPress, and Joomla plugins use the same class to generate their Excel exports.

```bash
composer require mynaparrot/plugnmeet-sdk
```

### 1. Fetch and download the JSON

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use Mynaparrot\Plugnmeet\PlugNmeet;
use Mynaparrot\PlugnmeetProto\FetchArtifactsReq;
use Mynaparrot\PlugnmeetProto\GetArtifactDownloadTokenReq;
use Mynaparrot\PlugnmeetProto\RoomArtifactType;

$pnm = new PlugNmeet('https://your-server', 'api-key', 'api-secret');

// list analytics artifacts for a room
$req = new FetchArtifactsReq();
$req->setRoomIds(['room01']);
$req->setType(RoomArtifactType::MEETING_ANALYTICS);
$res = $pnm->fetchArtifacts($req);

$artifactId = $res->getResult()->getArtifactsList()[0]->getArtifactId();

// download
$tokenReq = new GetArtifactDownloadTokenReq();
$tokenReq->setArtifactId($artifactId);
$token = $pnm->getArtifactDownloadToken($tokenReq)->getToken();

$json = file_get_contents('https://your-server/download/artifact/' . $token);
$raw = json_decode($json, true);
```

### 2. Format it into a report

```php
use Mynaparrot\Plugnmeet\AnalyticsFormatter;

$formatter = new AnalyticsFormatter($raw, 'Asia/Dhaka');
$data = $formatter->getFormattedEventData();

$room  = $data['room'];   // associative array
$users = $data['users'];  // list of associative arrays

// helpers
echo $formatter->formatTimestamp($raw['room']['room_creation'], false);
echo $formatter->formatSecondsToTime($room['room_duration']);
print_r($formatter->getRoomFields());
print_r($formatter->getUserFields());
```

The wrapper in the SDK examples does the same in one call:

```php
$formatter = plugNmeetConnect::getAnalyticsFormatter($json, $userTimezone);
```

Invalid timezones fall back to `UTC`.

### What the formatter produces

Room fields (`getRoomFields()`):

```
room_id, room_title, room_creation, room_ended, room_duration,
room_total_users, enabled_e2ee, recording_status, rtmp_status,
shared_notepad_status, ingress_created, breakout_room,
external_display_link_status, external_media_player_status
```

Plus `polls` and `whiteboard_files` when present. `room_creation` / `room_ended` become `d-m-Y H:i:s P` strings in the given timezone. Status events become start-counts.

User fields (`getUserFields()`):

```
name, ex_user_id, is_admin, duration, joined, left, mic_status,
mic_muted, mic_duration, talked, talked_duration, webcam_status,
webcam_duration, raise_hand, voted_poll, whiteboard_annotated,
whiteboard_files, screen_share_status, public_chat, private_chat,
chat_files, interface_invisible, connection_quality
```

Key transformations:

- `joined` / `left`: sorted lists of Unix-ms timestamps.
- `duration`: total seconds present, computed from a join/left timeline. Duplicate joins are ignored, unmatched leaves are ignored, an unfinished session extends to `room_ended`, events outside `[room_creation, room_ended]` are ignored.
- `mic_duration` / `webcam_duration`: seconds between `ANALYTICS_STATUS_STARTED` and `ANALYTICS_STATUS_ENDED` (prefix match, so `ANALYTICS_STATUS_STARTED:node_01` counts). An open device session closes at user `left` or room end. Duplicate starts are ignored.
- `talked_duration`: raw `total` is milliseconds → converted to seconds with `ceil(ms / 1000)`.
- `talked`, `public_chat`, `private_chat`, `chat_files`, `whiteboard_annotated`, `raise_hand`: plain counters from `total`.
- `interface_visibility` → `interface_invisible` (count of `hidden`).
- `connection_quality` → `{ excellent, good, poor }` counts.
- `voted_poll`: per-user vote count; also increments `room.polls[poll_id].options[option_id].responses`.
- `duration`, `talked_duration`, `mic_duration`, `webcam_duration` are clamped to `min(room_duration, room_ended - room_creation)`. If room metadata is missing, the raw value is kept.

Formatted example — one row of a meeting analytics report:

```json
{
  "room": {
    "room_id": "room01",
    "room_title": "Test Room",
    "room_creation": "17-05-2026 10:00:00 +06:00",
    "room_duration": 3000,
    "recording_status": 1
  },
  "users": [
    {
      "name": "Test User",
      "duration": 1200,
      "mic_duration": 500,
      "talked_duration": 82,
      "connection_quality": { "excellent": 10, "good": 2, "poor": 0 }
    }
  ]
}
```

Use `formatSecondsToTime()` to render duration fields as `HH:MM:SS` for tables or CSV/XLSX export.

## Related resources

- [Classroom analytics for educators](/blog/classroom-analytics-for-educators) — pedagogical guide to engagement analytics.
- [Moodle integration](/docs/user-guide/moodle-integration) — cumulative classroom performance reports with attendance and activity completion.
- [Fetch artifacts API](/docs/api/artifact/fetch) and [download token API](/docs/api/artifact/download).
- [Webhooks](/docs/others/webhooks) — `analytics_proceeded` event.
- [Security overview](/docs/security-overview) — opt-in analytics and data retention.
