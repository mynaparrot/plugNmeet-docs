---
title: How to Migrate from BigBlueButton (BBB) to plugNmeet
description: A guide for developers and administrators on migrating from a BigBlueButton server to plugNmeet for a more modern, scalable, and customizable solution.
keywords: [migrate from bbb, bigbluebutton alternative, bbb migration, bbb replacement, plugnmeet vs bbb, tutorial]
sidebar_position: 2
sidebar_label: Migrating from BigBlueButton
---

# Migrating from BigBlueButton: A Modern Alternative

Are you looking for a more modern, lightweight, and scalable alternative to BigBlueButton? Plug-N-Meet offers a next-generation architecture with a focus on performance and simplicity, and we have made the migration process incredibly straightforward.

This guide will walk you through the benefits of switching and show you how to migrate your existing BBB-integrated application in just a few minutes, without changing any of your front-end code.

---

## Why Consider Plug-N-Meet?

BigBlueButton is a foundational open-source project that has served the community for years. Plug-N-Meet was born from a deep respect for the BBB ecosystem and was designed to address some of its inherent architectural challenges, offering a different approach for those who need more flexibility and scalability.

Here are the key advantages of the Plug-N-Meet architecture:

-   **Built on a World-Class Foundation:** Plug-N-Meet is powered by **LiveKit** as its media server and **NATS** for real-time messaging (chat, whiteboard sync, etc.). These are extremely fast, scalable, and modern components that allow Plug-N-Meet to handle a massive user load with fewer server resources.
-   **Simplified & Lightweight Stack:** By leveraging these components, Plug-N-Meet avoids the complex web of dependencies found in BigBlueButton (like FreeSWITCH and Kurento). This results in a significantly smaller footprint, easier installation, and simpler maintenance.
-   **Simplified, Single-File Recordings:** Unlike BigBlueButton's complex post-processing workflow, plugNmeet generates a standard MP4 file for each recording. This makes your recordings instantly portable, easier to manage, and faster to access.
-   **Designed for Distributed Scaling:** Plug-N-Meet is not built as a single, large application. Each core component—LiveKit (media), NATS (messaging), the recorder, and the plugNmeet server—is designed to be scaled out independently. This allows you to add resources precisely where you need them, for example, scaling your recording infrastructure without impacting live meeting performance.
-   **Effortless Customization:** The platform is designed for deep and easy customization. The frontend client is a modern, self-contained application, and the backend is a single binary. This clean separation allows developers to rapidly change the UI, add features, or integrate custom workflows without navigating the complex, multi-service environment found in BigBlueButton.
-   **Seamless API Compatibility:** This is our commitment to the ecosystem. Plug-N-Meet includes a BBB-compatible API layer. This means your existing application—whether it's Greenlight, a Moodle plugin, or a custom-built solution—will work with Plug-N-Meet without requiring any front-end code changes.

---

## The 2-Minute Migration Process

Because of our BBB-compatible API, migrating your existing application is as simple as changing the API endpoint and credentials in your configuration.

In your application's settings, locate your BigBlueButton API configuration and update the following two values:

1.  **API Endpoint URL:** Change the URL to point to your PlugNmeet server, followed by `/bigbluebutton/`.
2.  **API Secret:** Change the secret to match your PlugNmeet API Secret.

That's it. Your `API Key` from PlugNmeet will be passed as the `user` in the URL.

### Example Configuration

```
URL: https://[YOUR_PLUGNMEET_HOST]/[YOUR_PLUGNMEET_API_KEY]/bigbluebutton/
Secret: [YOUR_PLUGNMEET_API_SECRET]
```

For example, using the public demo server, the configuration would be:

```
URL: https://demo.plugnmeet.com/plugnmeet/bigbluebutton/
Secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

---

## After Migration: Unlocking the Full Feature Set

To provide this seamless migration, Plug-N-Meet uses a powerful, BBB-compatible API layer. This ensures that all of BigBlueButton's core features that your existing application relies on will work out-of-the-box.

However, this compatibility layer is designed as a bridge. To experience the full power of Plug-N-Meet—including our most advanced features, superior performance, and effortless customization options—we **strongly recommend switching to our dedicated plugins or SDKs** when you are ready.

Using the native integrations will provide the most stable, feature-rich, and future-proof experience for your users.

-   **[WordPress Plugin](/docs/user-guide/wordPress-integration.md)**
-   **[Moodle Plugin](/docs/user-guide/moodle-integration.md)**
-   **[Joomla Plugin](/docs/user-guide/joomla-integration.md)**
-   **[PHP & JavaScript SDKs](/docs/tutorials/quick_php.md)** for custom applications.
