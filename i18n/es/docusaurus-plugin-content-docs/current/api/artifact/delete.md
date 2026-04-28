---
title: API para Eliminar Artefacto | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para eliminar un archivo de artefacto de reunión.
keywords: [api, artefacto, eliminar, quitar artefacto]
sidebar_position: 4
sidebar_label: Eliminar
---

# Eliminar Artefacto

Punto final: `/artifact/delete`

Este punto final le permite eliminar un archivo de artefacto del sistema de archivos del servidor.

:::info[¿Qué Artefactos son Eliminables?]
Este punto final es solo para eliminar los archivos físicos asociados con ciertos tipos de artefactos (p. ej., `MEETING_SUMMARY`, `SPEECH_TRANSCRIPTION`). No se aplica a los artefactos que solo contienen metadatos.
:::

:::info[Retención de Datos]
Esta acción elimina el **archivo** del artefacto (p. ej., el archivo de texto VTT o de resumen) para ahorrar espacio de almacenamiento. Los **metadatos** asociados sobre el artefacto (p. ej., su ID, tipo y estadísticas de uso) se conservan en la base de datos para fines históricos y de auditoría.
:::

## Parámetros de Solicitud

| Campo       | Tipo   | Requerido | Descripción                            |
| ----------- | ------ | -------- | -------------------------------------- |
| artifact_id | string | Sí      | El identificador único del artefacto. |

## Respuesta

| Campo  | Tipo    | Descripción                              |
| :----- | :------ | ---------------------------------------- |
| status | boolean | Indica si la solicitud fue exitosa. |
| msg    | string  | Mensaje de respuesta.                        |
