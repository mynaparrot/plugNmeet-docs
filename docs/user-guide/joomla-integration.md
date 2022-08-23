---
description: plugNmeet user guide for Joomla platform
sidebar_position: 6
---

# Joomla Integration

With this tutorial, you will be able to know how to install and use **plugNmeet** in **Joomla**.

## Installing plugNmeet for Joomla

1. Go to the section of our **Joomla** where we can **install Extensions** (Extensions>Manage>Install).

![Joomla-2.png](/img/Joomla/Joomla-2.png)

2. Select "**Install from web**" option and search "**plugNmeet**" then you will find the extension.

<img src="/img/Joomla/joomla-installweb-search.png"loading="lazy"/>  

3. Go to the detail page of plugNmeet extension and click "**Install**" 

<img src="/img/Joomla/Joomla-install.png"loading="lazy"/> 

4. You will see the final successful installation page like this 

<img src="/img/Joomla/Joomla-success.png"loading="lazy"/> 

## Plugin Configuration 

After the plugin is successfully installed, you can go to the plugin configuration page by clicking System==>Global Configration==> plugNmeet 

<img src="/img/Joomla/Joomla-plugin-config.png" width="600" alt="/img/Joomla/Joomla-plugin-config.png" loading="lazy" /> 


Then click plugNmeet config 

It will automatically be filled with demo API information. If you have a self-hosting installation, then you can replace it with your own server API information here. 


<img src="/img/Joomla/Joomla-plugnmeet-config.png" width="600" alt="/img/Joomla/Joomla-plugnmeet-config.png" loading="lazy" />

Don´t forget to click **_save_**  after you made any changes. 

That is demo server information, it may have some limitations, please replace it with your own server **_API_** information later.



## Update Client Version 


By default, the client load will choose the **remote** option. In this option, the client version will update automatically with the plugin update. Normally users don´t need to do anything with this. 

If you want to use some customized version of the client, you need to choose the **local** option, in this way you can manually update the client version. 

<img src="/img/Joomla/Joomla-client-version.png"loading="lazy"/>   


## Design Customization

In plugNmeet it is possible to customize the color and logo of all rooms to fit with your branding. 



Here's how.



### Global customization 



1. Go to the global customization page by clicking System==>Global Configration==> plugNmeet ==> Design Customization 



<img src="/img/Joomla/Joomla-globalcust.png" width="600" alt="/img/Joomla/Joomla-globalcust.png" loading="lazy" /> 



Below, we will explain each option:



| Option               | What does it mean?       |                                               
| ---------------------- | ------------------------------   | 
| Primary Color       | It is the color of the icons of the tools when it is active |
| Secondary Color      | It is the color of the icons of the tools when it is inactive |
| Background Color     | Color of the wallpaper in case you do not use an image. |
| Background Image     | Image to be used as wallpaper. If used, it will replace the wallpaper color. |
| Header Color     | Header bar color |
| Footer Color    | Color of the bottom bar of the room. |
| Left Bar Color     | Background color when the list of participants is displayed. |
| Right Bar Color    | Background color when chat is displayed. |



To select the desired color, click the column and it will pop up the color picker:

<img src="/img/Joomla/Joomla-globalcolor.png" width="600" alt="/img/Joomla/Joomla-globalcolor.png" loading="lazy" /> 



2. Finally, you click on **_Save_** so that all the changes are saved.



### Customization for a single meeting room

In PlugNMeet it is possible to customize the color and logo for a single room to fit your business needs. 



1. Go to the single room customization page by Componenets ==> plugNmeet ==> Manage Rooms

<img src="/img/Joomla/Joomla-mamageroom.png" width="600" alt="/img/Joomla/Joomla-mamageroom.png" loading="lazy" /> 



2. Choose the room you want to personalize.



<img src="/img/Joomla/Joomla-selectroom.png" width="600" alt="/img/Joomla/Joomla-selectroom.png" loading="lazy" /> 





3. Click "Design Customization" and the list of options will appear to customize the room.



<img src="/img/Joomla/Joomla-roomdesigncust.png" width="600" alt="/img/Joomla/Joomla-roomdesigncust.png" loading="lazy" /> 



Below, we will explain each option:



| Option               | What does it mean?       |                                               
| ---------------------- | ------------------------------   | 
| Primary Color       | It is the color of the icons of the tools when it is active |
| Secondary Color      | It is the color of the icons of the tools when it is inactive |
| Background Color     | Color of the wallpaper in case you do not use an image. |
| Background Image     | Image to be used as wallpaper. If used, it will replace the wallpaper color. |
| Header Color     | Header bar color |
| Footer Color    | Color of the bottom bar of the room. |
| Left Bar Color     | Background color when the list of participants is displayed. |
| Right Bar Color    | Background color when chat is displayed. |



To select the desired color, click the column and it will pop up the color picker:

Image-room-color picker

<img src="/img/Joomla/Joomla-roomcolor.png" width="600" alt="/img/Joomla/Joomla-roomcolor.png" loading="lazy" /> 

4. Finally, you click on **_Save_** so that all the changes are saved.


## Create a plugNmeet room in Joomla

1. First, you need to create a category. To do this, you go to the "**Components**" section, select "**Plug N Meet**" and finally "**Manage Rooms**".

![Joomla-5.png](/img/Joomla/Joomla-5.png)

2. We click on "**Room Categories**".

![Joomla-6.png](/img/Joomla/Joomla-6.png)

