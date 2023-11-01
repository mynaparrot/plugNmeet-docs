---
sidebar_position: 1
---
# Fetch analytics

End point: `/analytics/fetch`


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
| total_analytics                   | number                                   | Total number of analytics for the query |
| from                               | number                                   | Requested from point                     |
| limit                              | number                                   | Requested limit of records               |
| order_by                           | string                                   | Record order                             |
| analytics_list | Array\<[analytics-info](#analytics-info)> |                                          |

### Analytics info


| Field              | Type   | Description                         |
| -------------------- | -------- | ------------------------------------- |
| room_id          | string | Room Id                  |
| file_id            | string | File Id                             |
| file_name           | string | File name                            |
| file_size          | number | File size                           |
| creation_time      | number | Creation time in unix format |
| room_creation_time | number | Room creation time in unix format   |
