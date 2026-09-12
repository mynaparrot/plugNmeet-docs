---
title: "plugNmeet v2.5.0: pizarra CRDT, notas con IA, encuestas y salas de grupos"
slug: plugnmeet-v2-5-0-crdt-whiteboard-ai-notes-polls-breakout-rooms
authors: [jibon]
tags: [plugnmeet, notas-lanzamiento, pizarra, bloc-notas, encuestas, salas-grupos, ia, funciones-ia, autoalojado, codigo-abierto, videoconferencia]
description: "Ya está aquí plugNmeet v2.5.0: pizarra con sincronización CRDT y Yjs, bloc de notas compartido en BlockNote con IA, texto a diagrama con IA, generación de encuestas con IA, salas de grupos rediseñadas y emisión WHIP."
keywords: ["plugnmeet v2.5.0", "alternativa a Zoom de código abierto", "videoconferencia autoalojada", "pizarra colaborativa CRDT", "bloc de notas BlockNote con IA", "texto a diagrama con IA", "encuestas con IA para reuniones", "salas de grupos autoalojadas", "emisión en directo WHIP"]
date: 2026-09-12
---

Imagine esta situación. Su clase lleva veinte minutos dibujando en la pizarra. Un estudiante se incorpora tarde… y ve un lienzo en blanco. O dedica una hora a redactar las notas de la reunión en el bloc compartido y, al exportarlas, pierde todo el formato. ¿Le resulta familiar?

A nosotros también nos ha pasado. Precisamente por eso hemos creado **plugNmeet v2.5.0**.

No se trata de una actualización menor. Hemos sustituido tres motores de colaboración y los hemos reconstruido desde cero: la pizarra ahora funciona con **sincronización CRDT**, el antiguo bloc basado en Etherpad desaparece en favor de **BlockNote + IA** y las **salas de grupos** estrenan una arquitectura totalmente nueva. Además, la **IA ya trabaja en tres lugares** —pizarra, notas y encuestas— y ahora puede enviar encuestas a una sala en directo directamente desde su propio sistema.

Si busca una plataforma de **videoconferencia autoalojada y gratuita** que esté a la altura de sus reuniones, esta es la versión que conviene probar.

<!--truncate-->

---

### El problema: herramientas que no siguen el ritmo

La mayoría de las **alternativas a Zoom de código abierto** resuelven bien el vídeo y el audio. Lo que falla es todo lo que ocurre alrededor de la llamada:

*   **Pizarras** que se desincronizan en cuanto alguien se reconecta.
*   **Notas compartidas** ancladas en editores de hace una década, sin ayuda de IA.
*   **Encuestas** que tardan cinco minutos en crearse para una votación de treinta segundos.
*   **Salas de grupos** que no conservan el contenido, de modo que cada grupo empieza desde cero.

Docentes, organizadores de eventos y equipos que usan plugNmeet a gran escala nos transmitieron estas cuatro quejas. Así que las hemos resuelto juntas, en una sola versión.

### La solución: novedades de plugNmeet v2.5.0

En resumen:

*   **Pizarra CRDT (Yjs)** con almacenamiento de sincronización prioritario en el servidor: quienes se incorporan tarde la ven completa.
*   **Bloc de notas compartido reconstruido sobre BlockNote** con IA integrada: continuar textos, resumir, corregir, simplificar, instrucciones personalizadas.
*   **Texto a diagrama con IA** en la pizarra: escriba una frase y obtenga un diagrama de flujo o un modelo entidad-relación sobre el lienzo.
*   **Encuestas rediseñadas + generación con IA**: describa lo que necesita y reciba un borrador listo, además de modo cuestionario, votos anónimos y la nueva [API de creación de encuestas](/docs/api/room/create-poll).
*   **Salas de grupos rediseñadas**: comparta páginas de pizarra, contenido del bloc y encuestas en las salas secundarias.
*   **Compatibilidad con WHIP** para emisión en directo, además de puntos de control gzip y diferencias incrementales que reducen notablemente el ancho de banda.

Veamos cada punto con detalle.

### Una pizarra que por fin sincroniza: CRDT + Yjs

Nuestra pizarra anterior funcionaba bien… hasta que dejaba de hacerlo. Reconexiones, incorporaciones tardías, redes inestables. Faltaban trazos o, peor aún, cada participante veía una pizarra distinta.

En la v2.5.0, la pizarra funciona con **CRDT de Yjs**, el mismo modelo que empleamos para el bloc de notas. Cada página es un `Y.Doc`, la presencia de los cursores viaja por `y-protocols/awareness` y la sincronización es **prioritaria en el servidor**:

1.  Su cliente solicita primero el punto de control oficial al servidor.
2.  Si no hay respuesta, reintenta una vez y después pide la diferencia.
3.  Si no hay ningún presentador en línea, el servidor sirve el estado inicial directamente desde Redis.
4.  A partir de ahí, solo circulan puntos de control comprimidos con gzip y diferencias incrementales —nunca el estado completo— y las peticiones se distribuyen entre un máximo de 3 participantes.

