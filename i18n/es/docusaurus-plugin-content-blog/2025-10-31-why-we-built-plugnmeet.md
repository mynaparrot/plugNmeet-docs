---
title: "¿Por qué construimos Plug-N-Meet?: La historia de un fundador"
slug: why-we-built-plugnmeet
authors: [jibon]
tags: [open-source, architecture, philosophy, bigbluebutton, scalability, developer]
---

Durante años, nuestra empresa ha sido un conocido proveedor de [servicios de alojamiento y soporte de BigBlueButton](https://www.mynaparrot.com/classroom/bigbluebuttonservice). Lo hemos implementado, gestionado y escalado para innumerables clientes, y tenemos un profundo respeto por el papel que ha desempeñado en la comunidad educativa de código abierto. Allanó el camino.

Pero después de años en las trincheras, apoyando sesiones en vivo, clases en línea y eventos a escala, nos encontramos con los mismos muros fundamentales. No solo estábamos usando el software; estábamos experimentando sus límites arquitectónicos de primera mano. La frustración no era solo por los errores; era por una arquitectura que, si bien era potente para su propósito original, presentaba desafíos para el tipo de escalabilidad elástica y agilidad del desarrollador que exigen las aplicaciones web modernas.

Nos dimos cuenta de que teníamos una opción: seguir construyendo soluciones temporales o tomar todo lo que habíamos aprendido y construir la solución que sabíamos que nuestros usuarios necesitaban.

Elegimos construir. Esta es la historia de por qué existe Plug-N-Meet.

<!--truncate-->

---

### Lecciones de las trincheras: Los desafíos que tuvimos que resolver

Nuestra decisión no nació de un disgusto por BigBlueButton, sino de una profunda comprensión de sus puntos débiles a escala. Nos enfrentamos constantemente a una serie de desafíos recurrentes:

*   **El muro de los 100 usuarios:** Vimos una y otra vez que incluso en servidores potentes, el rendimiento de BigBlueButton se degradaba significativamente una vez que una sesión superaba los 100-150 usuarios concurrentes. Simplemente no fue diseñado para la escalabilidad elástica que requieren las aplicaciones modernas.

*   **El laberinto de la complejidad:** La arquitectura es una mezcla de diferentes lenguajes de programación y tecnologías, cada uno de los cuales resuelve una pieza diferente del rompecabezas. Si bien fue brillante en su momento, esto hace que sea increíblemente difícil de mantener, depurar y, lo más importante, agregar nuevas funciones. Un cambio simple podría tener efectos en cascada en media docena de servicios diferentes.

*   **La camisa de fuerza del branding:** Para nuestros clientes que querían una verdadera experiencia de marca blanca, la personalización era una lucha constante. Un branding profundo requería temas complejos y, a menudo, modificaciones directas del código, lo que hacía que cada actualización fuera un proceso arriesgado y lento.

*   **El rompecabezas de la grabación:** Las grabaciones eran un punto de dolor importante. El sistema era complejo y generar un único archivo MP4 portátil era notoriamente difícil. De hecho, desarrollé una de las primeras soluciones de código abierto para intentar resolver este problema, pero incluso entonces, era un parche en un sistema fundamentalmente complicado.

*   **La carga monolítica:** La falta de modularidad fue el mayor obstáculo. No se podía escalar una parte del sistema sin escalar todo el conjunto. Si la grabación estaba usando toda la CPU, impactaba directamente en las reuniones en vivo. No había separación de conceptos.

### Una nueva filosofía: Basada en la simplicidad, la modularidad y el control

Con Plug-N-Meet, comenzamos desde cero y con unos pocos principios básicos nacidos directamente de nuestras frustraciones.

1.  **Simplicidad radical en la tecnología.**
    En lugar de una docena de lenguajes, elegimos dos: **Go** para todo el backend y **TypeScript (con React)** para el front-end. Eso es todo. Esta decisión se extendió a nuestras dependencias principales. Elegimos **LiveKit** como nuestro servidor de medios y **NATS** para la mensajería, no solo porque son los mejores en su clase, sino porque también están escritos en Go. Esto crea un ecosistema unificado, consistente y de alto rendimiento que es un placer para nuestros desarrolladores y fácil de contribuir para la comunidad.

2.  **Modularidad por diseño.**
    Plug-N-Meet no es un monolito. Es un sistema desacoplado de componentes que trabajan juntos. El grabador, el servidor de medios y la lógica de la aplicación son todos servicios separados. Esto significa que puede escalar, actualizar o incluso reemplazar una parte sin romper todo lo demás. Los "Modos operativos" de nuestro nuevo grabador son un ejemplo perfecto de esto, un resultado directo de nuestra **filosofía de grabación**. Esto le permite ejecutar la transcodificación intensiva de CPU en máquinas completamente diferentes de sus servidores de grabación en vivo.

3.  **Personalización sin esfuerzo.**
    El branding no debería ser un proyecto de desarrollo. Con Plug-N-Meet, la personalización profunda se maneja a través de una API simple y objetos de configuración. Puede cambiar colores, logotipos e incluso todo el diseño sin tocar nunca nuestro código principal, asegurando que su plataforma siempre se sienta como *su* plataforma.

4.  **Empoderando a todos a través de la integración.**
    Si bien proporcionamos herramientas potentes para desarrolladores, nuestra filosofía siempre ha sido hacer que Plug-N-Meet sea accesible para todos. Una plataforma potente no debería requerir un equipo de ingenieros para usarse. Por eso hemos invertido mucho en crear complementos simples y robustos para las plataformas CMS y LMS más populares del mundo.

    Con nuestros complementos oficiales para **WordPress**, **Moodle** y **Joomla**, cualquier persona puede agregar un servicio de videoconferencia de marca y con todas las funciones a su sitio web en minutos. Estas integraciones no son solo una ocurrencia tardía; son una parte central de nuestra misión de empoderar a los creadores. Como hemos detallado en nuestras guías, incluso puede **lanzar su propio servicio de video con WordPress**, **construir una plataforma de e-learning escalable con Moodle** o **comenzar un negocio sin código con Joomla**, sin necesidad de programar.

5.  **Primero el desarrollador, no como una ocurrencia tardía.**
    No somos una solución basada en dominios que lo bloquea en una estructura rígida. Somos una plataforma API-first diseñada para ser un bloque de construcción. Ya sea que use nuestros complementos simples para WordPress y Moodle o nuestra **API `getClientFiles`** para una integración "sin cabeza", nuestro objetivo es empoderarlo para construir la experiencia exacta que desea, no forzarlo a la nuestra.

6.  **La seguridad como base, no como un complemento.**
    En el mundo de hoy, la privacidad no es negociable. Construimos Plug-N-Meet con una mentalidad de seguridad primero, ofreciendo un robusto **Cifrado de extremo a extremo (E2EE)** como una característica central, con múltiples modelos de gestión de claves para adaptarse a cualquier postura de seguridad. Esto asegura que las conversaciones sean privadas y que ni siquiera el servidor pueda acceder a las transmisiones de medios. Este compromiso con la privacidad está entretejido en toda nuestra arquitectura.

---

### Conclusión: Construyendo el camino para el futuro

Siempre estaremos agradecidos por el camino que BigBlueButton allanó. Mostró al mundo lo que era posible con la comunicación de código abierto. Pero la web ha evolucionado y las demandas de escalabilidad, flexibilidad y experiencia del desarrollador han crecido exponencialmente.

Construimos Plug-N-Meet para responder a ese llamado. Es la plataforma que deseábamos tener durante todos esos años gestionando implementaciones complejas: una base más simple, más potente y más flexible para el futuro de la comunicación en tiempo real.

No estamos construyendo una herramienta para todos. Estamos construyendo una **plataforma para constructores.**

---

**¿Listo para ver la diferencia por usted mismo?**

*   **[¿Migrando de BigBlueButton? Lo hemos hecho fácil.](/docs/tutorials/migration-from-bbb)**
*   **[Explore nuestra documentación de la API](/docs/api/intro)**
*   **[Explore el proyecto de código abierto en GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **[Pruebe la demostración en vivo para experimentar la interfaz moderna.](https://demo.plugnmeet.com/landing.html)**
