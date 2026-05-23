---
title: Delete Recording API | plugNmeet API Reference
description: API endpoint documentation to delete a specific meeting recording from the server.
keywords: [api, delete recording, remove recording, recording api, endpoint]
sidebar_position: 4
sidebar_label: Delete
---

# Delete recording

Endpoint: `/recording/delete`

This endpoint allows you to permanently delete a recording from the server. This action is irreversible and will remove the recording file and all associated metadata.

This is a critical administrative function for managing storage and ensuring compliance with data retention policies. You would typically integrate this into your application's interface to allow authorized users to remove recordings they no longer need.

| Field     | Type   | Position | Required | Description                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | root     | Yes      | Recording Id that you want to delete |

**Example**:

```json
{
  "record_id": "7f867cd7-7956-4a17-af46-6ddd4015a497-1761814595173"
}
```

## Response

| Field  | Type    | Position | Description               |
| :----- |---------|----------| :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
| status_code | string | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
