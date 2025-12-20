---
title: Download Analytics API | plugNmeet API Reference
description: (DEPRECATED) API endpoint documentation for downloading a meeting analytics file.
keywords: [api, analytics, download]
sidebar_position: 2
sidebar_label: Download
---

# Download Analytics (Token)

:::danger[Deprecated]
This endpoint is deprecated and will be removed in a future version. Please use the new, more flexible **[`/artifact/getDownloadToken`](../artifact/download.md)** endpoint instead.

You can get a download token for an analytics artifact by using its `artifact_id` from the `/artifact/fetch` response.
:::

Endpoint: `/analytics/getDownloadToken`

| Field   | Type   | Position | Required | Description                       |
| ------- | ------ | -------- | :------- | --------------------------------- |
| file_id | string | root     | Yes      | The ID of the file you want to download. |

**Example Request:**

```json
{
  "file_id": "RM_SqZLoUieWYu8-209-1693729854"
}
```

## Response

| Field  | Type    | Position | Description                |
| :----- | ------- | -------- | :------------------------- |
| status | boolean | root     | Indicates if the request was successful. |
| msg    | string  | root     | Response message.          |
| token  | string  | root     | Download token.            |

Once you receive the token, you can construct the download URL using the following format:
```
https://Your-Plug-N-Meet-Server.com/download/analytics/<TOKEN HERE>
```
