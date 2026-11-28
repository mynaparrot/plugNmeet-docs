---
title: "Avatares de IA en tiempo real para videollamadas: qué cambia en la experiencia"
slug: real-time-ai-avatar-video-calls
authors: [bob]
tags: [avatar-de-ia-en-tiempo-real, avatar-de-video-con-ia, agente-de-ia, experiencia-de-usuario, aula-virtual, ia-para-educación, autoalojado]
description: "Un avatar de IA en tiempo real pone al asistente en cámara en lugar de en un panel lateral. Cómo la presencia visible cambia los turnos de palabra, la interrupción y la privacidad, dónde aporta valor un rostro y cuándo conviene el modo solo voz."
keywords: ["avatares de IA en tiempo real para videollamadas", "avatar de IA en videollamadas", "avatar con sincronización labial", "experiencia de usuario con avatares de IA", "avatar de IA para tutorías", "asistente de IA para incorporación", "agente de voz frente a avatar de video", "avatar de IA autoalojado"]
---

La mayoría de los asistentes de IA en una videollamada son invisibles. Escuchan, toman notas y le entregan un resumen al final, y el cambio en la interfaz es un panel, una transcripción o una ventana de chat. Un avatar de IA en tiempo real propone otra cosa: el asistente pasa a ser un participante en cámara, y la llamada deja de ser «personas más texto» para convertirse en «personas más alguien que parece estar presente».

En plugNmeet el avatar es una opción del agente de voz: el agente puede hablar solo con voz, o un proveedor de avatar entra en la sala como participante multimedia y convierte ese discurso en video con sincronización labial. El agente de voz sigue en desarrollo activo, así que tome lo que sigue como una guía de diseño para el momento de probarlo.

<!--truncate-->

![Un avatar de IA en tiempo real en cámara durante una sesión de plugNmeet, dibujando en la pizarra compartida mientras habla](/img/ai-agent/ai-agent-product-demo.jpeg)

---

## La presencia visible cambia la sala antes que cualquier otra cosa

Los turnos de palabra en una llamada son en gran medida no verbales: se lee el rostro para saber si alguien ha terminado o está a punto de hablar. Un agente que solo emite voz ofrece pausas en su lugar, y los participantes aprenden a interpretarlas en pocos minutos.

Un avatar visible cambia ese paso: puede resultar más fácil saber a quién le toca y más difícil tratar al asistente como fondo. Ambos efectos tienen doble filo. Un rostro puede reducir el esfuerzo de seguir una explicación, o bien desviar la atención de la pizarra y convertir una respuesta breve en una actuación. Si ayuda o no es algo que se mide en su propia sesión, no algo que este artículo pueda asegurar por usted.

## Sincronización labial y turnos: el avatar representa, no decide

El reparto de tareas marca las expectativas. El agente de voz lleva la conversación, las llamadas a herramientas y el trabajo en la pizarra. El proveedor de avatar recibe el audio del agente y devuelve video con el movimiento de boca correspondiente, y se une a la sala como un participante multimedia más.

El rostro, por tanto, es un representador, no una segunda inteligencia: no elige qué decir, no ve sus diapositivas y no estudia la expresión de nadie. Dos consecuencias:

- **La latencia se vuelve visible.** La voz disimula una respuesta lenta tras una pausa que suena a reflexión; el video la muestra, y un desajuste entre sonido y boca se percibe como un fallo técnico. Pruebe con la red que usan realmente sus estudiantes.
- **La sincronización labial puede actuar como señal de turno; conviene probarlo.** Una boca que se cierra podría leerse como un «ya terminé» más claro que una línea en silencio. Si un ligero desfase entre audio y video cambia de verdad lo que la gente espera antes de hablar es algo que debe observar en su propia sesión.

## Interrupción: es una decisión de diseño, no una función más

La interrupción es donde un avatar gana o pierde la confianza. En plugNmeet el agente deja de hablar cuando un participante lo interrumpe y el avatar sigue al audio, así que el video no termina la frase por encima de una persona real. A los representadores basados en socket también se les indica cuándo está escuchando el agente.

Eso importa más en cámara que en audio. Una voz que le habla por encima resulta molesta; un rostro que lo hace es un problema social. Cuando alguien interrumpe y el avatar se detiene, el silencio se interpreta como escucha; y si sus instrucciones empujan al agente a seguir, el video hace esa descortesía mucho más evidente que el audio.

## Tres contextos en los que un rostro justifica el ancho de banda

El agente trabaja con un participante a la vez — una conversación, un interlocutor —, que es justo el escenario donde encaja un presentador visible:

- **Tutoría individual.** El estudiante tiene un único interlocutor, así que un rostro da un punto focal a la sesión mientras la pizarra sostiene la explicación.
- **Incorporación.** Guiar a una persona nueva por un sistema es una secuencia de pasos cortos y repetibles: un guion que el agente puede sostener y que un rostro vuelve menos frío.
- **Demostraciones de producto.** Un agente que abre, explica tres cosas y se detiene se sigue mejor que una presentación narrada, y deja al humano para lo que requiere a una persona.

