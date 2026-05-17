---
title: API para Finalizar una Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para finalizar de forma forzada una sala de videoconferencia activa y desconectar a todos los participantes.
keywords: [api, finalizar sala, cerrar sala, terminar reunión, api de sala, punto final]
sidebar_position: 8
sidebar_label: Finalizar
---

# Finalizar una Sala

Punto final: `/room/endRoom`

| Campo   | Tipo   | Posición | Requerido | Descripción |
| ------- | ------ | -------- | :------- | ----------- |
| room_id | string | raíz     | Sí      | El ID de la sala.     |

**Ejemplo**:

```json
{
  "room_id": "sala01"
}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | raíz     | El estado de la solicitud. |
| msg    | string  | raíz     | Mensaje de respuesta.          |
| status_code | number | raíz     | Respuesta [código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
