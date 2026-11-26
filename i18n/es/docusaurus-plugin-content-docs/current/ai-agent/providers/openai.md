---
title: "Guía del proveedor OpenAI y autoalojados: agente de voz realtime, Whisper, TTS y LLM locales"
description: "Configure OpenAI y endpoints compatibles con OpenAI en plugNmeet: transcripción con el SDK Realtime, traducción de chat, síntesis de voz, llamadas a herramientas MCP, resumen de reuniones por bloques y dos arquitecturas de agente, incluida una pila autoalojada Live más delegación sobre vLLM, Ollama o LiteLLM."
keywords: [agente de voz openai realtime, llm autoalojado videoconferencia, api realtime de openai, openai live sdk delegación, vllm ollama whisper kokoro tts, configuración de precios openai plugnmeet, transcripción con whisper, tts compatible con openai, endpoint compatible con openai, enrutamiento de varias cuentas, agente de voz autoalojado, gpt realtime en reuniones]
sidebar_label: OpenAI y autoalojados
sidebar_position: 2
---

# Guía del proveedor OpenAI y autoalojados

El proveedor `openai` cubre tres casos a la vez:

1. **OpenAI Cloud**: los seis servicios de Insights.
2. **Cualquier servidor compatible con OpenAI**: vLLM, Ollama, LiteLLM, LocalAI, Kokoro/openedai-speech, servidores faster-whisper y pasarelas. Apunte `options.endpoint` al servidor y el mismo código de servicio funciona sin cambios.
3. **Varias cuentas**: defina varias entradas en `providers.openai` con `id` y endpoints distintos y después dirija cada servicio a la cuenta que deba atenderlo.

Como los nombres de modelo son cadenas libres, las implantaciones autoalojadas usan sus propios identificadores de modelo (una etiqueta de Ollama, un nombre servido por vLLM) y sus propias tarifas.

## Servicios compatibles

| Servicio | Transporte | Modelo predeterminado |
| --- | --- | --- |
| `transcription` | WebSocket Realtime, `intent=transcription` | `gpt-realtime-whisper` |
| `translation` | `chat.completions` con modo de respuesta JSON | `gpt-5.4-mini` |
| `speech-synthesis` | `POST /v1/audio/speech`, PCM sin procesar a 24 kHz | `gpt-4o-mini-tts` |
| `ai_text_chat` | Completados de chat en streaming más llamadas a herramientas MCP | `chat_model` obligatorio, por ejemplo `gpt-5.4` |
| `meeting_summarizing` | `/v1/audio/transcriptions` más resumen con chat | `gpt-4o-transcribe` |
| `ai_agent` | SDK Realtime **o** SDK Live más delegación | `gpt-realtime-2.1-mini` / `gpt-live-1` |

## Configuración de la cuenta del proveedor

```yaml
insights:
  providers:
    openai:
      - id: "default-openai"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"
          auth_header: "Authorization"
```

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `id` | string | Sí | Nombre único de la cuenta, por ejemplo `"default-openai"`, `"local-vllm"` o `"local-whisper"`. |
| `credentials.api_key` | string | Sí | Clave de API. Los servidores autoalojados que no verifican claves igualmente esperan un valor no vacío. |
| `options.endpoint` | string | No | URL base. De forma predeterminada, `https://api.openai.com/v1`. En los servicios WebSocket (`/realtime` y `/live`), `http` y `https` se convierten automáticamente en `ws` y `wss`. |
| `options.auth_header` | string | No | Encabezado que transporta la clave. El valor predeterminado `"Authorization"` envía `Authorization: Bearer <api_key>`. `"api-key"` envía `api-key: <key>`, que es lo que esperan Azure OpenAI y algunas pasarelas. Cualquier otro nombre envía `<header>: <key>`. |

Varias cuentas, una por backend:

```yaml
insights:
  providers:
    openai:
      - id: "default-openai"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"
      - id: "local-vllm"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.10:8000/v1"
      - id: "local-whisper"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.11:9000/v1"
```

