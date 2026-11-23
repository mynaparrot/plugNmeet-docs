---
title: "Agente de IA para reuniones: en la sala, no solo en la grabación"
slug: ai-agent-for-meetings-in-the-room
authors: [bob]
tags: [agente-de-ia, asistente-de-reuniones, moderador-de-ia, productividad, aula-virtual, ia-para-educación, autoalojado]
description: "Un agente de IA para reuniones entra en la sala como un participante: habla, dibuja en la pizarra compartida y escribe en el bloc de notas. Qué hace, qué ve y qué sigue en desarrollo."
keywords: ["agente de IA para reuniones", "moderador de IA para reuniones", "copiloto para moderadores", "asistente de IA en la sala", "agente de voz para reuniones", "agente de IA para el aula virtual", "asistente de reuniones de código abierto"]
---

Muchos asistentes de reuniones se centran en una sola cosa: un bot escucha la llamada y envía notas al terminar. plugNmeet también lo hace, y a muchos equipos les basta. Este artículo trata de otra función: un asistente que entra en la sala como un participante más, conversa con las personas, dibuja en la pizarra compartida, escribe en el bloc de notas compartido y deja un resumen al final. Una parte ya está en producción y otra sigue en desarrollo. Las secciones siguientes separan las dos.

<!--truncate-->

---

## Un asistente que toma notas trabaja después de la reunión; un agente, durante

| | IA que toma notas | Agente dentro de la sala |
| --- | --- | --- |
| **Dónde está** | Fuera de la conversación, escuchando el audio | Dentro de la sala, como un participante visible |
| **Cuándo ayuda** | Subtítulos durante la sesión, notas después | Mientras ocurre la conversación |
| **Qué hace** | Transcribir, traducir, resumir | Hablar, dibujar, escribir, preguntar y responder, lanzar una prueba corta |
| **Qué cambia** | El registro de la reunión | La reunión misma |

Si lo único que necesita es un registro fiable de lo que se dijo, los subtítulos y los resúmenes lo cubren. El agente dentro de la sala encaja en una situación más concreta: la conversación tropieza una y otra vez con el mismo obstáculo, ya sea una explicación que se entendería mejor con un dibujo, una lista de pasos que conviene anotar mientras la gente todavía escucha o una comprobación de comprensión que no debería esperar a la semana siguiente.

## Qué hace mientras la sesión avanza

Imagine una clase en vivo. Una persona dice que el diagrama de la pizarra no le queda claro. El agente no repite la explicación más despacio: redibuja el diagrama en pasos más pequeños, marca qué cambió y hace una pregunta breve para comprobar si la nueva versión ayudó.

Ese es el patrón: un participante, no un observador. En una sesión el agente puede:

- **Hablar y escuchar** en el idioma y con la voz que defina el anfitrión. Se le puede interrumpir a mitad de una frase.
- **Dibujar en la pizarra compartida**: formas, etiquetas, trazos a mano alzada, diagramas generados a partir de una frase y un puntero para señalar algo sin tocar el dibujo.
- **Escribir en el bloc de notas compartido**, bloque a bloque, y abrir el bloc cuando escribe.
- **Preguntar y reaccionar.** Puede lanzar una prueba corta o una encuesta y recibe las respuestas a medida que llegan, así que confirma, explica o repregunta.
- **Dejar un resumen estructurado** que su plataforma puede recuperar y volver a usar cuando regrese la misma persona.

Un límite que conviene saber de entrada: hoy el agente de voz trabaja con una persona a la vez en una sesión privada, normalmente una sala de grupo para un solo estudiante o cliente potencial. Es un tutor en una sala aparte, no una voz que habla por encima de su clase principal.

## El copiloto para moderadores es otro trabajo

El agente de sala enseña y explica; un copiloto para moderadores ayuda a conducir la reunión. En plugNmeet ese papel lo cumple el chat de IA, que usa un moderador o docente que ya controla la sesión: "silencie a todos excepto al panel", "abra tres salas de grupo y reparta la clase", "inicie la grabación", "redacte cuatro preguntas sobre la fotosíntesis".

