---
title: Scripting & Storage Hooks
description: Learn how to use scripting hooks in the recorder and server for automating media workflows and integrating with external storage providers.
keywords: [hooks, scripting, storage, recorder, server, automation, s3, custom storage, nodejs, bash, long-lived, external_url_hook, external url hook, ai agent knowledge, mcp server hook]
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
  - script: "http-request http://localhost:8090/your/endpoint"
    is_one_shot: true
```

---

## Key Responsibilities

### File Cleanup Responsibility

:::danger Important
When you enable a hook that receives a file path (like `upload_hook` or `post_transcoding`), plugNmeet **disables its own automatic file cleanup** for that stage.
:::

This is a critical safety feature. The application delegates file management to your script because it cannot know its nature (e.g., whether it's an uploader or just a notifier). If the application deleted a file before your script could process it, it would cause an error.

Therefore, the responsibility for file management is transferred to you, and your script's role determines its responsibility:

*   **If your script MOVES or UPLOADS the file** (e.g., to S3), it **MUST** delete the local source file from `input_path` after the transfer is successful. This is essential to prevent your server's disk from filling up.

*   **If your script only OBSERVES the file** (e.g., for logging, analytics, or sending a notification) and does not move it, it **MUST NOT** delete the file. The file is still needed by plugNmeet for its own internal storage or for subsequent hooks in a pipeline.

### Path Consistency Responsibility

:::warning Path Consistency is Your Responsibility
**plugNmeet does not validate the `output_path` you return from a hook. It is stored as a string and used as the `input_path` for subsequent `download_hook` and `delete_hook` calls.**
:::

*   **If your script modifies `output_path`** (e.g., changing a local path to an S3 key in an `upload_hook` or `post_transcoding` hook), you take full responsibility for that path. You **MUST** also implement a corresponding `download_hook` and `delete_hook` that can understand and process the custom path format you have defined.

*   **If your script is only for observation** (e.g., logging stats or sending a notification) and does not modify the `output_path`, then you do not need to provide the other hooks. The default workflow will continue with the original path.

Failing to provide compatible `download_hook` and `delete_hook` scripts after changing the `output_path` will result in broken downloads and deletions.


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

## External URL Hook (`server`)

`external_url_hook` lets your script take part in the AI Agent's external URL handling. It is asked to approve a URL and, when you want, to supply the content instead of letting plugNmeet fetch it. It covers the two external sources: knowledge pages (when a room sets `allow_web_fetch`) and external MCP servers.

**Configuration in `server/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controls parallel execution. Default: 1.
  # 'hook_timeout' sets a timeout. Default: 5m.
  external_url_hook:
    pool_size: 1
    hook_timeout: 5m
    scripts:
      - script: "/path/to/your/external_url_hook.sh"
        is_one_shot: false
