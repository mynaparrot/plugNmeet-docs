---
title: PHP Quick Start Guide | Create a Video Meeting with plugNmeet
description: A quick start tutorial for PHP developers showing how to use the plugNmeet PHP SDK to create and join a secure video conference room in minutes.
keywords: [php, tutorial, quick start, php sdk, example code, integration, webrtc php, video api php]
sidebar_position: 1
sidebar_label: PHP Quick Start
---

# PHP Quick Start: Create and Join a Meeting

This tutorial provides a complete, step-by-step example of how to use the `plugNmeet-sdk-php` library to create a new meeting room and generate a secure join token for a user.

The logic follows a common workflow: check if a room exists, create it if it doesn't, and then generate a URL for a user to join.

<img src="/img/tutorials/quick_join_flow.png" width="400" alt="Quick Join Logic Flow" loading="lazy"/>

---

## Prerequisites

Before you begin, ensure you have the following:

- A working PlugNmeet server with your API Key and Secret.
- The latest version of the [plugNmeet-sdk-php](https://github.com/mynaparrot/plugNmeet-sdk-php/releases) library downloaded.

---

## Step 1: Setup & Configuration

First, create a PHP file (e.g., `quickJoin.php`) and include the `plugNmeetConnect.php` class from the SDK. Then, create a configuration object with your server details.

```php
<?php
require __DIR__ . "/plugNmeetConnect.php";

// Step 1: Configuration
$config = new stdClass();
$config->plugnmeet_server_url = "http://localhost:8080"; // Your server URL
$config->plugnmeet_api_key = "plugnmeet"; // Your API Key
$config->plugnmeet_secret = "zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"; // Your API Secret

$connect = new plugNmeetConnect($config);
```

---

## Step 2: Define Room & User Parameters

Next, define the basic parameters for the room you want to create and the user who will be joining. The `$roomMetadata` array allows you to customize every aspect of the room's features, from enabling webcams to setting default lock permissions.

```php
// Step 2: Room and User definitions
$roomId = "room01"; // Must be unique. You can also use $connect->getUUID();
$user_full_name = "Your Name";
$userId = "your-unique-user-id"; // Must be unique for each user.

// Define all the features for this specific room.
$roomMetadata = array(
    "room_features" => array(
        "allow_webcams" => true,
        "mute_on_start" => false,
        "allow_screen_share" => true,
        "room_duration" => 0 // 0 = no limit
    ),
    // ... and many more options
);
```

<details>
<summary>View Full Room Metadata Options</summary>

```php
$roomMetadata = array(
    "room_features" => array(
        "allow_webcams" => true,
        "mute_on_start" => false,
        "allow_screen_share" => true,
        "allow_rtmp" => true,
        "allow_view_other_webcams" => true,
        "allow_view_other_users_list" => true,
        "admin_only_webcams" => false,
        "enable_analytics" => true,
        "allow_virtual_bg" => true,
        "allow_raise_hand" => true,
        "room_duration" => 0 // in minutes. 0 = no limit/unlimited
    ),
    "recording_features" => array(
        "is_allow" => true,
        "is_allow_cloud" => true,
        "is_allow_local" => true,
        "enable_auto_cloud_recording" => false
    ),
    "chat_features" => array(
        "allow_chat" => true,
        "allow_file_upload" => true
    ),
    "shared_note_pad_features" => array(
        "allowed_shared_note_pad" => true
    ),
    "whiteboard_features" => array(
        "allowed_whiteboard" => true,
        //"preload_file" => "https://mydomain.com/text_book.pdf"
    ),
    "external_media_player_features" => array(
        "allowed_external_media_player" => true
    ),
    "waiting_room_features" => array(
        "is_active" => false,
    ),
    "breakout_room_features" => array(
        "is_allow" => true,
        "allowed_number_rooms" => 2
    ),
    "display_external_link_features" => array(
        "is_allow" => true,
    ),
    "ingress_features" => array(
        "is_allow" => true,
    ),
    "speech_to_text_translation_features" => array(
        "is_allow" => true,
        "is_allow_translation" => true,
    ),
    "end_to_end_encryption_features" => array(
        "is_enabled" => false,
    ),
    "default_lock_settings" => array(
        "lock_microphone" => false,
        "lock_webcam" => false,
        "lock_screen_sharing" => true,
        "lock_whiteboard" => true,
        "lock_shared_notepad" => true,
        "lock_chat" => false,
        "lock_chat_send_message" => false,
        "lock_chat_file_share" => false,
        "lock_private_chat" => false // user can always send private message to moderator
    )
);
```

</details>

---

## Step 3: The Logic Flow - Check, Create, Join

The following code blocks implement the core logic.

### 3.1 Check if the Room is Active

First, we call the API to see if a room with the specified `$roomId` already exists and is active.

```php
$isRoomActive = false;
$output = new stdClass();
$output->status = false;

try {
    // Check if the room already exists on the server
    $res = $connect->isRoomActive($roomId);
    if (!$res->getStatus()) {
        $output->msg = $res->getResponseMsg();
    } else {
        $isRoomActive = $res->isActive();
        $output->status = true;
    }
} catch (Exception $e) {
    $output->msg = $e->getMessage();
}
```

### 3.2 If Not, Create the Room

If the room is not active, we proceed to create it using the parameters we defined earlier.

```php
if (!$isRoomActive && $output->status) {
    try {
        // The room doesn't exist, so we create it now.
        $create = $connect->createRoom($roomId, "Test room", "Welcome to room", 0, "", $roomMetadata);

        $isRoomActive = $create->getStatus();
        $output->status = $create->getStatus();
        $output->msg = $create->getResponseMsg();
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}
```

### 3.3 Generate the Join Token

Once we have confirmed the room is active (either because it already existed or we just created it), we can generate a secure, single-use join token for our user.

```php
if ($isRoomActive && $output->status) {
    try {
        // The room is active, now we can generate a join token.
        $join = $connect->getJoinToken($roomId, $user_full_name, $userId, true);

        $output->url = $config->plugnmeet_server_url . "?access_token=" . $join->getToken();
        $output->status = $join->getStatus();
        $output->msg = $join->getResponseMsg();
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}
```

---

## Step 4: Redirecting the User

After successfully generating the join token, the complete meeting URL will be in the `$output->url` variable. You can now redirect your user to this URL to join the meeting.

```php
if ($output->status) {
    header("Location: " . $output->url);
    exit;
} else {
    echo $output->msg;
}
```

---

## Next Steps

This quick start guide uses the simplest method to get a user into a room. For a more deeply integrated experience, you can build a custom client interface using the [getClientFiles()](/docs/api/get-client-files) API method. This allows you to host the client on your own page without using an iframe.

See the [conference.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/conference.php) file in our PHP-SDK for a complete example.
