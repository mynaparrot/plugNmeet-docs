---
title: Upload Whiteboard File API | plugNmeet API Reference
description: API endpoint documentation for uploading files to the whiteboard in a live video conference room. Learn how to programmatically add documents or images to the whiteboard.
keywords: [api, whiteboard, upload, file, document, image, video api, endpoint]
sidebar_position: 7
sidebar_label: Upload Whiteboard File
---

# Upload Whiteboard File

Endpoint: `/room/uploadWhiteboardFile`

While presenters can upload files directly through the Plug-N-Meet client interface, this API endpoint provides the flexibility to inject files into a live session from an external system. It acts as a bridge between your application's backend and the Plug-N-Meet room, allowing for powerful, automated workflows.

For example, you could build an integration that allows users to select a file from a cloud storage service like Google Drive or an S3 bucket. Your application can either download the file and then push it to the server using a `multipart/form-data` request, or you can provide a direct download URL using the `document_link` parameter. If you use `document_link`, it is crucial that you provide the final, direct download link, as the server will not perform any authentication. Your application is responsible for handling any necessary authentication with the storage service and generating a publicly accessible link.

After a successful upload via this API:
1.  The presenter receives a notification within the room.
2.  The new file appears in the **whiteboard files list**.
3.  The presenter can then choose when to display the file on the whiteboard for all participants.

This allows for pre-loading multiple files into the session's file list. Note that each API request can only contain one file at a time.

## Prerequisites

For this API call to succeed, the following conditions must be met:
1.  The session (`room_id`) must be active.
2.  At least one user with a `presenter` role must be present in the room.

This functionality is different from the `preload_file` option available in the [Create Room API](/docs/api/room/create). The `preload_file` option accepts a direct URL and prepares the file when the room is created (before it is active). This endpoint, in contrast, is designed for uploading files to an already running session.

## Request

The request must be sent as a `multipart/form-data` request and include the required headers.

### Headers

| Header           | Type   | Required | Description                                                                 |
| ---------------- | ------ | -------- | --------------------------------------------------------------------------- |
| `API-KEY`        | string | Yes      | Your API key for authentication.                                            |
| `HASH-SIGNATURE` | string | Yes      | The HMAC-SHA256 signature. See [Authentication](#authentication-for-multipart-requests) for details. |
| `Room-Id`        | string | Yes      | The unique identifier of the active room to which you want to upload the file. |

### Body

You must provide either `document` (for direct file upload) or `document_link` (for server-side download), but not both. All uploads are subject to the [File Constraints](#file-constraints) detailed below.

| Field          | Type   | Required | Description                                                                 |
| -------------- | ------ | -------- |-----------------------------------------------------------------------------|
| `document`     | file   | No       | The file to be uploaded. See [File Constraints](#file-constraints).         |
| `document_link`| string | No       | A publicly accessible URL from which the server will download the file. **Important**: The server will not perform any authentication, so your application must provide a final, direct download link. See File Constraints. |

### File Constraints

-   **Supported File Types**: This endpoint is designed for office documents and presentations. Supported formats include **PDF, DOC, DOCX, PPT, PPTX, etc.** Image files (e.g., JPG, PNG) are not supported and will be rejected.
-   **File Size Limit**: The size of the file, whether uploaded directly or downloaded via `document_link`, must not exceed the `max_size_whiteboard_file` limit defined in your server's configuration.

## Authentication for Multipart Requests

Unlike standard JSON requests, `multipart/form-data` requests require a special authentication method. For this specific endpoint, the `HASH-SIGNATURE` **must be generated from the value of the `Room-Id` header**.

-   **`Content-Type`**: Should be `multipart/form-data`. cURL and most HTTP clients will set this automatically when you use form fields.
-   **`HASH-SIGNATURE`**: An HMAC-SHA256 signature generated using your API Secret, with the `Room-Id` as the message body.

## Example cURL Requests

This section demonstrates how to correctly generate the signature and send a file upload request using both methods.

### Example 1: Uploading a file directly

```bash
# Your API credentials
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"
ROOM_ID="room01"

# 1. Generate the signature from the Room-Id value.
SIGNATURE=$(echo -n "$ROOM_ID" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 2. Make the POST request with the correct headers and form data.
curl -X POST 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
--header "API-KEY: $API_KEY" \
--header "HASH-SIGNATURE: $SIGNATURE" \
--header "Room-Id: $ROOM_ID" \
--form 'document=@"/path/to/your/presentation.pdf"'
```

### Example 2: Uploading a file via a link

```bash
# Your API credentials
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"
ROOM_ID="room01"
DOCUMENT_LINK="https://example.com/my_presentation.pdf"

# 1. Generate the signature from the Room-Id value.
SIGNATURE=$(echo -n "$ROOM_ID" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 2. Make the POST request with the correct headers and form data.
curl -X POST 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
--header "API-KEY: $API_KEY" \
--header "HASH-SIGNATURE: $SIGNATURE" \
--header "Room-Id: $ROOM_ID" \
--form "document_link=$DOCUMENT_LINK"
```

## Response

**Important Notes on Concurrent Uploads and Timeouts:**

The server enforces a strict one-file-at-a-time upload policy per room to ensure data integrity. This applies whether you are uploading a file directly (`document`) or providing a URL (`document_link`).

-   **Concurrent Uploads**: The server will reject any new upload requests for a room if another upload is already in progress. If you attempt a concurrent upload, the API will respond with an HTTP status code of `409` (Conflict).
-   **Timeouts and Background Processing**: The file conversion process can be resource-intensive. If the initial request times out, the server will continue processing the file in the background. Once completed, it will notify the client, and the room's upload lock will be released, allowing for another file to be uploaded.
-   **Upload Lock Duration**: By default, the upload lock for a room is set to 5 minutes. If the file processing does not complete within this window, the operation will time out. It is crucial to select files that can be reasonably processed within this timeframe.

If the file is uploaded and processed successfully, the server will broadcast the necessary information to all participants in the room, making the new file available on the whiteboard.

| Field       | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indicates if the request was successful. |
| msg         | string  | Response message.                        |
| status_code | string  | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
