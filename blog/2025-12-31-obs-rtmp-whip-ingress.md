---
title: "Stream Like a Pro: How to Bring OBS into Your plugNmeet Room"
slug: obs-rtmp-whip-ingress
authors: [bob,simon]
tags: [obs, streaming, rtmp, whip, features, ease-of-use, professional]
---

Have you ever wanted to share a high-quality video during a meeting, but the file was too large to upload? Or maybe you have a copyrighted video that you are allowed to show, but you can't share the file itself. Perhaps you're a power user who wants to create a professional presentation with multiple cameras, overlays, and smooth transitions using a tool like OBS Studio.

Traditionally, getting this kind of professional content into a live meeting has been complex or impossible.

At plugNmeet, we believe you should be able to use the best tools for the job. That's why we've built a simple but powerful feature called **Live Stream Input**. Think of it as giving your meeting its own private, secure TV channel. You can broadcast directly into your meeting room from professional software like OBS, and your stream appears as a regular participant.

<!--truncate-->

---

## Why Stream Directly into Your Meeting?

This feature unlocks a world of new possibilities:

*   **Share Large or Private Videos:** Play a high-resolution video file from your local computer without ever having to upload it.
*   **Professional Live Productions:** Use OBS Studio to switch between multiple cameras, share specific application windows, add professional graphics and lower thirds, and create a polished, TV-style presentation.
*   **Enhanced Demonstrations:** Show a complex software workflow or a live coding session with all the power and customization of your desktop setup.

## How to Set It Up: A Simple Step-by-Step Guide

Getting started is incredibly easy. Here’s how you do it from within your plugNmeet room:

1.  **Open the Settings Menu:** Click the three-dots menu in the top-right corner of your meeting room and select **Settings**.

2.  **Find Live Stream Input:** In the settings panel, navigate to the **Live Stream Input** tab.

3.  **Choose Your "Channel" Type (RTMP or WHIP):**
    You'll see an option called "Input Type." This lets you choose the technology for your stream. Think of it like choosing between two types of cables to connect your camera:
    *   **RTMP:** This is the trusty, universal standard. It's been used for years by platforms like YouTube and Twitch and is supported by almost every streaming application. It's a great, reliable choice.
    *   **WHIP:** This is the new, modern standard designed specifically for real-time communication. It's generally faster, with less delay between your stream and what your audience sees. If your software supports it, WHIP is the future-proof option.

4.  **Give Your Stream a Name:** In the **Display Name** field, you can type in a name for your stream. This is the name that will appear in the participant list. For example, "Main Presentation" or "Guest Speaker Cam." If you leave it blank, it will default to "Broadcaster."

5.  **Generate Your Private Link:** Click the **"Generate link"** button. plugNmeet will instantly create a unique and secure address for your private stream. You'll see two fields: a **URL** and a **Secret** (or "Stream Key").

## Connecting Your Streaming Software (like OBS)

Now, you just need to tell your software (we'll use OBS as an example) where to send the stream.

*   **For RTMP (The Universal Standard):**
    1.  In OBS settings, go to "Stream."
    2.  For "Service," choose "Custom..."
    3.  Copy the **URL** from plugNmeet and paste it into the "Server" field in OBS.
    4.  Copy the **Secret** from plugNmeet and paste it into the "Stream Key" field in OBS.

*   **For WHIP (The Modern Choice):**
    1.  In OBS settings, go to "Stream."
    2.  For "Service," choose "WHIP."
    3.  Combine the URL and Secret from plugNmeet into a single line. For example: `https://your-plugnmeet-domain.com/whip/A_LONG_SECRET_KEY_HERE`
    4.  Paste this full, combined address into the "Server" field in OBS.
    5.  **Leave the "Bearer Token" field in OBS blank.**

Once you hit "Start Streaming" in OBS, your stream will magically appear as a new participant in your plugNmeet room for everyone to see!

---

## Conclusion: Professional Power, Made Simple

The Live Stream Input feature is a perfect example of our philosophy. We've taken a powerful, professional-grade technology and made it accessible to everyone with just a few clicks. You don't need to be a technical expert to create a high-quality, polished, and engaging presentation.

The best tools are the ones that get out of your way and let your content shine.

---
**Ready to level up your presentations?**

*   **Try our [Live Demo](https://demo.plugnmeet.com/landing.html) and test it yourself**
*   **Explore our [Open-Source Project on GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **Read our [Scalable Deployment Guide](/docs/developer-guide/scalable-setup)**
