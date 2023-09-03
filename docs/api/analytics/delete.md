---
sidebar_position: 32
---

# Delete analytics

End point: `/analytics/delete`

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
