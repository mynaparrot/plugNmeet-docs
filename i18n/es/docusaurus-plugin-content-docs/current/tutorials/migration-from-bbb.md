---
title: Cómo Migrar de BigBlueButton (BBB) a plugNmeet
description: Una guía para desarrolladores y administradores sobre cómo migrar de un servidor BigBlueButton a plugNmeet para obtener una solución más moderna, escalable y personalizable.
keywords: [migrar de bbb, alternativa a bigbluebutton, migración bbb, reemplazo bbb, plugnmeet vs bbb, tutorial]
sidebar_position: 2
sidebar_label: Migrando de BigBlueButton
---

# Migrando de BigBlueButton: Una Alternativa Moderna

¿Está buscando una alternativa más moderna, ligera y escalable a BigBlueButton? Plug-N-Meet ofrece una arquitectura de última generación con un enfoque en el rendimiento y la simplicidad, y hemos hecho que el proceso de migración sea increíblemente sencillo.

Esta guía le mostrará los beneficios de cambiar y cómo puede migrar su aplicación existente, integrada con BBB, en solo unos minutos, sin necesidad de modificar su código de front-end.

---

## ¿Por Qué Considerar Plug-N-Meet?

BigBlueButton es un proyecto de código abierto fundamental que ha servido a la comunidad durante años. Plug-N-Meet nació de un profundo respeto por el ecosistema de BBB y fue diseñado para abordar algunos de sus desafíos arquitectónicos inherentes, ofreciendo un enfoque diferente para quienes necesitan mayor flexibilidad y escalabilidad.

Para una comparación detallada y directa de ambas plataformas, le recomendamos leer nuestro análisis completo:
**[BigBlueButton vs. Plug-N-Meet: Una Alternativa Moderna](/blog/bigbluebutton-vs-plugnmeet-alternative)**

A continuación, las ventajas clave de la arquitectura de Plug-N-Meet:

-   **Construido sobre una Base de Clase Mundial:** Plug-N-Meet está impulsado por **LiveKit** como su servidor de medios y **NATS** para la mensajería en tiempo real (chat, sincronización de pizarra, etc.). Estos son componentes extremadamente rápidos, escalables y modernos que permiten a Plug-N-Meet manejar una gran cantidad de usuarios con menos recursos de servidor.
-   **Pila Tecnológica Simplificada y Ligera:** Al aprovechar estos componentes, Plug-N-Meet evita la compleja red de dependencias que se encuentra en BigBlueButton (como FreeSWITCH y Kurento). Esto resulta en una huella de recursos significativamente menor, una instalación más fácil y un mantenimiento más simple.
-   **Grabaciones Simplificadas en un Solo Archivo:** A diferencia del complejo flujo de trabajo de post-procesamiento de BigBlueButton, plugNmeet genera un único archivo MP4 estándar para cada grabación. Esto hace que sus grabaciones sean instantáneamente portátiles, más fáciles de gestionar y más rápidas de acceder.
-   **Diseñado para el Escalado Distribuido:** Plug-N-Meet no está construido como una única aplicación monolítica. Cada componente central (LiveKit para medios, NATS para mensajería, el grabador y el servidor de plugNmeet) está diseñado para escalar de forma independiente. Esto le permite agregar recursos precisamente donde los necesita, por ejemplo, escalando su infraestructura de grabación sin afectar el rendimiento de las reuniones en vivo.
-   **Personalización sin Esfuerzo:** La plataforma está diseñada para una personalización profunda y sencilla. El cliente de front-end es una aplicación moderna y autónoma, y el back-end es un único binario. Esta clara separación permite a los desarrolladores modificar rápidamente la interfaz de usuario, agregar funciones o integrar flujos de trabajo personalizados sin tener que navegar por el complejo entorno de múltiples servicios de BigBlueButton.
-   **Compatibilidad de API Transparente:** Este es nuestro compromiso con el ecosistema. Plug-N-Meet incluye una capa de API compatible con BBB. Esto significa que su aplicación existente, ya sea Greenlight, un plugin de Moodle o una solución personalizada, funcionará con Plug-N-Meet sin requerir ningún cambio en el código de front-end.

---

## El Proceso de Migración de 2 Minutos

Gracias a nuestra API compatible con BBB, migrar su aplicación existente es tan simple como cambiar el punto final de la API y las credenciales en su configuración.

En la configuración de su aplicación, localice los ajustes de la API de BigBlueButton y actualice los siguientes dos valores:

1.  **URL del Punto Final de la API:** Cambie la URL para que apunte a su servidor de PlugNmeet, seguida de `/bigbluebutton/`.
2.  **Secreto de la API:** Cambie el secreto para que coincida con su secreto de API de PlugNmeet.

Eso es todo. Su `API Key` de PlugNmeet se pasará como el `user` en la URL.

### Ejemplo de Configuración

```
URL: https://[SU_HOST_PLUGNMEET]/[SU_API_KEY_PLUGNMEET]/bigbluebutton/
Secret: [SU_SECRETO_API_PLUGNMEET]
```

Por ejemplo, usando el servidor de demostración público, la configuración sería:

```
URL: https://demo.plugnmeet.com/plugnmeet/bigbluebutton/
Secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

---

## Después de la Migración: Desbloqueando el Conjunto Completo de Funciones

Para proporcionar esta migración transparente, Plug-N-Meet utiliza una potente capa de API compatible con BBB. Esto asegura que todas las funciones principales de BigBlueButton en las que se basa su aplicación existente funcionarán de inmediato.

Sin embargo, esta capa de compatibilidad está diseñada como un puente. Para experimentar todo el poder de Plug-N-Meet, incluidas nuestras funciones más avanzadas, un rendimiento superior y opciones de personalización sin esfuerzo, **recomendamos encarecidamente cambiar a nuestros plugins o SDKs dedicados** cuando esté listo.

El uso de las integraciones nativas proporcionará la experiencia más estable, rica en funciones y preparada para el futuro para sus usuarios.

-   **[Plugin de WordPress](/docs/user-guide/wordPress-integration)**
-   **[Plugin de Moodle](/docs/user-guide/moodle-integration)**
-   **[Componente de Joomla](/docs/user-guide/joomla-integration)**
-   **[SDKs de PHP y JavaScript](/docs/tutorials/quick_php)** para aplicaciones personalizadas.
