---
title: End Room API | plugNmeet API Reference
description: API endpoint documentation to forcefully end an active video conference room and disconnect all participants.
keywords: [api, end room, close room, terminate meeting, room api, endpoint]
sidebar_position: 7
sidebar_label: End
---

# End room

Endpoint: `/room/endRoom`

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
| :----- | ------- | -------- | :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
