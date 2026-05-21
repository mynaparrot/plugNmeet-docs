---
title: API para Finalizar una Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para finalizar de forma forzada una sala de videoconferencia activa y desconectar a todos los participantes.
keywords: [api, finalizar sala, cerrar sala, terminar reunión, api de sala, punto final]
sidebar_position: 9
sidebar_label: Finalizar
---

# Finalizar una Sala

Punto final: `/room/endRoom`

Este punto final le permite terminar de forma forzada una sesión de sala en vivo. Cuando llama a esta API con un `room_id`, la sesión se cierra inmediatamente y todos los participantes son desconectados.

Esta es una acción administrativa del lado del servidor, típicamente utilizada para moderar sesiones o para asegurar que una reunión ha concluido definitivamente. Por ejemplo, podría integrar esto en un botón "Finalizar Reunión para Todos" en el panel de administración de su aplicación. Una vez que se finaliza una sala, sus datos se borran y se puede volver a crear para una nueva sesión.

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
| status_code | string | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
