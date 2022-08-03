---
sidebar_position: 8
---

# Fetch recordings

End point: `/recording/fetch`

| Field    | Type   | Position | Required | Description                  |
| -------- | ------ | -------- | :------- | ---------------------------- |
| room_ids | array  | root     | Yes      | Array of room Ids'           |
| from     | number | root     | No       | From point. Default 0        |
| limit    | number | root     | No       | Limit of records. Default 20 |
| order_by | string | root     | No       | Ordering. Default: DESC      |

**Example**:

```
{
  "room_ids": ["room01"],
  "from": 0,
  "limit": 20,
  "order_by": "DESC"
}
```

## Response

| Field              | Type    | Position        | Description                              |
| :----------------- | ------- | --------------- | :--------------------------------------- |
| status             | boolean | root            | The status of the request                |
| msg                | string  | root            | Response message                         |
| result             | object  | root            |                                          |
| total_recordings   | number  | result          | Total number of recordings for the query |
| from               | number  | result          | Requested from point                     |
| limit              | number  | result          | Requested limit of records               |
| order_by           | string  | result          | Record order                             |
| recordings_list    | array   | result          |                                          |
| record_id          | string  | recordings_list | Record internal ID                       |
| room_id            | string  | recordings_list | Room Id                                  |
| room_sid           | string  | recordings_list | Room Sid                                 |
| file_path          | string  | recordings_list | File path                                |
| file_size          | number  | recordings_list | File size                                |
| creation_time      | number  | recordings_list | Record creation time in unix format      |
| room_creation_time | number  | recordings_list | Room creation time in unix format        |
