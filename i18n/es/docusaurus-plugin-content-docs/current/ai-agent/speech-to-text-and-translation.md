---
title: "Transcripción de voz a texto en tiempo real, subtítulos en vivo y traducción simultánea"
description: "Configure la transcripción de voz a texto en tiempo real, los subtítulos en vivo y la síntesis de voz (TTS) de plugNmeet: captura oculta con RoomAgent, proveedores Azure y OpenAI, opciones de creación de sala, controles del moderador, archivos WebVTT y artefactos de uso."
keywords: [transcripción de voz a texto en tiempo real, subtítulos en vivo, traducción simultánea de voz, transcripción automática de reuniones, síntesis de voz tts, traducción de chat en vivo, videoconferencia multilingüe, transcripción autohospedada, azure speech to text, transcripción con openai, descargar transcripción webvtt, subtítulos para aula virtual]
sidebar_label: Subtítulos en Vivo, STT y Traducción
sidebar_position: 8
---

# Transcripción de voz a texto en tiempo real, subtítulos en vivo y traducción simultánea

La plataforma Insights convierte una sala en vivo en una sesión con subtítulos, fácil de buscar y multilingüe. Para ello intervienen tres servicios: `transcription` convierte la voz en texto, `translation` traduce ese texto a otros idiomas (incluidos los mensajes de chat) y `speech-synthesis` lee en voz alta los subtítulos traducidos. Los tres se ejecutan en el servidor con su propia cuenta de proveedor.

## Cómo funciona: tres servicios integrados

| Servicio | Qué hace el servidor | Resultado |
| --- | --- | --- |
| `transcription` | Inicia un participante `RoomAgent` oculto que se suscribe a las pistas de micrófono de los oradores autorizados y transmite su voz al proveedor. | Eventos pub/sub `TRANSCRIPTION_OUTPUT_TEXT` con fragmentos parciales y finales. |
| `translation` | Traduce los fragmentos finales de los subtítulos a cada idioma de destino seleccionado y traduce mensajes de chat a petición. | Texto de subtítulos traducido y mensajes de chat traducidos. |
| `speech-synthesis` | Para cada idioma de destino autorizado, inicia un proceso TTS que lee los fragmentos de subtítulos traducidos. | Pistas de audio sintetizadas publicadas en la sala de plugNmeet. |

### 1. `transcription`

El servidor no captura el audio en el navegador. Entra en la sala como un participante `RoomAgent` oculto, se suscribe únicamente a las pistas de micrófono de los oradores que el moderador haya autorizado y envía ese audio al proveedor configurado.

Los resultados llegan por pub/sub de NATS como eventos `TRANSCRIPTION_OUTPUT_TEXT`. Los fragmentos parciales actualizan la línea de subtítulos mientras la persona habla; los fragmentos finales son el texto que se puede almacenar, traducir, sintetizar y reunir en un archivo de transcripción.

### 2. `translation`

La traducción no guarda estado y tiene dos puntos de entrada:

- **Subtítulos en vivo.** Cada fragmento final puede traducirse a la vez hasta `max_selected_trans_langs` idiomas de destino, cada uno mostrado en su propia pista de subtítulos.
- **Mensajes de chat.** La traducción del chat público se gestiona mensaje a mensaje, de modo que un participante puede leer un mensaje en su idioma sin modificar lo que ven los demás.

Ambas funciones se habilitan por separado (`is_allow_translation` frente a `chat_translation_features.is_allow`) y tienen límites de idiomas independientes.

### 3. `speech-synthesis` (traducción hablada / TTS)

Cuando `is_enabled_speech_synthesis` está activo junto con la traducción, el servidor crea un proceso TTS por cada idioma de destino autorizado. Cada proceso toma los fragmentos de subtítulos traducidos, sintetiza la voz con la voz configurada para ese idioma (`voice-en`, `voice-es`, `voice-fr`, `voice-de`, `voice-bn`, etc.) y publica el audio resultante como una pista en la sala de plugNmeet.

