---
title: "Beyond the Record Button: A Guide to Managing and Using Your Meeting Recordings"
slug: guide-to-managing-meeting-recordings
authors: [bob,jibon]
tags: [tutorial, how-to, recordings, api, content-management, developer]
---

For many platforms, the "record" button is the end of the story. You get an MP4 file, and that's it. But what if your recordings could be more? What if they could be a structured, searchable, and accessible content library for your students, your team, or your customers?

With Plug-N-Meet's powerful API, your recordings aren't just video files; they are programmable assets.

This guide will show you how to move beyond simply recording a meeting and start building a true content management system using the Recordings API. We'll cover how to find your recordings, enrich them with metadata, and even attach subtitles.

<!--truncate-->

---

## The Goal

By the end of this guide, you will be able to programmatically manage your entire recording lifecycle, turning a simple list of video files into a rich, queryable content library.

## Prerequisites

*   A running Plug-N-Meet server.
*   Basic familiarity with making API calls (we'll use `cURL` for the examples).
*   Your Plug-N-Meet `API_KEY` and `API_SECRET`.

---

### Step 1: Enable Cloud Recording

First, you need to ensure your meetings are being recorded. You can do this on a per-room basis when you create it. In your `createRoom` API call, include the `recording_features` block and set `is_allow_cloud` to `true`.

For a "record by default" experience, you can also enable `enable_auto_cloud_recording`.

```json
{
  "room_id": "my-recorded-session",
  "metadata": {
    "room_features": {
      // ... other features
      "recording_features": {
        "is_allow": true,
        "is_allow_cloud": true,
        "enable_auto_cloud_recording": true
      }
    }
  }
}
```

---

### Step 2: Find Your Recordings

After your meetings are over, the first step is to get a list of your available recordings. You can do this using the `recording/fetch` endpoint. You can fetch recordings for one or more specific rooms by providing their IDs in the `room_ids` array.

This call will return a paginated list of all recordings for the specified room(s).

```bash
# The raw JSON body as a string
BODY='{"room_ids":["room01"],"from":0,"limit":20,"order_by":"DESC"}'

# Your API credentials
API_KEY="YOUR_API_KEY"
SECRET="YOUR_API_SECRET"

# Generate the HMAC-SHA256 signature
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# Make the POST request
curl -X POST https://YOUR_SERVER_URL/auth/recording/fetch \
  -H "Content-Type: application/json" \
  -H "API-KEY: $API_KEY" \
  -H "HASH-SIGNATURE: $SIGNATURE" \
  -d "$BODY"
```

The response will give you a list that includes the `record_id`, `room_id`, `file_size`, and `creation_time` for each recording—the essential building blocks for your content library.

---

### Step 3: Make Your Recordings Discoverable with Metadata

A filename like `rec_123.mp4` isn't very helpful. To make your recordings useful, you need to add context. The `recording/update-metadata` endpoint allows you to add a descriptive title, a detailed description, and even your own custom data.

Let's say you just finished a "Q4 Marketing Sync" and you want to tag it appropriately.

```bash
# The raw JSON body as a string
BODY='{"record_id":"f031a270-20ab-433d-96e9-aed34db97c0a-1761814595173","metadata":{"title":"Q4 Marketing Sync - Final Strategy","description":"A detailed review of the Q4 marketing plan, including budget allocation and final campaign targets.","extra_data":{"department":"Marketing","quarter":"Q4-2025","is_public":"true"}}}'

# Your API credentials
API_KEY="YOUR_API_KEY"
SECRET="YOUR_API_SECRET"

# Generate the HMAC-SHA256 signature
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# Make the POST request
curl -X POST https://YOUR_SERVER_URL/auth/recording/update-metadata \
  -H "Content-Type: application/json" \
  -H "API-KEY: $API_KEY" \
  -H "HASH-SIGNATURE: $SIGNATURE" \
  -d "$BODY"
```

Now, when you fetch this recording, it will come with rich, structured data. You can use the `extra_data` field to build powerful filtering and search features in your own application (e.g., "show me all recordings from the Marketing department").

---

### Step 4 (Bonus): Attach Subtitles and Summaries

If you used the **AI Meeting Assistant** during your meeting, you can link the generated transcription file directly to your recording's metadata.

1.  First, use the `artifacts/fetch` API to get the URL of the VTT subtitle file.
2.  Then, call `recording/update-metadata` again, this time adding a `subtitles` map.

```bash
# The raw JSON body as a string
BODY='{"record_id":"f031a270-20ab-433d-96e9-aed34db97c0a-1761814595173","metadata":{"subtitles":{"en":{"label":"English","url":"https://YOUR_SERVER_URL/path/to/your/transcript.vtt"}}}}'

# Your API credentials
API_KEY="YOUR_API_KEY"
SECRET="YOUR_API_SECRET"

# Generate the HMAC-SHA256 signature
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# Make the POST request
curl -X POST https://YOUR_SERVER_URL/auth/recording/update-metadata \
  -H "Content-Type: application/json" \
  -H "API-KEY: $API_KEY" \
  -H "HASH-SIGNATURE: $SIGNATURE" \
  -d "$BODY"
```

By linking these assets together, you create a far more valuable piece of content. Your users can now watch the recording with closed captions, improving accessibility and comprehension.

---

## Conclusion

Stop thinking of your recordings as a simple archive. With Plug-N-Meet's API-first approach, you have the tools to build a sophisticated, searchable, and accessible content management system.

By programmatically fetching, enriching, and linking your recordings with other assets, you can transform a simple folder of MP4 files into a powerful knowledge base for your organization.

---
**Ready to build your content library?**

*   **Explore the full [Recording API Documentation](/docs/api/recording/fetch)**
*   **Learn how to generate summaries with our [AI Features Guide](/blog/how-to-add-ai-meeting-assistant-features)**
*   **Automate this entire process with [Webhooks](/blog/how-to-build-your-first-webhook-workflow)**
