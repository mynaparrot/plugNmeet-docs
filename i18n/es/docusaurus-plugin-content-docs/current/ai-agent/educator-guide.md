---
title: "Profesor virtual con IA para clases en línea: guía para docentes y administradores escolares"
description: "Guía práctica para docentes, coaches y administradores escolares que desean ofrecer tutorías con IA en plugNmeet, con sesiones dirigidas por el docente, listas de alumnos asignados, salas de estudio disponibles las 24 horas e informes de dominio."
keywords: [profesor virtual con ia, tutor de ia para estudiantes, software de tutorías en línea, aula virtual con ia, sala de estudio con ia, preparación de exámenes con ia, coach de idiomas con ia, tutor de pizarra, videoconferencia escolar, informe de dominio del estudiante]
sidebar_label: Educación y profesor virtual
sidebar_position: 2
---

# Profesor virtual con IA: guía para docentes

Cada alumno aprende a un ritmo distinto. El Agente de IA de plugNmeet ofrece a cada estudiante un tutor individual, paciente y privado dentro de su aula virtual. El agente conversa con el alumno, resuelve problemas en la pizarra, hace preguntas y comprueba la comprensión con cuestionarios. Usted mantiene el control del tema, del tono y del horario.

:::info En Desarrollo Activo
El motor del Agente de IA y sus API están en desarrollo activo. Las funciones descritas aquí pueden cambiar antes de la publicación general. La integración con un solo clic en los plugins de **Moodle, WordPress y Joomla** está prevista una vez que la función se finalice y se publique. Mientras tanto, su equipo técnico puede configurar la función mediante la API de plugNmeet.
:::

## Qué hace el agente en su clase

- **Explica** un concepto en lenguaje sencillo, en el idioma que usted elija y a la velocidad de habla que establezca.
- **Dibuja** diagramas, ecuaciones y ejemplos resueltos en la pizarra mientras habla.
- **Escribe** notas estructuradas en el bloc de notas compartido, como una solución paso a paso o una lista de vocabulario.
- **Verifica la comprensión** con cuestionarios y encuestas, y explica de inmediato cada respuesta.
- **Se mantiene en el tema.** Sigue el tema de la lección que usted define y reconduce con suavidad a los alumnos cuando se desvían.
- **Informa.** Después de cada sesión, usted recibe un resumen de lo que el alumno dominó, de las dificultades que tuvo y de lo que debe repasar a continuación.

**No** observa a los alumnos a través de sus cámaras web ni de las pantallas compartidas. El agente solo ve la pizarra y el bloc de notas compartido.

## Tres flujos de trabajo en el aula

plugNmeet permite utilizar el agente de tres maneras en una clase. Elija la que mejor se adapte a su lección.

### 1. Sesiones de grupo dirigidas por el docente (`NORMAL_ROOM`)

Usted dirige la clase. Durante la lección, abra el panel **Breakout Rooms** y cree sesiones de IA 1 a 1 para los alumnos que elija. Cada sesión es una sala de grupo privada con el agente. El panel **Sesiones de IA** muestra qué alumnos están en una sesión, para que pueda supervisar su progreso e intervenir cuando sea necesario.

Ideal para: práctica guiada durante una lección en directo, o refuerzo para algunos alumnos mientras el resto de la clase trabaja en otras tareas.

### 2. Lista de alumnos asignados (`CONTROLLED_USERS`)

Usted indica los alumnos que pueden usar el agente, hasta **32 identificadores de estudiante**. Cuando un alumno autorizado se une a la sala principal, la plataforma lo coloca automáticamente en su propia sala de grupo aislada, con el nombre `<Nombre> (Sesión de IA)`. La sala principal funciona como sala de espera. Los estudiantes que no están en la lista no pueden iniciar una sesión de IA.

Ideal para: apoyo en las tareas, un curso de aula invertida o un grupo de tutoría con una lista fija.

### 3. Sala de estudio de autoservicio disponible las 24 horas (`OPEN_PER_USER`)

