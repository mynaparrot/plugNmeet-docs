---
title: "Agente de IA autónomo para salas de video en vivo: descripción general y conceptos"
description: "Descubra cómo funciona el Agente de IA de plugNmeet como asistente de voz con visión de la pizarra dentro de una sala WebRTC en vivo, para la enseñanza virtual, las demostraciones interactivas de producto y el onboarding técnico."
keywords: [agente de ia, ia agéntica, tutor de ia, profesor virtual, demostración interactiva de producto, pizarra con ia, ia de voz, ia webrtc, asistente de ia autoalojado, plugnmeet ia, facilitación de ventas, onboarding de clientes]
sidebar_label: Descripción general y conceptos
sidebar_position: 1
---

# Agente de IA autónomo para salas de video en vivo

El Agente de IA de plugNmeet es un **asistente agéntico con prioridad en la voz** que se une a una sala de video en vivo como un participante más. Conversa con las personas en tiempo real, lee y dibuja en la pizarra compartida, escribe en el bloc de notas compartido, realiza cuestionarios y encuestas, y al final genera un resumen estructurado. Está pensado para la enseñanza, las demostraciones guiadas de producto y el onboarding de nuevos clientes o alumnos, situaciones en las que la conversación se beneficia de un trabajo visual.

:::info En desarrollo activo
El motor del Agente de IA y sus API están en desarrollo activo. Los nombres de los campos, los valores predeterminados y el comportamiento pueden cambiar antes de la publicación general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista para cuando la función esté terminada y publicada. Mientras tanto, la función se configura mediante la API de plugNmeet.
:::

## Para quién está pensado

|| Público | Lo que obtiene con el Agente de IA |
|| --- | --- |
|| **Docentes, coaches y formadores** | Un tutor individual y paciente para cada alumno, con una pizarra para los ejemplos resueltos y cuestionarios para comprobar la comprensión. |
|| **Administradores escolares** | Salas de estudio programadas y de acceso libre, e informes de dominio al terminar cada sesión, sin necesidad de añadir horas de personal. |
|| **Fundadores de SaaS y responsables de marketing de producto** | Una demostración interactiva disponible las 24 horas que guía a los prospectos por diapositivas, diagramas y respuestas sobre el producto en vivo. |
|| **Equipos de ventas y soporte** | Preguntas de descubrimiento, notas de calificación y un resumen estructurado listo para enviar al CRM. |
|| **Desarrolladores e integradores** | Una API REST y protobuf documentada, configuración del proveedor por sala, conexiones de herramientas MCP y artefactos generados mediante webhooks. |

## Dónde encajan los casos de uso

### 1. Educación y profesor virtual

Cada alumno dispone de una sala de grupo privada 1 a 1 con el agente. El agente explica un concepto, dibuja un ejemplo resuelto en la pizarra, pide al alumno que responda y lanza un cuestionario rápido. Un docente puede llevar toda la clase de este modo, asignar una lista de alumnos o abrir una sala de estudio de acceso libre que los alumnos usen cuando quieran.

Consulte la [guía de Educación y profesor virtual](/docs/ai-agent/educator-guide).

### 2. Demostraciones interactivas de producto y facilitación de ventas

Un prospecto abre un enlace incrustado y el agente presenta, página por página, una presentación PDF u Office cargada. Usa un puntero láser para destacar zonas, dibuja con Mermaid un diagrama de arquitectura personalizado, responde preguntas con documentación de producto aprobada y lanza encuestas de descubrimiento para calificar al cliente potencial. El resumen de la sesión se envía al equipo comercial mediante un webhook.

Consulte [Demostraciones de producto, ventas y negocios](/docs/ai-agent/business-and-use-cases).

### 3. Documentación técnica y onboarding de clientes

Para los ingenieros de onboarding y los equipos de soporte, el agente escribe listas de verificación de configuración en el bloc de notas compartido, esboza flujos de datos en la pizarra y puede leer páginas de documentación aprobadas, en directo y a través de HTTPS. El cliente se lleva la lista de verificación y el diagrama elaborados durante la llamada.

Consulte [Demostraciones de producto, ventas y negocios](/docs/ai-agent/business-and-use-cases).

## En qué se diferencia de otras herramientas

|| Tipo de herramienta | Qué hace | Lo que aporta el Agente de IA de plugNmeet |
|| --- | --- | --- |
|| **Bot de transcripción de reuniones** | Escucha de forma pasiva y genera una transcripción al final de la reunión. | El agente habla, responde y actúa durante la sesión. Es un participante, no un observador. |
|| **Chatbot de texto** | Responde a preguntas escritas en una ventana de chat. | El agente trabaja por voz y sobre espacios visuales compartidos, y se puede interrumpir (usted puede cortarlo a mitad de una frase). |
|| **IA de grabación de pantalla o de cámara web** | Analiza rostros, cámaras web o pantallas. | El agente mira **únicamente** la pizarra y el bloc de notas compartido. No observa las cámaras web ni las pantallas compartidas. |
|| **Asistente de voz genérico** | Funciona a partir de una instrucción de propósito general. | Un límite de tema controlado por el servidor, una instrucción de plataforma bloqueada y los límites de alcance mantienen al agente en la lección o en la demostración. |

