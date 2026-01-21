---
title: Plug-N-Meet Security and Privacy Overview | Your Self-Hosted Video Conferencing Solution
description: A detailed overview of the security architecture, authentication, authorization, and end-to-end encryption (E2EE) mechanisms within the Plug-N-Meet platform.
keywords: [security, privacy, data handling, e2ee, end-to-end encryption, authentication, authorization, hmac, jwt, nats, livekit, webrtc security]
sidebar_position: 3
sidebar_label: Security & Privacy
---

# Plug-N-Meet Security and Privacy Overview

This document provides a comprehensive overview of the security architecture and data privacy principles that govern the Plug-N-Meet platform. It details not only the technical measures we take to protect your meetings from unauthorized access, but also provides a transparent look at how your data is handled, stored, and managed throughout its entire lifecycle. The system is designed from the ground up to be secure by default and to give you, the operator, full control over your data.

## Table of Contents

1.  [API Authentication](#1-api-authentication)
2.  [User Authentication & Authorization](#2-user-authentication--authorization)
3.  [End-to-End Encryption (E2EE)](#3-end-to-end-encryption-e2ee)
    -   [Server-Generated Keys](#31-server-generated-keys)
    -   [User-Provided Keys](#32-user-provided-keys)
4.  [Transport & Data-in-Transit Security](#4-transport--data-in-transit-security)
    -   [NATS Communication](#41-nats-communication)
    -   [Media Server (LiveKit)](#42-media-server-livekit)
    -   [SIP Gateway](#43-sip-gateway)
5.  [AI Services & Data Privacy (The Insights Platform)](#5-ai-services--data-privacy-the-insights-platform)
6.  [Secure Session Flow](#6-secure-session-flow)
7.  [Browser Storage (IndexedDB)](#7-browser-storage-indexeddb)
8.  [Server-Side Data Handling & Persistence](#8-server-side-data-handling--persistence)

---

### 1. API Authentication

All server-to-server API requests, such as creating a room or generating a join token, must be authenticated to prevent unauthorized access. This is achieved through a robust HMAC-based signature verification process. For detailed information on the API endpoints and their parameters, please refer to the [API Documentation](/docs/api/intro.md).

-   **API Key**: Every request must include a valid `API-KEY` in its headers.
-   **HMAC Signature**: A `HASH-SIGNATURE` header must be provided, which is a **HMAC-SHA256** hash of the request payload, signed with the shared `API-SECRET`.

The server validates the API key and re-computes the hash on its end. It performs a constant-time comparison against the provided signature to mitigate timing attacks. Any request with an invalid key or signature is immediately rejected.

*Reference: `server/pkg/controllers/auth.go` (`HandleAuthHeaderCheck`)*

### 2. User Authentication & Authorization

Before a user can connect to a room's real-time infrastructure (NATS and LiveKit), their access token must be verified.

1.  The client sends its access token to the `/api/verifyToken` endpoint.
2.  The backend server validates the JWT, checks for duplicate connections, verifies the user is not on a blocklist, and ensures the room has not exceeded its participant limit.
3.  Upon successful verification, the server returns the necessary connection details, including NATS WebSocket URLs and a list of NATS subjects the user is permitted to interact with.

All subsequent API calls from the client to the backend during the session require the `Authorization` header with the user's access token.

To maintain a secure and uninterrupted session, the client application is responsible for proactively renewing the access token before it expires. This renewal process occurs securely over NATS: the client sends a renewal request via NATS, and the server responds with a new, updated token through the same secure NATS channel.

*References: `server/pkg/controllers/auth.go` (`HandleVerifyToken`), `client/src/helpers/api/plugNmeetAPI.ts`*

### 3. End-to-End Encryption (E2EE)

Plug-N-Meet provides robust End-to-End Encryption (E2EE) for all peer-to-peer data, including media streams (audio, video, screen sharing), chat messages, whiteboard data and all notifications. This ensures that the server never has access to the unencrypted content.

#### 3.1. Server-Generated Keys

When a room is created with E2EE enabled but `enabled_self_insert_encryption_key` is `false`, the backend server securely generates a 32-byte random string to serve as the base secret. This secret is stored as part of the room's metadata and distributed to authenticated participants when they join.

-   Upon receiving this secret, the client-side application does **not** use it directly for encryption.
-   Instead, it processes the secret through the **PBKDF2 (Password-Based Key Derivation Function 2)** algorithm, using the room's random **Session ID** as the salt. This ensures that even if the same `roomId` is reused, each session will generate a unique cryptographic key.
-   This derives a strong AES-256 key that is used for all subsequent encryption and decryption operations.

*References: `protocol/utils/create_room.go` (`SetCreateRoomDefaultValues`), `protocol/proto_files/plugnmeet_create_room.proto`*

#### 3.2. User-Provided Keys

For maximum security and zero-trust, rooms can be configured with `enabled_self_insert_encryption_key` set to `true`.

-   In this mode, each user is prompted to enter a secret key or passphrase upon joining. It is the participants' responsibility to coordinate and share the same secret key, as the server has zero knowledge about the key as the plain key never leaves the user's device. If participants use different keys, they will not be able to communicate with each other in the encrypted session.
-   The client-side application processes this passphrase through the same robust **PBKDF2** algorithm, using the room's random **Session ID** as the salt. This process is intentionally slow to make brute-force attacks against the user's passphrase infeasible.
-   The strong cryptographic key derived from this process is then used for all encryption and decryption, ensuring the user's original secret is never used directly and is well-protected against attacks.

*References: `client/src/components/extra-pages/InsertE2EEKey.tsx`, `client/src/helpers/libs/cryptoMessages.ts` (`importSecretKeyFromPlainText`), `client/src/helpers/nats/ConnectNats.ts` (`createMediaServerConn`)*

### 4. Transport & Data-in-Transit Security

#### 4.1. NATS Communication

Communication for signaling, chat, and other data messages is handled via NATS.

-   **Permissions**: When a user connects to NATS, the `nats-auth-controller` on the backend dynamically generates a set of permissions based on the user's validated token. This strictly limits which subjects a user can publish or subscribe to, enforcing a principle of the least privilege.
-   **E2EE**: If E2EE is enabled for the room, all data payloads (e.g., chat messages, whiteboard updates) are encrypted on the client side *before* being published to NATS. The server only routes the encrypted blobs of data.

*References: `server/pkg/controllers/nats_auth_controller.go`, `client/src/helpers/nats/ConnectNats.ts`*

#### 4.2. Media Server (LiveKit)

Media streams are managed by LiveKit, which has built-in support for E2EE.

-   The same cryptographic key used for NATS data is passed to the LiveKit SDK.
-   The LiveKit client SDK handles the encryption and decryption of all audio, webcam, and screen-sharing tracks directly on the user's device. The media server (SFU) only relays encrypted media packets.

*Reference: `client/src/helpers/livekit/ConnectLivekit.ts`*

#### 4.3. SIP Gateway

The telephone dial-in feature is powered by the **[livekit/sip](https://github.com/livekit/sip)** project. This is an advanced feature that requires the server administrator to configure it with an external SIP trunking provider to bridge calls between the telephone network (PSTN) and your WebRTC session.

-   **Administrator Responsibility:** You are responsible for the setup and security of this integration. For detailed setup instructions, please refer to the official [livekit/sip GitHub repository](https://github.com/livekit/sip).
-   **Transport Encryption (SRTP):** The `livekit/sip` service supports `SIPMediaEncryption` (SRTP), which encrypts the audio stream between the SIP gateway and your provider. It is your responsibility to enable this and to ensure your provider supports it.
-   **E2EE Incompatibility:** The SIP gateway must process unencrypted audio to bridge the call between the PSTN and WebRTC networks. Because of this, it is **fundamentally incompatible with End-to-End Encryption**. The SIP dial-in feature is automatically disabled for any room where E2EE is active.

### 5. AI Services & Data Privacy (The Insights Platform)

The Plug-N-Meet Insights Platform integrates with third-party AI providers (such as Microsoft Azure and Google) to offer advanced features. As the operator of the platform, it is your responsibility to understand how this data is handled and to update your own privacy policy accordingly.

#### 5.1. Audio-Based AI Features

Features that require understanding spoken words, such as **Speech-to-Text**, **Spoken Translations**, and **AI Meeting Summaries**, work by processing the meeting's audio.

*   **How it Works:** When these features are enabled, an AI agent joins the session. This agent captures the mixed audio stream of the meeting and sends it directly to the configured AI provider for processing.
*   **Data Flow:** The audio data is streamed from your Plug-N-Meet server to the third-party AI provider's servers.

#### 5.2. Text-Based AI Features

Text-based features have different data flow models depending on their purpose.

*   **Chat Translation:** This is a **broadcast** feature. When a user sends a chat message, the text is sent to the AI provider for translation. The translated text is then received by the Plug-N-Meet server and broadcast to the relevant participants.
*   **AI Chat Assistant:** This is a **private, one-to-one** feature. When a user sends a message to the AI Assistant, that prompt is sent to the AI provider. The response is sent back **only to that specific user** and is not broadcast to anyone else in the meeting.

#### 5.3. The Impact of End-to-End Encryption (E2EE)

Your privacy and security are paramount. The interaction between AI features and E2EE is designed to be secure by default.

*   **When E2EE is enabled with a self-provided key (`enabled_self_insert_encryption_key: true`), all audio-based AI features are automatically disabled.** This is a deliberate security design. The AI agent cannot decrypt the audio stream, and therefore cannot function.
*   **Text-based features like Chat Translation and the AI Chat Assistant will continue to function.** This is because the text is sent to the AI provider *before* it is encrypted for transport over NATS.

**Disclaimer for Operators:** You are the data controller. It is your responsibility to inform your users that when AI features are enabled, their audio and/or text data will be processed by third-party AI providers. You must ensure your terms of service and privacy policy are updated to reflect this data flow.

### 6. Secure Session Flow

The end-to-end connection process is designed with security at each step. The exact flow can vary based on the room's configuration (e.g., whether E2EE is enabled).

1.  **Token Verification**: The client verifies its access token with the backend.
2.  **NATS Connection**: The client connects to NATS using the credentials from step 1. The NATS auth service grants fine-grained permissions for the session.
3.  **Initial Data Fetch**: The client requests initial room data over the secure NATS connection.
4.  **(Conditional) E2EE Key Import**: If End-to-End Encryption is enabled for the room, the client imports the E2EE key. This key is either received from the server or derived from the user's manual input, depending on the room's E2EE settings.
5.  **Media Connection**: The client connects to the LiveKit media server. If E2EE is active, it enables encryption with the imported key.
6.  **Secure Communication**: All subsequent data and media are now handled according to the room's security configuration, with E2EE applied if it was enabled.

### 7. Browser Storage (IndexedDB)

To enhance user experience and ensure session continuity, the application utilizes the browser's built-in IndexedDB storage. This is used for purely functional purposes, such as restoring a user's session if they accidentally refresh their page.

To achieve this, the application temporarily stores ephemeral session data on the end-user's local device. The categories of data stored may include, but are not limited to:

*   **User & Session Preferences:** To remember settings like a chosen subtitle language.
*   **Session Content & History:** To restore chat messages, speech-to-text transcripts, and the state of the whiteboard.
*   **Performance Caches:** Such as cached images to improve loading times.

#### Data Lifecycle and Encryption

The data stored in IndexedDB is designed to be ephemeral and is handled as follows:

*   **Encryption:** The data stored in IndexedDB is **not encrypted** by the application. This is a deliberate design choice, as the data resides on the end-user's own device and is protected by the security measures of the user's operating system and browser profile. The primary security focus is on encrypting data *in transit* and ensuring it is not persisted on any server.
*   **Normal Session End:** When a user properly ends their session (e.g., by clicking "End meeting" or "Leave Meeting"), all stored data for that session is **immediately and permanently deleted** from the browser.
*   **Abnormal Session End (e.g., closing the browser tab):** If a session is not ended properly, the data remains in the browser's IndexedDB. However, upon the next application startup, a cleanup process runs. This process automatically identifies and deletes any stored data from previous sessions that has exceeded a predefined maximum age (e.g., several hours). This maximum age is configurable and subject to change in future versions to optimize performance and privacy.

**Key Points:**

*   This data is stored **only on the end-user's browser** and is never transmitted elsewhere for storage purposes.
*   The storage is essential for the application's expected functionality and is not used for tracking or analytics.

**Disclaimer for Operators:** As the person or organization deploying this software, you are responsible for creating and maintaining your own Privacy Policy. You should use this information to ensure your policy is transparent and compliant with any applicable data protection regulations (e.g., GDPR, CCPA).

### 8. Server-Side Data Handling & Persistence

To provide a complete picture of the data lifecycle, this section outlines how data is handled and stored on the server side. The architecture is designed to separate volatile real-time data from long-term persistent data, with a strong emphasis on user-controlled data retention.

#### 8.1. Real-Time Session State (Redis or NATS KV)

During an active meeting, the server needs to manage the real-time state of the room, such as the list of participants, their mute status, and other immediate metadata. This is handled by a high-performance, in-memory key-value store (either Redis or NATS KV).

-   **Purpose:** Fast, real-time coordination of an active session.
-   **Lifecycle:** This data is volatile and is tied to the life of the session. It is automatically cleared when the session ends.

#### 8.2. Persistent Database (MariaDB)

For historical reference and administrative purposes, a small subset of non-sensitive information is stored in a persistent relational database (MariaDB).

-   **Purpose:** Long-term record-keeping of meeting occurrences.
-   **Data Stored:** This typically includes basic room information such as `roomId`, `title`, creation/end time etc.

#### 8.3. Optional Analytics Data

PlugNmeet provides the option to persist detailed analytics for a session to help administrators understand usage patterns. This feature is governed by a setting that provides administrators with control over data retention.

-   **User Control:** The decision to **persist** analytics data is made by the administrator on a per-room basis via the `enable_analytics` flag, adhering to the principle of privacy by default.
-   **Data Collected (Metadata, Not Content):** To protect user privacy, PlugNmeet **does not store the raw content** of user interactions in its analytics. Instead, it aggregates metadata and event counters. For example, the system records:
    -   The *number of times* a user sent a chat message, not the chat messages themselves.
    -   The *number of times* a user drew on the whiteboard, not the content of the drawings.
    -   The *total duration* a user spoke, not the audio of what they said.
    -   Other engagement events like join/leave times, files uploaded, and poll votes.
-   **Storage:** If persisted, this aggregated metadata is **always stored as a JSON file** on the server's filesystem. A reference to the filename and its associated room is then stored in a dedicated table in the persistent database for easy retrieval.
-   **Lifecycle:** Analytics data is aggregated in-memory during the course of an active session. Upon the conclusion of the session, the system checks the room's `enable_analytics` setting.
    -   If `true`, the aggregated metadata is written to a JSON file, and its reference is saved to the database.
    -   If `false`, the in-memory data is immediately discarded and is not persisted in any form.

#### 8.4. Cloud Recordings

When cloud recording is enabled for a session, the resulting media file (MP4) is stored on the server.

-   **Purpose:** To provide a persistent, shareable record of a meeting.
-   **Storage:** The MP4 files are stored in a configurable directory on the server's filesystem. To allow for easy management and retrieval via the API, a reference to each recording—including its `record_id`, associated `roomId`, `file_path`, `file_size`, and creation timestamp—is stored in a dedicated table in the persistent database.
-   **User Control & Lifecycle:** The management of these recordings is entirely controlled by the administrator via the API. Recordings are retained on the server indefinitely until they are explicitly deleted using the `/recording/delete` API call. This gives the administrator full control over the data retention lifecycle.
-   **E2EE Incompatibility:** Server-side recording is **fundamentally incompatible** with zero-trust End-to-End Encryption. Therefore, cloud recording is automatically disabled and cannot be initiated if the room is configured with `enabled_self_insert_encryption_key: true`. This is because the server has no access to the unencrypted media streams required to create the recording, which is the core guarantee of the E2EE model.

#### 8.5. AI Service Artifacts

When AI features like transcription or summarization are used, they generate valuable data artifacts. Similar to cloud recordings and analytics, Plug-N-Meet gives the administrator full control over this data.

-   **Purpose:** To provide a persistent, retrievable record of AI-generated meeting intelligence.
-   **Storage:** The generated files (e.g., VTT transcription files, text summaries) are stored in a configurable directory on the server's filesystem. To allow for easy management and retrieval, **metadata** about these artifacts—such as the associated `roomId`, `file_path`, AI token usage, and speech duration—is stored in the `pnm_room_artifacts` table in the persistent database.
-   **User Control & Lifecycle:** The management of these artifacts is entirely controlled by the administrator via the API. You can:
    -   **Download** the transcription or summary files.
    -   **Delete the Artifact File:** The API allows you to delete the generated files from the server's filesystem to save storage space.
    -   **Retained Metadata:** The associated metadata in the `pnm_room_artifacts` table is linked to the meeting's history and is **retained** for your records, even after the file is deleted. This ensures you always have a permanent record for auditing and analyzing AI service usage and costs.

---

This layered approach to security and data handling does more than just protect against common threats; it provides a transparent and flexible framework that puts you, the operator, in control. By combining robust security measures with a "**_privacy by design_**" philosophy, Plug-N-Meet gives you the tools and the transparency needed to meet your own privacy and compliance obligations confidently.
