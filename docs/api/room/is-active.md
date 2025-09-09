---
sidebar_position: 3
---

# Room Status (Active/Inactive)

Endpoint: `/room/isRoomActive`

| Field   | Type   | Position | Required | Description           |
| ------- | ------ | -------- | :------- | --------------------- |
| room_id | string | root     | Yes      | The unique ID of the room to check. |

**Example Request:**

```json
{
  "room_id": "room01"
}
```

## Response

| Field     | Type    | Position | Description                          |
| :-------- | ------- | -------- | :----------------------------------- |
| status    | boolean | root     | Indicates if the request was successful. |
| is_active | boolean | root     | Indicates whether the room is currently active. |
| msg       | string  | root     | Response message.                    |
