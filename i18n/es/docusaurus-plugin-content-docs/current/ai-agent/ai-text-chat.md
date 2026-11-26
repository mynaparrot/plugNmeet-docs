---
title: "Chat de IA en la reunión: copiloto para moderadores, asistente de alumnos y gestión de salas con IA"
description: "Referencia del chat de texto con IA de plugNmeet: un copiloto de IA para moderadores que ejecuta la gestión de salas con IA mediante herramientas MCP, un asistente de chat con IA en la reunión para participantes, IA integrada en el bloc de notas, la pizarra y las encuestas, memoria de conversación y artefactos de uso."
keywords: [chat de ia en la reunión, copiloto de ia para moderadores, asistente de chat con ia, gestión de salas con ia, asistente de ia para alumnos, ia en el bloc de notas, generador de encuestas con ia, generador de cuestionarios con ia, herramientas mcp para salas, chat de ia autoalojado, asistente de ia en videoconferencia, plugnmeet chat de ia]
sidebar_label: Chat de IA y copiloto de sala
sidebar_position: 6
---

# Chat de IA en la reunión

El servicio `ai_text_chat` incorpora un asistente al panel de chat de la sala. Cumple dos funciones: un copiloto para moderadores que ejecuta operaciones de la sala a petición y un asistente para participantes que responde preguntas, además de asistentes más pequeños integrados en el bloc de notas compartido, la pizarra interactiva y las encuestas.

## Dos funciones en un mismo servicio

### 1. Copiloto con herramientas para moderadores

Cuando un administrador o un moderador conversa con el chat de texto con IA desde el panel de chat, las solicitudes llevan `request_from: CHAT` y el servidor ejecuta el modelo mediante `AITextChatStreamWithTools`. El asistente del moderador está conectado al catálogo de herramientas MCP de la sala, por lo que puede actuar en lugar de limitarse a indicar qué hacer.

Las acciones que deben ocurrir en el navegador del moderador, como cambiar un bloqueo o abrir el cuadro de grabación, se delegan al cliente conectado del administrador mediante RPC sobre NATS. El moderador ve el resultado en la sala y el asistente informa de lo que ha hecho.

El chat de texto con IA básico —el asistente de preguntas y respuestas para participantes y los asistentes integrados en el bloc de notas, la pizarra y las encuestas— es una función de producción estable. Las nuevas capacidades de invocación de herramientas MCP para gestionar salas aún están en expansión, por lo que los nombres de las herramientas, los límites y las áreas de la interfaz pueden cambiar.

### 2. Asistente de aprendizaje y de reunión para participantes

Los participantes disponen de un asistente de texto en streaming con memoria de conversación progresiva. El acceso se concede a todos (`is_allowed_everyone: true`) o a una lista de usuarios (`allowed_user_ids`). Es el mismo asistente que un alumno utiliza para pedir una explicación o que un asistente a la reunión usa para preguntar qué se decidió antes en la llamada.

El mismo servicio también potencia los asistentes contextuales del **bloc de notas compartido**, la **pizarra interactiva** y las **encuestas**, descritos en la sección de IA en varias superficies.

## Capacidades del copiloto para moderadores

Las herramientas del copiloto se agrupan a continuación. Cada acción es una operación normal de la plataforma; el asistente es una forma más rápida de introducir la orden, no un atajo que salte los permisos. Si el moderador no pudiera hacerlo en la interfaz, la llamada a la herramienta falla.

### Controles de los servicios de Insights e IA

| Herramienta | Qué hace |
| --- | --- |
| `configure_speech_to_text` | Inicia o reconfigura la transcripción en vivo y la traducción de subtítulos, incluidos los idiomas hablados y de destino. |
| `configure_chat_translation` | Activa o desactiva la traducción del chat público y define los idiomas de destino permitidos. |
| `configure_meeting_summarization` | Inicia el resumen de la reunión y puede fijar un prompt para la sesión. |

Ejemplos de instrucciones:

- *«Activa la transcripción en vivo en inglés y español.»*
- *«Habilita la traducción del chat para inglés, francés y árabe.»*
- *«Inicia el resumen de la reunión. Céntrate en las decisiones y las tareas pendientes.»*

### Operaciones con participantes y con la sala

| Herramienta | Qué hace |
| --- | --- |
| `manage_participants` | Silencia, reactiva el audio o expulsa participantes, y gestiona los permisos de cada participante. |
| `set_workspace_lock` | Bloquea o desbloquea funciones para los participantes, por ejemplo el chat, el uso compartido de pantalla o las cámaras. |
| `manage_recording` | Inicia o detiene la grabación en la nube. |
| `manage_countdown_timer` | Fija un temporizador de cuenta regresiva de 10 segundos a 2 horas. |
| `manage_external_media` | Controla la reproducción de medios externos, como un video compartido. |
| `get_room_info` | Consulta el estado de la sala en vivo: participantes, funciones activas y ajustes actuales. |

Ejemplos de instrucciones:

