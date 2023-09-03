---
sidebar_position: 14
---

# Get active rooms info

End point: `/room/getActiveRoomsInfo`

**Example**:

```json
{}
```

## Response

| Field  | Type    | Position | Description                                                                               |
| :----- | ------- | -------- | :---------------------------------------------------------------------------------------- |
| status | boolean | root     | The status of the request                                                                 |
| msg    | string  | root     | Response message                                                                          |
| rooms  | array<[room](/docs/api/get_room_info.md#room)>   | root     | Array of Room |
