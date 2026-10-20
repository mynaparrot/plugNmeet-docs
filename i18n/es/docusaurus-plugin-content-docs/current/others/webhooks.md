---
title: Guía de Webhooks | Documentación para Desarrolladores de plugNmeet
description: Una guía para usar los webhooks de plugNmeet para recibir notificaciones en tiempo real sobre eventos de salas y sesiones, como 'room_created', 'room_started' o 'session_ended'.
keywords: [webhook, webhooks, eventos, tiempo real, notificaciones, api, desarrollador]
sidebar_position: 2
sidebar_label: Webhooks
---

# Webhooks

Plug-N-Meet puede notificar a su aplicación sobre diversos eventos enviando solicitudes de webhook a una URL especificada. Puede configurar esta URL en los ajustes del servidor o proporcionarla al crear una sala.

## Recepción de Webhooks

Las solicitudes de webhook se envían como solicitudes HTTP POST a las URLs que haya configurado, ya sea en el archivo `config.yml` del servidor o durante la creación de la sala. Cada evento de webhook se codifica como JSON y se incluye en el cuerpo de la solicitud.

La solicitud tendrá la cabecera `Content-Type` establecida en `application/json`. Asegúrese de que su servidor web esté configurado para aceptar cargas útiles con este tipo de contenido.

Plug-N-Meet utiliza el mismo patrón de seguridad que LiveKit. Para verificar que las solicitudes de webhook provienen de plugNmeet, cada solicitud incluye las cabeceras `Authorization` y `Hash-Token` que contienen un token JWT firmado. El token incluye un hash SHA256 de la carga útil. Para un ejemplo en PHP, consulte [webhook.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/webhook.php).

Cada evento contiene `event`, `room`, `id` y `createdAt`. `room` es un `NotifyEventRoom` con al menos `room_id` y `sid`. Asocie siempre las sesiones mediante `room.room_id`. Si LiveKit no incluye la información de la sala en su callback, plugNmeet lo descarta y nunca lo reenvía.

## Ciclo de vida de la sesión: en qué evento confiar

Una sesión de plugNmeet no es lo mismo que una sala multimedia de LiveKit. `room_created` y `session_ended` los envía el propio plugNmeet y siempre se emiten. `room_started` y `room_finished` se retransmiten desde LiveKit y solo se emiten si al menos un participante se unió y LiveKit nos lo notificó.

- Use `room_created` + `session_ended` para el seguimiento fiable, limpieza y facturación.
- Use `room_started` + `room_finished` solo para el estado multimedia (por ejemplo, alguien se unió realmente, la sala multimedia se cerró).

| Evento | Enviado por | Cuándo se emite |
|---|---|---|
| `room_created` | plugNmeet | Justo después de que la API `CreateRoom` tenga éxito. Siempre se emite. |
| `room_started` | LiveKit, retransmitido por plugNmeet | Cuando la sala de LiveKit se activa, es decir, el primer participante se unió. Solo se emite si alguien se unió y LiveKit nos lo notificó. |
| `room_finished` | LiveKit, retransmitido por plugNmeet | Cuando la sala de LiveKit se cierra. Solo se emite si la sala había iniciado y LiveKit nos lo notificó. No llega si nadie se unió nunca. |
| `session_ended` | plugNmeet | Durante el flujo `EndRoom`, ya sea por llamada API `EndRoom` o por janitor (tiempo de vacío agotado, duración excedida). Siempre se emite, incluso si nadie se unió nunca. Se envía antes de desmontar la sala de LiveKit. |

Si finaliza una sesión por API o janitor cierra una sesión vacía, siempre recibirá `session_ended`. Solo recibirá `room_finished` después si la sala de LiveKit realmente había iniciado.

## Eventos