- *«Silencia a todos los participantes.»*
- *«Bloquea el chat durante los próximos diez minutos.»*
- *«Inicia la grabación y pon un temporizador de 5 minutos.»*
- *«¿Quién está ahora en la sala?»*

### Salas para grupos pequeños

| Herramienta | Qué hace |
| --- | --- |
| `create_breakout_rooms` | Crea salas para grupos pequeños (breakout rooms) y asigna participantes. |
| `manage_breakout_rooms` | Abre, une, amplía o finaliza las salas para grupos pequeños. |

Ejemplos de instrucciones:

- *«Crea cuatro salas para grupos pequeños y reparte la clase por igual.»*
- *«Dales cinco minutos más a cada grupo y luego cierra las salas.»*

### Encuestas y cuestionarios interactivos

| Herramienta | Qué hace |
| --- | --- |
| `create_poll` | Crea una encuesta con opciones. |
| `close_poll` | Cierra una encuesta activa. |
| `get_poll_results` | Consulta los resultados actuales. |
| `draft_quiz` | Genera un cuestionario de varias preguntas como **borrador** en el chat. |
| `publish_quiz` | Publica como cuestionario en vivo un borrador ya revisado. |

Los cuestionarios siguen un flujo de borrador y publicación: `draft_quiz` nunca publica por sí mismo. El moderador revisa las preguntas en el chat y después llama a `publish_quiz`. Un cuestionario no puede activarse sin la aprobación del moderador.

Ejemplos de instrucciones:

- *«Crea una encuesta para elegir qué tema repasar después.»*
- *«Prepara cinco preguntas sobre la fotosíntesis. No las publiques todavía.»*
- *«Publica el cuestionario.»*

### Creación conjunta en la pizarra y el bloc de notas compartido

| Herramienta | Qué hace |
| --- | --- |
| `notepad_read` | Lee el contenido del bloc de notas compartido. |
| `notepad_write` | Escribe notas estructuradas en el bloc de notas. |
| `whiteboard_write_content` | Añade contenido de texto a la pizarra. |
| `whiteboard_draw_shapes` | Dibuja formas y elementos de maquetación. |
| `whiteboard_draw_freehand_svg` | Dibuja trazos a mano alzada a partir de rutas SVG. |
| `whiteboard_draw_diagram` | Dibuja diagramas estructurados. |
| `whiteboard_laser_point` | Señala un punto de la pizarra. |
| `whiteboard_manage_board` | Gestiona las páginas de la pizarra. |
| `whiteboard_capture_snapshot` | Captura el estado actual de la pizarra como instantánea. |

Ejemplos de instrucciones:

- *«Escribe el orden del día en el bloc de notas compartido.»*
- *«Dibuja el flujo de la solicitud como diagrama.»*
- *«Señala la segunda ecuación.»*

### Conocimiento externo y servidores MCP

| Herramienta | Qué hace |
| --- | --- |
| `fetch_external_knowledge` | Obtiene el contenido de una URL de referencia externa aprobada. |
| `mcp_servers` | Consulta hasta 2 servidores MCP externos de solo lectura configurados en `ai_text_chat_features`. |

La configuración de MCP externo comparte estructura y límites con el agente de voz: URL HTTPS, encabezados opcionales, una lista de permitidos `allowed_tools` y únicamente herramientas de solo lectura. El cupo es compartido, así que una sala no puede duplicar el número de herramientas externas activando ambos servicios.

## IA en varias superficies e interruptores independientes

El chat de texto con IA atiende cuatro superficies, que se distinguen por el campo `request_from`:

| `request_from` | De dónde viene | Comportamiento |
| --- | --- | --- |
| `CHAT` | El panel de chat | Respuesta en streaming con memoria de conversación. Las solicitudes del moderador incluyen las herramientas MCP de la sala. |
| `NOTEPAD` | Asistente del bloc de notas compartido | Turno efímero rápido y sin estado. Sin historial y sin ejecución de herramientas. |
| `WHITEBOARD` | Asistente de la pizarra interactiva | Turno efímero rápido y sin estado. Sin historial y sin ejecución de herramientas. |
| `POLL` | Asistente del creador de encuestas | Turno efímero rápido y sin estado. Sin historial y sin ejecución de herramientas. |

Los turnos efímeros de cada superficie son limitados a propósito: reciben el contexto actual de esa superficie y la instrucción del usuario, y devuelven contenido para ella. No leen la conversación, no escriben en ella y no pueden invocar herramientas. Así el costo en tokens se mantiene bajo y un prompt en el bloc de notas no puede desencadenar una operación de la sala.

Durante exámenes o evaluaciones, el moderador puede desactivar la IA en cada superficie sin apagar todo el servicio:

| Campo de tiempo de ejecución | Efecto |
| --- | --- |
| `is_enabled` | Interruptor principal del chat de texto con IA en la sala. |
| `is_allowed_everyone` | Indica si todos los participantes pueden usar el asistente de chat. |
| `allowed_user_ids` | Lista explícita de participantes autorizados a usarlo. |
| `is_notepad_ai_disabled` | Desactiva la IA solo en el bloc de notas compartido. |
| `is_whiteboard_ai_disabled` | Desactiva la IA solo en la pizarra interactiva. |
| `is_poll_ai_disabled` | Desactiva la IA solo en el creador de encuestas. |

