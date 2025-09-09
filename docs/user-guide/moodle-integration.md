---
description: A complete guide on how to install and configure the Plug-N-Meet video conferencing activity module for your Moodle learning environment.
sidebar_position: 5
sidebar_label: Moodle Integration
---

# How to Add a Video Conferencing Activity to Moodle with Plug-N-Meet

This guide provides a complete walkthrough for installing and configuring the Plug-N-Meet activity module for your Moodle learning environment. By following these steps, you can host secure, integrated video conferences directly within your Moodle courses.

---

## Part 1: Plugin Installation & Configuration

This section covers the initial installation and server setup for the Plug-N-Meet module.

### 1. Install from Moodle Plugin Directory

- As a Moodle administrator, navigate to **Site administration > Plugins > Install plugins**.
- Click the button **Install plugins from the Moodle plugins directory**.
- You will be redirected to the Moodle plugin directory. In the search box, type **plugnmeet** and click **Search**.
- Find the official Plug-N-Meet plugin and click **Install now**.

<img src="/img/moodle/Moodle-install-plugnmeet.png" alt="Install PlugNmeet from Moodle Directory" loading="lazy"/>

### 2. Complete the Installation

- You will be guided through several confirmation screens.
- Click **Continue** on each screen to proceed through the installation checks and database upgrade steps.

<img src="/img/moodle/Moodle-continue-4.png" alt="Update Moodle Database" loading="lazy"/>

### 3. Configure Server Settings

- After the installation process, you will be taken to the main settings page for Plug-N-Meet.
- **This is the most important step.** You must connect the plugin to a working PlugNmeet server.
- The **Server URL**, **API Key**, and **API Secret** fields may be pre-filled with demo credentials.
- **You must replace these with the API details from your own self-hosted or PlugNmeet Cloud server.** The demo server is for temporary testing only and has limitations.

![Moodle-8.png](/img/moodle/Moodle-8.png)

- Scroll down and click **Save changes**.

---

## Part 2: Adding a Video Conference to a Course

Once the plugin is installed and configured, you can add video conference activities to any course.

### 1. Add the PlugNmeet Activity

- Navigate to the Moodle course where you want to add the video conference.
- Click the **Turn editing on** button.
- In the desired course Topic, click **Add an activity or resource**.
- Select **PlugNmeet** from the list of activities.

![Moodle-11.png](/img/moodle/Moodle-11.png)

### 2. Configure the Activity

- **Meeting Name & Description:** Give your video conference a clear name and description.
- **Welcome Message:** Customize the initial message that appears in the meeting chat.
- **Max Participants:** Set a limit on the number of users who can join (use `0` for unlimited).

![Moodle-12.png](/img/moodle/Moodle-12.png)

### 3. Understanding Activity Settings

When creating a PlugNmeet activity, you have many options to customize the experience. These are grouped into sections:

- **Room Features:** Enable or disable core features like webcams, screen sharing, and recording.
- **Chat Features:** Control if the chat is enabled and if file uploads are allowed.
- **Shared Notepad & Whiteboard:** Enable or disable these collaborative tools.
- **Default Lock Settings:** Configure which features are locked by default for attendees when they join (e.g., microphone, chat). This is useful for lecture-style meetings.
- **Moodle-Specific Settings:** You can also configure standard Moodle settings like **Grade**, **Restrict access**, and **Activity completion** to control how the video conference integrates with your course gradebook and student progress.

![Moodle-15.png](/img/moodle/Moodle-15.png)

### 4. Save and Join

- Once you have configured all the settings, click **Save and display**.
- You and your students can now enter the meeting by clicking the **Join Session** button.

![Moodle-27.png](/img/moodle/Moodle-27.png)

---

## Part 3: Global & Advanced Settings (Optional)

As an administrator, you can configure global settings that apply to all PlugNmeet activities.

- **Location:** Navigate to **Site administration > Plugins > Activity modules > plugNmeet**.

### Design Customization

- In the settings area, click the **Design Customization** tab.
- Here you can change the logo, background, and all primary and secondary colors to match your school or organization's branding.

<img src="/img/moodle/Moodle-designcust.png" width="600" alt="Moodle Design Customization" loading="lazy" />

### Client Version Settings

- In the main settings area, you can choose how the client is loaded.
- **Remote (Default):** The client is automatically updated when you update the plugin. This is recommended for most users.
- **Local:** Allows you to use a custom-hosted version of the client if you have specific modifications.

<img src="/img/moodle/Moodle-client-version.png" loading="lazy"/>

---

## Common Questions & Troubleshooting

**Why do my students see an 'Invalid API' or other errors?**
This is the most common issue. It means you are still using the default demo credentials in the main plugin settings. You must replace these with the API details from your own self-hosted or PlugNmeet Cloud server. The demo server is for temporary testing only.

**How do I find the main plugin settings after installation?**
As a Moodle administrator, you can find the global settings under **Site administration > Plugins > Activity modules > plugNmeet**.
