---
title: Get Artifact Info API | plugNmeet API Reference
description: API endpoint documentation for fetching information about a single meeting artifact.
keywords: [api, artifact, artifact info, get artifact]
sidebar_position: 2
sidebar_label: Info
---

# Get Artifact Info

Endpoint: `/artifact/info`

This endpoint allows you to retrieve information about a single artifact using its unique `artifact_id`.

## Request Parameters

| Field       | Type   | Required | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| artifact_id | string | Yes      | The unique identifier of the artifact. |

## Response

| Field         | Type         | Description                                         |
| :------------ | :----------- | --------------------------------------------------- |
| status        | boolean      | Indicates if the request was successful.            |
| msg           | string       | Response message.                                   |
| artifact_info | ArtifactInfo | Details about the requested artifact.               |
| room_info     | PastRoomInfo | Details about the room session this artifact belongs to. |

### ArtifactInfo

| Field       | Type               | Description                                                     |
| ----------- | ------------------ | --------------------------------------------------------------- |
| artifact_id | string             | The unique identifier for this artifact.                        |
| room_id     | string             | The ID of the room this artifact belongs to.                    |
| type        | string             | The type of the artifact. See [Artifact Types](./fetch.md#artifact-types). |
| created     | string             | The creation timestamp of the artifact.                         |
| metadata    | RoomArtifactMetadata | Additional metadata about the artifact, which varies by type.   |

### RoomArtifactMetadata

This object contains metadata specific to the artifact's type. For example, for a `MEETING_SUMMARY_USAGE` artifact, it might contain `token_usage` and `cost` information. The exact structure depends on the artifact type.
