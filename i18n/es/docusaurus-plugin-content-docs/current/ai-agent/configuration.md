---
title: "Configuración del servidor del Agente de IA: config.yaml, proveedores, BYOK y límites"
description: "Referencia completa para configurar el Agente de IA de plugNmeet en su servidor, con cuentas de proveedor de Google y OpenAI, opciones de modelo y de precios de ai_agent, configuración de clave propia por sala (BYOK), ciclo de vida de las claves en Redis, límites del servidor y compatibilidad con E2EE."
keywords: [configuración de plugnmeet, proveedores de insights, configuración de openai realtime, configuración de gemini live, configuración config.yaml de agente de ia, byok proveedor de ia, traiga su propia clave de api, precios del agente de ia, ajustes del proveedor de ia, servidor de ia autoalojado]
sidebar_label: Configuración del servidor y proveedor
sidebar_position: 5
---

# Configuración del servidor y del proveedor del agente de IA

Esta página es la referencia para los administradores del servidor. Explica cómo definir las cuentas de proveedor de IA en `config.yaml`, cómo asignar el servicio del Agente de IA a un proveedor y a sus modelos, cómo funciona la clave propia por sala (BYOK, *bring your own key*) y qué límites aplica el servidor.

:::info En desarrollo activo
El motor del Agente de IA y sus claves de configuración están en desarrollo activo. Las claves, los valores predeterminados y los proveedores compatibles pueden cambiar antes de la publicación general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista para cuando la función esté terminada y publicada. Por ahora, habilite y configure el agente mediante la API.
:::

## Cómo se estructura la configuración

La sección `insights` tiene dos partes:

1. **`providers`**: sus cuentas de proveedor, organizadas por tipo de proveedor (`google`, `openai` y otros). Cada cuenta tiene un `id` único y sus credenciales.
2. **`services`**: las funciones que usan esas cuentas. El Agente de IA utiliza la entrada `services.ai_agent`.

Esta separación le permite definir una credencial una sola vez y reutilizarla en varios servicios, o usar una cuenta distinta para el agente que para el chat de texto.

```yaml
insights:
  enabled: true
  providers:
    google:
      - id: "default-gemini-creds"
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"
    openai:
      - id: "default-openai-creds"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"
  services:
    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "YOUR_REALTIME_MODEL"
        summarize_model: "YOUR_SUMMARY_MODEL"
```

Sustituya los nombres de los modelos por modelos a los que tenga acceso su cuenta del proveedor. El archivo de ejemplo del repositorio del servidor incluye ejemplos actualizados.

## `insights.providers`

| Clave | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `providers.<tipo>` | lista | Sí | Tipo de proveedor. El Agente de IA admite `google` y `openai`. |
| `id` | cadena | Sí | Nombre único para esta cuenta. Los servicios la referencian. |
| `credentials.api_key` | cadena | Sí | La clave de API del proveedor. |
| `options.endpoint` | cadena | No | URL base personalizada. Úsela para pasarelas compatibles con OpenAI o para servidores autoalojados. |

Guarde las claves de API en un lugar seguro y restrinja los permisos del archivo `config.yaml`.

## `insights.services.ai_agent`

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `provider` | cadena | Tipo de proveedor que se usará: `google` u `openai`. |
| `id` | cadena | ID de la cuenta definida en `providers`. |
| `options.realtime_model` | cadena | Modelo para la sesión de voz bidireccional (audio de entrada y de salida). Lo usan ambos proveedores. |
| `options.live_model` | cadena | Solo OpenAI. Modelo de voz para el SDK Live. Úselo en lugar de `realtime_model` cuando desee el SDK Live. Requiere `delegation_model`. |
| `options.delegation_model` | cadena | Solo OpenAI Live. Modelo de texto que recibe las llamadas a herramientas del modelo de voz. Obligatorio cuando se define `live_model`. |
| `options.summarize_model` | cadena | Modelo de texto que se usa una vez al final de la sesión para refinar el artefacto `AI_AGENT_SESSION_SUMMARY`. Si no se define, el servidor usa el `summarize_model` de `ai_text_chat` o de `meeting_summarizing` para el mismo proveedor y, después, un resumen local determinista. |
| `options.default_voice` | cadena | ID de voz que se usa cuando la sala no define `voice`. Debe ser una voz compatible con su proveedor. |
| `options.turn_detection` | cadena | Solo OpenAI Realtime. `semantic_vad` (predeterminado), `server_vad` o `none`. Los servidores autoalojados suelen necesitar `server_vad` o `none`. |
| `options.input_transcription_model` | cadena | Solo OpenAI Realtime. Modelo de transcripción para la voz del alumno. Establezca `none` para desactivar la transcripción de entrada. |
| `options.realtime_auth_header` | cadena | Solo OpenAI Realtime. Nombre del encabezado para la clave de API, por ejemplo `api-key` en algunas pasarelas. |
| `pricing` | mapa | Tabla de precios por modelo que se usa para estimar los costos en `AI_AGENT_USAGE`. Véase más abajo. |

