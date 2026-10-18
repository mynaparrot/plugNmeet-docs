---
title: Analíticas de Reuniones e Informes | plugNMeet
description: Genere informes de analíticas de reuniones con plugNMeet — analíticas profundas de asistencia, tiempo de uso de la palabra, participación, encuestas y desempeño en el aula virtual. Referencia del JSON + guía del SDK para PHP.
keywords: [analíticas de reuniones, analíticas profundas, informe de reunión, informe de asistencia, informe de participación, informe de aula virtual, seguimiento de asistencia, participación de los participantes, tiempo de uso de la palabra, analíticas de participación, aula virtual, sdk php, AnalyticsFormatter]
sidebar_position: 1
sidebar_label: Analíticas
---

# Analíticas de Reuniones e Informes Detallados de Sesión

Las **analíticas de reuniones** de plugNMeet convierten cada sesión en un **informe de analíticas** detallado: quién se unió y durante cuánto tiempo, quién habló, quién chateó, votó, levantó la mano, compartió pantalla o tuvo problemas de conexión. Los equipos las utilizan para sus **informes de reunión** y el control de asistencia; los docentes las utilizan como **informe de aula virtual** para medir la equidad en la participación, las tendencias de implicación y las barreras tecnológicas.

Si `enable_analytics` se activó en los `room_features` de la sala ([API de creación de salas](/docs/api/room/create)), plugNMeet agrega los eventos de analíticas en memoria durante la sesión y escribe un único archivo JSON al finalizar. El archivo se almacena como un artefacto de tipo `MEETING_ANALYTICS`.

Para comprender el porqué de estas métricas — preguntas sobre participación, equidad y diseño con privacidad por defecto — consulte [De la caja negra al plano: usar analíticas para comprender su aula en línea](/blog/classroom-analytics-for-educators).

## Qué puede construir con estos datos

- **Informe de asistencia de la reunión:** `duration` por usuario a partir de las líneas de tiempo de `joined` / `left`, además de `room_total_users` y `room_duration`.
- **Analíticas de participación:** `talked` / `talked_duration`, `mic_status`, `webcam_status`, `screen_share_status`, `raise_hand`, `voted_poll`, `public_chat` / `private_chat`.
- **Informe de desempeño en el aula virtual:** combine el tiempo de uso de la palabra, los votos en encuestas, las anotaciones en la pizarra (`whiteboard_annotated`), los archivos del chat y las manos levantadas para comparar la participación entre estudiantes o sesiones. El plugin de Moodle lo ofrece de forma nativa con asistencia acumulativa y reglas de finalización de actividad — consulte [Integración con Moodle](/docs/user-guide/moodle-integration).
- **Informe de calidad de conexión:** `connection_quality` (`excellent` / `good` / `poor`) correlacionado con eventos `left` tempranos para distinguir la falta de implicación de los problemas de red.
- **Exportaciones a Excel / LMS:** los plugins de Moodle, WordPress y Joomla presentan los mismos datos en hojas por sala y por usuario. Consulte [Artefactos en WordPress](/docs/user-guide/wordPress-integration) como ejemplo.

Las analíticas son **opcionales y respetuosas con la privacidad**: desactivadas por defecto, solo en memoria y descartadas de forma permanente si `enable_analytics` es `false`. Solo se guardan metadatos y contadores — nunca el texto del chat ni el audio o el video. Consulte el [Resumen de seguridad](/docs/security-overview).

## Cómo obtener el archivo de analíticas

1. Actívelo al crear la sala: `"enable_analytics": true` en `room_features`.
2. Espere a que termine la sesión. El servidor exporta el JSON y emite el evento de webhook `analytics_proceeded` con el `artifact_id` — consulte [Webhooks](/docs/others/webhooks).
3. Liste los archivos con [`/artifact/fetch`](/docs/api/artifact/fetch) usando `"type": "MEETING_ANALYTICS"`.
4. Obtenga un token de un solo uso en [`/artifact/getDownloadToken`](/docs/api/artifact/download) y luego descargue:
   `GET https://Su-Servidor/download/artifact/<TOKEN>`

Los endpoints obsoletos `/analytics/fetch` y `/analytics/getDownloadToken` siguen funcionando, pero se eliminarán. Utilice `/artifact/*` para el código nuevo.

## Formato del JSON de analíticas

