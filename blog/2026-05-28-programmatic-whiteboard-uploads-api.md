---
title: "Injecting Content in Real-Time: A Developer's Guide to the New `uploadWhiteboardFile` API"
slug: programmatic-whiteboard-uploads-api
authors: [jibon]
tags: [api, developer, whiteboard, integration, automation, real-time, file-upload, use-case, moodle, moodle video conference plugin, video call server, video conference server]
---

At Plug-N-Meet, our goal is to provide a platform, not just a product. While our user interface is feature-rich, the true power of our architecture lies in its API-first design. Today, we're excited to introduce a new endpoint that gives developers unprecedented control over live sessions: `/room/uploadWhiteboardFile`.

This API allows your backend application to programmatically upload files directly into an active meeting's whiteboard, opening the door to powerful, seamless, and automated content workflows. This guide will walk you through the key use cases for this new feature and how it can transform your integration.

<!--truncate-->

---

### Why a New Upload API? The Power of Real-Time

You might be familiar with the `preload_file` option in our [Create Room API](/docs/api/room/create). While useful, it's designed for a different purpose: loading a document *before* a session begins.

The new `uploadWhiteboardFile` endpoint is fundamentally different. It's designed to inject content into a **live, running session**. This real-time capability is a game-changer for dynamic applications. When your backend calls this API, the file instantly appears in the presenter's file list within the live meeting, ready to be displayed.

Let's explore what you can build with this.

### Use Case 1: Seamless Cloud Storage Integration (Google Drive, Dropbox, etc.)

**The Scenario:** A user in your application wants to present a file stored in their Google Drive.

**The Old Way:** The user would have to download the file from Google Drive to their computer, then manually upload it through the Plug-N-Meet UI. This is a clunky, multi-step process.

**The New Way with the API:**
1.  Your application's UI provides a button: "Present from Google Drive."
2.  Using the Google Drive API, you allow the user to select a file.
3.  Your backend server securely downloads the file from Google Drive.
4.  Your backend then immediately calls the `uploadWhiteboardFile` API, pushing the file directly into the live Plug-N-Meet session.

**The Result:** A seamless, professional experience. The user goes from selecting a file in your app to having it ready to present in the meeting in a single click.

**Pro-Tip:** For an even more efficient workflow, you can use the `document_link` parameter. Instead of downloading the file to your server first, you can generate a publicly accessible temporary URL for the file in cloud storage and pass that link to the API. The Plug-N-Meet server will handle the download directly.

### Use Case 2: Centralized Asset Library for Corporate & Education

**The Scenario:** A company wants to ensure all sales presentations use the latest approved template, or a university wants to provide lecturers with a library of official course materials.

**The Old Way:** Presenters would have to find and download the correct file from a separate portal or shared drive before every meeting.

**The New Way with the API:**
1.  You build a "Resource Library" directly into your application's dashboard.
2.  A presenter, already in a live meeting, can browse this library from your application's interface.
3.  When they click "Add to Whiteboard" on a specific asset (e.g., `Q3-Sales-Deck.pptx`), your backend retrieves the file from its centralized storage.
4.  Your backend calls the `uploadWhiteboardFile` API to inject it into the presenter's current session.

**The Result:** Perfect brand consistency and effortless access to up-to-date, official materials, all managed from a single source of truth.

### Use Case 3: Dynamic Report Generation and On-the-Fly Analysis

**The Scenario:** A team is in a live meeting discussing performance metrics. They realize they need to see a specific, up-to-the-minute report that doesn't exist yet.

**The Old Way:** Someone would have to leave the meeting, generate the report, save it, and then manually upload it. The meeting's momentum is lost.

**The New Way with the API:**
1.  Your application has a "Generate Live Report" button integrated into its dashboard.
2.  A user in the meeting clicks the button and selects the required parameters.
3.  Your backend generates the report (e.g., a PDF of a graph) on the fly.
4.  As soon as the file is created, your backend calls the `uploadWhiteboardFile` API.

**The Result:** A report is generated and delivered into the live meeting in seconds, enabling true real-time, data-driven decision-making.

### Use Case 4: Moodle Integration - Bridging Content and Classroom

**The Scenario:** Our official [Plug-N-Meet Moodle Plugin](/docs/user-guide/moodle-integration#upload-to-whiteboard-from-moodle) already leverages this API to create a seamless experience for educators. Teachers can manage a central repository of course materials within Moodle.

**The New Way with the API:**
1.  A teacher is conducting a live class using the Plug-N-Meet activity in Moodle.
2.  They decide they need to show a specific PDF or presentation from their Moodle course files.
3.  From an interface within Moodle (outside the live session window), the teacher selects the file.
4.  The Moodle backend calls the `uploadWhiteboardFile` API, instantly pushing the selected document into the live virtual classroom.

**The Result:** The teacher never has to leave their Moodle environment. They can inject course materials into the live session on the fly, creating a fluid and uninterrupted teaching experience. This showcases how the API can bridge an external content management system directly with a live session.

---

### Technical Quick-Look & Important Considerations

This endpoint uses a `multipart/form-data` request, which requires a different authentication method than our standard JSON APIs.

#### Authentication

The `HASH-SIGNATURE` must be generated using your `API-SECRET` with the value of the `Room-Id` header as the message body. This is different from other APIs where the signature is generated from the request body.

#### File Constraints

-   **Supported File Types**: This API is optimized for office documents and presentations (`PDF`, `PPT`, `DOC`, etc.). Image files like `JPG` or `PNG` are **not** supported and will be rejected.
-   **File Size**: The file must not exceed the `max_size_whiteboard_file` limit defined in your server's configuration.

#### Server Behavior

-   **Concurrent Uploads**: The server processes only one upload at a time per room. If you send a new upload request while another is in progress for the same room, you will receive a `409 Conflict` error.
-   **Timeouts & Background Processing**: File conversion can be resource-intensive. If your initial API call times out, don't worry. The server continues to process the file in the background. Once complete, the file will appear in the room, and the upload lock will be released.

For a complete `curl` example and detailed parameter descriptions, please refer to the official **[uploadWhiteboardFile API Documentation](/docs/api/room/uploadWhiteboardFile)**.

### Conclusion: Your Application is Now the Co-Presenter

The `uploadWhiteboardFile` API transforms the whiteboard from a simple user-driven tool into a programmable, dynamic canvas. It allows your application to become an active participant in the meeting, delivering relevant content exactly when it's needed.

This feature deepens the potential for integration, enabling you to build smarter, more automated, and highly professional workflows that set your application apart.

---
**Ready to start building?**

*   **[Explore the `uploadWhiteboardFile` API Documentation](/docs/api/room/uploadWhiteboardFile)**
*   **[Check out our full API Reference](/docs/api/intro)**
*   **[Try our Live Demo](https://demo.plugnmeet.com/landing.html) to see the whiteboard in action.**
