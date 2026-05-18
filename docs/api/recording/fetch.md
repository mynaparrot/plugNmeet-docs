---
title: Fetch Recordings API | plugNmeet API Reference
description: API endpoint documentation to fetch a list of all available recordings on the server.
keywords: [api, fetch recordings, list recordings, get recordings, recording api, endpoint]
sidebar_position: 1
sidebar_label: Fetch
---

# Fetch Recordings

Endpoint: `/recording/fetch`

This endpoint allows you to retrieve a paginated list of available recordings. Recordings are generated when a room session is recorded and are stored on the server after the session ends.

This API is essential for building a user-facing recording library where users can browse, view, and manage their past recordings. You can filter recordings by `room_id` or a specific room `sid` to narrow down the results, making it easy to display relevant content to your users.

## Request Parameters

| Field    | Type   | Required | Description                                   |
| -------- | ------ | -------- | --------------------------------------------- |
| room_ids | array  | Yes      | Array of room IDs to fetch recordings for.    |
| room_sid   | string           | No       | Filter recordings from a specific room session by providing its `sid`.                                                                                                   |
| from     | number | No       | Starting index for records. Default is 0.     |
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

| Field             | Type                        | Position | Description                                 |
| ----------------- | -------------------------- | -------- | ------------------------------------------- |
| status            | boolean                     | root     | Indicates if the request was successful.    |
| msg               | string                      | root     | Response message.                           |
| status_code | number | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| [result](#result) | object                      | root     | Contains the recordings data.               |

### Result

| Field              | Type                                      | Description                                 |
| ------------------ | ----------------------------------------- | ------------------------------------------- |
| total_recordings   | number                                    | Total number of recordings found.           |
| from               | number                                    | Starting index for the returned records.    |
| limit              | number                                    | Number of records returned.                 |
| order_by           | string                                    | Sort order used for the records.            |
| recordings_list    | Array\<[Recording Info](#recording-info)> | List of recording records.                  |

### Recording Info

| Field              | Type   | Description                                 |
| ------------------ | ------ | ------------------------------------------- |
| record_id          | string | Unique identifier for the recording.        |
| room_id            | string | ID of the room associated with the recording.|
| room_sid           | string | SID of the room.                            |
| file_path          | string | Path to the recording file.                 |
| file_size          | number | Size of the recording file in bytes.        |
| creation_time      | number | Recording creation time (Unix timestamp).   |
| room_creation_time | number | Room creation time (Unix timestamp).        |
| metadata           | [RecordingMetadata](#recordingmetadata-object) | Metadata associated with the recording.     |

### RecordingMetadata Object

| Field       | Type                                               | Description                                                                |
| ----------- |----------------------------------------------------|----------------------------------------------------------------------------|
| title       | string                                             | The title of the recording.                                                |
| description | string                                             | The description of the recording.                                          |
| subtitles   | map [RecordingSubtitle](#recordingsubtitle-object) | A map of language codes to subtitle objects. e.g. `{"en": {"url": "..."}}` |
| extra_data  | map                               | A map of extra data stored with the recording. e.g. `{"key": "value"}`     |

#### RecordingSubtitle Object

| Field | Type   | Description                  |
| ----- | ------ | ---------------------------- |
| label | string | The label for the subtitle.  |
| url   | string | The URL of the subtitle file.|
