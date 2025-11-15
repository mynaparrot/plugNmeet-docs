---
title: "How to Build Your Own Video Conferencing App in Under an Hour"
slug: build-video-conferencing-app-in-under-an-hour
authors: [jibon]
tags: [webrtc, api, sdk, developer, tutorial, programming]
---

Building a video conferencing application sounds like a monumental task. You have to wrestle with the complexities of WebRTC, set up signaling servers, manage STUN/TURN for NAT traversal, and handle the resource-intensive job of routing media streams. The backend infrastructure alone can take months to build and stabilize.

But what if you could skip all of that?

What if you could leverage a powerful, open-source platform that handles all the backend complexity, allowing you to build a fully functional, custom-branded video conferencing app in under an hour? With **plugNmeet**, you can.

This guide will show you the three core steps to building your own video app using plugNmeet's API-first architecture.

<!--truncate-->

---

## The Old Way: The Mountain of Complexity

Before we show you the easy way, it's important to appreciate the problems plugNmeet solves. Building a WebRTC app from scratch requires you to become an expert in:

1.  **Signaling:** Creating a system (usually with WebSockets) to coordinate connections between users.
2.  **NAT Traversal:** Setting up and managing STUN/TURN servers to allow users behind firewalls to connect to each other.
3.  **Media Server (SFU):** Deploying and scaling a Selective Forwarding Unit (like LiveKit, Mediasoup, or Janus) to efficiently route video and audio streams.
4.  **Backend Logic:** Writing an application server to manage rooms, users, and permissions.
5.  **Frontend UI:** Building a complete user interface from scratch to handle video elements, buttons, chat, and more.

This is a massive undertaking.

## The plugNmeet Way: An API-First Framework

plugNmeet bundles all of this complexity into a single, open-source server that you can install with an automated script. It provides you with a simple, powerful set of APIs that act as your building blocks.

Here's how you build your app in three steps.

### Step 1: Set Up the Backend (5 Minutes)

First, you need the plugNmeet server, which includes LiveKit for media and NATS for messaging. You can install everything on a fresh Ubuntu server using our automated installation script.

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh
chmod +x install.sh
./install.sh
```

That's it. You now have a production-ready media server and API endpoint. The script will provide you with your `API_KEY` and `API_SECRET`, which you'll need for the next step.

### Step 2: Control the Backend with an API Call (10 Minutes)

Next, you need to tell your backend to create a meeting room and generate a token for a user to join. This is done with a simple server-side API call.

You can use our official PHP SDK or JavaScript SDK, or call the API directly. Here’s a simple example in PHP:

```php
<?php
require __DIR__ . "/plugNmeetConnect.php";

$config = new stdClass();
$config->plugnmeet_server_url = "https://demo.plugnmeet.com"; // Your server URL
$config->plugnmeet_api_key = "plugnmeet"; // Your API Key
$config->plugnmeet_secret = "zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"; // Your API Secret

$connect = new plugNmeetConnect($config);

$roomId = "room01"; // Must be unique. You can also use $connect->getUUID();
$user_full_name = "John Doe";
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
$create = $connect->createRoom($roomId, "Test room", "Welcome to room", 0, "", $roomMetadata);
// $create->getStatus();

$join = $connect->getJoinToken($roomId, $user_full_name, $userId, true);
// $join->getStatus();

$url = $config->plugnmeet_server_url . "?access_token=" . $join->getToken();
echo $url;
```

This script creates a room and gives you a unique URL with a token that grants "John Doe" access to that room. You can find full example of PHP from [PHP Quick Start](/docs/tutorials/quick_php)

### Step 3: Display the Frontend (2 Minutes)

Now for the final piece: the user interface. Do you need to build one from scratch? No.

plugNmeet provides a complete, feature-rich, and customizable web client. You simply need to direct your user to the join URL generated in the previous step.

The join URL looks something like this:
`https://your-domain.com/conference/?access_token=YOUR_GENERATED_TOKEN`

When a user visits this link, the plugNmeet client application loads, authenticates them with the token, and places them directly into the video meeting.

---

## Conclusion: You're a Video App Developer Now

In the time it took to read this article, you've learned the entire workflow:

1.  **Install a powerful backend** with a single command.
2.  **Use a simple API call** to control rooms and users.
3.  **Use the pre-built client** to provide an instant user interface.

You've skipped the mountain of WebRTC complexity and gone straight to building your application. From here, you can use our **Design Customization** features to completely white-label the client, or use our webhooks to build complex business logic around your meetings.

The power of a complete WebRTC platform is now at your fingertips. What will you build?

---
**Ready to get started?**

*   **Follow the [Installation Guide](/docs/installation)**
*   **Explore the [API Documentation](/docs/api/intro)**