Después, los servicios referencian esos `id` de forma independiente.

## Configuración de los servicios

### `transcription`

Abre el WebSocket Realtime con `intent=transcription` y envía en streaming el habla capturada como tramas PCM. A diferencia del agente de chat, esta conexión usa la intención de transcripción, así que el servidor nunca recibe audio generado de vuelta.

```yaml
transcription:
  provider: "openai"
  id: "default-openai"
  options:
    realtime_transcription_model: "gpt-realtime-whisper"
    transcription_turn_detection: "manual"
    input_sample_rate: 16000
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.realtime_transcription_model` | string | `"gpt-realtime-whisper"` | Modelo de transcripción en tiempo real. |
| `options.transcription_turn_detection` | string | `"manual"` | `"semantic_vad"` o `"server_vad"` dejan que el proveedor decida los límites de cada intervención. `"manual"` (alias `"none"`) hace que el servidor confirme los segmentos por sí mismo, con los temporizadores de confirmación siguientes. |
| `options.input_sample_rate` | entero | `16000` | Frecuencia de muestreo del audio enviado al proveedor. |
| `options.transcription_min_commit_ms` | entero | `1500` | Audio mínimo acumulado antes de una confirmación manual. |
| `options.transcription_silence_commit_ms` | entero | `900` | Duración de silencio que desencadena una confirmación. |
| `options.transcription_max_commit_ms` | entero | `12000` | Tope máximo de audio acumulado, para que un monólogo largo siga generando subtítulos. |
| `options.transcription_max_buffered_silence_ms` | entero | `400` | Silencio que se mantiene en el búfer como contexto, para que el siguiente segmento empiece con un poco de entrada previa. |
| `options.transcription_speech_rms` | entero | `500` | Amplitud RMS considerada habla. Súbala en salas ruidosas y bájela con oradores que hablan bajo. |
| `options.max_selected_trans_langs` | entero | `2` | Número máximo de idiomas de subtítulos simultáneos por sala. |

Los temporizadores de confirmación solo se aplican con confirmación manual. Con `semantic_vad` o `server_vad`, el proveedor emite los límites de segmento por sí mismo.

### `translation`

Usa `chat.completions` en modo de respuesta JSON para traducir todos los idiomas de destino solicitados en una sola petición.

```yaml
translation:
  provider: "openai"
  id: "default-openai"
  options:
    model: "gpt-5.4-mini"
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.model` | string | `"gpt-5.4-mini"` | Modelo de traducción. Sirve cualquier modelo capaz de chat, incluido uno local. |
| `options.max_selected_trans_langs` | entero | `5` | Número máximo de idiomas de destino por sala. |

Un modelo local en vLLM, Ollama o LiteLLM encaja bien aquí: el tráfico de traducción es de alto volumen y de textos cortos.

### `speech-synthesis`

Llama a `/v1/audio/speech` y recibe PCM sin procesar a **24 kHz**, listo para enviarse a los participantes.

```yaml
speech-synthesis:
  provider: "openai"
  id: "default-openai"
  options:
    model: "gpt-4o-mini-tts"
    default_voice: "alloy"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.model` | string | `"gpt-4o-mini-tts"` | Modelo de TTS. |
| `options.default_voice` | string | `"alloy"` | Nombre de la voz. Los valores válidos dependen de su modelo o servidor. |

Los servidores TTS compatibles con OpenAI exponen sus propios nombres de voz, por ejemplo las voces de Kokoro en `openedai-speech`. El endpoint devuelve PCM a 24 kHz sea cual sea la voz.

### `ai_text_chat`

Completados de chat en streaming, con llamadas a herramientas MCP mediante `AITextChatStreamWithTools`.

