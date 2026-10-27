---
title: plugNmeet Joomla Integration | Add Video Meetings to Your Site
description: How to install and configure the plugNmeet component to add self-hosted video meetings and conferencing features to your Joomla website.
keywords: [joomla, joomla integration, joomla component, joomla video conference, joomla webrtc]
sidebar_position: 6
sidebar_label: Joomla Integration
---

# How to Add Video Conferencing to Joomla with the Plug-N-Meet Extension

This guide covers the plugNmeet component for Joomla (v3.2.1+). It brings the same full feature set as the WordPress and Moodle plugins to Joomla: full room control, recordings with merge, artifacts with analytics export, and Joomla permission-based access — all inside your Joomla site.

---

## 1. Key Features of the Joomla Integration

- **Full Room Control:** Create rooms with all plugNmeet features — waiting room, breakout rooms, polls, whiteboard, E2EE, SIP dial-in, and Insights AI (transcription, chat translation, AI summary).
- **Backend Management:** Manage rooms, recordings, and artifacts without leaving **Components > Plug N Meet**.
- **Recordings with Merge:** List, play, download, delete, and **merge multiple segments** into one MP4 from the Recordings screen.
- **Artifacts & Analytics:** View analytics reports, transcriptions, and AI summaries per room. Download analytics as Excel.
- **Joomla-Native Publishing:** Rooms are Joomla articles-like items with categories, plus **Single room** and **List rooms** menu item types.
- **Permission-Based Access:** Control who can join without password, join as moderator, and view/play/download/delete recordings per room via Joomla ACL.

## 2. Installation & Initial Setup

### Step 2.1: Install the Extension

- From your Joomla administrator panel, navigate to **System > Install > Extensions**.
- Select the **Install from Web** tab and search for **plugnmeet**.
- Find the official Plug-N-Meet extension and click **Install**.

![Joomla-install.png](/img/Joomla/Joomla-install.png)

- After a moment, you should see a confirmation that the installation was successful.

![Joomla-success.png](/img/Joomla/Joomla-success.png)

