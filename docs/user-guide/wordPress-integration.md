---
description: A complete guide on how to add a secure, self-hosted video conferencing solution to your WordPress site using the official Plug-N-Meet plugin.
sidebar_position: 4
sidebar_label: WordPress Integration
---

# How to Add Video Conferencing to WordPress with the Plug-N-Meet Plugin

This guide provides a complete walkthrough for integrating the powerful, self-hosted Plug-N-Meet video conferencing solution with your WordPress website. By the end, you will be able to host secure video meetings directly from your own domain.

---

## Part 1: Installation & Initial Setup

This section covers installing the plugin and connecting it to your PlugNmeet server.

### 1. Install the Plugin

- From your WordPress dashboard, navigate to **Plugins > Add New**.
- In the search bar, type **plugnmeet**.
- Find the official Plug-N-Meet plugin in the search results and click **Install Now**.

![plugin-min.png](/img/wordpress/plugin-min.png)

### 2. Activate the Plugin

- After the installation is complete, click the **Activate** button.

![plugin-acrive-min.png](/img/wordpress/plugin-acrive-min.png)

### 3. Connect to Your Server (API Settings)

This is the most important step. You must connect the plugin to a working PlugNmeet server.

- From your WordPress dashboard, navigate to the new **Plug-N-Meet** menu item and select **Settings**.
- You will see three fields: **Server URL**, **API Key**, and **API Secret**.

![server-settings-min.png](/img/wordpress/server-settings-min.png)

- These fields must be filled with your server's API credentials. After activation, they may be pre-filled with demo credentials.
- **You must replace these with the API details from your own self-hosted or PlugNmeet Cloud server to ensure full functionality.**

---

## Part 2: Creating & Publishing Your First Meeting

Now that the plugin is configured, you can create and display a meeting room on your site.

### 1. Create a New Room

- From the WordPress dashboard, go to **Plug-N-Meet > Rooms**.
- Click **Add New**.

![room-add-new-min.png](/img/wordpress/room-add-new-min.png)

### 2. Configure Room Settings

- **Title & Description:** Give your meeting room a clear title.
- **Passwords:** Set passwords for moderators and attendees.
- **Welcome Message:** Customize the initial message that appears in the chat.
- **Max Participants:** Set a limit on the number of users who can join (use `0` for unlimited).
- **Room Features:** Enable or disable core features like webcams, screen sharing, and recording.
- **Default Lock Settings:** Configure which features are locked by default when a user joins (e.g., microphone, chat).

### 3. Publish the Room

- Once you have configured the room to your liking, click **Submit**.

![room-submit-min.png](/img/wordpress/room-submit-min.png)

### 4. Display the Room on a Page

- Go to **Plug-N-Meet > Rooms** and find the room you just created.
- In the **Shortcode** column, copy the unique shortcode for that room.

![select-shortcodes.png](/img/wordpress/select-shortcodes.png)

- Go to **Pages > Add New** (or edit an existing page).
- Paste the shortcode into the content area of the page.

![paste-shortcodes.png](/img/wordpress/paste-shortcodes.png)

- Click **Update** or **Publish**.
- You can now view the page to see your live meeting room.

---

## Part 3: The Attendee Experience

When a user visits the page containing your meeting room shortcode, they will see a simple login screen.

- **Joining:** Attendees enter their name and the required password to join the meeting.
- **No Password:** If you did not set a password, they will only need to enter their name.

<img src="/img/wordpress/wordpress-join-pass.png" loading="lazy"/>

---

## Part 4: Advanced Configuration (Optional)

These settings allow you to further customize the look and feel of your meetings.

### Design Customization

You can customize colors and logos globally (for all rooms) or for a single, specific room.

- **Global Customization:** Navigate to **Plug-N-Meet > Settings** and scroll down to **Design Customization**.
- **Per-Room Customization:** Edit a specific room and go to the **Design Customization** tab.

Here you can change the logo, background, and all primary and secondary colors to match your brand.

<img src="/img/wordpress/plugin-room-customization-page.png" width="600" alt="/img/wordpress/plugin-room-customization-page.png" loading="lazy" />

### User Role Permissions

From the **Plug-N-Meet > Settings** page, click the **Permission** tab to configure how different WordPress user roles interact with the meeting rooms. You can control who can join as a moderator, who needs a password, and who can manage recordings.

<img src="/img/wordpress/wordpress-permission-config.png"loading="lazy"/>

### Client Version Settings

Under **Plug-N-Meet > Settings**, you can choose how the client is loaded.

- **Remote (Default):** The client is automatically updated when you update the plugin. This is recommended for most users.
- **Local:** Allows you to use a custom-hosted version of the client if you have specific modifications.

<img src="/img/wordpress/client-version.png"loading="lazy"/>

---

## Common Questions & Troubleshooting

**Why do I see an 'Invalid API' or other errors?**
This usually means the demo credentials have expired or you are trying to use a feature disabled on the demo server. You must replace the default API details in the Settings page with the credentials from your own PlugNmeet server.

**Can I use this plugin without a PlugNmeet server?**
No. This plugin is a client that connects your WordPress site to a PlugNmeet server. You must have either a self-hosted server or a PlugNmeet Cloud subscription for the plugin to work.
