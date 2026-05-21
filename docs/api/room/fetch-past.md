---
title: Fetch Past Rooms API | plugNmeet API Reference
description: API endpoint documentation to fetch a list of past (inactive) video conference rooms within a specified date range.
keywords: [api, fetch past rooms, room history, meeting history, room api, endpoint]
sidebar_position: 8
sidebar_label: Fetch Past Rooms
---

# Fetch Past Rooms Information

Endpoint: `/room/fetchPastRooms`

This endpoint allows you to retrieve historical information about room sessions that have already concluded. After a session ends—either when the last participant leaves or when terminated via the `end` API—its metadata is stored and can be accessed using this API.

This is particularly useful for building features that require a history of past meetings, such as displaying a list of previous sessions in your application's user interface. You can query for one or more `room_id`s to get details like when the session was created, when it ended, and how many participants joined.

## Request Parameters

| Field    | Type   | Required | Description                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| room_ids | array  | Yes      | Array of room IDs to query.                 |
| from     | number | No       | Starting index for records. Default is 0.   |
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
| ----------------- | -------------------------- |----------| --------------------------------- |
| status            | boolean                     | root     | Indicates if the request was successful. |
| msg               | string                      | root     | Response message.                 |
| status_code | string | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| [result](#result) | object                      | root     | Contains the results data.        |

### Result

| Field            | Type                                      | Description                                 |
| ---------------- | ----------------------------------------- | ------------------------------------------- |
| total_rooms      | number                                    | Total number of rooms found for the query.  |
| from             | number                                    | Starting index for the returned records.    |
| limit            | number                                    | Number of records returned.                 |
| order_by         | string                                    | Sort order used for the records.            |
| rooms_list       | Array\<[Past Room Info](#past-room-info)> | List of past room records.                  |

### Past Room Info

| Field               | Type   | Description                                                                                   |
| ------------------- | ------ | --------------------------------------------------------------------------------------------- |
| room_title          | string | Title of the room.                                                                            |
| room_id             | string | Unique identifier for the room.                                                               |
| room_sid            | string | SID of the room.                                                                              |
| joined_participants | number | Number of participants who joined (may not be exact; use analytics for detailed information). |
| webhook_url         | string | Webhook URL associated with the room.                                                         |
| created             | string | Room creation time.                                                                           |
| ended               | string | Room end time.                                                                                |
| analytics_file_id   | string | Analytics file identifier, if available.                                                      |
