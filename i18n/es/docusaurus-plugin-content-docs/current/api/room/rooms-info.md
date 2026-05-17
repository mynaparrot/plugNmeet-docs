---
title: API para Obtener Información de Todas las Salas Activas | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener información detallada y metadatos sobre todas las salas de videoconferencia activas.
keywords: [api, obtener información de la sala, obtener sala, detalles de la sala, api de sala, punto final]
sidebar_position: 5
sidebar_label: Información de Salas Activas
---

# Obtener Información de Todas las Salas Activas

Punto final: `/room/getActiveRoomsInfo`

**Ejemplo de Solicitud**:

```json
{}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción                                                                               |
| :----- | ------- | -------- | :---------------------------------------------------------------------------------------- |
| status | boolean | raíz     | El estado de la solicitud.                                                                 |
| msg    | string  | raíz     | Mensaje de respuesta.                                                                          |
| status_code | number | raíz     | Respuesta [código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| rooms  | array\<[sala](./room-info#sala)>   | raíz     | Un array de objetos de Sala. |
