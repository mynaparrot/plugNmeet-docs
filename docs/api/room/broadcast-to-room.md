---
title: Broadcast to Room API | plugNmeet API Reference
description: API endpoint documentation for broadcasting messages or notifications to a live video conference room. Learn how to send public or private chat messages and system notifications.
keywords: [api, broadcast, message, notification, chat api, video api, endpoint]
sidebar_position: 6
sidebar_label: Broadcast to Room
---

# Broadcast to Room

Endpoint: `/room/broadcastToRoom`

This powerful API allows your backend server to inject messages or notifications directly into an active Plug-N-Meet session in real-time. You can use it to send system-wide announcements, deliver private messages to specific users, or trigger custom notifications from your application's logic.

This endpoint is ideal for building integrations that require server-to-client communication, such as:
*   Sending alerts based on external events.
*   Delivering automated messages or instructions to participants.
*   Creating custom, private notification systems within your application.

## Request Parameters

The request must contain either a `chat_msg` or a `notification_msg` object.

| Field            | Type    | Required | Description                                                                                             |
| ---------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| room_id          | string  | Yes      | The unique identifier of the active room to which you want to broadcast.                                |
| only_to_admins   | boolean | No       | If `true`, the message will be sent to all participants with admin/moderator privileges.                |
| to_user_id       | string  | No       | If provided, the message will be sent to the specified user.                                            |
| chat_msg         | object  | No       | A [chat message](#chatmessage) object to be sent.                                                       |
| notification_msg | object  | No       | A [notification message](#notificationmsg) object to be displayed.                                      |

### Targeting Logic

The delivery of the message is determined by the `only_to_admins` and `to_user_id` fields:
-   If **neither** field is set, the message is sent to **everyone** in the room.
-   If `only_to_admins` is `true`, the message is sent to **all admins**.
-   If `to_user_id` is provided, the message is sent to that **specific user**.
-   If **both** `only_to_admins` and `to_user_id` are provided, the message is sent to **all admins AND the specified user**.

### ChatMessage

This object represents a message that will appear in the room's chat panel.

| Field   | Type   | Required | Description                      |
| ------- | ------ | -------- | -------------------------------- |
| message | string | Yes      | The content of the chat message. |

### NotificationMsg

This object represents a system-level notification that will pop up on the user's screen.

| Field      | Type                                                                                                                           | Required | Description                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------- |
| text       | string                                                                                                                         | Yes      | The text content of the notification.                                       |
| type       | [NatsSystemNotificationTypes](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_nats_msg.proto#L142) | No       | The style of the notification. `0 = info`; `1 = warning`; `3 = error`       |
| with_sound | boolean                                                                                                                        | No       | If `true`, the notification will play a sound for the recipient.            |

## Example

### Example 1: Sending a Public Chat Message to Everyone

```json
{
  "room_id": "room01",
  "chat_msg": {
    "message": "Hello everyone, the webinar will begin in 5 minutes."
  }
}
```

### Example 2: Sending a Private Notification to a Specific User

```json
{
  "room_id": "room01",
  "to_user_id": "user-456",
  "notification_msg": {
    "text": "Your private document is ready for review.",
    "type": 0
  }
}
```

### Example 3: Sending a Notification to All Admins and One Specific User

```json
{
  "room_id": "room01",
  "only_to_admins": true,
  "to_user_id": "vip-user-789",
  "notification_msg": {
    "text": "A VIP has just joined the waiting room.",
    "type": 1,
    "with_sound": true
  }
}
```

## Response

| Field       | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indicates if the request was successful. |
| msg         | string  | Response message.                        |
| status_code | number  | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
