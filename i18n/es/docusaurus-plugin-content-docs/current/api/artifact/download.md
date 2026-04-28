---
title: API para Descargar Artefacto | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para generar un token de descarga para un artefacto de reunión.
keywords: [api, artefacto, descargar, obtener token, token de descarga]
sidebar_position: 3
sidebar_label: Descargar
---

# Obtener Token de Descarga

Punto final: `/artifact/getDownloadToken`

Este punto final genera un token seguro de un solo uso que se puede utilizar para descargar un archivo de artefacto.

:::info[¿Qué Artefactos son Descargables?]
Este punto final es solo para tipos de artefactos que representan un archivo físico, como `MEETING_SUMMARY` o `SPEECH_TRANSCRIPTION`. No funcionará para artefactos que solo contienen metadatos como `MEETING_SUMMARY_USAGE`.
:::

## Parámetros de Solicitud

| Campo       | Tipo   | Requerido | Descripción                            |
| ----------- | ------ | -------- | -------------------------------------- |
| artifact_id | string | Sí      | El identificador único del artefacto. |

## Respuesta

| Campo  | Tipo   | Descripción                      |
| :----- | :----- | -------------------------------- |
| status | boolean| Indica si la solicitud fue exitosa. |
| msg    | string | Mensaje de respuesta.                |
| token  | string | El token de descarga de un solo uso.   |

Después de recibir el token, puede proporcionar la siguiente URL de descarga a su usuario:
`https://Su-Servidor-Plug-N-Meet.com/download/artifact/EL_TOKEN_AQUÍ`
