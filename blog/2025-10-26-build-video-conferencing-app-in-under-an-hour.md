---
title: "How to Build Your Own Video Conferencing App in Under an Hour"
slug: build-video-conferencing-app-in-under-an-hour
authors: [jibon]
tags: [webrtc, api, sdk, developer, tutorial, programming,video-conferencing]
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

Next, your application's backend needs to communicate with the Plug-N-Meet server to create a room and generate a join token for a user. This is done with a simple server-side API call.

You can use our official [PHP SDK](https://github.com/mynaparrot/plugNmeet-sdk-php) or [JavaScript SDK](https://github.com/mynaparrot/plugNmeet-sdk-js), or call the API directly. Here’s a robust example in PHP that checks if a room is active before creating it:

```php
<?php
require __DIR__ . "/plugNmeetConnect.php";

// Step 1: Configuration
$config = new stdClass();
$config->plugnmeet_server_url = "https://your-plug-n-meet.com"; // Your server URL
$config->plugnmeet_api_key = "API_KEY"; // Your API Key
$config->plugnmeet_secret = "SECRET"; // Your API Secret

$connect = new plugNmeetConnect($config);

// Step 2: Room and User definitions
$roomId = "room01"; // Must be unique. You can also use $connect->getUUID();
$user_full_name = "Your Name";
$userId = "your-unique-user-id"; // Must be unique for each user.

// Define all the features for this specific room.
$roomMetadata = array(
    "room_features" => array(
        "allow_webcams" => true,
        "allow_screen_share" => true,
        "room_duration" => 0 // 0 = no limit
    ),
    // ... and many more options
);

// Step 3: The Logic Flow - Check, Create, Join
$isRoomActive = false;
$output = new stdClass();
$output->status = false;

// 3.1 Check if the room already exists
$res = $connect->isRoomActive($roomId);
if ($res->getStatus()) {
    $isRoomActive = $res->isActive();
}

// 3.2 If not, create the room
if (!$isRoomActive) {
    $create = $connect->createRoom($roomId, "Test room", "Welcome to room", 0, "", $roomMetadata);
    if ($create->getStatus()) {
        $isRoomActive = true;
    } else {
        // Handle room creation failure
        die($create->getResponseMsg());
    }
}

// 3.3 Generate the join token
if ($isRoomActive) {
    $join = $connect->getJoinToken($roomId, $user_full_name, $userId, true);
    if ($join->getStatus()) {
        // We have the token. Now we can build the URL.
        $accessToken = $join->getToken();
        $url = $config->plugnmeet_server_url . "?access_token=" . $accessToken;
        echo "Join URL: " . $url;
    } else {
        // Handle token generation failure
        die($join->getResponseMsg());
    }
}
```

This script creates a room and gives you a unique URL with a token that grants "John Doe" access to that room. You can find full example of PHP from [PHP Quick Start](/docs/tutorials/quick_php)

### Step 3: Display the Frontend (2 Minutes)

Now for the final piece: the user interface. Do you need to build one from scratch? No.

plugNmeet provides a complete, feature-rich, and customizable web client. You simply need to direct your user to the join URL generated in the previous step.

The join URL looks something like this:
`https://your-plug-n-meet.com/conference/?access_token=YOUR_GENERATED_TOKEN`

When a user visits this link, the plugNmeet client application loads, authenticates them with the token, and places them directly into the video meeting.

---

### The No-Code Alternative: Official Plugins

The API-first approach gives you ultimate flexibility to build a custom application. But what if you're using a popular platform like WordPress, Moodle, or Joomla and want to get started without writing any code?

For these platforms, we've done all the integration work for you. Our official plugins handle the API calls, shortcode generation, and user permissions automatically, allowing you to add and even monetize a fully-featured video conferencing service directly from your admin dashboard.

*   **[Launch a WordPress video conference service](/blog/no-code-video-conferencing-service-with-wordpress)**
*   **[Add a Moodle video conference to your courses](/blog/no-code-video-conferencing-moodle)**
*   **[Build a Joomla video conference business](/blog/no-code-video-conferencing-service-with-joomla)**

---

## Conclusion: You're a Video App Developer Now

In the time it took to read this article, you've learned the entire workflow:

1.  **Install a powerful backend** with a single command.
2.  **Use a simple API call** to control rooms and users.
3.  **Integrate the pre-built client** for an instant user interface.

You've skipped the mountain of WebRTC complexity and gone straight to building your application. From here, you can use our **Design Customization** features to completely white-label the client, or use our webhooks to build complex business logic around your meetings.

The power of a complete WebRTC platform is now at your fingertips. What will you build?

---
**Ready to get started?**

*   **Follow the [Installation Guide](/docs/installation)**
*   **Explore the [API Documentation](/docs/api/intro)**
