---
title: Get All Active Rooms Info API | plugNmeet API Reference
description: API endpoint documentation to fetch detailed information and metadata about all active video conference rooms.
keywords: [api, get room info, fetch room, room details, room api, endpoint]
sidebar_position: 5
sidebar_label: Rooms Info
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
