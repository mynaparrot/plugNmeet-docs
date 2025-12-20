---
title: Delete Artifact API | plugNmeet API reference
description: API endpoint documentation for deleting a meeting artifact file.
keywords: [api, artifact, delete, remove artifact]
sidebar_position: 4
sidebar_label: Delete
---

# Delete Artifact

Endpoint: `/artifact/delete`

This endpoint allows you to delete an artifact file from the server's filesystem.

:::info[Which Artifacts Are Deletable?]
This endpoint is only for deleting the physical files associated with certain artifact types (e.g., `MEETING_SUMMARY`, `SPEECH_TRANSCRIPTION`). It does not apply to metadata-only artifacts.
:::

:::info[Data Retention]
This action deletes the artifact **file** (e.g., the VTT or summary text file) to save storage space. The associated **metadata** about the artifact (e.g., its ID, type, and usage stats) is retained in the database for historical and auditing purposes.
:::

## Request Parameters

| Field       | Type   | Required | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| artifact_id | string | Yes      | The unique identifier of the artifact. |

## Response

| Field  | Type    | Description                              |
| :----- | :------ | ---------------------------------------- |
| status | boolean | Indicates if the request was successful. |
| msg    | string  | Response message.                        |
