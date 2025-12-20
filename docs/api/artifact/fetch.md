---
title: Fetch Artifacts API | plugNmeet API Reference
description: API endpoint documentation for fetching a list of meeting artifacts, such as AI-generated summaries and transcriptions.
keywords: [api, artifact, fetch, list artifacts, summary, transcription]
sidebar_position: 1
sidebar_label: Fetch
---

# Fetch Artifacts

Endpoint: `/artifact/fetch`

This endpoint allows you to retrieve a paginated list of all generated meeting artifacts. You can filter the results by room, session, or artifact type.

## Request Parameters

| Field      | Type             | Required | Description                                                                                                                                                             |
| ---------- | ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| room_ids   | array of strings | No       | An array of one or more `room_id`s to filter the results.                                                                                                               |
| room_sid   | string           | No       | Filter artifacts from a specific room session by providing its `sid`.                                                                                                   |
| type       | string or number | No       | Filter by a specific artifact type. You can use either the string name (e.g., `MEETING_ANALYTICS`) or its corresponding integer value. See Artifact Types below. |
| from       | number           | No       | The starting offset for pagination. Default: `0`.                                                                                                                       |
| limit      | number           | No       | The maximum number of artifacts to return. Default: `20`, Maximum: `100`.                                                                                               |
| order_by   | string           | No       | The sort order for the results. Can be `ASC` or `DESC`. Default: `DESC`.                                                                                                |

## Response

| Field  | Type              | Description                                |
| :----- |-------------------| ------------------------------------------ |
| status | boolean           | Indicates if the request was successful.   |
| msg    | string            | Response message.                          |
| result | [Result](#result) | The object containing the list of artifacts. |

### Result

| Field           | Type                  | Description                                                                                             |
| --------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| total_artifacts | number                | The total number of artifacts matching the query.                                                       |
| from            | number                | The pagination offset of the current result set.                                                        |
| limit           | number                | The pagination limit of the current result set.                                                         |
| order_by        | string                | The sorting order of the result set.                                                                    |
| type            | string                | The artifact type that was filtered for.                                                                |
| artifacts_list  | array of ArtifactInfo | The list of artifact objects. See the **[Get Artifact Info](./artifact-info)** page for the detailed structure of the `ArtifactInfo` object. |

## Artifact Types

The `type` field identifies the kind of artifact. You can use either the string name (e.g., `MEETING_ANALYTICS`) or its corresponding integer value when filtering.

A few common examples include:
*   `MEETING_SUMMARY`
*   `SPEECH_TRANSCRIPTION`
*   `MEETING_ANALYTICS`
*   `MEETING_SUMMARY_USAGE`

For a complete and up-to-date list of all available artifact types, please refer to the official [**`plugnmeet_room_artifacts.proto`**](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_room_artifacts.proto) file.
