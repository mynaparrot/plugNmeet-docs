---
title: "Meet Users Where They Are: Why We Build Plugins, Not Another Standalone App"
slug: plugin-first-philosophy
authors: [simon]
tags: [plugin, lms, cms, moodle, wordpress, integration, architecture, video-conferencing]
---

If you manage a Learning Management System (LMS) like Moodle or a Content Management System (CMS) like WordPress, you've likely faced this frustrating scenario: you have a vibrant community, a rich content library, and a well-defined user base, but the moment you need to host a live class or a webinar, you have to send everyone away to a third-party, standalone application.

You generate a Zoom link, post it on your site, and hope your users can find it, log in correctly, and navigate back when it's over. This experience is clunky, disjointed, and it breaks the seamless learning environment you've worked so hard to build.

At plugNmeet, we believe this is a fundamentally flawed workflow. That's why we made a deliberate architectural choice: to be a **plugin-first platform**, not just another standalone app.

<!--truncate-->

---

## The Friction of the Standalone App

Standalone video conferencing tools are powerful, but when used alongside an existing platform, they create unnecessary friction:

1.  **The Jarring Context Switch:** Sending users to an external domain is a disruptive experience. You lose control over the branding, the user journey, and you pull your users out of the very ecosystem you want them to engage with.

2.  **The User Management Nightmare:** Your LMS or CMS already has a robust user database with roles and permissions. A standalone video app forces you to manage a second, parallel set of users, or to build and maintain a complex single sign-on (SSO) integration.

3.  **The Siloed Data:** When a meeting is over, where does the recording go? Where are the chat logs? With a standalone app, this valuable data is trapped on a third-party cloud, completely disconnected from the course, article, or user group it belongs to.

## Our Philosophy: A Deeply Integrated Communication Layer

We believe that for platforms like Moodle, WordPress, or Joomla, video conferencing shouldn't be a separate destination. It should be a **native feature**, a deeply integrated communication layer.

By focusing on plugins, we allow you to:

*   **Leverage Your Existing Infrastructure:** Our plugins use your existing user database. A teacher in Moodle is a teacher in plugNmeet. A student is a student. There are no new accounts to create and no complex authentication to manage. It just works.

*   **Create a Seamless User Experience:** Users never have to leave your domain. They join a live class directly from the course page. They participate in a webinar without ever seeing a third-party logo. The entire experience feels like a natural extension of your own platform.

*   **Keep Data Contextual and Connected:** When a meeting is recorded, the recording automatically appears on the relevant course page in Moodle. The data belongs to the context in which it was created, making it easy for users to find and for you to manage.

### A Real-World Example: The Moodle Workflow

Imagine a teacher setting up a live class. With the plugNmeet plugin:

1.  She is already logged into her Moodle course.
2.  She clicks "Add an activity or resource" and selects "plugNmeet."
3.  She sets the time and a few parameters, and the meeting is created.

For the student, the process is even simpler. They log into their course, see the link for the live session, and click it. They are instantly and securely joined to the meeting. There are no new tabs, no external apps to launch, and no confusion.

This is the power of a plugin-first approach.

---

## Our Commitment to the Ecosystem

We are not trying to build a separate island for your users to visit. We are building the bridges that bring powerful, self-hosted video communication directly into the platforms you already use and trust.

Our Moodle plugin is just the beginning. Our vision is for plugNmeet to be the native, self-hosted video layer for every major LMS and CMS. We are actively working to expand our ecosystem of plugins and welcome community contributions to bring plugNmeet to even more platforms.

plugNmeet isn't a destination; it's a feature. It's the communication layer your platform has been missing.

---
**Ready to integrate powerful video into your platform?**

*   **Check out our [Moodle Plugin](/docs/user-guide/moodle-integration)**
*   **Explore our Open-Source Project on [GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **Read our [API Documentation](/docs/api/intro) to build your own integration**
