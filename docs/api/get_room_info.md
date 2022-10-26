---
sidebar_position: 5
---
# Get active room info

End point: `/room/getActiveRoomInfo`


| Field   | Type   | Position | Required | Description |
| --------- | -------- | ---------- | :--------- | ------------- |
| room_id | string | root     | Yes      | Room Id     |

**Example**:

```json
{
  "room_id": "room01"
}
```

## Response


| Field         | Type                  | Position | Description               |
| :-------------- | ----------------------- | ---------- | :-------------------------- |
| status        | boolean               | root     | The status of the request |
| msg           | string                | root     | Response message          |
| [room](#room) | object<[room](#room)> | root     |                           |

### Room


| Field                                  | Type                                         | Description                   |
| :--------------------------------------- | ---------------------------------------------- | :------------------------------ |
| [room_info](#room-info)                | object<[room_info](#room-info)>              |                               |
| [participants_info](#participant-info) | array<[participant_info](#participant-info)> | Array of current participants |

### Room Info


| Field               | Type    | Description                       |
| :-------------------- | --------- | :---------------------------------- |
| room_title          | string  | Title of the meeting              |
| room_id             | string  | Room Id                           |
| sid                 | string  | Room Sid                          |
| joined_participants | number  | Total number of users joined      |
| is_running          | boolean | If the room is active now         |
| is_recording        | boolean | If recording active               |
| is_active_rtmp      | boolean | If RTMP active                    |
| creation_time       | number  | Room creation time in unix format |
| metadata            | string  | Room metadata                     |
| webhook_url         | string  | Webhook URL                       |

### Participant info


| Field      | Type   | Description                            |
| :----------- | -------- | :--------------------------------------- |
| sid        | string | Participant Sid                        |
| identity   | string | Participant userId                     |
| name       | string | Participant name                       |
| state      | string | Participant state                      |
| metadata   | string | Participant metadata                   |
| joined_at  | number | Participant joined time in unix format |
| version    | number |                                        |
| permission | object |                                        |
