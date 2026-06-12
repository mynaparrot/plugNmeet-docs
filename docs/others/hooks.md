---
title: Scripting & Storage Hooks
description: Learn how to use scripting hooks in the recorder and server for automating media workflows and integrating with external storage providers.
keywords: [hooks, scripting, storage, recorder, server, automation, s3, custom storage, nodejs, bash, long-lived]
sidebar_position: 4
sidebar_label: Hooks
---

# Scripting & Storage Hooks

plugNmeet offers a powerful hooking mechanism to allow for advanced customization and automation of your media workflows. Hooks are available in both the `recorder` and `server` components, enabling you to integrate with any external storage provider (e.g., S3, Google Cloud Storage), call custom APIs, or orchestrate complex, multi-server pipelines.

## The Long-Lived Process Model

For maximum performance and efficiency, all hook scripts are managed as **long-lived processes**. When a plugNmeet component (like `server` or `recorder`) starts, it launches each of your configured hook scripts **once**. The script then runs continuously in the background, waiting for requests.

This model eliminates the significant overhead of starting a new process for every hook event, resulting in near-instantaneous execution.

### Communication Protocol

All communication with your hook script happens over its standard I/O pipes using **newline-delimited JSON**.

*   **`stdin`**: Your script must read from `stdin` in a loop. Each line it reads will be a complete JSON object representing a single request from the plugNmeet component.
*   **`stdout`**: For each request it receives, your script **must** print a single line of JSON to `stdout`. This line is the response.
*   **`stderr`**: You can use `stderr` for logging within your script. This output is ignored by plugNmeet but is invaluable for debugging your custom logic.

The core principle of the hook system is that **a script receives a JSON object and returns the exact same object**, only modifying specific fields like `output_path` or `error`. If multiple scripts are defined for a single hook, they form a pipeline: the `stdout` response from the first script becomes the `stdin` request for the second, and so on.

### How to Create a Hook

1.  **Create a Long-Lived Script:** A "script" can be any executable file (a shell script, a compiled Go program, a NodeJS script, etc.) that runs in a loop, reading from `stdin` and writing to `stdout`.
2.  **Make it Executable:** Ensure your script has execute permissions (`chmod +x your_script.js`).
3.  **Enable in Config:** Add the full path to your executable in the appropriate `hooks` section of your `config.yaml`.

---

## Recorder Hooks (`recorder`)

These hooks allow you to manage the recording file as it moves through the transcoding pipeline. This is essential for multi-server deployments where recording and transcoding happen on different machines.

**Configuration in `recorder/config.yaml`:**

```yaml
hooks:
  post_recording:
    - "/path/to/your/post_recording_upload_script.sh"
  pre_transcoding:
    - "/path/to/your/pre_transcoding_download_script.sh"
  post_transcoding:
    - "/path/to/your/post_transcoding_notify_script.sh"
```

### Hook Stages & Data Payload

All recorder hooks use the same `RecordingHookData` JSON structure.

#### `RecordingHookData` Structure

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
  "input_paths": ["/path/to/segment1.mp4"],
  "output_path": "",
  "error": "",
  "should_cleanup": false,
  "source_for_cleanup": ""
}
```

#### Hook Stages & Script Responsibilities

1.  **`post_recording`**
    *   **Context**: Runs on the **RECORDER** node after the raw recording file is saved.
    *   **Purpose**: Upload the raw file from the recorder's local disk to a network-accessible location (e.g., NFS, S3) so the transcoder can access it.
    *   **`stdin`**: Receives `RecordingHookData` with `input_path` pointing to the raw file on the recorder's disk.
    *   **`stdout`**: Your script must return the same JSON, modifying `output_path` to be the new, network-accessible location of the file.

2.  **`pre_transcoding`**
    *   **Context**: Runs on the **TRANSCODER** node before `ffmpeg` starts processing.
    *   **Purpose**: Download the raw file from network storage to a temporary local directory on the transcoder machine.
    *   **`stdin`**: Receives the JSON output from the `post_recording` hook.
    *   **`stdout`**: Your script must return the same JSON, modifying `output_path` to be the new **local path** on the transcoder's disk where `ffmpeg` can find the file.

3.  **`post_transcoding`**
    *   **Context**: Runs on the **TRANSCODER** node after `ffmpeg` has successfully created the final processed file (e.g., `.mp4`).
    *   **Purpose**: Perform final actions, such as uploading the processed file to permanent storage, cleaning up temporary files, or notifying an external API.
    *   **`stdin`**: Receives the JSON output from the `pre_transcoding` hook, with `output_path` now pointing to the final processed file.
    *   **`stdout`**: Your script can return the JSON, optionally modifying `output_path` again if the file was moved to its final public location (e.g., a public S3 URL). This final `output_path` is what gets sent to the `server`.

---

## Server Storage Hooks (`server`)

Storage hooks in the `server` allow you to override the default local file storage and integrate with any external storage provider. These hooks are used for **room artifacts** (e.g., analytics, transcripts) and for managing access to **recordings**.

**Configuration in `server/config.yaml`:**

```yaml
storage_hooks:
  upload_hook:
    - "/path/to/your/upload_script.sh"
  download_hook:
    - "/path/to/your/download_script.sh"
  delete_hook:
    - "/path/to/your/delete_script.sh"
