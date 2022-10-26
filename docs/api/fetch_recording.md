---
sidebar_position: 8
---
# Fetch recordings

End point: `/recording/fetch`


| Field    | Type   | Position | Required | Description                  |
| ---------- | -------- | ---------- | :--------- | ------------------------------ |
| room_ids | array  | root     | Yes      | Array of room Ids'           |
| from     | number | root     | No       | From point. Default 0        |
| limit    | number | root     | No       | Limit of records. Default 20 |
| order_by | string | root     | No       | Ordering. Default: DESC      |

**Example**:

```json
{
  "room_ids": ["room01"],
  "from": 0,
  "limit": 20,
  "order_by": "DESC"
}
```

## Response


| Field              | Type    | Position        | Description                              |
| :------------------- | --------- | ----------------- | :----------------------------------------- |
| status             | boolean | root            | The status of the request                |
| msg                | string  | root            | Response message                         |
| [result](#result)             | object  | root            |                                          |


### Result


| Field            | Type                   | Description                              |
| ------------------ | ------------------------ | ------------------------------------------ |
| total_recordings | number                 | Total number of recordings for the query |
| from             | number                 | Requested from point                     |
| limit            | number                 | Requested limit of records               |
| order_by         | string                 | Record order                             |
| [recordings_list](#recordings-list)  | Array<recordings_list> |                                          |

### Recordings list


| Field              | Type   | Description                         |
| -------------------- | -------- | ------------------------------------- |
| record_id          | string | Record internal ID                  |
| room_id            | string | Room Id                             |
| room_sid           | string | Room Sid                            |
| file_path          | string | File path                           |
| file_size          | number | File size                           |
| creation_time      | number | Record creation time in unix format |
| room_creation_time | number | Room creation time in unix format |
