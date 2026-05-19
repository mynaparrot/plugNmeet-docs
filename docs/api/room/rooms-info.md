---
title: Get All Active Rooms Info API | plugNmeet API Reference
description: API endpoint documentation to fetch detailed information and metadata about all active video conference rooms.
keywords: [api, get room info, fetch room, room details, room api, endpoint]
sidebar_position: 5
sidebar_label: Active Rooms Info
---

# Get active rooms info

Endpoint: `/room/getActiveRoomsInfo`

This endpoint provides a comprehensive overview of all currently active rooms on the server. It returns an array of room objects, each containing the same detailed information as the `/room/getActiveRoomInfo` endpoint, including participant lists and room metadata.

This is a powerful tool for server-wide monitoring and administration. It's ideal for building a real-time dashboard that shows all ongoing meetings, the number of participants in each, and other session details.

**Example**:

```json
{}
```

## Response

| Field  | Type    | Position | Description                                                                               |
| :----- | ------- | -------- | :---------------------------------------------------------------------------------------- |
| status | boolean | root     | The status of the request                                                                 |
| msg    | string  | root     | Response message                                                                          |
| status_code | number | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| rooms  | array\<[room](/docs/api/room/room-info#room)>   | root     | Array of Room |
