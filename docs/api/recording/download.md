---
title: Download Recording API | plugNmeet API Reference
description: API endpoint documentation to get a temporary, signed URL to download a specific meeting recording file.
keywords: [api, download recording, get recording url, recording api, endpoint]
sidebar_position: 3
sidebar_label: Download
---

# Download Recording (Token)

Endpoint: `/recording/getDownloadToken`

This endpoint generates a secure, temporary token that can be used to download a recording file. Instead of providing a direct, permanent link to the recording, this API creates a short-lived, single-use token.

This is a security best practice that prevents unauthorized access and sharing of your recording files. The typical workflow is:
1. A user in your application clicks a "Download" button.
2. Your backend calls this API to get a token.
3. Your application constructs the download URL with the token and redirects the user to it.

The token will expire after a short period, ensuring that the download link cannot be reused or shared.

| Field     | Type   | Position | Required | Description                                 |
| --------- | ------ | -------- | :------- | ------------------------------------------- |
| record_id | string | root     | Yes      | The ID of the recording you want to download. |

**Example Request:**

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Response

| Field  | Type    | Position | Description                       |
| :----- | ------- | -------- | :------------------------------- |
| status | boolean | root     | Indicates if the request was successful. |
| msg    | string  | root     | Response message.                |
| status_code | number | root     | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| token  | string  | root     | Download token.                  |

Once you receive the token, you can construct the download URL using the following format:
```
https://Your-Plug-N-Meet-Server.com/download/recording/<TOKEN HERE>
```
