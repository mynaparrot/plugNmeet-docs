---
title: End Room API | plugNmeet API Reference
description: API endpoint documentation to forcefully end an active video conference room and disconnect all participants.
keywords: [api, end room, close room, terminate meeting, room api, endpoint]
sidebar_position: 9
sidebar_label: End
---

# End room

Endpoint: `/room/endRoom`

This endpoint allows you to forcefully terminate a live room session. When you call this API with a `room_id`, the session is immediately closed, and all participants are disconnected.

This is a server-side administrative action, typically used to moderate sessions or to ensure that a meeting has definitively concluded. For example, you might integrate this into a "End Meeting for All" button in your application's administrative dashboard. Once a room is ended, its data is cleared, and it can be recreated for a new session.

| Field   | Type   | Position | Required | Description |
| ------- | ------ | -------- | :------- | ----------- |
| room_id | string | root     | Yes      | Room Id     |

**Example**:

```json
{
  "room_id": "room01"
}
```

## Response

| Field  | Type    | Position | Description               |
| :----- | ------- |----------| :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
| status_code | number | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
