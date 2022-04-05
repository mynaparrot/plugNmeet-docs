---
sidebar_position: 5
---

# Get active room info

End point: `/room/getActiveRoomInfo`

| Field   | Type   | Position | Required | Description |
| ------- | ------ | -------- | :------- | ----------- |
| room_id | string | root     | Yes      | Room Id     |

**Example**:

```
{
  "room_id": "room01"
}
```

## Response

| Field               | Type    | Position          | Description                            |
| :------------------ | ------- | ----------------- | :------------------------------------- |
| status              | boolean | root              | The status of the request              |
| msg                 | string  | root              | Response message                       |
| room                | object  | root              |                                        |
| room_info           | object  | room              |                                        |
| participants_info   | object  | room              | Array of current participants          |
| room_title          | string  | room_info         | Title of the meeting                   |
| room_id             | string  | room_info         | Room Id                                |
| sid                 | string  | room_info         | Room Sid                               |
| joined_participants | number  | room_info         | Total number of users joined           |
| is_running          | boolean | room_info         | If the room is active now              |
| is_recording        | boolean | room_info         | If recording active                    |
| is_active_rtmp      | boolean | room_info         | If RTMP active                         |
| creation_time       | number  | room_info         | Room creation time in unix format      |
| metadata            | string  | room_info         | Room metadata                          |
| webhook_url         | string  | room_info         | Webhook URL                            |
| sid                 | string  | participants_info | Participant Sid                        |
| identity            | string  | participants_info | Participant userId                     |
| state               | string  | participants_info | Participant state                      |
| metadata            | string  | participants_info | Participant metadata                   |
| joined_at           | number  | participants_info | Participant joined time in unix format |
| version             | number  | participants_info |                                        |
| permission          | object  | participants_info |                                        |
