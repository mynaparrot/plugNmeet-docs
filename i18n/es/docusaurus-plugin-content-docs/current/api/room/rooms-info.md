---
title: API para Obtener Información de Todas las Salas Activas | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener información detallada y metadatos sobre todas las salas de videoconferencia activas.
keywords: [api, obtener información de la sala, obtener sala, detalles de la sala, api de sala, punto final]
sidebar_position: 5
sidebar_label: Información de Salas Activas
---

# Obtener Información de Todas las Salas Activas

Punto final: `/room/getActiveRoomsInfo`

Este punto final proporciona una descripción general completa de todas las salas actualmente activas en el servidor. Devuelve un array de objetos de sala, cada uno con la misma información detallada que el punto final `/room/getActiveRoomInfo`, incluidas las listas de participantes y los metadatos de la sala.

Esta es una herramienta poderosa para el monitoreo y la administración de todo el servidor. Es ideal para crear un panel de control en tiempo real que muestre todas las reuniones en curso, el número de participantes en cada una y otros detalles de la sesión.

**Ejemplo de Solicitud**:

```json
{}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción                                                                               |
| :----- | ------- | -------- | :---------------------------------------------------------------------------------------- |
| status | boolean | raíz     | El estado de la solicitud.                                                                 |
| msg    | string  | raíz     | Mensaje de respuesta.                                                                          |
| status_code | string | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
| rooms  | array\<[sala](./room-info#sala)>   | raíz     | Un array de objetos de Sala. |
