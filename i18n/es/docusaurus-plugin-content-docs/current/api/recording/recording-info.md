---
title: API de Información de Grabación | Referencia de la API de plugNmeet
description: Documentación del endpoint de la API para obtener información detallada sobre una grabación específica, incluyendo su tamaño, duración y enlace de descarga.
keywords: [api, obtener información de grabación, detalles de grabación, api de grabación, endpoint]
sidebar_position: 2
sidebar_label: Información de la Grabación
---

# Información de la grabación

Endpoint: `/recording/info`

Este punto final recupera todos los metadatos y detalles asociados con una grabación específica. Al proporcionar un `record_id`, puede obtener información completa sobre la grabación, incluido el tamaño del archivo, la hora de creación y los detalles de la sala asociada.

Esto es útil para mostrar información detallada sobre una grabación en la interfaz de su aplicación, como en una página de reproducción de grabación dedicada.

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
| status_code | number | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
| [recording_info](/docs/api/recording/fetch#información-de-la-grabación)     | object\<[Recording Info](/docs/api/recording/fetch#información-de-la-grabación)> | raíz     | Información detallada de la grabación |
| [room_info](/docs/api/room/fetch-past#información-de-sala-anterior)          | object\<[past-room-info](/docs/api/room/fetch-past#información-de-sala-anterior)> | raíz     | Información de la sala anterior |