Cualquier alumno que abra el enlace de la sala de estudio recibe automáticamente una sesión 1 a 1 con el agente. Su administrador establece `max_concurrent_sessions` para controlar cuántos alumnos pueden estar en una sesión al mismo tiempo. El servidor limita este valor a **16 sesiones simultáneas**. En este modo, las cámaras web y la compartición de pantalla están desactivadas, de modo que la sala se mantiene centrada en la lección y en la pizarra.

Ideal para: preparación de exámenes, práctica de idiomas fuera del horario escolar y repaso antes de una prueba.

:::tip Cómo elegir un modo
Use las **Sesiones de grupo dirigidas por el docente** cuando quiera estar presente. Use la **Lista de alumnos asignados** para un grupo conocido que necesita práctica periódica. Use el **Autoservicio disponible las 24 horas** cuando los alumnos necesitan ayuda fuera del horario de clase.
:::

## Plantillas de prompts listas para usar

Su equipo técnico introduce el prompt en `system_prompt` de la sala, junto con un `topic` y, opcionalmente, `allowed_subtopics`. Adapte estas plantillas a su curso. Mantenga un tono alentador y un alcance del agente acotado.

### Tutor de matemáticas y pizarra (STEM)

```text
You are a patient math tutor for Grade 9 students. Teach linear equations.
Work through problems step by step on the whiteboard, one step at a time.
Ask the student to predict the next step before you show it.
When the student makes a mistake, point to the step on the board, name the error gently,
and ask a guiding question. Do not give the final answer until the student has tried twice.
After every two worked examples, create a short quiz with one multiple-choice question.
Stay within algebra and linear equations. Politely decline other topics.
```

Ajustes de sala sugeridos: `topic: "Ecuaciones lineales (álgebra de 9.º grado)"`, `allowed_subtopics: ["resolución de ecuaciones de una variable", "problemas verbales", "comprobación de soluciones"]`.

### Coach de conversación en idiomas

```text
You are a friendly Spanish speaking coach for adult beginners. Speak mostly in simple Spanish,
and explain grammar in English when the student is confused.
Ask one question at a time. Correct pronunciation or grammar with a short, kind example.
Use the whiteboard to write new vocabulary with a simple picture or diagram.
Keep each turn short so the student speaks more than you do.
Finish each session by writing three key phrases in the shared notepad.
```

Ajustes de sala sugeridos: `target_lang: "es-ES"`, `spoken_lang: "en-US"`, `instruction_lang: "en-US"`, y un `speaking_rate` entre `0.8` y `1.0` para principiantes. El rango de `speaking_rate` va de `0.5` a `2.0`, siendo `1.0` el ritmo normal.

### Tutor de preparación de exámenes

```text
You are an exam preparation tutor for a high-school history test on the causes of World War I.
Ask the student to explain one cause in their own words, then ask a follow-up question.
Every five turns, run a quiz with four questions covering the main causes.
Do not lecture for more than thirty seconds at a time.
If the student scores below 60 percent on a quiz, go back to the weakest topic and explain it again with a timeline on the whiteboard.
```

Ajustes de sala sugeridos: `topic: "Causas de la Primera Guerra Mundial"`, `forbidden_topics: ["otras guerras", "acontecimientos políticos actuales"]`.

## Controles dentro de la sala para docentes y alumnos

### La barra de estado

La barra de estado de IA muestra lo que el agente está haciendo en ese momento. Los estados son:

| Estado | Significado |
| --- | --- |
| **Conectando** | El agente se está uniendo a la sesión. |
| **Escuchando** | El agente espera a que el alumno hable. |
| **Pensando** | El agente está preparando una respuesta. |
| **Hablando** | El agente está hablando. |
| **Dibujando** | El agente está trabajando en la pizarra. |
| **En pausa** | La sesión está en pausa y el agente no responde. |
| **Reconectando** | Se perdió la conexión y el agente intenta volver a unirse. |
| **Detenido** | La sesión ha terminado. |

