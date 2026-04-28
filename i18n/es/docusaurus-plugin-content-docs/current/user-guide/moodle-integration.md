---
title: Plugin de Moodle para plugNmeet | Agregue Videoconferencias a Moodle
description: Cómo instalar y configurar el plugin de Moodle para plugNmeet para agregar una actividad de videoconferencia en vivo a sus cursos de Moodle para clases en línea.
keywords: [moodle, plugin, integración con moodle, aula virtual, clase en línea, e-learning, webrtc en moodle]
sidebar_position: 5
sidebar_label: Integración con Moodle
---

# Cómo Agregar una Actividad de Videoconferencia a Moodle con Plug-N-Meet

Esta guía proporciona un recorrido completo para instalar y configurar el módulo de actividad Plug-N-Meet para su entorno de aprendizaje Moodle. Siguiendo estos pasos, puede alojar videoconferencias seguras e integradas directamente dentro de sus cursos de Moodle.

---

## Parte 1: Instalación y Configuración del Plugin

Esta sección cubre la instalación inicial y la configuración del servidor para el módulo Plug-N-Meet.

### 1. Instalar desde el Directorio de Plugins de Moodle

- Como administrador de Moodle, navegue a **Administración del sitio > Plugins > Instalar plugins**.
- Haga clic en el botón **Instalar plugins desde el directorio de plugins de Moodle**.
- Será redirigido al directorio de plugins de Moodle. En el cuadro de búsqueda, escriba **plugnmeet** y haga clic en **Buscar**.
- Encuentre el plugin oficial de Plug-N-Meet y haga clic en **Instalar ahora**.

![Moodle-install-plugnmeet.png](/img/moodle/Moodle-install-plugnmeet.png)

### 2. Completar la Instalación

- Se le guiará a través de varias pantallas de confirmación.
- Haga clic en **Continuar** en cada pantalla para proceder a través de las verificaciones de instalación y los pasos de actualización de la base de datos.

![Moodle-continue-4.png](/img/moodle/Moodle-continue-4.png)

### 3. Configurar los Ajustes del Servidor

- Después del proceso de instalación, será llevado a la página de configuración principal de Plug-N-Meet.
- **Este es el paso más importante.** Debe conectar el plugin a un servidor PlugNmeet en funcionamiento.
- Los campos **URL del Servidor**, **Clave de API** y **Secreto de API** pueden estar pre-llenados con credenciales de demostración.
- **Debe reemplazarlos con los detalles de la API de su propio servidor autoalojado o de PlugNmeet Cloud.** El servidor de demostración es solo para pruebas temporales y tiene limitaciones.

![Moodle-8.png](/img/moodle/Moodle-8.png)

- Desplácese hacia abajo y haga clic en **Guardar cambios**.

---

## Parte 2: Agregar una Videoconferencia a un Curso

Una vez que el plugin está instalado y configurado, puede agregar actividades de videoconferencia a cualquier curso.

### 1. Agregar la Actividad PlugNmeet

- Navegue al curso de Moodle donde desea agregar la videoconferencia.
- Haga clic en el botón **Activar edición**.
- En el Tema del curso deseado, haga clic en **Añadir una actividad o un recurso**.
- Seleccione **PlugNmeet** de la lista de actividades.

![Moodle-11.png](/img/moodle/Moodle-11.png)

### 2. Configurar la Actividad

- **Nombre y Descripción de la Reunión:** Dé a su videoconferencia un nombre y una descripción claros.
- **Mensaje de Bienvenida:** Personalice el mensaje inicial que aparece en el chat de la reunión.
- **Máximo de Participantes:** Establezca un límite en el número de usuarios que pueden unirse (use `0` para ilimitado).

![Moodle-12.png](/img/moodle/Moodle-12.png)

### 3. Entender los Ajustes de la Actividad

Al crear una actividad de PlugNmeet, tiene muchas opciones para personalizar la experiencia. Estas se agrupan en secciones:

- **Características de la Sala:** Habilite o deshabilite funciones principales como cámaras web, uso compartido de pantalla y grabación.
- **Características del Chat:** Controle si el chat está habilitado y si se permiten las cargas de archivos.
- **Bloc de Notas Compartido y Pizarra:** Habilite o deshabilite estas herramientas colaborativas.
- **Ajustes de Bloqueo Predeterminados:** Configure qué funciones están bloqueadas por defecto para los asistentes cuando se unen (p. ej., micrófono, chat). Esto es útil para reuniones de tipo conferencia.
- **Ajustes Específicos de Moodle:** También puede configurar ajustes estándar de Moodle como **Calificación**, **Restringir acceso** y **Finalización de la actividad** para controlar cómo se integra la videoconferencia con el libro de calificaciones y el progreso del estudiante de su curso.

![Moodle-15.png](/img/moodle/Moodle-15.png)

### 4. Guardar y Unirse

- Una vez que haya configurado todos los ajustes, haga clic en **Guardar y mostrar**.
- Usted y sus estudiantes ahora pueden entrar a la reunión haciendo clic en el botón **Unirse a la Sesión**.

![Moodle-27.png](/img/moodle/Moodle-27.png)

---

## Parte 3: Ajustes Globales y Avanzados (Opcional)

Como administrador, puede configurar ajustes globales que se aplican a todas las actividades de PlugNmeet.

- **Ubicación:** Navegue a **Administración del sitio > Plugins > Módulos de actividad > plugNmeet**.

### Personalización del Diseño

- En el área de configuración, haga clic en la pestaña **Personalización del Diseño**.
- Aquí puede cambiar el logotipo, el fondo y todos los colores primarios y secundarios para que coincidan con la marca de su escuela u organización.

![Moodle-designcust.png](/img/moodle/Moodle-designcust.png)

### Ajustes de la Versión del Cliente

- En el área de configuración principal, puede elegir cómo se carga el cliente.
- **Remoto (Predeterminado):** El cliente se actualiza automáticamente cuando actualiza el plugin. Esto se recomienda para la mayoría de los usuarios.
- **Local:** Le permite usar una versión del cliente alojada a medida si tiene modificaciones específicas.

![Moodle-client-version.png](/img/moodle/Moodle-client-version.png)

---

## Preguntas Comunes y Solución de Problemas

**¿Por qué mis estudiantes ven un error de 'API no válida' u otros errores?**
Este es el problema más común. Significa que todavía está utilizando las credenciales de demostración predeterminadas en la configuración principal del plugin. Debe reemplazarlas con los detalles de la API de su propio servidor autoalojado o de PlugNmeet Cloud. El servidor de demostración es solo para pruebas temporales.

**¿Cómo encuentro la configuración principal del plugin después de la instalación?**
Como administrador de Moodle, puede encontrar la configuración global en **Administración del sitio > Plugins > Módulos de actividad > plugNmeet**.
