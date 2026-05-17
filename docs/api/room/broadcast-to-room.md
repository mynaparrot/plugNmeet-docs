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

| Field             | Type    | Required | Description                                                                                             |
| ----------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| room_id           | string  | Yes      | The unique identifier of the active room to which you want to broadcast.                                |
| only_to_admins    | boolean | No       | If `true`, the message or notification will be sent only to participants with admin/moderator privileges. |
| chat_msg          | object  | No       | A [chat message](#chatmessage) object to be sent.                                        |
| notification_msg  | object  | No       | A [notification message](#notificationmsg) object to be displayed.                       |

### ChatMessage

This object represents a message that will appear in the room's chat panel.

| Field      | Type   | Required | Description                                                                                                                              |
| ---------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| message    | string | Yes      | The content of the chat message.                                                                                                         |
| to_user_id | string | No       | If provided, the message will be sent as a private chat to the specified user. If omitted, the message will be sent to the public chat. |

### NotificationMsg

This object represents a system-level notification that will pop up on the user's screen.

| Field      | Type                            | Required | Description                                                                                                                                                         |
| ---------- |---------------------------------| -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| text       | string                          | Yes      | The text content of the notification.                                                                                                                               |
| type       | [NatsSystemNotificationTypes](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_nats_msg.proto#L142) | No       | The style of the notification. `0 = info`; `1 = warning`; `3 = error`                                                                                                     |
| with_sound | boolean                         | No       | If `true`, the notification will play a sound for the recipient.                                                                                                    |
| to_user_id | string                          | No       | If provided, the notification will be sent only to the specified user. If omitted, it will be sent to all participants (or all admins if `only_to_admins` is true). |

## Example

### Example 1: Sending a Public Chat Message

```json
{
  "room_id": "room01",
  "chat_msg": {
    "message": "Hello everyone, the webinar will begin in 5 minutes."
  }
}
```

### Example 2: Sending a Private Notification to an Admin

```json
{
  "room_id": "room01",
  "only_to_admins": true,
  "notification_msg": {
    "text": "A VIP has just joined the waiting room.",
    "type": 0,
    "with_sound": true,
    "to_user_id": "admin-user-123"
  }
}
```

## Response

| Field       | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indicates if the request was successful. |
| msg         | string  | Response message.                        |
| status_code | number  | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