```

The hook uses the same [execution models](#execution-models), [communication protocol](#communication-protocol), and [pipeline model](#the-pipeline-model) as every other hook. It is called **once per request, with no retries**. The request is refused only when the script fails: a non-empty `error` in its response, a failed execution, or a timeout. A response that is not valid JSON is logged as a warning and discarded, so the request continues with the payload it already had. Emit valid JSON in every response, and use `error` to deny a request.

### Input: `ExternalUrlHookData`

```json
{
  "stage": "validate",
  "type": "knowledge",
  "room_id": "room01",
  "url": "https://docs.example.com/api/auth",
  "allowed_urls": ["https://docs.example.com/api/"]
}
```

```json
{
  "stage": "fetch",
  "type": "mcp",
  "room_id": "room01",
  "url": "https://mcp.example.com/mcp",
  "server_key": "acme-docs"
}
```

| Field | Type | Description |
| --- | --- | --- |
| `stage` | string | `validate` or `fetch`. |
| `type` | string | `knowledge` for an external knowledge page, `mcp` for an external MCP server. |
| `room_id` | string | The room the request belongs to. |
| `room_sid` | string | Reserved. The server does not populate it yet, so the field is omitted. |
| `url` | string | The URL being checked or fetched: at `validate`, a knowledge prefix or an MCP endpoint taken from the room request; at `fetch`, the page or endpoint plugNmeet is about to dial. |
| `server_key` | string | `type: "mcp"` only. The `mcp_servers` key of the server, for example `acme-docs`. |
| `allowed_urls` | string[] | `type: "knowledge"` only. The room's `allowed_knowledge_urls` prefixes. |

### Output

Return the JSON object with the fields you want to set:

| Field | Description |
| --- | --- |
| `error` | A non-empty value refuses the request. The message is reported back to the caller. |
| `action` | `allow_fetch` to let plugNmeet fetch the URL itself, or `provide_content` to return your own `content`. |
| `target_url` | Replacement URL to use instead of `url`. |
| `content` | Response body, used with `provide_content`. |
| `mime_type` | Media type of `content`. |

With `action: "provide_content"` on a knowledge URL, plugNmeet uses your `content` and makes no outbound request at all, which is useful when the page lives behind your own gateway or must be rendered from a local index.

:::warning Deny with `error`, not with malformed output
Malformed or empty output is **not** a refusal. The runner logs it, drops it, and passes the previous payload through, so the request is treated as approved. Only a non-empty `error`, a failed execution, or a timeout refuses the request.
:::

### Stages

#### `validate`

Runs **at room creation**, after the built-in feature and URL checks have accepted the request and before the room starts. The hook sees only entries that passed those checks:

*   once for each accepted prefix in the AI Agent's `allowed_knowledge_urls`, and
*   once for each `mcp_servers` key of the AI Agent and of the AI text chat.

A malformed, non-HTTPS, non-public, or non-443 prefix is refused by the built-in check first, so the hook never sees it. Knowledge prefixes are checked only when the AI Agent is enabled, and MCP keys when the AI Agent or the AI text chat is enabled. Breakout rooms are skipped, because they inherit endpoints the parent room already had vetted.

Return an `error` to refuse the entry. plugNmeet then aborts room creation and returns your message to the caller.

#### `fetch`

Runs in different places, depending on `type`:

*   **`knowledge`**: only on a cache miss. A page served from the knowledge cache is never sent to the hook.
*   **`mcp`**: before the server is contacted at discovery and warm-up, and before every tool call, so a cached tool result does not skip the hook.

Return an `error` to refuse the request.

### What the Hook Cannot Change

The hook runs on top of the built-in protections and cannot weaken them:

*   An MCP target still has to be a public HTTPS endpoint on port 443, and for MCP only `target_url` is honoured: `content` is ignored.
*   A rewritten `target_url` for a knowledge page is re-checked against the built-in HTTPS and public non-internal host rules, but it is not pinned to port 443 and does not have to match the room's allow-list.
*   Runtime limits still apply to any fetch plugNmeet performs: an allow-list of content types, a 256 KiB body, at most 12,000 characters passed to the model, and at most 3 redirects.

:::info Knowledge Prefix Rules
A room may declare at most 20 prefixes, each up to 1024 characters. A prefix must be HTTPS on port 443, without credentials, fragment, raw IP, or internal host, and any query string must match exactly.
:::

For the underlying rules, see [External Knowledge & External MCP Security](/docs/ai-agent/developer-guide#external-knowledge--external-mcp-security) and the [Security Overview](/docs/security-overview#5-ai-services--data-privacy-the-insights-platform).

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
*   **Purpose**: Upload the raw file to a network-accessible location (e.g., S3, NFS) so it can be accessed by a transcoder.
*   **Input**: The `input_path` field contains the path to the raw recording file on the recorder's local disk.
*   **Script's Job**: Upload the file and return the JSON with `output_path` set to the file's new network location or identifier (e.g., an S3 key). **After a successful upload, you must delete the local source file from `input_path`.**

#### 2. `pre_transcoding`
*   **When**: Runs on the **TRANSCODER** node before `ffmpeg` processing begins.
*   **Purpose**: Download the raw file from a network location to a temporary local path on the transcoder.
*   **Input**: The `input_path` field contains the network location/identifier of the raw file (this is the `output_path` from the `post_recording` stage).
*   **Script's Job**: Download the file and return the JSON with `output_path` set to the new **local path** on the transcoder's disk.

#### 3. `post_transcoding`
*   **When**: Runs on the **TRANSCODER** node after `ffmpeg` successfully creates the final `.mp4` file.
*   **Purpose**: Upload the final processed file to permanent storage and perform cleanup.
*   **Input**: The `input_path` field contains the path to the final, transcoded `.mp4` file on the local disk of the transcoder node.
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
