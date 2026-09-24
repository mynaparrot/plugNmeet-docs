---
title: plugNmeet – Self-Hosted Open-Source Video Conferencing Platform
description: plugNmeet is the open-source, self-hosted video conferencing platform for your website or app. Learn what it is, who it's for, how it works, and how to start.
keywords: [open source, webrtc, video conferencing, self-hosted, on-premise, video chat, webinar, virtual classroom, zoom alternative, video api, ai]
sidebar_position: 1
sidebar_label: Intro
---

# plugNmeet: Self-Hosted Open-Source Video Conferencing for Your Website

Welcome to plugNmeet, the video conferencing platform designed for ultimate control, flexibility, and **cost-effective scale**. Host secure, high-quality, and **AI-powered** meetings directly from your website, with your own branding, and complete ownership of the user experience.

What truly sets plugNmeet apart is its **unmatched customization**. The interface is fully controllable, allowing you to tailor the entire experience — from simple branding with your own logo and colors, to enabling specific features to create anything from a minimalist video chat, to a full-featured **virtual classroom**, or even a massive live event with **hundreds of participants**.

:::tip In 30 seconds
- **What:** Complete meeting room — audio/video, screen share, whiteboard, chat, polls, breakout rooms, recording, live streaming, and AI summaries/translations.
- **How you own it:** Install the free server on your own server, or skip ops with [plugNmeet Cloud](https://www.plugnmeet.cloud). In both cases the meeting runs under your brand.
- **How you use it:** No-code plugins for WordPress, Moodle, Joomla, and any LMS via LTI — or plugNmeet API + SDKs for custom apps.
- **Why teams pick it:** Privacy by design with optional end-to-end encryption, true white-label via config (no code forks), and a lightweight, scalable stack.
:::

## Which one are you? Pick your path

| If you are… | You get… | Start here |
|---|---|---|
| **A creator, educator, or business owner** — you want video on your site without coding | Install a plugin, enter server URL + key, add meetings from your dashboard | [User Guide Overview](/docs/user-guide/overview) |
| **An admin or self-hoster** — you care about privacy, cost, and control | A single-binary Go server + automated install script, you own data and recordings | [Installation Quick Start](/docs/installation) |
| **A developer** — you want to embed, automate, or ship mobile apps | PlugNmeet API, PHP/JS SDKs, webhooks, custom mobile apps, and full UI theming without an iframe trap | [Developer Guide](/docs/developer-guide/intro) · [API Intro](/docs/api/intro) |

You can mix paths: many teams self-host once, then let teachers use the Moodle plugin while developers automate rooms via API.

## What can you build with it?

Same engine, very different products — you just enable what you need:

- **Virtual classroom & coaching:** Whiteboard + shared notepad + polls + breakout rooms + attendance via [analytics](/docs/others/analytics). Works from Moodle, WordPress, or any LMS via [LTI](/docs/user-guide/lti).
- **Webinar & live event:** Waiting room, moderator controls, [RTMP live streaming](/blog/custom-qna-webinar-rtmp-broadcast-api) to YouTube/Facebook, [studio input from OBS](/blog/obs-rtmp-whip-ingress) via RTMP/WHIP, shared video playback for everyone.
- **Telehealth & private consulting:** Browser-only join, lockable room, per-user permissions, and optional [end-to-end encryption](/docs/security-overview) where even the server cannot read media or chat.
- **Community or marketplace calls:** Minimal video chat embedded in your product with your logo, colors, and domain. No plugNmeet branding.
- **Internal meetings & ERP integration:** API-created rooms, SSO via your existing users, recordings stored as plain MP4 on your storage.
- **Custom mobile & desktop apps:** Ship your own branded iOS, Android, Flutter, React Native, or desktop app with the [hybrid integration](/docs/developer-guide/mobile-app-integration) — native media performance plus the full plugNmeet web UI in a WebView, no mobile SDK lock-in.

If you are coming from BigBlueButton, see [Migrating from BigBlueButton](/docs/tutorials/migration-from-bbb) — plugNmeet speaks the BBB API, so existing apps keep working.

## Key capabilities at a glance

You do not need to learn all of this on day one. This is the full toolbox your room can offer:

### Meet without friction
- **HD audio/video with virtual backgrounds**, join from any modern browser, no install. See [Attendee Guide](/docs/user-guide/attendee).
- **Stable on weak networks:** Adaptive quality automatically lowers thumbnails and pauses off-screen videos to prevent lag.
- **HD screen sharing**, public + private chat with file sharing.

### Collaborate live
- **Interactive whiteboard:** Draw together, upload PDFs/Office files and annotate them.
- **Shared notepad** for live meeting notes.
- **Embed any web content** (Google Doc, dashboard) or play a YouTube/file video in sync for all.

### Engage and moderate
- **Breakout rooms** for small-group work, **polls with quiz mode**, raise hand, waiting room.
- **Granular permissions:** Lock mic, camera, chat, whiteboard per participant. See [Moderator Guide](/docs/user-guide/moderator).

### Record and broadcast
- **Cloud recording to MP4** on your server + browser-based local recording.
- **Live stream to YouTube/Facebook** via RTMP, bring in studio feeds from [OBS via RTMP/WHIP](/blog/obs-rtmp-whip-ingress).
- **Telephone dial-in (SIP)** for audio-only join without internet.

### Turn meetings into knowledge with AI
- Live captions, spoken translation, transcriptions, summaries, and chat assistant — powered by your own AI provider (OpenAI-compatible).
- You control when AI runs and where data goes. E2EE rooms automatically disable server-side AI that would need to hear audio. Details in [Security Overview](/docs/security-overview).

### Security and control
- Self-hosted data, HMAC-signed API + JWT sessions, TLS everywhere, optional **end-to-end encryption (E2EE)** for media and chat.
- Per-room analytics metadata (counts, not content) and full audit via API. Start with [Security & Privacy](/docs/security-overview).

## How it works: 3 pieces

Forget complex diagrams. There are only three pieces:

1. **plugNmeet server — the engine.** Runs your conferences, manages rooms, users, recordings, and AI hooks. You either self-host it or use Cloud.
2. **Meeting interface — the room.** The modern web client your users see. Fully white-labeled via config: logo, colors, features on/off — no code fork needed.
3. **Connection — the bridge.** Links your website to the server:
   - **No-code:** WordPress / Joomla / Moodle plugin, or any LMS via LTI and BBB-compatibility.
   - **Pro-code:** PlugNmeet API + SDKs create rooms and mint join tokens from your backend. For iOS, Android, Flutter, React Native, or desktop, use the [hybrid mobile integration](/docs/developer-guide/mobile-app-integration) with LiveKit native SDKs + WebView UI.

```
Users (browser, 1 click, no install)
  |
Your site/app (WordPress, Moodle, Joomla, or custom code)
  |  creates room + join token via API
plugNmeet server (your own server or Cloud)
  |  hosts encrypted media + chat + recordings
Meeting room (your brand, your domain)
```

Your backend never exposes the secret: it signs the API request, gets a short-lived token for that user, and redirects them to the room.

## Under the hood (for technical readers)

If you evaluate architecture, this is what matters:

- **Single Go binary** for the app logic — no runtime juggling, easy to deploy and scale horizontally.
- **LiveKit (SFU)** for media routing with simulcast/dynacast — one upload per sender, server forwards efficiently.
- **NATS JetStream** for signaling, chat, and collaboration state — with per-user, per-room least-privilege permissions and TLS.
- **Separate recorder** that outputs portable MP4. Run it on another machine so transcoding never slows live meetings.
- **Redis/NATS-KV (ephemeral) + MariaDB (history)** — live state disappears when the session ends; only what you opt to keep (recordings, analytics JSON, AI artifacts) is persisted.
- **API-first + BBB-compatible:** `POST /auth/*` with `API-KEY` + `HMAC-SHA256`, SDKs for [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php) and [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js), [webhooks](/docs/others/webhooks) and [hooks](/docs/others/hooks) for workflows, `/bigbluebutton/` compatibility for drop-in migration, and [hybrid mobile apps](/docs/developer-guide/mobile-app-integration) via LiveKit native SDKs + WebView (no proprietary mobile SDK required).

Deeper reads: [Benchmarks: how many users can a room hold](/docs/benchmark), [Backend Architecture Deep Dive](https://www.plugnmeet.org/blog/backend-architecture-deep-dive), [Scalable Deployment](/docs/developer-guide/scalable-setup), [Why we built plugNmeet](https://www.plugnmeet.org/blog/why-we-built-plugnmeet).

## Why teams choose plugNmeet over SaaS or heavy stacks

- **Own your data and brand:** Your domain, your logo, your storage. No user lock-in, no per-user SaaS tax for basic meetings.
- **White-label without forking:** Change look and features via API/config and custom CSS. Updates do not break your theme.
- **Lightweight to run:** One binary + LiveKit + NATS replaces sprawling multi-language stacks. A small server handles testing; vertical scaling + isolated recorder covers hundreds of concurrent users before you ever need a cluster. See measured numbers in [Benchmarks](/docs/benchmark).
- **Portable recordings:** Plain MP4 files you can download, merge, or move — no proprietary post-processing maze.
- **Built for builders:** From one-click CMS plugins to headless `getClientFiles` embedding, [custom mobile apps](/docs/developer-guide/mobile-app-integration), and full automation, you are not forced into someone else's UX.

## Get started in 15 minutes

### Step 1: Get a server

**Option A — Self-host (free, full control)**

You need a clean Ubuntu/Debian server with public IP, 2 subdomains, and an email for SSL. Then:

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh
sudo bash install.sh
```

Save the Server URL, API Key, and Secret at the end. Full checklist in [Installation Quick Start](/docs/installation).

**Option B — Cloud (managed, fastest)**

No server work. Create an account on **[plugNmeet Cloud](https://www.plugnmeet.cloud)**, get credentials, and start with the [free plan](https://www.plugnmeet.cloud/pricing). Same privacy model, plus geo-routing for global audiences.

### Step 2: Connect it to your site

- **WordPress / Joomla / Moodle?** Install the official plugin, paste server details, create your first room. See [WordPress](/docs/user-guide/wordPress-integration), [Joomla](/docs/user-guide/joomla-integration), [Moodle](/docs/user-guide/moodle-integration), [LTI](/docs/user-guide/lti).
- **Custom app?** Follow [PHP Quick Start](/docs/tutorials/quick_php) or read [API Intro](/docs/api/intro): create room → generate token → redirect user. No frontend SDK required to start.

## Try it right now — live demo

Explore the UI and test the API without installing anything:

**Room demo:** [https://demo.plugnmeet.com/landing.html](https://demo.plugnmeet.com/landing.html)

**Demo API for developers:**
```
plugNmeet server URL: https://demo.plugnmeet.com
plugNmeet API KEY: plugnmeet
plugNmeet API SECRET: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

## Next steps

- **Just want to use it?** → [User Guide Overview](/docs/user-guide/overview) → [Moderator Guide](/docs/user-guide/moderator)
- **Want to host it?** → [Installation](/docs/installation) → [Security Overview](/docs/security-overview)
- **Want to build on it?** → [Developer Guide](/docs/developer-guide/intro) → [API Intro](/docs/api/intro) → [PHP Quick Start](/docs/tutorials/quick_php)
- **Need scale or migration?** → [Scalable Deployment](/docs/developer-guide/scalable-setup) → [Migrating from BBB](/docs/tutorials/migration-from-bbb)
- **Like the project?** Star us on [GitHub](https://github.com/mynaparrot/plugNmeet-server) and join [Discord](https://discord.gg/2X2ZaCHu4C).
