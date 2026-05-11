---
title: "Encuentra a los usuarios donde están: Por qué creamos plugins, no otra aplicación independiente"
slug: plugin-first-philosophy
authors: [simon]
tags: [plugin, lms, cms, moodle, wordpress, integracion, arquitectura, videoconferencia]
---

Si gestionas un Sistema de Gestión de Aprendizaje (LMS) como Moodle o un Sistema de Gestión de Contenidos (CMS) como WordPress, es probable que te hayas enfrentado a este frustrante escenario: tienes una comunidad vibrante, una rica biblioteca de contenidos y una base de usuarios bien definida, pero en el momento en que necesitas organizar una clase en vivo o un webinar, tienes que enviar a todos a una aplicación de terceros, independiente.

Generas un enlace de Zoom, lo publicas en tu sitio y esperas que tus usuarios puedan encontrarlo, iniciar sesión correctamente y volver cuando termine. Esta experiencia es torpe, desarticulada y rompe el entorno de aprendizaje fluido que tanto te ha costado construir.

En plugNmeet, creemos que este es un flujo de trabajo fundamentalmente defectuoso. Por eso tomamos una decisión arquitectónica deliberada: ser una **plataforma que prioriza los plugins**, no solo otra aplicación independiente.

<!--truncate-->

---

## La fricción de la aplicación independiente

Las herramientas de videoconferencia independientes son potentes, pero cuando se usan junto con una plataforma existente, crean una fricción innecesaria:

1.  **El brusco cambio de contexto:** Enviar a los usuarios a un dominio externo es una experiencia disruptiva. Pierdes el control sobre la marca, el viaje del usuario y sacas a tus usuarios del ecosistema en el que quieres que participen.

2.  **La pesadilla de la gestión de usuarios:** Tu LMS o CMS ya tiene una base de datos de usuarios robusta con roles y permisos. Una aplicación de video independiente te obliga a gestionar un segundo conjunto paralelo de usuarios, o a construir y mantener una compleja integración de inicio de sesión único (SSO).

3.  **Los datos aislados:** Cuando termina una reunión, ¿a dónde va la grabación? ¿Dónde están los registros de chat? Con una aplicación independiente, estos valiosos datos quedan atrapados en una nube de terceros, completamente desconectados del curso, artículo o grupo de usuarios al que pertenecen.

## Nuestra filosofía: Una capa de comunicación profundamente integrada

Creemos que para plataformas como Moodle, WordPress o Joomla, la videoconferencia no debería ser un destino separado. Debería ser una **característica nativa**, una capa de comunicación profundamente integrada.

Al centrarnos en los plugins, te permitimos:

*   **Aprovechar tu infraestructura existente:** Nuestros plugins utilizan tu base de datos de usuarios existente. Un profesor en Moodle es un profesor en plugNmeet. Un estudiante es un estudiante. No hay nuevas cuentas que crear ni una autenticación compleja que gestionar. Simplemente funciona.

*   **Crear una experiencia de usuario fluida:** Los usuarios nunca tienen que abandonar tu dominio. Se unen a una clase en vivo directamente desde la página del curso. Participan en un webinar sin ver nunca un logotipo de terceros. Toda la experiencia se siente como una extensión natural de tu propia plataforma.

*   **Mantener los datos contextuales y conectados:** Cuando se graba una reunión, la grabación aparece automáticamente en la página del curso correspondiente en Moodle. Los datos pertenecen al contexto en el que se crearon, lo que facilita que los usuarios los encuentren y que tú los gestiones.

### Un ejemplo del mundo real: El flujo de trabajo de Moodle

Imagina a una profesora preparando una clase en vivo. Con el plugin de plugNmeet:

1.  Ya ha iniciado sesión en su curso de Moodle.
2.  Hace clic en "Añadir una actividad o recurso" y selecciona "plugNmeet".
3.  Establece la hora y algunos parámetros, y la reunión se crea.

Para el estudiante, el proceso es aún más simple. Inicia sesión en su curso, ve el enlace de la sesión en vivo y hace clic en él. Se une a la reunión de forma instantánea y segura. No hay nuevas pestañas, ni aplicaciones externas que lanzar, ni confusión.

Este es el poder de un enfoque que prioriza los plugins.

---

## Nuestro compromiso con el ecosistema

No estamos tratando de construir una isla separada para que tus usuarios la visiten. Estamos construyendo los puentes que llevan la potente comunicación por video autoalojada directamente a las plataformas que ya usas y en las que confías.

Nuestro plugin de Moodle es solo el principio. Nuestra visión es que plugNmeet sea la capa de video nativa y autoalojada para cada LMS y CMS importante. Estamos trabajando activamente para expandir nuestro ecosistema de plugins y damos la bienvenida a las contribuciones de la comunidad para llevar plugNmeet a aún más plataformas.

plugNmeet no es un destino; es una característica. Es la capa de comunicación que le faltaba a tu plataforma.

---
**¿Listo para integrar un potente video en tu plataforma?**

*   **Echa un vistazo a nuestro [Plugin de Moodle](/docs/user-guide/moodle-integration)**
*   **Explora nuestro [Proyecto de Código Abierto en GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **Lee nuestra [Documentación de la API](/docs/api/intro) para construir tu propia integración**
