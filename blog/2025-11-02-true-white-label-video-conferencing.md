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

## Level 2: Deep Styling (The Custom CSS URL)

This is where we start to move beyond simple rebranding. We understand that your brand is more than just a color palette; it's about typography, spacing, and a unique design language.

plugNmeet allows you to provide a URL to your own **custom CSS file**. This file is loaded after all of our default styles, giving you the power to override and restyle **any element** in the user interface.

*   Want to use your brand's custom font? You can.
*   Need to change the shape and size of the buttons to match your app's design system? You can.
*   Want to hide specific UI elements that aren't relevant to your users (like the recording button)? You can do it with a simple `display: none;`.

This gives you granular, pixel-perfect control over the entire visual presentation, ensuring the plugNmeet client feels less like a third-party tool and more like a component that was designed specifically for your application.

## Level 3: True Native Integration (The `getClientFiles` API)

This is the ultimate level of customization and our most powerful feature for developers. This is what separates a "re-skinned app" from a "truly integrated feature."

Most web-based video tools force you to embed their client in an `<iframe>`. This is a restrictive, sandboxed approach that limits your control. The `<iframe>` is a black box.

We do the opposite. Our `getClientFiles` API gives you a list of all the raw JavaScript and CSS files that make up our client application. This allows you to **inject these files directly into your own application's HTML**.

**Why is this a game-changer?**
*   **No More `<iframe>`:** The plugNmeet client runs as a native part of your own page. This means your own CSS, your own JavaScript, and your own HTML can directly interact with the video client.
*   **Build Your Own Layout:** You can place the video window in one `<div>`, the chat in another, and the participant list in a sidebar that is part of *your* application's layout, not ours. You have complete structural control.
*   **Deeper Integration:** Your application can listen for events from the plugNmeet client and react to them, or even programmatically control the client's behavior.

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
