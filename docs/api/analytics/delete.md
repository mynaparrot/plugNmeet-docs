---
title: Delete Analytics API | plugNmeet API Reference
description: (DEPRECATED) API endpoint documentation for deleting a meeting analytics file.
keywords: [api, analytics, delete]
sidebar_position: 3
sidebar_label: Delete
---

# Delete analytics

:::danger[Deprecated]
This endpoint is deprecated and will be removed in a future version. Please use the new, more flexible **[`/artifact/delete`](../artifact/delete.md)** endpoint instead.

You can delete an analytics artifact by using its `artifact_id` from the `/artifact/fetch` response.
:::

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
