---
title: "Guía del proveedor Microsoft Azure: voz a texto, Translator, TTS neuronal y Azure OpenAI"
description: "Ejecute los seis servicios de plugNmeet Insights en Microsoft Azure: Cognitive Services nativos para voz a texto en vivo, traducción de subtítulos y síntesis de voz neuronal, además de Azure OpenAI y Azure AI Foundry mediante el proveedor compatible con OpenAI para el agente de voz, el copiloto de sala y los resúmenes de reunión."
keywords: [azure speech to text webrtc, azure translator subtítulos en vivo, voces neuronales azure tts, azure openai foundry agente de voz, configuración microsoft azure plugnmeet, azure cognitive services videoconferencia, transcripción con azure speech, subtítulos traducidos azure, encabezado api key azure openai, nombres de implementación azure, tts por idioma azure, reuniones con ia autoalojadas en azure]
sidebar_label: Microsoft Azure
sidebar_position: 3
---

# Guía del proveedor Microsoft Azure

Azure es el único proveedor que necesita **dos** rutas de configuración en Plug-N-Meet. Utilice la sección correcta para cada servicio:

| Parte | Tipo de proveedor | Servicios |
| --- | --- | --- |
| **Parte 1**: Azure Cognitive Services nativos | `azure` | `transcription`, `translation`, `speech-synthesis` |
| **Parte 2**: Azure OpenAI / Azure AI Foundry | `openai` | `ai_agent`, `ai_text_chat`, `meeting_summarizing` |

## Por qué dos partes

**Parte 1: `azure` nativo.** Azure Speech y Azure Translator son servicios creados específicamente para voz y traducción, y el proveedor `azure` habla directamente con ellos: voz a texto mediante el WebSocket del SDK de Speech, la API REST de Translator y TTS neuronal. Estos tres servicios son exactamente lo que implementa `azure` nativo. **No tiene motor de LLM**: `ai_text_chat`, `meeting_summarizing` y `ai_agent` no están disponibles con `provider: "azure"`.

**Parte 2: Azure OpenAI mediante `provider: "openai"`.** Azure OpenAI y Azure AI Foundry exponen una superficie compatible con OpenAI en la ruta `/openai/v1` de su recurso. Al definir ese endpoint como una cuenta `openai` con `auth_header: "api-key"`, los servicios de LLM funcionan con modelos de Azure sin ninguna otra ruta de código.

Ambas partes conviven en el mismo bloque `insights`, así que una implantación solo en Azure usa dos secciones de proveedor y seis entradas de servicio.

## Parte 1: Azure Cognitive Services nativos

### Cuentas de proveedor

Se necesitan dos cuentas, porque Speech y Translator son recursos de Azure distintos con claves distintas:

```yaml
insights:
  providers:
    azure:
      # Regional Speech resource: STT and Neural TTS
      - id: "eastus_standard"
        credentials:
          api_key: "YOUR_AZURE_SPEECH_KEY"
          region: "eastus"

      # Global Translator resource: chat and caption translation
      - id: "transGlobal"
        credentials:
          api_key: "YOUR_AZURE_TRANSLATOR_KEY"
          region: "global"
        options:
          endpoint: "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"
```

| Clave | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `id` | string | Sí | Nombre único de la cuenta, por ejemplo `"eastus_standard"` o `"transGlobal"`. |
| `credentials.api_key` | string | Sí | Clave del recurso. |
| `credentials.region` | string | Sí | Región de Azure. Use la región del recurso de Speech para `transcription` y `speech-synthesis`, y `"global"` para un recurso de Translator global. |
| `options.endpoint` | string | Solo Translator | URL completa de la petición a Translator, **incluido** `/translate?api-version=3.0`. Sin ella, el servicio `translation` falla. |

:::warning
El `endpoint` de Translator debe ser la URL completa de la operación: `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`. Defínalo en la **cuenta del proveedor**, no en la entrada del servicio. Un host sin la ruta no es suficiente.
:::

### `transcription`

