---
title: Get All Rooms Info API | plugNmeet API Reference
description: API endpoint documentation to fetch information about all currently active video conference rooms on the server.
keywords: [api, get all rooms, list rooms, active rooms, room api, endpoint]
sidebar_position: 4
sidebar_label: Room Info
---

# Get Active Room Information

Endpoint: `/room/getActiveRoomInfo`

## Request Parameters

| Field   | Type   | Position | Required | Description           |
| ------- | ------ | -------- | :------- | --------------------- |
| room_id | string | root     | Yes      | The unique ID of the room. |

**Example Request:**

```json
{
  "room_id": "room01"
}
```

## Response

| Field   | Type                  | Position | Description               |
| ------- | --------------------- | -------- | ------------------------- |
| status  | boolean               | root     | Indicates if the request was successful. |
| msg     | string                | root     | Response message.         |
| room    | object\<[Room](#room)>| root     | Contains room details.    |

### Room

| Field                | Type                                         | Description                       |
| -------------------- | -------------------------------------------- | --------------------------------- |
| room_info            | object\<[Room Info](#room-info)>             | Details about the room.           |
| participants_info    | array\<[Participant Info](#participant-info)>| List of current participants.     |

### Room Info

| Field               | Type    | Description                                 |
| ------------------- | ------- | ------------------------------------------- |
| room_title          | string  | Title of the meeting.                       |
| room_id             | string  | Unique room ID.                             |
| sid                 | string  | Room unique session ID.                                   |
| joined_participants | number  | Total number of users who have joined.      |
| is_running          | boolean | Indicates if the room is currently active.  |
| is_recording        | boolean | Indicates if recording is in progress.      |
| is_active_rtmp      | boolean | Indicates if RTMP streaming is active.      |
| creation_time       | number  | Room creation time (Unix timestamp).        |
| metadata            | string  | Room metadata.                              |
| webhook_url         | string  | Webhook URL associated with the room.       |

### Participant Info

| Field      | Type    | Description                                 |
| ---------- | ------- | ------------------------------------------- |
| sid        | string  | Participant unique session ID.                            |
| identity   | string  | Participant user ID.                        |
| name       | string  | Participant name.                           |
| state      | string  | Participant state.                          |
| metadata   | string  | Participant metadata.                       |
| joined_at  | number  | Time the participant joined (Unix timestamp).|
| version    | number  | Version information.
