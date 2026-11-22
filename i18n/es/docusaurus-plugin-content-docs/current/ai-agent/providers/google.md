---
title: "Guía del proveedor Google Gemini: voz en vivo, TTS, resúmenes y agente de voz"
description: "Configure Google Gemini como proveedor de los seis servicios de plugNmeet Insights: transcripción con Gemini Live, traducción de chat en modo JSON, Gemini TTS, chat de texto con herramientas MCP, resumen de reuniones con la API de archivos y agente multimodal de voz y visión."
keywords: [google gemini webrtc, agente de voz gemini live, transcripción en vivo gemini, resumen de reuniones gemini, síntesis de voz gemini tts, bidi generate content gemini, api de interacciones gemini, configuración de precios gemini plugnmeet, agente de voz en tiempo real gemini, gemini autoalojado, clave de api gemini, traducir chat con gemini]
sidebar_label: Google Gemini
sidebar_position: 1
---

# Guía del proveedor Google Gemini

Una sola cuenta de Google Gemini puede alimentar **los seis** servicios de Insights. Gemini es el único proveedor con una ruta nativa a todos los servicios, lo que lo convierte en la implantación de un solo proveedor más sencilla.

Se usan dos API de Gemini, y la distinción importa al configurar las opciones:

- **Gemini Live (`BidiGenerateContent`)**: WebSocket bidireccional que utilizan `transcription` (respuestas de texto) y `ai_agent` (respuestas de audio).
- **Modelos REST de Gemini**: `Models.GenerateContent` para la traducción y el chat, la **API de interacciones** para la síntesis de voz y la **API de archivos + `Batches.Create`** para el resumen de reuniones.

Tanto Live como la API de interacciones requieren `api_version: "v1beta"`.

## Servicios compatibles

| Servicio | Ruta en Gemini | Modelo predeterminado |
| --- | --- | --- |
| `transcription` | Gemini Live `BidiGenerateContent`, `ResponseModalities=[TEXT]` | `gemini-3.5-transcribe-live` |
| `translation` | `Models.GenerateContent` con `ResponseMIMEType: application/json` | `gemini-3.1-flash-lite` |
| `speech-synthesis` | API de interacciones de Gemini con audio PCM16 `audio/L16` | `gemini-3.8-flash-tts` |
| `ai_text_chat` | Chat en streaming, hasta 8 rondas de llamadas a herramientas MCP | Obligatorio, por ejemplo `gemini-3.1-flash` |
| `meeting_summarizing` | Carga mediante la API de archivos y trabajo por lotes con `Batches.Create` | Obligatorio, por ejemplo `gemini-3.1-flash-lite` |
| `ai_agent` | Gemini Live `BidiGenerateContent`, `ResponseModalities=[AUDIO]` | `gemini-3.8-live` |

Obtenga una clave de API en Google AI Studio o Google Cloud y después defina una cuenta y haga referencia a ella desde todos los servicios.

## Configuración de la cuenta del proveedor

```yaml
insights:
  providers:
    google:
      - id: "default-gemini-creds"
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"
        options:
          api_version: "v1beta"
```

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `id` | string | Sí | Nombre único de la cuenta. Los servicios lo referencian, por ejemplo `"default-gemini-creds"`. |
| `credentials.api_key` | string | Sí | Clave de API de Gemini. |
| `options.api_version` | string | No | Versión de la API. Defina `"v1beta"`, obligatoria para Gemini Live (`transcription`, `ai_agent`) y para la API de interacciones (`speech-synthesis`). |
| `options.endpoint` | string | No | URL base de una pasarela o proxy propio. Déjela vacía para llamar directamente a Google. |
| `options.auth_header` | string | No | Encabezado que transporta la clave cuando hay una pasarela delante de Gemini. `"Authorization"` envía `Authorization: Bearer <api_key>`. Cualquier otro nombre envía `<header>: <api_key>`. |

## Configuración de los servicios

### `transcription`

Envía en streaming las pistas de micrófono de los oradores permitidos a Gemini Live y recibe incrementos de texto. Live se abre con `ResponseModalities=[TEXT]`, de modo que el modelo nunca devuelve audio en este servicio.

