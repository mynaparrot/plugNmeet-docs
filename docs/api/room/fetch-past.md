---
sidebar_position: 6
---

# Fetch Past Rooms Information

Endpoint: `/room/fetchPastRooms`

## Request Parameters

| Field    | Type   | Required | Description                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| room_ids | array  | Yes      | Array of room IDs to query.                 |
| from     | number | No       | Starting index for records. Default is 0.   |
| limit    | number | No       | Maximum number of records to return. Default is 20. |
| order_by | string | No       | Sort order: `DESC` or `ASC`. Default is `DESC`. |

**Example Request:**

```json
{
  "room_ids": ["room01"],
  "from": 0,
  "limit": 20,
  "order_by": "DESC"
}
```

## Response

| Field             | Type                        | Position | Description                       |
| ----------------- | -------------------------- | -------- | --------------------------------- |
| status            | boolean                     | root     | Indicates if the request was successful. |
| msg               | string                      | root     | Response message.                 |
| [result](#result) | object                      | root     | Contains the results data.        |

### Result

| Field            | Type                                      | Description                                 |
| ---------------- | ----------------------------------------- | ------------------------------------------- |
| total_rooms      | number                                    | Total number of rooms found for the query.  |
| from             | number                                    | Starting index for the returned records.    |
| limit            | number                                    | Number of records returned.                 |
| order_by         | string                                    | Sort order used for the records.            |
| rooms_list       | Array\<[Past Room Info](#past-room-info)> | List of past room records.                  |

### Past Room Info

| Field               | Type   | Description                                                                                   |
| ------------------- | ------ | --------------------------------------------------------------------------------------------- |
| room_title          | string | Title of the room.                                                                            |
| room_id             | string | Unique identifier for the room.                                                               |
| room_sid            | string | SID of the room.                                                                              |
| joined_participants | number | Number of participants who joined (may not be exact; use analytics for detailed information). |
| webhook_url         | string | Webhook URL associated with the room.                                                         |
| created             | string | Room creation time.                                                                           |
| ended               | string | Room end time.                                                                                |
| analytics_file_id   | string | Analytics file identifier, if available.                                                      |
