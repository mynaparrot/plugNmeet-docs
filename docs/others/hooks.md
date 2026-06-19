---
title: Scripting & Storage Hooks
description: Learn how to use scripting hooks in the recorder and server for automating media workflows and integrating with external storage providers.
keywords: [hooks, scripting, storage, recorder, server, automation, s3, custom storage, nodejs, bash, long-lived]
sidebar_position: 4
sidebar_label: Hooks
---

# Scripting & Storage Hooks

plugNmeet features a powerful hooking system that allows you to execute custom scripts or commands at key points in the media and file management lifecycle. This enables deep customization, letting you integrate with any external storage provider (e.g., S3, Google Cloud), call custom APIs, or orchestrate complex, multi-server pipelines.

Hooks are available in both the `server` and `recorder` components.

:::tip Looking for Examples?
This page covers the technical details of the hooking system. For practical, real-world examples in various programming languages, check out our blog posts tagged with **[hooks](/blog/tags/hooks)**.
:::

:::info Source of Truth
The JSON data structures for hooks may change over time. This documentation provides examples, but for the most up-to-date definitions, please refer to the official `plugnmeet-protocol` repository:

[https://github.com/mynaparrot/plugnmeet-protocol/tree/main/hooks](https://github.com/mynaparrot/plugnmeet-protocol/tree/main/hooks)
:::

## Core Concepts

All hooks, regardless of where they run, share the same fundamental design. Understanding these core concepts is essential before implementing your own custom scripts.

### Execution Models

For maximum performance and flexibility, hook scripts can be configured as either **long-lived processes** or **one-shot commands**.

*   **Long-Lived Processes**: When a plugNmeet component (like `server` or `recorder`) starts, it launches your script **once**. The script then runs continuously, listening for requests. This model is highly efficient as it avoids the overhead of starting a new process for every event. **This is the recommended approach for most use cases.**
*   **One-shot Commands**: These are simple commands (like `curl`, `wget`, or the built-in `http-request`) that are executed for each hook event. They are suitable for simple, self-contained tasks.

### Communication Protocol

Communication with your hook script happens over standard I/O pipes using **newline-delimited JSON**.

*   **`stdin`**: Your script reads requests from `stdin`. Each line is a complete JSON object representing a single request.
*   **`stdout`**: For each request received, your script **must** print a single line of JSON to `stdout` as its response.
*   **`stderr`**: You can use `stderr` for logging and debugging within your script. This output is ignored by plugNmeet but is invaluable for development.

:::danger CRITICAL: Scripts are Blocking
The call to a hook script is **synchronous and blocking**. Your script **MUST** write a response to `stdout` for every request it receives. If a script fails to return a response, the plugNmeet service will hang indefinitely.
:::

### The Pipeline Model

If you define multiple scripts for a single hook, they form a pipeline. The `stdout` response from the first script becomes the `stdin` request for the second, and so on.

If a script in the chain doesn't need to modify the data (e.g., it only logs the event), it **must** still pass the original, unmodified JSON object through to `stdout`.

### Error & Data Handling

*   **Valid JSON Response**: If your script returns valid JSON, it is passed to the next script or used as the final result.
*   **Invalid JSON Response**: If the response is not valid JSON, plugNmeet logs a **warning** and discards the output. The *original* JSON data (the `stdin` to your script) is passed to the next script in the pipeline. This prevents a single faulty script from breaking the entire chain.
*   **Reporting Errors**: If your script encounters an error, it should populate the `error` field in its JSON response. It is crucial to **always return the complete input JSON object, with the `error` field populated**, to ensure subsequent scripts in a pipeline receive the expected data structure. The main application will log this error.

### How to Create a Hook

1.  **Create a Script or Command**: Write your logic in any language (Shell, NodeJS, Go, etc.).
2.  **Make it Executable**: Ensure your script has execute permissions (e.g., `chmod +x your_script.js`).
3.  **Configure in `config.yaml`**: Add the script's absolute path or the command to the appropriate `hooks` section in your `config.yaml`.

### Built-in `http-request` Utility

plugNmeet provides a convenient one-shot command, `http-request`, for sending the hook's JSON payload to an HTTP/HTTPS endpoint.

**Usage:**
`http-request <URL>`

**Example in `config.yaml`:**
```yaml
scripts:
  - script: "http-request http://localhost:8080/your/endpoint"
    is_one_shot: true
```

---

## Key Responsibilities

### File Cleanup Responsibility

:::danger File Cleanup is Your Responsibility
When the hook system is enabled, plugNmeet delegates file management to your scripts. If a hook provides you with a temporary local file (e.g., via `input_path`), **plugNmeet will not delete that file**.

Your script is responsible for cleaning up the local source file after it has been processed (e.g., after uploading it to remote storage). This is critical to prevent your server's disk from filling up.
:::

### Path Consistency Responsibility

:::warning Path Consistency is Your Responsibility
plugNmeet **does not validate** the `output_path` you return from a hook. It is stored as a string and used as the `input_path` for subsequent `download_hook` and `delete_hook` calls.

*   **If your script modifies `output_path`** (e.g., changing a local path to an S3 key in an `upload_hook` or `post_transcoding` hook), you take full responsibility for that path. You **MUST** also implement a corresponding `download_hook` and `delete_hook` that can understand and process the custom path format you have defined.

*   **If your script is only for observation** (e.g., logging stats or sending a notification) and does not modify the `output_path`, then you do not need to provide the other hooks. The default workflow will continue with the original path.

Failing to provide compatible `download_hook` and `delete_hook` scripts after changing the `output_path` will result in broken downloads and deletions.
:::

---

## Server Storage Hooks (`server`)

Server hooks allow you to override the default local file storage for room artifacts, chat files, and recordings, enabling integration with any external storage provider.

**Configuration in `server/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controls parallel execution. Default: 1.
  # 'hook_timeout' sets a timeout. Default: 5m.
  upload_hook:
    pool_size: 2
    scripts:
      - script: "/path/to/your/upload_script.sh"
        is_one_shot: false

  download_hook:
    scripts:
      - script: "/path/to/your/download_script.sh"
        is_one_shot: false
  # ... other hooks ...
```

### Hook Types

#### `upload_hook`
*   **Purpose**: Upload a file or directory (e.g., room analytics, whiteboard images) to external storage.
*   **Input (`UploadHookData`)**:
    ```json
    {
      "input_path": "/path/on/server/disk/analytics.json",
      "input_directory_path": "", // or "/path/to/converted/images/"
      "hook_file_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l"
    }
    ```
*   **Script's Job**: Upload the content from `input_path` or `input_directory_path`. Return the JSON with `output_path` set to a unique storage identifier. **After a successful upload, you must delete the local source file/directory.**

#### `download_hook`
*   **Purpose**: Provide a secure way for users to download a file from external storage.
*   **Input (`DownloadHookData`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics.json", // The storage identifier
      "hook_file_type": "artifact"
    }
    ```
*   **Script's Job**: Return JSON specifying an `action`.
    *   **`action: "redirect"` (Recommended)**: Generate a temporary, pre-signed URL and return it in the `redirect_url` field.
    *   **`action: "serve_local"`**: Download the file to a temporary local path on the server and return the path in `output_path` and the file's `mime_type`.

#### `delete_hook`
*   **Purpose**: Delete a file from external storage.
*   **Input (`DeleteHookData`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics.json", // The storage identifier
      "hook_file_type": "artifact"
    }
    ```
*   **Script's Job**: Delete the file from storage and return a confirmation response.

#### `resumable_upload_hook`
*   **Purpose**: Handle chunked file uploads for the chat feature, typically by offloading logic to a service like S3's Multipart Upload.
*   **Input (`ResumableUploadHookData`)**: Contains a `type` field (`part-check`, `part-upload`, `merge`) that dictates the required action.
*   **Script's Job**: Interact with your storage backend to check, upload, or merge file chunks. The response must indicate the outcome (e.g., `part_exists`, `merge_success`).

#### `room_end_hook`
*   **Purpose**: Perform cleanup tasks after a room session has ended (e.g., clean up abandoned resumable upload chunks).
*   **Input (`RoomEndHookData`)**:
    ```json
    {
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l"
    }
    ```
*   **Script's Job**: Perform cleanup and return a confirmation message.

---

## Recorder Hooks (`recorder`)

Recorder hooks are used to manage the recording file as it moves through the transcoding pipeline. This is essential for multi-server deployments where recording and transcoding may happen on different machines.

**Configuration in `recorder/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controls how many hook pipelines can run in parallel. Default: 1.
  # 'hook_timeout' sets a timeout for the entire hook chain. Default: 1h.
  post_recording:
    pool_size: 2
    hook_timeout: 2h
    scripts:
      - script: "./scripts/post-recording/upload.sh"
        is_one_shot: false

  pre_transcoding:
    scripts:
      - script: "./scripts/pre-transcoding/download.sh"
        is_one_shot: false

  post_transcoding:
    scripts:
      - script: "./scripts/post-transcoding/notify.sh"
        is_one_shot: false
```

### Data Payload: `RecordingHookData`

All recorder hooks receive and are expected to return a JSON object with this structure.

```json
{
  "task": "single",
  "recording_id": "REC_ax9s3djn2s",
  "room_table_id": 123,
  "room_id": "room01",
  "room_sid": "SID_d82k3s9d2l",
  "file_name": "REC_ax9s3djn2s.mp4",
  "recorder_id": "node_01",
  "file_size": 123.45,
  "input_path": "/path/to/file.mp4",
  "input_paths": [],
  "output_path": "",
  "error": "",
  "should_cleanup": false,
  "source_for_cleanup": ""
}
```

### Hook Stages

#### 1. `post_recording`
*   **When**: Runs on the **RECORDER** node after a raw recording file is saved.
*   **Purpose**: Upload the raw file to a network-accessible location (e.g., S3, NFS) for the transcoder.
*   **Input**: `input_path` points to the raw file on the recorder's local disk.
*   **Script's Job**: Upload the file and return the JSON with `output_path` set to the file's new location. **After a successful upload, you must delete the local source file from `input_path`.**

#### 2. `pre_transcoding`
*   **When**: Runs on the **TRANSCODER** node before `ffmpeg` processing begins.
*   **Purpose**: Download the raw file from network storage to a temporary local path on the transcoder.
*   **Input**: Receives the JSON from the `post_recording` hook. `input_path` is the network location.
*   **Script's Job**: Download the file and return the JSON with `output_path` set to the new **local path** on the transcoder's disk.

#### 3. `post_transcoding`
*   **When**: Runs on the **TRANSCODER** node after `ffmpeg` successfully creates the final `.mp4` file.
*   **Purpose**: Upload the final processed file to permanent storage and perform cleanup.
*   **Input**: Receives the JSON from the `pre_transcoding` hook. `output_path` now points to the final processed file on the local disk.
*   **Script's Job**: Upload the final file and return the JSON, optionally updating `output_path`. The `should_cleanup` and `source_for_cleanup` fields can be used to manage cleanup of temporary files from the `pre_transcoding` stage.

---

## Example: Long-Lived Node.js Script

This example shows the basic structure for a long-lived script that safely parses JSON, performs an action, and returns a response.

```javascript
#!/usr/bin/env node
// scripts/my_hook.js

const readline = require('readline');
const fs = require('fs');

// Use stderr for logging so it doesn't interfere with stdout
const log = (message) => {
  console.error(`[MyHook] ${new Date().toISOString()}: ${message}`);
};

log('Starting long-lived hook script...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  let requestData;
  try {
    requestData = JSON.parse(line);
    log(`Received request for room: ${requestData.room_id || 'N/A'}`);

    // --- Your Custom Logic Here ---
    // e.g., upload to S3, call an API, etc.
    // After a successful upload, remember to clean up the source file.
    if (requestData.input_path) {
      // In a real script, you would do this AFTER a successful upload.
      // fs.unlinkSync(requestData.input_path);
      // log(`Cleaned up ${requestData.input_path}`);
    }

    requestData.processed_by_hook = true;
    // ---

    // ALWAYS write a valid JSON response to stdout
    process.stdout.write(JSON.stringify(requestData) + '\n');

  } catch (e) {
    log(`ERROR: ${e.message}`);
    // If an error occurs, return the original requestData object with an 'error' field.
    // This ensures the full structure is maintained for subsequent scripts.
    const errorResponse = requestData 
      ? { ...requestData, error: e.message, output_path: "" } // Clear output_path on error
      : { error: `Failed to parse incoming JSON: ${e.message}` };
      
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

rl.on('close', () => {
  log('Stdin closed. Exiting script.');
  process.exit(0);
});
```
