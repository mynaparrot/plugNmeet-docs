---
sidebar_position: 3
---

# Room Status (active/inactive)

End point: `/room/isRoomActive`

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
| is_active | boolean | root     | The status of the room |
| msg    | string  | root     | Response message          |
