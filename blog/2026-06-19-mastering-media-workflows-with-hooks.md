---
title: "Mastering Your Media Workflows: Introducing Scripting and Storage Hooks"
authors: [jibon]
tags: [plugnmeet, developer, hooks, scripting, storage, automation, s3, customisation, architecture]
---

At plugNmeet, our goal is to provide a powerful, open, and flexible platform that adapts to your needs, not the other way around. As deployments grow and move to the cloud, managing media files like recordings and artifacts becomes a critical challenge. How do you store files in S3? How do you automate notifications when a recording is ready? How do you manage complex workflows in a multi-server cluster?

Until now, solving these challenges often required modifying the core application code, making updates difficult and maintenance a chore.

Today, we're thrilled to announce a powerful new feature that changes everything: **Scripting and Storage Hooks**. This new mechanism allows you to extend and customize plugNmeet's media workflow by executing your own custom scripts—either as efficient, **long-lived processes** or simple **one-shot commands**—at key stages. All communication happens via **newline-delimited JSON** over standard I/O, so you can integrate your own logic without touching a single line of the core code.

<!--truncate-->

### Why Hooks? The Power of a Decoupled Architecture

So, why is this a game-changer? Hooks allow you to **decouple** your business logic from the application's logic. Instead of being locked into local disk storage, you can now integrate with virtually any external service.

Here’s what you can do with hooks:

*   **Integrate Any Storage Provider:** Use AWS S3, Google Cloud Storage, Backblaze, MinIO, or even a custom FTP server. If you can write a script for it, you can use it.
*   **Automate Custom Workflows:** Automatically send a Slack notification when a recording is processed, call a CRM API with meeting analytics, or trigger a video indexing service.
*   **Enable Complex, Scalable Deployments:** In a multi-server cluster, hooks are essential. A recorder node can automatically upload a raw recording to a central S3 bucket, and a separate transcoder node can be triggered to download it, process it, and re-upload the final MP4.
*   **Future-Proof Your Setup:** Your storage strategy can evolve without being tied to the plugNmeet release cycle.

### How It Works: Core Concepts

The new system is divided into two distinct but related mechanisms: **Recorder Hooks** and **Server Storage Hooks**. Before diving into the specifics, let's cover the core concepts that apply to all hooks.

#### Execution Models: Long-Lived vs. One-Shot

For maximum flexibility, you can run your hooks in two ways:

*   **Long-Lived Processes (Recommended)**: Your script is launched once and runs continuously, listening for requests on `stdin`. This is highly efficient as it avoids process startup overhead for every event.
*   **One-shot Commands**: For simpler tasks, you can execute a command for each event. This is great for `curl`, `wget`, or the built-in utility.

Speaking of which, we've included a handy one-shot command to simplify calling external APIs:

*   **Built-in `http-request` Utility**: A simple command for sending the hook's JSON payload to an HTTP/HTTPS endpoint.
    *   **Usage:** `http-request <URL>`

#### The Pipeline Model

If you define multiple scripts for a single hook, they form a pipeline. The `stdout` response from the first script becomes the `stdin` request for the second, and so on. If a script in the chain doesn't need to modify the data, it **must** still pass the original, unmodified JSON object through to `stdout`.

:::danger File Cleanup is Your Responsibility
When the hook system is enabled, plugNmeet delegates file management to your scripts. If a hook provides you with a temporary local file (e.g., via `input_path`), **plugNmeet will not delete that file**.

Your script is responsible for cleaning up the local source file after it has been processed (e.g., after uploading it to remote storage). This is critical to prevent your server's disk from filling up.
:::

:::warning Path Consistency is Your Responsibility
plugNmeet **does not validate** the `output_path` you return from a hook. It is stored as a string and used as the `input_path` for subsequent `download_hook` and `delete_hook` calls.

*   **If your script modifies `output_path`** (e.g., changing a local path to an S3 key in an `upload_hook` or `post_transcoding` hook), you take full responsibility for that path. You **MUST** also implement a corresponding `download_hook` and `delete_hook` that can understand and process the custom path format you have defined.

*   **If your script is only for observation** (e.g., logging stats or sending a notification) and does not modify the `output_path`, then you do not need to provide the other hooks. The default workflow will continue with the original path.

Failing to provide compatible `download_hook` and `delete_hook` scripts after changing the `output_path` will result in broken downloads and deletions.
:::

#### Communication Protocol

