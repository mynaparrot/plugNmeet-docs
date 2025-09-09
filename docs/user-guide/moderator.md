---
description: A complete guide for moderators on how to host and manage a video conference, use presentation tools, and engage with participants in Plug-N-Meet.
sidebar_position: 2
sidebar_label: Moderator Guide
---

# Moderator Guide: How to Host and Manage a Meeting

Welcome to the Moderator Guide. This document provides a complete overview of all the features and controls available to you as a meeting host or moderator.

The moderator has full control over the meeting, including managing participants, using presentation tools, and configuring room settings. This guide is structured to help you quickly find the feature you need.

---

## First Steps: Entering the Room & Choosing Your Audio

When you first enter a PlugNmeet room, you will be prompted to choose how you want to join the audio session. This is your most important first step.

![enter-the-room-min.png](/img/moderator/enter-the-room-min.png)

-   **Microphone:** Choose this option to speak and participate in the meeting. Your browser will ask for permission to access your microphone.
-   **Listen only:** Choose this option to join without a microphone. You will be able to hear everything but will not be able to speak.

**Important:** This choice is not permanent. If you join in "Listen only" mode, you can easily activate your microphone later from the main control bar.

---

## Section 1: Core Media Controls

These are the basic controls for your audio and video, located in the bottom-left of the control bar.

### Managing Your Microphone & Audio

- **Mute/Unmute:** If you joined with a microphone, click the **Microphone** icon to mute or unmute yourself.
- **Activate Microphone:** If you joined in "Listen only" mode, the icon will show a headset. Click it to leave the listen-only session and activate your microphone.
- **Change Audio Source:** Click the small arrow next to the microphone icon to switch between different microphones.

![audio-min.png](/img/moderator/audio-min.png)

### Managing Your Webcam & Virtual Backgrounds

- **Start/Stop Webcam:** Click the **Webcam** icon to start or stop sharing your video.
- **Virtual Backgrounds:** When starting your webcam, a preview window will appear. Here you can select a virtual background (blur or an image) before clicking **Share**.

![camera-min.png](/img/moderator/camera-min.png)

---

## Section 2: Presentation & Collaboration Tools

These tools allow you to present content and collaborate with your attendees.

### Sharing Your Screen

- Click the **Share Screen** icon in the main control bar.
- Your browser will prompt you to choose whether to share your entire screen, a specific application window, or a browser tab.
- To stop sharing, click the **Share Screen** icon again.

![sharescreen-min.png](/img/moderator/sharescreen-min.png)

### Using the Interactive Whiteboard

The whiteboard is a powerful tool for real-time collaboration.

- **Activate/Hide:** Click the **Whiteboard** icon in the control bar to show or hide it.
- **Tools:** Use the toolbar to draw shapes, write text, upload files (PDF, Word, etc.), and more.
- **Export:** You can export the whiteboard's content as a PNG or SVG file.

![whiteboard-min.png](/img/moderator/whiteboard-min.png)

### Using the Shared Notepad

- **Activate/Hide:** Open the **More Options** menu (...) in the control bar and select **Activate shared notepad**.
- The notepad allows all participants to write and edit text together in real-time. You can format text and import/export the content.

![notepad-min.png](/img/moderator/notepad-min.png)

### Sharing an External Video

You can share a video from a URL (like YouTube) or a local file.

- Open the **More Options** menu (...) and select **Start external Media Player**.
- Paste a video URL or upload a video file (MP4, WebM).
- The video will appear for all participants, and you will have playback controls.

<img src="/img/moderator/moderator-sharevideofile.jpg" alt="Share Video File" loading="lazy"/>

### Displaying an External Website (iframe)

You can display any website that allows embedding within an iframe.

- Open the **More Options** menu (...) and select **Display external link**.
- Enter the URL of the website you wish to share.

<img src="/img/moderator/moderator-iframe.png"loading="lazy"/>

---

## Section 3: Managing Participants

These features allow you to control and interact with your attendees.

### Viewing the Participant List

- Click the **Participants** icon in the control bar to open the participant panel. Here you can see everyone in the meeting.

### Using the Waiting Room

If the waiting room is enabled, you must approve attendees before they can join.

- Open the **More Options** menu (...) and select **Manage waiting room**.
- In the waiting room panel, you can see a list of users waiting to enter. You can **Accept** or **Reject** them individually, or all at once.
- You can also approve users directly from the participant list.

<img src="/img/moderator/waittingroom-min.png"alt="Manage Waiting Room" loading="lazy"/>

### Sending Private Chat Messages