### Cómo elegir Google u OpenAI

| Aspecto | Google | OpenAI |
| --- | --- | --- |
| Sesión de voz | `realtime_model` | `realtime_model` (SDK Realtime) o `live_model` (SDK Live) |
| Modelo de delegación de herramientas | Gestionado por el proveedor con `realtime_model` | `delegation_model` obligatorio con el SDK Live |
| Resumen | `summarize_model` | `summarize_model` |
| Opciones de detección de turnos | Predeterminada del proveedor | `semantic_vad`, `server_vad`, `none` |
| Modelo de facturación | Por token y por modalidad | Realtime: por token. Live: por minuto para la voz y por token para la delegación. |

Cualquier nombre de modelo que empiece por `gpt-live` usa el SDK Live. Todos los demás modelos de OpenAI usan el SDK Realtime. Esto incluye los servidores autoalojados compatibles con OpenAI.

## Tablas de precios

El bloque `pricing` le permite definir sus propias tarifas para que los artefactos de uso muestren un costo estimado. Las tarifas se expresan en su moneda por millón de tokens, o por minuto para la voz de Live. Estos precios solo se usan para las estimaciones de `AI_AGENT_USAGE`. No cambian lo que le cobra su proveedor.

Ejemplo para un modelo realtime de Google con tarifas por modalidad:

```yaml
pricing:
  realtime_model:
    input_price_per_million_tokens: 0.75          # entrada de texto
    audio_input_price_per_million_tokens: 3.00    # entrada de audio
    image_input_price_per_million_tokens: 1.00    # entrada de imagen
    output_price_per_million_tokens: 4.50         # salida de texto
    audio_output_price_per_million_tokens: 12.00  # salida de audio
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 1.50
```

Ejemplo para OpenAI Live, que factura la voz por minuto y la delegación por token:

```yaml
pricing:
  live_model:
    price_per_minute: 0.05
  delegation_model:
    input_price_per_million_tokens: 0.10
    cached_input_price_per_million_tokens: 0.01
    cache_write_input_price_per_million_tokens: 0.125
    output_price_per_million_tokens: 0.50
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 2.00
```

Las tarifas de tokens en caché y de escritura en caché son opcionales. Si no las define, los tokens en caché se cuentan como entrada sin caché en la estimación. El conjunto completo de campos de uso se describe en [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing).

## Clave propia por sala (BYOK)