Como el audio se publica como una pista normal de la sala, los participantes se suscriben a él igual que al resto del audio. Si la sala usa E2EE con una clave gestionada por el servidor, la pista sintetizada se cifra del mismo modo que el resto de los medios.

## Proveedores compatibles

| Proveedor | `transcription` | `translation` | `speech-synthesis` |
| --- | --- | --- | --- |
| Google Gemini (`google`) | Gemini Live `BidiGenerateContent`, respuestas de texto | `GenerateContent` con modo de respuesta JSON | API de interacciones de Gemini, audio PCM16 |
| OpenAI (`openai`) | WebSocket Realtime con `intent=transcription` | `chat.completions` con modo JSON | `/v1/audio/speech`, PCM a 24 kHz |
| Azure Cognitive Services (`azure`) | Voz a texto de Azure (STT y traducción de subtítulos en una sola pasada) | Endpoint REST de Azure Translator | Voces neuronales de Azure, una por idioma |

Cada servicio se asigna por separado en `config.yaml`, así que puede usar la voz a texto y las voces neuronales de Azure con la traducción de Gemini, o mover los tres servicios a una sola cuenta de Gemini u OpenAI. Las cuentas de proveedor, los endpoints y los precios se explican en [Configuración del servidor y proveedores](/docs/ai-agent/configuration), y las listas completas de opciones están en las guías de los proveedores [Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai) y [Microsoft Azure](/docs/ai-agent/providers/azure).

## Ciclo de control en dos etapas

### Paso 1: creación de la sala (`/room/create`)

El anfitrión activa las funciones en `metadata.room_features.insights_features`. Nada se ejecuta hasta que un moderador inicia además una sesión dentro de la sala.

```json
{
  "room_id": "class-101",
  "metadata": {
    "room_title": "Biology 101",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "transcription_features": {
          "is_allow": true,
          "is_allow_translation": true,
          "is_allow_speech_synthesis": true
        },
        "chat_translation_features": {
          "is_allow": true
        }
      }
    }
  }
}
```

| Campo | Efecto |
| --- | --- |
| `transcription_features.is_allow` | Permite la transcripción en vivo en esta sala. |
| `transcription_features.is_allow_translation` | Permite traducir los subtítulos en vivo. Requiere `is_allow`. |
| `transcription_features.is_allow_speech_synthesis` | Permite la traducción hablada. Requiere `is_allow` e `is_allow_translation`. |
| `chat_translation_features.is_allow` | Permite traducir los mensajes del chat público a petición. |

El número de idiomas simultáneos para los subtítulos **no** es un ajuste de la sala. Se controla desde la configuración del servidor: `insights.services.transcription.options.max_selected_trans_langs` (valor predeterminado `2`) para los subtítulos en vivo e `insights.services.translation.options.max_selected_trans_langs` (valor predeterminado `5`) para la traducción del chat. Las solicitudes que superan el límite se ajustan a él.

