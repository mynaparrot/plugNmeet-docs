---
title: Update Recording Metadata API | plugNmeet API Reference
description: API endpoint documentation to update the metadata of a specific recording.
keywords: [api, update recording metadata, recording api, endpoint]
sidebar_position: 6
sidebar_label: Update Metadata
---

# Update Recording Metadata

Endpoint: `/recording/updateMetadata`

This API allows you to update the metadata of a specific recording. It intelligently handles partial updates based on the provided fields:
- To update a field, provide a new value.
- To clear a text field (like Title), provide an empty string "".
- To clear a specific map entry (like a subtitle), provide an empty object for that key.
- If a field is omitted (i.e., nil), its existing value is kept.

| Field     | Type   | Position | Required | Description                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | root     | Yes      | The ID of the recording to update. |
| metadata  | [RecordingMetadata](/docs/api/recording/fetch#recordingmetadata-object) | root     | No       | The metadata to update.   |

**Example Request:**

```json
{
  "record_id": "7f867cd7-7956-4a17-af46-6ddd4015a497-1761814595173",
  "metadata": {
    "title": "New Recording Title",
    "description": "Intro session",
    "subtitles": {
      "en": {
        "label": "English",
        "url": "https://example.com/subtitle.vtt"
      }
    },
    "extra_data": {
      "any_key": "any_value",
      "source": "cloud"
    }
  }
}
```

## Response

| Field  | Type    | Position | Description               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
