---
title: "Your Session, Your Browser: How We Use Client-Side Storage for Privacy and Resilience"
slug: client-side-storage-privacy-resilience
authors: [simon]
tags: [privacy, security, architecture, indexeddb, data-minimization, ux]
---

We’ve all felt that moment of panic. You’re in an important online meeting, the chat is full of crucial links, and then you accidentally hit refresh. Everything is gone. To solve this, many applications store your entire session on their backend servers. This allows them to restore your session, but it comes at a huge cost: your sensitive data is now stored permanently on someone else's hard drive.

At plugNmeet, we believe this is the wrong trade-off. We've made a deliberate architectural choice to use **your browser's own storage** to provide a resilient experience without compromising your privacy.

Our philosophy is simple: **if we don't need the data on our server to make the service work, we don't touch it.**

<!--truncate-->

---

## The Problem: Server Databases are Data "Honeypots"

Most applications link your in-meeting activity to an account. They save your chat history, your whiteboard drawings, and your preferences in a large backend database.

While this can be convenient, it creates a massive "honeypot" of user data. This central database becomes a prime target for data breaches. If the server is ever compromised, all of that user information is at risk.

We believe this is an unnecessary risk for the kind of temporary data generated during a meeting.

## The plugNmeet Solution: Your Browser is Your Temporary Database

To give you a smooth experience without compromising your privacy, we use your browser's built-in storage (IndexedDB) for temporary session information.

This means that when you're in a meeting, data like this is stored **only on your own computer**:

*   **Your chat history** for the current session.
*   The state of the **collaborative whiteboard**.
*   Your chosen **subtitle language**, etc.

Our backend server has no knowledge of this information. We use this local storage for one primary reason: to make your experience resilient by restoring your session if you accidentally refresh the page.

### The Lifecycle of Your Data: Here Today, Gone Tomorrow

The data stored in your browser is designed to be temporary. Here's how we handle it in simple terms:

1.  **When you leave a meeting properly,** all the session data we stored in your browser is **immediately and permanently deleted.**

2.  **If you leave abnormally** (like closing the tab), the data remains temporarily to allow you to rejoin. However, the next time you start the application, a cleanup process automatically finds and **deletes this old data** after a few hours.

This ensures that your browser stays clean and your session data remains ephemeral.

---

## Conclusion: Privacy and Resilience by Design

Our decision to use client-side storage is a core part of our "privacy by design" philosophy.

By not collecting and storing your in-meeting activity on our servers, we can make a simple but powerful promise: **we cannot lose, misuse, or be forced to hand over data that we do not have.**

It's a simple principle that leads to a more private, more secure, and more respectful platform for everyone. Your data stays where it belongs: with you.

---
**Want to learn more about our security model?**

*   **Read our complete [Security Overview](/docs/security-overview)**
*   **Explore the [Open-Source Project on GitHub](https://github.com/mynaparrot/plugNmeet-server)**