- Open the **Participants** panel.
- Click the three-dot menu next to a user's name and select **Send private message**.
- This will open a private chat tab in the chat panel.

<img src="/img/moderator/privatemessage-min.png" alt="Send Private Message" loading="lazy"/>

### Using Room Lock Settings

This feature allows you to restrict what attendees can do.

- Open the **More Options** menu (...) and select **Room Lock Settings**.
- From here, you can lock attendees' microphones, webcams, screen sharing, and chat abilities.
- These locks do not affect other moderators.

![romlocko-min.png](/img/moderator/romlocko-min.png)

### Muting All Users

- To mute all attendees at once, open the **More Options** menu (...) and select **Mute all users**.
- This will not mute other moderators.

---

## Section 4: Advanced Engagement Features

Use these tools to create a more interactive and engaging session.

### Creating and Managing Polls

- Open the **Participants** panel and click the **Polls** tab.
- Click **Create new Poll**.
- Define your question and answer options, then click **Create poll**.
- Attendees will be prompted to vote. You can view the results in real-time, end the poll, and publish the results to the public chat.

<img src="/img/moderator/createpoll-min.png"alt="Create a Poll" loading="lazy"/>

### Using Breakout Rooms

Split participants into smaller, temporary groups for focused discussions.

- Open the **More Options** menu (...) and select **Manage breakout room**.
- Configure the number of rooms, the duration, and assign participants (or use random assignment).
- Click **Start breakout rooms**.
- While rooms are active, you can broadcast messages to all groups, join specific rooms, or end the breakout session.

<img src="/img/moderator/breakout-room-min.png" alt="Manage Breakout Rooms" loading="lazy"/>

### Live Streaming via RTMP

You can broadcast your meeting live to platforms like YouTube or Facebook.

- Open the **More Options** menu (...) and select **Start RTMP broadcasting**.
- Enter the RTMP URL and Stream Key provided by your streaming platform.

![rtmp-min.png](/img/moderator/rtmp-min.png)

---

## Section 5: Session Management

These actions control the overall meeting session.

### Recording the Meeting

Plug-N-Meet offers two distinct methods for recording your session: **Cloud Recording** (server-side) and **Local Recording** (browser-based). To start either, click the **REC** icon in the main control bar and choose your preferred option.

![recording-min.png](/img/moderator/recording-min.png)

#### Cloud Recording (Recommended)

This is the most reliable method. The recording is processed on your server, capturing the entire session without depending on your local computer's performance.

-   **Requirement:** To use Cloud Recording, the free and open-source `plugNmeet-recorder` component must have been installed on your server. This is an option during the main installation process.
-   **Troubleshooting:** If you see a "No recorder available" message, it means this component is not running on your server.
-   **How it works:** Simply select "Cloud Recording" to start. The REC icon will pulse to indicate that the server is recording. Click it again to stop.

#### Local Recording (Browser-Based)

This method uses your web browser's capabilities to capture and save the meeting directly to your computer. It has very specific requirements and is **only supported in Google Chrome**.

> **Important:** Local Recording is an advanced feature. For the best results, please read the following instructions carefully.

To capture all audio within the session (not just your own microphone), the recording must be performed by a "virtual" second user.

**Step-by-Step Instructions:**

1.  **Open a new Chrome window** (not just a new tab).
2.  Using the new window, **log in to the same meeting with a different user account** that has moderator privileges. You will now have two instances of yourself in the meeting.
3.  In this second window, click the **REC** icon and choose **Local Recording**.
4.  A Chrome prompt will appear asking you to share a tab. Select the tab of your *original* meeting session.
5.  **Crucial Step:** At the bottom of the Chrome prompt, you **must** check the box that says **"Share tab audio"**. If you do not enable this, only the video will be recorded, with no sound.

**Alternative Method (for capturing your microphone only):**

If you only need to record what your microphone picks up along with the main video, you can start local recording without a second user. However, you must **share your microphone first**, and *then* start the local recording. If you start recording before sharing your mic, your own audio will be excluded.

### Application Settings

- Click the three-dot menu in the **top-left** corner and select **Settings**.
- Here you can change the application language, manage data-saving preferences, and toggle notification sounds.

![settingsoption-min.png](/img/moderator/settingsoption-min.png)

### Ending vs. Logging Out of a Meeting

- **Log Out:** If you select **Log out** from the top-right menu, you will leave the meeting, but the session will remain active for other participants.
- **End Meeting:** If you select **End meeting**, the session will be terminated for **everyone**.

![end-min.png](/img/moderator/end-min.png)