Dos límites lo hacen útil en un aula y no solo en una demostración:

- **Actúa con sus permisos, no por encima de ellos.** Trabaja para un moderador que ya tiene esos derechos y no se salta los bloqueos ni la configuración de la sala.
- **Las preguntas de la prueba las publica usted.** El copiloto las redacta en el chat; nada se activa solo porque lo diga el modelo.

Además se queda en el texto, junto a la sala, para que usted vea lo que hizo, lo corrija y siga conduciendo la sesión. La separación es intencionada: silenciar a una clase, iniciar una grabación o rehacer las salas de grupo corresponde a una persona autorizada en la sala principal, no a un agente de voz con el que conversa un estudiante.

## Qué ve y qué no ve

El contexto visual del agente es la pizarra compartida y el bloc de notas compartido. Nada más. No observa las cámaras ni las pantallas compartidas. En las modalidades individuales actuales, tanto la cámara como la opción de compartir pantalla están desactivadas en esas sesiones.

En la práctica, lee el trabajo que las personas crean juntas, no a las personas. No puede deducir quién prestaba atención por su aspecto ni calificar la participación a partir del video. También hay reglas fijas de la plataforma por encima de las instrucciones del anfitrión y las peticiones fuera de alcance se rechazan; la página de [capacidades y límites](/docs/ai-agent/tools-and-capabilities) lo detalla. El límite que importa aquí es la pizarra y el bloc de notas.

## Qué está listo y qué se sigue construyendo

**Estable en producción:** subtítulos y transcripción en vivo, traducción (cada participante puede elegir el idioma de sus subtítulos), el chat de IA con sus ayudas dentro del bloc de notas, la pizarra y las encuestas, y los resúmenes al terminar la reunión.

**En desarrollo activo:** el agente de voz y la parte más reciente del chat de IA que permite a un copiloto para moderadores ejecutar acciones en la sala. Los nombres, los valores predeterminados y el comportamiento aún pueden cambiar. Hoy el agente se configura desde la API de plugNmeet; la configuración en un clic dentro de los plugins de Moodle, WordPress y Joomla está prevista para cuando la función esté lista.

## Empiece con una sola sesión

Cuando haya acceso de vista previa al agente de voz, conviene darle una tarea concreta: un ejercicio de pizarra 1 a 1, una prueba de repaso con un estudiante o un recorrido de producto para un cliente potencial. Mientras tanto, quédese usted, como anfitrión, con el chat de IA; después, lea el resumen y valore si la sesión salió mejor.

Cuando compare herramientas, incluida la nuestra, pregunte las mismas tres cosas: si entra como participante o solo lee la transcripción, qué ve realmente y qué pasa cuando se equivoca o se sale del tema.

- [Descripción general del agente de IA](/docs/ai-agent/overview) — los servicios de Insights y dónde encaja el agente
- [Guía para docentes](/docs/ai-agent/educator-guide) — flujos de clase e instrucciones
- [Capacidades y límites](/docs/ai-agent/tools-and-capabilities) — qué puede ver y ejecutar
- [Chat de IA en la reunión](/docs/ai-agent/ai-text-chat) — el copiloto para moderadores, con ejemplos

Lecturas relacionadas: [5 formas en que un asistente de IA transforma su aula virtual](/blog/ai-transforms-virtual-classroom), [el asistente de IA que escribe sus notas](/blog/ai-meeting-assistant-automated-summaries) y, para quien desarrolla, [cómo añadir funciones de asistente de reuniones con IA](/blog/how-to-add-ai-meeting-assistant-features).

---

**Pruébelo en su propio servidor.** [Lea la documentación](/docs/ai-agent/overview) o [ejecute plugNmeet](https://github.com/mynaparrot/plugNmeet-server) con sus propias claves de proveedor de IA. La [demostración pública](https://demo.plugnmeet.com/landing.html) muestra la plataforma de reuniones —pizarra, encuestas, salas de grupo—, pero el agente de IA no forma parte de ella.
