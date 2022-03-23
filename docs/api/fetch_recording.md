---
sidebar_position: 8
---

# Fetch recordings

End point: `/recording/fetch`

| Field    | Type   | Position | Required | Description                  |
| -------- | ------ | -------- | :------- | ---------------------------- |
| room_id  | string | root     | Yes      | Room Id                      |
| from     | number | root     | Yes      | From point. Default 0        |
| limit    | number | root     | Yes      | Limit of records. Default 20 |
| order_by | string | root     | Yes      | Ordering. Default: DESC      |

**Example**:

```
{
  "room_ids": "room01",
  "from": 0,
  "limit": 20,
  "order_by": "DESC"
}
```