*   **`stdin`**: Your script must read from `stdin` in a loop. Each line it reads will be a complete JSON object representing a single request from the plugNmeet component.
*   **`stdout`**: For each request it receives, your script **MUST** print a single line of JSON to `stdout`. This line is the response.
*   **`stderr`**: You can use `stderr` for logging within your script. This output is ignored by plugNmeet but is invaluable for debugging your custom logic.

:::danger IMPORTANT: Scripts Must Always Respond
The call to execute a hook script is **blocking**. Your script **MUST** write a response to `stdout` for every request it receives on `stdin`. If a script fails to return a response, the plugNmeet service will hang indefinitely, waiting for the script to finish.

If a script does not need to modify the data (e.g., a script that only calls an external API for logging), it **must** still return the original, unmodified JSON object it received.
:::

#### Error Handling

If your script encounters an error, it should populate the `error` field in its JSON response to `stdout`. The main application will log this error. It is crucial to always return the complete input JSON object, with the `error` field populated, to ensure subsequent scripts in a pipeline receive the expected data structure.

If the response is not valid JSON, plugNmeet logs a **warning** and discards the output. The *original* JSON data (the `stdin` to your script) is passed to the next script in the pipeline. This prevents a single faulty script from breaking the entire chain.

### Server Hooks: Managing Artifacts and Downloads

These hooks are designed to manage how the main plugNmeet server handles files, primarily the various **room artifacts** and user-facing downloads.

*   **`upload_hook`**: Triggered when the server creates an artifact (e.g., a meeting analytics file). Your script takes the local file (`input_path`) and uploads it to your provider, returning a unique `output_path` that tells the server how to find it later.
*   **`download_hook`**: Triggered when a user requests to download an artifact or a recording. Your script receives the file's identifier (`input_path`) and tells the server how to proceed (e.g., by providing a `redirect_url` or a `serve_local` path).
*   **`delete_hook`**: Triggered when a file needs to be removed. Your script receives the file's identifier (`input_path`) and handles the deletion from your external storage.
*   **`resumable_upload_hook`**: Handles chunked file uploads for the chat feature. Your script manages checking, uploading, and merging file parts, which is ideal for offloading to services like S3 Multipart Upload.
*   **`room_end_hook`**: Performs cleanup tasks after a room session ends, such as cleaning up any abandoned resumable upload chunks.

The recommended approach for downloads is to return a temporary, pre-signed URL (`action: "redirect"`). This way, the user downloads the file directly from your storage provider (e.g., S3), and the traffic doesn't even hit your plugNmeet server, saving you bandwidth and resources.

### Recorder Hooks: Automating the Recording Pipeline

These hooks give you control over the recording and transcoding pipeline. While there are hooks for every stage (`post_recording`, `pre_transcoding`, `post_transcoding`), the most common use case is managing the final, processed file.

### Example 1: Full S3 Integration for Server Hooks

Let's walk through a real-world example of integrating S3 for all server-side file management using Node.js. With these three scripts, you have a complete, robust, and scalable storage solution for your plugNmeet server.

#### Project Setup

```bash
mkdir plugnmeet-hooks
cd plugnmeet-hooks
npm init -y
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### Server Configuration (`server/config.yaml`)

```yaml
hooks:
  upload_hook:
    pool_size: 2 # Optional: controls parallel execution
    scripts:
      - script: "/path/to/plugnmeet-hooks/upload.js"
        is_one_shot: false # This is a long-lived script
  download_hook:
    scripts:
      - script: "/path/to/plugnmeet-hooks/download.js"
        is_one_shot: false
  delete_hook:
    scripts:
      - script: "/path/to/plugnmeet-hooks/delete.js"
        is_one_shot: false
  room_end_hook:
    scripts:
      - script: "http-request http://localhost:8090/room-ended-notification"
        is_one_shot: true
```

#### The Upload Script (`upload.js`)

This script uploads server-generated artifacts (like analytics) to S3.

```javascript
#!/usr/bin/env node
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream, unlinkSync } from "fs";
import { basename } from "path";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-artifacts"; // A bucket for artifacts
const log = (message) => console.error(`S3Upload: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("S3 artifact upload hook script started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    const { input_path, room_id } = request;
    const output_path = `artifacts/${room_id}/${basename(input_path)}`;

    const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: output_path, Body: createReadStream(input_path) });
    await s3Client.send(command);
    log(`Successfully uploaded to ${output_path}`);

    try {
      unlinkSync(input_path);
      log(`Cleaned up local file: ${input_path}`);
    } catch (cleanupError) {
      log(`Error cleaning up file: ${cleanupError.message}`);
    }

    request.output_path = output_path;
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`Error: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message, output_path: "" } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

