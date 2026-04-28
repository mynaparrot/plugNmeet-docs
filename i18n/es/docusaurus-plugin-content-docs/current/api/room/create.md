---
title: API para Crear Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para crear una nueva sala de videoconferencia. Aprenda sobre los parámetros requeridos como room_id, nombres de participantes y configuraciones personalizadas.
keywords: [api, crear sala, nueva sala, generar sala, api de sala, api de video, punto final]
sidebar_position: 1
sidebar_label: Crear
---

# Crear Sala

Punto final: `/room/create`

Antes de crear su primera sala, es útil entender cómo funcionan las salas en Plug-N-Meet. Piense en una sala no como un espacio permanente, sino como una **sesión en vivo temporal**.

Este es el ciclo de vida típico:
1.  Usted crea una sala usando este punto final de la API.
2.  Usted genera tokens de acceso para que los usuarios se unan a la sesión.
3.  La sesión permanece activa mientras haya participantes presentes.
4.  La sesión termina automáticamente cuando el último participante se va o puede ser terminada mediante una llamada a la API.

Una vez que una sesión ha terminado, la sala se finaliza y todos los datos asociados (como mensajes de chat y listas de usuarios) se borran. Esto asegura que cada nueva sesión comience de nuevo.

> **Consejo Profesional: Simulando Salas Permanentes**
>
> Si desea crear la experiencia de una sala "permanente" a la que los usuarios pueden unirse en cualquier momento, puede construir esta lógica en su aplicación.
>
> Cuando un usuario intenta unirse, su aplicación debería:
> 1.  Verificar si ya existe una sesión activa para ese `room_id` (p. ej., usando la API `isRoomActive`).
> 2.  Si no existe ninguna sesión, llamar a este punto final `create` para iniciar una nueva.
> 3.  Finalmente, generar un token de acceso para permitir que el usuario se una.
>
> Este enfoque le da la flexibilidad de tener salas de tipo persistente mientras aprovecha el modelo de sesión temporal de Plug-N-Meet.

## Parámetros de Solicitud

