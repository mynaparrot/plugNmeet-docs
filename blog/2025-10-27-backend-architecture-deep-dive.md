---
title: "Why We Chose LiveKit and NATS: A Deep Dive into Our Backend Architecture"
slug: backend-architecture-deep-dive
authors: [jibon]
tags: [webrtc, architecture, backend, livekit, nats, open-source, scalability]
---

Every great application is built on a foundation of smart architectural choices. For a real-time video conferencing platform, these choices are the difference between a smooth, reliable experience and a frustrating mess of lag, dropped calls, and connection errors.

When we designed plugNmeet, we had a clear set of goals: the platform needed to be high-performance, horizontally scalable, resilient, and easy for developers to build upon. This led us to make two fundamental decisions for our backend: we chose **LiveKit** for our media server and **NATS** for our real-time messaging layer.

This article is a deep dive into the "why" behind these critical choices.

<!--truncate-->

---

## The Two Pillars of Real-Time Communication

At its core, any serious video conferencing platform has to solve two distinct problems. But for a project like plugNmeet, it's not enough to just make them work. The solution must also be:

*   **Easy to Scale:** Able to grow from handling a few dozen users to many thousands without a complete re-architecture.
*   **Highly Available:** Resilient to failure, ensuring that the loss of a single component doesn't bring the entire system down.
*   **Resource-Efficient & Cost-Effective:** Designed to run on reasonable hardware, keeping operational costs low for everyone.
*   **Easy to Manage:** Simple to deploy and maintain, even for small teams or individual developers.

Our architectural philosophy was to choose a best-in-class open-source tool for each of the two main challenges—**Media Routing** and **Signaling**—that met all of these demanding criteria.

1.  **Media Routing:** How do you efficiently get audio and video streams from each participant to every other participant?
2.  **Signaling & State Management:** How do you instantly deliver all the other real-time information that makes a meeting dynamic and interactive?

## Pillar 1: LiveKit - The High-Performance Media Engine

In the early days of WebRTC, many apps used a peer-to-peer (P2P) mesh. This works for a 1-on-1 call, but it fails catastrophically as you add more people. Each participant has to upload their video stream separately to every other person, quickly overwhelming their internet connection.

The modern solution is a **Selective Forwarding Unit (SFU)**. An SFU is a server that acts as a traffic cop. Each participant sends their video stream to the SFU just *once*, and the SFU then forwards that stream to all other participants.

For our SFU, we chose **LiveKit**, and here’s why:

*   **High Performance & Efficiency:** LiveKit is written in Go, making it incredibly fast and resource-efficient. It can handle a large number of concurrent users and streams on a single server, which aligns with our goal of providing a cost-effective solution.
*   **Built-in Scalability:** LiveKit is designed to be clustered, and it uses Redis to manage state across multiple nodes. This provides a clear, documented path to the massive scale required by our largest users.
*   **Modern Features by Default:** LiveKit comes with critical, out-of-the-box support for modern WebRTC features like **Simulcast** (sending multiple quality streams) and **Dynacast** (intelligently pausing streams). This allows plugNmeet to automatically adapt to each user's network conditions, dramatically improving reliability.
*   **Secure and Open Source:** As an open-source project itself, LiveKit aligns with our core philosophy of transparency. It also has built-in support for passing through End-to-End Encrypted (E2EE) media, which is essential for our security model.

In short, by building on top of LiveKit, we didn't have to reinvent the wheel. We inherited a powerful, battle-tested media engine, allowing us to focus on building the application logic and features that make plugNmeet unique.

## Pillar 2: NATS JetStream - The Resilient Nervous System

While LiveKit handles the heavy media streams, we needed a separate, highly reliable system for all the other real-time data that makes a meeting interactive. This is where **NATS** comes in.

More specifically, we leverage **NATS JetStream**, the powerful persistence layer built into the NATS ecosystem. JetStream elevates NATS from a simple messaging system to a true streaming platform, which is critical for the reliability and scalability of our backend services.

Here’s why JetStream was the perfect choice for plugNmeet:

*   **Multi-Layered Security:** NATS provides a robust, defense-in-depth security model at the messaging layer, which operates in addition to our application-level E2EE.
    *   **Encryption in Transit:** All connections from clients to the NATS cluster are secured using **TLS**. This encrypts all signaling data while it's on the wire, protecting it from eavesdropping.
    *   **Fine-Grained Authorization:** This is where the real power lies. When a user authenticates, the `plugnmeet-server` dynamically generates a unique set of permissions for that specific user session. These permissions strictly define which NATS subjects the user is allowed to publish to and subscribe from, typically scoped by `roomId` and `userId`. This enforces a true **principle of least privilege**, making it architecturally impossible for a user in one room to access data from another.

*   **Scalable Request Processing with Queue Workers:** For critical client-server interactions, like fetching the initial user list, we leverage JetStream's powerful **queue worker pattern**. When a client sends a request, it's published to a stream. Our backend `plugnmeet-server` instances subscribe to this stream as a **queue group**, and NATS ensures that each request is delivered to only **one** available server. This provides automatic, built-in load balancing for our core application logic.

*   **High-Performance Streaming for Real-Time Data:** For other real-time data like **chat messages** or **collaborative whiteboard** drawing data, we use JetStream's high-performance streaming capabilities to ensure fast and reliable delivery to all participants in a room.

*   **Built for Resilience:** NATS is designed from the ground up for clustering and self-healing. If one NATS node fails, clients will automatically reconnect to another, ensuring the "nervous system" of your meetings stays online.

By using NATS for its deep security model, performance, and resilience, we built a backend that is fast, secure, and remarkably easy to scale.

---

## Conclusion: A Foundation Built for the Future

The choice of LiveKit and NATS JetStream was deliberate. By combining a best-in-class media server with a best-in-class streaming platform, we've created a platform that is:

*   **Performant:** Handling both media and signaling with specialized, high-speed tools.
*   **Scalable:** With clear, documented paths for clustering each component.
*   **Resilient:** With built-in failover and self-healing capabilities.
*   **Flexible:** Allowing us to build powerful, decoupled features like our auto-scaling recorders.

But there's one more crucial element that ties this all together: **the underlying technology**. Both LiveKit and NATS are written in **Go**, one of the most powerful languages for modern, concurrent network services. This was no accident. We deliberately chose to write the core `plugnmeet-server` in Go as well.

This creates a **unified, high-performance ecosystem**. Our developers can move seamlessly between components, leading to faster development cycles, easier maintenance, and a more cohesive and stable platform for our users. It means that when you build with plugNmeet, you're building on a consistent and coherent technology stack from top to bottom.

The ultimate benefit of this Go-based approach is in the final deployment. The entire `plugnmeet-server` compiles down to a **single, dependency-free binary file**. This makes deployment incredibly simple and portable. You can run it as a standalone service on a bare-metal server or package it into a minimal, highly secure Docker container. There are no language runtimes to manage and no complex dependencies to install—just a single file that works.

When you choose plugNmeet, you're not just getting an application. You're getting a thoughtfully designed architecture built on a foundation you can trust.

---
**Want to learn more?**

*   **Read our [Scalable Deployment Guide](/docs/developer-guide/scalable-setup)**
*   **Explore the [Open-Source Project on GitHub](https://github.com/mynaparrot/plugNmeet-server)**
