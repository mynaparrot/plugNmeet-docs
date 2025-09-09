---
sidebar_position: 2
---

# Download Analytics (Token)

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