### Hablar con el agente

Los alumnos pueden hablar con naturalidad. Pueden **interrumpir al agente a mitad de una frase** (interrupción o *barge-in*), y el agente se detiene y escucha. Esto es importante para la práctica de idiomas y para los alumnos que quieren hacer una pregunta rápida.

### Dibujar en la pizarra

Los alumnos y los docentes pueden dibujar en la pizarra mientras el agente habla. El agente ve el estado más reciente de la pizarra, por lo que puede referirse a lo que el alumno ha dibujado. Los docentes también pueden usar el puntero láser y otras herramientas de la pizarra para señalar el trabajo del agente.

### Pausa y silencio local

- **Pausa:** Un moderador o el propietario de la sesión puede pausar al agente. La barra de estado muestra **En pausa** hasta que la sesión se reanuda.
- **Silencio local:** Un alumno puede silenciar su propio micrófono para pensar en silencio, sin detener la sesión.

### El cuadro de chat de IA

Las preguntas escritas en el cuadro de chat de IA se envían al agente dentro de la misma sesión. Use los mensajes escritos para la ortografía, los enlaces o el código, cuando hablar no resulte práctico.

### Propiedad del espacio de trabajo

El trabajo en la pizarra y en el bloc de notas compartido se asocia a quien lo creó. Los cambios del agente se registran por separado, y el agente puede deshacer sus últimas 20 acciones. Los alumnos y los docentes conservan sus propios dibujos y notas.

## Cómo leer los informes de dominio al finalizar la sesión

Al terminar cada sesión, la plataforma crea un artefacto `AI_AGENT_SESSION_SUMMARY` para la sala principal. Su sistema de aprendizaje o su LMS puede obtenerlo a través de la API, o su administrador puede revisarlo en la lista de artefactos. Un informe típico incluye:

- **Puntuación global y nivel de dominio**, con una breve nota sobre la participación.
- **Conceptos dominados, practicados y con dificultades.**
- **Términos clave** que utilizó el alumno, útiles para verificar el vocabulario.
- **Resultados de los cuestionarios**: número total de preguntas, precisión y preguntas que el alumno respondió mal.
- **Registro de progreso**, con cada concepto y su estado a lo largo de la sesión.
- **Próximos pasos**: un enfoque sugerido para la siguiente sesión y una lista de subtemas pendientes.

Los informes están redactados para docentes. Utilícelos para planificar su próxima lección, no como una calificación por sí solos. La estructura completa se describe en [Resúmenes y artefactos de uso](/docs/ai-agent/artifacts-and-billing).

## Consejos para una implantación exitosa

1. **Empiece con una sola clase.** Pruebe las **Sesiones de grupo dirigidas por el docente** durante dos lecciones y, después, decida si desea ampliar su uso.
2. **Defina un tema acotado.** Un tema específico y una lista corta de subtemas mantienen al agente centrado.
3. **Revise los resúmenes cada semana.** Los patrones entre alumnos aportan más información que cualquier sesión aislada.
4. **Explique a los alumnos qué es el agente.** Es un tutor de IA, no un docente humano. Explíqueles que no los observa a través de la cámara.
5. **Revise su política de datos.** El audio y el texto se envían al proveedor de IA que haya configurado. Consulte el [Resumen de seguridad](/docs/security-overview) para ver el flujo de datos completo.

## Próximos pasos

- [Descripción general y conceptos](/docs/ai-agent/overview): cómo encaja el agente en una sala en vivo.
- [Capacidades, visión y salvaguardas](/docs/ai-agent/tools-and-capabilities): qué puede ver o hacer el agente y qué no.
- [Guía para desarrolladores y de la API](/docs/ai-agent/developer-guide): cómo su equipo técnico habilita una sala para sesiones de IA.
- [Guía del moderador](/docs/user-guide/moderator#uso-del-asistente-de-ia): controles generales del asistente de IA.
