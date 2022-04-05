---
description: plugNmeet join room using API
sidebar_position: 3
---

# Join room

End point: `/room/getJoinToken`

| Field                  | Type    | Position      | Required | Description                                                  |
| ---------------------- | ------- | ------------- | :------- | ------------------------------------------------------------ |
| room_id                | string  | root          | Yes      | Room Id that you created before to join.                     |
| user_info              | string  | root          | Yes      |                                                              |
| name                   | string  | user_info     | Yes      | User name                                                    |
| user_id                | string  | user_info     | Yes      | User unique ID. Should be unquie for every user.             |
| is_admin               | boolean | user_info     | Yes      | If true then user will be treated as an admin for this room. |
| is_hidden              | boolean | user_info     | Yes      | If true then user will be invisible in the room.             |
| user_metadata          | string  | user_info     | Yes      |                                                              |
| profile_pic            | string  | user_metadata | NO       | If you want to set user's avatar. Should be https URL.       |
| lock_settings          | string  | user_metadata | NO       |                                                              |
| lock_microphone        | boolean | lock_settings | NO       | Lock microphone for users.                                   |
| lock_webcam            | boolean | lock_settings | NO       | Lock webcam for users.                                       |
| lock_screen_sharing    | boolean | lock_settings | NO       | Lock screen share for users.                                 |
| lock_chat              | boolean | lock_settings | NO       | Lock chat for users.                                         |
| lock_chat_send_message | boolean | lock_settings | NO       | Lock send message for users.                                 |
| lock_chat_file_share   | boolean | lock_settings | NO       | Lock send file for users.                                    |

**Example**:

```
{
  "room_id": "room01",
  "user_info": {
    "name": "Your name",
    "user_id": "Your-Unique-User-Id",
    "is_admin": true,
    "is_hidden": false,
    "user_metadata": {
      "profile_pic": "https://profile.pic/im.jpg",
      "lock_settings": {
        "lock_microphone": false,
        "lock_webcam": false,
        "lock_screen_sharing": true,
        "lock_chat": false,
        "lock_chat_send_message": false,
        "lock_chat_file_share": false
      }
    }
  }
}
```

## Response

| Field  | Type    | Position | Description               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
| token  | string  | root     | Join token                |

When you'll receive token during that time you can pass that token to plugNmeet-client. If you've setup it with plugNmeet-server then:
`https://Your-Plug-N-Meet-Server.com/?access_token=<TOKEN HERE>`

If you are using `plugNmeet-client` build static files in somewhere else then you'll require to pass token like that too. For example you've uploaded build static files inside `conference` directory. In this case: `https://Your-Domain.com/conference/?access_token=<TOKEN HERE>`
