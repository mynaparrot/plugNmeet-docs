---
title: "Resumen automático de reuniones con IA: actas, webhooks y artefactos"
description: "Cómo genera plugNmeet actas y notas de reunión con IA en salas WebRTC autoalojadas: captura independiente de audio mezclado, proveedores Gemini y OpenAI, prompts personalizados, trabajos por lotes con JetStream y descarga de artefactos."
keywords: [resumen automático de reuniones con ia, actas y notas de reunión con ia, resumen de reunión con webhook, generador de actas automáticas, resumen de clases con ia, resumen de llamadas de ventas, resumen de audio con gemini, resumen de reunión con openai, notas de aula virtual, transcripción de reuniones, plugnmeet insights, artefacto de resumen de reunión]
sidebar_label: Resumen de Reuniones con IA
sidebar_position: 7
---

# Resumen automático de reuniones con IA

El resumen de reuniones genera un acta escrita de la sesión sin que nadie tome notas. Es un flujo independiente de los subtítulos en vivo: graba una pista oculta con el audio mezclado, la procesa al terminar la reunión y deja un resumen en texto junto con un registro del uso de tokens.

## Cómo funciona: un flujo de captura de audio independiente

El resumen **no** exige que la transcripción en vivo o los subtítulos estén habilitados. Usa su propio mecanismo de captura:

1. Un moderador inicia el resumen dentro de la sala.
2. El servidor lanza un `RoomAgent` oculto específico con `CaptureAllParticipantsTracks: true`.
3. Ese agente mezcla en tiempo real la pista de audio de cada participante en un flujo WAV interno mono de 16 kHz, guardado como `mixed_audio_<ts>.wav`.
4. El archivo mezclado solo se usa para el trabajo de resumen. Nunca se expone como artefacto de grabación y se elimina al terminar el procesamiento.

Como la captura es una mezcla y no pistas separadas por orador, el resumen refleja la conversación en su conjunto. No genera atribución por orador y no sustituye a una transcripción cuando necesita identificar quién habla.

## Proveedores compatibles

| Proveedor | Enfoque |
| --- | --- |
| Google Gemini (`google`) | Resumen por lotes: el WAV mezclado se sube mediante la API de archivos de Gemini y se resume con `Batches.Create` usando `summarize_model`. |
| OpenAI (`openai`) | Transcripción del audio por bloques (`/v1/audio/transcriptions`) y posterior resumen con `summarize_model`; después los bloques se combinan en un único resumen. Funciona con cualquier endpoint compatible con OpenAI. |

Ambos proveedores usan la entrada de servicio `meeting_summarizing` de `config.yaml`, incluida su tabla `pricing`. Consulte [Configuración del servidor y proveedores](/docs/ai-agent/configuration) y las guías de los proveedores [Google Gemini](/docs/ai-agent/providers/google) y [OpenAI y autoalojados](/docs/ai-agent/providers/openai).

:::info Azure
Azure Cognitive Services nativo (`provider: "azure"`) no implementa `meeting_summarizing`. Para mantener el resumen en Microsoft Azure, defina un recurso de Azure OpenAI como cuenta de `providers.openai`; consulte la [guía del proveedor Microsoft Azure](/docs/ai-agent/providers/azure).
:::

## Ciclo de control en dos etapas

### Paso 1: creación de la sala (`/room/create`)

```json
{
  "room_id": "weekly-sync",
  "metadata": {
    "room_title": "Weekly product sync",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_features": {
          "is_allow": true,
          "meeting_summarization_features": {
            "is_allow": true,
            "summarization_prompt": "Summarize decisions, owners, and due dates. Keep it under 300 words."
          }
        }
      }
    }
  }
}
```

| Campo | Obligatorio | Efecto |
| --- | --- | --- |
| `ai_features.is_allow` | Sí | Interruptor principal de las funciones de IA generativa, incluido el resumen. |
| `meeting_summarization_features.is_allow` | Sí | Permite el resumen en esta sala. |
| `meeting_summarization_features.summarization_prompt` | No | Instrucción personalizada que define el resultado. |

`summarization_prompt` es donde se decide el formato del resultado. Un prompt para una clase puede pedir definiciones, ideas clave y tareas; uno médico o legal puede pedir decisiones, riesgos y seguimientos; uno de ventas puede pedir objeciones, próximos pasos y competidores mencionados; uno de reunión diaria puede pedir avances por persona y bloqueos.

### Paso 2: activación por el moderador durante la reunión

