---
title: Guía de Webhooks | Documentación para Desarrolladores de plugNmeet
description: Una guía para usar los webhooks de plugNmeet para recibir notificaciones en tiempo real sobre eventos en sus salas de videoconferencia, como 'session-started' o 'user-joined'.
keywords: [webhook, webhooks, eventos, tiempo real, notificaciones, api, desarrollador]
sidebar_position: 2
sidebar_label: Webhooks
---

# Webhooks

Plug-N-Meet puede notificar a su aplicación sobre diversos eventos enviando solicitudes de webhook a una URL especificada. Puede configurar esta URL en los ajustes del servidor o proporcionarla al crear una sala.

## Recepción de Webhooks

Las solicitudes de webhook se envían como solicitudes HTTP POST a las URLs que haya configurado, ya sea en el archivo `config.yml` del servidor o durante la creación de la sala. Cada evento de webhook se codifica como JSON y se incluye en el cuerpo de la solicitud.

La solicitud tendrá la cabecera `Content-Type` establecida en `application/webhook+json`. Asegúrese de que su servidor web esté configurado para aceptar cargas útiles con este tipo de contenido.

Plug-N-Meet utiliza el mismo patrón de seguridad que LiveKit. Para verificar que las solicitudes de webhook provienen de plugNmeet, cada solicitud incluye las cabeceras `Authorization` y `Hash-Token` que contienen un token JWT firmado. El token incluye un hash SHA256 de la carga útil. Para un ejemplo en PHP, consulte [webhook.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/webhook.php).

## Eventos

Puede consultar las definiciones de los eventos [aquí](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common.proto#L10).

Todos los eventos de webhook incluyen los siguientes campos:
- `id`: Un UUID que identifica el evento
- `createdAt`: Marca de tiempo UNIX en segundos

### Sala Creada

```js
interface CommonNotifyEvent {
  event: 'room_created'
  room: Room
}
```

### Sala Iniciada

```js
interface CommonNotifyEvent {
  event: 'room_started'
  room: Room
}
```

### Sala Finalizada

```js
interface CommonNotifyEvent {
  event: 'room_finished'
  room: Room
}
```

### Participante Unido

```js
interface CommonNotifyEvent {
  event: 'participant_joined'
  room: Room
  participant: ParticipantInfo
}
```

### Participante Abandonó la Sala

```js
interface CommonNotifyEvent {
  event: 'participant_left'
  room: Room
  participant: ParticipantInfo
}
```

### Pista Publicada

Solo se incluyen `sid`, `identity` y `name` en los objetos Room y Participant.

```js
interface CommonNotifyEvent {
  event: 'track_published'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Pista No Publicada

Solo se incluyen `sid`, `identity` y `name` en los objetos Room y Participant.

```js
interface CommonNotifyEvent {
  event: 'track_unpublished'
  room: Room
  participant: ParticipantInfo
  track: TrackInfo
}
```

### Grabación Iniciada

```js
interface CommonNotifyEvent {
  event: 'start_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Grabación Finalizada

```js
interface CommonNotifyEvent {
  event: 'end_recording'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### Grabación Procesada

```js
interface CommonNotifyEvent {
  event: 'recording_proceeded'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Iniciado

```js
interface CommonNotifyEvent {
  event: 'start_rtmp'
  room: Room
  recording_info: RecordingInfoEvent
}
```

### RTMP Finalizado

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

### Análisis Procesado

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
  const sala = payload.room;

  switch (payload.event) {
    case 'room_started':
      console.log(`La sala '${sala.name}' ha comenzado.`);
      break;

    case 'participant_joined':
      console.log(`El usuario '${payload.participant.name}' se unió a la sala '${sala.name}'.`);
      break;

    case 'artifact_created':
      manejarArtefactoCreado(payload);
      break;
      
    case 'room_finished':
      console.log(`La sala '${sala.name}' ha finalizado.`);
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
    "room_id": "room01",
    "name": "Test Room"
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
