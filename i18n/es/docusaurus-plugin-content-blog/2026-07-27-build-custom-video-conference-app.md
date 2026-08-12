---
title: "Crea Tu Propia Aplicación de Video Móvil con la Integración Híbrida de plugNmeet"
authors: [jibon, simon]
tags: [videoconferencia, aplicacion-movil, sdk, autoalojado, codigo-abierto, webrtc, marca-blanca, ios, android, flutter, react-native]
description: "Aprende a crear una aplicación de videoconferencia autoalojada y de marca blanca para iOS, Android o escritorio utilizando la integración híbrida de plugNmeet. Obtén el poder de los medios nativos y la simplicidad de nuestra interfaz web."
keywords: ["aplicación de video personalizada", "sdk de videoconferencia móvil", "aplicación de video autoalojada", "videoconferencia de marca blanca", "aplicación de video de código abierto", "aplicación móvil webrtc", "videollamada ios", "videollamada android", "flutter webrtc", "video react native"]
---

Crear una aplicación de videoconferencia personalizada para móviles o escritorio es una tarea enorme. Necesitas gestionar permisos del dispositivo, captura de medios, inestabilidad de la red y construir una interfaz de usuario compleja desde cero. ¿Y si pudieras obtener el rendimiento y la potencia de una aplicación nativa sin tener que reinventar toda la rueda de la videoconferencia?

Hoy, te damos un adelanto de la solución. Presentamos la **Integración Híbrida de plugNmeet**, una nueva y potente forma de construir una **aplicación de videoconferencia personalizada y autoalojada** para iOS, Android, Flutter, React Native o escritorio. Combina la potencia bruta del manejo de medios nativos con el cliente web completo y rico en funciones de plugNmeet, dándote un camino acelerado para lanzar tu propia **aplicación de video de marca blanca**.

<!--truncate-->

**Una nota rápida sobre nuestra filosofía**: el enfoque principal de plugNmeet siempre ha sido ofrecer una experiencia de videoconferencia potente y centrada en el navegador. No estamos cambiando para convertirnos en una empresa centrada en las aplicaciones. En cambio, esta integración híbrida es nuestra respuesta a los muchos desarrolladores de nuestra comunidad que necesitan crear aplicaciones nativas para móviles o escritorio.

Quizás te preguntes por qué no creamos nuestro propio SDK móvil dedicado. La respuesta es simple: ¡no lo necesitamos! plugNmeet está construido sobre LiveKit, que ya proporciona robustos SDKs nativos para cada plataforma principal, incluyendo [Android](https://github.com/livekit/client-sdk-android), [React Native](https://github.com/livekit/client-sdk-react-native) y [Flutter](https://github.com/livekit/client-sdk-flutter). Nuestro enfoque híbrido aprovecha estos SDKs de LiveKit, probados en batalla, para la publicación de medios nativos, combinados con nuestro cliente web rico en funciones en un WebView. Esto significa que obtienes lo mejor de ambos mundos: capacidades de medios nativos listas para usar y la interfaz de usuario completa de plugNmeet, todo sin que tengamos que duplicar esfuerzos. Estamos proporcionando un camino robusto y flexible para que *tú* construyas *tu* propia aplicación, a tu manera, sin comprometer los principios de código abierto y autoalojamiento que definen a plugNmeet.

### Lo Mejor de Ambos Mundos: Potencia Nativa, Simplicidad Web

El modelo híbrido es un punto de inflexión para los desarrolladores que necesitan más que un simple enlace de reunión genérico de terceros. Te da la flexibilidad del desarrollo nativo y la velocidad de usar la interfaz de usuario de reunión existente de plugNmeet.

He aquí por qué esto es tan importante:

*   **Rendimiento de Medios Nativos:** Captura y publica medios utilizando las APIs nativas de la plataforma. Esto es imprescindible para funciones como la **compartición de pantalla en móviles**, que no es compatible con la mayoría de los navegadores móviles. También abre la puerta a funciones avanzadas como fondos virtuales nativos o procesamiento de audio personalizado.
*   **Desarrollo de Aplicaciones más Rápido:** Tu equipo puede centrarse en construir el contenedor nativo y la experiencia principal de la aplicación. No tienes que pasar meses recreando listas de participantes, chat, una pizarra, controles de moderación y diseños de video complejos. Ya hemos construido eso para ti.
*   **Personalización de Marca Blanca Real:** Tú controlas toda la experiencia del usuario, desde el icono de la aplicación y la pantalla de inicio de sesión hasta la marca dentro de la reunión. La reunión se siente como una parte central de tu aplicación, no como un servicio de terceros añadido.
*   **Autoalojado y Seguro:** Como siempre con plugNmeet, eres dueño de tu infraestructura y tus datos. Todas las comunicaciones se enrutan a través de tu servidor local, garantizando la máxima privacidad, cumplimiento y control.

### Cómo Funciona: Una Arquitectura Elegante

La idea central es simple pero potente: un usuario lógico está representado por dos participantes conectados a tu instancia autoalojada de LiveKit.

*   El **participante web** se ejecuta en un WebView dentro de tu aplicación. Gestiona toda la interfaz de usuario y se suscribe a todos los flujos de medios de otros usuarios.
*   El **participante nativo** se ejecuta en el código de tu aplicación nativa. Su único trabajo es capturar y publicar la cámara, el micrófono y la pantalla compartida del propio usuario utilizando las APIs nativas.

![Hybrid Integration Architecture](/img/hybrid-architecture.png)

Un "puente" de comunicación ligero permite que la interfaz de usuario web y el código nativo se comuniquen sin problemas. Cuando un usuario toca el botón "Silenciar" en la interfaz web, se envía un mensaje a través del puente, indicando a tu código nativo que silencie el micrófono. Esta arquitectura proporciona una experiencia de usuario fluida mientras te da los beneficios de rendimiento del código nativo.

### Adelántate en el Desarrollo de tu Aplicación de Video Personalizada

Aunque el lanzamiento oficial está a la vuelta de la esquina, puedes empezar a construir hoy mismo. Creemos en construir en abierto y estamos emocionados de ver lo que nuestra comunidad crea.

---

**¿Listo para construir tu propia aplicación de videoconferencia?**

*   **[Explora la Guía Técnica](/docs/developer-guide/mobile-app-integration)** para una inmersión profunda en la arquitectura y la API.
*   **[Consulta las Aplicaciones de Demostración en GitHub](https://github.com/mynaparrot/plugnmeet-mobile-app)** para ver el patrón en acción.
*   **[Prueba la Demostración en Vivo](https://demo.plugnmeet.com/landing.html)** para explorar las características de plugNmeet.
*   **[Sigue nuestra Guía de Instalación](/docs/installation)** para poner en marcha tu servidor autoalojado.
