---
sidebar_position: 6
---

# Get active rooms info

End point: `/room/getActiveRoomsInfo`

**Example**:

```
{}
```

## Response

| Field  | Type    | Position | Description                                                                               |
| :----- | ------- | -------- | :---------------------------------------------------------------------------------------- |
| status | boolean | root     | The status of the request                                                                 |
| msg    | string  | root     | Response message                                                                          |
| rooms  | array   | root     | Array of Rooms. You can check from here: [get_room_info#response](get_room_info#response) |