## Qué puede y qué no puede hacer el agente de IA

|| Área | Puede hacer | No puede hacer |
|| --- | --- | --- |
|| **Conversación** | Mantener una conversación hablada en directo, responder a las interrupciones, hablar en el idioma y a la velocidad configurados, y ceñirse al tema definido por el moderador. | Hablar de temas fuera del límite configurado, ni seguir después de que termine su sesión o se agote su presupuesto. |
|| **Visión** | Ver la **pizarra** y el **bloc de notas compartido** como imágenes instantáneas y una descripción estructurada de la escena. | Ver cámaras web, pantallas compartidas ni ningún otro video. El agente nunca captura el contenido de la cámara o de la pantalla. |
|| **Pizarra** | Dibujar formas, añadir texto, trazar SVG a mano alzada, renderizar diagramas Mermaid, usar un puntero láser, cambiar de página o de archivo de Office/PDF, hacer zoom y borrar el contenido. Deshacer sus últimas 20 acciones. | Borrar o modificar el trabajo de los participantes, más allá de las acciones que el propio agente puede deshacer. |
|| **Bloc de notas compartido** | Leer el bloc de notas y escribir actualizaciones por bloques. Se abre automáticamente cuando el agente escribe en él. | Editar el bloc de notas cuando el moderador ha desactivado la escritura. |
|| **Evaluación** | Crear cuestionarios y encuestas, cerrar encuestas, leer resultados y reaccionar de inmediato a cada respuesta. | Calificar trabajos que nunca se hayan colocado en la pizarra, en el bloc de notas o en la conversación. |
|| **Conocimiento** | Consultar páginas HTTPS aprobadas (cuando está habilitado) y llamar a herramientas de solo lectura en hasta dos servidores MCP externos. | Navegar por la web abierta, llamar a herramientas externas con permisos de escritura o acceder a direcciones de red privadas o internas. |
|| **Memoria entre sesiones** | Trasladar un resumen estructurado y un prompt para la siguiente sesión a una nueva sesión cuando el moderador se los proporciona. | Recordar por sí solo a un alumno o a un prospecto. La continuidad solo se produce a través de los resúmenes que devuelve su sistema. |
|| **Datos y costo** | Generar un resumen de sesión y artefactos de uso por rol, asignados a la sala principal. | Facturar a su plataforma el uso cuando usted aporta su propia clave de proveedor (BYOK). |

## Cómo funciona una sesión

1. **Habilitar.** El moderador crea una sala con `insights_features.ai_agent_features`, o un moderador habilita el agente para una sala de grupo. El moderador define el tema, la instrucción del sistema y el modo de sesión.
2. **Asignar.** En los modos automáticos por usuario, cada alumno o visitante pasa a una sala de grupo 1 a 1 aislada llamada `<Nombre> (Sesión de IA)`. La sala principal funciona como sala de espera.
3. **Conversar y trabajar.** El agente habla con el participante y utiliza la pizarra, el bloc de notas, los cuestionarios y las encuestas. Las actualizaciones de visión se envían cuando cambian la pizarra o el bloc de notas.
4. **Proteger.** Las salvaguardas mantienen al agente en el tema. Si se repiten las solicitudes fuera de tema, se bloquean las herramientas con efectos secundarios durante la sesión.
5. **Cerrar.** Cuando termina la sesión, el servidor escribe un artefacto `AI_AGENT_SESSION_SUMMARY` y un artefacto `AI_AGENT_USAGE` en la sala principal. Su backend recibe un webhook `artifact_created`.
6. **Continuar.** Su sistema obtiene el resumen y lo pasa a la siguiente sesión como `previous_session_context`.

## Explore las guías

- [Educación y profesor virtual](/docs/ai-agent/educator-guide): flujos de trabajo en el aula, plantillas de prompts y lectura de informes de dominio.
- [Demostraciones de producto, ventas y negocios](/docs/ai-agent/business-and-use-cases): flujos de trabajo de demostración, onboarding, coaching y envío de datos al CRM.
- [Capacidades, visión y salvaguardas](/docs/ai-agent/tools-and-capabilities): visión de la pizarra, bloc de notas, cuestionarios, temporizadores y capas de seguridad.
- [Configuración del servidor y del proveedor](/docs/ai-agent/configuration): referencia de `config.yaml`, cuentas de proveedor, precios y BYOK.
- [Guía para desarrolladores y de la API](/docs/ai-agent/developer-guide): cada campo de `ai_agent_features`, ejemplos de solicitudes, MCP y continuidad.
- [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing): esquema JSON del resumen, campos de uso y contabilidad de costos.

## Lecturas relacionadas

- [Cómo añadir funciones de asistente de IA a sus reuniones](/blog/how-to-add-ai-meeting-assistant-features)
- [Cómo la IA transforma el aula virtual](/blog/ai-transforms-virtual-classroom)
- [Videoconferencia autoalojada con OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet)
- [Resumen de seguridad](/docs/security-overview): cómo fluyen los datos de la IA y cómo interactúa con el E2EE.
