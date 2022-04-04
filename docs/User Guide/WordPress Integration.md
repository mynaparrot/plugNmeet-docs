---
description: plugNmeet user guide for wordpress integration
sidebar_position: 4
---

# WordPress Integration

You can integrate plugNmeet into your WordPress site to make video conferences inside your Website and under your domain URL.

In this tutorial, we will show you how to integrate it:

## Installation plugin

1. First, we have to access our WordPress dashboard:

![dashboard-min.png](/img/wordpress/dashboard-min.png)

2. Go to the Plugins section, then select "**Add New**".

![plugins-option-min.png](/img/wordpress/plugins-option-min.png)

3. Then, type in the search engine: **plugnmeet**. So that it shows us the following result:

![plugin-min.png](/img/wordpress/plugin-min.png)

4. Click on "**Install now**"

![plugin-min.png](/img/wordpress/plugin-min.png)

5. We wait for it to load, and then click "**Activate**"

![plugin-acrive-min.png](/img/wordpress/plugin-acrive-min.png)

6. Now within the WordPress dashboard, let's go to the "Plug-N-Meet" section, **luego**, select "Settings".

![plugins-settings-min.png](/img/wordpress/plugins-settings-min.png)

7. You fill in the following 4 spaces with this data, as shown here:(normally it will automatically filled after your active the plugin)

   1. **plugNmeet** Server URL: https://demo.plugnmeet.com
   2. **plugNmeet** API Key: **plugNmeet**
   3. **plugNmeet** Secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
   4. **Livekit** URL: **[https://livekit.plugnmeet.com](https://livekit.plugnmeet.com/)**

![server-settings-min.png](/img/wordpress/server-settings-min.png)

That is demo server information, it may have some limitations, please replace with your own server **_API_** information later.

## Create Meeting Room

1. To create a conference room, you need to be on your WordPress dashboard, go to Plug-N-Meet, and then choose "Rooms".

![room-min.png](/img/wordpress/room-min.png)

2. Select "Add New"

![room-add-new-min.png](/img/wordpress/room-add-new-min.png)

3. We write the title and description of the conference that will be held in this room.

![room-add-title-min.png](/img/wordpress/room-add-title-min.png)

4. We modify or leave the password generated automatically, both for the moderator and for the participant.

![room-pass-min.png](/img/wordpress/room-pass-min.png)

5. We write the welcome message that will appear as the first message in the conference chat.

![room-messages-min.png](/img/wordpress/room-messages-min.png)

6. We choose the maximum number of participants who can enter the room. In case you want it to be unlimited, you place "0".

![room-parti-limit-min.png](/img/wordpress/room-parti-limit-min.png)

7. We customize the "room features". Next, we will explain each point:

| Feature                     | Option | What does it mean?                                                                                                                            |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| allow_webcams               | Yes/No | Yes: Allows you to use a camera. / No: No camera can be used.                                                                                 |
| mute_on_start               | Yes/No | Yes: All people are silenced when entering the room. / No: Everyone will be with their microphone on from the moment they enter the room.     |
| allow_screen_share          | Yes/No | Yes: Screen sharing is allowed. / No: Screen sharing is not allowed.                                                                          |
| allow_recording             | Yes/No | Yes: The meeting can be recorded. / No: Unable to record.                                                                                     |
| allow_rtmp                  | Yes/No | Yes: Live broadcasts are allowed. For example, on Youtube or Facebook. / No: Unable to perform transmissions.                                 |
| allow_view_other_webcams    | Yes/No | Yes: The webcams of all participants can be viewed. / No: It will only be possible to view the webcams between the participant and moderator. |
| allow_view_other_users_list | Yes/No | Yes: You can view the list of participating users. / No: You can't see who is on the list of participants.                                    |
| admin_only_webcams          | Yes/No | Yes: Only the moderator has their webcam active. / No: No one can have their webcam active.                                                   |

![room-features-min.png](/img/wordpress/room-features-min.png)

8. We customize the "chat features". Next, we will explain each point:

| Feature           | Option | What does it mean?                                                                |
| ----------------- | ------ | --------------------------------------------------------------------------------- |
| allow_chat        | Yes/No | Yes: Allows you to use the chat. / No: Unable to use chat.                        |
| allow_file_upload | Yes/No | Yes: Files can be uploaded in the chat. / No: You can't upload files in the chat. |

9. We can **_enable/disable_** the shared notepad and whiteboard settings.

![room-notepad-whiteboard-min.png](/img/wordpress/room-notepad-whiteboard-min.png)

10. We customize the "default lock settings". Next, we will explain each point:

| Feature                | Option | What does it mean?                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------------------ |
| lock_microphone        | Yes/No | Yes: The microphone cannot be used. / No: The microphone can be used.          |
| lock_webcam            | Yes/No | Yes: Unable to use webcam. / No: The webcam can be used.                       |
| lock_screen_sharing    | Yes/No | Yes: Unable to share screen. / No: Screen sharing can be shared.               |
| lock_chat              | Yes/No | Yes: Unable to use chat. / No: Chat can be used.                               |
| lock_chat_send_message | Yes/No | Yes: Unable to send messages in chat. / No: You can send messages in the chat. |
| lock_chat_file_share   | Yes/No | Yes: Unable to upload a file in chat. / No: You can upload a file in the chat. |

11. Finally, we publish it by clicking on "Submit".

![room-submit-min.png](/img/wordpress/room-submit-min.png)

## Create a meeting room page

1. Go to the Plug-N-Meet section, to click on "Rooms".

![room-min.png](/img/wordpress/room-min.png)

2. Select the room created

![select-room.png](/img/wordpress/select-room.png)

3. Select the **_shortcode_** and copy it.

![select-shortcodes.png](/img/wordpress/select-shortcodes.png)

4. You go to "Pages" or "Posts", whichever is of your preference, and then "Edit" the new page or post or one that is already created.

![edit-page-posts.png](/img/wordpress/edit-page-posts.png)

5. Paste the **_shortcode_**.

![paste-shortcodes.png](/img/wordpress/paste-shortcodes.png)

6. We update or publish the page

![update-publish.png](/img/wordpress/update-publish.png)

7. We click on "View Post". To get the meeting.

![view-posts-page.png](/img/wordpress/view-posts-page.png)

## Join a meeting

Share the meeting room page link to your attendees and they will see the following page.
Just input the name and password, and click login,they will join you in the same room.
![last.png](/img/wordpress/last.png)
For how to use plugNmeet as moderator , check this tutorial
For how to use plugNmeet as attendee , check this tutorial
