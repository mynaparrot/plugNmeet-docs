---
title: API para Obtener Artefactos | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener una lista de artefactos de una reunión, como resúmenes y transcripciones generados por IA.
keywords: [api, artefacto, obtener, listar artefactos, resumen, transcripción]
sidebar_position: 1
sidebar_label: Obtener Artefactos
---

# Obtener Artefactos

Punto final: `/artifact/fetch`

Este punto final le permite recuperar una lista paginada de todos los artefactos de reunión generados. Puede filtrar los resultados por sala, sesión o tipo de artefacto.

## Parámetros de la Solicitud

| Campo      | Tipo             | Requerido | Descripción                                                                                                                                                             |
| ---------- | ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| room_ids   | array de cadenas | No       | Un array de uno o más `room_id` para filtrar los resultados.                                                                                                               |
| room_sid   | string           | No       | Filtrar artefactos de una sesión de sala específica proporcionando su `sid`.                                                                                                   |
| type       | cadena o número | No       | Filtrar por un tipo de artefacto específico. Puede usar el nombre del tipo (p. ej., `MEETING_ANALYTICS`) o su valor entero correspondiente. Consulte la sección de Tipos de Artefactos a continuación. |
| from       | number           | No       | El desplazamiento inicial para la paginación. Predeterminado: `0`.                                                                                                                       |
| limit      | number           | No       | El número máximo de artefactos a devolver. Predeterminado: `20`, Máximo: `100`.                                                                                               |
| order_by   | string           | No       | El orden de clasificación de los resultados. Puede ser `ASC` o `DESC`. Predeterminado: `DESC`.                                                                                                |

## Respuesta

| Campo  | Tipo              | Descripción                                |
| :----- |-------------------| ------------------------------------------ |
| status | boolean           | Indica si la solicitud fue exitosa.   |
| msg    | string            | Mensaje de respuesta.                          |
| result | [Resultado](#resultado) | El objeto que contiene la lista de artefactos. |

### Resultado

| Campo           | Tipo                  | Descripción                                                                                             |
| --------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| total_artifacts | number                | El número total de artefactos que coinciden con la consulta.                                                       |
| from            | number                | El desplazamiento de paginación del conjunto de resultados actual.                                                        |
| limit           | number                | El límite de paginación del conjunto de resultados actual.                                                         |
| order_by        | string                | El orden de clasificación del conjunto de resultados.                                                                    |
| type            | string                | El tipo de artefacto por el que se ha filtrado.                                                                |
| artifacts_list  | array de ArtifactInfo | La lista de objetos de artefacto. Consulte la página **[Obtener Información de un Artefacto](./artifact-info)** para ver la estructura detallada del objeto `ArtifactInfo`. |

## Tipos de Artefactos

El campo `type` identifica la clase de artefacto. Al filtrar, puede utilizar tanto el nombre del tipo (p. ej., `MEETING_ANALYTICS`) como su valor entero correspondiente.

Algunos ejemplos comunes incluyen:
*   `MEETING_SUMMARY`
*   `SPEECH_TRANSCRIPTION`
*   `MEETING_ANALYTICS`
*   `MEETING_SUMMARY_USAGE`

Para obtener una lista completa y actualizada de todos los tipos de artefactos disponibles, consulte el archivo oficial [**`plugnmeet_room_artifacts.proto`**](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_room_artifacts.proto).
