---
title: "Agente de IA para videoconferencia en vivo: descripción general y marco de Insights"
description: "Descubra cómo funciona el Agente de IA de plugNmeet como asistente de voz con visión de la pizarra en una sala WebRTC en vivo, y cómo los seis servicios de la plataforma Insights cubren subtítulos en vivo, resumen de reuniones con IA y chat de IA en la reunión."
keywords: [agente de ia, asistente de ia con herramientas, marco de insights, subtítulos en vivo, transcripción de voz a texto en tiempo real, resumen automático de reuniones con ia, asistente de chat con ia, aula virtual con ia, asistente de ia autoalojado, videoconferencia webrtc con ia, demostración interactiva de producto, plugnmeet ia, avatar de video ia, avatar ia en tiempo real, presentador virtual ia]
sidebar_label: Descripción general y conceptos
sidebar_position: 1
---

import AiAgentShowcase from '@site/src/components/AiAgentShowcase';

# Agente de IA autónomo para salas de video en vivo

El Agente de IA de plugNmeet es un **asistente interactivo centrado en la voz** que se une a una sala de video en vivo como un participante más. Conversa con las personas en tiempo real, solo con voz o **con un avatar de video con sincronización labial**. Lee y dibuja en la pizarra compartida, escribe en el bloc de notas compartido, plantea cuestionarios y encuestas y, al final, genera un resumen estructurado. Está pensado para la enseñanza, las demostraciones guiadas de producto y la incorporación de nuevos clientes o alumnos, situaciones en las que la conversación se beneficia del apoyo visual.

<AiAgentShowcase locale="es" />

:::info En desarrollo activo
**La transcripción en vivo (STT), la traducción, la síntesis de voz (TTS), el chat de texto con IA y el resumen de reuniones son funciones estables de producción.** Solo el Agente de IA por voz (`ai_agent`) y la invocación de herramientas MCP por parte del agente siguen en desarrollo activo; sus campos, valores predeterminados y comportamiento pueden cambiar antes del lanzamiento general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista para cuando el agente esté terminado y publicado. Mientras tanto, puede configurarlo mediante la API de plugNmeet.
:::

## La plataforma Insights y las capacidades del agente de IA

El Agente de IA es uno de los seis servicios de la plataforma **Insights**, que se ejecuta en el servidor. Los seis se configuran en `config.yaml` dentro de `insights`, se habilitan por sala en `insights_features` y se facturan a través del mismo flujo de artefactos. El agente es el único que habla; los demás escuchan, traducen, escriben y toman notas de lo que ocurre.

| Servicio | Caso de uso principal | Dónde se ejecuta | Guía |
| --- | --- | --- | --- |
| `transcription` | Transcripción de voz a texto en tiempo real de los oradores autorizados, entregada como fragmentos de subtítulos en vivo | `RoomAgent` oculto suscrito a las pistas de micrófono | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `translation` | Traducción de subtítulos en vivo a varios idiomas y traducción del chat público a petición | Llamadas sin estado por fragmento y por mensaje | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `speech-synthesis` | Traducción hablada: los subtítulos traducidos se sintetizan como pistas de audio en la sala | Un proceso TTS por cada idioma de destino autorizado | [Subtítulos en vivo, STT y traducción](/docs/ai-agent/speech-to-text-and-translation) |
| `meeting_summarizing` | Resumen escrito posterior a la reunión a partir de una captura de audio mezclado, con un prompt personalizado | Trabajo por lotes al terminar la sala | [Resumen de reuniones con IA](/docs/ai-agent/meeting-summarization) |
| `ai_text_chat` | Copiloto para moderadores con herramientas de sala, preguntas y respuestas para participantes y asistentes integrados en el bloc de notas, la pizarra y las encuestas | Texto en streaming con memoria en Redis | [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat) |
| `ai_agent` | Tutor individual centrado en la voz, presentador de demostraciones y guía de incorporación sobre una pizarra compartida | Sesión de voz en tiempo real en una sala para grupos pequeños | [Guía para desarrolladores y API](/docs/ai-agent/developer-guide) |

Dos propiedades se mantienen en todo el marco:

- **Asignación de proveedor por servicio.** Cada servicio apunta a su propia cuenta de proveedor y a sus modelos, de modo que Azure puede gestionar la voz mientras Gemini se encarga del resumen. Google Gemini y OpenAI (incluidos los servidores compatibles con OpenAI y los autoalojados) implementan los seis servicios; Azure nativo implementa los tres servicios de voz y Azure OpenAI cubre el resto. Consulte la [matriz de capacidades por proveedor](/docs/ai-agent/configuration#matriz-de-capacidades-por-proveedor) y las guías de [Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure) y [Proveedores de avatar](/docs/ai-agent/providers/avatar).
- **Un único modelo de artefactos.** Los archivos y los registros de uso se entregan mediante el mismo webhook [`artifact_created`](/docs/others/webhooks#artifact-created), con el uso atribuido a la sala principal.

## Avatar de video en tiempo real (opcional)

Un avatar le pone rostro al agente de voz. `beyond_presence`, `anam` o `simli` convierten el habla del agente en video con sincronización labial: esto ayuda a mantener la atención de los alumnos más pequeños, hace que una demostración de producto parezca una presentación en vivo y permite mostrar a un anfitrión en pantalla durante la incorporación.

1. **La voz y el video son independientes.** Su proveedor de LLM (Google Gemini u OpenAI) genera el habla y las llamadas a herramientas del agente. El proveedor de avatar solo convierte ese flujo de audio en video en vivo con sincronización labial.
2. **El avatar se une como participante de la sala.** Al iniciar la sesión, el servidor invita al proveedor de avatar a la sala de plugNmeet con un token acotado. Con un avatar activo, el proveedor transmite el video y el audio sincronizados y admite la interrupción inmediata cuando el usuario toma la palabra.
3. **Valor predeterminado del servidor o BYOK por sala.** Defina un avatar predeterminado en el servidor, o permita que los anfitriones aporten su proveedor, `avatar_id`, `max_avatar_minutes` y `api_key` BYOK por sala. Los secretos de la sala se eliminan de los metadatos que se publican en NATS y se conservan solo en Redis.
4. **Facturación por duración aparte y regla de E2EE.** Los minutos de avatar se facturan en un artefacto exclusivo `AI_AGENT_AVATAR_USAGE` y nunca se mezclan con los costos de tokens. Como el proveedor se une como participante de medios externo, el **E2EE debe estar completamente desactivado** y su servidor de plugNmeet debe ser accesible para el proveedor.

La configuración, los endpoints de cada proveedor y los campos BYOK están en la guía de [Proveedores de avatar](/docs/ai-agent/providers/avatar).

## Para quién está pensado

| Perfil | Qué le aporta el Agente de IA |
| --- | --- |
| **Docentes, coaches y formadores** | Un tutor individual y paciente para cada alumno, con una pizarra interactiva para resolver ejemplos y cuestionarios para comprobar la comprensión. |
| **Administradores escolares** | Salas de estudio programadas y de autoservicio, además de informes de dominio al finalizar cada sesión, sin sumar horas de personal. |
| **Fundadores de SaaS y responsables de producto** | Una demostración interactiva disponible las 24 horas que guía a los interesados por diapositivas, diagramas y respuestas en vivo sobre el producto. |
| **Equipos de ventas y soporte** | Preguntas de descubrimiento, notas de calificación y un resumen de traspaso estructurado para el CRM. |
| **Desarrolladores e integradores** | Una API REST y protobuf documentada, ajustes de proveedor por sala, conexiones de herramientas MCP y artefactos entregados por webhooks. |

## Dónde encajan los casos de uso

### 1. Educación y profesor virtual

Cada alumno dispone de una sala para grupos pequeños privada y 1 a 1 con el agente. El agente explica un concepto, dibuja un ejemplo resuelto en la pizarra, pide al alumno que responda y lanza un cuestionario rápido. El docente puede impartir toda la clase así, asignar una lista de alumnos o abrir una sala de estudio de autoservicio que los alumnos utilicen en cualquier momento.

Consulte la [guía de educación y profesor virtual](/docs/ai-agent/educator-guide).

### 2. Demostraciones interactivas de producto y facilitación de ventas

Un interesado abre un enlace embebido y el agente presenta un PDF o una presentación de Office ya cargados, página a página. Usa un puntero láser para señalar zonas, dibuja un diagrama de arquitectura con Mermaid, responde con documentación de producto aprobada y lanza encuestas de descubrimiento para calificar la oportunidad. El resumen de la sesión llega al equipo de ventas mediante un webhook.

Consulte [Demostraciones de producto, ventas y negocios](/docs/ai-agent/business-and-use-cases).

### 3. Documentación técnica e incorporación de clientes

Para ingenieros y equipos de soporte que se incorporan, el agente escribe listas de verificación de configuración en el bloc de notas compartido, dibuja flujos de datos en la pizarra y puede leer páginas de documentación aprobadas en vivo por HTTPS. El cliente se lleva la lista de verificación y el diagrama construidos durante la llamada.

Consulte [Demostraciones de producto, ventas y negocios](/docs/ai-agent/business-and-use-cases).

## En qué se diferencia de otras herramientas

| Tipo de herramienta | Qué hace | Qué añade el Agente de IA de plugNmeet |
| --- | --- | --- |
| **Bot de transcripción de reuniones** | Escucha de forma pasiva y genera una transcripción al terminar la reunión. | El agente habla, responde y actúa durante la sesión. Es un participante, no un observador. |
| **Chatbot de texto** | Responde preguntas escritas en una ventana de chat. | El agente trabaja con voz y en espacios visuales compartidos, con interrupciones (puede interrumpirlo a mitad de una frase). |
| **IA sobre grabación de pantalla o cámara** | Analiza rostros, cámaras o pantallas. | El agente observa **solo** la pizarra y el bloc de notas compartido. No mira las cámaras ni las pantallas compartidas. |
| **Asistente de voz genérico** | Funciona con un prompt de propósito general. | Un límite de tema definido por el servidor, un encabezado de instrucción de plataforma bloqueado y bloqueos de alcance mantienen al agente en la lección o la demostración. |

## Qué puede y qué no puede hacer el agente de IA

| Área | Puede | No puede |
| --- | --- | --- |
| **Conversación** | Mantener una conversación hablada en vivo, responder a interrupciones, hablar en el idioma y a la velocidad de voz configurados y mantenerse dentro del tema definido por el anfitrión. | Tratar temas fuera del límite configurado ni continuar cuando su sesión termina o se agota el presupuesto. |
| **Visión** | Ver la **pizarra** y el **bloc de notas compartido** como instantáneas de imagen y una descripción estructurada de la escena. | Ver cámaras, pantallas compartidas ni cualquier otro video. El agente nunca captura contenido de cámara o pantalla. |
| **Avatar y presencia en video** | Mostrar un avatar de video en tiempo real, con sincronización labial y generado por su propia voz, mediante Beyond Presence, Anam o Simli. | Funcionar en una sala con cifrado de extremo a extremo ni con un proveedor que usted no haya configurado. Un avatar exige que el E2EE esté completamente desactivado. |
| **Pizarra** | Dibujar formas, añadir texto, dibujar trazos SVG a mano alzada, renderizar diagramas de Mermaid, usar el puntero láser, cambiar de página o de archivo Office/PDF, ampliar y limpiar la pizarra. Deshacer sus últimas 20 acciones. | Borrar o modificar el trabajo de los participantes, más allá de sus propias acciones deshacibles. |
| **Bloc de notas compartido** | Leer el bloc de notas y escribir actualizaciones por bloques. Abre el bloc de notas automáticamente cuando escribe. | Editar el bloc de notas cuando el anfitrión ha desactivado la escritura en él. |
| **Evaluación** | Crear cuestionarios y encuestas, cerrar encuestas, leer resultados y reaccionar de inmediato a cada respuesta. | Calificar trabajo que nunca pasó por la pizarra, el bloc de notas o la conversación. |
| **Conocimiento** | Obtener páginas HTTPS aprobadas (si está habilitado) y llamar a herramientas de solo lectura en hasta dos servidores MCP externos. | Navegar por la web abierta, llamar a herramientas externas con permiso de escritura ni acceder a direcciones privadas o de la red interna. |
| **Memoria entre sesiones** | Trasladar a una nueva sesión un resumen estructurado y un prompt de próxima sesión cuando el anfitrión los envía. | Recordar automáticamente a un alumno o a un interesado. La continuidad solo ocurre mediante los resúmenes que su sistema devuelve. |
| **Datos y costo** | Generar un resumen de sesión y artefactos de uso por rol atribuidos a la sala principal. | Facturarle el uso cuando utiliza su propia clave de proveedor (BYOK). |

## Cómo funciona una sesión

1. **Habilitar.** El anfitrión crea una sala con `insights_features.ai_agent_features`, o un moderador habilita el agente para una sala para grupos pequeños. El anfitrión define el tema, el prompt de sistema y el modo de sesión.
2. **Dirigir.** En los modos automáticos por usuario, cada alumno o visitante se dirige a una sala para grupos pequeños 1 a 1 aislada llamada `<Name> (AI Session)`. La sala principal actúa como sala de espera.
3. **Conversar y trabajar.** El agente habla con el participante y utiliza la pizarra, el bloc de notas, los cuestionarios y las encuestas. La visión se actualiza cuando cambian la pizarra o el bloc de notas.
4. **Proteger.** Las salvaguardas mantienen al agente dentro del tema. Las peticiones repetidas fuera de tema bloquean las herramientas con efectos secundarios durante la sesión.
5. **Cerrar.** Al terminar la sesión, el servidor escribe un artefacto `AI_AGENT_SESSION_SUMMARY` y un artefacto `AI_AGENT_USAGE` asociados a la sala principal, más un artefacto `AI_AGENT_AVATAR_USAGE` cuando hubo un avatar en tiempo real. Su backend recibe un webhook `artifact_created`.
6. **Continuar.** Su sistema obtiene el resumen y lo envía a la siguiente sesión como `user_metadata.previous_session_context`.

## Por dónde seguir

| Si quiere… | Empiece por |
| --- | --- |
| Entender los seis servicios y cómo encajan | [Descripción general y conceptos](/docs/ai-agent/overview) (esta página) |
| Ofrecer tutorías con IA 1 a 1 en una clase | [Educación y profesor virtual](/docs/ai-agent/educator-guide) |
| Crear una demostración interactiva o un flujo de incorporación | [Demos de producto, ventas y negocios](/docs/ai-agent/business-and-use-cases) |
| Saber qué puede ver, invocar y rechazar el agente | [Capacidades y límites del agente](/docs/ai-agent/tools-and-capabilities) |
| Integrar la API, los webhooks y los endpoints dentro de la sala | [Guía para Desarrolladores y API](/docs/ai-agent/developer-guide) |
| Dar a los moderadores un copiloto y a los participantes un asistente con IA | [Chat de IA y Copiloto de Sala](/docs/ai-agent/ai-text-chat) |
| Generar actas y notas de reunión con IA a partir del audio | [Resumen de Reuniones con IA](/docs/ai-agent/meeting-summarization) |
| Añadir subtítulos en vivo, traducción o traducción hablada | [Subtítulos en Vivo, STT y Traducción](/docs/ai-agent/speech-to-text-and-translation) |
| Configurar proveedores, modelos y precios | [Configuración del servidor y proveedores](/docs/ai-agent/configuration) |
| Mostrar al agente mediante un avatar de video con sincronización labial | [Proveedores de avatar](/docs/ai-agent/providers/avatar) |
| Desplegar en una nube concreta o en una pila local | [Google Gemini](/docs/ai-agent/providers/google), [OpenAI y autoalojados](/docs/ai-agent/providers/openai), [Microsoft Azure](/docs/ai-agent/providers/azure) |
| Leer el JSON del resumen, los campos de uso y las reglas de costo | [Resúmenes y Artefactos de Uso](/docs/ai-agent/artifacts-and-billing) |

## Lecturas relacionadas

- [Cómo añadir funciones de asistente de IA a sus reuniones](/blog/how-to-add-ai-meeting-assistant-features)
- [Cómo la IA transforma el aula virtual](/blog/ai-transforms-virtual-classroom)
- [Videoconferencia autoalojada con OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet)
- [Resumen de seguridad](/docs/security-overview): cómo interactúan los flujos de datos de IA y E2EE.
- [Integración en aplicaciones móviles y de escritorio](/docs/developer-guide/mobile-app-integration): cree aplicaciones móviles o de escritorio interactivas con IA (iOS, Android, Flutter, React Native, Electron) combinando medios nativos y WebView.