El archivo original es deliberadamente de bajo nivel — un registro completo de eventos, no un informe listo para usar. No lo agregue de forma manual; utilice el [formateador del SDK para PHP](#dar-formato-con-el-sdk-para-php) que se describe más abajo.

El nivel superior es siempre:

```json
{
  "room": {},
  "users": []
}
```

### Objeto de sala

Los campos base se escriben de forma directa (véase `AnalyticsRoomInfo` y `exportAnalyticsToJSON` en el servidor):

| Campo | Tipo | Notas |
| ----- | ---- | ----- |
| `room_id` | string | Su `room_id`. |
| `room_title` | string | Título de la sala al finalizar. |
| `room_total_users` | int | Número de usuarios distintos detectados. |
| `room_creation` | int | Segundos Unix. |
| `room_ended` | int | Segundos Unix. |
| `room_duration` | int | Segundos, `room_ended - room_creation`. |
| `enabled_e2ee` | bool | Según los metadatos de la sala. |
| `events` | array | Lista de eventos de bajo nivel, véase más abajo. |

### Objeto de usuario

```json
{
  "user_id": "111",
  "name": "Test User",
  "is_admin": false,
  "ex_user_id": "111",
  "events": []
}
```

`user_id` es el ID interno del participante en LiveKit; `ex_user_id` es el `userId` que usted envió en el token de acceso (vacío si se usó `auto_gen_user_id`).

### Objeto de evento

Los eventos de sala y de usuario comparten la misma estructura:

```json
{
  "name": "joined",
  "total": 6,
  "values": [{ "time": 1500000, "value": "1500000" }]
}
```

- `name` es el nombre del proto `AnalyticsEvents` en minúsculas, sin el prefijo `ANALYTICS_EVENT_ROOM_` / `ANALYTICS_EVENT_USER_`; por ejemplo, `poll_added`, `recording_status`, `joined`, `mic_status`. Esta limpieza la realiza `processEventKey`.
- `time` está en milisegundos Unix.
- La codificación de `total` / `values` depende de cómo el servidor guardó el evento en Redis:
  - `HSET` (eventos con marca temporal como `joined`, `mic_status`): `total` = número de entradas, `values` = lista completa.
  - `INCRBY` (contadores como `talked`, `public_chat`): `total` = contador, `values` está vacío.
  - `SET` (valores de texto): `total` = `1`, `values` tiene una entrada.

Nombres de eventos conocidos (de `plugnmeet_analytics.proto`):

Sala: `poll_added`, `recording_status`, `rtmp_status`, `breakout_room`, `shared_notepad_status`, `external_display_link_status`, `external_media_player_status`, `speech_service_status`, `speech_service_total_usage`, `ingress_created`, `whiteboard_files`, contadores de insights/transcripción/traducción.

Usuario: `joined`, `left`, `mic_status`, `talked`, `talked_duration` (ms), `webcam_status`, `screen_share_status`, `voted_poll`, `public_chat`, `private_chat`, `chat_files`, `whiteboard_annotated`, `whiteboard_files`, `speech_services_usage`, `speech_services_status`, `interface_visibility`, `raise_hand`, `connection_quality`, `reaction`.

Los valores de estado dentro de `mic_status` / `webcam_status` / eventos de estado de sala usan prefijos como `ANALYTICS_STATUS_STARTED`, `ANALYTICS_STATUS_ENDED`, `ANALYTICS_STATUS_MUTED`, o `excellent` / `good` / `poor` para la calidad de conexión.

:::caution[Los campos evolucionan con las nuevas funciones]
Las nuevas funciones de plugNMeet pueden añadir o ampliar en cualquier momento los campos de sala, los campos de usuario y los nombres de eventos, por lo que las listas anteriores son una foto fija, no un esquema cerrado. Antes de analizar de forma estricta o validar con nombres de campos fijos, revise siempre las notas de la versión y el archivo oficial [`plugnmeet_analytics.proto`](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_analytics.proto). Si utiliza el SDK para PHP, prefiera `getRoomFields()` / `getUserFields()` en lugar de listas fijas, para que su código adopte los campos nuevos de forma automática.
:::

## Dar formato con el SDK para PHP

El paquete [`plugNMeet-sdk-php`](https://github.com/mynaparrot/plugNMeet-sdk-php) incluye `Mynaparrot\Plugnmeet\AnalyticsFormatter`, que convierte el JSON original en un informe de reunión listo para la asistencia. Los plugins de Moodle, WordPress y Joomla usan la misma clase para generar sus exportaciones a Excel.

```bash
composer require mynaparrot/plugnmeet-sdk
```

### 1. Obtener y descargar el JSON

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use Mynaparrot\Plugnmeet\PlugNmeet;
use Mynaparrot\PlugnmeetProto\FetchArtifactsReq;
use Mynaparrot\PlugnmeetProto\GetArtifactDownloadTokenReq;
use Mynaparrot\PlugnmeetProto\RoomArtifactType;

$pnm = new PlugNmeet('https://su-servidor', 'api-key', 'api-secret');

// listar los artefactos de analíticas de una sala
$req = new FetchArtifactsReq();
$req->setRoomIds(['room01']);
$req->setType(RoomArtifactType::MEETING_ANALYTICS);
$res = $pnm->fetchArtifacts($req);

$artifactId = $res->getResult()->getArtifactsList()[0]->getArtifactId();

// descargar
$tokenReq = new GetArtifactDownloadTokenReq();
$tokenReq->setArtifactId($artifactId);
$token = $pnm->getArtifactDownloadToken($tokenReq)->getToken();

$json = file_get_contents('https://su-servidor/download/artifact/' . $token);
$raw = json_decode($json, true);
```

### 2. Darle formato de informe

```php
use Mynaparrot\Plugnmeet\AnalyticsFormatter;

$formatter = new AnalyticsFormatter($raw, 'America/Mexico_City');
$data = $formatter->getFormattedEventData();

$room  = $data['room'];   // array asociativo
$users = $data['users'];  // lista de arrays asociativos

// utilidades
echo $formatter->formatTimestamp($raw['room']['room_creation'], false);
echo $formatter->formatSecondsToTime($room['room_duration']);
print_r($formatter->getRoomFields());
print_r($formatter->getUserFields());
```

El envoltorio de los ejemplos del SDK hace lo mismo en una sola llamada:

```php
$formatter = plugNmeetConnect::getAnalyticsFormatter($json, $userTimezone);
```

Las zonas horarias no válidas revierten a `UTC`.

### Qué produce el formateador

Campos de sala (`getRoomFields()`):

```
room_id, room_title, room_creation, room_ended, room_duration,
room_total_users, enabled_e2ee, recording_status, rtmp_status,
shared_notepad_status, ingress_created, breakout_room,
external_display_link_status, external_media_player_status
```

Además, `polls` y `whiteboard_files` cuando existen. `room_creation` / `room_ended` se convierten en cadenas `d-m-Y H:i:s P` en la zona horaria indicada. Los eventos de estado se convierten en conteos de inicios.

Campos de usuario (`getUserFields()`):

```
name, ex_user_id, is_admin, duration, joined, left, mic_status,
mic_muted, mic_duration, talked, talked_duration, webcam_status,
webcam_duration, raise_hand, voted_poll, whiteboard_annotated,
whiteboard_files, screen_share_status, public_chat, private_chat,
chat_files, interface_invisible, connection_quality
```

Transformaciones principales:

- `joined` / `left`: listas ordenadas de marcas temporales en milisegundos Unix.
- `duration`: segundos totales de presencia, calculados a partir de una línea de tiempo de entradas y salidas. Se ignoran las entradas duplicadas y las salidas sin entrada previa; una sesión sin cerrar se extiende hasta `room_ended`, y se ignoran los eventos fuera de `[room_creation, room_ended]`.
- `mic_duration` / `webcam_duration`: segundos entre `ANALYTICS_STATUS_STARTED` y `ANALYTICS_STATUS_ENDED` (coincidencia por prefijo, por lo que `ANALYTICS_STATUS_STARTED:node_01` también cuenta). Una sesión de dispositivo abierta se cierra en el `left` del usuario o al final de la sala. Se ignoran los inicios duplicados.
- `talked_duration`: el `total` original está en milisegundos → se convierte a segundos con `ceil(ms / 1000)`.
- `talked`, `public_chat`, `private_chat`, `chat_files`, `whiteboard_annotated`, `raise_hand`: contadores simples de `total`.
- `interface_visibility` → `interface_invisible` (conteo de `hidden`).
- `connection_quality` → conteos `{ excellent, good, poor }`.
- `voted_poll`: conteo de votos por usuario; además incrementa `room.polls[poll_id].options[option_id].responses`.
- `duration`, `talked_duration`, `mic_duration` y `webcam_duration` se limitan a `min(room_duration, room_ended - room_creation)`. Si faltan los metadatos de la sala, se conserva el valor original.

Ejemplo con formato — una fila de un informe de analíticas de reunión:

```json
{
  "room": {
    "room_id": "room01",
    "room_title": "Test Room",
    "room_creation": "17-05-2026 10:00:00 +06:00",
    "room_duration": 3000,
    "recording_status": 1
  },
  "users": [
    {
      "name": "Test User",
      "duration": 1200,
      "mic_duration": 500,
      "talked_duration": 82,
      "connection_quality": { "excellent": 10, "good": 2, "poor": 0 }
    }
  ]
}
```

Utilice `formatSecondsToTime()` para mostrar los campos de duración como `HH:MM:SS` en tablas o exportaciones a CSV/XLSX.

## Recursos relacionados

- [Analíticas para docentes](/blog/classroom-analytics-for-educators) — guía pedagógica sobre analíticas de participación.
- [Integración con Moodle](/docs/user-guide/moodle-integration) — informes acumulativos de desempeño en el aula virtual con asistencia y finalización de actividad.
- [API de obtención de artefactos](/docs/api/artifact/fetch) y [API de token de descarga](/docs/api/artifact/download).
- [Webhooks](/docs/others/webhooks) — evento `analytics_proceeded`.
- [Resumen de seguridad](/docs/security-overview) — analíticas opcionales y conservación de datos.