El moderador puede aportar su propia cuenta de proveedor para una sala, en lugar de usar la cuenta del servidor. Se configura en el objeto `ai_agent_features.custom_provider` de la sala. Consulte la [Guía para desarrolladores y de la API](/docs/ai-agent/developer-guide#custom_provider-byok) para ver los nombres de los campos y un ejemplo de solicitud.

### Qué hace BYOK

- La sala usa el **proveedor, el endpoint y los modelos aportados por el moderador**.
- El servidor no usa su propia cuenta `ai_agent` para esa sala.
- El uso de esa sala queda **excluido de los artefactos de facturación de la plataforma**, porque el moderador paga directamente al proveedor.

### Ciclo de seguridad de la clave de API

La clave de API se trata como un secreto desde el momento en que llega:

1. **Se acepta en la solicitud de creación de la sala.** La clave llega en la solicitud `/auth/room/create`, como parte de `ai_agent_features.custom_provider`.
2. **Se elimina antes de compartir los metadatos.** Antes de guardar los metadatos de la sala en NATS o enviarlos a los participantes, el servidor elimina el objeto `custom_provider`. Los participantes nunca reciben la clave.
3. **Se almacena solo en Redis.** La clave se guarda bajo `pnm:ai_agent:<roomId>:provider_config`, con un TTL establecido por el servidor. No se escribe en la base de datos.
4. **La heredan las salas de grupo.** Cuando se inicia una sala de grupo 1 a 1, la configuración del proveedor se copia a la sala hija con el mismo TTL, de modo que la sesión puede ejecutarse sin volver a enviar la clave de la sala principal.
5. **Se elimina junto con la sala.** Cuando expiran los datos de Redis de la sala o esta finaliza, la clave desaparece.

:::caution Rote las claves después de usar la sala
Considere que cualquier clave enviada mediante BYOK queda expuesta a la Redis de su servidor. Use claves con límites de gasto y rótelas si su instancia de Redis es compartida o si no sabe quién puede leerla.
:::

## Valores predeterminados del servidor y límites de ajuste

El servidor rellena los valores predeterminados de cualquier campo que el moderador no haya definido y ajusta los valores fuera de rango. La tabla siguiente muestra los límites actuales. Los valores fuera de un rango se ajustan al valor permitido más cercano, en lugar de rechazarse.

| Ajuste | Predeterminado | Rango permitido | Notas |
| --- | --- | --- | --- |
| `max_session_seconds` | `1800` (30 min) | `60` a `7200` | Límite máximo por sesión. |
| `max_audio_minutes` | `120` | Hasta `240` | `0` significa usar el valor predeterminado del servidor. |
| `vision_debounce_ms` | `1200` | `500` a `5000` | Tiempo mínimo entre instantáneas de la pizarra. El cliente aplica además un mínimo de 4 segundos. |
| `vision_max_edge_px` | `1024` | `512` a `1600` | Lado más largo de la instantánea WebP. |
| `topic_anchor_interval_turns` | `6` | `3` a `12` | Frecuencia con la que se vuelve a incluir el anclaje de tema. |
| `knowledge_cache_ttl_seconds` | `3600` | `60` a `86400` | Duración de la caché de las páginas externas consultadas. |
| `speaking_rate` | `1.0` | `0.5` a `2.0` | Velocidad de la voz. |
| `max_concurrent_sessions` (`OPEN_PER_USER`) | Definido por el moderador | Límite del servidor `16` | Sesiones 1 a 1 simultáneas en una sala. |
| `allowed_participant_ids` (`CONTROLLED_USERS`) | Definido por el moderador | Hasta `32` | Participantes preautorizados. |
| `mcp_servers` | Ninguno | Máximo `2` por sala | Véase [Servidores MCP externos](/docs/ai-agent/developer-guide#servidores-mcp-externos-mcp_servers). |
| `allowed_tools` por servidor MCP | Ninguno | Máximo `8` | Solo herramientas de lectura. |
| `allowed_knowledge_urls` | Ninguno | Máximo `32` entradas | Solo HTTPS. |
| `strict_topic_enforcement` | `true` | | Declina las solicitudes fuera de tema. |

## Compatibilidad con E2EE

El Agente de IA necesita escuchar el audio y leer la pizarra. Estos requisitos determinan qué modos de E2EE admite.

| Configuración de E2EE de la sala | Agente de IA | Notas |
| --- | --- | --- |
| **E2EE desactivado** | Compatible | Voz, pizarra, bloc de notas y herramientas completas. |
| **E2EE activado con una clave gestionada por el servidor** | Compatible | El servidor tiene la clave, por lo que el agente puede recibirla. |
| **E2EE activado con una clave por dispositivo introducida por el propio usuario** (`enabled_self_insert_encryption_key: true`) | **No compatible** | El servidor no puede leer la clave, por lo que la creación de la sala con el Agente de IA se rechaza con un error de E2EE no compatible. |

Las funciones basadas en texto no se ven afectadas por esta tabla. Las reglas se describen en el [Resumen de seguridad](/docs/security-overview#53-el-impacto-del-cifrado-de-extremo-a-extremo-e2ee).

## Lista de comprobación antes de la puesta en marcha

1. Añada una cuenta de proveedor en `insights.providers` y pruebe la clave de API.
2. Configure `insights.services.ai_agent` con un modelo realtime y un modelo de resumen.
3. Añada entradas en `pricing` si desea estimaciones de costo precisas.
4. Reinicie el servidor y cree una sala de prueba con `is_allow: true` para el Agente de IA.
5. Confirme que una sesión 1 a 1 se inicia, habla, dibuja y genera un artefacto `AI_AGENT_SESSION_SUMMARY`.
6. Si usa BYOK, confirme que la clave no es visible en los metadatos de los participantes.

## Páginas relacionadas

- [Guía para desarrolladores y de la API](/docs/ai-agent/developer-guide)
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing)
- [Resumen de seguridad](/docs/security-overview)
- [Instalación](/docs/installation)
