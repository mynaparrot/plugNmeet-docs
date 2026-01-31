---
title: "Scaling Your Video Service: How Plug-N-Meet's Architecture Saves You Money"
slug: scaling-architecture-saves-money
authors: [simon]
tags: [scaling, architecture, tco, cost-saving, self-hosting, business, developer]
---

Your video service is a hit. User numbers are climbing, and engagement is high. But as you celebrate your success, a new problem emerges: your server bill is exploding. To keep up with demand, you keep buying bigger and bigger servers, paying a premium for resources that sit idle most of the day.

What went wrong? You've fallen into the monolith trap.

This post explains how Plug-N-Meet's modern, decoupled architecture is designed to prevent this exact problem, enabling you to scale your service efficiently and control your costs. For a business, this isn't just a technical detail—it's a core financial advantage.

<!--truncate-->

---

### The Monolith Trap: Paying for Empty Seats

Many traditional video conferencing platforms are built as **monoliths**. This means the core application, the media processing, and the recording services are all bundled into a single, massive application.

This creates a huge problem when it's time to scale:

*   **If you need to support more concurrent users**, you have to upgrade the *entire* server, even if your recording service is barely being used.
*   **If a few large recording jobs are using all the CPU**, your live meetings will lag and stutter, forcing you to buy a bigger server just to handle a temporary workload.

A monolithic server is like renting a giant bus for a single passenger. You pay for all the empty seats, and if one part of the bus breaks down, the whole trip is canceled.

---

### The Plug-N-Meet Way: A Decoupled, Intelligent Architecture

Plug-N-Meet was designed from the ground up to avoid this trap. It is not one giant application; it is a set of specialized, independent services that work together.

The three core components are:
1.  **`plugnmeet-server` (The Brain):** A lightweight Go application that handles all the API calls, authentication, and business logic.
2.  **`LiveKit` (The Media Highway):** A high-performance, open-source media server that manages all the real-time audio and video traffic.
3.  **`plugnmeet-recorder` (The Factory):** A dedicated Go application that handles CPU-intensive tasks like MP4 recording and RTMP broadcasting.

These components are designed to be scaled **independently**. This is the key to cost-effective growth.

---

### Benefit 1: Scale Only What You Need (Elastic Scaling)

With a decoupled architecture, you can scale each component based on your actual needs.

*   **Expecting a huge webinar?** You don't need to touch your main application server. Simply spin up a few extra `LiveKit` media servers for the duration of the event, then spin them down afterward.
*   **Seeing more users in a specific region?** Deploy media servers in that geographic area to reduce latency, without having to replicate your entire backend.

This is like adding more cashiers to a store only during the holiday rush. You get the performance you need when you need it, and you don't pay for idle resources during quiet periods.

---

### Benefit 2: Isolate Your Workloads (Improved Quality of Service)

In a monolith, a resource-hungry task can degrade the entire user experience. If someone starts a large recording, everyone's live video call could suffer.

Plug-N-Meet's architecture prevents this. Because the `plugnmeet-recorder` is a separate service, you can run it on entirely different machines from your live media servers.

*   **The Result:** A CPU-intensive MP4 transcoding job will have **zero impact** on the quality and stability of your live meetings.
*   **The Benefit:** Your users always get a smooth, high-quality experience, which is critical for customer satisfaction and retention.

---

## Conclusion: A Lower Total Cost of Ownership (TCO)

"Scalable" isn't just a technical buzzword; it's a business feature. The ability to scale components independently and isolate workloads means you are not constantly over-provisioning your hardware. You pay only for the resources you actually use.

As your platform grows, this intelligent design leads to a dramatically **lower Total Cost of Ownership (TCO)** compared to a monolithic solution. You can grow your user base sustainably without your infrastructure costs spiraling out of control.

Plug-N-Meet's architecture isn't just a technical implementation detail; it's a strategic advantage designed to help your business succeed at scale.

---
**Ready to learn more about scaling?**

*   **Read our detailed [Scalable Deployment Guide](/docs/developer-guide/scalable-setup)**
*   **Dive deep into our [Backend Architecture](/blog/backend-architecture-deep-dive)**
*   **Get started with the [Installation Guide](/docs/installation)**
