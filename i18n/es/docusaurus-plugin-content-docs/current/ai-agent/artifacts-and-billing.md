---
title: "Resúmenes de sesión y artefactos de uso de Insights: esquema JSON, facturación y BYOK"
description: "Referencia completa de los 12 tipos de artefactos de Insights de plugNmeet, con el esquema JSON de AI_AGENT_SESSION_SUMMARY y AI_AGENT_USAGE: contabilidad de tokens y audio por rol y modalidad, atribución a la sala principal y supresión de la facturación en sesiones con clave propia (BYOK)."
keywords: [json de resumen del agente de ia, informe de sesión de ia, tipos de artefactos de insights, facturación de uso de ia, artefacto de uso de tokens, seguimiento de costos de ia, artefactos de plugnmeet, esquema de resumen de sesión, facturación del agente de ia, facturación byok, analíticas de aprendizaje con ia, informe de ia para lms]
sidebar_label: Resúmenes y Artefactos de Uso
sidebar_position: 11
---

# Resúmenes y artefactos de uso del agente de IA

Cada sesión del Agente de IA genera dos artefactos que se almacenan asociados a la **sala principal**:

| Artefacto | Valor de tipo | Finalidad |
| --- | --- | --- |
| `AI_AGENT_SESSION_SUMMARY` | `11` | Informe JSON estructurado de la sesión: qué se aprendió, qué se practicó, los resultados de los cuestionarios, la actividad en el espacio de trabajo y el contexto de continuación para la siguiente sesión. |
| `AI_AGENT_USAGE` | `10` | Uso de tokens y de audio, desglosado por rol y modalidad, con los costos estimados. |

Esta página describe ambos artefactos, con los nombres de campo exactos que se utilizan en `plugnmeet_room_artifacts.proto`.

:::info En desarrollo activo
**La transcripción en vivo (STT), la traducción, la síntesis de voz (TTS), el chat de texto con IA y el resumen de reuniones son funciones de producción estables**, y sus formatos de artefacto son estables. Solo el Agente de IA por voz (`ai_agent`) y las nuevas capacidades agénticas de invocación de herramientas MCP están en desarrollo activo: los campos de sus artefactos, y los campos que aún no se documentan, pueden cambiar antes de la publicación general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista una vez que el agente esté terminado y publicado.
:::

## Cómo recibe los artefactos

