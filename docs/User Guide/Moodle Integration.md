---
description: plugNmeet user guide for moodle platform
sidebar_position: 5
---

# Moodle Integration

With this tutorial, you will be able to know how to install and use **plugNmeet** in **Moodle**.

## Installing plugNmeet for Moodle

1. First, you have to download the **PlugNmeet** Zip file from this link: <br />https://github.com/mynaparrot/plugNmeet-Moodle/releases

![Moodle-1.png](/img/moodle/Moodle-1.png)

2. After we have the file already downloaded, we go to the section of our **Moodle** where we can install Plugins.

![Moodle-2.png](/img/moodle/Moodle-2.png)

3. Click on "**choose a file**" and select the downloaded file to finally click on "**Install plugin from the ZIP file**".

![Moodle-3.png](/img/moodle/Moodle-3.png)

4. We expect you to load and squeeze in "**Continue**" in the following steps until a page with the title "**Plugins check**" appears.

![Moodle-4.png](/img/moodle/Moodle-4.png)
![Moodle-5.png](/img/moodle/Moodle-5.png)

5. Click on the "**Upgrade Moodle database now**" button.

![Moodle-6.png](/img/moodle/Moodle-6.png)

6. Select "**Continue**"

![Moodle-7.png](/img/moodle/Moodle-7.png)

7. At the plugin configuration page, you can configure server API information and some of global customization options. You can upload your logs, enable and disable some features. After that, click on "**Save changes**"

![Moodle-8.png](/img/moodle/Moodle-8.png)

## Add a plugNmeet activity in a Moodle course

1. In order to use PlugNmeet for a course in Moodle, we must activate the course editing mode with the "**Turn editing on**" button.

![Moodle-9.png](/img/moodle/Moodle-9.png)

2. We place ourselves in a Topic and select the option to add **activity or resource**

![Moodle-10.png](/img/moodle/Moodle-10.png)

3. We select PlugNmeet, as it will allow us to create a conference room in the chosen Topic.

![Moodle-11.png](/img/moodle/Moodle-11.png)

4. We write the title and description of the conference that will be held in this room, as well as we can select in a box if we want the description of the course to be displayed on the course page.

![Moodle-12.png](/img/moodle/Moodle-12.png)

5. We write the welcome message that will appear as the first message in the conference chat.

![Moodle-13.png](/img/moodle/Moodle-13.png)

6. We choose the maximum number of participants who can enter the room. In case you want it to be unlimited, you place "**0**".

![Moodle-14.png](/img/moodle/Moodle-14.png)

7. We customize the "**room features**". Next, we will explain each point:

| Feature                     | Option | What does it mean?                                                                                                                            |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| allow webcams               | Yes/No | Yes: Allows you to use a camera. / No: No camera can be used.                                                                                 |
| mute on start               | Yes/No | Yes: All people are silenced when entering the room. / No: Everyone will be with their microphone on from the moment they enter the room.     |
| allow screen share          | Yes/No | Yes: Screen sharing is allowed. / No: Screen sharing is not allowed.                                                                          |
| allow recording             | Yes/No | Yes: The meeting can be recorded. / No: Unable to record.                                                                                     |
| allow rtmp                  | Yes/No | Yes: Live broadcasts are allowed. For example, on Youtube or Facebook. / No: Unable to perform transmissions.                                 |
| allow view other webcams    | Yes/No | Yes: The webcams of all participants can be viewed. / No: It will only be possible to view the webcams between the participant and moderator. |
| allow view other users list | Yes/No | Yes: You can view the list of participating users. / No: You can't see who is on the list of participants.                                    |
| admin only webcams          | Yes/No | Yes: Only the moderator has their webcam active. / No: No one can have their webcam active.                                                   |

![Moodle-15.png](/img/moodle/Moodle-15.png)

8. We customize the "**chat features**". Next, we will explain each point:

| Feature           | Option | What does it mean?                                                                |
| ----------------- | ------ | --------------------------------------------------------------------------------- |
| allow chat        | Yes/No | Yes: Allows you to use the chat. / No: Unable to use chat.                        |
| allow file upload | Yes/No | Yes: Files can be uploaded in the chat. / No: You can't upload files in the chat. |

