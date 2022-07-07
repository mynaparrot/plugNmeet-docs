---
description: plugNmeet user guide for Learning Tools Interoperability (LTI)
sidebar_position: 7
---

# LTI

## Intro

plugNmeet support LTI **v1.0/1.1** as Provider. Users can join/manage sessions and download recordings from any LTI supported platform without changing any code.

## plugNmeet API info

Following information will require:

```
Launch URL: https://your-plug-n-meet.com/lti/v1
Consumer key: plug-n-meet API Key
Shared secret: plug-n-meet API Secret
```

For demo you can try following information:

```
Launch URL: https://demo.plugnmeet.com/lti/v1
Consumer key: plugnmeet
Shared secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

**Note:** Allowing `launcher's name` is recommended; otherwise, the user will see an empty name.

## Custom parameters (optional)

| Field                       | Type    | Description                                                                                           |
| :-------------------------- | ------- | :---------------------------------------------------------------------------------------------------- |
| room_duration               | Number  | If you want to set duration for the session. The should be in minutes. Default 0 which mean no limit. |
| allow_polls                 | Boolean | Default: true                                                                                         |
| allow_shared_note_pad       | Boolean | Default: true                                                                                         |
| allow_breakout_room         | Boolean | Default: true                                                                                         |
| allow_recording             | Boolean | Default: true                                                                                         |
| allow_rtmp                  | Boolean | Default: true                                                                                         |
| allow_view_other_webcams    | Boolean | Default: true                                                                                         |
| allow_view_other_users_list | Boolean | Default: true                                                                                         |
| mute_on_start               | Boolean | Default: false                                                                                        |
| primary_color               | String  | Interface primary color in hex code. Example: #004D90                                                 |
| secondary_color             | String  | Interface secondary color in hex code. Example: #004D90                                               |
| background_color            | String  | Interface background color in hex code. Example: #004D90                                              |
| custom_logo                 | String  | This should be direct https link. Example: https://mydomain.com/logo.png                              |

## UI view

**Moderator/Admin view**

![lti1.png](/img/lti/lti1.png)

![lti2.png](/img/lti/lti2.png)

**Student/Attendee view**

![lti3.png](/img/lti/lti3.png)

## Canvas LMS Example

Here we take Canvas LMS as an example to show you how it works.

1. Go to the Settings section and select **"Apps"**.

<img src="/img/lti/lti-add-apps.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

2. Then click on **"View App Configurations"**.

<img src="/img/lti/lti-app-config.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

3. Select **"+App"**.

<img src="/img/lti/lti-click-add.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

4. Fill in the API information.
   You can use following demo api information for testing:

```
Name: plugNmeet
Launch URL: https://demo.plugnmeet.com/lti/v1
Consumer key: plugnmeet
Shared secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

<img src="/img/lti/lti-add-api.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

5. Click **"Submit"** to save the changes.

<img src="/img/lti/lti-click-submit.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

6. A **notification** will appear that the plugNmeet app has been installed.
   You are able to join plugNmeet meetings via LTI now.

<img src="/img/lti/lti-sucess.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>
