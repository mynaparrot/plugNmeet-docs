---
title: "Streamline Your Session Replays: Introducing the New Merge Recordings API"
slug: merge-recordings-api
authors: [jibon]
tags: [api, developer, recording, integration, automation, video-editing, moodle, use-case, moodle video conference plugin, video call server, video conference server]
---

At Plug-N-Meet, we are constantly working to improve the post-session experience for both administrators and end-users. A common challenge in long-running events like webinars, online classes, or multi-part training sessions is managing multiple recording segments. Stopping and starting a recording is often necessary, but it leaves you with a fragmented collection of video files.

Today, we're excited to solve this problem with the introduction of the `/recording/mergeRecordings` API—a powerful new tool designed to consolidate multiple recording files into a single, seamless video. This feature is a must-have for anyone running a self-hosted **video conference server** and looking to provide a polished, professional experience.

<!--truncate-->

---

### The Problem: Fragmented Recordings

Imagine you're hosting a three-hour workshop on your **video call server**. You pause the recording during a 15-minute break and then resume it. Or perhaps you have to restart a recording due to a technical issue. At the end of the session, you have two or more separate video files.

This creates a disjointed experience for anyone watching the replay. It also creates extra work for administrators who have to manually download, edit, and re-upload the files to create a single, coherent video.

### The Solution: The `mergeRecordings` API

The `mergeRecordings` API automates this entire process. It allows you to programmatically combine multiple recording files from a session into one continuous video. The original files are kept intact, and a new, merged recording is created with its own unique `record_id`.

This process happens asynchronously in the background, so it doesn’t tie up your system. You simply make the API request, and when the merge is complete, your application receives a webhook notification (`recording_proceeded`) with the details of the new, unified recording file.

### Use Case Spotlight: Seamless Merging in our Moodle Video Conference Plugin

This isn't just a theoretical feature—it's already enhancing our official **[Plug-N-Meet Moodle Plugin](/docs/user-guide/moodle-integration#merge-multiple-recordings)**. As a leading **moodle video conference plugin**, we believe in providing seamless workflows for educators.

**The Scenario:** A teacher conducts a long class and records it in two parts. After the session, they see both recordings listed in their Moodle activity.

**The Old Way:** The teacher would have to instruct students to watch both videos in order, or manually download and edit them together.

**The New Way with the API:**
1.  The teacher navigates to the "Recordings" tab in their Moodle course activity.
2.  They select the recordings they want to combine.
3.  They click a "Merge" button directly within the Moodle interface.
4.  The Moodle backend calls the `mergeRecordings` API.
5.  A short time later, a new, single recording file automatically appears in the list, ready for students to view.

**The Result:** An incredibly simple, intuitive workflow for educators. They can create a polished, single-session replay without ever leaving their Moodle dashboard, demonstrating the power of this API to create user-friendly features on any **video conference server**.

### How It Works: Two Powerful Merging Strategies

The API offers two flexible ways to combine your recordings:

1.  **Merge by Session (`by_session`)**: This is the simplest method. You provide a `room_sid` (the unique identifier for a session), and the API automatically finds all recording files associated with that session and merges them in chronological order. You can even choose to exclude specific recordings if you need to remove a false start or an unwanted segment.

2.  **Merge by IDs (`by_ids`)**: This method gives you granular control. You provide an explicit list of `recording_ids` in the exact order you want them to be merged. This is perfect for more complex scenarios where you might be combining recordings from different sessions into a single compilation.

### Technical Quick-Look

-   **Asynchronous Operation**: This is a background job. Your application makes the API call and gets an immediate confirmation. The actual processing is handled by a `plugnmeet-recorder` instance.
-   **Webhook Notification**: You must have a webhook endpoint configured to receive the `recording_proceeded` event. This event will signal that the merged file is ready and provide its new `record_id`.
-   **Originals are Safe**: The merge process is non-destructive. Your original recording files are never deleted, giving you the freedom to manage them as you see fit.

For detailed request and response examples, please refer to the official **[mergeRecordings API Documentation](/docs/api/recording/merge-recordings)**.

### Conclusion: A Smoother Experience for Everyone

The `mergeRecordings` API is a game-changer for anyone who needs to deliver polished, professional session replays. By automating the consolidation of fragmented recordings, it saves administrators time, simplifies post-production workflows, and provides a seamless viewing experience for your audience.

This feature is a perfect example of our commitment to providing a flexible, API-driven platform that can adapt to your unique needs, making your **video call server** more powerful than ever.

---
**Ready to simplify your recording management?**

*   **[Explore the `mergeRecordings` API Documentation](/docs/api/recording/merge-recordings)**
*   **[Check out our full API Reference](/docs/api/intro)**
*   **[Learn more about our Moodle Integration](/docs/user-guide/moodle-integration)**
