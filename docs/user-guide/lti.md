---
title: LTI Integration for LMS | Use plugNmeet with Canvas, Chamilo, etc.
description: A guide for connecting plugNmeet to any LTI-compatible Learning Management System (LMS) like Canvas, Chamilo, or others for online education.
keywords: [lti, lms, learning management system, canvas, chamilo, e-learning, integration]
sidebar_position: 7
sidebar_label: LTI Integration
---

# Integrating with any LMS using LTI

Learning Tools Interoperability (LTI) is a standard protocol that allows you to securely connect Plug-N-Meet to virtually any Learning Management System (LMS) like Canvas, Moodle, Chamilo, and more.

This method is ideal if there is no dedicated plugin for your platform or if your institution restricts the installation of custom plugins. It allows instructors and students to join meetings and view recordings directly from their course page.

---

## Part 1: General LTI Configuration Details

This section contains the information needed for **any** LTI integration.

### Required Credentials

To connect any LTI-compatible platform, you will need the following three pieces of information. The **Consumer Key** and **Shared Secret** must be obtained from your own PlugNmeet server's API settings.

```
Launch URL: https://your-plug-n-meet.com/lti/v1
Consumer key: [Your plugNmeet API Key]
Shared secret: [Your plugNmeet API Secret]
```

For temporary testing, you can use the public demo server:

```
Launch URL: https://demo.plugnmeet.com/lti/v1
Consumer key: plugnmeet
Shared secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

**Note:** It is highly recommended to allow the LTI tool to send the `launcher's name`; otherwise, the user will appear in the meeting with an empty name.

### User Interface Overview

- **Instructor/Moderator View:** When a user with an instructor role launches the LTI tool, they will see an administrative view allowing them to manage sessions and view recordings.

![lti1.png](/img/lti/lti1.png)

- **Student/Attendee View:** When a student launches the tool, they will see a simple page to join the current live session.

![lti3.png](/img/lti/lti3.png)

### Optional Custom Parameters

You can pass these optional parameters during the LTI configuration in your LMS to customize the meeting room experience.

| Field                 | Type    | Description                                                                 |
| :-------------------- | :------ | :-------------------------------------------------------------------------- |
| `room_duration`         | Number  | Session duration in minutes. `0` means no limit.                            |
| `allow_polls`           | Boolean | `true` (default) or `false`                                                 |
| `allow_shared_note_pad` | Boolean | `true` (default) or `false`                                                 |
| `allow_breakout_room`   | Boolean | `true` (default) or `false`                                                 |
| `allow_recording`       | Boolean | `true` (default) or `false`                                                 |
| `allow_rtmp`            | Boolean | `true` (default) or `false`                                                 |
| `mute_on_start`         | Boolean | `false` (default) or `true`                                                 |
| `primary_color`         | String  | Interface primary color in hex code (e.g., `#004D90`).                      |
| `secondary_color`       | String  | Interface secondary color in hex code.                                      |
| `background_color`      | String  | Interface background color in hex code.                                     |
| `custom_logo`           | String  | A direct HTTPS link to a logo image (e.g., `https://mydomain.com/logo.png`). |

---

## Part 2: LMS Integration Examples

This section provides step-by-step examples for popular Learning Management Systems.

### Canvas LMS Example

This example demonstrates how to add Plug-N-Meet as an external LTI app in Canvas.

1.  As an administrator, navigate to **Settings > Apps** in your Canvas course.
2.  Click **View App Configurations** and then **+App**.
3.  For **Configuration Type**, select **Manual Entry**.
4.  Fill in the fields with your PlugNmeet LTI credentials (Name, Consumer Key, Shared Secret, and Launch URL).
5.  Click **Submit**. The PlugNmeet app will now be available as an external tool for assignments and modules.

<img src="/img/lti/lti-canvas-1.png"loading="lazy"/>

### Chamilo LMS Example

1.  As an administrator, go to the **Plugins** page and enable the **IMS/LTI** plugin.
2.  Navigate to a course and click the pencil icon to edit its settings.
3.  Go to the **IMS/LTI** section and click **Configure external tools**.
4.  Click **Add external tool** and fill in the form with your PlugNmeet LTI credentials.
5.  After saving, **plugNmeet** will appear as an available tool in the **Interaction** section of your course.

<img src="/img/lti/lti-chamilo-8.png"loading="lazy"/>

### Moodle LMS Example

This LTI method is a great alternative if your Moodle hosting provider does not allow the installation of custom activity plugins.

1.  As an administrator, go to **Site administration > Plugins > Manage tools**.
2.  Click **Configure a tool manually**.
3.  Fill in the form with your PlugNmeet LTI credentials (Tool name, Tool URL, Consumer key, Shared secret).
4.  Click **Save changes**.
5.  Now, any course creator can add this to their course. Turn on **Edit mode** in a course, click **Add an activity or resource**, and select **External tool**.
6.  From the **Preconfigured tool** dropdown, select the **plugNmeet** tool you just created.
7.  Give the activity a name, save, and it will be ready for your students.

<img src="/img/lti/lti-moodle-3.png" loading="lazy"/>
<img src="/img/lti/lti-moodle-4.png" loading="lazy"/>
<img src="/img/lti/lti-moodle-5.png" loading="lazy"/>
<img src="/img/lti/lti-moodle-12.png" loading="lazy"/>
<img src="/img/lti/lti-moodle-13.png" loading="lazy"/>
---

## Common Questions & Troubleshooting

**What is the difference between using LTI and the dedicated Moodle plugin?**
The dedicated Moodle plugin offers deeper integration with Moodle features like grading and permissions. However, the LTI method is a universal solution that works for nearly any LMS and is a great alternative if you cannot install custom plugins.

**Why do I get an 'Authentication Failed' error?**
This almost always means the **Consumer Key** or **Shared Secret** is incorrect. Double-check that you have copied these values correctly from your PlugNmeet server's API settings and that they are entered correctly in your LMS.
