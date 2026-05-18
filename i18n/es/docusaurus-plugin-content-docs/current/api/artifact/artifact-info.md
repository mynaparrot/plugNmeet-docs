---
title: API para Obtener Información de un Artefacto | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener información sobre un único artefacto de una reunión.
keywords: [api, artefacto, información de artefacto, obtener artefacto]
sidebar_position: 2
sidebar_label: Información del Artefacto
---

# Obtener Información de un Artefacto

Punto final: `/artifact/info`

Este punto final le permite recuperar información sobre un único artefacto utilizando su `artifact_id` único.

## Parámetros de la Solicitud

| Campo       | Tipo   | Requerido | Descripción                            |
| ----------- | ------ | -------- | -------------------------------------- |
| artifact_id | string | Sí      | El identificador único del artefacto. |

## Respuesta

| Campo         | Tipo         | Descripción                                        |
| :------------ |:-------------| -------------------------------------------------- |
| status        | boolean      | Indica si la solicitud fue exitosa.           |
| msg           | string       | Mensaje de respuesta.                                  |
| status_code | number  | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
| artifact_info | ArtifactInfo | Detalles sobre el artefacto solicitado.              |
| room_info     | PastRoomInfo | Detalles sobre la sesión de la sala a la que pertenece este artefacto. |

### ArtifactInfo

| Campo       | Tipo               | Descripción                                                     |
| ----------- | ------------------ | --------------------------------------------------------------- |
| artifact_id | string             | El identificador único para este artefacto.                        |
| room_id     | string             | El ID de la sala a la que pertenece este artefacto.                    |
| type        | string             | El tipo del artefacto. Consulte [Tipos de Artefactos](./fetch#tipos-de-artefactos). |
| created     | string             | La fecha y hora de creación del artefacto.                         |
| metadata    | RoomArtifactMetadata | Metadatos adicionales sobre el artefacto, que varían según el tipo.   |

### RoomArtifactMetadata

Este objeto contiene metadatos específicos del tipo de artefacto. Por ejemplo, para un artefacto de tipo `MEETING_SUMMARY_USAGE`, podría contener información sobre `token_usage` y `cost`. La estructura exacta depende del tipo de artefacto.
