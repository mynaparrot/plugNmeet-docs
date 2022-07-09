---
description: plugNmeet create room using API
sidebar_position: 2
---

# Create room

End point: `/room/create`

| Field                          | Type    | Position                       | Required | Description                                                                                                                                                                                                                                                                                       |
| ------------------------------ | ------- | ------------------------------ | :------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| room_id                        | string  | root                           | Yes      | Room Id should be unique for every room/session/meeting                                                                                                                                                                                                                                           |
| max_participants               | number  | root                           | No       | Limit number of participants that can be join in this room.                                                                                                                                                                                                                                       |
| empty_timeout                  | number  | root                           | No       | Number of seconds to keep the room open if no one joins                                                                                                                                                                                                                                           |
| metadata                       | string  | root                           | Yes      |                                                                                                                                                                                                                                                                                                   |
| room_title                     | string  | metadata                       | Yes      | Title of the room/meeting                                                                                                                                                                                                                                                                         |
| welcome_message                | string  | metadata                       | No       | If you want to show some message at start up.                                                                                                                                                                                                                                                     |
| room_features                  | string  | metadata                       | Yes      | Various room features.                                                                                                                                                                                                                                                                            |
| allow_webcams                  | boolean | room_features                  | Yes      | If you want to enable webcam support.                                                                                                                                                                                                                                                             |
| mute_on_start                  | boolean | room_features                  | Yes      | If you want to mute microphone automatically after share.                                                                                                                                                                                                                                         |
| allow_screen_share             | boolean | room_features                  | Yes      | Enable or disable screen share for the meeting.                                                                                                                                                                                                                                                   |
| allow_recording                | boolean | room_features                  | Yes      | Enable or disable recording for the meeting.                                                                                                                                                                                                                                                      |
| allow_rtmp                     | boolean | room_features                  | Yes      | Enable or disable RTMP for the meeting.                                                                                                                                                                                                                                                           |
| admin_only_webcams             | boolean | room_features                  | Yes      | If you want to allow webcams only for admin                                                                                                                                                                                                                                                       |
| allow_view_other_webcams       | boolean | room_features                  | Yes      | If you want to disable to display other users camera except moderator.                                                                                                                                                                                                                            |
| allow_view_other_users_list    | boolean | room_features                  | Yes      | If you want to disable to display users list except moderator.                                                                                                                                                                                                                                    |
| chat_features                  | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| allow_chat                     | boolean | chat_features                  | Yes      | Enable or disable chat for the meeting.                                                                                                                                                                                                                                                           |
| allow_file_upload              | boolean | chat_features                  | Yes      | Enable or disable file upload in chat for the meeting.                                                                                                                                                                                                                                            |
| shared_note_pad_features       | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| allowed_shared_note_pad        | boolean | shared_note_pad_features       | Yes      | Enable or disable shared notepad for the meeting.                                                                                                                                                                                                                                                 |
| whiteboard_features            | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| allowed_whiteboard             | boolean | whiteboard_features            | Yes      | Enable or disable whiteboard for the meeting.                                                                                                                                                                                                                                                     |
| external_media_player_features | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| allowed_external_media_player  | boolean | external_media_player_features | Yes      | Enable or disable to allow to play video/audio from external source. Moderator can upload local video/audio too.                                                                                                                                                                                  |
| waiting_room_features          | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| is_active                      | boolean | waiting_room_features          | Yes      | Enable if you want to activate wating room feature. User will be in waiting room until moderator allow to join.                                                                                                                                                                                   |
| breakout_room_features         | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| is_active                      | boolean | breakout_room_features         | Yes      | Enable or disable breakout room features.                                                                                                                                                                                                                                                         |
| allowed_number_rooms           | number  | breakout_room_features         | No       | Number of breakout rooms allowed to create at a same time. Default: 6                                                                                                                                                                                                                             |
| display_external_link_features | string  | room_features                  | Yes      |                                                                                                                                                                                                                                                                                                   |
| is_active                      | boolean | display_external_link_features | Yes      | Enable or disable to allow to display external links inside a iframe. This feature is helpful if your session to require to display other website, quiz, games etc. The website must be allow to load inside an iframe. Moderator can pass various values like name, userId, role, meetingId etc. |
| default_lock_settings          | string  | room_features                  | NO       |                                                                                                                                                                                                                                                                                                   |
| lock_microphone                | boolean | default_lock_settings          | NO       | Lock microphone for users.                                                                                                                                                                                                                                                                        |
| lock_webcam                    | boolean | default_lock_settings          | NO       | Lock webcam for users.                                                                                                                                                                                                                                                                            |
| lock_screen_sharing            | boolean | default_lock_settings          | NO       | Lock screen share for users.                                                                                                                                                                                                                                                                      |
| lock_chat                      | boolean | default_lock_settings          | NO       | Lock chat for users.                                                                                                                                                                                                                                                                              |
| lock_chat_send_message         | boolean | default_lock_settings          | NO       | Lock send message for users.                                                                                                                                                                                                                                                                      |
| lock_chat_file_share           | boolean | default_lock_settings          | NO       | Lock send file for users.                                                                                                                                                                                                                                                                         |

**Example**:

```
{
  "room_id": "room01",
  "metadata": {
    "room_title": "Test room",
    "welcome_message": "Welcome to room",
    "room_features": {
      "allow_webcams": true,
      "mute_on_start": false,
      "allow_screen_share": true,
      "allow_recording": true,
      "allow_rtmp": true,
      "allow_view_other_webcams": true,
      "allow_view_other_users_list": true,
      "admin_only_webcams": false,
      "room_duration": 0
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
      "allowed_number_rooms": 5
    },
    "display_external_link_features": {
      "is_allow": true
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

| Field            | Type    | Position | Description                                |
| :--------------- | ------- | -------- | :----------------------------------------- |
| status           | boolean | root     | The status of the request                  |
| msg              | string  | root     | Response message                           |
| roomInfo         | string  | root     |                                            |
| sid              | string  | roomInfo | Room sid                                   |
| name             | string  | roomInfo | Room Id                                    |
| max_participants | number  | roomInfo | Maximum participants for this room         |
| empty_timeout    | number  | roomInfo | Maximum duration before closing empty room |
| creation_time    | number  | roomInfo | Room creation time in unix time format     |
| turn_password    | string  | roomInfo | Turn password                              |
| enabled_codecs   | Array   | roomInfo | Video codecs for this room                 |
| metadata         | string  | roomInfo | Room metadata                              |