```

### Hook Types & Data Payloads

#### `upload_hook`

*   **Context**: Runs when `server` generates a room artifact. **This hook is NOT used for recordings.**
*   **Purpose**: Upload the artifact file from the server's local disk to your external storage.
*   **`stdin` (`UploadHookData`)**:
    ```json
    {
      "input_path": "/path/on/server/disk/analytics.json",
      "service_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l",
      "room_table_id": 123
    }
    ```
*   **`stdout`**: Your script **must** return the same JSON, modifying `output_path` to be a unique identifier that your other scripts will use to find the file later.
    ```json
    {
      "input_path": "/path/on/server/disk/analytics.json",
      "service_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l",
      "room_table_id": 123,
      "output_path": "artifacts/room01/analytics.json"
    }
    ```

:::info What is this `output_path`?
The `output_path` is a **logical path** or unique identifier that your upload script creates and understands. The `server` is completely agnostic to its format; it simply saves this string and passes it back to your `download_hook` and `delete_hook` later.

While you *can* use a full URL like `s3://my-bucket/artifacts/file.json`, a more flexible pattern is to return only the object key (`artifacts/file.json`). Your download/delete scripts can then be configured with the bucket name and construct the full URL themselves. This decouples your database from your storage configuration.
:::

#### `download_hook`

*   **Context**: Runs when a user requests to download a recording or an artifact.
*   **Purpose**: Provide a secure and efficient way for users to access the file from your external storage.
*   **`stdin` (`DownloadHookData`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics.json",
      "service_type": "artifact"
    }
    ```
*   **`stdout`**: Your script **must** return the same JSON, modifying the `action` field and its corresponding value.
    *   **`action: "redirect"` (Recommended)**: Your script should set `action` to `"redirect"` and populate the `redirect_url` with a temporary, pre-signed URL.
        ```json
        {
          "input_path": "artifacts/room01/analytics.json",
          "service_type": "artifact",
          "action": "redirect",
          "redirect_url": "https://s3.presigned.url/..."
        }
        ```
    *   **`action: "serve_local"`**: Your script must download the file to a temporary local path on the server, set `action` to `"serve_local"`, and populate both the `output_path` (the local path) and the file's `mime_type`.
        ```json
        {
          "input_path": "artifacts/room01/analytics.json",
          "service_type": "artifact",
          "action": "serve_local",
          "output_path": "/tmp/downloads/analytics.json",
          "mime_type": "application/json"
        }
        ```

#### `delete_hook`

*   **Context**: Runs when a recording or artifact is deleted.
*   **Purpose**: Delete the file from your external storage.
*   **`stdin` (`DeleteHookData`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics.json",
      "service_type": "artifact"
    }
    ```
*   **`stdout`**: Your script can optionally add a `msg` for logging.
    ```json
    {
      "input_path": "artifacts/room01/analytics.json",
      "service_type": "artifact",
      "msg": "File deleted successfully"
    }
    ```

### Example Long-Lived Node.js Script

This example shows the basic structure of a long-lived Node.js script that can handle requests.

```javascript
#!/usr/bin/env node
// scripts/my_hook.js

const readline = require('readline');

// A simple logging function to write to stderr
const log = (message) => {
  console.error(`MyHook: ${message}`);
};

log('Starting my long-lived Node.js hook script...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Listen for each line from stdin
rl.on('line', (line) => {
  try {
    log(`Received request: ${line}`);
    const requestData = JSON.parse(line);

    // --- Your Logic Here ---
    //
    // Perform your action (upload, download, delete) based on the requestData.
    // For example, for an upload hook, you might upload the file at `requestData.input_path`.
    //
    // After your action, modify the object.
    // For this example, we'll just add a new output_path.
    const newPath = `s3://my-bucket/new-path/${Date.now()}`;
    requestData.output_path = newPath;
    // ---

    // Write the modified JSON object back to stdout, followed by a newline.
    process.stdout.write(JSON.stringify(requestData) + '\n');

  } catch (e) {
    log(`Error processing request: ${e.message}`);
    // If an error occurs, write a JSON error object to stdout
    const errorResponse = { error: e.message };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

rl.on('close', () => {
  log('Stdin has been closed. Exiting script.');
  process.exit(0);
});
```