```yaml
transcription:
  provider: "google"
  id: "default-gemini-creds"
  options:
    model: "gemini-3.5-transcribe-live"
    transcribe_mode: "VERBATIM"
    api_version: "v1beta"
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.model` | string | `"gemini-3.5-transcribe-live"` | Modelo de transcripción en vivo. |
| `options.transcribe_mode` | string | `"VERBATIM"` | `"VERBATIM"` transcribe palabra por palabra. `"SMART"` permite que el modelo normalice y limpie el habla. |
| `options.api_version` | string | `"v1beta"` | Obligatoria para `BidiGenerateContent`. |
| `options.max_selected_trans_langs` | entero | `2` | Número máximo de idiomas de subtítulos simultáneos por sala. Se aplica en el servidor; el anfitrión no puede elevarlo desde la API. |

### `translation`

Traduce un lote de cadenas a todos los idiomas de destino configurados en una sola llamada a `GenerateContent`. La solicitud define `ResponseMIMEType: application/json`, así que el modelo devuelve un objeto JSON en lugar de texto libre, lo que mantiene la traducción de chat a varios idiomas en un único viaje de ida y vuelta.

```yaml
translation:
  provider: "google"
  id: "default-gemini-creds"
  options:
    translate_model: "gemini-3.1-flash-lite"
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.translate_model` | string | `"gemini-3.1-flash-lite"` | Modelo de traducción. `model` se acepta como alias. |
| `options.max_selected_trans_langs` | entero | `5` | Número máximo de idiomas de destino para la traducción del chat y de los subtítulos. Es independiente del límite de transcripción. |

### `speech-synthesis`

Llama a la API de interacciones de Gemini y lee el audio PCM16 (`audio/L16`) directamente de la respuesta, así que no se escribe ningún archivo en disco.

```yaml
speech-synthesis:
  provider: "google"
  id: "default-gemini-creds"
  options:
    model: "gemini-3.8-flash-tts"
    default_voice: "Kore"
    tts_sample_rate: 16000
    api_version: "v1beta"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.model` | string | `"gemini-3.8-flash-tts"` | Modelo de TTS. |
| `options.default_voice` | string | `"Kore"` | Voz usada cuando un idioma no tiene una asignación de voz explícita. |
| `options.tts_sample_rate` | entero | `16000` | Frecuencia de muestreo PCM. Valores admitidos: `8000`, `16000`, `24000`. |
| `options.api_version` | string | `"v1beta"` | Obligatoria para la API de interacciones. |

Gemini usa una sola `default_voice` para todos los idiomas en lugar de un mapa de voces por idioma. Si necesita voces distintas para cada idioma de destino, utilice la [guía de Microsoft Azure](/docs/ai-agent/providers/azure).

### `ai_text_chat`

Chat en streaming para moderadores (copiloto de la sala) y participantes (asistente de aprendizaje). La ruta del moderador puede llamar a herramientas MCP de la sala hasta **8 rondas** antes de responder.

```yaml
ai_text_chat:
  provider: "google"
  id: "default-gemini-creds"
  options:
    chat_model: "gemini-3.1-flash-Preview"
    summarize_model: "gemini-3.1-flash-lite"
    context_window: 5
  pricing:
    "gemini-3.1-flash-Preview":
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
    "gemini-3.1-flash-lite":
      input_price_per_million_tokens: 0.10
      output_price_per_million_tokens: 0.40
```

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `options.chat_model` | string | Sí | Modelo para la conversación en vivo y las llamadas a herramientas. |
| `options.summarize_model` | string | No | Modelo usado para condensar el contexto largo. |
| `options.context_window` | entero | No, predeterminado `5` | Número de mensajes recientes que se conservan íntegros por conversación. |

### `meeting_summarizing`

Sube la grabación mezclada de la sala mediante la API de archivos de Gemini, ejecuta un trabajo por lotes con `Batches.Create` y guarda el texto del resumen devuelto. Las cargas se eliminan cuando termina el trabajo.

```yaml
meeting_summarizing:
  provider: "google"
  id: "default-gemini-creds"
  options:
    summarize_model: "gemini-3.1-flash-lite"
  pricing:
    default:
      input_price_per_million_tokens: 0.30
      output_price_per_million_tokens: 2.50
```

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `options.summarize_model` | string | Sí | Modelo usado para el trabajo de resumen por lotes. |