| Campo                 | Tipo   | Requerido | Descripción                                                                            |
| --------------------- | ------ | -------- |----------------------------------------------------------------------------------------|
| room_id               | string | Sí       | Un identificador único para la sala. Dado que las salas son temporales, puede reutilizar un `room_id` después de que una sesión haya finalizado. |
| max_participants      | number | No       | El número máximo de participantes permitidos en la sala.                                |
| empty_timeout         | number | No       | El número de segundos que la sala permanecerá activa después de su creación si nadie se une.      |
| [metadata](#metadatos) | object | Sí       | Detalles adicionales de configuración de la sala.                                                 |

### Metadatos

| Campo                                           | Tipo                | Requerido | Descripción                                                                                      |
| ----------------------------------------------- |---------------------| -------- | ------------------------------------------------------------------------------------------------ |
| room_title                                      | string              | Sí       | El título de la sala o reunión.                                                                |
| welcome_message                                 | string              | No       | Un mensaje que se muestra a los participantes cuando se unen.                                              |
| webhook_url                                     | string              | No       | URL para recibir eventos de webhook de Plug-N-Meet.                                                  |
| logout_url                                      | string              | No       | URL para redirigir a los usuarios después de que termine la reunión o sesión.                                         |
| [room_features](#características-de-la-sala)                 | object              | Sí       | Configuraciones para habilitar o deshabilitar varias características de la sala.                                             |
| [default_lock_settings](#configuraciones-de-bloqueo-predeterminadas) | object              | No       | Configuraciones predeterminadas para bloquear características específicas para los usuarios.                                            |
| [copyright_conf](#configuración-de-copyright)             | object              | No       | Configuración de copyright.                                                                         |
| extra_data                                      | map | No       | Un mapa de pares clave-valor personalizados. Tanto las claves como los valores deben ser cadenas. p. ej. `{"key": "value"}`|.                                                           |

### Características de la Sala

| Campo                                                                | Tipo    | Requerido | Descripción                                                                                            |
| -------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ |
| allow_webcams                                                        | boolean | Sí       | Habilitar o deshabilitar el soporte para webcams.                                                                      |
| mute_on_start                                                        | boolean | Sí       | Silenciar automáticamente los micrófonos cuando los participantes se unen.                                                 |
| allow_screen_share                                                   | boolean | Sí       | Habilitar o deshabilitar la compartición de pantalla.                                                                      |
| allow_rtmp                                                           | boolean | Sí       | Habilitar o deshabilitar la transmisión RTMP.                                                                      |
| admin_only_webcams                                                   | boolean | Sí       | Permitir el acceso a la webcam solo para administradores.                                                                   |
| allow_view_other_webcams                                             | boolean | Sí       | Permitir que los participantes vean las webcams de los demás. Si es `false`, solo los moderadores pueden ver todas las webcams. |
| allow_view_other_users_list                                          | boolean | Sí       | Restringir la visualización de la lista de usuarios solo a los moderadores.                                                  |
| enable_analytics                                                     | boolean | No       | Habilitar o deshabilitar los informes de análisis para la sesión. Predeterminado: false                                  |
| allow_virtual_bg                                                     | boolean | No       | Habilitar o deshabilitar las opciones de fondo virtual.                                                          |
| allow_raise_hand                                                     | boolean | No       | Habilitar o deshabilitar la función "levantar la mano".                                                            |
| auto_gen_user_id                                                     | boolean | No       | PlugNmeet requiere un `userId` único para cada participante. Habilite esto si prefiere no gestionar los `userId`s o necesita permitir que el mismo usuario se una desde múltiples dispositivos. Cuando es `true`, PlugNmeet genera un `user_id` único para cada sesión. Cualquier `user_id` que proporcione se almacenará como `ex_user_id`, recuperable a través de la API `getActiveRoomInfo`. Predeterminado: `false` |
| room_duration                                                        | number  | No       | Establecer una duración fija para la sala en minutos. 0 significa ilimitado.                                       |
| [recording_features](#características-de-grabación)                            | object  | Sí       | Configuraciones de grabación.                                                                                    |
| [chat_features](#características-del-chat)                                      | object  | Sí       | Configuraciones del chat.                                                                                         |
| [shared_note_pad_features](#características-del-bloc-de-notas-compartido)                | object  | Sí       | Configuraciones del bloc de notas compartido.                                                                               |
| [whiteboard_features](#características-de-la-pizarra)                          | object  | Sí       | Configuraciones de la pizarra.                                                                                   |
| [external_media_player_features](#características-del-reproductor-multimedia-externo)    | object  | Sí       | Configuraciones del reproductor multimedia externo.                                                                        |
| [waiting_room_features](#características-de-la-sala-de-espera)                      | object  | Sí       | Configuraciones de la sala de espera.                                                                                 |
| [breakout_room_features](#características-de-las-salas-para-grupos)                    | object  | Sí       | Configuraciones de las salas para grupos.                                                                                |
| [display_external_link_features](#características-de-visualización-de-enlaces-externos)    | object  | Sí       | Configuraciones para mostrar enlaces externos.                                                                |
| [ingress_features](#características-de-ingesta)                                | object  | No       | Configuraciones de ingesta RTMP.                                                                                 |
| [polls_features](#características-de-encuestas)                                    | object  | No       | Configuraciones de encuestas.                                                                                        |
| [insights_features](#características-de-insights)                              | object  | No       | Configuraciones de insights, transcripción y traducción impulsadas por IA.                                          |
| [sip_dial_in_features](#características-de-marcado-de-entrada-sip)                        | object  | No       | Configuraciones de marcado de entrada SIP.                                                                                  |
| [end_to_end_encryption_features](#características-de-cifrado-de-extremo-a-extremo-e2ee) | object  | No       | Configuraciones de Cifrado de Extremo a Extremo (E2EE).                                                                 |

### Características de Grabación

| Campo                       | Tipo    | Requerido | Descripción                                                                           |
| --------------------------- | ------- | -------- | ------------------------------------------------------------------------------------- |
| is_allow                    | boolean | Sí       | Habilitar o deshabilitar la grabación para la reunión.                                          |
| is_allow_cloud              | boolean | Sí       | Habilitar o deshabilitar la grabación en la nube.                                                    |
| is_allow_local              | boolean | Sí       | Habilitar o deshabilitar la grabación local.                                                    |
| enable_auto_cloud_recording | boolean | No       | Iniciar automáticamente la grabación en la nube cuando un moderador o administrador se une.                  |

### Características del Chat

| Campo               | Tipo    | Requerido | Descripción                             |
| ------------------- | ------- | -------- | --------------------------------------- |
| is_allow            | boolean | Sí       | Habilitar o deshabilitar el chat para la reunión. |
| is_allow_file_upload | boolean | Sí       | Habilitar o deshabilitar la carga de archivos en el chat. |

### Características del Bloc de Notas Compartido

| Campo    | Tipo    | Requerido | Descripción                                   |
| -------- | ------- | -------- | --------------------------------------------- |
| is_allow | boolean | Sí       | Habilitar o deshabilitar la función de bloc de notas compartido. |

### Características de la Pizarra

| Campo        | Tipo    | Requerido | Descripción                                                                                                   |
| ------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| is_allow     | boolean | Sí       | Habilitar o deshabilitar la función de pizarra.                                                                     |
| preload_file | string  | No       | Precargar un archivo de presentación remoto (http/https) para la pizarra. El archivo debe ser directamente accesible sin redirección. |

### Características del Reproductor Multimedia Externo

| Campo    | Tipo    | Requerido | Descripción                                                                              |
| -------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| is_allow | boolean | Sí       | Habilitar o deshabilitar la reproducción de video/audio de fuentes externas. Los moderadores también pueden subir medios locales. |

### Características de la Sala de Espera

| Campo     | Tipo    | Requerido | Descripción                                                                                                     |
| --------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| is_active | boolean | Sí       | Habilitar para activar la función de sala de espera. Los usuarios permanecen en la sala de espera hasta que un moderador les permite unirse. |

### Características de las Salas para Grupos

| Campo                | Tipo    | Requerido | Descripción                                                           |
| -------------------- | ------- | -------- | --------------------------------------------------------------------- |
| is_allow             | boolean | Sí       | Habilitar o deshabilitar las salas para grupos.                                     |
| allowed_number_rooms | number  | No       | Número máximo de salas para grupos que se pueden crear simultáneamente. Predeterminado: 6 |

### Características de Visualización de Enlaces Externos

| Campo    | Tipo    | Requerido | Descripción                                                                                                                                                                                                                                                                                       |
| -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is_allow | boolean | Sí       | Habilitar o deshabilitar la visualización de enlaces externos dentro de un iframe. Útil para mostrar sitios web, cuestionarios o juegos. **Nota:** El sitio externo debe permitir ser incrustado en un iframe. Los moderadores pueden pasar valores como `name`, `userId`, `role` y `meetingId` a la URL. |

### Características de Ingesta

| Campo    | Tipo    | Requerido | Descripción                                                                                                   |
| -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| is_allow | boolean | Sí       | Habilitar la ingesta de medios para transmitir contenido directamente a la sesión. Esto es útil para la transmisión profesional usando software como OBS Studio. Plug-N-Meet admite tanto RTMP como WHIP (Protocolo de Ingesta HTTP de WebRTC) para una transmisión de baja latencia. |

### Características de Encuestas

| Campo    | Tipo    | Requerido | Descripción                       |
| -------- | ------- | -------- | --------------------------------- |
| is_allow | boolean | Sí       | Habilitar o deshabilitar las características de las encuestas. |

### Características de Insights

:::note[Se Requiere Configuración del Servidor]
Para que cualquiera de estas características funcione, primero debe configurar la sección `insights` del archivo principal `config.yaml` de su servidor.

La configuración tiene una potente estructura de dos partes:
1.  Primero, define sus **cuentas de proveedor**, como `azure` o `google`, y agrega sus credenciales de API para cada una.
2.  Segundo, asigna cada **servicio** (p. ej., `transcription`, `ai_text_chat`) a una cuenta de proveedor específica.

Este diseño flexible le permite usar diferentes proveedores para diferentes tareas (p. ej., Azure para traducción y Google para chat con IA) e incluso seleccionar diferentes modelos para la optimización de costo-rendimiento (p. ej., un modelo potente para chat y uno más barato para resúmenes). Consulte la guía de configuración del servidor para obtener instrucciones detalladas de configuración.
:::

Este objeto controla todas las características impulsadas por IA proporcionadas por la Plataforma de Insights.

| Campo                                       | Tipo   | Requerido | Descripción                                           |
| ------------------------------------------- | ------ | -------- | ----------------------------------------------------- |
| is_allow                                    | boolean| Sí       | Habilitar o deshabilitar todas las características de la Plataforma de Insights.     |
| [transcription_features](#características-de-transcripción) | object | No       | Configuraciones para la conversión de voz a texto y la traducción hablada.   |
| [chat_translation_features](#características-de-traducción-de-chat) | object | No       | Configuraciones para la traducción del chat.                        |
| [ai_features](#características-de-ia)                 | object | No       | Configuraciones para las características de IA generativa.                  |

#### Características de Transcripción

| Campo                       | Tipo    | Requerido | Descripción                                                 |
| --------------------------- | ------- | -------- | ----------------------------------------------------------- |
| is_allow                    | boolean | Sí       | Habilitar o deshabilitar la transcripción en tiempo real.                  |
| is_allow_translation        | boolean | No       | Habilitar o deshabilitar la traducción de la transcripción.         |
| is_allow_speech_synthesis   | boolean | No       | Habilitar o deshabilitar las traducciones habladas (texto a voz).     |

#### Características de Traducción de Chat

| Campo    | Tipo    | Requerido | Descripción                                           |
| -------- | ------- | -------- | ----------------------------------------------------- |
| is_allow | boolean | Sí       | Habilitar o deshabilitar la traducción en tiempo real de los mensajes de chat. |

#### Características de IA

| Campo                                              | Tipo   | Requerido | Descripción                                |
| -------------------------------------------------- | ------ | -------- | ------------------------------------------ |
| is_allow                                           | boolean| Sí       | Habilitar o deshabilitar todas las características de IA generativa.  |
| [ai_text_chat_features](#características-del-chat-de-texto-con-ia)    | object | No       | Configuraciones para el Asistente de Chat con IA.        |
| [meeting_summarization_features](#características-de-resumen-de-reunión) | object | No       | Configuraciones para los resúmenes de reuniones impulsados por IA. |

##### Características del Chat de Texto con IA

| Campo    | Tipo    | Requerido | Descripción                          |
| -------- | ------- | -------- | ------------------------------------ |
| is_allow | boolean | Sí       | Habilitar o deshabilitar el Asistente de Chat con IA. |

##### Características de Resumen de Reunión

| Campo    | Tipo    | Requerido | Descripción                                      |
| -------- | ------- | -------- | ------------------------------------------------ |
| is_allow | boolean | Sí       | Habilitar o deshabilitar la generación de resúmenes de reuniones. |

### Características de Marcado de Entrada SIP

:::note[Se Requiere Configuración del Servidor]
Para que el marcado de entrada SIP funcione, primero debe configurar la sección `livekit_sip_info` del archivo principal `config.yaml` de su servidor. Esto implica configurar la puerta de enlace SIP (p. ej., `livekit/sip`) e integrarla con un proveedor de troncales SIP externo.

Consulte la guía de configuración del servidor y el [repositorio de GitHub de livekit/sip](https://github.com/livekit/sip) para obtener instrucciones detalladas de configuración.
:::

| Campo                      | Tipo    | Requerido | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| is_allow                   | boolean | Sí       | Habilitar o deshabilitar el marcado de entrada SIP para la sala.                                                                                                                                                                                                                                                                                                                                                                                    |
| enable_dial_in_on_create   | boolean | No       | Si es `true`, el servicio de marcado de entrada SIP se iniciará automáticamente cuando se cree la sala. Si es `false`, un moderador debe iniciarlo manualmente desde la reunión. Predeterminado: `false`.                                                                                                                                                                                                                                                |
| hide_phone_number          | boolean | No       | Si es `true`, el número de teléfono de marcado de entrada se ocultará en la lista de participantes, mostrando solo los últimos 4 dígitos. Predeterminado: `false`.                                                                                                                                                                                                                                                                    |

### Características de Cifrado de Extremo a Extremo (E2EE)

| Campo                               | Tipo    | Requerido | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| is_enabled                          | boolean | Sí       | Habilitar o deshabilitar E2EE. Navegadores compatibles: Chromium 83+, Google Chrome, Microsoft Edge, Safari, Firefox 117+. **Nota:** Los usuarios no pueden unirse si su navegador no es compatible con E2EE.                                                                                                                                      |
| enabled_self_insert_encryption_key  | boolean | No       | Si es `true`, se pedirá a los usuarios que introduzcan una clave secreta al unirse. Esto habilita un modelo de confianza cero donde la clave **nunca se envía al servidor**. Si es `false`, el servidor genera y distribuye la clave. Predeterminado: `false`. <br/><br/> **Importante:** Cuando esto es `true`, todas las características de IA basadas en audio (como la transcripción y el resumen) se deshabilitan automáticamente. Esto se debe a que el servidor no tiene la clave y, por lo tanto, no puede proporcionarla al agente de IA para acceder al flujo de audio. |
| included_chat_messages              | boolean | No       | Habilitar o deshabilitar E2EE para los mensajes de chat.                                                                                                                            |
| included_whiteboard                 | boolean | No       | Habilitar o deshabilitar E2EE para los mensajes de la pizarra (SCENE_UPDATE, POINTER_UPDATE). Puede aumentar el uso de la CPU; habilítelo solo si es necesario.                                                                                                                                                                                                |

### Configuraciones de Bloqueo Predeterminadas

| Campo                  | Tipo    | Requerido | Descripción                  |
| ---------------------- | ------- | -------- | ---------------------------- |
| lock_microphone        | boolean | No       | Bloquear el micrófono para los usuarios.   |
| lock_webcam            | boolean | No       | Bloquear la webcam para los usuarios.       |
| lock_screen_sharing    | boolean | No       | Bloquear la compartición de pantalla para los usuarios.|
| lock_chat              | boolean | No       | Bloquear el chat para los usuarios.         |
| lock_chat_send_message | boolean | No       | Bloquear el envío de mensajes en el chat.|
| lock_chat_file_share   | boolean | No       | Bloquear el uso compartido de archivos en el chat.   |
| lock_private_chat      | boolean | No       | Bloquear el chat privado para los usuarios. |

### Configuración de Copyright

Esta característica solo está disponible si la configuración del servidor `client > copyright_conf > allow_override` está establecida en `true`.

| Campo   | Tipo   | Requerido | Descripción                                                                 |
| ------- | ------ | -------- | ----------------------------------------------------------------------------- |
| display | boolean| Sí       | Habilitar o deshabilitar la visualización del texto de copyright.                           |
| text    | string | Sí       | Texto de copyright. Sea conciso. Etiquetas HTML compatibles: `b`, `i`, `em`, `strong`, `a` |

### Ejemplo

```json
{
  "room_id": "room01",
  "metadata": {
    "room_title": "Sala de prueba",
    "welcome_message": "Bienvenido a la sala",
    "room_features": {
      "allow_webcams": true,
      "mute_on_start": false,
      "allow_screen_share": true,
      "allow_rtmp": true,
      "admin_only_webcams": false,
      "allow_view_other_webcams": true,
      "allow_view_other_users_list": true,
      "enable_analytics": true,
      "allow_virtual_bg": true,
      "allow_raise_hand": true,
      "auto_gen_user_id": false,
      "recording_features": {
        "is_allow": true,
        "is_allow_cloud": true,
        "is_allow_local": true,
        "enable_auto_cloud_recording": false
      },
      "chat_features": {
        "is_allow": true,
        "is_allow_file_upload": true
      },
      "shared_note_pad_features": {
        "is_allow": true
      },
      "whiteboard_features": {
        "is_allow": true
      },
      "external_media_player_features": {
        "is_allow": true
      },
      "waiting_room_features": {
        "is_active": false
      },
      "breakout_room_features": {
        "is_allow": true,
        "allowed_number_rooms": 2
      },
      "display_external_link_features": {
        "is_allow": true
      },
      "ingress_features": {
        "is_allow": true
      },
      "polls_features": {
        "is_allow": true
      },
      "insights_features": {
        "is_allow": true,
        "transcription_features": {
          "is_allow": true,
          "is_allow_translation": true,
          "is_allow_speech_synthesis": true
        },
        "chat_translation_features": {
          "is_allow": true
        },
        "ai_features": {
          "is_allow": true,
          "ai_text_chat_features": {
            "is_allow": true
          },
          "meeting_summarization_features": {
            "is_allow": true
          }
        }
      },
      "sip_dial_in_features": {
        "is_allow": true,
        "enable_dial_in_on_create": true,
        "hide_phone_number": false
      },
      "end_to_end_encryption_features": {
        "is_enabled": false,
        "enabled_self_insert_encryption_key": false
      }
    },
    "default_lock_settings": {
      "lock_microphone": false,
      "lock_webcam": false,
      "lock_screen_sharing": true,
      "lock_whiteboard": true,
      "lock_shared_notepad": true,
      "lock_chat": false,
      "lock_chat_send_message": false,
      "lock_chat_file_share": false,
      "lock_private_chat": false
    },
    "copyright_conf": {
      "display": true,
      "text": "Impulsado por <a href=\"https://www.plugnmeet.org\" target=\"_blank\">plugNmeet</a>"
    }
  }
}
```

## Respuesta

| Campo                  | Tipo                           | Descripción               |
| :--------------------- | ------------------------------ | ------------------------- |
| status                 | boolean                        | Indica si la solicitud fue exitosa. |
| msg                    | string                         | Mensaje de respuesta.         |
| [room_info](/docs/api/room/room-info.md#información-de-la-sala) | object | Detalles sobre la sala.   |
