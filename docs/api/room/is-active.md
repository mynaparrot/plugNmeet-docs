---
title: Is Room Active API | plugNmeet API Reference
description: API endpoint documentation to check if a video conference room is currently active and has participants.
keywords: [api, is active, check room, room status, room api, endpoint]
sidebar_position: 3
sidebar_label: Room Status
---

# Room Status (Active/Inactive)

Endpoint: `/room/isRoomActive`

| Field   | Type   | Position | Required | Description           |
| ------- | ------ | -------- | :------- | --------------------- |
| room_id | string | root     | Yes      | The unique ID of the room to check. |

**Example Request:**

```json
{
  "room_id": "room01"
}
```

## Response

| Field     | Type    | Position | Description                          |
| :-------- | ------- | -------- | :----------------------------------- |
| status    | boolean | root     | Indicates if the request was successful. |
| is_active | boolean | root     | Indicates whether the room is currently active. |
| msg       | string  | root     | Response message.                    |
