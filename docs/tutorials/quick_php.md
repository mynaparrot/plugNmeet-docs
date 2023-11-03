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
        "allow_rtmp" => true,
        "allow_view_other_webcams" => true,
        "allow_view_other_users_list" => true,
        "admin_only_webcams" => false,
        "enable_analytics" => true,
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

$isRoomActive = false;
$output = new stdClass();
$output->status = false;

try {
    $res = $connect->isRoomActive($roomId);
    $isRoomActive = $res->getStatus();
    $output->status = true;
    $output->msg = $res->getResponseMsg();
} catch (Exception $e) {
    $output->msg = $e->getMessage();
}

if (!$isRoomActive && $output->status) {
    try {
        $create = $connect->createRoom($roomId, "Test room", "Welcome to room", $max_participants, "", $roomMetadata);

        $isRoomActive = $create->getStatus();
        $output->status = $create->getStatus();
        $output->msg = $create->getResponseMsg();
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}

if ($isRoomActive && $output->status) {
    try {
        $join = $connect->getJoinToken($roomId, $user_full_name, $userId, true);

        $output->url = $config->plugnmeet_server_url . "?access_token=" . $join->getToken();
        $output->status = $join->getStatus();
        $output->msg = $join->getResponseMsg();
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}

```

When we'll get value of `$output->url` that time we can redirect user like this:

```PHP
header("Location: " . $output->url);
```

You can also build plugNmeet client interface by using [getClientFiles](/docs/api/get-client-files) API. You'll be able to customize the page more freely and won't need to use iFrame. Have a look an example of [conference.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/conference.php) file.