Las instrucciones personalizadas del resumen se definen por sala, no aquí. Consulte [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization).

### `ai_agent`

Ejecuta el agente de voz y visión con Gemini Live y `ResponseModalities=[AUDIO]`: el modelo escucha el audio de la sala, ve los fotogramas de la pizarra y del uso compartido, llama a las herramientas del agente y responde hablando.

```yaml
ai_agent:
  provider: "google"
  id: "default-gemini-creds"
  options:
    realtime_model: "gemini-3.8-live"
    summarize_model: "gemini-3.1-flash-lite"
    api_version: "v1beta"
  pricing:
    realtime_model:
      input_price_per_million_tokens: 0.75
      cached_input_price_per_million_tokens: 0.075
      cache_write_input_price_per_million_tokens: 0.9375
      audio_input_price_per_million_tokens: 3.00
      audio_cached_input_price_per_million_tokens: 0.30
      audio_cache_write_input_price_per_million_tokens: 3.75
      image_input_price_per_million_tokens: 1.00
      image_cached_input_price_per_million_tokens: 0.10
      image_cache_write_input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 4.50
      audio_output_price_per_million_tokens: 12.00
    summarize_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 1.50
```

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.realtime_model` | string | `"gemini-3.8-live"` | Modelo en vivo usado para la sesión. |
| `options.summarize_model` | string | ninguno | Modelo usado para el resumen al final de la sesión. Si se omite, el servidor reutiliza el modelo de resumen de `ai_text_chat` o de `meeting_summarizing` y, si tampoco existe, escribe un resumen local determinista sin llamar a ningún LLM. |
| `options.api_version` | string | `"v1beta"` | Obligatoria para `BidiGenerateContent`. |

La **voz del agente se elige por sala** con `ai_agent_features.voice`, no en la configuración del servidor. Las opciones del servidor solo seleccionan modelos y la versión de la API.

## Configuración de precios

Los precios solo alimentan el campo `estimated_cost` de los artefactos de uso; nunca cambian lo que Google le factura. Las tarifas son por millón de tokens en los servicios de LLM y por hora o por millón de caracteres en los servicios de voz.

### `transcription`

`pricing.default.price_per_hour` tarifica `SPEECH_TRANSCRIPTION_USAGE` a partir de la duración transcrita.

### `translation`

`pricing.default.price_per_million_characters` tarifica la salida de la traducción.

:::tip
`CHAT_TRANSLATION_USAGE` se mide por **número de caracteres**, no por tokens, y se tarifica con `pricing.default.price_per_million_characters`. Defina una tarifa explícita o las estimaciones de costo de traducción se quedarán en cero.
:::

### `speech-synthesis`

`pricing.default.price_per_million_characters` tarifica `SYNTHESIZED_SPEECH_USAGE` a partir del número de caracteres enviados al TTS.

### `ai_text_chat`

`pricing.<chat_model>` y `pricing.<summarize_model>` usan `input_price_per_million_tokens` y `output_price_per_million_tokens`. Escriba entre comillas los nombres de modelo que contengan puntos o mayúsculas. Una entrada `pricing.default` se aplica a cualquier modelo que no tenga su propio bloque.

### `meeting_summarizing`

`pricing.<summarize_model>` (o `pricing.default`) usa `input_price_per_million_tokens` y `output_price_per_million_tokens`.

### `ai_agent`

El precio por token es multimodal. Coloque las tarifas en `pricing.realtime_model` (o bajo el nombre concreto del modelo) y en `pricing.summarize_model`:

| Clave | Cubre |
| --- | --- |
| `input_price_per_million_tokens` | Texto de entrada |
| `cached_input_price_per_million_tokens` | Texto de entrada en caché |
| `cache_write_input_price_per_million_tokens` | Texto escrito en la caché de instrucciones |
| `audio_input_price_per_million_tokens` | Voz de los participantes enviada al modelo |
| `audio_cached_input_price_per_million_tokens` | Audio de entrada en caché |
| `audio_cache_write_input_price_per_million_tokens` | Audio escrito en la caché de instrucciones |
| `image_input_price_per_million_tokens` | Fotogramas de la pizarra y del uso compartido |
| `image_cached_input_price_per_million_tokens` | Imágenes de entrada en caché |
| `image_cache_write_input_price_per_million_tokens` | Imágenes escritas en la caché de instrucciones |
| `output_price_per_million_tokens` | Texto de salida, incluidos los tokens de razonamiento |
| `audio_output_price_per_million_tokens` | Voz sintetizada del agente |

Las tarifas de caché son opcionales. Cuando faltan, se estiman con la tarifa de entrada sin caché. Los campos de uso que rellenan estas tarifas se detallan en [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing).

## Ejemplo de configuración completa

Todos los servicios en Gemini con una sola cuenta:

```yaml
insights:
  enabled: true
  providers:
    google:
      - id: "default-gemini-creds"
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"
        options:
          api_version: "v1beta"

  services:
    transcription:
      provider: "google"
      id: "default-gemini-creds"
      options:
        model: "gemini-3.5-transcribe-live"
        transcribe_mode: "VERBATIM"
        api_version: "v1beta"
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36

    translation:
      provider: "google"
      id: "default-gemini-creds"
      options:
        translate_model: "gemini-3.1-flash-lite"
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 10.00

    speech-synthesis:
      provider: "google"
      id: "default-gemini-creds"
      options:
        model: "gemini-3.8-flash-tts"
        default_voice: "Kore"
        tts_sample_rate: 16000
        api_version: "v1beta"
      pricing:
        default:
          price_per_million_characters: 16.00

    ai_text_chat:
      provider: "google"
      id: "default-gemini-creds"
      options:
        chat_model: "gemini-3.1-flash-Preview"
        summarize_model: "gemini-3.1-flash-lite"
        context_window: 5
      pricing:
        default:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50

    meeting_summarizing:
      provider: "google"
      id: "default-gemini-creds"
      options:
        summarize_model: "gemini-3.1-flash-lite"
      pricing:
        default:
          input_price_per_million_tokens: 0.30
          output_price_per_million_tokens: 2.50

    ai_agent:
      provider: "google"
      id: "default-gemini-creds"
      options:
        realtime_model: "gemini-3.8-live"
        summarize_model: "gemini-3.1-flash-lite"
        api_version: "v1beta"
      pricing:
        realtime_model:
          input_price_per_million_tokens: 0.75
          cached_input_price_per_million_tokens: 0.075
          cache_write_input_price_per_million_tokens: 0.9375
          audio_input_price_per_million_tokens: 3.00
          audio_cached_input_price_per_million_tokens: 0.30
          audio_cache_write_input_price_per_million_tokens: 3.75
          image_input_price_per_million_tokens: 1.00
          image_cached_input_price_per_million_tokens: 0.10
          image_cache_write_input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 4.50
          audio_output_price_per_million_tokens: 12.00
        summarize_model:
          input_price_per_million_tokens: 0.25
          output_price_per_million_tokens: 1.50
```

## Errores frecuentes

- **Falta `api_version: "v1beta"`.** Gemini Live (`transcription`, `ai_agent`) y la API de interacciones (`speech-synthesis`) fallan con otras versiones. Defínala en la cuenta, en cada uno de esos servicios o en ambos.
- **Nombres de modelo sin comillas.** Escriba entre comillas nombres como `"gemini-3.1-flash-Preview"` y entrecomille siempre las claves de precios que contengan puntos o mayúsculas.
- **Bloque `pricing` vacío.** Sin tarifas la sesión funciona igual, pero los artefactos de uso informan un costo de cero.

## Páginas relacionadas

- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): estructura común de proveedores, matriz de capacidades y BYOK.
- [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation): cómo transmite audio el `RoomAgent` oculto.
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization): captura, instrucciones y comportamiento del trabajo por lotes.
- [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat): llamadas a herramientas del moderador y memoria.
- [Guía del proveedor OpenAI y autoalojados](/docs/ai-agent/providers/openai)
- [Guía del proveedor Microsoft Azure](/docs/ai-agent/providers/azure)
