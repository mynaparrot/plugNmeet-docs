---
description: Quick join to plugNmeet using PHP
sidebar_position: 1
---

# Quick join using PHP

In this section you'll learn how to generate join token for joining a session using PHP. The flow will be like this:

<img src="/img/tutorials/quick_join_flow.png" width="400" alt="quick_join_flow.png" loading="lazy"/>

1. Step one to download [plugNmeet-sdk-php](https://github.com/mynaparrot/plugNmeet-sdk-php/releases) library

2. We'll use [plugNmeetConnect.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/plugNmeetConnect.php) class.

3. Create a file `quickJoin.php`

```PHP
require __DIR__ . "/plugNmeetConnect.php";

$config = new stdClass();
$config->plugnmeet_server_url = "http://localhost:8080";
$config->plugnmeet_api_key = "plugnmeet";
$config->plugnmeet_secret = "zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6";

$connect = new plugNmeetConnect($config);

$roomId = "room01"; // must be unique. You can also use $connect->getUUID();
$max_participants = 0; // value 0 means no limit (unlimited)
$user_full_name = "Your name";
$userId = "Your-Unique-User-Id"; // must be unique for each user.

$roomMetadata = array(
    "room_features" => array(
        "allow_webcams" => true,
        "mute_on_start" => false,
        "allow_screen_share" => true,
        "allow_recording" => true,
        "allow_rtmp" => true,
        "allow_view_other_webcams" => true,
        "allow_view_other_users_list" => true,
        "admin_only_webcams" => false,
    ),
    "chat_features" => array(
        "allow_chat" => true,
        "allow_file_upload" => true
    ),
    "shared_note_pad_features" => array(
        "allowed_shared_note_pad" => false
    ),
    "whiteboard_features" => array(
        "allowed_whiteboard" => false
    ),
    "default_lock_settings" => array(
        "lock_microphone" => false,
        "lock_webcam" => false,
        "lock_screen_sharing" => true,
        "lock_chat" => false,
        "lock_chat_send_message" => false,
        "lock_chat_file_share" => false,
    )
);
$isRoomActive = false;
$output = new stdClass();
$output->status = false;

// first we'll check if room is active or not.
try {
    $res = $connect->isRoomActive($roomId);
    $isRoomActive = $res->status;
    $output->status = true;
    $output->msg = $res->msg;
} catch (Exception $e) {
    $output->msg = $e->getMessage();
}

// if not active then create it
if (!$isRoomActive && $output->status) {
    try {
        $create = $connect->createRoom($roomId, "Test room", "Welcome to room", $max_participants, "", $roomMetadata);

        $isRoomActive = $create->status;
        $output->status = $create->status;
        $output->msg = $create->msg;
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}

// if room active then generate join token
if ($isRoomActive && $output->status) {
    try {
        $join = $connect->getJoinToken($roomId, $user_full_name, $userId, true);

        $output->url = $config->plugnmeet_server_url . "?access_token=" . $join->token;
        $output->status = $join->status;
        $output->msg = $join->msg;
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}
```

When we'll get value of `$output->url` that time we can redirect user like this:

```PHP
header("Location: " . $output->url);
```
