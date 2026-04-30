---
title: "Por Qué Creamos Plug-N-Meet: La Historia de su Fundador"
slug: why-we-built-plugnmeet
authors: [jibon]
tags: [open-source, arquitectura, filosofía, bigbluebutton, escalabilidad, desarrollador]
---

Durante años, nuestra empresa ha sido un reconocido proveedor de [servicios de alojamiento y soporte para BigBlueButton](https://www.mynaparrot.com/classroom/bigbluebuttonservice). Lo hemos implementado, gestionado y escalado para innumerables clientes, y tenemos un profundo respeto por el papel que ha desempeñado en la comunidad educativa de código abierto. Fue un pionero.

Pero después de años en la primera línea, dando soporte a sesiones en vivo, clases en línea y eventos a gran escala, nos topábamos una y otra vez con las mismas barreras fundamentales. No solo usábamos el software; experimentábamos sus límites arquitectónicos de primera mano. Nuestra frustración no se debía solo a los errores, sino a una arquitectura que, aunque potente para su propósito original, presentaba desafíos para la escalabilidad elástica y la agilidad de desarrollo que exigen las aplicaciones web modernas.

Nos dimos cuenta de que teníamos una elección: seguir creando soluciones temporales o tomar todo lo que habíamos aprendido y construir la solución que sabíamos que nuestros usuarios necesitaban.

Elegimos construir. Esta es la historia de por qué existe Plug-N-Meet.

<!--truncate-->

---

### Lecciones desde la Experiencia: Los Desafíos que Debíamos Resolver

Nuestra decisión no nació de un rechazo a BigBlueButton, sino de una profunda comprensión de sus debilidades a escala. Nos enfrentábamos constantemente a una serie de desafíos recurrentes:

*   **La Barrera de los 100 Usuarios:** Vimos una y otra vez que, incluso en servidores potentes, el rendimiento de BigBlueButton se degradaba significativamente una vez que una sesión superaba los 100-150 usuarios concurrentes. Simplemente no fue diseñado para la escalabilidad elástica que requieren las aplicaciones modernas.

*   **La Complejidad de su Arquitectura:** La plataforma es una mezcla de diferentes lenguajes de programación y tecnologías, cada uno resolviendo una pieza distinta del rompecabezas. Aunque brillante en su momento, esto hace que sea increíblemente difícil de mantener, depurar y, lo más importante, de añadir nuevas funciones. Un cambio simple podía tener efectos en cascada en media docena de servicios diferentes.

*   **Las Limitaciones para la Personalización de Marca:** Para nuestros clientes que deseaban una verdadera experiencia de marca blanca, la personalización era una lucha constante. Un branding profundo requería temas complejos y, a menudo, modificaciones directas del código, lo que convertía cada actualización en un proceso arriesgado y lento.

*   **El Desafío de las Grabaciones:** Las grabaciones eran un punto de dolor importante. El sistema era complejo y generar un único archivo MP4 portátil era notoriamente difícil. De hecho, desarrollé una de las primeras soluciones de código abierto para intentar resolver este problema, pero incluso así, era solo un parche en un sistema fundamentalmente complicado.

*   **La Carga de una Arquitectura Monolítica:** La falta de modularidad era el mayor obstáculo. No se podía escalar una parte del sistema sin escalar todo el conjunto. Si la grabación consumía toda la CPU, afectaba directamente a las reuniones en vivo. No había una separación clara de responsabilidades.

### Una Nueva Filosofía: Basada en la Simplicidad, la Modularidad y el Control

Con Plug-N-Meet, empezamos desde cero, guiados por unos pocos principios básicos nacidos directamente de nuestras frustraciones.

1.  **Simplicidad Radical en la Pila Tecnológica.**
    En lugar de una docena de lenguajes, elegimos dos: **Go** para todo el backend y **TypeScript (con React)** para el front-end. Nada más. Esta decisión se extendió a nuestras dependencias principales. Elegimos **LiveKit** como nuestro servidor de medios y **NATS** para la mensajería, no solo porque son los mejores en su clase, sino porque también están escritos en Go. Esto crea un ecosistema unificado, consistente y de alto rendimiento que es un placer para nuestros desarrolladores y fácil de contribuir para la comunidad.

2.  **Modularidad desde el Diseño.**
    Plug-N-Meet no es un monolito. Es un sistema desacoplado de componentes que trabajan juntos. El grabador, el servidor de medios y la lógica de la aplicación son servicios separados. Esto significa que usted puede escalar, actualizar o incluso reemplazar una parte sin romper todo lo demás. Los "Modos Operativos" de nuestro nuevo grabador son un ejemplo perfecto de esto, un resultado directo de nuestra **filosofía de grabación**. Esto le permite ejecutar la transcodificación, que consume mucha CPU, en máquinas completamente diferentes a las de sus servidores de grabación en vivo.

3.  **Personalización sin Complicaciones.**
    La personalización de marca no debería ser un proyecto de desarrollo. Con Plug-N-Meet, la personalización profunda se gestiona a través de una API simple y objetos de configuración. Puede cambiar colores, logotipos e incluso todo el diseño sin tocar nunca nuestro código principal, asegurando que su plataforma siempre se sienta como *su* plataforma.

4.  **Accesibilidad para Todos a Través de la Integración.**
    Aunque proporcionamos herramientas potentes para desarrolladores, nuestra filosofía siempre ha sido hacer que Plug-N-Meet sea accesible para todos. Una plataforma potente no debería requerir un equipo de ingenieros para ser utilizada. Por eso hemos invertido considerablemente en crear plugins simples y robustos para los CMS y LMS más populares del mundo.

    Con nuestros plugins oficiales para **WordPress**, **Moodle** y **Joomla**, cualquiera puede añadir un servicio de videoconferencia de marca y con todas las funciones a su sitio web en minutos. Estas integraciones no son un añadido de última hora; son una parte central de nuestra misión de empoderar a los creadores. Como hemos detallado en nuestras guías, usted puede incluso **lanzar su propio servicio de video con WordPress**, **construir una plataforma de e-learning escalable con Moodle** o **iniciar un negocio sin código con Joomla**, sin necesidad de programar.

5.  **Enfoque en el Desarrollador, no como un Añadido.**
    No somos una solución basada en dominios que lo encierra en una estructura rígida. Somos una plataforma API-first diseñada para ser un bloque de construcción. Ya sea que utilice nuestros sencillos plugins para WordPress y Moodle o nuestra **API `getClientFiles`** para una integración "headless", nuestro objetivo es darle el poder de construir la experiencia exacta que desea, no forzarlo a la nuestra.

6.  **La Seguridad como Pilar Fundamental, no como un Extra.**
    En el mundo actual, la privacidad no es negociable. Construimos Plug-N-Meet con una mentalidad de seguridad desde el principio, ofreciendo un robusto **Cifrado de Extremo a Extremo (E2EE)** como una característica central, con múltiples modelos de gestión de claves para adaptarse a cualquier postura de seguridad. Esto asegura que las conversaciones sean privadas y que ni siquiera el servidor pueda acceder a las transmisiones de medios. Este compromiso con la privacidad está entretejido en toda nuestra arquitectura.

---

### Conclusión: Construyendo las Bases para el Futuro

Siempre estaremos agradecidos por el camino que BigBlueButton abrió. Le mostró al mundo lo que era posible con la comunicación de código abierto. Pero la web ha evolucionado, y las demandas de escalabilidad, flexibilidad y experiencia del desarrollador han crecido exponencialmente.

Construimos Plug-N-Meet para responder a esa llamada. Es la plataforma que deseábamos tener durante todos esos años gestionando implementaciones complejas: una base más simple, más potente y más flexible para el futuro de la comunicación en tiempo real.

No estamos creando una herramienta para todos. Estamos creando una **plataforma para quienes construyen.**

---

**¿Listo para ver la diferencia por usted mismo?**

*   **[¿Migrando de BigBlueButton? Lo hemos hecho fácil.](/docs/tutorials/migration-from-bbb)**
*   **[Explore nuestra documentación de la API](/docs/api/intro)**
*   **[Explore el proyecto de código abierto en GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **[Pruebe la demostración en vivo para experimentar la interfaz moderna.](https://demo.plugnmeet.com/landing.html)**
