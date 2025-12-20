---
title: Download Artifact API | plugNmeet API Reference
description: API endpoint documentation for generating a download token for a meeting artifact.
keywords: [api, artifact, download, get token, download token]
sidebar_position: 3
sidebar_label: Download
---

# Get Download Token

Endpoint: `/artifact/getDownloadToken`

This endpoint generates a secure, one-time-use token that can be used to download an artifact file.

:::info[Which Artifacts Are Downloadable?]
This endpoint is only for artifact types that represent a physical file, such as `MEETING_SUMMARY` or `SPEECH_TRANSCRIPTION`. It will not work for metadata-only artifacts like `MEETING_SUMMARY_USAGE`.
:::

## Request Parameters

| Field       | Type   | Required | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| artifact_id | string | Yes      | The unique identifier of the artifact. |

## Response

| Field  | Type   | Description                      |
| :----- | :----- | -------------------------------- |
| status | boolean| Indicates if the request was successful. |
| msg    | string | Response message.                |
| token  | string | The one-time-use download token.   |

After receiving the token, you can provide the following download URL to your user:
`https://Your-Plug-N-Meet-Server.com/download/artifact/THE_TOKEN_HERE`
