---
title: "Why We Built Plug-N-Meet: A Founder's Story"
slug: why-we-built-plugnmeet
authors: [jibon]
tags: [open-source, architecture, philosophy, bigbluebutton, scalability, developer]
---

For years, our company has been a well-known provider of [BigBlueButton hosting and support services](https://www.mynaparrot.com/classroom/bigbluebuttonservice). We've deployed, managed, and scaled it for countless clients, and we have a deep respect for the role it has played in the open-source education community. It paved the way.

But after years in the trenches, supporting live sessions, online classes, and events at scale, we found ourselves running into the same fundamental walls. We weren't just using the software; we were experiencing its architectural limits firsthand. The frustration wasn't just about bugs; it was about an architecture that, while powerful for its original purpose, presented challenges for the kind of elastic scalability and developer agility that modern web applications demand.

We realized we had a choice: continue building workarounds, or take everything we had learned and build the solution we knew our users needed.

We chose to build. This is the story of why Plug-N-Meet exists.

<!--truncate-->

---

### Lessons from the Trenches: The Challenges We Had to Solve

Our decision wasn't born from a dislike of BigBlueButton, but from a deep understanding of its pain points at scale. We consistently faced a set of recurring challenges:

*   **The 100-User Wall:** We saw time and again that even on powerful servers, BigBlueButton's performance would degrade significantly once a session crossed 100-150 concurrent users. It simply wasn't designed for the elastic scalability modern applications require.

*   **The Labyrinth of Complexity:** The architecture is a mix of different programming languages and technologies, each solving a different piece of the puzzle. While brilliant in its time, this makes it incredibly difficult to maintain, debug, and—most importantly—add new features to. A simple change could have cascading effects across a half-dozen different services.

*   **The Branding Straitjacket:** For our clients who wanted a true white-label experience, customization was a constant struggle. Deep branding required complex themeing and often direct code modifications, making every update a risky and time-consuming process.

*   **The Recording Puzzle:** Recordings were a major pain point. The system was complex, and generating a single, portable MP4 file was notoriously difficult. In fact, I developed one of the first open-source solutions to try and solve this very problem, but even then, it was a patch on a fundamentally complicated system.

*   **The Monolithic Burden:** The lack of modularity was the biggest roadblock. You couldn't scale one part of the system without scaling the whole thing. If recording was using all the CPU, it directly impacted live meetings. There was no separation of concerns.

### A New Philosophy: Built on Simplicity, Modularity, and Control

With Plug-N-Meet, we started with a clean slate and a few core principles born directly from our frustrations.

1.  **Radical Simplicity in Technology.**
    Instead of a dozen languages, we chose two: **Go** for the entire backend and **TypeScript (with React)** for the front-end. That's it. This decision extended to our core dependencies. We chose **LiveKit** as our media server and **NATS** for messaging, not just because they are best-in-class, but because they are also written in Go. This creates a unified, consistent, and high-performance ecosystem—a topic we explore in our **[Backend Architecture Deep Dive](/blog/backend-architecture-deep-dive)**—that is a joy for our developers to work in and easy for the community to contribute to.

2.  **Modularity by Design.**
    Plug-N-Meet is not a monolith. It's a decoupled system of components that work together. The recorder, the media server, and the application logic are all separate. This means you can scale, update, or even replace one part without breaking everything else. Our new recorder's "Operational Modes" are a perfect example of this, a direct result of our **[recording philosophy](/blog/recording-philosophy)**. This allows you to run CPU-intensive transcoding on entirely different machines from your live recording servers, a concept we explore further in our **[Scalable Deployment Guide](/docs/developer-guide/scalable-setup)**.

3.  **Effortless Customization.**
    Branding shouldn't be a development project. With Plug-N-Meet, deep customization is handled via a simple API and configuration objects. You can change colors, logos, and even the entire layout without ever touching our core code, as outlined in our **[Design Customization Guide](/docs/developer-guide/design-customisation)**, ensuring that your platform always feels like *your* platform.

4.  **Empowering Everyone Through Integration.**
    While we provide powerful tools for developers, our philosophy has always been to make Plug-N-Meet accessible to everyone. A powerful platform shouldn't require a team of engineers to use. That's why we've invested heavily in creating simple, robust plugins for the world's most popular CMS and LMS platforms.

    With our official plugins for **WordPress**, **Moodle**, and **Joomla**, anyone can add a fully-featured, branded video conferencing service to their website in minutes. These integrations aren't just an afterthought; they are a core part of our mission to empower creators. As we've detailed in our guides, you can even **[launch your own video service with WordPress](/blog/no-code-video-conferencing-service-with-wordpress)**, **[build a scalable e-learning platform with Moodle](/blog/secure-scalable-moodle-e-learning-platform)**, or **[start a no-code business with Joomla](/blog/no-code-video-conferencing-service-with-joomla)**, no coding required.

5.  **Developer-First, Not an Afterthought.**
    We are not a domain-based solution that locks you into a rigid structure. We are an API-first platform designed to be a building block. Whether you use our simple plugins for WordPress and Moodle or our **[`getClientFiles` API](/docs/api/get-client-files)** for a "headless" integration, our goal is to empower you to build the exact experience you want, not force you into ours.

6.  **Security as a Foundation, Not an Add-on.**
    In today's world, privacy is non-negotiable. We built Plug-N-Meet with a security-first mindset, offering robust **End-to-End Encryption (E2EE)** as a core feature, with multiple **[key management models](/blog/e2ee-key-models-guide)** to fit any security posture. This ensures that conversations are private and that not even the server can access the media streams. This commitment to privacy is woven through our entire architecture, as detailed in our **[Security Overview](/docs/security-overview)**.

---

### Conclusion: Building the Road for the Future

We will always be grateful for the path that BigBlueButton paved. It showed the world what was possible with open-source communication. But the web has evolved, and the demands for scalability, flexibility, and developer experience have grown exponentially.

We built Plug-N-Meet to answer that call. It is the platform we wished we had during all those years of managing complex deployments—a simpler, more powerful, and more flexible foundation for the future of real-time communication.

We are not building a tool for everyone. We are building a **platform for builders.**

---

**Ready to see the difference for yourself?**

*   **[Migrating from BigBlueButton? We've made it easy.](/docs/tutorials/migration-from-bbb)**
*   **[Explore our API Documentation](/docs/api/intro)**
*   **[Explore the Open-Source Project on GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **[Try the Live Demo to experience the modern interface.](https://demo.plugnmeet.com/landing.html)**
