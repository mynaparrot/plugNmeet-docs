---
title: "How to Enable End-to-End Encryption in Your Video App"
slug: how-to-enable-end-to-end-encryption
authors: [bob]
tags: [tutorial, how-to, e2ee, security, encryption, privacy, developer]
---

In an age of heightened privacy concerns, offering End-to-End Encryption (E2EE) is one of the most powerful ways to build trust with your users. It provides a mathematical guarantee that conversations are confidential and that not even your server can access the media streams.

While the technology is complex, implementing it doesn't have to be. This guide will walk you through the two E2EE models available in Plug-N-Meet and show you how to enable them with a simple API call.

<!--truncate-->

---

## Prerequisites

*   A running Plug-N-Meet server.
*   The ability to make API calls to your server.

---

### Step 1: Choose Your Security Model

Before writing any code, you need to answer one question: **Who should manage the encryption keys?** Plug-N-Meet offers two distinct models, and your choice will determine the implementation.

*   **Model A: Server-Generated (Simple & Secure):** The Plug-N-Meet server generates, manages, and distributes a unique secret for each session. This is the easiest and most convenient method.
*   **Model B: User-Provided (Zero-Knowledge):** The users are responsible for creating and sharing a secret among themselves. Your server never sees the secret, providing the absolute highest level of privacy.

---

### Step 2: Implement Your Chosen Model

Enabling E2EE is done within the `end_to_end_encryption_features` block of your `createRoom` API call.

#### The Underlying Security: One-Time Session Keys

Before we look at the two models, it's important to understand a key security feature that applies to **both**: every session gets its own unique encryption key.

No matter where the initial secret comes from (the server or the user), the client's browser never uses it directly. Instead, it combines the secret with the unique Session ID of the meeting to generate a final, one-time encryption key.

This process ensures that even if you reuse the same room ID for multiple meetings, every single session is cryptographically isolated, preventing any link between them.

#### Option A: The Simple & Secure Way (Server-Generated Keys)

This is the recommended path for most applications. You get strong E2EE without needing to build any custom key-sharing logic.

In your `createRoom` metadata, set `is_enabled` to `true` and `enabled_self_insert_encryption_key` to `false`.

```json
{
  "room_id": "e2ee-room-simple",
  "metadata": {
    "room_features": {
      // ... other features
      "end_to_end_encryption_features": {
        "is_enabled": true,
        "enabled_self_insert_encryption_key": false
      }
    }
  }
}
```

**How it works:** When a user joins, the server provides a unique secret for the session. The client then uses the one-time key generation process described above to secure the meeting.

#### Option B: The Zero-Knowledge Way (User-Provided Keys)

Choose this model if you need to guarantee that your infrastructure has zero knowledge of the encryption keys.

In your `createRoom` metadata, set both `is_enabled` and `enabled_self_insert_encryption_key` to `true`.

```json
{
  "room_id": "e2ee-room-zero-knowledge",
  "metadata": {
    "room_features": {
      // ... other features
      "end_to_end_encryption_features": {
        "is_enabled": true,
        "enabled_self_insert_encryption_key": true
      }
    }
  }
}
```

**The User Experience:**
When a user joins this room, the Plug-N-Meet client will automatically prompt them to enter the shared secret key.

*   **If they enter the correct key**, their client will use it to generate the final session key (as described above) and they will be able to see, hear, and interact with other participants seamlessly.
*   **If they enter an incorrect key (or no key)**, they will still join the session, but they will not be able to see or hear anyone, nor will their own media be visible to others. They will see decryption error messages, indicating that they do not have the correct key to participate.

This behavior is by design, as the server has zero knowledge of the key and therefore cannot validate it upon entry. You must provide your users with an "out-of-band" way to share this key (e.g., a secure chat app, a password manager, or verbally).

---

### Step 3: Verify It's Working

How do you know E2EE is active? The most obvious sign is that certain server-side features will be **automatically disabled**.

If you try to use the following features in an E2EE-enabled room, they will fail, which is the expected behavior and proof that your server cannot access the media:

*   **Cloud Recording:** The server can't record what it can't see.
*   **RTMP Broadcasting:** Similarly, the server cannot broadcast an encrypted stream.
*   **Audio-Based AI Features:** The AI Meeting Assistant cannot transcribe or summarize audio it cannot decrypt.

This is a core part of the security design, ensuring that your choice of privacy is enforced across the entire platform.

---

## Conclusion

Implementing End-to-End Encryption is a powerful step, but it's just one part of a broader "**privacy by design**" philosophy. Plug-N-Meet was architected to be a secure data relay, not a data store.

Whether it's using the LiveKit SFU to route encrypted media packets or NATS to broadcast messages, the server's primary job is to pass data between participants. It has no interest in what that data is, and in the case of E2EE, it has no ability to inspect it. This philosophy extends to features like our use of [client-side storage](/blog/client-side-storage-privacy-resilience), where session data lives in your browser, not on our servers.

By choosing Plug-N-Meet, you're not just getting a feature; you're adopting a platform built on the principle that the most secure user data is the data you never have to touch.

---
**Ready to learn more?**

*   **Dive deep into our [Security & Privacy Overview](/docs/security-overview)**
*   **Review the [E2EE Key Models Guide](/blog/e2ee-key-models-guide)**
*   **Explore the full [createRoom API call](/docs/api/room/create)**
