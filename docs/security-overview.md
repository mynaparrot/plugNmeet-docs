---
title: Plug-N-Meet Security Overview | Your Self-Hosted Video Conferencing Solution
description: A detailed overview of the security architecture, authentication, authorization, and end-to-end encryption (E2EE) mechanisms within the Plug-N-Meet platform.
keywords: [security, e2ee, end-to-end encryption, authentication, authorization, hmac, jwt, nats, livekit, webrtc security]
sidebar_position: 3
sidebar_label: Security Overview
---

# Plug-N-Meet Security Overview

This document provides an overview of the security architecture and mechanisms implemented within the Plug-N-Meet platform. Our goal is to ensure the confidentiality, integrity, and availability of all communications.

## Table of Contents

1.  [API Authentication](#1-api-authentication)
2.  [User Authentication & Authorization](#2-user-authentication--authorization)
3.  [End-to-End Encryption (E2EE)](#3-end-to-end-encryption-e2ee)
    -   [Server-Generated Keys](#31-server-generated-keys)
    -   [User-Provided Keys](#32-user-provided-keys)
4.  [Transport & Data-in-Transit Security](#4-transport--data-in-transit-security)
    -   [NATS Communication](#41-nats-communication)
    -   [Media Server (LiveKit)](#42-media-server-livekit)
5.  [Secure Session Flow](#5-secure-session-flow)

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
-   Instead, it processes the secret through the **PBKDF2 (Password-Based Key Derivation Function 2)** algorithm, using a static salt and 100,000 iterations.
-   This derives a strong AES-256 key that is used for all subsequent encryption and decryption operations.

*References: `protocol/utils/create_room.go` (`SetCreateRoomDefaultValues`), `protocol/proto_files/plugnmeet_create_room.proto`*

#### 3.2. User-Provided Keys

For maximum security and zero-trust, rooms can be configured with `enabled_self_insert_encryption_key` set to `true`.

-   In this mode, each user is prompted to enter a secret key or passphrase upon joining. It is the participants' responsibility to coordinate and share the same secret key, as the server does not validate it. If participants use different keys, they will not be able to communicate with each other in the encrypted session.
-   The client-side application processes this passphrase through the same robust **PBKDF2** algorithm, using a static salt and 100,000 iterations. This process is intentionally slow to make brute-force attacks against the user's passphrase infeasible.
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

### 5. Secure Session Flow

The end-to-end connection process is designed with security at each step:

1.  **Token Verification**: Client verifies its token with the backend.
2.  **E2EE Key Prompt (if applicable)**: If self-insertion is enabled, the user provides their secret key, which is hashed client-side.
3.  **NATS Connection**: The client connects to NATS using the credentials from step 1. The NATS auth service grants fine-grained permissions.
4.  **Initial Data Fetch**: The client requests initial room data over the secure NATS connection.
5.  **E2EE Key Import**: The client imports the E2EE key (either from the server or derived from user input).
6.  **Media Connection**: The client connects to the LiveKit media server, enabling E2EE with the imported key.
7.  **Encrypted Communication**: All subsequent data and media are now end-to-end encrypted.

This multi-layered approach ensures that Plug-N-Meet sessions are secure, private, and resilient against common threats.
