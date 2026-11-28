---
title: "Guía de proveedores de avatar: avatar de video con IA en tiempo real para el agente de voz"
description: "Añada al agente de voz de plugNmeet un avatar de video con IA en tiempo real con Beyond Presence, Anam, Simli, Tavus, HeyGen o un servidor de avatar LiveKit autoalojado, con BYOK por sala y facturación por minuto."
keywords: [avatar beyond presence, avatar ia anam, avatar simli, avatar tavus, avatar pal tavus, avatar heygen, heygen liveavatar, avatar livekit datastream, servidor de avatar websocket, servidor de avatar autoalojado, avatar de video con ia en tiempo real, agente avatar plugnmeet, avatar ia byok, proveedores de avatar plugnmeet, presentador virtual con ia, avatar con sincronizacion labial, participante de medios avatar, precio por minuto avatar, avatar de video para tutor ia]
sidebar_label: Proveedores de avatar
sidebar_position: 4
---

# Guía de proveedores de avatar

Google Gemini, OpenAI y Azure determinan lo que el agente **dice y sabe**. Un proveedor de avatar le pone **rostro**: convierte la voz del agente en video con sincronización labial dentro de la sala de plugNmeet, en tiempo real. Hay siete proveedores compatibles: `beyond_presence`, `anam`, `simli`, `tavus`, `heygen` y los dos genéricos, `livekit_datastream` y `websocket`, que apuntan a un servidor de avatar que usted mismo aloja.

## Cómo funciona

1. `ai_agent` gestiona la sesión de voz, las llamadas a herramientas y el trabajo en la pizarra con su proveedor de LLM.
2. Al iniciar la sesión, el servidor invita al proveedor de avatar a la sala de plugNmeet con un token de participante acotado.
3. El proveedor se une como participante de medios, convierte el audio del agente en video con sincronización labial y publica audio y video en la sala.
4. La interrupción es inmediata: cuando alguien toma la palabra, el agente deja de hablar y el avatar también se detiene.
5. Al terminar la sesión, el proveedor abandona la sala.

El proveedor de avatar solo recibe el audio de la sala, además de la indicación basada en el estado descrita más adelante en «Indicación de emoción», que solo reciben `tavus` y `livekit_datastream`. Nunca ve sus credenciales de LLM ni sus instrucciones.

## Proveedores de avatar compatibles

| Clave de proveedor | Endpoint predeterminado | Encabezado de autenticación predeterminado | Opciones de configuración |
| --- | --- | --- | --- |
| `beyond_presence` | `https://api.bey.dev` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `anam` | `https://api.anam.ai` | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |
| `simli` | `https://api.simli.ai` | `x-simli-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `tavus` | `https://tavusapi.com/v2` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `heygen` | `https://api.liveavatar.com/v1/sessions` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `livekit_datastream` | ninguno, `endpoint` es obligatorio | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |
| `websocket` | ninguno, `endpoint` es obligatorio | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |

- **`avatar_id`** elige el rostro o avatar de la cuenta del proveedor. Todos los proveedores lo necesitan y, sin él, la sesión se rechaza.
- **`endpoint`** sustituye la URL base predeterminada, para una puerta de enlace o un servidor de avatar autoalojado. Los dos proveedores genéricos no tienen valor predeterminado y no pueden iniciarse sin él.
- **`auth_header`** transporta la clave cuando el endpoint espera otro encabezado. `Authorization` envía `Authorization: Bearer <api_key>`; cualquier otro nombre envía `<header>: <api_key>`.

Los endpoints predeterminados corresponden a la API pública de cada proveedor. Consulte el `config_sample.yaml` de su versión del servidor antes de apuntar `endpoint` a una puerta de enlace propia. Una sustitución reemplaza toda la URL base, así que debe conservar la ruta a la que el proveedor añade las suyas: Tavus añade las suyas bajo `/v2` (`https://tavus-gateway.example.com/v2`) y HeyGen bajo `/v1/sessions` (`https://heygen-gateway.example.com/v1/sessions`).

Todo `endpoint` de avatar, tanto si procede de `config.yaml` como de la sala, debe ser una URL HTTPS o WSS pública y explícita: sin credenciales incrustadas, sin cadena de consulta, sin fragmento, con un puerto válido y con un host que resuelva a una dirección pública. Las direcciones privadas, de bucle local y de enlace local se rechazan. En `websocket`, un endpoint `wss://` se comprueba a través de su forma `https://` y un endpoint `ws://` sin cifrar se rechaza.