```yaml
ai_text_chat:
  provider: "openai"
  id: "local-vllm"
  options:
    chat_model: "gpt-5.4"
    summarize_model: "gpt-5.4-mini"
    context_window: 5
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `options.chat_model` | string | Sí | Modelo para la conversación en vivo y las llamadas a herramientas. |
| `options.summarize_model` | string | No, predeterminado `"gpt-5.4-mini"` | Modelo usado para condensar el contexto. |
| `options.context_window` | entero | No, predeterminado `5` | Mensajes recientes que se conservan íntegros por conversación. |

:::tip
En un servidor local, `chat_model` debe ser el **nombre del modelo servido** (lo que informa `/v1/models`), no el modelo del registro upstream. Debe admitir llamadas a funciones si desea que los moderadores usen las herramientas de sala.
:::

### `meeting_summarizing`

Se ejecuta como un trabajo en segundo plano seguido en Redis. La grabación mezclada se divide en segmentos WAV de **20 MB o menos**, cada segmento se transcribe con `/v1/audio/transcriptions` y la transcripción combinada se resume con completados de chat.

```yaml
meeting_summarizing:
  provider: "openai"
  id: "default-openai"
  options:
    transcription_model: "gpt-4o-transcribe"
    summarize_model: "gpt-5.4-mini"
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.transcription_model` | string | `"gpt-4o-transcribe"` | Modelo usado en cada bloque de audio. |
| `options.summarize_model` | string | `"gpt-5.4-mini"` | Modelo usado para el resumen final. |

El troceado mantiene las grabaciones largas dentro de los límites de carga; todos los bloques se fusionan en una sola transcripción antes de resumir.

### `ai_agent`

El agente tiene **dos arquitecturas**. Ambas hablan, ven fotogramas y llaman a herramientas; se diferencian en dónde ocurre el razonamiento.

#### Modo 1: SDK Realtime

Voz a voz de extremo a extremo sobre la API Realtime, con llamadas a herramientas nativas y visión. Configure `realtime_model` y deje `live_model` sin definir.

```yaml
ai_agent:
  provider: "openai"
  id: "default-openai"
  options:
    realtime_model: "gpt-realtime-1.5"
    summarize_model: "gpt-5.4-mini"
    default_voice: "marin"
    turn_detection: "semantic_vad"
    input_transcription_model: "gpt-transcribe"
    realtime_auth_header: "Authorization"
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.realtime_model` | string | `"gpt-realtime-2.1-mini"` | Modelo realtime de voz a voz. |
| `options.summarize_model` | string | ninguno | Modelo para el resumen al final de la sesión. |
| `options.default_voice` | string | `"marin"` | Voz predeterminada del agente. Las salas pueden elegir otra voz con `ai_agent_features.voice`. |
| `options.turn_detection` | string | `"semantic_vad"` | `"semantic_vad"`, `"server_vad"` o `"none"` para un control tipo pulsar para hablar. |
| `options.input_transcription_model` | string | `"gpt-transcribe"` | Transcribe la voz de los participantes para el registro de artefactos. Defina `"none"` para desactivarla. |
| `options.realtime_auth_header` | string | `"Authorization"` | Encabezado usado en el WebSocket Realtime. Defina `"api-key"` para Azure OpenAI y algunas pasarelas. |

#### Modo 2: SDK Live con delegación

Un modelo de voz rápido gestiona el audio de entrada y de salida, mientras que un modelo de texto y visión independiente se encarga del razonamiento y de las llamadas a herramientas.

```yaml
ai_agent:
  provider: "openai"
  id: "local-live"
  options:
    live_model: "gpt-live-1"
    delegation_model: "gpt-5.4-mini"
    summarize_model: "gpt-5.4-mini"
    default_voice: "marin"
  pricing:
    live_model:
      price_per_minute: 0.05
    delegation_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 2.00
    summarize_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 1.50
