---
title: API para Transmitir a la Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para transmitir mensajes o notificaciones a una sala de videoconferencia en vivo. Aprenda a enviar mensajes de chat públicos o privados y notificaciones del sistema.
keywords: [api, transmitir, mensaje, notificación, api de chat, api de video, punto final]
sidebar_position: 6
sidebar_label: Transmitir a la Sala
---

# Transmitir a la Sala

Punto final: `/room/broadcastToRoom`

Esta potente API permite a su servidor backend inyectar mensajes o notificaciones directamente en una sesión activa de Plug-N-Meet en tiempo real. Puede usarla para enviar anuncios a todo el sistema, entregar mensajes privados a usuarios específicos o activar notificaciones personalizadas desde la lógica de su aplicación.

Este punto final es ideal para construir integraciones que requieren comunicación de servidor a cliente, tales como:
*   Enviar alertas basadas en eventos externos.
*   Entregar mensajes o instrucciones automatizadas a los participantes.
*   Crear sistemas de notificación privados y personalizados dentro de su aplicación.

## Parámetros de la Solicitud

La solicitud debe contener un objeto `chat_msg` o `notification_msg`.

| Campo            | Tipo    | Requerido | Descripción                                                                                             |
| ---------------- | ------- | --------- | ------------------------------------------------------------------------------------------------------- |
| room_id          | string  | Sí        | El identificador único de la sala activa a la que desea transmitir.                                     |
| only_to_admins   | boolean | No        | Si es `true`, el mensaje se enviará a todos los participantes con privilegios de administrador/moderador. |
| to_user_id       | string  | No        | Si se proporciona, el mensaje se enviará al usuario especificado.                                       |
| chat_msg         | object  | No        | Un objeto de [mensaje de chat](#chatmessage) para ser enviado.                                          |
| notification_msg | object  | No        | Un objeto de [mensaje de notificación](#notificationmsg) para ser mostrado.                             |

### Lógica de Destinatarios

La entrega del mensaje está determinada por los campos `only_to_admins` y `to_user_id`:
-   Si **ninguno** de los campos está configurado, el mensaje se envía a **todos** en la sala.
-   Si `only_to_admins` es `true`, el mensaje se envía a **todos los administradores**.
-   Si se proporciona `to_user_id`, el mensaje se envía a ese **usuario específico**.
-   Si se proporcionan **ambos**, `only_to_admins` y `to_user_id`, el mensaje se envía a **todos los administradores Y al usuario específico**.

### ChatMessage

Este objeto representa un mensaje que aparecerá en el panel de chat de la sala.

| Campo   | Tipo   | Requerido | Descripción                      |
| ------- | ------ | --------- | -------------------------------- |
| message | string | Sí        | El contenido del mensaje de chat. |

### NotificationMsg

Este objeto representa una notificación a nivel de sistema que aparecerá en la pantalla del usuario.

| Campo      | Tipo                                                                                                                           | Requerido | Descripción                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- | --------------------------------------------------------------------------- |
| text       | string                                                                                                                         | Sí        | El contenido de texto de la notificación.                                   |
| type       | [NatsSystemNotificationTypes](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_nats_msg.proto#L142) | No        | El estilo de la notificación. `0 = info`; `1 = warning`; `3 = error`       |
| with_sound | boolean                                                                                                                        | No        | Si es `true`, la notificación reproducirá un sonido para el destinatario.   |

## Ejemplo

### Ejemplo 1: Enviar un Mensaje de Chat Público a Todos

```json
{
  "room_id": "sala01",
  "chat_msg": {
    "message": "Hola a todos, el seminario web comenzará en 5 minutos."
  }
}
```

### Ejemplo 2: Enviar una Notificación Privada a un Usuario Específico

```json
{
  "room_id": "sala01",
  "to_user_id": "usuario-456",
  "notification_msg": {
    "text": "Su documento privado está listo para su revisión.",
    "type": 0
  }
}
```

### Ejemplo 3: Enviar una Notificación a Todos los Administradores y a un Usuario Específico

```json
{
  "room_id": "sala01",
  "only_to_admins": true,
  "to_user_id": "usuario-vip-789",
  "notification_msg": {
    "text": "Un VIP acaba de unirse a la sala de espera.",
    "type": 1,
    "with_sound": true
  }
}
```

## Respuesta

| Campo       | Tipo    | Descripción                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indica si la solicitud fue exitosa.      |
| msg         | string  | Mensaje de respuesta.                    |
| status_code | number  | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