Envía en streaming el audio de micrófono de los oradores permitidos a Azure Speech-to-Text y publica en la sala fragmentos parciales y finales de subtítulos.

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

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.max_selected_trans_langs` | entero | `2` | Número máximo de idiomas de subtítulos simultáneos por sala. |

Azure Speech Translation realiza la voz a texto en vivo y la traducción de subtítulos al idioma de destino en una sola pasada, así que las salas que piden subtítulos traducidos los obtienen del mismo flujo de audio en lugar de una segunda llamada a otro servicio.

### `translation`

Usa la API REST de Azure Translator para los mensajes de chat y la traducción de texto en lote. Los límites de velocidad, longitud e idiomas son los de Azure.

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

| Clave | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `options.max_selected_trans_langs` | entero | `5` | Número máximo de idiomas de destino por sala. Es independiente del límite de subtítulos. |

Este servicio debe apuntar a la cuenta de **Translator**. Si apunta a la cuenta regional de Speech, falla, porque la API de Translator no acepta claves de Speech.

### `speech-synthesis`

Lee en voz alta los subtítulos traducidos con las voces neuronales de Azure. Las voces se asignan **por idioma**, que es la principal ventaja del TTS nativo de Azure.

```yaml
speech-synthesis:
  provider: "azure"
  id: "eastus_standard"
  options:
    voice-en: "en-US-JennyNeural"
    voice-es: "es-ES-ElviraNeural"
    voice-fr: "fr-FR-DeniseNeural"
    voice-de: "de-DE-AmalaNeural"
    voice-bn: "bn-IN-TanishaaNeural"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Clave | Tipo | Descripción |
| --- | --- | --- |
| `options.voice-<lang>` | string | Voz neuronal usada al sintetizar ese idioma de destino, por ejemplo `voice-en`, `voice-es`, `voice-fr`, `voice-de`, `voice-bn`. |

Añada una clave `voice-<lang>` por cada idioma que quiera leer en voz alta. Un idioma sin voz no se reproduce en voz alta, y un identificador de voz inválido solo afecta a ese idioma, no a la sesión.

### Precios

| Servicio | Clave | Medición |
| --- | --- | --- |
| `transcription` | `pricing.default.price_per_hour` | `SPEECH_TRANSCRIPTION_USAGE` a partir de la duración transcrita |
| `translation` | `pricing.default.price_per_million_characters` | `CHAT_TRANSLATION_USAGE` a partir del número de caracteres traducidos |
| `speech-synthesis` | `pricing.default.price_per_million_characters` | `SYNTHESIZED_SPEECH_USAGE` a partir de los caracteres sintetizados |

El costo de traducción se mide por **caracteres**, no por tokens. Si omite la tarifa, los artefactos de traducción muestran un costo de cero.

## Parte 2: Azure OpenAI mediante el proveedor `openai`

Añada su recurso de Azure OpenAI como segunda sección de proveedor. La URL base es la ruta v1 compatible con OpenAI del recurso:

```yaml
insights:
  providers:
    openai:
      - id: "azure-openai"
        credentials:
          api_key: "YOUR_AZURE_OPENAI_KEY"
        options:
          endpoint: "https://<your-resource>.openai.azure.com/openai/v1"
          auth_header: "api-key"
```

| Clave | Valor | Motivo |
| --- | --- | --- |
| `credentials.api_key` | Clave de Azure OpenAI | Se envía como credencial de la petición. |
| `options.endpoint` | `https://<your-resource>.openai.azure.com/openai/v1` | Superficie compatible con OpenAI de Azure. `https` se convierte en `wss` automáticamente en los servicios WebSocket. |
| `options.auth_header` | `"api-key"` | Azure espera `api-key: <key>`. El valor predeterminado `Authorization: Bearer` se rechaza. |

Para `ai_agent`, defina también `realtime_auth_header: "api-key"`. El agente abre su propio WebSocket y no hereda el encabezado de la cuenta.

### Nombres de implementación, no nombres de modelo

Todos los campos de modelo de las `options` del servicio son **nombres de implementación de Azure**, no identificadores de modelo de OpenAI:

- `options.realtime_model` / `options.live_model`
- `options.chat_model`
- `options.summarize_model`
- `options.transcription_model`
- `options.delegation_model`

Las claves de `pricing` siguen la misma regla. Si su implementación se llama `gpt-realtime-prod`, escriba `pricing: gpt-realtime-prod: ...` (entre comillas) o use `pricing.default` para no repetir nombres de implementación.

No todos los modelos de OpenAI están disponibles en todas las regiones. Implemente primero en el portal de Foundry los modelos que necesite y después haga referencia a esos nombres de implementación.

### `ai_text_chat`

```yaml
ai_text_chat:
  provider: "openai"
  id: "azure-openai"
  options:
    chat_model: "gpt-chat-prod"
    summarize_model: "gpt-mini-prod"
    context_window: 5
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

### `meeting_summarizing`

```yaml
meeting_summarizing:
  provider: "openai"
  id: "azure-openai"
  options:
    transcription_model: "whisper-prod"
    summarize_model: "gpt-mini-prod"
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

