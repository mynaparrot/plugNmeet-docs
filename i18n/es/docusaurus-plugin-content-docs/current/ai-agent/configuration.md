---
title: "Configuración del servidor de Insights: config.yaml, proveedores, modelos y precios"
description: "Referencia completa para configurar la plataforma Insights de plugNmeet en su servidor: cuentas de proveedor de Azure, Google y OpenAI, los seis servicios, límites de idiomas, tablas de precios, artifacts_settings y BYOK por sala."
keywords: [configuración de plugnmeet, proveedores de insights, configuración de transcripción, configuración de traducción, configuración de síntesis de voz, configuración de openai realtime, configuración de gemini live, configuración de azure cognitive services, precios del agente de ia, artifacts settings, byok proveedor de ia, servidor de ia autoalojado, avatar beyond presence, avatar ia anam, avatar simli, configuracion avatar ia]
sidebar_label: Configuración del Servidor y Proveedores
sidebar_position: 9
---

# Configuración del servidor y de los proveedores de Insights

Esta página es la referencia para los administradores del servidor. Explica cómo definir cuentas de proveedor de IA en `config.yaml`, cómo asignar cada servicio de Insights a un proveedor y a un modelo, cómo se declaran los precios, dónde se almacenan los artefactos y qué límites aplica el servidor.

:::info En desarrollo activo
**La transcripción en vivo (STT), la traducción, la síntesis de voz (TTS), el chat de texto con IA y el resumen de reuniones son funciones de producción estables**, y sus claves de configuración se documentan a continuación. Solo el Agente de IA por voz (`ai_agent`) y las nuevas capacidades agénticas de invocación de herramientas MCP están en desarrollo activo: las claves, los valores predeterminados y los proveedores compatibles del agente pueden cambiar antes del lanzamiento general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista una vez que el agente esté terminado y publicado; hasta entonces, el agente se habilita y se configura mediante la API de plugNmeet.
:::

## Cómo se estructura la configuración

La sección `insights` tiene dos partes:

1. **`providers`**: sus cuentas de proveedor, agrupadas por tipo (`azure`, `google`, `openai`). Cada cuenta tiene un `id` único y sus credenciales.
2. **`services`**: las funciones que usan esas cuentas. Cada entrada de servicio indica el proveedor, el `id` de la cuenta, sus `options` y su `pricing`.

Esta separación permite definir una credencial una sola vez y reutilizarla en varios servicios, o usar una cuenta distinta por servicio, por ejemplo Azure para la voz y Google para el resumen.

```yaml
insights:
  enabled: true
  providers:
    azure:
      - id: "eastus_standard"
        credentials:
          api_key: "YOUR_AZURE_SPEECH_KEY"
          region: "eastus"
      - id: "transGlobal"
        credentials:
          api_key: "YOUR_AZURE_TRANSLATOR_KEY"
          region: "global"
        options:
          endpoint: "https://api.cognitive.microsofttranslator.com"
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
    transcription:
      provider: "azure"
      id: "eastus_standard"
      options:
        max_selected_trans_langs: 2
      pricing:
        price_per_hour: 0.36
    translation:
      provider: "azure"
      id: "transGlobal"
      options:
        max_selected_trans_langs: 5
      pricing:
        price_per_million_characters: 10.00
    speech-synthesis:
      provider: "azure"
      id: "eastus_standard"
      options:
        voice-en: "en-US-JennyNeural"
        voice-bn: "bn-BD-NabanitaNeural"
        voice-fr: "fr-FR-DeniseNeural"
        voice-de: "de-DE-KatjaNeural"
        voice-es: "es-ES-ElviraNeural"
      pricing:
        price_per_million_characters: 16.00
    meeting_summarizing:
      provider: "google"
      id: "default-gemini-creds"
      options:
        summarize_model: "YOUR_SUMMARIZE_MODEL"
      pricing:
        summarize_model:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50
    ai_text_chat:
      provider: "google"
      id: "default-gemini-creds"
      options:
        chat_model: "YOUR_CHAT_MODEL"
        summarize_model: "YOUR_SUMMARIZE_MODEL"
        context_window: 5
      pricing:
        chat_model:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50
        summarize_model:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50
    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "YOUR_REALTIME_MODEL"
        summarize_model: "YOUR_SUMMARY_MODEL"
```

