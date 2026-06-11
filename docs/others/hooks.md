---
title: Scripting & Storage Hooks
description: Learn how to use scripting hooks in the recorder for automating transcoding workflows and storage hooks in the server for advanced file management with external providers.
keywords: [hooks, scripting, storage, recorder, server, automation, s3, custom storage, nodejs, bash]
sidebar_position: 4
sidebar_label: Hooks
---

# Scripting & Storage Hooks

plugNmeet offers powerful hooking mechanisms in both the `recorder` and `server` components to allow for advanced customization and automation of your media workflows. A "script" can be any executable file (a shell script, a compiled Go program, a NodeJS script, etc.) that can read from `stdin` and write to `stdout`.

---

## Recorder: Scripting Hooks

Scripting hooks allow you to automate tasks at different stages of the recording and transcoding process. This is especially powerful in a multi-server setup where recording and transcoding happen on different machines.

All scripts follow a standard interface: they receive a JSON payload via **stdin** and can optionally return a modified JSON payload via **stdout**. If multiple scripts are defined for a single hook, they form a pipeline: the **stdout** of the first script becomes the **stdin** for the second, and so on.

### Hook Stages

1.  **`post_recording`**: Runs on the **RECORDER** after the raw file is saved.
    *   **Purpose**: Upload the raw file to shared storage (NFS, S3, etc.).
    *   **Action**: Should return JSON with the `output_path` updated to the new network-accessible location for the transcoder.

2.  **`pre_transcoding`**: Runs on the **TRANSCODER** before `ffmpeg` starts.
    *   **Purpose**: Download the file from shared storage to a local path.
    *   **Action**: Should return JSON with the `output_path` updated to the final local path for `ffmpeg` to use.

3.  **`post_transcoding`**: Runs on the **TRANSCODER** after `ffmpeg` finishes.
    *   **Purpose**: Final cleanup, notification, or upload of the processed file.
    *   **Action**: Can optionally return JSON with the `output_path` updated (e.g., to an S3 URL) to be sent to the main plugNmeet server.

### Configuration

Add the path to your executable(s) in the `hooks` section of your recorder's `config.yaml`.

```yaml
# config.yaml
hooks:
  post_recording:
    - "./scripts/post-recording/upload.sh"
  pre_transcoding:
    - "./scripts/pre-transcoding/download.sh"
  post_transcoding:
    - "./scripts/post-transcoding/upload-to-s3.sh"
    - "./scripts/post-transcoding/notify-slack.sh"
```

### Data Payload (`stdin`)

Your script will receive a JSON object with the following structure.
**Key Fields for Path Handling:**
*   **`input_path`**: (string, optional) The primary path for the script to process. This could be a local file path or a remote storage URL, depending on the stage.
*   **`input_paths`**: (array of strings, optional) Used for tasks involving multiple files (e.g., merging multiple recordings).
*   **`output_path`**: (string, optional) The path that the script returns as the result of its operation. This could be a new local path, a remote storage URL, or any identifier for the processed file.

```json
{
  "task": "single",
  "recording_id": "REC_ax9s3djn2s",
  "room_table_id": 123,
  "room_id": "room01",
  "room_sid": "SID_d82k3s9d2l",
  "file_name": "REC_ax9s3djn2s.mp4",
  "input_path": "/path/to/recording/files/node_01/room01/REC_ax9s3djn2s.mkv",
  "input_paths": ["/path/to/segment1.mkv"],
  "file_size": 123.45,
  "recorder_id": "node_01"
}
```

### Script Examples

#### Bash with `jq`

This example reads the `input_path` from `stdin`, logs it, and passes the original JSON to `stdout`.

```bash
#!/bin/bash
# scripts/post-recording/upload.sh

# Read the entire stdin
JSON_DATA=$(cat)

# Use jq to extract the input_path
INPUT_PATH=$(echo $JSON_DATA | jq -r '.input_path')

# Log the action (e.g., to a file or stderr)
echo "Uploading file: $INPUT_PATH" >&2

# Here, you would add your upload logic (e.g., aws s3 cp ...)
# For this example, we'll just pass the data through, or set an output_path.
# If you upload to S3, you might set output_path:
# NEW_S3_PATH="s3://my-bucket/recordings/$(basename "$INPUT_PATH")"
# echo $JSON_DATA | jq --arg new_path "$NEW_S3_PATH" '.output_path = $new_path'

# For this example, we'll just pass the data through.
echo $JSON_DATA
```

