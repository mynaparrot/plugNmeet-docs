---
title: Create Room API | plugNmeet API Reference
description: API endpoint documentation for creating a new video conference room. Learn about the required parameters like room_id, participant names, and custom settings.
keywords: [api, create room, new room, generate room, room api, video api, endpoint]
sidebar_position: 1
sidebar_label: Create
---

# Create Room

Endpoint: `/room/create`

Before you create your first room, it's helpful to understand how rooms work in Plug-N-Meet. Think of a room not as a permanent space, but as a **temporary live session**.

Here's the typical lifecycle:
1.  You create a room using this API endpoint.
2.  You generate access tokens for users to join the session.
3.  The session remains active as long as participants are present.
4.  The session ends automatically when the last participant leaves or can be terminated via an API call.

Once a session is over, the room is finalized, and all associated data (like chat messages and user lists) is cleared. This ensures that each new session starts fresh.

> **Pro Tip: Simulating Permanent Rooms**
>
> If you want to create the experience of a "permanent" room that users can join at any time, you can build this logic into your application.
>
> When a user attempts to join, your application should:
> 1.  Check if an active session for that `room_id` already exists (e.g., using the `isRoomActive` API).
> 2.  If no session exists, call this `create` endpoint to start a new one.
> 3.  Finally, generate an access token to allow the user to join.
>
> This approach gives you the flexibility of persistent-like rooms while leveraging Plug-N-Meet's temporary session model.

## Request Parameters