### Puente con el agente de voz individual

En una sala de agente de IA individual (`session_mode: "1on1"`), los mensajes de texto enviados desde `CHAT` se dirigen al agente de voz en vivo cuando `ai_agent_features.allow_chat_message: true`. El alumno escribe, el agente de voz recibe el texto y responde dentro de la sesión, con su voz y su comportamiento habitual en la pizarra.

Esta es la alternativa para alumnos o visitantes sin micrófono operativo: pueden seguir la sesión, escuchar al agente y ver lo que dibuja. El mensaje escrito se trata como un turno normal de la sesión de voz, por lo que la respuesta del agente se escucha y se dibuja en esa misma sesión en lugar de aparecer en un hilo de chat aparte.

## Memoria de conversación y resumen progresivo

El contexto de la conversación se guarda en Redis por usuario:

- Los últimos `context_window` turnos se conservan íntegros. El valor predeterminado es `5` y se define en `insights.services.ai_text_chat.options.context_window`.
- Los turnos anteriores se comprimen en un resumen progresivo que genera `summarize_model` mediante la rutina interna `CheckAndSummarize`.
- El prompt que se envía a `chat_model` es ese resumen progresivo junto con los turnos recientes.

Así el costo en tokens del prompt es predecible en sesiones largas. Una clase de dos horas no reenvía todo el historial en cada mensaje y el modelo sigue sabiendo qué ocurrió al principio.

La memoria está acotada a un usuario en una sala. No se comparte entre participantes ni pasa a una sesión futura.

## Creación de la sala y configuración en tiempo de ejecución

```json
{
  "room_id": "training-room",
  "metadata": {
    "room_title": "New hire training",
    "room_features": {
      "insights_features": {
        "is_allow": true,
        "ai_features": {
          "is_allow": true,
          "ai_text_chat_features": {
            "is_allow": true,
            "mcp_servers": {
              "internal-docs": {
                "url": "https://mcp.example.com/mcp",
                "headers": { "Authorization": "Bearer TOKEN" },
                "allowed_tools": ["search_docs"],
                "scope": "read"
              }
            }
          }
        }
      }
    }
  }
}
```

En la creación de la sala, `ai_text_chat_features` solo habilita el servicio y, opcionalmente, los servidores MCP externos. El resto lo decide el moderador en tiempo de ejecución (`is_enabled`, `is_allowed_everyone`, `allowed_user_ids` y los tres interruptores por superficie anteriores). Consulte [Características de Insights de `/room/create`](/docs/api/room/create#insights-features) para ver el objeto principal.

## Artefactos de uso y facturación

| Artefacto | Tipo | Contenido |
| --- | --- | --- |
| `AI_TEXT_CHAT_INTERACTION_USAGE` | `8` | `token_usage` de `chat_model`: `prompt_tokens`, `completion_tokens`, `total_tokens`, `estimated_cost`. |
| `AI_TEXT_CHAT_SUMMARIZATION_USAGE` | `9` | `token_usage` del resumen de la ventana de contexto en segundo plano, con el precio de `summarize_model`. |

Ambos son registros de metadatos, no archivos descargables, y se entregan mediante el webhook [`artifact_created`](/docs/others/webhooks#artifact-created) al terminar la sala. El uso de las salas para grupos pequeños se atribuye a la sala principal.

Los precios provienen de `insights.services.ai_text_chat.pricing`; consulte [Configuración del servidor y proveedores](/docs/ai-agent/configuration) para las tarifas por token y [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing) para la referencia completa de artefactos.

`ai_text_chat` funciona con Google Gemini o con cualquier endpoint compatible con OpenAI, incluido un servidor local de vLLM, Ollama o LiteLLM. El modelo debe admitir respuestas en streaming y llamadas a funciones, porque así es como el copiloto para moderadores llega a las herramientas de la sala. Las opciones de cada proveedor están en las guías de [Google Gemini](/docs/ai-agent/providers/google) y [OpenAI y autoalojados](/docs/ai-agent/providers/openai); en Azure, Azure OpenAI se configura mediante la [guía de Microsoft Azure](/docs/ai-agent/providers/azure).

## Páginas relacionadas

- [Descripción general e Insights](/docs/ai-agent/overview)
- [Capacidades y límites del agente](/docs/ai-agent/tools-and-capabilities): el conjunto de herramientas del agente de voz y por qué nunca recibe herramientas de administración de la sala.
- [Configuración del servidor y proveedores](/docs/ai-agent/configuration): modelos de `ai_text_chat`, `context_window` y precios por token.
- Guías por proveedor: [Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai) y [Microsoft Azure](/docs/ai-agent/providers/azure).
- [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation)
- [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization)
- [Guía para desarrolladores y API](/docs/ai-agent/developer-guide): endpoints `/api/insights/*` en tiempo de ejecución.
- [Características de Insights de `/room/create`](/docs/api/room/create#insights-features)
