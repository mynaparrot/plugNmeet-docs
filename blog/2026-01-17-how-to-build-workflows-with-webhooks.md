---
title: "A Developer's Guide: How to Build Your First Automated Workflow with Webhooks"
slug: how-to-build-your-first-webhook-workflow
authors: [bob,jibon]
tags: [tutorial, how-to, webhooks, automation, developer, api, integration, security]
---

You've set up your video conferencing service, but now you want to make it smarter. What if you could automatically log the duration of every meeting for billing? Or get a Slack notification when a VIP joins a call? This is where webhooks come in.

This guide will walk you through building your very first automated workflow. We'll create a simple but powerful service that listens for a meeting to end and logs its duration to your console—a perfect starting point for a real-world billing or analytics system.

For more high-level ideas on what's possible, check out our companion post on [5 Powerful Workflows You Can Build with Webhooks](/blog/powerful-workflows-with-webhooks).

<!--truncate-->

---

## The Goal

By the end of this tutorial, you will have a simple webhook listener that can:
1.  Securely validate and receive events from your Plug-N-Meet server.
2.  Calculate the duration of a meeting when it ends.
3.  Differentiate between different types of AI-generated artifacts.

## Prerequisites

*   A running Plug-N-Meet server with your `API_KEY` and `API_SECRET`.
*   An application endpoint (URL) ready to receive `POST` requests.
*   Node.js and a basic understanding of Express.

---

### Step 1: Setting Up Your Endpoint

First, tell Plug-N-Meet where to send the events. Open your `config.yaml` file on your server and add the `webhook_conf` section.

```yaml
webhook_conf:
  # Set to true to enable webhooks globally.
  enable: true
  # The primary URL where all events will be sent.
  url: "https://yourapp.com/webhook-listener"
```

Save the file and **restart your PlugNmeet server**. Now, all events will be sent to your specified URL.

---

### Step 2: Secure Your Endpoint with Signature Validation

Before processing any data, you **must** verify that the webhook request is genuinely from your Plug-N-Meet server. An unprotected endpoint can be exploited by anyone on the internet.

Plug-N-Meet uses a JWT-based signature in the `Authorization` header to secure webhooks. The process is:
1.  Verify the JWT token using your `API_SECRET`.
2.  Calculate a SHA256 hash of the raw request body.
3.  Compare your calculated hash with the `sha256` claim inside the verified token.

Here’s how to implement this in a Node.js/Express middleware.

```javascript
// You'll need these packages: npm install express body-parser jsonwebtoken crypto
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
const API_SECRET = 'YOUR_PLUGNMEET_API_SECRET'; // Use environment variables in production!

// We need the raw body for hash comparison, so we use a custom verify function.
app.use(bodyParser.json({
  type: 'application/webhook+json',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// The validation middleware
function validateRequest(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send('Authorization header missing');
  }

  try {
    // 1. Verify the JWT
    const decoded = jwt.verify(token, API_SECRET);

    // 2. Hash the raw request body
    const sha256 = crypto.createHash('sha256');
    sha256.update(req.rawBody);
    const hash = sha256.digest('hex');

    // 3. Compare hashes
    if (decoded.sha256 !== hash) {
      throw new Error('Signature hash does not match');
    }

    // Success! Proceed to the main handler.
    next();
  } catch (err) {
    console.error('Webhook validation failed:', err.message);
    return res.status(403).send('Invalid signature');
  }
}

// Apply the middleware to your listener route.
app.post('/webhook-listener', validateRequest, (req, res) => {
  console.log('Webhook received and validated!');
  handleWebhook(req.body);
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook listener started on port 3000');
});

// We'll define handleWebhook in the next step.
function handleWebhook(payload) {
  // ...
}
```

---

### Step 3: Handle Different Events

Now that our endpoint is secure, we can safely process the incoming data. We'll create our `handleWebhook` function to inspect the `event` property and act accordingly.

#### Use Case 1: Basic Billing & Analytics

The `session_ended` event is perfect for this. It fires when the last participant leaves and includes `creation_time` and `ended_time` timestamps.

```javascript
function handleWebhook(payload) {
  switch (payload.event) {
    case 'session_ended':
      const room = payload.room;
      const durationInSeconds = room.ended_time - room.creation_time;
      const durationInMinutes = Math.ceil(durationInSeconds / 60);
      console.log(`SUCCESS: Room '${room.room_id}' lasted for ${durationInMinutes} minutes.`);
      // In a real application, you would save this to your database.
      break;

    case 'artifact_created':
      handleArtifact(payload.room_artifact);
      break;
  }
}
```

#### Use Case 2: Advanced AI Cost & Usage Tracking

The `artifact_created` event fires whenever an AI service generates a result. The key is to inspect the `room_artifact.type` and the nested `metadata` object.

```javascript
// A mapping from the enum number to a human-readable string.
const ArtifactType = {
  2: 'MEETING_SUMMARY',
  5: 'SPEECH_TRANSCRIPTION_USAGE',
  8: 'AI_TEXT_CHAT_INTERACTION_USAGE',
  7: 'CHAT_TRANSLATION_USAGE',
};

function handleArtifact(artifact) {
  const artifactType = ArtifactType[artifact.type] || 'UNKNOWN';
  console.log(`Processing artifact of type: ${artifactType}`);

  switch (artifactType) {
    case 'MEETING_SUMMARY':
      if (artifact.metadata && artifact.metadata.file_info) {
        console.log(`New summary available at: ${artifact.metadata.file_info.file_path}`);
      }
      break;
    
    case 'SPEECH_TRANSCRIPTION_USAGE':
      if (artifact.metadata && artifact.metadata.duration_usage) {
        const usage = artifact.metadata.duration_usage;
        console.log(`Transcription usage: ${usage.duration_sec} seconds.`);
        console.log(`Estimated Cost: $${usage.duration_sec_estimated_cost.toFixed(4)}`);
      }
      break;

    case 'AI_TEXT_CHAT_INTERACTION_USAGE':
      if (artifact.metadata && artifact.metadata.token_usage) {
        const usage = artifact.metadata.token_usage;
        console.log(`AI Chat usage: ${usage.total_tokens} tokens.`);
        console.log(`Estimated Cost: $${usage.total_tokens_estimated_cost.toFixed(4)}`);
      }
      break;
  }
}
```

---

## Conclusion

That's it! You've just built a **secure** webhook handler that can intelligently process different types of events. Security is not optional when handling webhooks, and by validating the signature on every request, you ensure your application is safe from bad actors.

From here, you can easily extend this logic to build a sophisticated, real-time billing and analytics system, knowing your endpoint is properly protected.

---
**Ready to start automating?**

*   **Explore the complete [Webhooks Documentation](/docs/others/webhooks)**
*   **Review the full [API Introduction](/docs/api/intro)**
*   **Get more ideas from our post on [5 Powerful Workflows](/blog/powerful-workflows-with-webhooks)**