Alternatively, download the package from the [plugNMeet-Joomla GitHub releases](https://github.com/mynaparrot/plugNMeet-Joomla) and install via **Upload Package File**.

### Step 2.2: Connect to Your Server (API Settings)

This is the most important step. You must connect the extension to a working plugNmeet server.

- From your Joomla administrator panel, navigate to **System > Global Configuration**.
- In the left-hand menu, select **plugNmeet**.

![Joomla-plugin-config.png](/img/Joomla/Joomla-plugin-config.png)

- You will see three fields: **Server URL**, **API Key**, and **API Secret**.
- After installation, these fields are pre-filled with demo credentials. **You must replace these with the API details from your own self-hosted or plugNmeet Cloud server.** The demo server is for temporary testing only and has limitations.

![Joomla-plugnmeet-config.png](/img/Joomla/Joomla-plugnmeet-config.png)

- After entering your own credentials, click **Save**.

---

## 3. Creating & Publishing Your First Meeting

### Step 3.1: Organize with Categories (Optional)

Rooms can be grouped with Joomla categories:

- Go to **Components > Plug N Meet > Rooms Categories** and create categories (e.g., Classes, Meetings).
- Assign a category in the **Category** field when creating a room.
- The frontend **List rooms** menu type can filter by one category.

### Step 3.2: Create a Meeting Room

- From the Joomla administrator panel, go to **Components > Plug N Meet > Manage Rooms**.
- Click **+ New** to create a new meeting room.

![Joomla-12.png](/img/Joomla/Joomla-12.png)

The room form has the following tabs:

**Basic**
- **Title, Category & Description:** Title shown on the site; description shown on the room page.
- **Passwords:** Separate **Moderator** and **Attendee** passwords. They must be different.
- **Welcome Message:** Shown in chat on join.
- **Max Participants:** `0` for unlimited.

**Room Features**
Core in-room options: webcams, mute on start, screen share, view other webcams/users list, admin-only webcams, analytics, virtual background, raise hand, reactions, auto-generate user ID, and room duration (minutes, `0` = no limit).

**Recording Features**
Master switch plus cloud recording, auto-start cloud recording, and local recording.

**Chat / Shared Notepad / Whiteboard / External Media Player / Display External Link**
Toggle each tool. Whiteboard supports a **Preload File** URL (PDF/presentation).

**Waiting Room**
Enable to screen participants, plus a custom waiting room message.

**Breakout Room**
Enable and set max rooms (up to 10).

**Ingress / External Broadcasting**
Allow RTMP ingress and external broadcasting (with separate RTMP toggle).

**End-to-End Encryption**
Enable E2EE plus options for self-insert key, chat, and whiteboard inclusion. Note: E2EE disables some server-side features such as cloud recording and transcription.

**Polls / SIP Dial-In**
Enable polls. SIP dial-in adds options to enable on create and hide phone number (requires SIP configured on the server).

**Insights Features**
Master switch plus transcription (with translation and speech synthesis), chat translation, AI text chat, and AI meeting summarization. These require Insights/AI enabled on your plugNmeet server.

**Default Lock Settings**
Initial locked state for microphone, webcam, screen sharing, whiteboard, shared notepad, chat, private chat, chat send message, and chat file share. Moderators can unlock live.

**Design Customisation**
Per-room logo, background image, primary/secondary/background/header/footer/side-panel colors, and custom CSS URL (HTTPS). Empty = use global settings.

**Advanced Settings**
Simulcast, dynacast, stop mic track on mute, default webcam resolution (`h90`–`h2160`), screen share resolution, audio preset (`telephone`–`musicHighQualityStereo`), and video codec (`vp8`, `h264`, `vp9`, `av1`).

Click **Save** when done.

### Step 3.3: Permissions

Click the **Permissions** tab when editing a room to control Joomla group access per room:

- **Join passwordless** (`join.passwordless`): allowed groups can join without entering a password (name only).
- **Join as admin** (`join.admin`): allowed groups join as moderator even with the attendee password or no password.
- **Recording view / play / download / delete** (`recording.*`): granular control over the frontend recordings list. Guests should never get delete permission.

![room_permission.png](/img/Joomla/room_permission.png)

Use **Components > Plug N Meet** global **Options > Permissions** for site-wide defaults.

### Step 3.4: Display the Room on Your Site

You have two menu item types under **Plug N Meet**:

**Single room** — for one meeting:

- Navigate to **Menus > Main Menu** and click **+ Add New Menu Item**.
- In **Menu Item Type**, click **Select**, then choose **Plug N Meet > Single room**.

![Joomla-25.png](/img/Joomla/Joomla-25.png)

- In the **Select a room** dropdown, choose the room you just created.
- Give the menu item a **Title** (e.g., "Live Class") and click **Save**.

![Joomla-26.png](/img/Joomla/Joomla-26.png)

**List rooms** — for a directory of rooms:

- Choose **Plug N Meet > List rooms** as the menu item type.
- Optionally set **Choose a Category** to filter to one category.

---

## 4. The Attendee Experience

When a user clicks the menu item, they see the room title, description, and a join form.

- They enter their name and the room password, then click **Join**. The meeting opens in a new tab; closing it returns via `?returned=true`.
- Groups with **Join passwordless** permission see no password field.
- If the user has **Recording view** permission, a recordings table appears below the join form with **Play / Download / Delete** buttons according to their permissions.

![Joomla-28.png](/img/Joomla/Joomla-28.png)

## 5. Post-Session Management (Admin)

All assets are managed from **Components > Plug N Meet** without leaving Joomla.

### Managing Recordings

Go to **Components > Plug N Meet > Recordings**:

1. Select a room from the dropdown and click **Show**.
2. Use checkboxes to select segments and click **Merge** to combine them into one MP4 (confirmation shows the selected order).
3. Use per-row **Play / Download / Delete** actions.

### Accessing Artifacts

Go to **Components > Plug N Meet > Artifacts**:

1. Select a room and click **Show**.
2. Click an artifact ID to open its details page: room analytics table, per-user table (join/leave times, talk time, connection quality), and meeting summary where available.
3. Use **Download** for file artifacts, **Download Excel** for analytics reports, and **Delete** to remove.

## 6. Advanced Configuration

### Design Customization

- **Global:** **System > Global Configuration > plugNmeet > Design Customization** — applies to all rooms that leave per-room fields empty.
- **Per-Room:** Room edit form **Design Customisation** tab — overrides global for that room.

![Joomla-globalcust.png](/img/Joomla/Joomla-globalcust.png)

### Media Quality Defaults

Set sensible defaults in the **Advanced Settings** tab per room: `h720` webcam, `h1080fps15` screen share, `music` audio preset, and `vp8` codec suit most sites. Raise only if your server and clients have bandwidth.

---

## 7. Security and Privacy

- **Data Control:** You control the server (self-hosted or private cloud), so you control your data.
- **On-Premises Hosting:** The open-source plugNmeet server can run on your own hardware for GDPR/HIPAA-sensitive workloads.
- **Encryption:** All media is encrypted via WebRTC standards. Enable **E2EE** per room for maximum security.
- **Least Privilege:** Keep **Join as admin** and **Recording delete** restricted to Manager/Administrator/Super Users.

---

## Common Questions & Troubleshooting

**Why do I see an 'Invalid API' error on my meeting page?**
You are still using the default demo credentials. Replace them under **System > Global Configuration > plugNmeet** with your own server details.

**Join fails with "same password" error on save?**
Moderator and attendee passwords must differ. Change one and save again.

**How do I find the global settings after installation?**
As an administrator, go to **System > Global Configuration > plugNmeet**.

**Frontend shows no recordings?**
The user needs **Recording view** permission for that room (Permissions tab), and at least one cloud recording must exist for the room ID.
