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

For example, you could build an integration that allows users to select a file from a cloud storage service like Google Drive or an S3 bucket. Your application would handle downloading the file from the service and then use this API to push it into the active Plug-N-Meet session.

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

## Request Parameters

The request must be sent as a `multipart/form-data` request.

| Field     | Type   | Required | Description                                                                                                                                                                                                    |
| --------- | ------ | -------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `room_id` | string | Yes      | The unique identifier of the active room to which you want to upload the file.                                                                                                                                 |
| `document`| file   | Yes      | The file to be uploaded. The file size must not exceed the `max_size_whiteboard_file` limit defined in the server settings. The supported file types are also configured on the server (e.g., PDF, Doc, etc.). |

## Authentication for Multipart Requests

Unlike standard JSON requests, `multipart/form-data` requests require a special authentication method. Because the exact body content can vary between requests due to multipart boundaries, the `HASH-SIGNATURE` **must be generated from an empty string**.

-   **`Content-Type`**: Should be `multipart/form-data`. cURL and most HTTP clients will set this automatically when you use form fields.
-   **`HASH-SIGNATURE`**: An HMAC-SHA256 signature generated using your API Secret, with an **empty string** as the message body.

## Example cURL Request

This example demonstrates how to correctly generate the signature and send a file upload request.

```bash
# Your API credentials
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"

# 1. For multipart/form-data, generate the signature from an empty body.
SIGNATURE=$(echo -n "" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 2. Make the POST request with the correct headers and form data.
#    cURL will automatically set the Content-Type to multipart/form-data.
curl -X POST 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
--header "API-KEY: $API_KEY" \
--header "HASH-SIGNATURE: $SIGNATURE" \
--form 'room_id="room01"' \
--form 'document=@"/path/to/your/presentation.pdf"'
```

## Response

If the file is uploaded successfully, the server will broadcast the necessary information to all participants in the room to display the new whiteboard page.

| Field       | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indicates if the request was successful. |
| msg         | string  | Response message.                        |
| status_code | number  | Response [status code](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |