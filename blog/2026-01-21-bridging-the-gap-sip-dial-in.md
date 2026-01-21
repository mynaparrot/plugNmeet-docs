---
title: "Bridging the Gap: How SIP Dial-In Connects Your Meetings to Any Phone"
slug: sip-dial-in-for-video-conferencing
authors: [bob]
tags: [sip, voip, telephony, integration, accessibility, feature, moderator, admin]
date: 2026-01-21
---

We've all been there: a crucial meeting is about to start, but a key participant has a spotty internet connection, is traveling, or simply doesn't have access to a computer. In a world increasingly reliant on video calls, how do you ensure everyone can still participate, even if they can't join online?

At Plug-N-Meet, we believe in inclusivity. That's why we're excited to introduce **SIP Dial-In**, a powerful feature that allows participants to join the audio of your video meetings using any standard telephone. No internet, no problem.

This feature seamlessly bridges the gap between your online conference and the traditional telephone network, ensuring that every voice can be heard, regardless of their connectivity.

<!--truncate-->

---

### The Problem: When Internet Isn't an Option

While WebRTC-based video conferencing is incredibly powerful, it relies on a stable internet connection. This can be a barrier for:
*   **Travelers:** On the road, in a car, or in areas with poor Wi-Fi.
*   **Remote Locations:** Participants in regions with limited internet infrastructure.
*   **Accessibility Needs:** Individuals who prefer or require telephone access.
*   **Simple Audio-Only Participation:** Sometimes, all you need is to listen and speak, without the video.

### The Solution: Plug-N-Meet's SIP Dial-In

Our SIP Dial-In feature integrates your Plug-N-Meet meetings with the global telephone network. It works by setting up a **SIP Gateway** that acts as a bridge, allowing traditional phone calls to connect directly into your online conference.

#### How It Works for Participants (Simple & Familiar)

1.  A participant receives a standard phone number and a unique PIN for the meeting.
2.  They dial the number from any phone (mobile or landline).
3.  They enter the PIN when prompted.
4.  They are instantly connected to the meeting's audio, able to hear and speak with everyone in the online session.

#### How It Works for Moderators (Easy Control)

Moderators have full control over the SIP dial-in service from within the meeting:
*   **Enable/Disable:** Start or stop the dial-in service for the current session.
*   **View Information:** See the active dial-in number(s) and PIN.
*   **Share Instantly:** With a single click, post the dial-in details directly into the public chat for all online participants.
*   **Privacy Options:** Choose to mask the dial-in number in the participant list, showing only the last four digits for added privacy.

### Technical Deep Dive: Powering the Connection

Under the hood, Plug-N-Meet leverages the robust **[livekit/sip](https://github.com/livekit/sip)** project as its SIP gateway. This component is responsible for managing the connection between your meeting and an external SIP trunking provider.

#### For Administrators: Server Setup is Key

To enable SIP Dial-In, your system administrator must perform a one-time server-side configuration:
1.  **`config.yaml` Setup:** The `livekit_sip_info` section in your Plug-N-Meet server's `config.yaml` file must be configured with your SIP provider's details.
2.  **External SIP Provider:** You will need an account with a SIP trunking provider (e.g., Twilio, SignalWire, etc.) to handle the actual phone calls to and from the public telephone network (PSTN).

#### Security Considerations: Encrypting the Phone Leg

While the SIP audio stream itself cannot be end-to-end encrypted (as it must traverse the traditional phone network), the connection between your SIP gateway and your SIP provider *can* be secured. The `livekit/sip` service supports `SIPMediaEncryption` (SRTP), which encrypts the audio stream over the internet. It is the administrator's responsibility to enable this and ensure their chosen SIP provider supports it.

#### E2EE Incompatibility

It's important to note that the SIP gateway must process unencrypted audio to bridge the call. Because of this, **SIP Dial-In is automatically disabled for any room where End-to-End Encryption (E2EE) is active**. This ensures that the integrity of your E2EE sessions is never compromised.

### Conclusion: Expanding Your Reach

Plug-N-Meet's SIP Dial-In feature is more than just a convenience; it's a powerful tool for inclusivity and accessibility. It ensures that your meetings can reach a wider audience, providing a reliable audio connection even when internet access is a challenge.

By bridging the gap between online and traditional telephony, Plug-N-Meet empowers you to connect with everyone, everywhere.

---

**Ready to expand your meeting's reach?**

*   **Learn how to enable SIP Dial-In when creating a room via the [Create Room API](/docs/api/room/create).**
*   **Understand the security implications in our [Security Overview](/docs/security-overview).**
*   **Explore the [livekit/sip GitHub repository](https://github.com/livekit/sip) for detailed setup instructions.**
*   **[Try the Live Demo](https://demo.plugnmeet.com/landing.html) to experience Plug-N-Meet's features.**
