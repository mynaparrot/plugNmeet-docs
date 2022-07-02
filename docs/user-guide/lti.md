---
description: plugNmeet user guide for Learning Tools Interoperability (LTI)
sidebar_position: 7
---

# LTI

plugNmeet support LTI **v1.0/1.1** as Provider. Users can join/manage sessions and download recordings from any LTI supported platform without changing any code.

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

## Custom parameters

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
| primary_color               | String  | Interface primary color in hash format. Example: #004D90                                              |
| secondary_color             | String  | Interface secondary color in hash format. Example: #004D90                                            |
| background_color            | String  | Interface background color in hash format. Example: #004D90                                           |
| custom_logo                 | String  | This should be direct https link. Example: https://mydomain.com/logo.png                              |

##### **Moderator/Admin view**

![lti1.png](/img/lti/lti1.png)

![lti2.png](/img/lti/lti2.png)

##### **Student/Attendee view**

![lti3.png](/img/lti/lti3.png)
