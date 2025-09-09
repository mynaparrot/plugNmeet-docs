---
sidebar_position: 5
---

# Get active rooms info

Endpoint: `/room/getActiveRoomsInfo`

**Example**:

```json
{}
```

## Response

| Field  | Type    | Position | Description                                                                               |
| :----- | ------- | -------- | :---------------------------------------------------------------------------------------- |
| status | boolean | root     | The status of the request                                                                 |
| msg    | string  | root     | Response message                                                                          |
| rooms  | array\<[room](/docs/api/room/room-info#room)>   | root     | Array of Room |
