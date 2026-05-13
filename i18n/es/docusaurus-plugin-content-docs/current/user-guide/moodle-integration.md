---
title: El plugin de plugNmeet para Moodle | Añada Videoconferencias a Moodle
description: Cómo instalar y configurar el plugin de plugNmeet para Moodle y así agregar actividades de videoconferencia en vivo a tus clases en línea.
keywords: [moodle, plugin, integración con moodle, aula virtual, clase en línea, e-learning, webrtc en moodle]
sidebar_position: 5
sidebar_label: Integración con Moodle
---

# Cómo Añadir una Actividad de Videoconferencia a Moodle con Plug-N-Meet

Esta guía le mostrará paso a paso cómo instalar y configurar el módulo de actividad Plug-N-Meet en el entorno de aprendizaje Moodle. Siguiendo este proceso, podrá realizar videoconferencias seguras e integradas directamente desde sus cursos.

---

## Parte 1: Instalación y Configuración del Plugin

Esta sección cubre la instalación inicial y la configuración del servidor para el módulo Plug-N-Meet.

### 1. Instalar desde el Directorio de Plugins de Moodle

- Como administrador de Moodle, navegue a **Administración del sitio > Extensiones > Instalar complementos (plugins)**.
- Haga clic en el botón **Instalar complementos desde el directorio de extensiones de Moodle.**.
- Será redirigido al directorio de plugins de Moodle. En el cuadro de búsqueda, escriba **plugnmeet** y haga clic en **Buscar**.
- Localice el plugin oficial de Plug-N-Meet y haga clic en **Instalar ahora**.

![Moodle-install-plugnmeet.png](/img/moodle/Moodle-install-plugnmeet.png)

### 2. Finalizar la Instalación

- El sistema le guiará a través de varias pantallas de confirmación.
- Haga clic en **Continuar** en cada una de ellas para completar las verificaciones de instalación y los pasos de actualización de la base de datos.

![Moodle-continue-4.png](/img/moodle/Moodle-continue-4.png)

### 3. Configurar los Ajustes del Servidor

- Tras el proceso de instalación, se le redirigirá a la página de configuración principal de Plug-N-Meet.
- **Este es el paso más importante.** Debe conectar el plugin a un servidor PlugNmeet que esté en funcionamiento.
- Los campos **URL del Servidor**, **Clave de API** y **Secreto de API** pueden venir prellenados con credenciales de demostración.
- **Deberá sustituirlos por los detalles de la API de su propio servidor (ya sea autoalojado o en PlugNmeet Cloud).** El servidor de demostración está destinado únicamente a pruebas temporales y presenta limitaciones.

![Moodle-8.png](/img/moodle/Moodle-8.png)

- Desplácese hasta el final y haga clic en **Guardar cambios**.

---

## Parte 2: Añadir una Videoconferencia a un Curso

Una vez que el plugin esté instalado y configurado, podrá añadir actividades de videoconferencia a cualquier curso.

### 1. Añadir la Actividad de PlugNmeet

- Diríjase al curso de Moodle donde desea incorporar la videoconferencia.
- Haga clic en el botón **Activar edición**.
- En la sección del curso deseada, haga clic en **Añadir una actividad o un recurso**.
- Seleccione **PlugNmeet** de la lista de actividades disponibles.

![Moodle-11.png](/img/moodle/Moodle-11.png)

### 2. Configurar la Actividad

- **Nombre y Descripción de la Reunión:** Asigne un nombre y una descripción claros a su videoconferencia.
- **Mensaje de Bienvenida:** Personalice el mensaje inicial que aparecerá en el chat de la reunión.
- **Máximo de Participantes:** Establezca un límite de usuarios (use `0` para que sea ilimitado).

![Moodle-12.png](/img/moodle/Moodle-12.png)

### 3. Descripción de los Ajustes de la Actividad

Al crear una actividad de PlugNmeet, dispondrá de múltiples opciones de personalización, agrupadas en las siguientes secciones:

- **Características de la Sala:** Permite habilitar o deshabilitar funciones principales como el uso de cámaras web, compartir pantalla y la grabación.
- **Características del Chat:** Permite controlar si el chat está activo y si se permite el envío de archivos.
- **Bloc de Notas Compartido y Pizarra:** Permite habilitar o deshabilitar estas herramientas de colaboración.
- **Configuración de bloqueo predeterminada:** Defina qué funciones estarán bloqueadas por defecto para los asistentes al unirse (por ejemplo, micrófono o chat). Esto resulta muy útil para sesiones tipo conferencia.
- **Ajustes Específicos de Moodle:** También puede configurar ajustes estándar de Moodle como **Calificación**, **Restricción de acceso** y **Finalización de la actividad** para integrar la videoconferencia con el libro de calificaciones y el progreso del estudiante.

![Moodle-15.png](/img/moodle/Moodle-15.png)

### 4. Guardar y Unirse

- Tras configurar todos los ajustes, haga clic en **Guardar cambios y mostrar**.
- Tanto usted como sus estudiantes ya pueden acceder a la reunión pulsando el botón **Unirse a la sesión**.

![Moodle-27.png](/img/moodle/Moodle-27.png)

---

## Parte 3: Ajustes Globales y Avanzados (Opcional)

Como administrador, tiene la posibilidad de establecer una configuración global aplicable a todas las actividades de PlugNmeet.

- **Ubicación:** Navegue a **Administración del sitio > Extensiones > Módulos de actividad > plugNmeet**.

### Personalización del Diseño

- En el área de configuración, desplácese hacia abajo hasta la sección **Marca y personalización**.
- Desde aquí puede personalizar el logotipo, el fondo y los colores principales y secundarios para adaptarlos a la identidad visual de su organización o institución.

![Moodle-designcust.png](/img/moodle/Moodle-designcust.png)

### Ajustes de la Versión del Cliente

- En la configuración principal, puede elegir el método de carga del cliente.
- **Remoto (Recomendado):** El cliente se actualiza automáticamente al actualizar el plugin. Es la opción preferida para la mayoría de los usuarios.
- **Local:** Permite utilizar una versión del cliente alojada de forma personalizada si requiere modificaciones específicas.

![Moodle-client-version.png](/img/moodle/Moodle-client-version.png)

---

## Preguntas Comunes y Solución de Problemas

**¿Por qué mis estudiantes visualizan un error de 'API no válida' u otros fallos?**
Este es el problema más frecuente. Significa que aún se están utilizando las credenciales de demostración predeterminadas en la configuración principal del plugin. Debe sustituirlas por los datos de la API de su propio servidor o de PlugNmeet Cloud.

**¿Cómo accedo a la configuración principal del plugin después de la instalación?**
Como administrador de Moodle, encontrará la configuración global en **Administración del sitio > Extensiones > Módulos de actividad > plugNmeet**.
