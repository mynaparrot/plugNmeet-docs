---
description: plugNmeet create room using API
sidebar_position: 2
---

# Create room

End point: `/room/create`

## Request parameters

| Field                 | Type   | Required | Description                                                 |
| --------------------- | ------ | :------- | ----------------------------------------------------------- |
| room_id               | string | Yes      | Room Id should be unique for every room/session/meeting     |
| max_participants      | number | No       | Limit number of participants that can be join in this room. |
| empty_timeout         | number | No       | Number of seconds to keep the room open if no one joins     |
| [metadata](#metadata) | object | Yes      |                                                             |

### Metadata

| Field                                           | Type   | Required | Description                                                                                    |
| ----------------------------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| room_title                                      | string | Yes      | Title of the room/meeting                                                                      |
| welcome_message                                 | string | No       | If you want to show some message at start up.                                                  |
| webhook_url                                     | string | No       | You can put webhook URL in where plugNmeet will send post request based on various events.     |
| logout_url                                      | string | No       | You can put logout URL in where plugNmeet will redirect the users after meeting/session ended. |
| [room_features](#room-features)                 | object | Yes      | Various room features.                                                                         |
| [default_lock_settings](#default-lock-settings) | object | No       | Default lock settings                                                                          |

### Room Features

| Field                                                                      | Type    | Required | Description                                                                                            |
| -------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ |
| allow_webcams                                                              | boolean | Yes      | If you want to enable webcam support.                                                                  |
| mute_on_start                                                              | boolean | Yes      | If you want to mute microphone automatically after share.                                              |
| allow_screen_share                                                         | boolean | Yes      | Enable or disable screen share for the meeting.                                                        |
| allow_rtmp                                                                 | boolean | Yes      | Enable or disable RTMP for the meeting.                                                                |
| admin_only_webcams                                                         | boolean | Yes      | If you want to allow webcams only for admin                                                            |
| allow_view_other_webcams                                                   | boolean | Yes      | If you want to disable to display other users camera except moderator.                                 |
| allow_view_other_users_list                                                | boolean | Yes      | If you want to disable to display users list except moderator.                                         |
| room_duration                                                              | number  | No       | If you want to set fixed room duration. Value should be in minutes. 1 hour = 60 minutes. 0 = unlimited |
| [recording_features](#recording-features)                                  | object  | Yes      | Recording Settings                                                                                     |
| [chat_features](#chat-features)                                            | object  | Yes      | Chat Settings                                                                                          |
| [shared_note_pad_features](#shared-note-pad-features)                      | object  | Yes      | Shared note pad settings                                                                               |
| [whiteboard_features](#whiteboard-features)                                | object  | Yes      | Whiteboard settings                                                                                    |
| [external_media_player_features](#external-media-player-features)          | object  | Yes      | External media player settings                                                                         |
| [waiting_room_features](#waiting-room-features)                            | object  | Yes      | Waiting room settings                                                                                  |
| [breakout_room_features](#breakout-room-features)                          | object  | Yes      | Breakout room settings                                                                                 |
| [display_external_link_features](#display-external-link-features)          | object  | Yes      | Display external link settings                                                                         |
| [ingress_features](#ingress-features)                                      | object  | No       | RTMP ingress feature                                                                                   |
| [speech_to_text_translation_features](#speech-to-texttranslation-features) | object  | No       | Speech to text/translation features                                                                    |
| [end_to_end_encryption_features](#end-to-end-encryption-e2ee-features) | object  | No       | End-to-End encryption (E2EE)                                                                   |

### Recording features

| Field                       | Type    | Required | Description                                                                           |
| --------------------------- | ------- | -------- | ------------------------------------------------------------------------------------- |
| is_allow                    | boolean | Yes      | Enable or disable recording feature for the meeting.                                  |
| is_allow_cloud              | boolean | Yes      | Enable or disable cloud recording option                                              |
| is_allow_local              | boolean | Yes      | Enable or disable local recording option                                              |
| enable_auto_cloud_recording | boolean | No       | If enable then recording will be starting as soon as moderator/admin join the session |

### Chat features

| Field             | Type    | Required | Description                                            |
| ----------------- | ------- | -------- | ------------------------------------------------------ |
| allow_chat        | boolean | Yes      | Enable or disable chat for the meeting.                |
| allow_file_upload | boolean | Yes      | Enable or disable file upload in chat for the meeting. |

### Shared note pad features

| Field                   | Type    | Required | Description                                       |
| ----------------------- | ------- | -------- | ------------------------------------------------- |
| allowed_shared_note_pad | boolean | Yes      | Enable or disable shared notepad for the meeting. |

### Whiteboard features

| Field              | Type    | Required | Description                                   |
| ------------------ | ------- | -------- | --------------------------------------------- |
| allowed_whiteboard | boolean | Yes      | Enable or disable whiteboard for the meeting. |


### External media player features

| Field                         | Type    | Required | Description                                                                                                      |
| ----------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| allowed_external_media_player | boolean | Yes      | Enable or disable to allow to play video/audio from external source. Moderator can upload local video/audio too. |

### Waiting room features

| Field     | Type    | Required | Description                                                                                                     |
| --------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| is_active | boolean | Yes      | Enable if you want to activate wating room feature. User will be in waiting room until moderator allow to join. |

### Breakout room features

| Field                | Type    | Required | Description                                                           |
| -------------------- | ------- | -------- | --------------------------------------------------------------------- |
| is_allow             | boolean | Yes      | Enable or disable breakout room features.                             |
| allowed_number_rooms | number  | No       | Number of breakout rooms allowed to create at a same time. Default: 6 |

### Display external link features

| Field    | Type    | Required | Description                                                                                                                                                                                                                                                                                       |
| -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_allow | boolean | Yes      | Enable or disable to allow to display external links inside a iframe. This feature is helpful if your session to require to display other website, quiz, games etc. The website must be allow to load inside an iframe. Moderator can pass various values like name, userId, role, meetingId etc. |

### Ingress features

| Field    | Type    | Required | Description                                                                                                                                              |
| -------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_allow | boolean | Yes      | Ingress RTMP streaming right into the session. This capability is really useful if you want to display external video directly streaming in the session. |

### Speech to text/translation features

| Field                | Type    | Required | Description                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_allow             | boolean | Yes      | enable/disable Speech to text feature. This feature will use [microsoft azure](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-text-to-speech?pivots=programming-language-go&tabs=linux%2Cterminal#prerequisites) under the hood. Make sure that you've configured API info correctly. |
| is_allow_translation | boolean | Yes      | If you want to enable auto translation feature too.                                                                                                                                                                                                                                                                          |

### End-to-End encryption (E2EE) features

| Field                | Type    | Required | Description                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_enabled             | boolean | Yes      | enable/disable E2EE. Supported browsers: `browser based on Chromium 83+, Google Chrome, Microsoft Edge, Safari.` **Note:** Users will be unable to join the session if their browser does not support it. |

### Default lock settings

| Field                  | Type    | Required | Description                  |
| ---------------------- | ------- | -------- | ---------------------------- |
| lock_microphone        | boolean | No       | Lock microphone for users.   |
| lock_webcam            | boolean | No       | Lock webcam for users.       |
| lock_screen_sharing    | boolean | No       | Lock screen share for users. |
| lock_chat              | boolean | No       | Lock chat for users.         |
| lock_chat_send_message | boolean | No       | Lock send message for users. |
| lock_chat_file_share   | boolean | No       | Lock send file for users.    |

### **Example**

```json
{
  "room_id": "room01",
  "metadata": {
    "room_title": "Test room",
    "welcome_message": "Welcome to room",
    "room_features": {
      "allow_webcams": true,
      "mute_on_start": false,
      "allow_screen_share": true,
      "allow_rtmp": true,
      "admin_only_webcams": false,
      "allow_view_other_webcams": true,
      "allow_view_other_users_list": true,
      "allow_polls": true,
      "room_duration": 0,
      "recording_features": {
        "is_allow": true,
        "is_allow_cloud": true,
        "is_allow_local": true,
        "enable_auto_cloud_recording": false
      },
      "chat_features": {
        "allow_chat": true,
        "allow_file_upload": true
      },
      "shared_note_pad_features": {
        "allowed_shared_note_pad": true
      },
      "whiteboard_features": {
        "allowed_whiteboard": true
      },
      "external_media_player_features": {
        "allowed_external_media_player": true
      },
      "waiting_room_features": {
        "is_active": false
      },
      "breakout_room_features": {
        "is_allow": true,
        "allowed_number_rooms": 2
      },
      "display_external_link_features": {
        "is_allow": true
      },
      "ingress_features": {
        "is_allow": true
      },
      "speech_to_text_translation_features": {
        "is_allow": true,
        "is_allow_translation": true
      },
      "end_to_end_encryption_features": {
        "is_enabled": false
      }
    },
    "default_lock_settings": {
      "lock_microphone": false,
      "lock_webcam": false,
      "lock_screen_sharing": true,
      "lock_whiteboard": true,
      "lock_shared_notepad": true,
      "lock_chat": false,
      "lock_chat_send_message": false,
      "lock_chat_file_share": false,
      "lock_private_chat": false
    }
  }
}
```

## Response

| Field                  | Type                           | Description               |
| :--------------------- | ------------------------------ | ------------------------- |
| status                 | boolean                        | The status of the request |
| msg                    | string                         | Response message          |
| [roomInfo](#room-info) | object<[roomInfo](#room-info)> |                           |

### Room Info

| Field            | Type   | Description                                |
| ---------------- | ------ | ------------------------------------------ |
| sid              | string | Room sid                                   |
| name             | string | Room Id                                    |
| max_participants | number | Maximum participants for this room         |
| empty_timeout    | number | Maximum duration before closing empty room |
| creation_time    | number | Room creation time in unix time format     |
| turn_password    | string | Turn password                              |
| enabled_codecs   | Array  | Video codecs for this room                 |
| metadata         | string | Room metadata                              |
