---
title: Integración de plugNmeet con Joomla | Agregue Reuniones de Video a su Sitio
description: Cómo instalar y configurar el componente plugNmeet para agregar reuniones de video autoalojadas y funciones de conferencia a su sitio web de Joomla.
keywords: [joomla, integración con joomla, componente de joomla, videoconferencia en joomla, webrtc en joomla]
sidebar_position: 6
sidebar_label: Integración con Joomla
---

# Cómo Agregar Videoconferencias a Joomla con la Extensión Plug-N-Meet

Esta guía proporciona un recorrido completo para integrar el componente de videoconferencia Plug-N-Meet con su sitio web de Joomla. Siguiendo estos pasos, podrá alojar reuniones de video seguras directamente desde su propio dominio.

---

## Parte 1: Instalación y Configuración Inicial

Esta sección cubre la instalación de la extensión y su conexión a su servidor PlugNmeet.

### 1. Instalar la Extensión

- Desde su panel de administrador de Joomla, navegue a **Sistema > Instalar > Extensiones**.
- Seleccione la pestaña **Instalar desde la Web** y busque **plugnmeet**.
- Encuentre la extensión oficial de Plug-N-Meet y haga clic en **Instalar**.

![Joomla-install.png](/img/Joomla/Joomla-install.png)

- Después de un momento, debería ver una confirmación de que la instalación fue exitosa.

![Joomla-success.png](/img/Joomla/Joomla-success.png)

### 2. Conectarse a su Servidor (Configuración de la API)

Este es el paso más importante. Debe conectar la extensión a un servidor PlugNmeet en funcionamiento.

- Desde su panel de administrador de Joomla, navegue a **Sistema > Configuración Global**.
- En el menú de la izquierda, seleccione **plugNmeet**.

![Joomla-plugin-config.png](/img/Joomla/Joomla-plugin-config.png)

- Verá tres campos: **URL del Servidor**, **Clave de API** y **Secreto de API**.
- Después de la instalación, estos campos se llenarán previamente con credenciales de demostración. **Debe reemplazarlos con los detalles de la API de su propio servidor autoalojado o de PlugNmeet Cloud.** El servidor de demostración es solo para pruebas temporales y tiene limitaciones.

![Joomla-plugnmeet-config.png](/img/Joomla/Joomla-plugnmeet-config.png)

- Después de ingresar sus propias credenciales, haga clic en **Guardar**.

---

## Parte 2: Creación y Publicación de su Primera Reunión

Ahora que la extensión está configurada, necesita crear una sala y luego hacerla accesible en su sitio web.

### Paso 2.1: Crear una Sala de Reuniones

- Desde el panel de administrador de Joomla, vaya a **Componentes > Plug N Meet > Administrar Salas**.
- Haga clic en **+ Nuevo** para crear una nueva sala de reuniones.
- **Configurar los Ajustes de la Sala:**
  - **Título y Descripción:** Dé a su sala de reuniones un título claro.
  - **Contraseñas:** Establezca contraseñas para moderadores y asistentes.
  - **Mensaje de Bienvenida:** Personalice el mensaje inicial que aparece en el chat.
  - **Máximo de Participantes:** Establezca un límite en el número de usuarios que pueden unirse (use `0` para ilimitado).
  - **Características de la Sala y Ajustes de Bloqueo Predeterminados:** Habilite o deshabilite funciones como cámaras web, uso compartido de pantalla y grabación para personalizar la experiencia en la sala.
- Cuando haya terminado, haga clic en **Guardar**.

![Joomla-12.png](/img/Joomla/Joomla-12.png)

### Paso 2.2: Mostrar la Sala en su Sitio

Para permitir que los usuarios accedan a la sala, debe vincularla desde un menú.

- Navegue a **Menús > Menú Principal** (o su menú preferido) y haga clic en **+ Agregar Nuevo Elemento de Menú**.
- En el campo **Tipo de Elemento de Menú**, haga clic en **Seleccionar**.
- Aparecerá una ventana modal. Elija **Plug N Meet > Sala única**.

![Joomla-25.png](/img/Joomla/Joomla-25.png)

- En el menú desplegable **Seleccionar una sala**, elija la sala que acaba de crear.
- Dé al elemento del menú un **Título** (p. ej., "Clase en Vivo" o "Reunión Semanal").
- Haga clic en **Guardar**.

![Joomla-26.png](/img/Joomla/Joomla-26.png)

- Su sala de reuniones ahora está en vivo y accesible desde el menú principal de su sitio web.

---

## Parte 3: La Experiencia del Asistente

Cuando un usuario haga clic en el nuevo elemento del menú en su sitio web, será llevado a la página de inicio de sesión de la reunión.

- Para unirse, simplemente necesitan ingresar su nombre y la contraseña que configuró para la sala.

![Joomla-28.png](/img/Joomla/Joomla-28.png)

---

## Parte 4: Configuración Avanzada (Opcional)

Estos ajustes le permiten personalizar aún más la apariencia y los permisos de sus reuniones.

### Personalización del Diseño

Puede personalizar los colores y logotipos para que coincidan con su marca.

- **Personalización Global:** Navegue a **Sistema > Configuración Global > plugNmeet > Personalización del Diseño**.
- **Personalización por Sala:** Al editar una sala específica (**Componentes > Plug N Meet > Administrar Salas**), haga clic en la pestaña **Personalización del Diseño**.

Aquí puede cambiar el logotipo, el fondo y todos los colores primarios y secundarios.

![Joomla-globalcust.png](/img/Joomla/Joomla-globalcust.png)

### Permisos de Usuario

Al editar una sala, haga clic en la pestaña **Permiso** para configurar qué grupos de usuarios de Joomla tienen acceso a la sala y cuáles son sus roles (p. ej., moderador o asistente).

![room_permission.png](/img/Joomla/room_permission.png)

---

## Preguntas Comunes y Solución de Problemas

**¿Por qué veo un error de 'API no válida' en mi página de reunión?**
Este es el problema más común. Significa que todavía está utilizando las credenciales de demostración predeterminadas en la configuración global. Debe reemplazarlas con los detalles de la API de su propio servidor PlugNmeet.

**¿Cómo encuentro la configuración global después de la instalación?**
Como administrador de Joomla, puede encontrar la configuración global en **Sistema > Configuración Global > plugNmeet**.
