---
title: Is Room Active API | plugNmeet API Reference
description: API endpoint documentation to check if a video conference room is currently active and has participants.
keywords: [api, is active, check room, room status, room api, endpoint]
sidebar_position: 3
sidebar_label: Room Status
---

# Room Status (Active/Inactive)

Endpoint: `/room/isRoomActive`

This endpoint allows you to check whether a room session is currently active. A room is considered "active" if it has been created and has not yet been terminated.

This is a simple way to determine if a meeting is in progress. It's often used in application logic to decide whether to create a new room or allow a user to join an existing one. For example, before calling the `create` API, you can use this endpoint to see if a session with the same `room_id` is already running.

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
| :-------- | ------- |----------| :----------------------------------- |
| status    | boolean | root     | Indicates if the request was successful. |
| is_active | boolean | root     | Indicates whether the room is currently active. |
| msg       | string  | root     | Response message.                    |
| status_code | number  | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
