---
sidebar_position: 3
---

# Download Recording (Token)

Endpoint: `/recording/getDownloadToken`

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
| token  | string  | root     | Download token.                  |

Once you receive the token, you can construct the download URL using the following format:
```
https://Your-Plug-N-Meet-Server.com/download/recording/<TOKEN HERE>
```
