---
title: "Guía de desarrollo y API del Agente de IA: referencia de ai_agent_features y ejemplos"
description: "Referencia para desarrolladores de la API del Agente de IA de plugNmeet: todos los campos de ai_agent_features, ejemplos JSON para salas NORMAL_ROOM, CONTROLLED_USERS y OPEN_PER_USER, configuración de BYOK y de servidores MCP, creación de salas de grupos, continuidad entre sesiones y endpoints protobuf dentro de la sala."
keywords: [api de plugnmeet, ai_agent_features, api para crear sala, api del agente de ia, ia en salas de grupos, configuración de servidores mcp, api de proveedor de ia con byok, webhook artifact_created, previous_session_context, api protobuf, aiAgent start stop status]
sidebar_label: Guía de desarrollo y API
sidebar_position: 6
---

# Guía de desarrollo y API del Agente de IA

Esta guía es la referencia técnica para integrar el Agente de IA de plugNmeet. Abarca la API de creación de salas para la comunicación entre servidores, los endpoints protobuf a los que accede el cliente de navegador dentro de la sala y el flujo de webhooks que permite mantener la continuidad entre sesiones.

:::info En Desarrollo Activo
El motor del Agente de IA y sus API están en desarrollo activo. Los nombres de los campos, las reglas de validación y el comportamiento de los endpoints pueden cambiar antes de la publicación general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista una vez que la función se finalice y se publique. Mientras tanto, realice la integración mediante la API que se describe a continuación.
:::

## Dónde se ubica la configuración

El Agente de IA se configura en el objeto `insights_features` de la sala, dentro de `ai_agent_features`. Este objeto se encuentra dentro de `metadata.room_features` cuando llama a [`/auth/room/create`](/docs/api/room/create).

```text
metadata
└── room_features
    └── insights_features
        ├── is_allow
        └── ai_agent_features     ← this guide
            ├── auto_session_config
            ├── mcp_servers
            └── custom_provider   (BYOK)
```

Antes de que una sala pueda utilizar el agente, su servidor debe incluir una entrada `insights.services.ai_agent` en `config.yaml`, salvo que la sala proporcione su propio `custom_provider`. Consulte [Configuración del servidor y del proveedor](/docs/ai-agent/configuration).

## Referencia de campos de `ai_agent_features`

La tabla enumera los 32 campos de `InsightsAIAgentFeatures` en `plugnmeet_create_room_insights.proto`, además de los mensajes anidados `AIAgentAutoSessionConfig`, `ExternalMCPServerConfig` e `InsightsAIAgentCustomProvider`.

| # | Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- | --- |
| 1 | `is_allow` | bool | Sí | Interruptor general del Agente de IA en esta sala. |
| 2 | `session_mode` | enum | Sí | `AI_AGENT_SESSION_MODE_NORMAL_ROOM` (0), `AI_AGENT_SESSION_MODE_CONTROLLED_USERS` (1) o `AI_AGENT_SESSION_MODE_OPEN_PER_USER` (2). |
| 3 | `auto_session_config` | object | Según el modo | Ajustes de enrutamiento para las sesiones 1 a 1 automáticas. Consulte [`auto_session_config`](#auto_session_config). |
| 4 | `agent_display_name` | string | No | Nombre con el que se muestra el agente. Predeterminado: `AI Assistant`. |
| 5 | `system_prompt` | string | Sí, cuando `is_allow` está activo | Instrucciones del anfitrión sobre la personalidad y el comportamiento del agente. |
| 6 | `previous_session_context` | string | No | Contexto de una sesión anterior, normalmente el JSON del resumen o su valor `previous_session_context_prompt`. |
| 7 | `topic` | string | Sí, cuando `is_allow` está activo | La lección, demostración o formación sobre la que debe mantenerse el agente. |
| 8 | `allowed_subtopics` | string[] | No | Hasta 64 subtemas que quedan dentro del alcance. |
| 9 | `forbidden_topics` | string[] | No | Hasta 32 temas que el agente debe rechazar. |
| 10 | `strict_topic_enforcement` | bool | No | Rechazar las solicitudes fuera del tema. Predeterminado: `true`. |
| 11 | `topic_anchor_interval_turns` | uint32 | No | Vuelve a insertar el anclaje del tema cada N turnos. Predeterminado `6`, rango de `3` a `12`. |
| 12 | `spoken_lang` | string (BCP-47) | No | Idioma del alumno o del visitante, por ejemplo `en-US`. |
| 13 | `target_lang` | string (BCP-47) | No | Idioma que se está aprendiendo. Déjelo vacío para temas que no sean de idiomas. |
| 14 | `instruction_lang` | string (BCP-47) | No | Idioma en el que el agente explica. Si está vacío, se usa `spoken_lang`. |
| 15 | `voice` | string | No | Identificador de voz del proveedor. Debe figurar en la lista de voces permitidas del servidor. |
| 16 | `speaking_rate` | float | No | Velocidad del habla, de `0.5` a `2.0`. Predeterminado `1.0`. |
| 17 | `allow_whiteboard_write` | bool | No | Permite que el agente dibuje en la pizarra. Predeterminado `true`. |
| 18 | `allow_vision_capture` | bool | No | Permite que el agente reciba instantáneas de la pizarra y del bloc de notas. Predeterminado `true`. |
| 19 | `vision_debounce_ms` | uint32 | No | Tiempo de espera entre instantáneas. Predeterminado `1200`, máximo `5000`. |
| 20 | `vision_max_edge_px` | uint32 | No | Arista más larga de la instantánea. Predeterminado `1024`, rango de `512` a `1600`. |
| 21 | `allow_polls` | bool | No | Permite cuestionarios y encuestas. Predeterminado `true`. |
| 22 | `allow_chat_message` | bool | No | Permite que el agente publique en el chat de IA. Predeterminado `true`. |
| 23 | `allow_notepad_write` | bool | No | Permite que el agente escriba en el bloc de notas compartido. Predeterminado `true`. |
| 24 | `allow_web_fetch` | bool | No | Permite que el agente consulte páginas HTTPS aprobadas. Predeterminado `false`. |
| 25 | `allowed_knowledge_urls` | string[] | Recomendado cuando `allow_web_fetch` es `true` | Hasta 32 prefijos de URL HTTPS que el agente puede consultar. |
| 26 | `knowledge_cache_ttl_seconds` | uint32 | No | Tiempo de caché de las páginas consultadas. Predeterminado `3600`, rango de `60` a `86400`. |
| 27 | `mcp_servers` | map&lt;string, ExternalMCPServerConfig&gt; | No | Hasta 2 servidores MCP externos. Consulte [Servidores MCP externos](#servidores-mcp-externos-mcp_servers). |
| 28 | `max_session_seconds` | uint32 | No | Límite de duración de la sesión, de `60` a `7200`. Si no se indica, el valor predeterminado es `1800`. |
| 29 | `max_audio_minutes` | uint32 | No | Presupuesto de audio por sesión, hasta `240`. Con `0` se usa el valor predeterminado del servidor, `120`. |
| 30 | `is_enabled` | bool | Debe ser `false` | Indicador interno de ejecución. El anfitrión no puede establecerlo. |
| 31 | `active_session_id` | string | Debe estar vacío | Campo interno de ejecución. El anfitrión no puede establecerlo. |
| 32 | `custom_provider` | object | No | Proveedor BYOK propio de la sala. Consulte [`custom_provider` (BYOK)](#custom_provider-byok). |

### `auto_session_config`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `allowed_participant_ids` | string[] | Hasta **32** identificadores de participante. Se usa en `CONTROLLED_USERS`. |
| `max_concurrent_sessions` | uint32 | Se usa en `OPEN_PER_USER`. El servidor limita este valor a **16**. |
| `auto_start_agent` | bool | Opcional. Controla si el agente se inicia automáticamente en las sesiones enrutadas. |

### `ExternalMCPServerConfig`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `url` | string | Endpoint HTTPS, con un máximo de 1024 caracteres. |
| `headers` | map&lt;string, string&gt; | Encabezados de solicitud opcionales, hasta 16 pares. La clave admite 128 caracteres como máximo y el valor 2048. |
| `allowed_tools` | string[] | Hasta **8** nombres de herramienta. Solo estas herramientas se ofrecen al agente. |
| `scope` | string | Indicación opcional de propietario: `shared`, `text_chat` o `ai_agent`. |

### `custom_provider` (BYOK)

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `provider` | string | Sí | `google` u `openai`. |
| `api_key` | string | Sí | Clave de API del proveedor, de 1 a 512 caracteres. Nunca se difunde. |
| `endpoint` | string | No | URL base HTTPS de una puerta de enlace o de un servidor autoalojado, hasta 512 caracteres. |
| `auth_header` | string | No | Nombre del encabezado que transporta la clave, hasta 128 caracteres. |
| `realtime_model` | string | No | Sustituye el modelo en tiempo real. |
| `delegation_model` | string | No | Sustituye el modelo de delegación. |
| `summarize_model` | string | No | Sustituye el modelo de resumen. |

## Modos de sesión

| Modo | Quién inicia la sesión | Enrutamiento | Cámaras web y compartición de pantalla | Uso habitual |
| --- | --- | --- | --- | --- |
| `NORMAL_ROOM` | Un moderador, desde el panel de salas de grupos | Salas de grupos 1 a 1 manuales | Sin cambios | Práctica dirigida por el docente, demostraciones guiadas por ventas |
| `CONTROLLED_USERS` | Automático, para los participantes indicados | Cada participante autorizado recibe `<Name> (AI Session)` | Desactivadas en toda la sala | Listas de alumnos asignados, grupos de incorporación |
| `OPEN_PER_USER` | Automático, para cualquier visitante | Cada visitante recibe una sesión aislada, hasta `max_concurrent_sessions` | Desactivadas en toda la sala | Salas de estudio 24/7, enlaces de demostración de producto |

En los modos automáticos, la sala principal funciona como sala de espera. Los participantes que no están autorizados permanecen en ella.

## Ejemplos de solicitudes

Todos los ejemplos se envían a `/auth/room/create`. Utilizan los encabezados de autenticación estándar de la API que se describen en la [API para crear una sala](/docs/api/room/create). Solo se muestran las partes relevantes; el resto de campos de metadatos son opcionales.

### 1. `NORMAL_ROOM`: sesiones de grupo dirigidas por el docente

```json
{
  "room_id": "class-algebra-01",
  "metadata": {
    "room_title": "Algebra Class",
    "room_features": {
      "allow_webcams": true,
      "allow_screen_share": true,
      "breakout_room_features": {
        "is_allow": true
      },
      "insights_features": {
        "is_allow": true,
        "ai_features": {
          "is_allow": true
        },
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_NORMAL_ROOM",
          "agent_display_name": "Math Tutor",
          "system_prompt": "You are a patient algebra tutor. Work step by step on the whiteboard and ask the student to predict each step.",
          "topic": "Linear equations",
          "allowed_subtopics": ["one-variable equations", "word problems"],
          "forbidden_topics": ["homework answers for graded tests"],
          "strict_topic_enforcement": true,
          "topic_anchor_interval_turns": 6,
          "spoken_lang": "en-US",
          "instruction_lang": "en-US",
          "speaking_rate": 1.0,
          "allow_whiteboard_write": true,
          "allow_polls": true,
          "allow_notepad_write": true,
          "allow_web_fetch": false,
          "max_session_seconds": 1800,
          "max_audio_minutes": 60
        }
      }
    }
  }
}
```

### 2. `CONTROLLED_USERS`: lista de alumnos asignados

```json
{
  "room_id": "tutoring-group-7",
  "metadata": {
    "room_title": "Tutoring Group 7",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_CONTROLLED_USERS",
          "auto_session_config": {
            "allowed_participant_ids": ["student-101", "student-102", "student-103"],
            "auto_start_agent": true
          },
          "agent_display_name": "Study Coach",
          "system_prompt": "You are a study coach for high-school chemistry. Ask one question at a time and check each answer with a short quiz.",
          "topic": "Chemical bonding",
          "allowed_subtopics": ["ionic bonds", "covalent bonds", "electronegativity"],
          "forbidden_topics": ["exam cheating", "personal advice"],
          "strict_topic_enforcement": true,
          "topic_anchor_interval_turns": 6,
          "allow_polls": true,
          "max_session_seconds": 1800
        }
      }
    }
  }
}
```

`allowed_participant_ids` admite hasta 32 identificadores. Cada uno debe coincidir con el `user_id` que utiliza su aplicación cuando un participante se une a la sala.

### 3. `OPEN_PER_USER`: sala de estudio o demostración de autoservicio 24/7

```json
{
  "room_id": "study-room-spanish",
  "metadata": {
    "room_title": "Spanish Practice Room",
    "room_features": {
      "allow_webcams": false,
      "allow_screen_share": false,
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_OPEN_PER_USER",
          "auto_session_config": {
            "max_concurrent_sessions": 8,
            "auto_start_agent": true
          },
          "agent_display_name": "Lucía",
          "system_prompt": "You are a friendly Spanish speaking coach for adult beginners. Speak mostly in simple Spanish and explain grammar in English when needed.",
          "topic": "Everyday Spanish conversation",
          "allowed_subtopics": ["greetings", "ordering food", "travel vocabulary"],
          "forbidden_topics": ["politics", "medical advice"],
          "spoken_lang": "en-US",
          "target_lang": "es-ES",
          "instruction_lang": "en-US",
          "speaking_rate": 0.9,
          "voice": "YOUR_PROVIDER_VOICE_ID",
          "max_session_seconds": 1200,
          "max_audio_minutes": 30
        }
      }
    }
  }
}
```

Aunque envíe un número mayor, el servidor limita `max_concurrent_sessions` a **16**. Establezca `voice` con un identificador de la lista de voces permitidas de su proveedor, u omítalo para usar la voz `default_voice` del servidor.

### 4. Con BYOK (`custom_provider`)

Este ejemplo utiliza la puerta de enlace compatible con OpenAI del propio anfitrión para una sola sala. La clave se elimina de los metadatos de la sala antes de difundirlos y se almacena únicamente en Redis.

```json
{
  "room_id": "demo-acme-visitor-room",
  "metadata": {
    "room_title": "Acme Product Demo",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_OPEN_PER_USER",
          "auto_session_config": {
            "max_concurrent_sessions": 4
          },
          "system_prompt": "You are a visual sales engineer for Acme Analytics. Use the uploaded deck and keep answers short.",
          "topic": "Acme Analytics product demo",
          "forbidden_topics": ["pricing negotiation"],
          "max_session_seconds": 1800,
          "custom_provider": {
            "provider": "openai",
            "api_key": "sk-YOUR-ROOM-SCOPED-KEY",
            "endpoint": "https://gateway.example.com/v1",
            "auth_header": "Authorization",
            "realtime_model": "gpt-realtime-2.1-mini",
            "delegation_model": "gpt-5.4-mini",
            "summarize_model": "gpt-5.4-mini"
          }
        }
      }
    }
  }
}
```

Si se establece `custom_provider`, el servidor no necesita una entrada de servicio `ai_agent` en `config.yaml`. Los modelos que omita utilizan los valores predeterminados del servidor para el proveedor elegido.

### 5. Con servidores MCP externos (`mcp_servers`)

```json
{
  "room_id": "onboarding-acme-001",
  "metadata": {
    "room_title": "Acme API Onboarding",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_NORMAL_ROOM",
          "system_prompt": "You are a technical onboarding assistant for the Acme API. Check the checklist before each step.",
          "topic": "Acme API authentication and webhooks",
          "allow_web_fetch": true,
          "allowed_knowledge_urls": ["https://docs.acme.example/api/"],
          "knowledge_cache_ttl_seconds": 3600,
          "mcp_servers": {
            "acme-docs": {
              "url": "https://mcp.acme.example/mcp",
              "allowed_tools": ["search_docs", "read_doc"],
              "scope": "ai_agent"
            }
          }
        }
      }
    }
  }
}
```

## Sesiones de IA en salas de grupos

Un moderador puede iniciar una sesión de IA 1 a 1 dentro de una sala de grupos. Utilice `/api/breakoutRoom/create` con estos campos de `CreateBreakoutRoomsReq`:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `enable_ai_agent` | bool | Crea las salas de grupos con una sesión del Agente de IA asociada. |
| `ai_agent_context` | string | Contexto opcional a nivel de sala para el agente, de hasta 2000 caracteres. |

Cada sala de grupos también contiene sus propios indicadores `enable_ai_agent`, `ai_agent_context` (hasta 2000 caracteres) y `ai_agent_joined`. El indicador `ai_agent_joined` informa al panel de Sesiones de IA del moderador de si un agente se ha unido a esa sala.

```json
{
  "room_id": "class-algebra-01",
  "requested_user_id": "teacher-1",
  "duration": 15,
  "enable_ai_agent": true,
  "ai_agent_context": "Student is practising two-step equations. Start with the warm-up from last session.",
  "allow_return_to_main_room": true,
  "rooms": [
    { "title": "Ana", "users": [{ "id": "student-ana" }] },
    { "title": "Ben", "users": [{ "id": "student-ben" }] }
  ]
}
```

Las salas de grupos heredan la configuración del proveedor BYOK de la sala principal, de modo que la misma clave y los mismos modelos se aplican a todas las sesiones.

## Seguridad del conocimiento externo y de los servidores MCP externos

El acceso externo es la parte de mayor riesgo en la configuración del agente. El servidor aplica las reglas que se indican a continuación.

### Conocimiento externo (`allow_web_fetch`)

- Desactivado de forma predeterminada. Establezca `allow_web_fetch: true` solo cuando lo necesite.
- **Solo HTTPS.** Las URL con `http://` sin cifrar se rechazan.
- **Lista de permitidos obligatoria.** El agente solo puede consultar las URL que empiecen por alguna entrada de `allowed_knowledge_urls` (hasta 32 prefijos). Utilice una ruta final, como `https://docs.example.com/api/`, para limitar el alcance.
- **Con caché.** Las páginas consultadas se almacenan en caché durante `knowledge_cache_ttl_seconds`, lo que limita las solicitudes repetidas.
- **El contenido no es de confianza.** El texto consultado se encapsula como datos. No puede modificar las reglas del agente.

### Servidores MCP externos (`mcp_servers`)

- **Máximo 2 servidores por sala.** El límite se aplica a los ámbitos `shared`, `ai_agent` y `text_chat`.
- **Máximo 8 herramientas permitidas por servidor.** Las herramientas que no figuran en `allowed_tools` nunca se ofrecen al agente.
- **Política de solo lectura.** El servidor aplica una política de herramientas estrictamente de solo lectura. Las herramientas que escriben, eliminan o envían datos no se exponen, aunque se indiquen en la lista. Diseñe su servidor MCP de forma que sus herramientas de lectura sean las únicas que exponga.
- **Solo HTTPS en el puerto 443.** Se rechazan otros esquemas y puertos.
- **Protección SSRF.** Las conexiones se comprueban en el momento de establecerlas. Solo se permiten direcciones enrutables globalmente, por lo que se rechazan las conexiones a direcciones privadas, de bucle local, de enlace local o que no sean globales.
- **Los encabezados son secretos.** Incluya los tokens de API en `headers`. Se almacenan en el servidor y no se difunden a los participantes.

:::caution No apunte los servidores MCP a servicios internos
Aunque exista protección SSRF, conecte los servidores MCP únicamente a servicios que tenga previsto exponer al Agente de IA y a sus visitantes. Utilice un endpoint MCP dedicado de solo lectura, no su API interna de administración.
:::

## Flujo de continuidad entre sesiones

La continuidad permite que un alumno o un prospecto que regresa retome la conversación donde la dejó. El flujo consta de cuatro pasos:

1. **La sesión termina.** El servidor escribe un artefacto `AI_AGENT_SESSION_SUMMARY` para la sala principal y envía un webhook `artifact_created`. Consulte [Webhooks](/docs/others/webhooks#artefacto-creado).
2. **Su backend obtiene el artefacto.** Llame a [`/auth/artifact/fetch`](/docs/api/artifact/fetch) con `type: "AI_AGENT_SESSION_SUMMARY"` (o `11`) y el identificador de la sala.
3. **Su backend prepara el contexto.** Puede pasar el JSON del resumen o utilizar su valor `continuation.previous_session_context_prompt`, que es un prompt breve redactado precisamente para este fin.
4. **Comienza la siguiente sesión.** Envíe `previous_session_context` en la siguiente solicitud a `/auth/room/create` o en la solicitud a `/api/aiAgent/start`.

```json
{
  "room_id": "study-room-spanish",
  "metadata": {
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_agent_features": {
          "is_allow": true,
          "session_mode": "AI_AGENT_SESSION_MODE_OPEN_PER_USER",
          "previous_session_context": "Last session: the learner practised greetings and ordering food. Struggled with the subjunctive. Next focus: travel vocabulary.",
          "topic": "Everyday Spanish conversation"
        }
      }
    }
  }
}
```

La continuidad por usuario funciona mejor con `OPEN_PER_USER` y `CONTROLLED_USERS`, modos en los que su backend conoce la identidad del alumno. Utilice el campo `user_info.ex_user_id` del resumen para asociar al alumno con sus propios registros.

## Endpoints dentro de la sala (`/api/aiAgent/*`)

El cliente de navegador controla el agente a través de estos endpoints. La autenticación se realiza con el JWT de sala del participante, no con la clave de API del servidor. Las solicitudes y las respuestas usan **protobuf** (`application/x-protobuf`), no JSON.

| Endpoint | Método | Mensaje de solicitud | Quién puede llamarlo | Finalidad |
| --- | --- | --- | --- | --- |
| `/api/aiAgent/start` | POST | `AIAgentStartReq` | Solo el administrador de la sala | Inicia el agente. Opcionalmente sustituye `system_prompt` y `previous_session_context`. |
| `/api/aiAgent/stop` | POST | `AIAgentStopReq` | Administrador, delegado actual o participante preautorizado | Detiene la sesión. Admite un `reason` opcional, por ejemplo `host_stopped`. |
| `/api/aiAgent/status` | GET o POST | `AIAgentStatusReq` | Cualquier participante de la sala | Devuelve `AIAgentStatusRes` con el `AIAgentStateMsg` actual. |
| `/api/aiAgent/pause` | POST | `AIAgentPauseReq` | Administrador, delegado o participante preautorizado | Pausa el agente. |
| `/api/aiAgent/resume` | POST | `AIAgentResumeReq` | Administrador, delegado o participante preautorizado | Reanuda un agente en pausa. |
| `/api/aiAgent/sendContext` | POST | `AIAgentSendContextReq` | Administrador, delegado o participante preautorizado | Inyecta contexto externo, como un evento de temporizador o datos del LMS. `source` puede ser `lms` o `timer`. |
| `/api/aiAgent/redelegate` | POST | `AIAgentRedelegateReq` | Administrador, delegado o participante preautorizado | Traslada el control a otro participante. Si `target_user_id` está vacío, el servidor elige. |

Las respuestas de inicio, parada, estado y del resto de endpoints de control utilizan el mensaje protobuf `AIAgentStatusRes`, que contiene `status`, `msg` y un `state` opcional.

### Estados de ejecución

`AIAgentStateMsg.state` indica uno de estos estados de ejecución: `CONNECTING`, `LISTENING`, `THINKING`, `SPEAKING`, `DRAWING`, `PAUSED`, `RECONNECTING` y `STOPPED`.

### Ejemplo: enviar contexto desde un evento del LMS

Cree un `AIAgentSendContextReq` con su biblioteca de protobuf (por ejemplo `protobufjs` o `plugnmeet-protocol-js`):

```text
AIAgentSendContextReq {
  text: "The student has just submitted quiz 3 with a score of 4 out of 5. Review the missed question."
  source: "lms"
}
```

Envíe los bytes codificados a `/api/aiAgent/sendContext` con el JWT de sala del participante en el encabezado `Authorization`.

## Páginas relacionadas

- [Descripción general y conceptos](/docs/ai-agent/overview)
- [Configuración del servidor y del proveedor](/docs/ai-agent/configuration)
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing)
- [API para crear una sala](/docs/api/room/create)
- [API para obtener artefactos](/docs/api/artifact/fetch)
- [Webhooks](/docs/others/webhooks)