```

El modo 2 se activa cuando se configura `live_model` o cuando `realtime_model` empieza por `gpt-live` (el modelo Live predeterminado es `gpt-live-1`).

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `options.live_model` | string | Sí para el modo 2 | Modelo de voz de entrada y salida, por ejemplo `gpt-live-1` o una implantación autoalojada de Voxtral o Ultravox. |
| `options.delegation_model` | string | **Sí para el modo 2** | Modelo de razonamiento de texto y visión que recibe transcripciones, fotogramas y resultados de herramientas. Puede ser cualquier modelo capaz de chat, incluido uno local en vLLM. |
| `options.summarize_model` | string | No | Modelo del resumen de la sesión. |

:::warning
Si se define `live_model`, `delegation_model` es **obligatorio al arrancar el servidor**. La falta de `delegation_model` detiene el servidor en lugar de recurrir silenciosamente al comportamiento de Realtime.
:::

El modo 2 es la forma habitual de ejecutar agentes de voz autoalojados: modelos de voz como Voxtral o Ultravox son rápidos pero flojos en llamadas a herramientas, así que un LLM independiente se encarga de la planificación, de las herramientas MCP y de las consultas a la sala.

## Configuración autoalojada e híbrida

Un reparto práctico: modelos locales económicos para el texto de alto volumen y modelos en la nube donde la calidad importa:

```yaml
insights:
  enabled: true
  providers:
    openai:
      # Local text models: vLLM, Ollama, and LiteLLM all expose /v1
      - id: "local-vllm"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.10:8000/v1"

      # Local OpenAI-compatible TTS, e.g. Kokoro via openedai-speech
      - id: "local-tts"
        credentials:
          api_key: "local"
        options:
          endpoint: "http://10.0.0.12:8000/v1"

      # OpenAI Cloud for the agent
      - id: "default-openai"
        credentials:
          api_key: "YOUR_OPENAI_API_KEY"
        options:
          endpoint: "https://api.openai.com/v1"

  services:
    transcription:
      provider: "openai"
      id: "default-openai"
      options:
        realtime_transcription_model: "gpt-realtime-whisper"
        input_sample_rate: 16000
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36

    translation:
      provider: "openai"
      id: "local-vllm"
      options:
        model: "Qwen/Qwen3-8B-Instruct"
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 0.00

    speech-synthesis:
      provider: "openai"
      id: "local-tts"
      options:
        model: "kokoro"
        default_voice: "af_heart"
      pricing:
        default:
          price_per_million_characters: 0.00

    ai_text_chat:
      provider: "openai"
      id: "local-vllm"
      options:
        chat_model: "Qwen/Qwen3-8B-Instruct"
        summarize_model: "Qwen/Qwen3-8B-Instruct"
        context_window: 5
      pricing:
        default:
          input_price_per_million_tokens: 0.00
          output_price_per_million_tokens: 0.00

    meeting_summarizing:
      provider: "openai"
      id: "default-openai"
      options:
        transcription_model: "gpt-4o-transcribe"
        summarize_model: "gpt-5.4-mini"
      pricing:
        default:
          input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 10.00

    ai_agent:
      provider: "openai"
      id: "default-openai"
      options:
        realtime_model: "gpt-realtime-1.5"
        summarize_model: "gpt-5.4-mini"
        default_voice: "marin"
        turn_detection: "semantic_vad"