Sustituya los nombres de modelo y los identificadores de voz por valores a los que tenga acceso su cuenta de proveedor. El archivo `config_sample.yaml` que se distribuye con el servidor incluye ejemplos actualizados.

## `insights.providers`

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `providers.<type>` | lista | Sí | Tipo de proveedor: `azure`, `google`, `openai` o un proveedor de avatar (`beyond_presence`, `anam`, `simli`). |
| `id` | string | Sí | Nombre único de esta cuenta. Los servicios lo referencian. |
| `credentials.api_key` | string | Sí | Clave de API del proveedor. |
| `credentials.region` | string | Solo Azure | Región de Azure para los recursos de voz y de traducción. |
| `options.endpoint` | string | No | URL base personalizada. Se usa para el endpoint global del traductor de Azure, para pasarelas compatibles con OpenAI, para servidores autoalojados y para pasarelas de avatar. |
| `options.avatar_id` | string | Solo proveedores de avatar | Avatar o rostro predeterminado de la cuenta. Se usa cuando la sala no define `avatar_id`. |
| `options.auth_header` | string | Solo proveedores de avatar | Encabezado que transporta la clave en una pasarela propia, por ejemplo `x-api-key`. |

Los avatares se configuran como cuentas propias dentro de `insights.providers`, separadas de las cuentas de LLM:

