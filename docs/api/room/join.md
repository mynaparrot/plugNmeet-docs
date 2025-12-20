---
title: Join Room API | plugNmeet API Reference
description: API endpoint documentation for generating a token to join a video conference room. Learn how to add participants and set moderator or attendee roles.
keywords: [api, join room, get token, access token, join meeting, room api, endpoint]
sidebar_position: 2
sidebar_label: Join
---

# Join Room

Endpoint: `/room/getJoinToken`

This endpoint generates a temporary token that grants a user access to a specific room. Before diving into the parameters, here are a few key concepts to keep in mind:

*   **Token Lifecycle**: The generated token is short-lived (its validity period is set in your server configuration) and designed for **one-time use**. You should consume it immediately by redirecting the user to the meeting URL. **Do not store this token for future use.**

*   **User ID Uniqueness**:
    *   Plug-N-Meet requires every participant in a session to have a unique `user_id`.
    *   If you created the room with `auto_gen_user_id: false` (the default), you are responsible for providing a unique `user_id` for each user.
    *   If a new user joins with a `user_id` that is already active in the room, the existing participant with that ID will be automatically disconnected. This is useful for allowing users to switch devices seamlessly.

*   **Room Existence**: You can only generate a join token for a room that has already been created and is currently active.

## Request Parameters

| Field                   | Type   | Required | Description                                 |
| ----------------------- | ------ | -------- | ------------------------------------------- |
| room_id                 | string | Yes      | The ID of the room you want to join.        |
| [user_info](#user-info) | object | Yes      | Information about the user joining the room.|

### User Info

| Field                           | Type    | Required | Description                                                  |
| --------------------------------| ------- | -------- | ------------------------------------------------------------ |
| name                            | string  | Yes      | The display name of the user.                                |
| user_id                         | string  | Yes      | A unique identifier for the user. **Note:** If the room was created with `auto_gen_user_id: true`, this value will be stored as `ex_user_id` and a random ID will be assigned to the user for the session. |
| is_admin                        | boolean | Yes      | If `true`, the user will join as a moderator with elevated privileges. If `false`, they will join as a standard participant. |
| is_hidden                       | boolean | No       | If `true`, the user will join as a spectator. They will not appear in the participant list and cannot interact. |
| [user_metadata](#user-metadata) | object  | Yes      | Additional metadata about the user.                          |

### User Metadata

| Field                                                           | Type    | Required | Description                                                                                                    |
| --------------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| profile_pic                                                     | string  | No       | URL of the user's profile picture.                                                                             |
| preferred_lang                                                  | string  | No       | Preferred language for the Plug-N-Meet client. See supported values [here](https://github.com/mynaparrot/plugNmeet-client/blob/main/src/helpers/languages.ts). Example: es-ES, bn-BD, de-DE, etc. |
| record_webcam                                                   | boolean | No       | Controls whether this user's webcam is included in server-side recordings. Defaults to `true`. Set to `false` to exclude. |
| ex_user_id                                                      | string  | No       | If empty, the value of `user_id` will be used.                                                                 |
| extra_data                                                      |  map  | No       | A map of custom key-value pairs. Both keys and values must be strings. e.g. `{"key": "value"}`|.                                                                         |
| [lock_settings](/docs/api/room/create#default-lock-settings)    | object  | No       | Lock settings for the user.                                                                                    |

### Example

```json
{
  "room_id": "room01",
  "user_info": {
    "name": "Your Name",
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
| ------ | ------- | -------- | ------------------------- |
| status | boolean | root     | Indicates if the request was successful. |
| msg    | string  | root     | Response message.         |
| token  | string  | root     | The join token.           |

### Using the Join Token

Once you receive the `token`, you can grant the user access to the meeting room. There are two ways to pass the token to the Plug-N-Meet client:

1.  **As a URL parameter (recommended)**: Pass the token in the query string as `access_token`.
2.  **As a cookie**: Set a cookie named `pnm_access_token` with the token as its value.

The URL parameter is the most straightforward method. Here's an example:

```
https://Your-Plug-N-Meet-Server.com/?access_token=<TOKEN HERE>
```

If you are hosting the [plugNmeet-client](https://github.com/mynaparrot/plugNmeet-client) static files elsewhere, you should also pass the token in the same way. For example, if your static files are in a `conference` directory:

```
https://Your-Domain.com/conference/?access_token=<TOKEN HERE>
```

**Note:** You can also use the [getClientFiles](/docs/api/get-client-files) API to retrieve all the CSS and JS files required to display the interface manually. This allows you to embed the Plug-N-Meet client anywhere without worrying about static build files.

## Custom Design

You can add an extra query parameter called `custom_design` to the join link to apply a unique design for each user. The value of `custom_design` should be a URL-encoded JSON string.

For a full list of supported parameters and their descriptions, please refer to the **[Design Parameters](/docs/developer-guide/design-customisation#design-parameters)** section in our Developer Guide.

**Example:**

```
https://Your-Domain.com/conference/?access_token=<TOKEN HERE>&custom_design=%7B%22primary_color%22%3A%22%23004D90%22%2C%22secondary_color%22%3A%22%2324AEF7%22%7D
```