### Formas de `avatar_id` en Tavus

Tavus separa el aspecto del avatar de su PAL (la capa de persona que define el comportamiento y la voz), y un mismo `avatar_id` puede apuntar a una parte o a ambas:

- `face_id`: ese rostro con el PAL predeterminado integrado. Basta para tener un avatar funcional.
- `face_id/pal_id`: ese rostro con un PAL concreto.
- `/pal_id`: ese PAL con su propio rostro predeterminado.

Un `pal_id` propio debe existir previamente en su cuenta de Tavus.

### HeyGen

HeyGen funciona en modo `LITE`: el agente de plugNmeet conserva el LLM, el habla y las llamadas a herramientas, y HeyGen solo genera la sincronización labial del audio que recibe.

1. El servidor crea un token de sesión en `<endpoint>/token` con la clave de API de la cuenta en `x-api-key` e incluye el `avatar_id` y la sala a la que debe unirse el avatar.
2. Inicia esa sesión en `<endpoint>/start`, autenticándose con el token de sesión devuelto como `Authorization: Bearer <session_token>`, y recibe la dirección websocket para el audio.
3. El agente transmite su voz por ese websocket mientras el avatar publica video en la sala.
4. Al terminar la sesión, el servidor comunica la parada a `<endpoint>/stop`.

Como el endpoint predeterminado ya termina en `/v1/sessions`, una sustitución debe conservar ese segmento: `https://su-pasarela.example.com/v1/sessions`. Un `auth_header` propio solo cambia el encabezado que transporta la clave de API en la llamada del token.

HeyGen no recibe indicación de emoción. Como todo proveedor basado en socket, se le avisa cuando el agente escucha y cuando no, para que el avatar sepa cuándo permanecer en silencio.

### Servidores de avatar genéricos (`livekit_datastream` y `websocket`)

Estos dos proveedores no hablan con la API de un fabricante. Inician una sesión en un servidor de avatar que usted aloja, y el contrato es lo bastante pequeño como para implementarlo en su propio servicio. Ambos necesitan `endpoint` y `avatar_id`. La `api_key` sigue siendo obligatoria aunque su servidor de avatar no la use, y `auth_header` elige el encabezado que la transporta, `Authorization: Bearer <api_key>` de forma predeterminada.

`livekit_datastream` encaja con un worker de avatar de LiveKit (un `AvatarRunner`, como TruGen):

- El servidor hace `POST` de un JSON en `endpoint` con `avatar_id`, `livekit_url`, `livekit_token`, `livekit_room` y `sample_rate` (`24000`).
- Su servidor responde con un identificador de sesión en `session_id`, `id`, `conversation_id` o `task_id`, opcionalmente dentro de `data`. Se respeta un `sample_rate` opcional de `16000`; cualquier otro valor se queda en `24 kHz`. Si se devuelve un `end_url` opcional, se invoca con `{"session_id": "..."}` al terminar la sesión.
- El worker se une a la sala de LiveKit y lee la voz del agente desde el **flujo de bytes** dirigido a él, así que no se abre ningún socket y el avatar no necesita un websocket de audio.
- Este proveedor sí recibe la indicación de emoción descrita más abajo.

`websocket` encaja con un servidor de avatar que habla el protocolo de sesión por socket:

- `endpoint` puede ser el propio socket `wss://`, en cuyo caso la configuración de la sesión se envía como primer mensaje `{"type": "session.init", ...}`, o un endpoint HTTPS al que se le hace `POST` del mismo JSON anterior y que responde con `ws_url`.
- El agente envía `agent.speak` con PCM mono de 16 bits codificado en base64 (`24 kHz`, o `16 kHz` si su sesión lo pidió), `agent.speak_end` al final de cada intervención, `agent.interrupt` cuando hay interrupción, `agent.start_listening` / `agent.stop_listening` a medida que cambia el estado del agente, y `session.keep_alive` cuando el socket lleva un minuto inactivo.
- Su servidor informa de `session.state_updated` con `state: "connected"` cuando el avatar está listo, y puede informar además de `agent.state_updated`, `agent.speak_ended`, `agent.speak_interrupted` o `agent.audio_buffer_cleared`. El servidor espera hasta 15 segundos esa señal antes de entregar la sesión; que un endpoint nunca la informe no es un error y el inicio continúa tras esa espera.

