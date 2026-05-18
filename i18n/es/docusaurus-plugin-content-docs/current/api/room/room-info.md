---
title: API para Obtener Información de una Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener información detallada sobre una sala de videoconferencia específica que se encuentre activa.
keywords: [api, obtener información de sala, detalles de sala, sala activa, api de sala, punto final]
sidebar_position: 4
sidebar_label: Información de la Sala
---

# Obtener Información de una Sala Activa

Punto final: `/room/getActiveRoomInfo`

Este punto final recupera información detallada y en tiempo real sobre una sala activa específica. Mientras que `isRoomActive` simplemente le indica si una sala está en funcionamiento, esta API proporciona una instantánea completa de la sesión, incluido su estado actual, una lista de todos los participantes y sus detalles individuales.

Esto es útil para crear paneles de administración o herramientas de moderación donde necesite monitorear reuniones en vivo. Puede ver quién está en la sala, cuándo se unieron y otros metadatos asociados tanto con la sala como con los participantes.

## Parámetros de la Solicitud

| Campo   | Tipo   | Posición | Requerido | Descripción           |
| ------- | ------ | -------- | :------- | --------------------- |
| room_id | string | raíz     | Sí      | El ID único de la sala. |

**Ejemplo de Solicitud:**

```json
{
  "room_id": "sala01"
}
```

## Respuesta

| Campo   | Tipo                  | Posición | Descripción               |
| ------- | --------------------- | -------- | ------------------------- |
| status  | boolean               | raíz     | Indica si la solicitud fue exitosa. |
| msg     | string                | raíz     | Mensaje de respuesta.         |
| status_code | number | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
| room    | object\<[Sala](#sala)>| raíz     | Contiene los detalles de la sala.    |

### Sala

| Campo                | Tipo                                         | Descripción                       |
| -------------------- | -------------------------------------------- | --------------------------------- |
| room_info            | object\<[Información de la Sala](#información-de-la-sala)>             | Detalles sobre la sala.           |
| participants_info    | array\<[Información del Participante](#información-del-participante)>| Lista de los participantes actuales.     |

### Información de la Sala

| Campo               | Tipo    | Descripción                                 |
| ------------------- | ------- | ------------------------------------------- |
| room_title          | string  | Título de la reunión.                       |
| room_id             | string  | ID único de la sala.                             |
| sid                 | string  | ID de sesión único de la sala (SID).                                   |
| joined_participants | number  | Número total de usuarios que se han unido.      |
| is_running          | boolean | Indica si la sala se encuentra actualmente activa.  |
| is_recording        | boolean | Indica si la grabación está en curso.      |
| is_active_rtmp      | boolean | Indica si la transmisión RTMP está activa.      |
| creation_time       | number  | Fecha y hora de creación de la sala (marca de tiempo Unix).        |
| metadata            | string  | Metadatos de la sala.                              |
| webhook_url         | string  | URL del webhook asociada a la sala.       |

### Información del Participante

| Campo      | Tipo    | Descripción                                 |
| ---------- | ------- | ------------------------------------------- |
| sid        | string  | ID de sesión único del participante (SID).                            |
| identity   | string  | ID de usuario del participante.                        |
| name       | string  | Nombre del participante.                           |
| state      | string  | Estado del participante.                          |
| metadata   | string  | Metadatos del participante.                       |
| joined_at  | number  | Fecha y hora en que se unió el participante (marca de tiempo Unix).|
| version    | number  | Información de la versión.
