---
title: "¿Quién tiene las llaves? Una guía de los modelos de cifrado de extremo a extremo de plugNmeet"
slug: e2ee-key-models-guide
authors: [jibon]
tags: [e2ee, seguridad, cifrado, privacidad, arquitectura, desarrollador]
---

En el mundo de la comunicación segura, el Cifrado de Extremo a Extremo (E2EE) es el estándar de oro. Asegura que solo los participantes en una conversación puedan descifrar y ver los flujos de medios, ni siquiera el propio servidor. En plugNmeet, hemos implementado un robusto modelo E2EE basado en la API de WebRTC Insertable Streams.

Pero "E2EE" no es una solución única para todos. Queda una pregunta crítica: **¿de dónde vienen las claves de cifrado y quién las gestiona?**

plugNmeet ofrece dos modelos distintos para gestionar las claves E2EE, controlados por una simple configuración: `enabled_self_insert_encryption_key`. Entender la diferencia es clave para elegir la postura de seguridad adecuada para tu aplicación.

<!--truncate-->

---

## El concepto central: Secreto compartido

En ambos modelos, el objetivo es el mismo: cada participante en una sala debe compartir exactamente la misma clave secreta. Esta clave se utiliza para cifrar todos los medios salientes y descifrar todos los medios entrantes. Si un usuario no tiene la clave, no puede participar.

La diferencia entre nuestros dos modelos se reduce a una simple pregunta: **¿quién genera y distribuye este secreto compartido?**

### Modelo 1: Claves generadas por el servidor (`enabled_self_insert_encryption_key = false`)

Este es el método **predeterminado, más simple y más conveniente**.

**Cómo funciona:**
1.  Cuando el primer participante se une a una sala con E2EE habilitado, el **servidor de plugNmeet** genera criptográficamente una clave secreta fuerte y aleatoria para esa sala específica.
2.  A medida que cada participante posterior se une, el servidor de plugNmeet entrega de forma segura esta clave al nuevo participante como parte de su respuesta de autenticación.
3.  El navegador del cliente utiliza entonces esta clave para configurar su mecanismo de cifrado.

**¿Para quién es esto?**
*   **La mayoría de los casos de uso estándar.**
*   Aplicaciones que necesitan un cifrado fuerte sin la complejidad de construir su propio sistema de gestión de claves.
*   Cualquiera que confíe en su propio servidor plugNmeet autoalojado para gestionar las claves por sesión.

**Ventajas:**
*   **Simple de implementar:** E2EE funciona desde el primer momento sin necesidad de trabajo de desarrollo adicional por tu parte.
*   **Seguro:** La clave se genera en tu servidor de confianza y autoalojado y se transmite de forma segura a cada cliente. Solo existe durante la duración de la sesión.

**El modelo de confianza:**
En este modelo, confías en tu propio servidor plugNmeet para generar y distribuir las claves. El servidor "conoce" la clave de cada sesión, pero está diseñado para no almacenarla a largo plazo. Para un entorno autoalojado, este es un modelo de seguridad muy fuerte y práctico.

---

### Modelo 2: Claves proporcionadas por el usuario (`enabled_self_insert_encryption_key = true`)

Este es el método **más seguro y avanzado**, que proporciona una verdadera arquitectura de "conocimiento cero" donde ni siquiera tu aplicación maneja la clave.

**Cómo funciona:**
1.  Cuando este modo está habilitado, el servidor de plugNmeet **no** genera ni maneja ninguna clave.
2.  Se convierte en responsabilidad de los usuarios compartir de forma segura una clave secreta entre ellos utilizando un canal completamente **fuera de banda** (por ejemplo, un mensaje de Signal, un gestor de contraseñas o incluso verbalmente). Tu aplicación y tus servidores nunca tocan ni ven esta clave.
3.  Cuando un usuario se une a la reunión, la interfaz de usuario de plugNmeet le **pedirá que introduzca manualmente la clave secreta**.
4.  El usuario debe escribir o pegar la clave pre-compartida en el aviso. Solo si la clave es correcta, su cliente podrá cifrar y descifrar los flujos de medios para participar en la llamada.

**¿Para quién es esto?**
*   **Aplicaciones de máxima seguridad y conocimiento cero:** Casos de uso en los que necesitas garantizar que toda tu infraestructura de servidores (incluido tanto el servidor de plugNmeet como el backend de tu propia aplicación) no tenga absolutamente ningún conocimiento de las claves de cifrado.
*   **Plataformas para periodistas/denunciantes:** Situaciones en las que demostrar que no puedes acceder a las comunicaciones de los usuarios es una característica principal.
*   **Reuniones empresariales de alta seguridad:** Para discusiones internas de alto secreto donde las claves son gestionadas por la política de seguridad corporativa, no por la aplicación.

**Ventajas:**
*   **Verdadero conocimiento cero:** Tus servidores son completamente ciegos al contenido de las conversaciones. La clave nunca toca tu infraestructura de servidores, ni siquiera el frontend de tu aplicación.
*   **Máximo control del usuario:** La seguridad de la clave está entièrement en manos de los usuarios finales y del método de comunicación fuera de banda que hayan elegido.

**El modelo de confianza:**
En este modelo, no confías en ningún componente del servidor en absoluto. Solo confías en los clientes de los usuarios finales y en la seguridad del mecanismo fuera de banda que utilizaron para compartir la clave. Este es el nivel más alto de seguridad controlada por el usuario que puedes lograr.

---

## Comparación rápida: ¿Qué modelo deberías usar?

| Caso de uso                                   | Modelo recomendado        | ¿Por qué?                                                                                             |
| :-------------------------------------------- | :----------------------- | :----------------------------------------------------------------------------------------------- |
| **Una plataforma de reuniones de propósito general**        | **Generado por el servidor**     | Simple, seguro y no requiere trabajo extra. La opción predeterminada para la mayoría de las aplicaciones.            |
| **Una aplicación segura de telesalud o legal**          | **Proporcionado por el usuario**        | Proporciona la garantía más fuerte de "conocimiento cero", que puede ser necesaria para el cumplimiento.         |
| **Un chat privado para un equipo pequeño y de confianza**  | **Generado por el servidor**     | La seguridad es más que suficiente y la comodidad es alta.                               |
| **Construir una aplicación de video tipo Signal/Telegram** | **Proporcionado por el usuario**        | Se alinea con la filosofía de control del usuario y conocimiento cero de esas plataformas.                   |

## Conclusión

La elección entre claves generadas por el servidor y proporcionadas por el usuario es un clásico equilibrio entre la comodidad y el control absoluto. Al ofrecer ambos modelos, plugNmeet te da la flexibilidad de elegir la postura de seguridad que mejor se adapte a las necesidades específicas y al modelo de amenaza de tu aplicación.

Ya sea que necesites la seguridad simple y lista para usar de las claves generadas por el servidor o las garantías de conocimiento cero de un modelo proporcionado por el usuario, plugNmeet proporciona las herramientas para construir una plataforma de comunicación verdaderamente segura.

---
**¿Listo para aprender más?**

*   **Lee nuestro Resumen de Seguridad**
*   **Explora la Documentación de la API**
