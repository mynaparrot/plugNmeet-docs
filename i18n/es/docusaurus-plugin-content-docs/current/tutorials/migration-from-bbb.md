---
title: Cómo migrar de BigBlueButton (BBB) a plugNmeet
description: Una guía para desarrolladores y administradores sobre cómo migrar de un servidor BigBlueButton a plugNmeet para una solución más moderna, escalable y personalizable.
keywords: [migrar de bbb, alternativa a bigbluebutton, migración bbb, reemplazo bbb, plugnmeet vs bbb, tutorial]
sidebar_position: 2
sidebar_label: Migrando de BigBlueButton
---

# Migrando de BigBlueButton: Una alternativa moderna

¿Está buscando una alternativa más moderna, ligera y escalable a BigBlueButton? Plug-N-Meet ofrece una arquitectura de próxima generación con un enfoque en el rendimiento y la simplicidad, y hemos hecho que el proceso de migración sea increíblemente sencillo.

Esta guía le guiará a través de los beneficios de cambiar y le mostrará cómo migrar su aplicación existente integrada con BBB en solo unos minutos, sin cambiar nada de su código front-end.

---

## ¿Por qué considerar Plug-N-Meet?

BigBlueButton es un proyecto de código abierto fundamental que ha servido a la comunidad durante años. Plug-N-Meet nació de un profundo respeto por el ecosistema de BBB y fue diseñado para abordar algunos de sus desafíos arquitectónicos inherentes, ofreciendo un enfoque diferente para aquellos que necesitan más flexibilidad y escalabilidad.

Para una comparación detallada y directa de las dos plataformas, le recomendamos leer nuestro análisis completo:
**[BigBlueButton vs. Plug-N-Meet: Una alternativa moderna](/blog/bigbluebutton-vs-plugnmeet-alternative)**

Aquí están las ventajas clave de la arquitectura de Plug-N-Meet:

-   **Construido sobre una base de clase mundial:** Plug-N-Meet está impulsado por **LiveKit** como su servidor de medios y **NATS** para la mensería en tiempo real (chat, sincronización de pizarra, etc.). Estos son componentes extremadamente rápidos, escalables y modernos que permiten a Plug-N-Meet manejar una carga masiva de usuarios con menos recursos del servidor.
-   **Pila simplificada y ligera:** Al aprovechar estos componentes, Plug-N-Meet evita la compleja red de dependencias que se encuentran en BigBlueButton (como FreeSWITCH y Kurento). Esto resulta en una huella significativamente menor, una instalación más fácil y un mantenimiento más simple.
-   **Grabaciones simplificadas de un solo archivo:** A diferencia del complejo flujo de trabajo de post-procesamiento de BigBlueButton, plugNmeet genera un archivo MP4 estándar para cada grabación. Esto hace que sus grabaciones sean instantáneamente portátiles, más fáciles de administrar y más rápidas de acceder.
-   **Diseñado para el escalado distribuido:** Plug-N-Meet no está construido como una única aplicación grande. Cada componente central (LiveKit (medios), NATS (mensajería), el grabador y el servidor plugnmeet) está diseñado para escalarse de forma independiente. Esto le permite agregar recursos precisamente donde los necesita, por ejemplo, escalar su infraestructura de grabación sin afectar el rendimiento de las reuniones en vivo.
-   **Personalización sin esfuerzo:** La plataforma está diseñada para una personalización profunda y fácil. El cliente front-end es una aplicación moderna y autónoma, y el back-end es un único binario. Esta clara separación permite a los desarrolladores cambiar rápidamente la interfaz de usuario, agregar funciones o integrar flujos de trabajo personalizados sin navegar por el complejo entorno de múltiples servicios que se encuentra en BigBlueButton.
-   **Compatibilidad API perfecta:** Este es nuestro compromiso con el ecosistema. Plug-N-Meet incluye una capa API compatible con BBB. Esto significa que su aplicación existente, ya sea Greenlight, un complemento de Moodle o una solución personalizada, funcionará con Plug-N-Meet sin requerir ningún cambio en el código front-end.

---

## El proceso de migración de 2 minutos

Debido a nuestra API compatible con BBB, migrar su aplicación existente es tan simple como cambiar el punto final de la API y las credenciales en su configuración.

En la configuración de su aplicación, localice su configuración de API de BigBlueButton y actualice los siguientes dos valores:

1.  **URL del punto final de la API:** Cambie la URL para que apunte a su servidor PlugNmeet, seguido de `/bigbluebutton/`.
2.  **Secreto de la API:** Cambie el secreto para que coincida con su secreto de API de PlugNmeet.

Eso es todo. Su `API Key` de PlugNmeet se pasará como el `user` en la URL.

### Ejemplo de configuración

```
URL: https://[HOST_PLUGNMEET]/[API_KEY_PLUGNMEET]/bigbluebutton/
Secret: [SECRETO_API_PLUGNMEET]
```

Por ejemplo, usando el servidor de demostración público, la configuración sería:

```
URL: https://demo.plugnmeet.com/plugnmeet/bigbluebutton/
Secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

---

## Después de la migración: Desbloqueando el conjunto completo de funciones

Para proporcionar esta migración perfecta, Plug-N-Meet utiliza una potente capa API compatible con BBB. Esto asegura que todas las funciones principales de BigBlueButton en las que se basa su aplicación existente funcionarán de inmediato.

Sin embargo, esta capa de compatibilidad está diseñada como un puente. Para experimentar todo el poder de Plug-N-Meet, incluidas nuestras funciones más avanzadas, un rendimiento superior y opciones de personalización sin esfuerzo, **recomendamos encarecidamente cambiar a nuestros complementos o SDK dedicados** cuando esté listo.

El uso de las integraciones nativas proporcionará la experiencia más estable, rica en funciones y preparada para el futuro para sus usuarios.

-   **[Complemento de WordPress](/docs/user-guide/wordPress-integration)**
-   **[Complemento de Moodle](/docs/user-guide/moodle-integration)**
-   **[Complemento de Joomla](/docs/user-guide/joomla-integration)**
-   **[SDKs de PHP y JavaScript](/docs/tutorials/quick_php)** para aplicaciones personalizadas.