Las grabaciones largas se trocean en segmentos de 20 MB o menos, cada uno se transcribe con la implementación de transcripción de audio y después se resume.

### `ai_agent`

Ambas arquitecturas de agente funcionan con implementaciones de Azure. Modo Realtime:

```yaml
ai_agent:
  provider: "openai"
  id: "azure-openai"
  options:
    realtime_model: "gpt-realtime-prod"
    summarize_model: "gpt-mini-prod"
    default_voice: "marin"
    turn_detection: "semantic_vad"
    realtime_auth_header: "api-key"
  pricing:
    realtime_model:
      input_price_per_million_tokens: 4.00
      audio_input_price_per_million_tokens: 32.00
      image_input_price_per_million_tokens: 4.00
      output_price_per_million_tokens: 16.00
      audio_output_price_per_million_tokens: 64.00
    summarize_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 2.00
```

Si su recurso expone un modelo Live, defina `live_model` **y** `delegation_model` (ambos nombres de implementación). `delegation_model` es obligatorio al arrancar, y el modo 2 factura la voz con `pricing.live_model.price_per_minute` en lugar de por token. Consulte la [guía de OpenAI y autoalojados](/docs/ai-agent/providers/openai).

## Configuración de producción completa en Azure

Los seis servicios en Microsoft Azure: Speech y Translator para la pila de voz, Azure OpenAI para la pila de LLM.

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
          endpoint: "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"

    openai:
      - id: "azure-openai"
        credentials:
          api_key: "YOUR_AZURE_OPENAI_KEY"
        options:
          endpoint: "https://<your-resource>.openai.azure.com/openai/v1"
          auth_header: "api-key"

  services:
    transcription:
      provider: "azure"
      id: "eastus_standard"
      options:
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36

    translation:
      provider: "azure"
      id: "transGlobal"
      options:
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 10.00

    speech-synthesis:
      provider: "azure"
      id: "eastus_standard"
      options:
        voice-en: "en-US-JennyNeural"
        voice-es: "es-ES-ElviraNeural"
        voice-fr: "fr-FR-DeniseNeural"
        voice-de: "de-DE-AmalaNeural"
        voice-bn: "bn-IN-TanishaaNeural"
      pricing:
        default:
          price_per_million_characters: 16.00

    ai_text_chat:
      provider: "openai"
      id: "azure-openai"
      options:
        chat_model: "gpt-chat-prod"
        summarize_model: "gpt-mini-prod"
        context_window: 5
      pricing:
        default:
          input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 10.00

    meeting_summarizing:
      provider: "openai"
      id: "azure-openai"
      options:
        transcription_model: "whisper-prod"
        summarize_model: "gpt-mini-prod"
      pricing:
        default:
          input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 10.00

    ai_agent:
      provider: "openai"
      id: "azure-openai"
      options:
        realtime_model: "gpt-realtime-prod"
        summarize_model: "gpt-mini-prod"
        default_voice: "marin"
        turn_detection: "semantic_vad"
        realtime_auth_header: "api-key"
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

Todo permanece dentro de su inquilino y su región de Azure: el audio nunca sale de los recursos de voz y el tráfico de LLM va a su propia implementación de Foundry.

## Errores frecuentes

- **`provider: "azure"` para el agente, el chat o los resúmenes.** El proveedor `azure` nativo no implementa esos servicios. Use la cuenta `azure-openai` con `provider: "openai"`.
- **Falta la ruta del endpoint de Translator.** El endpoint debe ser la URL completa `/translate?api-version=3.0` en la cuenta del proveedor.
- **Encabezado de autenticación predeterminado contra Azure OpenAI.** Defina `auth_header: "api-key"` en la cuenta y `realtime_auth_header: "api-key"` en el agente, o todas las llamadas devolverán 401.
- **Nombres de modelo de OpenAI como nombres de implementación.** Use el nombre de implementación que creó en Foundry y entrecomille cualquier clave de precios con un nombre personalizado.
- **Región incorrecta en la cuenta de Speech.** TTS y STT fallan cuando `region` no coincide con el recurso.

## Páginas relacionadas

- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): estructura común de proveedores, matriz de capacidades y BYOK.
- [Guía del proveedor OpenAI y autoalojados](/docs/ai-agent/providers/openai): todos los detalles de los servicios de LLM usados en la parte 2.
- [Guía del proveedor Google Gemini](/docs/ai-agent/providers/google)
- [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation)
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization)
