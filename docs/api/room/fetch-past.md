---
sidebar_position: 6
---
# Fetch past rooms info

End point: `/room/fetchPastRooms`


| Field    | Type   | Required | Description                         |
| ---------- | -------- | ---------- | :------------------------------------ |
| room_ids | array  | Yes      | Array of room Ids'                  |
| from     | number | No       | From point. Default 0               |
| limit    | number | No       | Limit of records. Default 20        |
| order_by | string | No       | Ordering DESC or ASC. Default: DESC |

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


| Field             | Type                      | Position | Description               |
| :------------------ | --------------------------- | ---------- | :-------------------------- |
| status            | boolean                   | root     | The status of the request |
| msg               | string                    | root     | Response message          |
| [result](#result) | object\<[result](#result)> | root     |                           |

### Result


| Field                              | Type                                     | Description                              |
| ------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| total_rooms                   | number                                   | Total number of rooms for the query |
| from                               | number                                   | Requested from point                     |
| limit                              | number                                   | Requested limit of records               |
| order_by                           | string                                   | Record order                             |
| rooms_list | Array\<[past-room-info](#past-room-info)> |                                          |

### Past Room info


| Field              | Type   | Description                         |
| -------------------- | -------- | ------------------------------------- |
| room_title          | string | Room title                  |
| room_id            | string | Room Id                             |
| room_sid           | string | Room Sid                            |
| joined_participants          | number | Number of  participants joined (may not be accurate, use analytics to get more details)                         |
| webhook_url          | string | Webhook url                           |
| created      | string | Room created time |
| ended | string | Room ended time   |
| analytics_file_id | string | Analytics file id (if any)   |