```yaml
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

Una cuenta de avatar solo se usa cuando se define `ai_agent.options.avatar_provider` o cuando la sala pide un avatar. La sala puede aportar su propia clave y su propio endpoint. Consulte la guía de [Proveedores de Avatar](/docs/ai-agent/providers/avatar) para ver los endpoints, los encabezados de autenticación y el BYOK por sala.

Guarde las claves de API en un lugar seguro y restrinja los permisos de archivo de `config.yaml`.

## Matriz de capacidades por proveedor

No todos los proveedores implementan todos los servicios. Asigne cada servicio a una cuenta que lo admita.

| Servicio | `google` (Gemini) | `openai` (OpenAI y servidores compatibles o autoalojados) | `azure` (Cognitive Services nativos) |
| --- | --- | --- | --- |
| `transcription` | Sí, Gemini Live | Sí, WebSocket Realtime | Sí, voz a texto de Azure |
| `translation` | Sí, chat en modo JSON | Sí, chat en modo JSON | Sí, Azure Translator |
| `speech-synthesis` | Sí, Gemini TTS | Sí, `/v1/audio/speech` | Sí, voz neuronal por idioma |
| `ai_text_chat` | Sí | Sí | No |
| `meeting_summarizing` | Sí, trabajo por lotes con la API de archivos | Sí, transcripción por bloques más LLM | No |
| `ai_agent` | Sí, Gemini Live | Sí, SDK Realtime o Live con delegación | No |

`azure` nativo cubre solo los tres servicios de voz y no tiene motor de LLM. Para ejecutar `ai_text_chat`, `meeting_summarizing` y `ai_agent` en Azure, añada un recurso de Azure OpenAI como cuenta de `providers.openai` con `auth_header: "api-key"`; consulte la [guía de Microsoft Azure](/docs/ai-agent/providers/azure). Se admite combinar proveedores por servicio y cada servicio mantiene su propia tabla de precios.

Guías específicas por proveedor:

- [Guía del proveedor Google Gemini](/docs/ai-agent/providers/google): los seis servicios con una sola cuenta.
- [Guía del proveedor OpenAI y autoalojados](/docs/ai-agent/providers/openai): OpenAI Cloud, servidores compatibles con OpenAI (vLLM, Ollama, LiteLLM, Kokoro) y enrutamiento con varias cuentas.
- [Guía del proveedor Microsoft Azure](/docs/ai-agent/providers/azure): servicios de voz nativos más Azure OpenAI para los servicios de LLM.

## `insights.services`

Todos los servicios aceptan las mismas tres claves de nivel superior (`provider`, `id` y `options`) más un mapa `pricing` opcional. Las opciones y las tarifas varían según el servicio.

### `transcription`

```yaml
transcription:
  provider: "azure"
  id: "eastus_standard"
  options:
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.max_selected_trans_langs` | entero | Número máximo de idiomas de subtítulos simultáneos que puede elegir una sala. Predeterminado `2`. Las solicitudes por encima del límite se ajustan a él. |
| `pricing.default.price_per_hour` | número | Tarifa usada para estimar el costo de `SPEECH_TRANSCRIPTION_USAGE` a partir de la duración transcrita. |

El número de idiomas es un límite del servidor, no un ajuste de la sala. El anfitrión no puede elevarlo desde la API.

### `translation`

```yaml
translation:
  provider: "azure"
  id: "transGlobal"
  options:
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.max_selected_trans_langs` | entero | Número máximo de idiomas de destino para la traducción del chat. Predeterminado `5`. Es un límite distinto del de los subtítulos. |
| `pricing.default.price_per_million_characters` | número | Tarifa usada para estimar el costo de `CHAT_TRANSLATION_USAGE` a partir de los caracteres traducidos. La traducción se mide por número de caracteres, no por tokens. |

En Azure, este servicio debe apuntar a la cuenta del traductor, cuyo `options.endpoint` es la URL completa de la petición `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`. Las listas de opciones de cada proveedor están en las [guías por proveedor](#matriz-de-capacidades-por-proveedor).

### `speech-synthesis`

```yaml
speech-synthesis:
  provider: "azure"
  id: "eastus_standard"
  options:
    voice-en: "en-US-JennyNeural"
    voice-bn: "bn-BD-NabanitaNeural"
    voice-fr: "fr-FR-DeniseNeural"
    voice-de: "de-DE-KatjaNeural"
    voice-es: "es-ES-ElviraNeural"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.voice-<lang>` | string | Solo Azure. Voz usada al sintetizar un idioma de destino, por ejemplo `voice-en`, `voice-es`, `voice-fr`, `voice-de`, `voice-bn`. Un idioma sin voz configurada no se puede leer en voz alta. |
| `options.default_voice` | string | Google y OpenAI. Voz única usada para todos los idiomas, por ejemplo `"Kore"` o `"alloy"`. |
| `options.tts_sample_rate` | entero | Solo Google. Frecuencia de muestreo PCM: `8000`, `16000` (predeterminado) o `24000`. |
| `pricing.default.price_per_million_characters` | número | Tarifa usada para estimar el costo de `SYNTHESIZED_SPEECH_USAGE` a partir de los caracteres sintetizados. |

El servidor inicia un proceso TTS por cada idioma de destino autorizado que tenga voz. Limite los identificadores de voz a voces que su cuenta admita; un identificador inválido afecta a ese idioma, no a toda la sesión.

### `meeting_summarizing`

```yaml
meeting_summarizing:
  provider: "google"
  id: "default-gemini-creds"
  options:
    summarize_model: "YOUR_SUMMARIZE_MODEL"
  pricing:
    summarize_model:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.summarize_model` | string | Modelo usado para el resumen posterior a la reunión. |
| `pricing.<model>.input_price_per_million_tokens` | número | Tarifa de tokens de entrada para las estimaciones de costo. |
| `pricing.<model>.output_price_per_million_tokens` | número | Tarifa de tokens de salida para las estimaciones de costo. |

Los costos aparecen en `MEETING_SUMMARY_USAGE` y se leen de `pricing[summarize_model]`. Si esa entrada no existe, el registro de uso se escribe sin estimación. Consulte [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization).

### `ai_text_chat`

```yaml
ai_text_chat:
  provider: "google"
  id: "default-gemini-creds"
  options:
    chat_model: "YOUR_CHAT_MODEL"
    summarize_model: "YOUR_SUMMARIZE_MODEL"
    context_window: 5
  pricing:
    chat_model:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
    summarize_model:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.chat_model` | string | Modelo para los turnos de chat interactivos, incluidas las llamadas a herramientas del copiloto para moderadores. |
| `options.summarize_model` | string | Modelo usado para comprimir los turnos antiguos en el resumen progresivo de la conversación (`CheckAndSummarize`). |
| `options.context_window` | entero | Número de turnos recientes que se conservan íntegros en Redis. Predeterminado `5`. |
| `pricing.chat_model` | mapa | Tarifas de tokens de entrada y salida usadas para `AI_TEXT_CHAT_INTERACTION_USAGE`. |
| `pricing.summarize_model` | mapa | Tarifas de tokens de entrada y salida usadas para `AI_TEXT_CHAT_SUMMARIZATION_USAGE`. |

Aquí suele bastar con un `summarize_model` más económico, porque solo comprime el historial. El comportamiento completo en tiempo de ejecución está en [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat).

### `ai_agent`

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `provider` | string | Tipo de proveedor que se usa: `google` u `openai`. |
| `id` | string | Identificador de la cuenta definida en `providers`. |
| `options.realtime_model` | string | Modelo de la sesión de voz bidireccional (audio de entrada y de salida). Lo usan ambos proveedores. |
| `options.live_model` | string | Solo OpenAI. Modelo de voz para el SDK Live. Úselo en lugar de `realtime_model` cuando quiera el SDK Live. Requiere `delegation_model`. |
| `options.delegation_model` | string | Solo OpenAI Live. Modelo de texto que recibe las llamadas a herramientas del modelo de voz. Obligatorio cuando se define `live_model`. |
| `options.summarize_model` | string | Modelo de texto usado una vez al final de la sesión para refinar el artefacto `AI_AGENT_SESSION_SUMMARY`. Si no se define, el servidor usa el `summarize_model` de `ai_text_chat` o de `meeting_summarizing` del mismo proveedor y, si tampoco existe, un resumen local determinista. |
| `options.default_voice` | string | Identificador de voz usado cuando la sala no define `voice`. Debe ser una voz compatible con su proveedor. |
| `options.turn_detection` | string | Solo OpenAI Realtime. `semantic_vad` (predeterminado), `server_vad` o `none`. Los servidores autoalojados suelen necesitar `server_vad` o `none`. |
| `options.input_transcription_model` | string | Solo OpenAI Realtime. Modelo de transcripción de la voz del alumno. Use `none` para desactivar la transcripción de entrada. |
| `options.realtime_auth_header` | string | Solo OpenAI Realtime. Nombre del encabezado de la clave de API, por ejemplo `api-key` en algunas pasarelas. |
| `options.avatar_provider` | string | Avatar en tiempo real predeterminado: `beyond_presence`, `anam` o `simli`. Las salas pueden sustituirlo. |
| `options.avatar_id` | string | Avatar o rostro predeterminado de `avatar_provider`. |
| `options.avatar_account_id` | string | `id` de la cuenta en `providers.<avatar_provider>` de la que se toma la clave. |
| `pricing` | mapa | Tabla de precios por modelo usada para las estimaciones de costo en `AI_AGENT_USAGE` y `AI_AGENT_AVATAR_USAGE`. Vea a continuación. |

#### Cómo elegir Google u OpenAI para el agente de voz

| Aspecto | Google | OpenAI |
| --- | --- | --- |
| Sesión de voz | `realtime_model` | `realtime_model` (SDK Realtime) o `live_model` (SDK Live) |
| Modelo para delegar herramientas | Gestionado por el proveedor con `realtime_model` | Se requiere `delegation_model` con el SDK Live |
| Resumen | `summarize_model` | `summarize_model` |
| Opciones de detección de turnos | Valor predeterminado del proveedor | `semantic_vad`, `server_vad`, `none` |
| Forma de facturación | Por token y por modalidad | Realtime: por token. Live: por minuto en voz y por token en delegación. |

Cualquier nombre de modelo que empiece por `gpt-live` usa el SDK Live. El resto de los modelos de OpenAI usan el SDK Realtime, incluidos los servidores autoalojados compatibles con OpenAI.

## Tablas de precios

El bloque `pricing` le permite fijar sus propias tarifas para que los artefactos de uso muestren un costo estimado. Estos precios solo se usan para las estimaciones; no cambian lo que le cobra su proveedor.

Las tarifas de tokens son por millón de tokens. Los servicios de voz usan tarifas por hora o por carácter, como se indica arriba. Ejemplo de un modelo realtime de Google con tarifas por modalidad:

```yaml
pricing:
  realtime_model:
    input_price_per_million_tokens: 0.75          # text input
    audio_input_price_per_million_tokens: 3.00    # audio input
    image_input_price_per_million_tokens: 1.00    # image input
    output_price_per_million_tokens: 4.50         # text output
    audio_output_price_per_million_tokens: 12.00  # audio output
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 1.50
```

Ejemplo de OpenAI Live, que factura la voz por minuto y la delegación por token:

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

El avatar en tiempo real se factura por minuto de video generado:

```yaml
pricing:
  avatar_model:
    price_per_minute: 0.10
  # Opcional: precio distinto para cada proveedor de avatar. Un bloque
  # con el nombre del proveedor tiene prioridad sobre avatar_model.
  simli:
    price_per_minute: 0.08