`websocket` no recibe indicación de emoción: el estado del agente le llega como mensajes de escucha.

### Indicación de emoción (Tavus y `livekit_datastream`)

El servidor envía a `tavus` y a `livekit_datastream` una indicación de emoción automática como mensaje de aplicación de LiveKit. El valor sigue el estado del agente, no lo que dice: `happiness` mientras el estado del agente es `SPEAKING` y `neutral` en cualquier otro momento. No se infiere nada de lo que dice el agente ni del audio de los participantes. La indicación se limita a esos dos valores; no se puede desactivar, ajustar ni ampliar desde `config.yaml` ni desde el objeto `avatar` de la sala, y los demás proveedores solo generan voz.

## Configuración del servidor (`config.yaml`)

Las cuentas de avatar se definen en `insights.providers`, separadas de las cuentas de LLM:

```yaml
insights:
  providers:
    beyond_presence:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_BEYOND_PRESENCE_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    anam:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_ANAM_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    simli:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_SIMLI_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    tavus:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_TAVUS_API_KEY"
        options:
          avatar_id: "your-face-id/your-pal-id"
    heygen:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_HEYGEN_API_KEY"
        options:
          avatar_id: "your-avatar-id"
    livekit_datastream:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_AVATAR_SERVER_KEY"
        options:
          endpoint: "https://avatar.example.com/v1/session"
          avatar_id: "your-avatar-id"
    websocket:
      - id: "default-avatar"
        credentials:
          api_key: "YOUR_AVATAR_SERVER_KEY"
        options:
          # el propio socket wss://, o un endpoint https que responda con uno
          endpoint: "wss://avatar.example.com/session"
          avatar_id: "your-avatar-id"
```

Después, elija un avatar predeterminado para `ai_agent` y fije su precio por minuto:

```yaml
insights:
  services:
    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "gemini-3.8-live"
        avatar_provider: "simli"
        avatar_id: "your-avatar-id"
        avatar_account_id: "default-avatar"
      pricing:
        avatar_model:
          price_per_minute: 0.10
        # Opcional: un bloque con el nombre del proveedor tiene prioridad
        # sobre avatar_model.
        simli:
          price_per_minute: 0.08
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.avatar_provider` | string | Proveedor de avatar predeterminado: `beyond_presence`, `anam`, `simli`, `tavus`, `heygen`, `livekit_datastream` o `websocket`. Las salas pueden sustituirlo. |
| `options.avatar_id` | string | Rostro predeterminado de ese proveedor. Se usa cuando la sala no define `avatar_id`. |
| `options.avatar_account_id` | string | `id` de la cuenta en `providers.<avatar_provider>` que contiene la clave. |
| `pricing.avatar_model.price_per_minute` | number | Tarifa por cada minuto de video de avatar generado. |
| `pricing.<provider>.price_per_minute` | number | Tarifa opcional por proveedor. Tiene prioridad sobre `avatar_model`. |

Si deja `avatar_provider` vacío, todas las salas funcionan solo con voz. Una cuenta de avatar se usa únicamente cuando lo pide el valor predeterminado del servidor o la propia sala.

## Sustitución por sala y BYOK (`ai_agent_features.avatar`)

Un anfitrión puede activar un avatar en una sola sala sin tocar la configuración del servidor:

```json
{
  "insights_features": {
    "ai_agent_features": {
      "is_enabled": true,
      "avatar": {
        "is_enabled": true,
        "provider": "anam",
        "avatar_id": "your-avatar-id",
        "max_avatar_minutes": 60
      }
    }
  }
}
```

La sala también puede aportar su propia clave y su propia puerta de enlace:

```json
{
  "avatar": {
    "is_enabled": true,
    "provider": "beyond_presence",
    "avatar_id": "your-avatar-id",
    "max_avatar_minutes": 60,
    "api_key": "ROOM_OWNED_KEY",
    "endpoint": "https://your-avatar-gateway.example.com",
    "auth_header": "x-api-key"
  }
}
```

