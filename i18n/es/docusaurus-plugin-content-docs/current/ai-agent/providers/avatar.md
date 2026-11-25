---
title: "Guía de proveedores de avatar: avatar de video con IA en tiempo real para el agente de voz"
description: "Añada al agente de voz de plugNmeet un avatar de video con IA en tiempo real con Beyond Presence, Anam o Simli, con BYOK por sala y facturación por minuto."
keywords: [avatar beyond presence, avatar ia anam, avatar simli, avatar de video con ia en tiempo real, agente avatar plugnmeet, avatar ia byok, proveedores de avatar plugnmeet, presentador virtual con ia, avatar con sincronizacion labial, participante de medios avatar, precio por minuto avatar, avatar de video para tutor ia]
sidebar_label: Proveedores de Avatar
sidebar_position: 4
---

# Guía de proveedores de avatar

Google Gemini, OpenAI y Azure determinan lo que el agente **dice y sabe**. Un proveedor de avatar le pone **rostro**: convierte la voz del agente en video con sincronización labial dentro de la sala de plugNmeet, en tiempo real. Hay tres proveedores compatibles: `beyond_presence`, `anam` y `simli`.

## Cómo funciona

1. `ai_agent` gestiona la sesión de voz, las llamadas a herramientas y el trabajo en la pizarra con su proveedor de LLM.
2. Al iniciar la sesión, el servidor invita al proveedor de avatar a la sala de plugNmeet con un token de participante acotado.
3. El proveedor se une como participante de medios, convierte el audio del agente en video con sincronización labial y publica audio y video en la sala.
4. La interrupción se mantiene: cuando un participante toma la palabra, el agente deja de hablar y el avatar le sigue.
5. Al terminar la sesión, el proveedor abandona la sala.

El proveedor de avatar solo recibe el audio de la sala. Nunca ve sus credenciales de LLM ni sus instrucciones.

## Proveedores de avatar compatibles

| Clave de proveedor | Endpoint predeterminado | Encabezado de autenticación predeterminado | Opciones de configuración |
| --- | --- | --- | --- |
| `beyond_presence` | `https://api.bey.dev` | `x-api-key` | `avatar_id`, `endpoint`, `auth_header` |
| `anam` | `https://api.anam.ai` | `Authorization: Bearer <api_key>` | `avatar_id`, `endpoint`, `auth_header` |
| `simli` | `https://api.simli.ai` | `x-simli-api-key` | `avatar_id`, `endpoint`, `auth_header` |

- **`avatar_id`** elige el rostro o avatar de la cuenta del proveedor.
- **`endpoint`** sustituye la URL base predeterminada, para una puerta de enlace o un servidor de avatar autoalojado.
- **`auth_header`** transporta la clave cuando el endpoint espera otro encabezado. `Authorization` envía `Authorization: Bearer <api_key>`; cualquier otro nombre envía `<header>: <api_key>`.

Los endpoints predeterminados corresponden a la API pública de cada proveedor. Consulte el `config_sample.yaml` de su versión del servidor antes de apuntar `endpoint` a una puerta de enlace propia.

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
| `options.avatar_provider` | string | Proveedor de avatar predeterminado: `beyond_presence`, `anam` o `simli`. Las salas pueden sustituirlo. |
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

## Páginas relacionadas

- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): estructura común de proveedores y precios.
- [Guía para desarrolladores y API](/docs/ai-agent/developer-guide#avatar): todos los campos de `avatar` y un ejemplo de solicitud.
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing): carga de `AI_AGENT_AVATAR_USAGE`.
- [Descripción general de la seguridad](/docs/security-overview): cómo interactúan los secretos BYOK y el E2EE con un participante de medios.
- [Guía del proveedor Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure): el lado de voz de la sesión.
