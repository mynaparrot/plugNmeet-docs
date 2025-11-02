---
title: "Beyond the Logo: What True White-Label Video Conferencing Looks Like"
slug: true-white-label-video-conferencing
authors: [simon]
tags: [white-label, customization, branding, developer, api, saas]
---

The term "white-label" is used a lot in the software world. Too often, it simply means you can replace the provider's logo with your own. You're still stuck with their user interface, their workflow, and their branding on the URL. It’s like putting your own sign on a franchise restaurant—it might have your name on the door, but it's still their kitchen and their menu.

At plugNmeet, we believe true white-labeling is not about hiding our brand; it's about **empowering you to build your own.**

Our platform is designed not as a finished product to be re-skinned, but as a flexible canvas for you to create a deeply integrated, pixel-perfect communication experience that feels like a native part of your application. This article explores the three levels of customization that make this possible.

<!--truncate-->

---

## Level 1: The Quick Rebrand (The Configuration Object)

This is the baseline for any white-label solution, and we make it incredibly easy. Using a simple JavaScript configuration object, you can instantly change the most important visual elements to match your brand's identity.

Within minutes, you can customize:
*   **Colors:** Set the primary, secondary, and background colors.
*   **Logos:** Add your own logo and favicon.
*   **Backgrounds:** Use a custom background image for your meeting rooms.

This is perfect for getting a branded look and feel up and running quickly, but it's just the beginning.

## Level 2: API-Driven Feature Control

True white-labeling goes beyond just looks; it's about controlling the **functionality** of the room to match your specific use case. A simple one-to-one video call has very different needs than a full-featured virtual classroom.

Plug-N-Meet is fully controlled by our powerful server-side API. When you create a room, you are not just setting a title; you are defining the entire feature set available to the participants. This allows you to programmatically design the perfect experience, all without ever touching the client-side code.

For example, you can:
*   **Create a Minimalist Video Call:** Disable the whiteboard, shared notepad, and all other collaboration tools to create a clean, simple interface for one-to-one conversations.
*   **Design a Virtual Classroom:** Enable the whiteboard, polls, and breakout rooms, while disabling features like screen sharing for students.
*   **Host a Webinar:** Give all power to the moderator and disable chat and microphone access for attendees by default.

This API-driven approach means you can use the exact same client to power wildly different products and experiences, all controlled from your backend.

## Level 3: Deep Styling (The Custom CSS URL)

For deeper customization beyond basic colors, Plug-N-Meet allows you to provide a URL to your own custom CSS file. This gives you pixel-perfect control to override any element and match your application's unique design, from fonts and button styles to the overall layout, ensuring a completely seamless look and feel.

## Level 4: True Native Integration (The `getClientFiles` API)

This is the ultimate level of customization. Most web-based video tools force you to embed their client in an `<iframe>`, creating a restrictive black box with complex permission issues and a disconnected feel.

We do the opposite. Our `getClientFiles` API allows you to inject the client directly into your own application. The result is a video conferencing experience that feels just like another page in your app, seamlessly integrated and free from the headaches of iframe sandboxing.

This approach transforms plugNmeet from an "embedded tool" into a true **headless UI component library** for building real-time communication.

---

## Conclusion: Your Platform, Not Ours

True white-labeling isn't about putting your logo on our product. It's about giving you the building blocks to create your own.

Whether you need a quick rebrand, deep styling, or a fully integrated native experience, plugNmeet provides the tools to meet you where you are. Our goal is to give you the power to create a communication experience that is indistinguishable from the rest of your platform, because we believe the best video tool is the one your users don't even realize is there.

---
**Ready to start building your custom experience?**

*   **Read our [Design Customization Guide](/docs/developer-guide/design-customisation)**
*   **Explore the [`getClientFiles` API Documentation](/docs/api/get-client-files)**
*   **Check out the [Live Demo](https://demo.plugnmeet.com/landing.html) to see it in action**