`api_key`, `endpoint` y `auth_header` se eliminan de los metadatos de la sala antes de publicarlos en NATS y se conservan solo en el registro de Redis de la sala (`pnm:ai_agent:<roomId>:provider_config`). Las sesiones hijas de grupos pequeños heredan ese registro, así que una sesión 1 a 1 arranca sin reenviar la clave. Los nombres de campo y los límites están en [`avatar`](/docs/ai-agent/developer-guide#avatar).

## Requisitos y facturación

### Requisitos

- **Servidor accesible públicamente.** El proveedor de avatar se conecta desde su propia red, así que su servidor de plugNmeet debe ser accesible desde internet. Un servidor que solo se resuelve dentro de una red privada no permitirá la conexión.
- **E2EE completamente desactivado.** El proveedor es un participante de medios externo y no puede unirse a una sala cifrada. La creación de una sala con `avatar.is_enabled` y cualquier modo de E2EE se rechaza.
- **Proveedor, avatar y clave resolubles.** Proceden de la sala, de `ai_agent.options` o de ambos. Si no se resuelven, la sesión funciona sin video.

### Presupuesto y facturación

- **`max_avatar_minutes`** limita el video de avatar facturable por sala, hasta `240`. `0` usa el valor predeterminado del servidor. El contador es acumulativo entre reinicios dentro de la misma sala, así que detener y volver a iniciar el agente no lo restablece.
- **Artefacto aparte.** Los minutos de avatar se escriben en `AI_AGENT_AVATAR_USAGE` (tipo `13`) como registro de duración. Nunca se mezclan con los totales de tokens del LLM, y `AI_AGENT_USAGE` recoge solo uso de tokens y audio.
- **Las sesiones BYOK registran costo cero.** La duración se anota igual, se omite `*_estimated_cost` y el desglose incluye `custom_avatar_provider_<provider>: 1`.
- Mantenga `max_avatar_minutes` en línea con `max_audio_minutes` para que ambos presupuestos terminen a la vez.

## Errores habituales

- **Avatar activado en una sala con E2EE.** Se rechaza al crear la sala. Desactive todos los modos de E2EE, incluido el cifrado gestionado por el servidor, antes de activar un avatar.
- **URL de servidor privada o solo local.** El proveedor se conecta desde internet. Asegúrese de que su servidor de plugNmeet sea accesible públicamente y de que sus puertos de medios estén abiertos.
- **Bloque `pricing` vacío.** El video funciona, pero `AI_AGENT_AVATAR_USAGE` informa costo cero.
- **Bloque de proveedor sin tarifa.** Un bloque con el nombre del proveedor sin `price_per_minute` recurre a `avatar_model` y, si tampoco existe, a cero.
- **`endpoint` de Tavus sin `/v2`.** Las rutas de Tavus viven bajo la ruta base `/v2`, así que una puerta de enlace propia que omita ese segmento no conectará.
- **`endpoint` de HeyGen sin `/v1/sessions`.** El servidor añade `/token`, `/start` y `/stop` a la URL base, así que una sustitución debe conservar el segmento `/v1/sessions`.
- **Proveedor genérico sin `endpoint`.** `livekit_datastream` y `websocket` no tienen servidor predeterminado, así que el endpoint debe venir de la sala o de la cuenta. Su ausencia se rechaza donde se resuelve la configuración del avatar: una solicitud de creación que activa el avatar se rechaza, y también el inicio del agente en una sala cuya configuración guardada o de cuenta aún no lo aporta.
- **`ws://` o un host privado como `endpoint`.** Solo se aceptan URL HTTPS y WSS públicas. Un `ws://` sin cifrar, unas credenciales incrustadas, una cadena de consulta, un fragmento y los hosts que resuelven a su red interna no superan la comprobación.

## Páginas relacionadas

- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): estructura común de proveedores y precios.
- [Guía para desarrolladores y API](/docs/ai-agent/developer-guide#avatar): todos los campos de `avatar` y un ejemplo de solicitud.
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing): carga de `AI_AGENT_AVATAR_USAGE`.
- [Descripción general de la seguridad](/docs/security-overview): cómo interactúan los secretos BYOK y el E2EE con un participante de medios.
- [Guía del proveedor Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure): el lado de voz de la sesión.
