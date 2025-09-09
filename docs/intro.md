---
description: An introduction to Plug-N-Meet, the open-source video conferencing platform designed for control, flexibility, and cost-effective scale.
sidebar_position: 1
sidebar_label: Intro
---

# Plug-N-Meet: Your Open-Source WebRTC Conferencing Solution

Welcome to Plug-N-Meet, the video conferencing platform designed for ultimate control, flexibility, and **cost-effective scale**. Host secure, high-quality video meetings directly from your website, with your own branding and complete ownership of the user experience.

What truly sets Plug-N-Meet apart is its **unmatched customization**. The interface is fully controllable, allowing you to tailor the entire experience—from simple branding with your own logo and colors, to enabling specific features to create anything from a minimalist video chat, to a full-featured **virtual classroom**, or even a massive live event with **hundreds of participants**.

---

## Key Features

### Core Conferencing & Collaboration
- High-Quality Audio & Smooth HD Video Calls (up to 60 fps, with Virtual Backgrounds)
- Browser-Based Web Conferencing: No downloads or installation required. Join meetings instantly from your web browser. We recommend Google Chrome, Firefox, or Safari for the best experience.
- Smooth HD Screen Sharing (up to 60 fps)
- Interactive Whiteboard & Collaborative Notepad
- Public and Private Chat

### Engagement & Moderation Tools
- Breakout Rooms for focused discussions
- Polling, Raise Hand feature, and Waiting Room
- Advanced User Lock Settings to manage participants

### Recording & Live Broadcasting
- Local MP4/WebM Recording of your meetings
- Live Stream your conference via RTMP to YouTube, etc.
- Co-play video files directly in a meeting

### Advanced Integration & Security
- **End-to-End Encryption (E2EE):** Secures all media (audio/video), chat, and whiteboard content for maximum privacy. Supported on the latest versions of modern browsers like Chrome, Firefox, and Safari.
- Live Speech-to-Text and Translation
- Integrate external content via iframes
- Detailed Analytics Reports

---

## How It Works

Now that you've seen what's possible, here’s the simple concept behind Plug-N-Meet. The platform has two components:

1.  **The Server:** The powerful engine that runs your video conferences.
2.  **The Integration:** The client that connects the server to your website (like a plugin or custom code).

Your first step is to choose how to set up your server.

## Step 1: Choose Your Server

### Option A: Self-Host (The Open-Source Way)
For maximum control, privacy, and customization, you can install the open-source Plug-N-Meet server in your own environment. As open-source software, it is **completely free to download, use, and modify**. This is the most powerful option, giving you complete ownership of your data and the ability to create a fully branded and customized user experience.

### Option B: plugNmeet Cloud (The Managed Way)
If you want to avoid server setup and maintenance, our official **[plugNmeet Cloud](https://www.plugnmeet.cloud)** service provides a ready-to-use, managed server for you. Our cloud solution is built with the same commitment to privacy as our open-source version, following strict security best practices to keep your data safe and your conversations private.

For large-scale or global deployments, the cloud version also solves the complex challenge of network latency with our **Intelligent Geo-Distribution** feature. It automatically routes participants to the nearest server, which drastically reduces lag and ensures high quality for international meetings.

You can start with a [free plan](https://www.plugnmeet.cloud/pricing) and upgrade as you grow. This is the easiest way to get started.

---

## Step 2: Integrate With Your Website

Once you have your server's API credentials (from either your self-hosted setup or your Cloud account), you can connect it to your website.

#### For WordPress, Joomla, & Moodle Sites
If you use a popular CMS, our official plugins are the easiest way to integrate. Simply install the plugin and provide your server details.
- [Wordpress Plugin](/docs/user-guide/wordPress-integration.md)
- [Joomla component](/docs/user-guide/joomla-integration.md)
- [Moodle Plugin](/docs/user-guide/moodle-integration.md)
- [LTI for educational platforms](/docs/user-guide/lti.md)

#### For Custom Applications
For developers building custom applications, our SDKs provide everything you need.
- [PHP SDK](https://github.com/mynaparrot/plugNmeet-sdk-php)
- [JavaScript SDK](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))

---

## Live Demo

Explore Plug-N-Meet's features and test its API with our live demo.

**Explore the features:** [https://demo.plugnmeet.com/landing.html](https://demo.plugnmeet.com/landing.html)

**Demo API Credentials for Developers:**
```
plugNmeet server URL: https://demo.plugnmeet.com
plugNmeet API KEY: plugnmeet
plugNmeet API SECRET: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```
