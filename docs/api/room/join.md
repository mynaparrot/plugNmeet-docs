---
description: plugNmeet join room using API
sidebar_position: 2
---
# Join room

End point: `/room/getJoinToken`

## Request parameters


| Field                   | Type   | Required | Description                              |
| ------------------------- | -------- | :--------- | ------------------------------------------ |
| room_id                 | string | Yes      | Room Id that you created before to join. |
| [user_info](#user-info) | object | Yes      |                                          |

### User info


| Field                           | Type    | Required | Description                                                  |
| --------------------------------- | --------- | ---------- | -------------------------------------------------------------- |
| name                            | string  | Yes      | User full name                                               |
| user_id                         | string  | Yes      | User unique ID. Should be unquie for every user.             |
| is_admin                        | boolean | Yes      | If true then user will be treated as an admin for this room. |
| is_hidden                       | boolean | No       | If true then user will be invisible in the room.             |
| [user_metadata](#user-metadata) | object  | Yes      |                                                              |

### User metadata


| Field                                                           | Type   | Required | Description    |
| ----------------------------------------------------------------- | -------- | ---------- | ---------------- |
| profile_pic                                                     | string | No       | Profile avatar |
| [lock_settings](/docs/api/create_room.md#default-lock-settings) | object | No       | Lock settings  |

### **Example**

```json
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
| :------- | --------- | ---------- | :-------------------------- |
| status | boolean | root     | The status of the request |
| msg    | string  | root     | Response message          |
| token  | string  | root     | Join token                |

When you'll receive token during that time you can pass that token to plugNmeet-client. If you've setup it with plugNmeet-server then:

```
https://Your-Plug-N-Meet-Server.com/?access_token=<TOKEN HERE>
```

If you are using [plugNmeet-client](https://github.com/mynaparrot/plugNmeet-client) build static files in somewhere else then you'll require to pass token like that too. For example you've uploaded build static files inside `conference` directory. In this case:

```
https://Your-Domain.com/conference/?access_token=<TOKEN HERE>
```

**Note:** You may alternatively use the [getClientFiles](/docs/api/get-client-files) API call to get all of the CSS and JS files needed to display the interface manually. This way, you can embed the `plugNmeet-client` anywhere without worrying about static build files.

## Custom design

It's possible to add extra query parameter `custom_design` with the join link. This way you can use seperate design for indivisual user. The value of `custom_design` will need to be **url encoded json value**. You can view supported parameters from [design-parameters](/docs/developer-guide/design-customisation#design-parameters). Example:

```
https://Your-Domain.com/conference/?access_token=<TOKEN HERE>&custom_design=%7B%22primary_color%22%3A%22%23004D90%22%2C%22secondary_color%22%3A%22%2324AEF7%22%7D
```
