---
title: Delete Recording API | plugNmeet API Reference
description: API endpoint documentation to delete a specific meeting recording from the server.
keywords: [api, delete recording, remove recording, recording api, endpoint]
sidebar_position: 4
sidebar_label: Delete
---

# Delete recording

Endpoint: `/recording/delete`

| Field     | Type   | Position | Required | Description                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | root     | Yes      | Recording Id that you want to delete |

**Example**:

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Response

| Field  | Type    | Position | Description               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
