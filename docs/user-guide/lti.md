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
<img src="/img/lti/lti-canvas-1.png"loading="lazy"/> 

5. Click **"Submit"** to save the changes.

<img src="/img/lti/lti-click-submit.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

6. A **notification** will appear that the plugNmeet app has been installed.
   You are able to join plugNmeet meetings via LTI now.

<img src="/img/lti/lti-sucess.png" alt="/img/moderator/attendee-poll-min.png" loading="lazy"/>

## Chamilo LMS Example
To install plugNmeet, the following steps must be performed:

1. Go to the "Portal” section and select "Plugins".

<img src="/img/lti/lti-chamilo-1.png"loading="lazy"/>   


2. Search for "IMS/LTI" and select its checkbox and then click on "Enable the selected plugins".

<img src="/img/lti/lti-chamilo-2.png"loading="lazy"/>  

3. Then, the "Plugins" page will load again and in the "IMS/LTI" section you will select "Configure".

<img src="/img/lti/lti-chamilo-3.png"loading="lazy"/> 

4. Select "Yes" and click on "Save".

<img src="/img/lti/lti-chamilo-4.png"loading="lazy"/>  

5. Now that "IMS/LTI" is enabled, you must go to "My Courses".

<img src="/img/lti/lti-chamilo-5.png"loading="lazy"/>  

6. You choose the course where you want to add plugNmeet and click the pencil icon to edit the course.

<img src="/img/lti/lti-chamilo-6.png"loading="lazy"/> 

7. Go to the "IMS/LTI" section and click on "Configure external tools".

<img src="/img/lti/lti-chamilo-7.png"loading="lazy"/>  

8. You fill in the following data and then select "Add external tool".

<img src="/img/lti/lti-chamilo-8.png"loading="lazy"/> 

9. You select the title of your course.

<img src="/img/lti/lti-chamilo-9.png"loading="lazy"/>  

10. You go to the "Interaction" section, and you can view "plugNmeet" to use it.
<img src="/img/lti/lti-chamilo-10.png"loading="lazy"/>  

## Moodle LMS Example

To use plugNmeet via LTI, the following steps must be performed:

1. Go to "Site administration".

<img src="/img/lti/lti-moodle-1.png"loading="lazy"/> 

2. Click on "Plugins".

<img src="/img/lti/lti-moodle-2.png"loading="lazy"/>  

3. Scroll down and select "Manage tools".

<img src="/img/lti/lti-moodle-3.png"loading="lazy"/>  

4. Click on "Configure a tool manually".

<img src="/img/lti/lti-moodle-4.png"loading="lazy"/>    

5. Fill in the following data and then select "Save changes".

```
Name: plugNmeet
Tool URL: https://your-plug-n-meet/lti/v1
Consumer key: plug-n-meet API Key
Shared secret: plug-n-meet API Secret

```
**Replace with your own API key and Secret**

<img src="/img/lti/lti-moodle-5.png"loading="lazy"/>  


6. PlugNmeet is now ready to use via LTI tools on Moodle.

<img src="/img/lti/lti-moodle-6.png"loading="lazy"/>   