| Field                 | Type   | Required | Description                                                                            |
| --------------------- | ------ | -------- |----------------------------------------------------------------------------------------|
| room_id               | string | Yes      | A unique identifier for the room. Since rooms are temporary, you can reuse a `room_id` after a session has ended. |
| max_participants      | number | No       | The maximum number of participants allowed in the room.                                |
| empty_timeout         | number | No       | The number of seconds the room will remain active after creation if no one joins.      |
| [metadata](#metadata) | object | Yes      | Additional room configuration details.                                                 |

### Metadata

| Field                                           | Type   | Required | Description                                                                                      |
| ----------------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------ |
| room_title                                      | string | Yes      | The title of the room or meeting.                                                                |
| welcome_message                                 | string | No       | A message displayed to participants when they join.                                              |
| webhook_url                                     | string | No       | URL to receive webhook events from Plug-N-Meet.                                                  |
| logout_url                                      | string | No       | URL to redirect users after the meeting or session ends.                                         |
| [room_features](#room-features)                 | object | Yes      | Settings to enable or disable various room features.                                             |
| [default_lock_settings](#default-lock-settings) | object | No       | Default settings to lock specific features for users.                                            |
| [copyright_conf](#copyright-config)             | object | No       | Copyright configuration.                                                                         |
| extra_data                                      | string | No       | Any additional data you wish to store.                                                           |

### Room Features

| Field                                                                      | Type    | Required | Description                                                                                            |
| -------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ |
| allow_webcams                                                              | boolean | Yes      | Enable or disable webcam support.                                                                      |
| mute_on_start                                                              | boolean | Yes      | Automatically mute microphones when participants join.                                                 |
| allow_screen_share                                                         | boolean | Yes      | Enable or disable screen sharing.                                                                      |
| allow_rtmp                                                                 | boolean | Yes      | Enable or disable RTMP streaming.                                                                      |
| admin_only_webcams                                                         | boolean | Yes      | Allow webcam access only for admins.                                                                   |
| allow_view_other_webcams                                                   | boolean | Yes      | Allow participants to view each other's webcams. If `false`, only moderators can see all webcams. |
| allow_view_other_users_list                                                | boolean | Yes      | Restrict viewing of the user list to moderators only.                                                  |
| enable_analytics                                                           | boolean | No       | Enable or disable analytics reporting for the session. Default: false                                  |
| allow_virtual_bg                                                           | boolean | No       | Enable or disable virtual background options.                                                          |
| allow_raise_hand                                                           | boolean | No       | Enable or disable the "raise hand" feature.                                                            |
| auto_gen_user_id                                                           | boolean | No       | PlugNmeet requires a unique `userId` for each participant. Enable this if you prefer not to manage `userId`s or need to allow the same user to join from multiple devices. When `true`, PlugNmeet generates a unique `user_id` for each session. Any `user_id` you provide will be stored as `ex_user_id`, retrievable via the `getActiveRoomInfo` API. Default: `false` |
| room_duration                                                              | number  | No       | Set a fixed duration for the room in minutes. 0 means unlimited.                                       |
| [recording_features](#recording-features)                                  | object  | Yes      | Recording settings.                                                                                    |
| [chat_features](#chat-features)                                            | object  | Yes      | Chat settings.                                                                                         |
| [shared_note_pad_features](#shared-note-pad-features)                      | object  | Yes      | Shared notepad settings.                                                                               |
| [whiteboard_features](#whiteboard-features)                                | object  | Yes      | Whiteboard settings.                                                                                   |
| [external_media_player_features](#external-media-player-features)          | object  | Yes      | External media player settings.                                                                        |
| [waiting_room_features](#waiting-room-features)                            | object  | Yes      | Waiting room settings.                                                                                 |
| [breakout_room_features](#breakout-room-features)                          | object  | Yes      | Breakout room settings.                                                                                |
| [display_external_link_features](#display-external-link-features)          | object  | Yes      | Settings for displaying external links.                                                                |
| [ingress_features](#ingress-features)                                      | object  | No       | RTMP ingress settings.                                                                                 |
| [speech_to_text_translation_features](#speech-to-texttranslation-features) | object  | No       | Speech-to-text and translation settings.                                                               |
| [end_to_end_encryption_features](#end-to-end-encryption-e2ee-features)     | object  | No       | End-to-End Encryption (E2EE) settings.                                                                 |

### Recording Features

| Field                       | Type    | Required | Description                                                                           |
| --------------------------- | ------- | -------- | ------------------------------------------------------------------------------------- |
| is_allow                    | boolean | Yes      | Enable or disable recording for the meeting.                                          |
| is_allow_cloud              | boolean | Yes      | Enable or disable cloud recording.                                                    |
| is_allow_local              | boolean | Yes      | Enable or disable local recording.                                                    |
| enable_auto_cloud_recording | boolean | No       | Automatically start cloud recording when a moderator or admin joins.                  |

### Chat Features

| Field             | Type    | Required | Description                                            |
| ----------------- | ------- | -------- | ------------------------------------------------------ |
| allow_chat        | boolean | Yes      | Enable or disable chat for the meeting.                |
| allow_file_upload | boolean | Yes      | Enable or disable file uploads in chat.                |

### Shared Notepad Features

| Field                   | Type    | Required | Description                                       |
| ----------------------- | ------- | -------- | ------------------------------------------------- |
| allowed_shared_note_pad | boolean | Yes      | Enable or disable the shared notepad feature.     |

### Whiteboard Features

| Field              | Type    | Required | Description                                   |
| ------------------ | ------- | -------- | --------------------------------------------- |
| allowed_whiteboard | boolean | Yes      | Enable or disable the whiteboard feature.     |
| preload_file       | string  | No       | Preload a remote (http/https) presentation file for the whiteboard. The file must be directly accessible without redirection. |

### External Media Player Features

| Field                         | Type    | Required | Description                                                                                                      |
| ----------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| allowed_external_media_player | boolean | Yes      | Enable or disable playback of video/audio from external sources. Moderators can also upload local media.         |

### Waiting Room Features

| Field     | Type    | Required | Description                                                                                                     |
| --------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| is_active | boolean | Yes      | Enable to activate the waiting room feature. Users remain in the waiting room until allowed to join by a moderator. |

### Breakout Room Features

| Field                | Type    | Required | Description                                                           |
| -------------------- | ------- | -------- | --------------------------------------------------------------------- |
| is_allow             | boolean | Yes      | Enable or disable breakout rooms.                                     |
| allowed_number_rooms | number  | No       | Maximum number of breakout rooms that can be created simultaneously. Default: 6 |

### Display External Link Features

| Field    | Type    | Required | Description                                                                                                                                                                                                                                                                                       |
| -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_allow | boolean | Yes      | Enable or disable the display of external links inside an iframe. Useful for showing websites, quizzes, or games. **Note:** The external site must allow being embedded in an iframe. Moderators can pass values like `name`, `userId`, `role`, and `meetingId` to the URL. |

### Ingress Features

| Field    | Type    | Required | Description                                                                                                   |
| -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| is_allow | boolean | Yes      | Enable media ingress to stream content directly into the session. This is useful for professional broadcasting using software like OBS Studio. Plug-N-Meet supports both RTMP and WHIP (WebRTC-HTTP Ingestion Protocol) for low-latency streaming. |

### Speech-to-Text/Translation Features

| Field                | Type    | Required | Description                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_allow             | boolean | Yes      | Enable or disable speech-to-text functionality. This feature uses Microsoft Azure, so ensure your API credentials are configured correctly on the server. |
| is_allow_translation | boolean | Yes      | Enable or disable automatic translation.                                                                                                                                                                                                                                                                                     |

### End-to-End Encryption (E2EE) Features

| Field                    | Type    | Required | Description                                                                                                                                                                                                                                   |
| ------------------------ | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_enabled               | boolean | Yes      | Enable or disable E2EE. Supported browsers: Chromium 83+, Google Chrome, Microsoft Edge, Safari, Firefox 117+. **Note:** Users cannot join if their browser does not support E2EE.                                                           |
| included_chat_messages   | boolean | No       | Enable or disable E2EE for chat messages.                                                                                                                                                                                                    |
| included_whiteboard      | boolean | No       | Enable or disable E2EE for whiteboard messages (SCENE_UPDATE, POINTER_UPDATE). May increase CPU usage; enable only if necessary.                                                                      |

### Default Lock Settings

| Field                  | Type    | Required | Description                  |
| ---------------------- | ------- | -------- | ---------------------------- |
| lock_microphone        | boolean | No       | Lock microphone for users.   |
| lock_webcam            | boolean | No       | Lock webcam for users.       |
| lock_screen_sharing    | boolean | No       | Lock screen sharing for users.|
| lock_chat              | boolean | No       | Lock chat for users.         |
| lock_chat_send_message | boolean | No       | Lock sending messages in chat.|
| lock_chat_file_share   | boolean | No       | Lock file sharing in chat.   |

### Copyright Configuration

This feature is available only if the server configuration `client > copyright_conf > allow_override` is set to `true`.

| Field   | Type   | Required | Description                                                                 |
| ------- | ------ | -------- | ----------------------------------------------------------------------------- |
| display | boolean| Yes      | Enable or disable the display of copyright text.                           |
| text    | string | Yes      | Copyright text. Keep it concise. Supported HTML tags: `b`, `i`, `em`, `strong`, `a` |

### Example

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
      "enable_analytics": true,
      "allow_virtual_bg": true,
      "allow_raise_hand": true,
      "auto_gen_user_id": false,
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
| status                 | boolean                        | Indicates if the request was successful. |
| msg                    | string                         | Response message.         |
| [room_info](/docs/api/room/room-info.md#room-info) | object | Details about the room.   |