Consulte [Características de Insights de `/room/create`](/docs/api/room/create#insights-features) para ver el objeto completo.

### Paso 2: controles del moderador y de los participantes durante la reunión

Crear la sala solo concede el permiso. El moderador debe iniciar la transcripción dentro de la sala y decide quién puede hablar para que se transcriba.

**Controles del moderador**

| Ajuste | Finalidad |
| --- | --- |
| Iniciar o detener la transcripción en vivo | Abre o cierra la sesión de transcripción de la sala. |
| `allowed_spoken_langs` | Idiomas que el moderador acepta transcribir. |
| `allowed_speech_users` | Participantes cuyas pistas de micrófono puede usar el `RoomAgent` oculto. El resto nunca se captura. |
| `is_enabled_translation` | Activa la traducción de subtítulos en vivo para la sesión. |
| `allowed_trans_langs` | Idiomas de destino que se ofrecen a los participantes, limitados por `max_selected_trans_langs`. |
| `default_subtitle_lang` | Idioma de subtítulos que ve un participante antes de elegir uno. |
| `is_enabled_speech_synthesis` | Habilita los procesos TTS de cada idioma para la traducción hablada. |

**Controles de los participantes**

- Iniciar y detener su propia sesión de transcripción del micrófono. Un participante que nunca inicia una sesión no se transcribe, aunque la función de la sala esté permitida.
- Elegir su `spoken_lang`, limitado a los `allowed_spoken_langs` del moderador.
- Decidir si sus fragmentos finales pueden almacenarse, con `allowed_transcription_storage`. Si está desactivado, el participante sigue viendo los subtítulos en vivo, pero no se guarda texto suyo.

:::caution E2EE con una clave insertada por el usuario
Si la sala usa E2EE con `enabled_self_insert_encryption_key: true`, el servidor no puede descifrar el audio con una clave que solo existe en el cliente y la transcripción en el servidor se rechaza. E2EE con una clave gestionada por el servidor funciona con normalidad.
:::

**Traducción del chat**

El moderador habilita la traducción del chat público con `allowed_trans_langs` y `default_lang`. Después, los participantes traducen cada mensaje a petición a uno de los idiomas permitidos. La traducción no guarda estado: el mensaje original no cambia y no se almacena nada por mensaje.

## Subtítulos VTT, artefactos de uso y webhooks

### Archivo de transcripción

Cuando `allowed_transcription_storage` está activo, los fragmentos finales se guardan por orador. Al terminar la sala, el servidor los reúne en un archivo WebVTT estándar con etiquetas de voz `<v Speaker Name>` y lo guarda como artefacto `SPEECH_TRANSCRIPTION` (tipo `4`, tipo mime `text/vtt`). El archivo se puede descargar mediante [`/auth/artifact/getDownloadToken`](/docs/api/artifact/download) y aparece en [`/auth/artifact/fetch`](/docs/api/artifact/fetch).

### Artefactos de uso

Al terminar la sala, el servidor genera hasta tres artefactos de uso mediante el webhook [`artifact_created`](/docs/others/webhooks#artifact-created):

| Artefacto | Tipo | Contenido | Origen del precio |
| --- | --- | --- | --- |
| `SPEECH_TRANSCRIPTION_USAGE` | `5` | `duration_usage`: `duration_sec`, desglose por orador y por idioma, `estimated_cost` y `reference_artifact_id` que apunta al artefacto VTT. | `price_per_hour` del servicio `transcription`. |
| `SYNTHESIZED_SPEECH_USAGE` | `6` | `character_count_usage`: `total_characters`, desglose por idioma, `estimated_cost`. | `price_per_million_characters` del servicio `speech-synthesis`. |
| `CHAT_TRANSLATION_USAGE` | `7` | `character_count_usage`: `total_characters`, desglose por idioma, `estimated_cost`. | `price_per_million_characters` del servicio `translation`. |

El uso que se produce en una sala para grupos pequeños se acumula y se atribuye a la sala principal, así que un ejercicio en dos salas deja un solo registro de facturación.

Utilice `reference_artifact_id` en `SPEECH_TRANSCRIPTION_USAGE` para emparejar un archivo de transcripción con la duración facturada. El modelo completo de artefactos y precios está en [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing).

## Páginas relacionadas

- [Descripción general e Insights](/docs/ai-agent/overview)
- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): cuentas de proveedor, límites de idiomas y precios por hora o por carácter.
- Guías por proveedor: [Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai) y [Microsoft Azure](/docs/ai-agent/providers/azure).
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing): todos los tipos de artefacto y sus campos de costo.
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization): resúmenes que no dependen de los subtítulos en vivo.
- [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat): un copiloto para moderadores que puede activar estos servicios a petición.
- [Características de Insights de `/room/create`](/docs/api/room/create#insights-features)