#### Node.js

This example parses the `stdin` data, logs the `recording_id`, and returns a modified JSON object to `stdout`.

```javascript
#!/usr/bin/env node
// scripts/post-recording/upload.js

let data = '';

process.stdin.on('readable', () => {
  let chunk;
  while (null !== (chunk = process.stdin.read())) {
    data += chunk;
  }
});

process.stdin.on('end', () => {
  if (!data) {
    process.exit(0);
  }
  const scriptData = JSON.parse(data);

  // Your logic here
  console.error(`Processing recording: ${scriptData.recording_id}`);

  // Example: Modify the output_path after an upload
  scriptData.output_path = `s3://my-bucket/${scriptData.file_name}`;

  // Output the modified JSON to stdout
  process.stdout.write(JSON.stringify(scriptData));
});
```

---

## Server: Storage Hooks

Storage hooks allow you to override the default local file storage and integrate with any external storage provider (e.g., S3, Google Cloud Storage) using custom scripts. This is ideal for cloud-native or multi-server deployments where you need centralized, scalable storage.

These hooks are primarily used for **room artifacts**. The `upload_hook` is triggered when the server generates an artifact. The `download_hook` and `delete_hook` are used for both artifacts and recordings.

*   **Room Artifacts**: This includes artifact types such as `MEETING_SUMMARY`, `SPEECH_TRANSCRIPTION`, and `MEETING_ANALYTICS`. For a complete list, please refer to the official protobuf definition.
*   **Recordings**: The server does **not** use the `upload_hook` for recordings. Instead, the recorder should upload the final recording to your external storage directly via its `post_transcoding` hook. The server then uses the `download_hook` and `delete_hook` to manage access to that recording.

If this section is omitted from your `config.yaml`, the server will store all files on the local disk.

### Configuration

Add the `storage_hooks` section to your server's `config.yaml`.

```yaml
# config.yaml
storage_hooks:
  upload_hook:
    - "./scripts/server_hooks/upload.sh"
  download_hook:
    - "./scripts/server_hooks/download.sh"
  delete_hook:
    - "./scripts/server_hooks/delete.sh"
```

### Hook Types & Payloads

#### Upload Hook

*   **Request (`stdin`)** - *Used for artifacts only.*
    ```json
    {
      "input_path": "/path/on/disk/analytics.json",
      "service_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l",
      "room_table_id": 123
    }
    ```
*   **Response (`stdout`)**: The final script *must* return the `output_path`.
    ```json
    {
      "output_path": "artifacts/room01/analytics_SID_d82k3s9d2l.json",
      "error": ""
    }
    ```

:::info What is an `output_path`?
The `output_path` is a unique identifier that your upload script creates and understands. It can be any string format you choose, such as an S3 object key (`my-bucket/artifacts/file.json`), a file ID from a storage service, or a simple filename. This same value will be passed back to your `download_hook` and `delete_hook` scripts later, so they know which file to act on.
:::

#### Download Hook

*   **Request (`stdin`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics_SID_d82k3s9d2l.json",
      "service_type": "artifact"
    }
    ```
*   **Response (`stdout`)**: The final script *must* return an `action` and a corresponding value.
    ```json
    {
      "action": "redirect",
      "redirect_url": "https://s3.presigned.url/...",
      "error": ""
    }
    ```

The `action` determines how the server will provide the file to the user:

*   `redirect` **(Recommended)**: Your script should return a `redirect_url`. The server will then send a `307 Temporary Redirect` to the client, allowing them to download the file directly from your external storage. This is highly efficient as the file does not pass through your server. A common use case is generating a pre-signed URL for an S3 object.

*   `serve_local`: Your script must first download the file from your external storage to a temporary location on the server's local disk. It must then return the full `output_path` **and** the correct `mime_type` for the file (e.g., `application/json`, `video/mp4`). The server will read the file from this path and stream it to the client with the proper `Content-Type` header. This method consumes more server resources and is generally not recommended unless direct redirection is not possible.

#### Delete Hook

*   **Request (`stdin`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics_SID_d82k3s9d2l.json",
      "service_type": "artifact"
    }
    ```
*   **Response (`stdout`)**: Optional, for logging purposes.
    ```json
    {
      "msg": "File deleted successfully",
      "error": ""
    }
    ```