1. La sesión finaliza y el servidor escribe ambos artefactos en la sala principal.
2. Su servidor recibe un webhook [`artifact_created`](/docs/others/webhooks#artifact-created) por cada artefacto.
3. Su servidor obtiene el JSON con [`/auth/artifact/fetch`](/docs/api/artifact/fetch), filtrando por `type` (`AI_AGENT_SESSION_SUMMARY` o `AI_AGENT_USAGE`).

:::tip Use el webhook como disparador
No consulte los artefactos de forma periódica. Escuche `artifact_created`, compruebe `room_artifact.type` y obtenga después únicamente el artefacto que necesite.
:::

## Todos los tipos de artefactos de Insights

`RoomArtifactType` cubre todos los artefactos que produce la plataforma Insights. Los tipos `1` a `9` provienen de los servicios de voz, resumen y chat de texto; los tipos `10` a `12` provienen del Agente de IA.

| Tipo | Nombre | Formato | Modelo de precios | Guía de la función |
| --- | --- | --- | --- | --- |
| `1` | `MEETING_ANALYTICS` | Archivo descargable | Ninguno. Son analíticas de la plataforma, no un servicio facturado por el proveedor. | [Analíticas](/docs/others/analytics) |
| `2` | `MEETING_SUMMARY` | Archivo descargable (`text/plain`) | Ninguno. El registro facturable es el tipo `3`. | [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization) |
| `3` | `MEETING_SUMMARY_USAGE` | Metadatos de uso | Uso de tokens con `estimated_cost`. | [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization) |
| `4` | `SPEECH_TRANSCRIPTION` | Archivo descargable (`text/vtt`) | Ninguno. El registro facturable es el tipo `5`. | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `5` | `SPEECH_TRANSCRIPTION_USAGE` | Metadatos de uso | Duración (`duration_sec`, con la tarifa `price_per_hour`). | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `6` | `SYNTHESIZED_SPEECH_USAGE` | Metadatos de uso | Número de caracteres, con la tarifa `price_per_million_characters`. | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `7` | `CHAT_TRANSLATION_USAGE` | Metadatos de uso | Número de caracteres, con la tarifa `price_per_million_characters`. | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `8` | `AI_TEXT_CHAT_INTERACTION_USAGE` | Metadatos de uso | Uso de tokens de `chat_model`. | [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat) |
| `9` | `AI_TEXT_CHAT_SUMMARIZATION_USAGE` | Metadatos de uso | Uso de tokens de `summarize_model`. | [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat) |
| `10` | `AI_AGENT_USAGE` | Metadatos de uso | Uso de tokens y de audio, por rol y modalidad. | Esta página |
| `11` | `AI_AGENT_SESSION_SUMMARY` | Archivo descargable (JSON) | Ninguno. El registro facturable es el tipo `10`. | Esta página |
| `12` | `AI_AGENT_TRANSCRIPT` | Archivo descargable | Ninguno. El registro facturable es el tipo `10`. | [Guía para desarrolladores y API](/docs/ai-agent/developer-guide) |

En toda la tabla se aplican dos reglas:

- **Artefactos de archivo** (`1`, `2`, `4`, `11`, `12`): su backend necesita un token de descarga de [`/auth/artifact/getDownloadToken`](/docs/api/artifact/download) antes de poder leerlos.
- **Artefactos de uso** (`3`, `5`–`10`): llevan sus cifras en `room_artifact.metadata` y no tienen archivo que descargar. Su `reference_artifact_id` apunta al archivo que facturan, cuando existe.

El uso que se produce en una sala para grupos pequeños se atribuye a la sala principal en todos los tipos. La misma lista de tipos aparece en la [referencia de webhooks](/docs/others/webhooks#artifact-created).

## `AI_AGENT_SESSION_SUMMARY`

El archivo de resumen es JSON y se genera con los nombres de campo del proto (snake_case). Las cadenas vacías, las listas vacías y los valores cero también aparecen, así que todos los campos están siempre presentes. Los campos opcionales se omiten cuando no están definidos.

### Campos de nivel superior

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `summary_source` | string | `llm` cuando un modelo de texto ha refinado el resumen. `local_fallback` cuando el resumen se ha construido solo a partir de la telemetría de la sesión. |
| `generated_at` | string | Marca de tiempo ISO-8601 del momento en que se creó el resumen. |
| `user_info` | object | El alumno o visitante de esta sesión. Siempre presente. Consulte [`user_info`](#user_info). |
| `session` | object | Datos de la sesión: horas, duración, motivo de finalización, tema y recuentos. |
| `evaluation` | object | Valoración del dominio y de la participación. |
| `quiz_evaluation` | object | Resultados de cuestionarios y encuestas. |
| `progress_log` | array | Estado de cada concepto a lo largo de la sesión. |
| `workspace_activity` | object | Qué herramientas y espacios de trabajo se han utilizado. |
| `continuation` | object | Contexto y enfoque para la siguiente sesión. |
| `narrative_summary` | string | Un párrafo breve y legible para docentes, comerciales o notas del CRM. |
| `usage` | map | Uso de tokens por rol: `session`, `delegation` y `summary`. Consulte [Uso por rol](#uso-por-rol). |

:::note Versión del esquema
El resumen no incluye un campo `schema_version`. Detecte los cambios por los nombres de campo de la tabla anterior y por el `metadata` del registro del artefacto.
:::

### `user_info`

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `user_id` | string | Identificador interno del participante utilizado en la sesión. |
| `name` | string | Nombre visible, si se conoce. Opcional. |
| `ex_user_id` | string | Identificador de usuario de su sistema, enviado al unirse el participante. Utilícelo para asociar registros. Opcional. |
| `extra_data` | string | Metadatos personalizados del participante, como cadena de objeto JSON. Opcional. |

### `session`

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `room_id` | string | Identificador de la sala principal. |
| `room_sid` | string | El SID de LiveKit de la sala principal. |
| `session_id` | string | Identificador único de esta sesión de IA. |
| `agent_display_name` | string | Nombre que utilizó el agente, por ejemplo `Math Tutor`. |
| `topic` | string | El tema configurado. |
| `allowed_subtopics` | string[] | Los subtemas configurados. |
| `started_at` | string (int64) | Hora de inicio, en milisegundos Unix. Protobuf codifica los enteros de 64 bits como cadenas JSON. |
| `ended_at` | string (int64) | Hora de finalización, en milisegundos Unix. |
| `duration_seconds` | string (int64) | Duración de la sesión en segundos. |
| `end_reason` | string | Motivo por el que terminó la sesión, como `host_stopped`, `empty_room` o `budget`. |
| `off_topic_redirects_count` | number | Recuento acumulado de redirecciones por salirse del tema durante la sesión. |
| `turns_count` | number | Número de turnos de conversación. |

### `evaluation`

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `overall_score` | number | Puntuación global de la sesión, según la establezca el paso de evaluación. |
| `mastery_level` | string | Descriptor breve, como `developing`, `proficient` o `mastered`. |
| `participation_level` | string | Descriptor breve de la intensidad con la que participó la persona. |
| `concepts_mastered` | string[] | Conceptos que la persona ha demostrado dominar. |
| `concepts_practiced` | string[] | Conceptos trabajados pero aún no consolidados. |
| `struggled_with` | string[] | Conceptos que resultaron difíciles a la persona. |
| `vocabulary_or_key_terms` | string[] | Términos clave o vocabulario utilizado en la sesión. |
| `rubric_notes` | string | Explicación de cómo se llegó a la evaluación. |

Los valores de `mastery_level` y `participation_level` son texto libre generado por el paso de resumen. Cree los filtros a partir de `overall_score` y de los arreglos de conceptos, no de las etiquetas exactas.

### `quiz_evaluation`

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `total_quizzes` | number | Número de cuestionarios o encuestas con respuestas correctas en la sesión. |
| `total_responses` | number | Número de respuestas enviadas. |
| `correct_responses` | number | Número de respuestas correctas. |
| `accuracy_percent` | number | `correct_responses / total_responses` expresado en porcentaje. |
| `questions` | array | Una entrada por pregunta. |

Cada entrada de `questions` contiene:

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `poll_id` | string | Identificador de la encuesta o del cuestionario. |
| `question` | string | El texto de la pregunta. |
| `correct_option` | string | El texto de la respuesta correcta. |
| `total_votes` | string (uint64) | Total de votos recibidos. |
| `correct_votes` | string (uint64) | Votos emitidos para la respuesta correcta. |
| `passed` | boolean | Si la pregunta cumplió la regla de aprobado del cuestionario. |

### `progress_log`

Cada entrada describe un concepto:

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `concept` | string | Nombre del concepto. |
| `status` | string | Estado al finalizar la sesión, como `practiced` o `mastered`. |
| `notes` | string | Nota opcional sobre el concepto. |

### `workspace_activity`

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `tools_used` | map&lt;string, number&gt; | Número de veces que se llamó a cada herramienta, por ejemplo `whiteboard_draw_diagram: 3`. |
| `whiteboard_used` | boolean | Si se utilizó la pizarra. |
| `notepad_used` | boolean | Si se utilizó el bloc de notas compartido. |

### `continuation`

| Campo | Tipo JSON | Descripción |
| --- | --- | --- |
| `next_session_focus` | string | Enfoque recomendado para la siguiente sesión. |
| `recommended_warm_up` | string | Actividad breve de apertura para la siguiente sesión. |
| `unfinished_subtopics` | string[] | Subtemas que aún no se han tratado. |
| `previous_session_context_prompt` | string | Prompt de contexto ya preparado. Páselo a la siguiente sesión como `previous_session_context`. |

### Uso por rol

El mapa `usage` tiene una entrada por rol:

| Clave | Qué abarca |
| --- | --- |
| `session` | El modelo de voz en tiempo real: la conversación en directo, incluido el audio. |
| `delegation` | El modelo de texto que gestiona las llamadas a herramientas y los turnos delegados. Presente en los proveedores que usan un modelo de delegación independiente. |
| `summary` | El modelo de texto que redactó el resumen al finalizar la sesión. |

Cada entrada es un objeto de uso de tokens, descrito en la sección siguiente.

## Resumen de ejemplo

El ejemplo siguiente es un resumen realista de una sesión de estudio de 20 minutos. Los valores son ilustrativos.

```json
{
  "summary_source": "llm",
  "generated_at": "2026-03-14T10:42:19Z",
  "user_info": {
    "user_id": "pnm_user-7f3a",
    "name": "Ana Rivera",
    "ex_user_id": "student-204",
    "extra_data": "{\"class\":\"Grade 9B\"}"
  },
  "session": {
    "room_id": "study-room-spanish",
    "room_sid": "RM_kR8w2sXq1ZbA",
    "session_id": "ai-7c1e9b40",
    "agent_display_name": "Lucía",
    "topic": "Everyday Spanish conversation",
    "allowed_subtopics": ["greetings", "ordering food", "travel vocabulary"],
    "started_at": "1773484800000",
    "ended_at": "1773486000000",
    "duration_seconds": "1200",
    "end_reason": "host_stopped",
    "off_topic_redirects_count": 1,
    "turns_count": 34
  },
  "evaluation": {
    "overall_score": 72,
    "mastery_level": "developing",
    "participation_level": "high",
    "concepts_mastered": ["greetings", "ordering with 'quisiera'"],
    "concepts_practiced": ["travel vocabulary"],
    "struggled_with": ["subjunctive after 'quiero que'"],
    "vocabulary_or_key_terms": ["la cuenta", "el menú", "por favor"],
    "rubric_notes": "Confident in greetings and food vocabulary. Needs more practice with the subjunctive."
  },
  "quiz_evaluation": {
    "total_quizzes": 2,
    "total_responses": 6,
    "correct_responses": 4,
    "accuracy_percent": 67,
    "questions": [
      {
        "poll_id": "poll-1a2b",
        "question": "Which phrase politely asks for the bill?",
        "correct_option": "La cuenta, por favor",
        "total_votes": "1",
        "correct_votes": "1",
        "passed": true
      },
      {
        "poll_id": "poll-3c4d",
        "question": "Choose the correct form: Quiero que tú ___ conmigo.",
        "correct_option": "vengas",
        "total_votes": "1",
        "correct_votes": "0",
        "passed": false
      }
    ]
  },
  "progress_log": [
    { "concept": "greetings", "status": "mastered", "notes": "Used formal and informal forms correctly." },
    { "concept": "subjunctive after 'quiero que'", "status": "struggling", "notes": "Needed two corrections." }
  ],
  "workspace_activity": {
    "tools_used": {
      "whiteboard_draw_shapes": 2,
      "whiteboard_write_content": 5,
      "notepad_write": 3,
      "create_quiz": 2
    },
    "whiteboard_used": true,
    "notepad_used": true
  },
  "continuation": {
    "next_session_focus": "Subjunctive after expressions of desire",
    "recommended_warm_up": "Order a meal using a role-play with three menu items",
    "unfinished_subtopics": ["travel vocabulary"],
    "previous_session_context_prompt": "Previous session (Everyday Spanish): mastered greetings and ordering; struggled with the subjunctive after 'quiero que'. Start with a short warm-up, then practise the subjunctive."
  },
  "narrative_summary": "Ana practised greetings and ordering food with confidence. She answered most quiz questions correctly, but the subjunctive after 'quiero que' needs more practice. Start the next session with a meal role-play, then focus on the subjunctive.",
  "usage": {
    "session": {
      "prompt_tokens": 18420,
      "completion_tokens": 3110,
      "total_tokens": 21530,
      "breakdown": {
        "session_prompt_tokens": "18420",
        "session_audio_prompt_tokens": "9800",
        "session_completion_tokens": "3110",
        "session_audio_completion_tokens": "2600",
        "audio_millis": "1200000"
      }
    },
    "delegation": {
      "prompt_tokens": 2950,
      "completion_tokens": 640,
      "total_tokens": 3590,
      "breakdown": {
        "delegation_prompt_tokens": "2950",
        "delegation_completion_tokens": "640"
      }
    },
    "summary": {
      "prompt_tokens": 4100,
      "completion_tokens": 520,
      "total_tokens": 4620,
      "breakdown": {
        "summary_prompt_tokens": "4100",
        "summary_completion_tokens": "520"
      }
    }
  }
}
```

En el JSON, los valores del desglose son cadenas porque protobuf codifica `int64` de ese modo. Conviértalos a enteros en su código.

:::caution Nombres de campo en el ejemplo
El ejemplo utiliza los nombres de campo que se enumeran en esta página. Algunos campos, como las claves de `breakdown` dentro de `usage`, pueden variar según el proveedor. Lea los valores que necesite e ignore las claves que no reconozca.
:::

## `AI_AGENT_USAGE`

El artefacto de uso se almacena como `RoomArtifactMetadata` con una carga `token_usage`. Sus campos de metadatos son:

| Campo de metadatos | Descripción |
| --- | --- |
| `token_usage.prompt_tokens` | Total de tokens de entrada de todos los roles. |
| `token_usage.completion_tokens` | Total de tokens de salida de todos los roles. |
| `token_usage.total_tokens` | Tokens de entrada más tokens de salida. |
| `token_usage.breakdown` | Recuentos por rol y por modalidad, descritos a continuación. |
| `token_usage.prompt_tokens_estimated_cost` | Costo estimado de la entrada. Opcional. Se omite en las sesiones BYOK. |
| `token_usage.completion_tokens_estimated_cost` | Costo estimado de la salida. Opcional. Se omite en las sesiones BYOK. |
| `token_usage.total_tokens_estimated_cost` | Costo total estimado. Opcional. Se omite en las sesiones BYOK. |
| `reference_artifact_id` | Identificador del artefacto `AI_AGENT_SESSION_SUMMARY` correspondiente. Úselo para vincular ambos. |
| `user_info` | La misma identidad de alumno que en el resumen. Se incluye cuando el resumen la contiene. |
| `occurred_in_breakout_room` | `true` cuando la sesión se ejecutó en una sala de grupo. |
| `source_room_table_id` | Identificador de la tabla de la base de datos de la sala en la que se ejecutó la sesión. |

### Claves del desglose

El mapa `breakdown` utiliza un prefijo por rol: `session_`, `delegation_` o `summary_`. Por ejemplo, `session_prompt_tokens` y `delegation_prompt_tokens`.

Cada rol puede informar de estas claves cuando el valor es mayor que cero:

| Sufijo de clave | Significado |
| --- | --- |
| `_prompt_tokens` | Tokens de entrada. |
| `_completion_tokens` | Tokens de salida. |
| `_cached_prompt_tokens` | Tokens de entrada servidos desde la caché. |
| `_cache_write_prompt_tokens` | Tokens de entrada escritos en la caché. |
| `_text_prompt_tokens` | Tokens de entrada de texto. |
| `_audio_prompt_tokens` | Tokens de entrada de audio. |
| `_image_prompt_tokens` | Tokens de entrada de imagen. |
| `_cached_text_prompt_tokens`, `_cached_audio_prompt_tokens`, `_cached_image_prompt_tokens` | Entrada en caché, por modalidad. |
| `_cache_write_text_prompt_tokens`, `_cache_write_audio_prompt_tokens`, `_cache_write_image_prompt_tokens` | Escrituras en caché, por modalidad. |
| `_text_completion_tokens` | Tokens de salida de texto. |
| `_audio_completion_tokens` | Tokens de salida de audio. |
| `_thinking_completion_tokens` | Tokens de salida de razonamiento, cuando el modelo los informa. |

Claves de toda la sesión:

| Clave | Significado |
| --- | --- |
| `audio_millis` | Duración del habla en milisegundos, utilizada en las sesiones con precio por audio y por minuto. |
| `summary_prompt_tokens` | Tokens de entrada empleados en redactar el resumen. |
| `summary_completion_tokens` | Tokens de salida empleados en redactar el resumen. |
| `custom_provider_<provider>` | Se establece en `1` en las sesiones BYOK. Por ejemplo, `custom_provider_openai`. |

### Cálculo de costos por modalidad

Los costos se estiman a partir de la tabla `pricing` del archivo `config.yaml` de su servidor. Cada modalidad tiene su propia tarifa:

- **La entrada y la salida de texto** usan las tarifas de texto.
- **La entrada y la salida de audio** usan las tarifas de audio, que suelen ser más altas.
- **La entrada de imagen** usa la tarifa de imagen.
- **La entrada en caché** usa la tarifa de caché cuando está definida. Si no hay tarifa de caché, los tokens en caché se facturan como entrada no cacheada.
- **Las escrituras en caché** usan la tarifa de escritura en caché cuando está definida.
- **El habla en directo con precio por minuto** (OpenAI Live) se estima a partir de `audio_millis` y de la tarifa `price_per_minute`.

La estimación es una ayuda contable. No sustituye a la factura de su proveedor. Mantenga los valores de `pricing` alineados con su contrato con el proveedor.

### Atribución a la sala principal

Ambos artefactos se almacenan en la **sala principal**, incluso cuando la sesión se ejecutó en una sala de grupo 1 a 1. Utilice estos campos para distinguirlos:

- `occurred_in_breakout_room: true` identifica una sesión que se ejecutó en una sala de grupo.
- `source_room_table_id` identifica la sala en la que se prestó la sesión.
- `reference_artifact_id` vincula el uso con su resumen.

Por ejemplo, un centro educativo puede agrupar el uso por clase con el identificador de la sala principal y, además, ver qué sesiones se ejecutaron en salas de grupo por alumno.

### Supresión de la facturación con BYOK

Cuando una sala utiliza su propio proveedor mediante `custom_provider` (BYOK), el servidor considera la sesión **fuera de la facturación de la plataforma**:

- Los tres campos `*_estimated_cost` **no se incluyen** en el artefacto de uso.
- El desglose incluye `custom_provider_<provider>: 1`. Su código de facturación o de webhook puede leer este indicador para omitir los cargos de la plataforma.
- Los recuentos de tokens se siguen registrando, de modo que puede hacer seguimiento del uso aunque pague directamente al proveedor.

Utilice este indicador en su lógica de facturación:

```js
const usage = artifact.metadata.token_usage;
const isBYOK = Object.keys(usage.breakdown || {}).some(k => k.startsWith('custom_provider_'));

if (!isBYOK) {
  // Charge the platform cost for this room, using usage.total_tokens_estimated_cost
}
```

## Uso de los artefactos en sus sistemas

| Objetivo | Campos que debe utilizar |
| --- | --- |
| Mostrar un informe del alumno a un docente | `evaluation`, `quiz_evaluation`, `continuation`, `narrative_summary` |
| Alimentar un CRM | `user_info.ex_user_id`, `session.duration_seconds`, `quiz_evaluation.accuracy_percent`, `narrative_summary` |
| Continuar la siguiente sesión | `continuation.previous_session_context_prompt` |
| Hacer seguimiento del costo de la plataforma | `AI_AGENT_USAGE`, `total_tokens_estimated_cost` y la ausencia de `custom_provider_*` |
| Saber qué herramientas se utilizaron | `workspace_activity.tools_used` |

Para conocer el flujo de continuidad, consulte [Continuidad entre sesiones](/docs/ai-agent/developer-guide#flujo-de-continuidad-entre-sesiones). Para configurar los precios, consulte [Tablas de precios](/docs/ai-agent/configuration#tablas-de-precios).

## Notas sobre privacidad

- El resumen contiene información de alumnos y visitantes, además de respuestas de cuestionarios. Trátelo como datos personales conforme a su política de privacidad.
- El resumen es una evaluación, no una transcripción. Las transcripciones son un tipo de artefacto distinto.
- Su servidor decide durante cuánto tiempo se conservan los artefactos.

Consulte el [Resumen de seguridad](/docs/security-overview#85-artefactos-del-servicio-de-ia) para saber cómo se almacenan y se conservan los artefactos del servicio de IA.

## Páginas relacionadas

- [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation)
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization)
- [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat)
- [Guía para desarrolladores y API](/docs/ai-agent/developer-guide)
- [Configuración del servidor y proveedores](/docs/ai-agent/configuration)
- [Webhooks](/docs/others/webhooks)
- [API para obtener artefactos](/docs/api/artifact/fetch)
