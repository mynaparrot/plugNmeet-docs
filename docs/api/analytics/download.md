---
sidebar_position: 2
---

# Download analytics (token)

End point: `/analytics/getDownloadToken`

| Field     | Type   | Position | Required | Description                             |
| --------- | ------ | -------- | :------- | --------------------------------------- |
| file_id | string | root     | Yes      | File Id that you want to get token |

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
| token  | string  | root     | Download token            |

When you'll receive token during that time you'll build URL like this format:
`https://Your-Plug-N-Meet-Server.com/download/analytics/<TOKEN HERE>`
