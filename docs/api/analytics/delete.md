---
title: Delete Analytics API | plugNmeet API Reference
description: API endpoint documentation to delete the analytics data for a specific past meeting.
keywords: [api, delete analytics, remove analytics, analytics api, endpoint]
sidebar_position: 3
sidebar_label: Delete
---

# Delete analytics

Endpoint: `/analytics/delete`

| Field     | Type   | Position | Required | Description                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| file_id | string | root     | Yes      | File Id that you want to delete |

**Example**:

```json
{
  "file_id": "RM_SqZLoUieWYu8-209-1693729854"
}
```

## Response

| Field  | Type    | Position | Description               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
