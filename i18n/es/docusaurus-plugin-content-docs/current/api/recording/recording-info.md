---
title: API para Obtener Información de Grabación | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener información detallada sobre una grabación específica, incluyendo su tamaño, duración y enlace de descarga.
keywords: [api, obtener información de grabación, detalles de grabación, api de grabación, punto final]
sidebar_position: 2
sidebar_label: Información de la Grabación
---

# Información de la grabación

Punto final: `/recording/info`

| Campo     | Tipo   | Posición | Requerido | Descripción                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | raíz     | Sí      | ID de la grabación de la que desea obtener detalles |

**Ejemplo**:

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Response

| Field                                                          | Type    | Position | Description               |
|:---------------------------------------------------------------| ------- | -------- | :------------------------ |
| status                                                         | boolean | raíz     | El estado de la solicitud |
| msg                                                            | string  | raíz     | Mensaje de respuesta          |
| [recording_info](/docs/api/recording/fetch#información-de-la-grabación)     | obect\<[Recording Info](/docs/api/recording/fetch#información-de-la-grabación)> | raíz     | Mensaje de respuesta          |
| [room_info](/docs/api/room/fetch-past#información-de-sala-anterior)          | obect\<[past-room-info](/docs/api/room/fetch-past#información-de-sala-anterior)> | raíz     | Mensaje de respuesta          |