3. We click on "**+New**"

![Joomla-7.png](/img/Joomla/Joomla-7.png)

4. We write the title and description of the category.

![Joomla-8.png](/img/Joomla/Joomla-8.png)

5. We click on "**Save**" and a message will appear that has been created the category.

![Joomla-9.png](/img/Joomla/Joomla-9.png)

6. We return to the PlugNMeet menu. To do this, you go to the "**Components**" section, select "**Plug N Meet**" and finally "**Manage Rooms**".

![Joomla-10.png](/img/Joomla/Joomla-10.png)

7. Press on the "**+New**" button

![Joomla-11.png](/img/Joomla/Joomla-11.png)

8. We write the title and description of the conference that will be held in this room, as well as the category. The alias will be generated automatically.

![Joomla-12.png](/img/Joomla/Joomla-12.png)

9. We choose the password of the participant and moderator. By default, an auto-generated password will already come, but it is possible to change it.

![Joomla-13.png](/img/Joomla/Joomla-13.png)

10. We write the welcome message that will appear as the first message in the conference chat.

![Joomla-14.png](/img/Joomla/Joomla-14.png)

11. We choose the maximum number of participants who can enter the room. In case you want it to be unlimited, you place "**0**".

![Joomla-15.png](/img/Joomla/Joomla-15.png)

12. We customize the "**room features**". Next, we will explain each point:

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

![Joomla-16.png](/img/Joomla/Joomla-16.png)

13. We customize the "**chat features**". Next, we will explain each point:

| Feature           | Option | What does it mean?                                                                |
| ----------------- | ------ | --------------------------------------------------------------------------------- |
| allow chat        | Yes/No | Yes: Allows you to use the chat. / No: Unable to use chat.                        |
| allow file upload | Yes/No | Yes: Files can be uploaded in the chat. / No: You can't upload files in the chat. |

![Joomla-17.png](/img/Joomla/Joomla-17.png)

14. We customize the "**shared notepad features**" and "**whiteboard features**". Next, we will explain each point:

| Feature              | Option | What does it mean?                                                                              |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| allow shared notepad | Yes/No | Yes: It is allowed to use the notepad or notepad. / No: You cannot use the notepad or notebook. |
| allow whiteboard     | Yes/No | Yes: The whiteboard can be used. / No: The whiteboard cannot be used.                           |

![Joomla-18.png](/img/Joomla/Joomla-18.png)

![Joomla-19.png](/img/Joomla/Joomla-19.png)

15. We customize the "**default lock settings**". These settings will only affect the participants, that is, those who are moderators will still have access to everything, but the others will not.

| Feature                | Option | What does it mean?                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------------------ |
| lock microphone        | Yes/No | Yes: The microphone cannot be used. / No: The microphone can be used.          |
| lock webcam            | Yes/No | Yes: Unable to use webcam. / No: The webcam can be used.                       |
| lock screen sharing    | Yes/No | Yes: Unable to share screen. / No: Screen sharing can be shared.               |
| lock chat              | Yes/No | Yes: Unable to use chat. / No: Chat can be used.                               |
| lock chat send message | Yes/No | Yes: Unable to send messages in chat. / No: You can send messages in the chat. |
| lock chat file share   | Yes/No | Yes: Unable to upload a file in chat. / No: You can upload a file in the chat. |

![Joomla-20.png](/img/Joomla/Joomla-20.png)

16. We customize the "**Publishing**" section. Below, we'll explain each point for you to decide how to set it up.

| Feature          | What does it mean?                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Created Date     | You will choose the date on which the room is created.                                             |
| Access           | You can choose whether to publish the room, not publish, archive or delete it.                     |
| Meta Description | You will choose the description that will appear when they search for the room by a search engine. |
| Meta Keywords    | You will choose the keywords for the room                                                          |
| Author           | You can add description of the author of the room                                                  |
| Content Rights   | You can add information about content rights                                                       |

![Joomla-21.png](/img/Joomla/Joomla-21.png)

17. Then, we click on "**Save**" and the room will have been created.

![Joomla-22.png](/img/Joomla/Joomla-22.png)

## Access a plugNmeet room in Joomla

1. To access the room, we go to the "**Menus**" section, then, "**Main Menu**" and select "**Add New Menu Item**".

![Joomla-23.png](/img/Joomla/Joomla-23.png)

2. A new page will appear, and we click on the "**Select**" button in the "**Menu Item Type**" section.

![Joomla-24.png](/img/Joomla/Joomla-24.png)

3. A window will open, select "**Plug N Meet**" and then choose "**Single room**".

![Joomla-25.png](/img/Joomla/Joomla-25.png)

4. Then, in the "**Select a room**" section, we choose the room we have created. Then, add a title to the menu and click on "**Save**" to save the changes.

![Joomla-26.png](/img/Joomla/Joomla-26.png)

5. Now to be able to enter the room, we have to enter the main page of our Joomla as a visitor and we will see that in the menu the title we choose appears. In this example it is "**Classes**".

![Joomla-27.png](/img/Joomla/Joomla-27.png)

6. We click on the chosen name and the description of the room will appear. To enter we fill in the data of "**Name**" and "**Password**". It is important to remember that the password to be filled will be those that we previously configured for the participant or moderator. Finally, we press on "**Submit**" and we are already inside the room.

![Joomla-28.png](/img/Joomla/Joomla-28.png)