Puede revisar [aquí](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common.proto#L10) las definiciones de los eventos.

Todos los eventos de webhook incluyen los siguientes campos:
- `id`: Un UUID que identifica el evento
- `createdAt`: Marca de tiempo UNIX en segundos
- `room`: Contiene al menos `room_id`, `sid`, `creation_time` y `metadata`

### Sala Creada

Enviado por plugNmeet al crear la sesión. Úselo para crear su registro local de sesión.

```js
interface CommonNotifyEvent {
  event: 'room_created'
  room: Room
}
```

### Sala Iniciada

Retransmitido desde LiveKit cuando la sala multimedia inicia. Solo se emite si al menos un usuario se unió. plugNmeet lo enriquece con `sid` y `metadata` antes de reenviarlo.

```js
interface CommonNotifyEvent {
  event: 'room_started'
  room: Room
}
```

### Sala Finalizada

Retransmitido desde LiveKit cuando la sala multimedia se cierra. Solo se emite si la sala había iniciado. Si la sala se terminó vía API de plugNmeet, puede llegar después de `session_ended`.

```js
interface CommonNotifyEvent {
  event: 'room_finished'
  room: Room
}
```

### Sesión Finalizada

Evento especial solo de plugNmeet. Enviado desde `onAfterRoomEnded` (`pkg/models/room_end.go`) antes de desmontar LiveKit, siempre que una sesión se elimina por llamada API o por janitor. Siempre se emite. Úselo como señal autoritativa de fin de sesión para limpieza y facturación. Carga mínima: `room_id`, `sid`, `metadata`, `creation_time`.

```js
interface CommonNotifyEvent {
  event: 'session_ended'
  room: Room
}
```

### Participante Unido

Retransmitido desde LiveKit cuando un participante se une. plugNmeet sobrescribe `sid` y `metadata` desde su propio almacén antes de reenviarlo.

```js
interface CommonNotifyEvent {
  event: 'participant_joined'
  room: Room
  participant: ParticipantInfo
}
```

### Participante Abandonó la Sala

Retransmitido desde LiveKit cuando un participante sale. También se envía para usuarios internos (SIP, ingress, agentes TTS).

```js
interface CommonNotifyEvent {
  event: 'participant_left'
  room: Room
  participant: ParticipantInfo
}
```

### Pista Publicada

Retransmitido desde LiveKit cuando se publica una pista de micrófono, cámara o pantalla compartida.

```js
interface CommonNotifyEvent {
  event: 'track_published'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Pista No Publicada

Retransmitido desde LiveKit cuando se deja de publicar una pista.

```js
interface CommonNotifyEvent {
  event: 'track_unpublished'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Grabación Iniciada

Enviado por el servicio de grabación al iniciar la grabación. Contiene `recording_info` con los ID de grabación y grabador.

```js
interface CommonNotifyEvent {
  event: 'start_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Grabación Finalizada

Enviado por el servicio de grabación al detener la grabación. El archivo puede no estar listo aún; espere `recording_proceeded` para el archivo descargable.

```js
interface CommonNotifyEvent {
  event: 'end_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Grabación Procesada

Se envía cuando el archivo de grabación está procesado y listo. Puede llegar después de la limpieza de la sesión.

```js
interface CommonNotifyEvent {
  event: 'recording_proceeded'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Iniciado

Enviado por el servicio de grabación cuando inicia la transmisión RTMP.

```js
interface CommonNotifyEvent {
  event: 'start_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Finalizado

Enviado por el servicio de grabación cuando termina la transmisión RTMP.

```js
interface CommonNotifyEvent {
  event: 'end_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Artefacto Creado

Este evento único y unificado se activa cada vez que el sistema genera un nuevo artefacto, como una transcripción o un resumen de la reunión. Sustituye a múltiples webhooks individuales y más antiguos por un modelo más flexible y escalable.

Para obtener detalles sobre la estructura de la carga útil y los posibles tipos de artefactos, consulte la [definición de protobuf](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_room_artifacts.proto#L91).

```js
interface CommonNotifyEvent {
  event: 'artifact_created'
  room: Room
  room_artifact: RoomArtifactWebhookEvent
}
```

### Analíticas procesadas

Se envía cuando la exportación de analíticas de una sesión está lista. Contiene `analytics.file_id` para descarga.

```js
interface CommonNotifyEvent {
  event: 'analytics_proceeded'
  room: Room
  analytics: AnalyticsEvent
}
```

---

## Ejemplo de Gestor de Webhook

El siguiente pseudocódigo demuestra cómo gestionar los webhooks entrantes. Su aplicación debe inspeccionar la propiedad `event` para determinar la acción a realizar. El evento `artifact_created` es especial, ya que requiere verificar un campo anidado `type` para comprender la carga útil.

```javascript
// Un mapeo del número del enum a una cadena legible por humanos.
// Consulte la definición de protobuf para obtener la lista completa y actualizada.
const ArtifactType = {
  0: 'UNKNOWN_ARTIFACT',
  2: 'MEETING_SUMMARY',
  4: 'SPEECH_TRANSCRIPTION',
  5: 'SPEECH_TRANSCRIPTION_USAGE',
};

function handleWebhook(payload) {
  console.log(`Evento recibido: ${payload.event}`);
  // Asocie siempre por room_id. Los eventos sin room.room_id nunca se envían.
  const roomId = payload.room?.room_id;

  switch (payload.event) {
    case 'room_created':
      // Inicio fiable de sesión.
      console.log(`Sesión '${roomId}' creada.`);
      break;

    case 'room_started':
      // Sala multimedia iniciada (alguien se unió).
      console.log(`La sala '${roomId}' ha comenzado.`);
      break;

    case 'participant_joined':
      console.log(`El usuario '${payload.participant.name}' se unió a la sala '${roomId}'.`);
      break;

    case 'artifact_created':
      manejarArtefactoCreado(payload);
      break;
      
    case 'room_finished':
      console.log(`La sala '${roomId}' ha finalizado.`);
      break;

    case 'session_ended':
      // Fin de sesión autoritativo. Siempre se emite por API o janitor.
      console.log(`La sesión '${roomId}' ha terminado.`);
      break;

    default:
      console.log(`Se recibió un evento no gestionado: ${payload.event}`);
  }
}

// Un gestor dedicado para el evento 'artifact_created'
function handleArtifactCreated(payload) {
  const artefacto = payload.room_artifact;
  const tipoArtefacto = ArtifactType[artefacto.type] || 'UNKNOWN_ARTIFACT';
  
  console.log(`Se creó un nuevo artefacto de tipo '${tipoArtefacto}'.`);

  switch (tipoArtefacto) {
    case 'MEETING_SUMMARY':
    case 'SPEECH_TRANSCRIPTION':
      // Estos son artefactos basados en archivos.
      if (artefacto.metadata && artefacto.metadata.file_info) {
        const infoArchivo = artefacto.metadata.file_info;
        console.log(`Archivo disponible en: ${infoArchivo.file_path}`);
        // Su lógica aquí: por ejemplo, descargar el archivo, vincularlo a una grabación.
      }
      break;
      
    case 'SPEECH_TRANSCRIPTION_USAGE':
      // Este es un artefacto basado en el uso.
      if (artefacto.metadata && artefacto.metadata.duration_usage) {
        const uso = artefacto.metadata.duration_usage;
        console.log(`Uso de transcripción registrado: ${uso.duration_sec} segundos.`);
        // Su lógica aquí: por ejemplo, actualizar los registros de facturación.
      }
      break;
      
    default:
      console.log(`Se recibió un tipo de artefacto no gestionado: ${tipoArtefacto}`);
  }
}

// Ejemplo de carga útil entrante para 'artifact_created' (un resumen de la reunión)
const samplePayload = {
  "event": "artifact_created",
  "id": "EV_abc123",
  "createdAt": 1761815000,
  "room": {
    "sid": "RM_zG9e4bY2pD-1761814595173",
    "room_id": "room01"
  },
  "room_artifact": {
    "type": 2, // Corresponde a MEETING_SUMMARY
    "artifact_id": "ART_xyz789",
    "metadata": {
      "file_info": {
        "file_path": "/path/to/summary.txt",
        "file_size": 1024,
        "mime_type": "text/plain"
      }
    }
  }
};

// Debería llamar a su gestor con el cuerpo de la solicitud POST.
handleWebhook(samplePayload);
```