```

Las tarifas de caché y de escritura de caché son opcionales. Sin ellas, los tokens en caché se facturan como entrada no cacheada en la estimación. El conjunto completo de campos de uso se describe en [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing).

## `artifacts_settings`

Los artefactos (transcripciones, resúmenes y exportaciones de analíticas) se escriben en disco y se sirven con tokens de descarga de corta duración. El bloque `artifacts_settings` controla dónde se guardan y cómo se gestiona su eliminación.

```yaml
artifacts_settings:
  storage_path: "./storage/artifacts"
  token_validity: 3600
  enable_del_artifacts_backup: true
  del_artifacts_backup_path: "./storage/artifacts_backup"
  del_artifacts_backup_duration: 30
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `storage_path` | string | Directorio donde se escriben los archivos de artefactos. El proceso del servidor debe poder escribir en él. |
| `token_validity` | entero | Periodo de validez de los tokens de descarga emitidos por `/auth/artifact/getDownloadToken`. |
| `enable_del_artifacts_backup` | booleano | Con `true`, al eliminar un artefacto se mueve una copia a la ruta de respaldo en lugar de descartarlo. |
| `del_artifacts_backup_path` | string | Directorio usado para las copias de artefactos eliminados. |
| `del_artifacts_backup_duration` | entero | Tiempo durante el cual se conservan los artefactos eliminados antes de purgar la copia de respaldo. |