![Moodle-16.png](/img/moodle/Moodle-16.png)

9. We customize the "**shared notepad features**" and "**whiteboard features**". Next, we will explain each point:

| Feature              | Option | What does it mean?                                                                              |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| allow shared notepad | Yes/No | Yes: It is allowed to use the notepad or notepad. / No: You cannot use the notepad or notebook. |
| allow whiteboard     | Yes/No | Yes: The whiteboard can be used. / No: The whiteboard cannot be used.                           |

![Moodle-17.png](/img/moodle/Moodle-17.png)

10. We customize the "**default lock settings**". These settings will only affect the participants, that is, those who are moderators will still have access to everything, but the others will not.

| Feature                | Option | What does it mean?                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------------------ |
| lock microphone        | Yes/No | Yes: The microphone cannot be used. / No: The microphone can be used.          |
| lock webcam            | Yes/No | Yes: Unable to use webcam. / No: The webcam can be used.                       |
| lock screen sharing    | Yes/No | Yes: Unable to share screen. / No: Screen sharing can be shared.               |
| lock chat              | Yes/No | Yes: Unable to use chat. / No: Chat can be used.                               |
| lock chat send message | Yes/No | Yes: Unable to send messages in chat. / No: You can send messages in the chat. |
| lock chat file share   | Yes/No | Yes: Unable to upload a file in chat. / No: You can upload a file in the chat. |

![Moodle-18.png](/img/moodle/Moodle-18.png)

11. We customize the "**Grade**" section. Below, we'll explain each point for you to decide how to set it up.

| Feature               | What does it mean?                                    |
| --------------------- | ----------------------------------------------------- |
| Grade > Type          | You will choose the type of qualification.            |
| Grade > Maximun grade | You will choose what the maximum grade is.            |
| Grade category        | You will choose the rating category.                  |
| Grade to pass         | You will choose what the grade is to pass the course. |

![Moodle-19.png](/img/moodle/Moodle-19.png)

12. We customize the "**Common module settings**" section. Below, we'll explain each point for you to decide how to set it up.

| Feature      | What does it mean?                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Availability | -If 'Show on course page' is selected , the activity is displayed for students. -If the other option "Hide from students" is chosen, the activity or resource is only. available to users with permission to view hidden activities (default, users with the role of teacher). |
| ID number    | It is an identity number of the activity; it is optional to fill it out or not.                                                                                                                                                                                                |

![Moodle-20.png](/img/moodle/Moodle-20.png)

13. We customize the "**Restrict access**" section. Below, we'll explain each point for you to decide how to set it up. In this section the objective is to restrict the access of the room based on certain criteria that you will decide.

![Moodle-21.png](/img/moodle/Moodle-21.png)

| Feature         | What does it mean?                                        |
| --------------- | --------------------------------------------------------- |
| Date            | Prevent access to (or from) a specific date and time.     |
| Grade           | It requires students to achieve a specific qualification. |
| User profile    | Control field-based access within the student's profile.  |
| Restriction set | A set of combined constraints can be added.               |

![Moodle-22.png](/img/moodle/Moodle-22.png)

14. We customize the "**Activity completion**" section. Next, we will explain each point so that you can decide how to configure it.

| Feature             | What does it mean?                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Completion tracking | If enabled, the completion of the activity will be tracked, either manually or automatically. |
| Expect completed on | The date on which the activity is expected to be completed is chosen                          |

![Moodle-23.png](/img/moodle/Moodle-23.png)

15. In the "**Tags**" section, we choose if we want to add a tag for the activity.

![Moodle-24.png](/img/moodle/Moodle-24.png)

16. In the "**Competencies**" section, we choose which competencies are carried with the course and what is needed to complete the activity. In this example it has been placed that they attach evidence.

![Moodle-25.png](/img/moodle/Moodle-25.png)

17. Finally, we click on "**Save and display**".

![Moodle-26.png](/img/moodle/Moodle-26.png)

18. The next page will appear and click on "**Join**". And you're done!

![Moodle-27.png](/img/moodle/Moodle-27.png)