```

Las tarifas en cero son válidas: los artefactos de uso informan entonces `estimated_cost: 0`, lo que es exacto para el hardware que ya ejecuta. Para funcionar todo en local, sustituya la cuenta en la nube de `transcription`, `meeting_summarizing` y `ai_agent` por cuentas locales. Tanto Live como la delegación aceptan cualquier endpoint compatible con OpenAI.

## Configuración de precios

| Servicio | Clave de precios |
| --- | --- |
| `transcription` | `pricing.default.price_per_hour` |
| `translation` | `pricing.default.price_per_million_characters` (`CHAT_TRANSLATION_USAGE` medida en caracteres) |
| `speech-synthesis` | `pricing.default.price_per_million_characters` |
| `ai_text_chat` | `pricing.<chat_model>` y `pricing.<summarize_model>`, o `pricing.default` |
| `meeting_summarizing` | `pricing.<summarize_model>`, o `pricing.default` |
| `ai_agent` modo 1 | Tarifas multimodales por token en `pricing.realtime_model` |
| `ai_agent` modo 2 | `pricing.live_model.price_per_minute` más las tarifas por token de `pricing.delegation_model` y `pricing.summarize_model` |

### Tarifas por token (Realtime, chat, resumen y delegación)

`input_price_per_million_tokens` y `output_price_per_million_tokens` son el mínimo para el chat y el resumen. Los modelos realtime multimodales añaden los campos por modalidad que se indican a continuación, y las mismas claves se aceptan en `delegation_model` cuando admite audio o imágenes directamente:

| Clave | Cubre |
| --- | --- |
| `input_price_per_million_tokens` | Texto de entrada |
| `cached_input_price_per_million_tokens` | Texto de entrada en caché |
| `cache_write_input_price_per_million_tokens` | Texto escrito en la caché de instrucciones |
| `audio_input_price_per_million_tokens` | Voz de los participantes |
| `audio_cached_input_price_per_million_tokens` | Audio de entrada en caché |
| `audio_cache_write_input_price_per_million_tokens` | Audio escrito en la caché de instrucciones |
| `image_input_price_per_million_tokens` | Fotogramas de la pizarra y del uso compartido |
| `image_cached_input_price_per_million_tokens` | Imágenes de entrada en caché |
| `image_cache_write_input_price_per_million_tokens` | Imágenes escritas en la caché de instrucciones |
| `output_price_per_million_tokens` | Texto de salida, incluidos los tokens de razonamiento |
| `audio_output_price_per_million_tokens` | Voz sintetizada del agente |

Ejemplo del modo 1:

```yaml
pricing:
  realtime_model:
    input_price_per_million_tokens: 4.00
    cached_input_price_per_million_tokens: 0.40
    audio_input_price_per_million_tokens: 32.00
    audio_cached_input_price_per_million_tokens: 0.40
    image_input_price_per_million_tokens: 4.00
    output_price_per_million_tokens: 16.00
    audio_output_price_per_million_tokens: 64.00
  summarize_model:
    input_price_per_million_tokens: 0.25
    output_price_per_million_tokens: 2.00
```

### Facturación de Live (modo 2)

La voz del modo 2 se factura por **duración del audio**, así que `pricing.live_model.price_per_minute` es la única clave bajo `live_model`. El razonamiento se factura por token en `delegation_model`. Los artefactos de uso registran los minutos de Live y los tokens delegados por separado, y por eso se necesitan ambos bloques y `summarize_model` para obtener estimaciones exactas.

## Errores frecuentes

- **Apuntar los servicios WebSocket a un servidor solo HTTP.** `transcription` necesita un servidor que implemente el protocolo WebSocket Realtime, no solo `/v1/audio/transcriptions`. Un servidor HTTP de solo Whisper no puede ofrecer subtítulos en vivo; úselo para `meeting_summarizing`.
- **Encabezado de autenticación incorrecto.** Azure OpenAI y varias pasarelas rechazan `Authorization: Bearer`; defina `auth_header: "api-key"` y `realtime_auth_header: "api-key"` en el agente.
- **`live_model` sin `delegation_model`.** El servidor se niega a arrancar.
- **Dar por hecho que un nombre de modelo del registro de OpenAI funciona en local.** Use el nombre servido que informa `/v1/models`.

## Páginas relacionadas

- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): estructura de proveedores, matriz de capacidades y BYOK.
- [Guía del proveedor Google Gemini](/docs/ai-agent/providers/google)
- [Guía del proveedor Microsoft Azure](/docs/ai-agent/providers/azure): ejecutar el agente en Azure OpenAI con `provider: "openai"`.
- [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation)
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization)
- [Capacidades y límites del agente](/docs/ai-agent/tools-and-capabilities): conjunto de herramientas compartido por ambas arquitecturas de agente.