El moderador inicia el resumen desde la interfaz de la sala o mediante el endpoint de control en tiempo de ejecución. Al iniciarlo también puede enviar un prompt, que reemplaza durante esa sesión al `summarization_prompt` definido en la sala.

Cuando comienza la captura de audio, todos los participantes reciben una notificación en la sala con la clave de traducción `insights.meeting-summarization.enabled-notification-all`. La captura se anuncia; no es silenciosa. Si el moderador detiene el resumen antes de tiempo, la captura se cierra y el audio recogido hasta ese momento se procesa con normalidad.

## Procesamiento por lotes posterior a la reunión y ciclo de protección

El resumen es asíncrono. Mientras la reunión está en curso no se genera nada salvo el archivo de audio.

1. **Termina la reunión o el moderador detiene el resumen.** El mezclador de audio cierra el flujo WAV.
2. **Se encola un trabajo duradero.** El servidor publica un trabajo de JetStream en `pnm-insights-jobs-summarize`. Como el trabajo vive en un flujo duradero, un reinicio del servidor no lo pierde.
3. **Los reintentos son automáticos.** `SummarizeJobMaxDeliverNum = 3`, con espera entre intentos. Un tiempo de espera agotado o un límite de peticiones del proveedor se reintenta en lugar de descartarse.
4. **El proceso de mantenimiento consulta el estado del trabajo.** Espera a que termine y después crea los artefactos.
5. **La limpieza va al final.** Se elimina el archivo temporal subido al proveedor y también el archivo local `mixed_audio_<ts>.wav`. No se conserva ninguno de los dos.

## Artefactos, webhooks y obtención del resumen

El resumen genera dos artefactos mediante el webhook [`artifact_created`](/docs/others/webhooks#artifact-created). Ambos se envían de forma forzada a la cola fiable de webhooks, así que un endpoint inaccesible durante un tiempo no los descarta sin aviso.

| Artefacto | Tipo | Contenido |
| --- | --- | --- |
| `MEETING_SUMMARY` | `2` | Archivo de texto plano `summary_<roomSid>-<ts>.txt`, tipo mime `text/plain`. |
| `MEETING_SUMMARY_USAGE` | `3` | `token_usage`: `prompt_tokens`, `completion_tokens`, `total_tokens`, `estimated_cost`, con `reference_artifact_id` que apunta al artefacto `MEETING_SUMMARY`. |

`estimated_cost` se calcula a partir de `insights.services.meeting_summarizing.pricing[summarize_model]`. Si esa entrada de precios no existe, el registro de uso se escribe igualmente, pero sin estimación de costo.

### Cómo recibir un resumen en su backend

1. Escuche el evento `artifact_created` y revise `room_artifact.type`.
2. Llame a [`/auth/artifact/fetch`](/docs/api/artifact/fetch) con `room_ids` o `room_sid` para listar los artefactos tras una reconexión o un webhook perdido.
3. Llame a [`/auth/artifact/getDownloadToken`](/docs/api/artifact/download) con el `artifact_id` del resumen y descargue el archivo con el token devuelto.

```javascript
switch (payload.room_artifact.type) {
  case 2: {
    // MEETING_SUMMARY: a file. Ask for a download token.
    const { token } = await api.post('/auth/artifact/getDownloadToken', {
      artifact_id: payload.room_artifact.artifact_id,
    });
    const file = await downloadWithToken(token);
    await saveSummary(payload.room.room_id, file);
    break;
  }
  case 3:
    // MEETING_SUMMARY_USAGE: metadata only, no file to download.
    await recordTokenUsage(payload.room_artifact.metadata.token_usage);
    break;
}
```

:::note Los registros de uso no son archivos
`MEETING_SUMMARY_USAGE` no tiene contenido descargable. Pedir un token de descarga para el tipo `3` no tiene sentido; lea los campos de uso directamente en el contenido del webhook o en `/auth/artifact/fetch`.
:::

El modelo común de artefactos, incluida la atribución desde las salas para grupos pequeños, se describe en [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing). Para los subtítulos en vivo y los archivos de transcripción, consulte [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation).

## Páginas relacionadas

- [Descripción general e Insights](/docs/ai-agent/overview)
- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): proveedores, modelos y precios por token de `meeting_summarizing`.
- Guías por proveedor: [Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai) y [Microsoft Azure](/docs/ai-agent/providers/azure).
- [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat): un copiloto para moderadores que puede iniciar el resumen a petición.
- [Características de Insights de `/room/create`](/docs/api/room/create#insights-features)
- [Webhooks](/docs/others/webhooks#artifact-created)
