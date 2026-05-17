---
title: Get Recording Info API | plugNmeet API Reference
description: API endpoint documentation to get detailed information about a specific recording, including its size, duration, and download link.
keywords: [api, get recording info, recording details, recording api, endpoint]
sidebar_position: 2
sidebar_label: Recording Info
---

# Recording info

Endpoint: `/recording/info`

| Field     | Type   | Position | Required | Description                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | root     | Yes      | Recording Id that you want to get details |

**Example**:

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Response

| Field                                                          | Type    | Position | Description               |
|:---------------------------------------------------------------| ------- | -------- | :------------------------ |
| status                                                         | boolean | root     | The status of the request |
| msg                                                            | string  | root     | Response message          |
| status_code | number | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| [recording_info](/docs/api/recording/fetch#recording-info)     | obect\<[Recording Info](/docs/api/recording/fetch#recording-info)> | root     | Response message          |
| [room_info](/docs/api/room/fetch-past#past-room-info)          | obect\<[past-room-info](/docs/api/room/fetch-past#past-room-info)> | root     | Response message          |