Los valores predeterminados y las unidades se definen en el `config_sample.yaml` de su versión del servidor. Si ejecuta varias instancias, apunte `storage_path` a un almacenamiento compartido; de lo contrario, una solicitud de descarga atendida por otra instancia no encontrará el archivo.

## Clave propia por sala (BYOK)

Un anfitrión puede aportar su propia cuenta de proveedor para una sala en lugar de usar la cuenta del servidor. Se configura en el objeto `ai_agent_features.custom_provider` de la sala. Una clave de avatar se aporta de la misma forma, mediante `ai_agent_features.avatar`. Consulte la [Guía para desarrolladores y API](/docs/ai-agent/developer-guide#custom_provider-byok) para ver los nombres de los campos y un ejemplo de solicitud.

### Qué hace BYOK

- La sala usa el **proveedor, el endpoint y los modelos aportados por el anfitrión**.
- El servidor no utiliza su propia cuenta de `ai_agent` para esa sala.
- El uso de esa sala **queda excluido de los artefactos de facturación de la plataforma**, porque el anfitrión paga directamente al proveedor.

### Ciclo de seguridad de la clave de API

La clave de API se trata como un secreto desde el momento en que llega:

1. **Se recibe en la solicitud de creación de la sala.** La clave llega en la solicitud a `/auth/room/create`, como parte de `ai_agent_features.custom_provider`.
2. **Se elimina antes de publicar los metadatos.** Antes de guardar los metadatos de la sala en NATS o de enviarlos a los participantes, el servidor elimina el objeto `custom_provider`, además de `avatar.api_key`, `avatar.endpoint` y `avatar.auth_header`. Los participantes nunca los reciben.
3. **Se guarda solo en Redis.** La clave se almacena en `pnm:ai_agent:<roomId>:provider_config`, con un TTL definido por el servidor. No se escribe en la base de datos. El proveedor de avatar y la clave de la sala comparten ese registro.
4. **La heredan las salas para grupos pequeños.** Cuando se inicia una sala secundaria 1 a 1, la configuración del proveedor se copia a esa sala con el mismo TTL, de modo que la sesión puede ejecutarse sin reenviar la clave de la sala principal.
5. **Desaparece con la sala.** Cuando caducan los datos de Redis de la sala o la sala termina, la clave ya no existe.

:::caution Rote las claves después de usar la sala
Considere cualquier clave enviada por BYOK como expuesta al Redis de su servidor. Use claves con límites de gasto y rótelas si su instancia de Redis es compartida o si no sabe con certeza quién puede leerla.
:::

## Valores predeterminados del servidor y límites de ajuste

El servidor rellena los valores predeterminados de los campos que el anfitrión no define y ajusta los valores fuera de rango. La tabla siguiente recoge los límites actuales. Los valores fuera de rango se ajustan al valor permitido más cercano; no se rechazan.

| Ajuste | Predeterminado | Rango permitido | Notas |
| --- | --- | --- | --- |
| `max_session_seconds` | `1800` (30 min) | `60` a `7200` | Límite máximo por sesión del Agente de IA. |
| `max_audio_minutes` | `120` | Hasta `240` | `0` significa usar el valor predeterminado del servidor. |
| `max_avatar_minutes` | `0` | Hasta `240` | `0` significa usar el valor predeterminado del servidor. Limita el video de avatar facturable de la sala. |
| Cuotas de `activity_rules` | `0` | `0` a `20` | Cada una de las cuatro cuotas de actividad mínima. `0` desactiva esa cuota. |
| `activity_rules.required_milestones` | Ninguno | Hasta `16` elementos | Cada hito se limita a 240 caracteres. Se conserva el orden. |
| `vision_debounce_ms` | `1200` | `500` a `5000` | Tiempo mínimo entre instantáneas de la pizarra. El cliente aplica además un mínimo de 4 segundos. |
| `vision_max_edge_px` | `1024` | `512` a `1600` | Borde más largo de la instantánea WebP. |
| `topic_anchor_interval_turns` | `6` | `3` a `12` | Frecuencia con la que se vuelve a inyectar el anclaje de tema. |
| `knowledge_cache_ttl_seconds` | `3600` | `60` a `86400` | Duración de la caché de las páginas externas consultadas. |
| `speaking_rate` | `1.0` | `0.5` a `2.0` | Velocidad del habla. |
| `transcription.options.max_selected_trans_langs` | `2` | Todo el servidor | Idiomas de subtítulos por sala. |
| `translation.options.max_selected_trans_langs` | `5` | Todo el servidor | Idiomas de traducción del chat por sala. |
| `ai_text_chat.options.context_window` | `5` | Todo el servidor | Turnos íntegros que se conservan antes del resumen progresivo. |
| `max_concurrent_sessions` (`OPEN_PER_USER`) | Lo define el anfitrión | Límite del servidor `16` | Sesiones 1 a 1 simultáneas en una sala. |
| `allowed_participant_ids` (`CONTROLLED_USERS`) | Lo define el anfitrión | Hasta `32` | Participantes preautorizados. |
| `mcp_servers` | Ninguno | Máximo `2` por sala | Consulte [Servidores MCP externos](/docs/ai-agent/developer-guide#servidores-mcp-externos-mcp_servers). |
| `allowed_tools` por servidor MCP | Ninguno | Máximo `8` | Solo herramientas de solo lectura. |
| `allowed_knowledge_urls` | Ninguno | Máximo `32` entradas | Solo HTTPS. |
| `strict_topic_enforcement` | `true` | | Rechaza las peticiones fuera de tema. |

## Compatibilidad con E2EE

Los servicios de voz del servidor y el Agente de IA necesitan escuchar el audio, y el agente necesita leer la pizarra. Esos requisitos determinan qué modos de E2EE son compatibles.

| Ajuste de E2EE de la sala | Servicios de voz y Agente de IA | Notas |
| --- | --- | --- |
| **E2EE desactivado** | Compatible | Voz, subtítulos, pizarra, bloc de notas y herramientas completos. |
| **E2EE activado con una clave gestionada por el servidor** | Compatible | El servidor tiene la clave, así que puede descifrar el audio y publicar pistas sintetizadas. |
| **E2EE activado con una clave insertada por dispositivo** (`enabled_self_insert_encryption_key: true`) | **No compatible** | El servidor no puede leer la clave, así que la transcripción en el servidor no puede descifrar el audio y la creación de salas del Agente de IA se rechaza con un error de E2EE no compatible. |
| **Cualquier E2EE, con `avatar.is_enabled`** | **No compatible** | El proveedor de avatar es un bot de medios externo: debe unirse a la sala sin cifrado, así que una sala con avatar se rechaza salvo que el E2EE esté completamente desactivado. |

Las funciones basadas en texto, como la traducción del chat y el chat de texto con IA, no se ven afectadas por esta tabla. Las reglas se describen en el [Resumen de seguridad](/docs/security-overview#53-el-impacto-del-cifrado-de-extremo-a-extremo-e2ee).

## Lista de comprobación antes de la puesta en marcha

1. Añada las cuentas de proveedor en `insights.providers` y pruebe cada clave de API.
2. Asigne `transcription`, `translation` y `speech-synthesis` a un proveedor que los admita y configure voces para cada idioma hablado.
3. Asigne `meeting_summarizing` y `ai_text_chat` a una cuenta con acceso a los modelos configurados.
4. Configure `insights.services.ai_agent` con un modelo realtime y un modelo de resumen.
5. Añada las entradas de `pricing` si desea estimaciones de costo precisas.
6. Defina `artifacts_settings.storage_path` en un directorio con permisos de escritura y en un almacenamiento compartido si ejecuta más de una instancia.
7. Reinicie el servidor y cree una sala de prueba con las marcas de `insights_features` correspondientes habilitadas.
8. Confirme que se generan una pista de subtítulos, un artefacto de resumen y una respuesta del chat de IA, y que los artefactos de uso incluyen un costo estimado.
9. Si usa BYOK, confirme que la clave no es visible en los metadatos de los participantes.

## Páginas relacionadas

- [Descripción general e Insights](/docs/ai-agent/overview)
- [Guía del proveedor Google Gemini](/docs/ai-agent/providers/google)
- [Guía del proveedor OpenAI y autoalojados](/docs/ai-agent/providers/openai)
- [Guía del proveedor Microsoft Azure](/docs/ai-agent/providers/azure)
- [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation)
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization)
- [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat)
- [Guía para desarrolladores y API](/docs/ai-agent/developer-guide)
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing)
- [Resumen de seguridad](/docs/security-overview)
- [Instalación](/docs/installation)
