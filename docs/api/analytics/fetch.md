---
sidebar_position: 1
---

# Fetch Analytics

Endpoint: `/analytics/fetch`

## Request Parameters

| Field    | Type   | Required | Description                                   |
| -------- | ------ | -------- | --------------------------------------------- |
| room_ids | array  | Yes      | Array of room IDs to fetch analytics for.     |
| from     | number | No       | Starting index for records. Default is 0.     |
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
| [result](#result) | object                      | root     | Contains the analytics data.      |

### Result

| Field            | Type                                      | Description                                 |
| ---------------- | ----------------------------------------- | ------------------------------------------- |
| total_analytics  | number                                    | Total number of analytics records found.    |
| from             | number                                    | Starting index for the returned records.    |
| limit            | number                                    | Number of records returned.                 |
| order_by         | string                                    | Sort order used for the records.            |
| analytics_list   | Array\<[analytics-info](#analytics-info)> | List of analytics records.                  |

### Analytics Info

| Field              | Type   | Description                                 |
| ------------------ | ------ | ------------------------------------------- |
| room_id            | string | The ID of the room.                         |
| file_id            | string | The ID of the analytics file.               |
| file_name          | string | The name of the analytics file.             |
| file_size          | number | The size of the file in bytes.              |
| creation_time      | number | File creation time (Unix timestamp).        |
| room_creation_time | number | Room creation time (Unix timestamp).        |
