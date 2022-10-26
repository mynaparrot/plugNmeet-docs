---
sidebar_position: 8
---
# Fetch recordings

End point: `/recording/fetch`


| Field    | Type   | Required | Description                  |   |
| ---------- | -------- | ---------- | :----------------------------- | --- |
| room_ids | array  | Yes      | Array of room Ids'           |   |
| from     | number | No       | From point. Default 0        |   |
| limit    | number | No       | Limit of records. Default 20 |   |
| order_by | string | No       | Ordering. Default: DESC      |   |

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


| Field             | Type    | Position | Description               |
| :------------------ | --------- | ---------- | :-------------------------- |
| status            | boolean | root     | The status of the request |
| msg               | string  | root     | Response message          |
| [result](#result) | object<[result](#result)>  | root     |                           |

### Result


| Field                               | Type                   | Description                              |
| ------------------------------------- | ------------------------ | ------------------------------------------ |
| total_recordings                    | number                 | Total number of recordings for the query |
| from                                | number                 | Requested from point                     |
| limit                               | number                 | Requested limit of records               |
| order_by                            | string                 | Record order                             |
| [recordings_list](#recording-list) | Array<[recording_list](#recording-list)> |                                          |

### Recording list


| Field              | Type   | Description                         |
| -------------------- | -------- | ------------------------------------- |
| record_id          | string | Record internal ID                  |
| room_id            | string | Room Id                             |
| room_sid           | string | Room Sid                            |
| file_path          | string | File path                           |
| file_size          | number | File size                           |
| creation_time      | number | Record creation time in unix format |
| room_creation_time | number | Room creation time in unix format   |