#### The Download Script (`download.js`)

This script is triggered when a user needs to access a file. It receives the S3 key in `input_path` and generates a temporary, secure, pre-signed URL for the user to download the file directly from S3.

```javascript
#!/usr/bin/env node
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-artifacts"; 
const log = (message) => console.error(`S3Download: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("S3 download hook script started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    const { input_path } = request;

    // Note: You might have different buckets for artifacts and recordings.
    // A real-world script would have logic to determine the correct bucket.
    const bucket = input_path.startsWith("recordings/") ? "my-plugnmeet-recordings" : BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: input_path,
    });

    const redirect_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    log(`Generated pre-signed URL for ${input_path}`);

    request.action = "redirect";
    request.redirect_url = redirect_url;
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`Error: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

#### The Delete Script (`delete.js`)

This script handles the removal of a file from your S3 bucket when it's deleted from plugNmeet.

```javascript
#!/usr/bin/env node
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-artifacts";
const log = (message) => console.error(`S3Delete: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("S3 delete hook script started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    const { input_path } = request;

    const bucket = input_path.startsWith("recordings/") ? "my-plugnmeet-recordings" : BUCKET_NAME;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: input_path,
    });

    await s3Client.send(command);
    log(`Successfully deleted ${input_path}`);

    request.msg = "File deleted successfully";
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`Error: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

### Example 2: Completing the Workflow with a Recorder Hook

Now, let's create the most important script for the recording workflow: the `post_transcoding` hook. In many setups, you only need to act after the final MP4 is ready. This hook runs on the recorder/transcoder node and is perfect for uploading the final file to its permanent storage location.

#### Recorder Configuration (`recorder/config.yaml`)

```yaml
hooks:
  post_transcoding:
    scripts:
      - script: "/path/to/plugnmeet-hooks/post-transcoding-upload.js"
        is_one_shot: false
```

#### The Post-Transcoding Upload Script (`post-transcoding-upload.js`)

This script runs after a recording has been successfully transcoded to MP4. It receives the path to the final MP4 on the local disk via `input_path`, uploads it to a permanent S3 bucket, and returns the S3 object key in `output_path` for the server to store.

```javascript
#!/usr/bin/env node
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream, unlinkSync } from "fs";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-recordings"; // Use a dedicated bucket for recordings
const log = (message) => console.error(`PostTranscoding: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("Post-transcoding upload hook started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    log(`Received request: ${JSON.stringify(request)}`);

    // In the post_transcoding stage, `input_path` contains the path to the final MP4 on the local disk.
    const { input_path, file_name } = request;
    
    // Use the canonical file_name from the hook data to construct the final S3 key.
    const final_s3_key = `recordings/${file_name}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: final_s3_key,
      Body: createReadStream(input_path),
      ContentType: "video/mp4",
    });

    await s3Client.send(command);
    log(`Successfully uploaded to ${final_s3_key}`);

    // This script is responsible for cleaning up the local MP4 file it was given.
    try {
      unlinkSync(input_path);
      log(`Cleaned up local transcoded file: ${input_path}`);
    } catch (cleanupError) {
      log(`WARN: Failed to clean up local file: ${cleanupError.message}`);
    }

    // Set the final S3 key in `output_path` for the server to store in the database.
    request.output_path = final_s3_key;
    
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`ERROR: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message, output_path: "" } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

:::warning Server-Side Compatibility is Required
The final `output_path` from this `post_transcoding` hook (e.g., `recordings/REC_123.mp4`) is sent to the `plugNmeet-server` and stored in the database.

When a user requests to download this recording, the **server** will use its own `download_hook` with this path as the `input_path`. You must ensure that your `server`'s `download_hook` (like the one shown in the first example) is capable of understanding and processing the `output_path` format generated by this script.
:::

### Get Started Today

This new hooking system opens up a world of possibilities for automation and advanced, cloud-native architectures. It’s designed for developers and system administrators who want to build a truly custom, scalable, and robust video conferencing platform.

Ready to dive in? Check out our new, comprehensive **[Scripting & Storage Hooks Documentation](/docs/others/hooks)** for detailed technical specifications, payload structures, and more examples.

We can't wait to see the incredible workflows you build!

---

**Ready to build your own video conferencing platform?**

*   **[Follow our Installation Guide](/docs/installation) to get your self-hosted server running in minutes.**
*   **[Try the Live Demo](https://demo.plugnmeet.com/landing.html) to explore the features.**
