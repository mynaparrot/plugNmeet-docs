---
sidebar_position: 9
---

# Download recording (token)

End point: `/recording/getDownloadToken`

| Field     | Type   | Position | Required | Description                             |
| --------- | ------ | -------- | :------- | --------------------------------------- |
| record_id | string | root     | Yes      | Recording Id that you want to get token |

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
| token  | string  | root     | Download token            |

When you'll receive token during that time you'll build URL like this format:
`https://Your-Plug-N-Meet-Server.com/download/recording/<TOKEN HERE>`
