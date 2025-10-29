---
title: "Who Holds the Keys? A Guide to plugNmeet's End-to-End Encryption Models"
slug: e2ee-key-models-guide
authors: [jibon]
tags: [e2ee, security, encryption, privacy, architecture, developer]
---

In the world of secure communication, End-to-End Encryption (E2EE) is the gold standard. It ensures that only the participants in a conversation can decrypt and view the media streams, not even the server itself. At plugNmeet, we've implemented a robust E2EE model based on the WebRTC Insertable Streams API.

But "E2EE" isn't a single, one-size-fits-all solution. A critical question remains: **where do the encryption keys come from, and who manages them?**

plugNmeet offers two distinct models for managing E2EE keys, controlled by a simple setting: `enabled_self_insert_encryption_key`. Understanding the difference is key to choosing the right security posture for your application.

<!--truncate-->

---

## The Core Concept: Shared Secret

In both models, the goal is the same: every participant in a room must share the exact same secret key. This key is used to encrypt all outgoing media and decrypt all incoming media. If a user doesn't have the key, they can't participate.

The difference between our two models comes down to a simple question: **who generates and distributes this shared secret?**

### Model 1: Server-Generated Keys (`enabled_self_insert_encryption_key = false`)

This is the **default, simplest, and most convenient** method.

**How it works:**
1.  When the first participant joins an E2EE-enabled room, the **plugNmeet server** cryptographically generates a strong, random secret key for that specific room.
2.  As each subsequent participant joins, the plugNmeet server securely delivers this key to the new participant as part of their authentication response.
3.  The client's browser then uses this key to set up its encryption mechanism.

**Who is this for?**
*   **Most standard use cases.**
*   Applications that need strong encryption without the complexity of building their own key management system.
*   Anyone who trusts their own self-hosted plugNmeet server to manage keys on a per-session basis.

**Pros:**
*   **Simple to Implement:** E2EE works out of the box with no extra development work required on your part.
*   **Secure:** The key is generated on your trusted, self-hosted server and transmitted securely to each client. It only exists for the duration of the session.

**The Trust Model:**
In this model, you are trusting your own plugNmeet server to generate and distribute the keys. The server "knows" the key for each session, but it is designed not to store it long-term. For a self-hosted environment, this is a very strong and practical security model.

---

### Model 2: User-Provided Keys (`enabled_self_insert_encryption_key = true`)

This is the **most secure and advanced** method, providing a true "zero-knowledge" architecture where not even your application handles the key.

**How it works:**
1.  When this mode is enabled, the plugNmeet server **does not** generate or handle any keys.
2.  It becomes the users' responsibility to securely share a secret key among themselves using a completely **out-of-band channel** (e.g., a Signal message, a password manager, or even verbally). Your application and servers never touch or see this key.
3.  When a user joins the meeting, the plugNmeet UI will **prompt them to manually enter the secret key**.
4.  The user must type or paste the pre-shared key into the prompt. Only if the key is correct will their client be able to encrypt and decrypt the media streams to participate in the call.

**Who is this for?**
*   **Maximum Security & Zero-Knowledge Applications:** Use cases where you need to guarantee that your entire server infrastructure (including both the plugNmeet server and your own application backend) has absolutely no knowledge of the encryption keys.
*   **Journalist/Whistleblower Platforms:** Situations where proving that you cannot access user communications is a core feature.
*   **High-Assurance Enterprise Meetings:** For top-secret internal discussions where keys are managed by corporate security policy, not the application.

**Pros:**
*   **True Zero-Knowledge:** Your servers are completely blind to the content of the conversations. The key never touches your server infrastructure, not even your application's frontend.
*   **Maximum User Control:** The security of the key is entirely in the hands of the end-users and their chosen out-of-band communication method.

**The Trust Model:**
In this model, you are not trusting any server component at all. You are only trusting the end-user clients and the security of the out-of-band mechanism they used to share the key. This is the highest level of user-controlled security you can achieve.

---

## Quick Comparison: Which Model Should You Use?

| Use Case                                      | Recommended Model        | Why?                                                                                             |
| :-------------------------------------------- | :----------------------- | :----------------------------------------------------------------------------------------------- |
| **A general-purpose meeting platform**        | **Server-Generated**     | Simple, secure, and requires no extra work. The default choice for most applications.            |
| **A secure telehealth or legal app**          | **User-Provided**        | Provides the strongest "zero-knowledge" guarantee, which may be required for compliance.         |
| **A private chat for a small, trusted team**  | **Server-Generated**     | The security is more than sufficient, and the convenience is high.                               |
| **Building a Signal/Telegram-like video app** | **User-Provided**        | Aligns with the user-controlled, zero-knowledge philosophy of those platforms.                   |

## Conclusion

The choice between server-generated and user-provided keys is a classic trade-off between convenience and absolute control. By offering both models, plugNmeet gives you the flexibility to choose the security posture that best fits your application's specific needs and threat model.

Whether you need the simple, out-of-the-box security of server-generated keys or the zero-knowledge guarantees of a user-provided model, plugNmeet provides the tools to build a truly secure communication platform.

---
**Ready to learn more?**

*   **Read our [Security Overview](/docs/security-overview)**
*   **Explore the [API Documentation](/docs/api/intro)**
