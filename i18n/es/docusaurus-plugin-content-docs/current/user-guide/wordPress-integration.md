---
title: Plugin de WordPress para plugNmeet | Añada Videoconferencias a su Sitio
description: Cómo instalar y configurar el plugin de WordPress para plugNmeet para añadir videoconferencias seguras y autoalojadas directamente a su sitio web de WordPress.
keywords: [wordpress, plugin, integración con wordpress, videoconferencia en wordpress, webrtc en wordpress, alternativa a zoom en wordpress]
sidebar_position: 4
sidebar_label: Integración con WordPress
---

# Cómo Añadir Videoconferencias a WordPress con el Plugin Plug-N-Meet

Esta guía proporciona un recorrido completo para integrar la potente solución de videoconferencia autoalojada Plug-N-Meet con su sitio web de WordPress. Al finalizar, podrá organizar reuniones de video seguras directamente desde su propio dominio.

---

## Parte 1: Instalación y Configuración Inicial

Esta sección cubre la instalación del plugin y su conexión a su servidor PlugNmeet.

### 1. Instalar el Plugin

- Desde su panel de WordPress, navegue a **Plugins > Añadir nuevo**.
- En la barra de búsqueda, escriba **plugnmeet**.
- Localice el plugin oficial de Plug-N-Meet en los resultados de búsqueda y haga clic en **Instalar ahora**.

![plugin-min.png](/img/wordpress/plugin-min.png)

### 2. Activar el Plugin

- Una vez completada la instalación, haga clic en el botón **Activar**.

![plugin-acrive-min.png](/img/wordpress/plugin-acrive-min.png)

### 3. Conectarse a su Servidor (Configuración de la API)

Este es el paso más importante. Debe conectar el plugin a un servidor PlugNmeet que esté en funcionamiento.

- Desde su panel de WordPress, navegue al nuevo elemento de menú **Plug-N-Meet** y seleccione **Ajustes**.
- Verá tres campos: **URL del Servidor**, **Clave de API** y **Secreto de API**.

![server-settings-min.png](/img/wordpress/server-settings-min.png)

- Estos campos deben rellenarse con las credenciales de la API de su servidor. Después de la activación, es posible que estén pre-rellenados con credenciales de demostración.
- **Debe sustituirlos por los detalles de la API de su propio servidor autoalojado o de PlugNmeet Cloud para garantizar la funcionalidad completa.**

---

## Parte 2: Creación y Publicación de su Primera Reunión

Ahora que el plugin está configurado, puede crear y mostrar una sala de reuniones en su sitio.

### 1. Crear una Nueva Sala

- Desde el panel de WordPress, vaya a **Plug-N-Meet > Salas**.
- Haga clic en **Añadir nueva**.

![room-add-new-min.png](/img/wordpress/room-add-new-min.png)

### 2. Configurar los Ajustes de la Sala

- **Título y Descripción:** Asigne un título claro a su sala de reuniones.
- **Contraseñas:** Establezca contraseñas para moderadores y asistentes.
- **Mensaje de Bienvenida:** Personalice el mensaje inicial que aparece en el chat.
- **Máximo de Participantes:** Establezca un límite en el número de usuarios que pueden unirse (use `0` para ilimitado).
- **Características de la Sala:** Habilite o deshabilite funciones principales como cámaras web, uso compartido de pantalla y grabación.
- **Ajustes de Bloqueo Predeterminados:** Configure qué funciones estarán bloqueadas por defecto cuando un usuario se una (por ejemplo, micrófono, chat).

### 3. Publicar la Sala

- Una vez que haya configurado la sala a su gusto, haga clic en **Enviar**.

![room-submit-min.png](/img/wordpress/room-submit-min.png)

### 4. Mostrar la Sala en una Página

- Vaya a **Plug-N-Meet > Salas** y localice la sala que acaba de crear.
- En la columna **Shortcode**, copie el shortcode único para esa sala.

![select-shortcodes.png](/img/wordpress/select-shortcodes.png)

- Vaya a **Páginas > Añadir nueva** (o edite una página existente).
- Pegue el shortcode en el área de contenido de la página.

![paste-shortcodes.png](/img/wordpress/paste-shortcodes.png)

- Haga clic en **Actualizar** o **Publicar**.
- Ahora puede ver la página para acceder a su sala de reuniones en vivo.

---

## Parte 3: La Experiencia del Asistente

Cuando un usuario visita la página que contiene el shortcode de su sala de reuniones, verá una pantalla de inicio de sesión sencilla.

- **Unirse:** Los asistentes introducen su nombre y la contraseña requerida para unirse a la reunión.
- **Sin Contraseña:** Si no estableció una contraseña, solo necesitarán introducir su nombre.

![wordpress-join-pass.png](/img/wordpress/wordpress-join-pass.png)

---

## Parte 4: Configuración Avanzada (Opcional)

Estos ajustes le permiten personalizar aún más la apariencia de sus reuniones.

### Personalización del Diseño

Puede personalizar los colores y logotipos globalmente (para todas las salas) o para una sala específica.

- **Personalización Global:** Navegue a **Plug-N-Meet > Ajustes** y desplácese hacia abajo hasta **Personalización del Diseño**.
- **Personalización por Sala:** Edite una sala específica y vaya a la pestaña **Personalización del Diseño**.

Aquí puede cambiar el logotipo, el fondo y todos los colores primarios y secundarios para que coincidan con su marca.

![plugin-room-customization-page.png](/img/wordpress/plugin-room-customization-page.png)

### Permisos de Rol de Usuario

Desde la página **Plug-N-Meet > Ajustes**, haga clic en la pestaña **Permiso** para configurar cómo interactúan los diferentes roles de usuario de WordPress con las salas de reuniones. Puede controlar quién puede unirse como moderador, quién necesita una contraseña y quién puede gestionar las grabaciones.

![wordpress-permission-config.png](/img/wordpress/wordpress-permission-config.png)

### Ajustes de la Versión del Cliente

En **Plug-N-Meet > Ajustes**, puede elegir cómo se carga el cliente.

- **Remoto (Predeterminado):** El cliente se actualiza automáticamente cuando actualiza el plugin. Esto se recomienda para la mayoría de los usuarios.
- **Local:** Le permite usar una versión del cliente alojada a medida si tiene modificaciones específicas.

![client-version.png](/img/wordpress/client-version.png)

---

## Preguntas Comunes y Solución de Problemas

**¿Por qué veo un error de 'API no válida' u otros errores?**
Esto generalmente significa que las credenciales de demostración han expirado o que está intentando usar una función deshabilitada en el servidor de demostración. Debe reemplazar los detalles de la API predeterminados en la página de Ajustes con las credenciales de su propio servidor PlugNmeet.

**¿Puedo usar este plugin sin un servidor PlugNmeet?**
No. Este plugin es un cliente que conecta su sitio de WordPress a un servidor PlugNmeet. Debe tener un servidor autoalojado o una suscripción a PlugNmeet Cloud para que el plugin funcione.
