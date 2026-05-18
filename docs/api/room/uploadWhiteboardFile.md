---
title: Upload Whiteboard File API | plugNmeet API Reference
description: API endpoint documentation for uploading files to the whiteboard in a live video conference room. Learn how to programmatically add documents or images to the whiteboard.
keywords: [api, whiteboard, upload, file, document, image, video api, endpoint]
sidebar_position: 7
sidebar_label: Upload Whiteboard File
---

# Upload Whiteboard File

Endpoint: `/room/uploadWhiteboardFile`

This API allows your application to upload a file directly to the whiteboard of an active Plug-N-Meet session. You can use this to programmatically add documents to the whiteboard for all participants to see and collaborate on.

This endpoint is particularly useful for:
*   Integrating with external document management systems.
*   Creating automated workflows that involve sharing files during a live session.

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
curl --location 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
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