¿Qué significa esto para usted? Un estudiante que se incorpora 20 minutos tarde ve la pizarra completa en uno o dos segundos. Las páginas sobreviven a recargas gracias a IndexedDB. Y el consumo de ancho de banda disminuye. Creemos que es el mayor salto de fiabilidad que hemos logrado en la pizarra desde que presentamos [la experiencia de pizarra integrada](/blog/integrated-whiteboard-experience).

También hemos cuidado los detalles: se recupera la última página al cambiar de archivo, los mensajes privados de la pizarra permanecen privados y los punteros se mueven con mayor fluidez.

### Adiós a Etherpad. Hola al bloc compartido con IA.

Cuesta un poco despedirse: Etherpad nos prestó un gran servicio durante años. Pero había que jubilarlo. No permitía edición por bloques moderna e integrarle IA no tenía sentido.

El nuevo **bloc de notas compartido** está construido sobre **BlockNote**, con colaboración en tiempo real todavía basada en Yjs. Obtiene bloques familiares, importación y exportación en Markdown y cursores en directo, además de un menú de IA justo donde escribe.

Seleccione cualquier texto (o simplemente coloque el cursor) y pida a la IA que:

*   **Continúe redactando** con el mismo tono
*   **Resuma** una discusión larga en puntos clave
*   **Mejore la redacción**, **corrija ortografía y gramática** o **simplifique** para lectores jóvenes
*   Ejecute una **instrucción personalizada**, por ejemplo: «convierta esto en un acta con acciones pendientes»

Los resultados aparecen directamente en el documento, bloque a bloque. Sin copiar ni pegar.

Una nota honesta: ahora hay un único bloc por sesión y, si había personalizado Etherpad en profundidad, considere este cambio como incompatible. Para el resto, simplemente es más rápido y mucho más útil. Si ya utiliza la IA en plugNmeet, la configuración le resultará familiar: el mismo motor de Insights que [nuestro asistente de reuniones con IA](/blog/how-to-add-ai-meeting-assistant-features).

### Texto a diagrama con IA: de la frase al diagrama de flujo

Esta es nuestra demostración favorita. Abra la pizarra, pulse el botón de IA y escriba:

> «Flujo de registro: alta → verificación por correo → perfil → primer proyecto, con reintento en la verificación»

Unos segundos después dispone de un diagrama de flujo editable sobre el lienzo. No es una imagen. Son formas reales que puede mover, recolorear y anotar.

En segundo plano enviamos su indicación a través de `insights/ai/textChat/execute` con la etiqueta de pizarra, recibimos sintaxis **Mermaid** en bruto (flujo, secuencia, clases, estados o entidad-relación) y la representamos con mermaid-to-excalidraw. Las indicaciones de seguimiento conservan el contexto, de modo que «añada ahora una decisión para usuarios SSO» funciona sin más.

El profesorado lo emplea para esquemas de clase. Los equipos técnicos diseñan arquitecturas sin salir de la llamada. Sinceramente, una vez que lo prueba, volver a dibujar rectángulos a mano se hace cuesta arriba.

### Encuestas rediseñadas, ahora con IA y una API real

Las encuestas recibieron un tratamiento completo en la v2.5.0. Si aún no ha leído [nuestra guía de encuestas](/blog/engaging-audience-with-live-polls), los conceptos básicos siguen vigentes, pero la creación es completamente distinta.

Al pulsar «crear» encontrará dos caminos:

*   **Plantillas rápidas**: sí/no, verdadero/falso, de acuerdo/en desacuerdo, A–D, 1–5. Un clic y ya se está votando.
*   **Generar con IA**: describa la encuesta con palabras sencillas («compruebe si mi clase de DevOps entiende los despliegues blue-green, en modo cuestionario»). La IA devuelve JSON estricto con pregunta, de 2 a 6 opciones, `is_multiple` e `is_quiz`, y el formulario se rellena solo. Nada se publica hasta que usted pulse Crear. Usted mantiene el control.

Las encuestas ahora admiten **modo cuestionario** (respuestas correctas ocultas hasta el cierre), **voto anónimo**, **selección múltiple** y **cierre automático** de hasta 60 minutos. La comprobación de vencimiento se trasladó al servidor, al proceso de mantenimiento, de modo que las encuestas temporizadas se cierran con fiabilidad aunque la pestaña del moderador esté suspendida.

Y para el personal técnico: existe una nueva **[API de creación de encuestas](/docs/api/room/create-poll)**. Con `POST /room/createPoll`, indicando `room_id`, `question` y `options`, puede inyectar una encuesta en una sala activa desde su sistema. Ideal para votaciones programadas o sondeos automatizados. La persona moderadora aún puede cerrarla, publicar resultados o reabrirla como cualquier otra encuesta.

