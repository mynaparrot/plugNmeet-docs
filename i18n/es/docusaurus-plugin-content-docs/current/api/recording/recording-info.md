---
title: API de Información de Grabación | Referencia de la API de plugNmeet
description: Documentación del endpoint de la API para obtener información detallada sobre una grabación específica, incluyendo su tamaño, duración y enlace de descarga.
keywords: [api, obtener información de grabación, detalles de grabación, api de grabación, endpoint]
sidebar_position: 2
sidebar_label: Información de la Grabación
---

# Información de la grabación

Endpoint: `/recording/info`

| Campo     | Tipo   | Ubicación | Requerido | Descripción                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | raíz     | Sí      | El ID de la grabación de la cual desea obtener los detalles. |

**Ejemplo**:

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Respuesta

| Campo                                                          | Tipo    | Ubicación | Descripción               |
|:---------------------------------------------------------------| ------- | -------- | :------------------------ |
| status                                                         | boolean | raíz     | El estado de la solicitud |
| msg                                                            | string  | raíz     | Mensaje de la respuesta   |
| [recording_info](/docs/api/recording/fetch#información-de-la-grabación)     | object\<[Recording Info](/docs/api/recording/fetch#información-de-la-grabación)> | raíz     | Información detallada de la grabación |
| [room_info](/docs/api/room/fetch-past#información-de-sala-anterior)          | object\<[past-room-info](/docs/api/room/fetch-past#información-de-sala-anterior)> | raíz     | Información de la sala anterior |