Lo que no es: un profesor para una clase completa. Aquí no hay un avatar que hable a todo el grupo, y el agente no observa las cámaras ni las pantallas compartidas. Su contexto visual es la pizarra y el bloc de notas compartidos, y el representador recibe el audio del agente, no su cámara. Interpretar el ambiente, valorar la participación o entender el estado de ánimo queda fuera de su alcance. La [descripción general del agente de IA](/docs/ai-agent/overview) y el [artículo sobre el agente en la sala](/blog/ai-agent-for-meetings-in-the-room) cubren el resto de las funciones.

## El modo solo voz es una decisión de diseño legítima

El avatar es opcional: dejarlo sin configurar mantiene las sesiones solo con voz, que es la mejor respuesta cuando:

- **La sesión es de audio por naturaleza.** Una llamada individual tipo teléfono, o un estudiante en un equipo restringido, gana poco con una pista de video.
- **Le preocupa la privacidad.** El modo solo voz evita añadir el participante multimedia del avatar, pero no mantiene todo el audio del agente en su servidor: los servicios de voz y de LLM que configure pueden seguir recibiendo audio, salvo que apunte el agente a proveedores autoalojados. Un avatar añade un participante externo más, y eso altera de verdad el mapa de datos.
- **El ancho de banda o el presupuesto aprieta.** Los minutos de avatar se facturan aparte, y un rostro entrecortado es peor que ningún rostro.
- **Prefiere evitar el valle inquietante.** A algunos estudiantes les distrae una cabeza animada y a otros les tranquiliza. Ninguna reacción es errónea.
- **Ya tiene presentador.** Una introducción grabada por una persona más un agente de voz es una opción coherente y más económica que generar relleno sintético.

Un avatar cambia la interfaz, no la corrección de la sesión.

## Qué cambia el avatar en la privacidad y cuánto cuesta

El proveedor de avatar es un bot multimedia externo que se une a la sala con un token de participante limitado, de lo que se derivan tres restricciones:

- **El cifrado de extremo a extremo debe estar totalmente desactivado.** Un participante externo no puede custodiar sus claves, así que una sala que activa un avatar se rechaza mientras haya cualquier modo de E2EE activo, incluido el cifrado gestionado por el servidor. Las salas en las que cada participante introduce su propia clave no pueden usar el agente de IA en absoluto.
- **Su servidor debe ser accesible desde internet**, porque el proveedor se conecta desde su propia red.
- **El audio del agente sale de su servidor** para convertirse en video. Lo que el proveedor almacene después depende de su contrato con él, así que revíselo antes de usar esto con un grupo real.

La clave y el endpoint propios de un avatar se eliminan de los metadatos de la sala, se conservan solo en un registro del servidor asociado a la sala y quedan fuera de la facturación de la plataforma. Solo `tavus` y `livekit_datastream` reciben una indicación automática basada en el estado: `happiness` mientras el estado del agente es `SPEAKING` y `neutral` en cualquier otro momento. Sigue el estado de ejecución del agente y no el habla, y no equivale a comprender el estado de ánimo: no se deduce nada de lo que dice el agente ni del audio de los participantes. La [descripción general de seguridad](/docs/security-overview) recoge el panorama completo.

La facturación mantiene la misma separación. El video del avatar se cobra por minuto en una línea propia y nunca se mezcla con el uso de tokens del LLM ni con el audio, y cada sala puede limitar los minutos de avatar facturables; fije ese límite junto al de audio para que ambos presupuestos terminen a la vez. Una sala con clave de proveedor propia registra la duración pero no un coste estimado. La configuración está en la [guía de proveedores de avatar](/docs/ai-agent/providers/avatar) y en la [configuración del servidor](/docs/ai-agent/configuration).

## Cuatro preguntas antes de encender la cámara

1. ¿Puede un participante interrumpir en los primeros treinta segundos y el rostro se detiene con la voz?
2. ¿Ayuda el avatar a seguir la pizarra o compite con ella?
3. ¿Esta sesión sería peor solo con audio? Si no es así, prescinda del avatar.
4. ¿Qué proveedor recibe el audio, con qué condiciones de conservación y con qué límite por minuto?

## Empiece con una sola sala

Dele al avatar una tarea que pueda evaluar: una tutoría, una sesión de incorporación, una demostración. Mantenga el tramo corto, pruébelo usted primero y observe si los participantes se dirigen a él como presentador o lo ignoran como decoración. El segundo resultado no es un fracaso: normalmente significa que la voz bastaba. El avatar es una palanca de experiencia de usuario, no un resultado; la implicación sigue dependiendo del diseño de la sesión que lo rodea.

---

**Pruébelo en su propio servidor.** [Consulte la documentación del agente de IA](/docs/ai-agent/overview), añada sus claves de proveedor y siga la [guía de proveedores de avatar](/docs/ai-agent/providers/avatar). La [demostración pública](https://demo.plugnmeet.com/landing.html) muestra solo la plataforma de reuniones: el agente de IA y los avatares en tiempo real no forman parte de ella.