Y no es solo teoría: ya lo estamos utilizando. Nuestro **plugin de Moodle v3.0.13** incorpora un botón **Añadir encuesta desde el cuestionario** directamente en la página de la actividad. Elija un cuestionario de Moodle o una categoría del banco de preguntas, seleccione una pregunta de opción múltiple o de verdadero/falso, defina el modo cuestionario o votación, el voto anónimo y la duración de cierre automático, y el plugin la convierte en una encuesta en directo mediante `createPoll` mientras la sala está activa. Sin reescribir preguntas ni cambiar de contexto. Si imparte clases en Moodle, consulte la [guía de integración con Moodle](/docs/user-guide/moodle-integration).

### Salas de grupos reconstruidas para un uso real

La implementación anterior servía para divisiones sencillas. En cuanto necesitaba algo más —llevarse el contenido, gestionar salas activas— resultaba limitada.

La v2.5.0 incorpora una **arquitectura de salas de grupos completamente rediseñada** en cliente y servidor. El formulario de creación ahora permite:

*   Arrastrar, repartir al azar o preasignar participantes (incluida la preasignación por API, que [nuestro plugin de Moodle ya utiliza](/docs/user-guide/moodle-integration): active «Preasignar salas desde los grupos del curso» y cada grupo de Moodle se convierte en una sala, con el nombre del grupo como título y sus miembros asignados, desde el siguiente inicio de sesión)
*   Definir títulos personalizados, duraciones y mensajes de bienvenida
*   Permitir el regreso a la sala principal y la libre elección de sala
*   **Compartir páginas concretas de la pizarra** en las salas
*   **Compartir el bloc** y **las encuestas seleccionadas** para que los grupos no empiecen vacíos

La parte más interesante: tras crear las salas, el cliente del administrador siembra en Redis el contenido de la sala principal —mismo formato, mismas claves derivadas por sala con E2EE—. Los grupos abren su sala y el material ya está allí.

Mientras las salas están activas, la vista de gestión permite enviar un mensaje a todas, ampliar la duración, entrar en cualquiera o finalizarlas todas. Si antes las salas le daban problemas, vuelva a leer [el dominio de las salas de grupos](/blog/mastering-breakout-rooms): la mayoría de aquellos trucos ya vienen integrados.

### Sincronización más rápida y emisión en directo por WHIP

Dos mejoras de infraestructura que conviene destacar.

Primera, una **sincronización de datos de sesión más ligera**. Los puntos de control gzip más las diferencias incrementales sustituyen los volcados completos. Se nota sobre todo en salas grandes con conexiones débiles.

Segunda, la **compatibilidad con WHIP** para emisión en directo. Si siguió [nuestra guía de OBS + WHIP](/blog/obs-rtmp-whip-ingress), ya conoce la dirección: la v2.5.0 convierte la salida WHIP originada en el navegador en una vía de primer nivel. Resulta más sencillo llevar su sesión a una CDN o a una cadena de distribución sin las complicaciones de RTMP.

### Para administradores: actualización a la v2.5.0

Para la lista completa de cambios, consulte las [notas de la versión v2.5.0 en GitHub](https://github.com/mynaparrot/plugNmeet-server/releases/tag/v2.5.0).

Antes de actualizar tenga en cuenta lo siguiente:

*   **Etherpad queda eliminado.** Sin contenedor adicional ni migración de pads. El bloc compartido pasa a formar parte de las funciones de sala. Elimine la configuración antigua de Etherpad de su `config.yaml`.
*   Tanto el cliente como el servidor incorporan el nuevo almacén de datos de sesión: **actualícelos juntos**.
*   Las funciones de IA (pizarra, bloc, encuestas) utilizan el motor actual de chat de texto de Insights. Contrólelas por sala con `aiTextChatFeatures` (`isWhiteboardAiDisabled`, `isPollAiDisabled`, `allowedUserIds`). Funciona cualquier proveedor compatible con OpenAI; consulte [nuestra guía de integración con OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet).
*   El vencimiento de encuestas y la hidratación de pizarra y bloc siguen nuevas rutas en el servidor. Revise la [guía de instalación](/docs/installation) y la [documentación de la API](/docs/api/intro) si emplea integraciones personalizadas.

Todavía no es perfecta: los menús de IA en móvil y los historiales de pizarra muy extensos presentan asperezas que estamos puliendo. Pero para la mayoría de las salas, la actualización es directa.

### Pruébelo hoy mismo

La v2.5.0 es la versión en la que plugNmeet deja de ser «vídeo más extras» para convertirse en un espacio de trabajo único. Pizarra, notas, encuestas y grupos comparten por fin el mismo motor de sincronización, y la IA reside dentro de los tres en lugar de en una barra lateral que nadie abre.

Póngala en marcha con nuestro [sencillo script de instalación](/docs/installation), consulte la [guía de moderación](/docs/user-guide/moderator) para familiarizar a sus anfitriones con los nuevos flujos o explore la [API de creación de encuestas](/docs/api/room/create-poll) si integra desde un LMS.

Y si le gusta hacia dónde avanzamos, regálenos una estrella en [GitHub](https://github.com/mynaparrot/plugNmeet): ayuda de verdad a que el proyecto siga creciendo.
