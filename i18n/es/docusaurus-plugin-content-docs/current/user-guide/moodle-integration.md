---
title: Plugin de plugNmeet para Moodle | Añade Videoconferencias a Moodle
description: Cómo instalar y configurar el plugin de plugNmeet para Moodle para añadir una actividad de videoconferencia en vivo a tus cursos y clases online.
keywords: [moodle, plugin, integración moodle, videoconferencia moodle, aula virtual, clase en línea, e-learning, webrtc moodle, videoconferencia código abierto]
sidebar_position: 5
sidebar_label: Integración con Moodle
---

# Cómo Añadir una Actividad de Videoconferencia a Moodle con Plug-N-Meet

Bienvenido a la guía definitiva para integrar **plugNmeet**, una potente plataforma de **videoconferencia para Moodle** de código abierto, en sus cursos. Este documento ofrece un recorrido completo, desde la configuración inicial hasta el uso de funciones avanzadas, garantizando que pueda construir una experiencia de **aula virtual** fluida y atractiva. Con este **software de videoconferencia gratuito**, puede organizar **clases en línea en vivo**, seminarios web y reuniones sin salir de su sitio Moodle.

---

## 1. Introducción: Por qué plugNmeet es la Mejor Opción para Moodle

plugNmeet no es solo otra herramienta de reuniones por video; es una solución completa de **aula virtual** diseñada para una integración profunda con Moodle.

-   **Experiencia Nativa y Fluida**: El aula se carga directamente dentro del diseño de Moodle. Para sus estudiantes y profesores, se siente como una parte natural de su sitio, no como una herramienta de terceros. Esto impulsa la adopción por parte de los usuarios y reduce la confusión.
-   **Código Abierto y Gratuito**: Como una solución líder de **videoconferencia de código abierto**, plugNmeet le otorga control total. Usted gestiona sus datos, su infraestructura y sus costos.
-   **Integración Profunda con Moodle**: plugNmeet se conecta directamente con los sistemas centrales de Moodle, incluyendo el calendario, la finalización de actividades, las calificaciones y los permisos de usuario, para una experiencia verdaderamente integrada.
-   **Conjunto de Funciones Enriquecido**: Está repleto de herramientas diseñadas para la educación, como una pizarra interactiva, salas de grupos pequeños (breakout rooms), encuestas en vivo y análisis avanzados.
-   **Personalización Inigualable**: Adapte la marca de toda el aula virtual —desde logotipos y colores hasta el propio diseño— para que coincida perfectamente con la identidad de su institución.

---

## 2. Instalación y Configuración

Para comenzar con plugNmeet, el administrador de su Moodle debe instalar el plugin y conectarlo a un servidor plugNmeet. Esta sección cubre la instalación y configuración del plugin de Moodle.

### Paso 2.1: Instalar el Plugin de plugNmeet para Moodle

1.  Descargue la última versión del plugin desde el [Directorio de Plugins de Moodle](https://moodle.org/plugins/mod_plugnmeet) o el [repositorio oficial de GitHub](https://github.com/mynaparrot/moodle-mod_plugnmeet).
2.  Inicie sesión en su sitio Moodle como administrador.
3.  Navegue a `Administración del sitio > Extensiones > Instalar complementos`.
4.  Suba el archivo ZIP del plugin y haga clic en **"Instalar complemento desde el archivo ZIP"**.
5.  Moodle verificará el plugin y le pedirá que **"Actualice la base de datos de Moodle ahora"**. Proceda con la actualización.

### Paso 2.2: Configurar la Conexión del Plugin

Este es el paso más crítico. Debe indicar a Moodle cómo conectarse a su servidor plugNmeet. El administrador de su servidor le proporcionará las credenciales necesarias.

1.  Después de la instalación, será dirigido a la página de configuración. También puede encontrarla más tarde en `Administración del sitio > Extensiones > Módulos de Actividad > plugNmeet`.
2.  **Configuración de la API**:
    -   **URL del Servidor**: Ingrese la URL completa de su servidor plugNmeet (p. ej., `https://pnm.sudominio.com`).
    -   **Clave de API**: Ingrese la `PLUGNMEET_API_KEY` proporcionada por el administrador de su servidor.
    -   **Secreto de API**: Ingrese el `PLUGNMEET_SECRET` proporcionado por el administrador de su servidor.
3.  **Método de Carga del Cliente**:
    -   Elija **Remoto (Embebido)**. Esta es la configuración recomendada para una experiencia fluida y de marca blanca donde el aula se carga dentro de su página de Moodle.
    -   `Redirigir` es una alternativa que envía a los usuarios a la interfaz predeterminada del servidor plugNmeet, lo cual no es ideal para la personalización de marca.
4.  **Guardar cambios**. El plugin intentará conectarse al servidor. Si tiene éxito, ¡está listo! Si no, verifique nuevamente sus credenciales y la URL del servidor.

![Captura de pantalla de la página de configuración de administrador de Moodle con campos para credenciales de API y el método de carga del cliente resaltados.](/img/moodle/moodle_1.png)

---

## 3. Crear y Gestionar una Sesión en Vivo

Añadir una videoconferencia a un curso es sencillo.

1.  Navegue al curso de Moodle donde desea añadir la sesión.
2.  Active el **Modo de edición**.
3.  En la sección deseada, haga clic en **Añadir una actividad o un recurso**.
4.  Seleccione **plugNmeet** del selector de actividades. Será llevado a la página de configuración de la actividad.

![añadir actividad plugnmeet](/img/moodle/moodle_2.png)

### Opciones de Configuración Detalladas

Este formulario le da un control granular sobre cada aspecto de la sesión.

-   **Ajustes Generales**:
    -   **Título de la Sala**: El nombre de su sesión (p. ej., "Seminario Semanal de Biología"). Esto es lo que verán los estudiantes.
    -   **Mensaje de Bienvenida**: Un mensaje personalizado que aparece en el chat cuando los usuarios se unen. Ideal para publicar una agenda o instrucciones.
    -   **Máximo de Participantes**: Limite el número de usuarios que pueden unirse a la sesión.

-   **Características de la Sala (Sección Desplegable)**:
    -   **El moderador debe unirse primero**: Impide que los estudiantes inicien la sesión sin la presencia de un profesor.
    -   **Silenciar al entrar**: Una excelente herramienta de gestión del aula para asegurar un inicio de sesión silencioso.
    -   **Permitir Compartir Pantalla / Cámaras Web**: Habilite o deshabilite estas funciones principales. Incluso puede configurarlo como "Solo cámaras web para administradores" para un seminario web de estilo presentación.

-   **Funciones de Grabación**:
    -   **Permitir Grabación**: Interruptor maestro para habilitar/deshabilitar todos los tipos de grabación.
    -   **Permitir Grabación en la Nube**: Habilita la grabación directamente en el servidor. Esta es la opción más común y útil.
    -   **Habilitar Inicio Automático de Grabación en la Nube**: La sesión comenzará a grabar automáticamente tan pronto como se una la primera persona.

-   **Ajustes de Bloqueo Predeterminados**:
    -   Estos ajustes establecen el estado *inicial* de los bloqueos de la sala para los participantes (no para los moderadores).
    -   Para un aula segura por defecto, puede **Bloquear Compartir Pantalla**, **Bloquear Pizarra**, y **Bloquear Bloc de Notas Compartido**. Los participantes tendrán que pedir permiso (levantar la mano) para usar estas herramientas.

-   **Disponibilidad**:
    -   **Disponible desde**: Establece la hora de inicio de la sesión. Esto crea automáticamente un evento en el Calendario de Moodle, convirtiéndolo en una herramienta crucial para programar su **seminario web en Moodle** o clase.
    -   **Fecha límite**: Establece la hora de finalización. Después de esta hora, el botón "Unirse" desaparecerá.

---

## 4. Funciones en la Sala para Clases en Línea Atractivas

plugNmeet está repleto de herramientas para fomentar la interacción y la colaboración.

-   **Pizarra Interactiva**: Una potente herramienta para la colaboración en tiempo real. Puede dibujar, escribir texto, subir y anotar PDFs/presentaciones, y trabajar junto con los estudiantes.
-   **Compartir Pantalla**: Comparta toda su pantalla, una sola ventana de aplicación o una pestaña del navegador con alta resolución.
-   **Salas de Grupos Pequeños (Breakout Rooms)**: Divida su sesión principal en grupos más pequeños y privados para discusiones enfocadas o trabajo en proyectos. Los moderadores pueden moverse entre las salas y transmitir mensajes a todos.
-   **Encuestas**: Cree encuestas sobre la marcha para involucrar a los estudiantes, verificar la comprensión o votar sobre temas. Los resultados se pueden publicar en vivo.
-   **Bloc de Notas Compartido**: Un editor de texto colaborativo simple y en tiempo real para tomar notas compartidas.
-   **Funciones Impulsadas por IA**: Si está habilitado en el servidor, puede acceder a:
    -   **Transcripción y Traducción en Vivo**: Obtenga una transcripción en tiempo real de la conversación, que los usuarios pueden traducir a su idioma preferido.
    -   **Resumen de la Reunión con IA**: Genere y descargue automáticamente un resumen de los puntos clave de la reunión.

---

## 5. Análisis Avanzado, Asistencia, y Seguimiento de Finalización

La integración de plugNmeet con Moodle proporciona información inigualable sobre la participación de los estudiantes.

### Informes de Asistencia Acumulada

A diferencia de las herramientas que solo informan sobre una única sesión, plugNmeet agrega datos de *todas* las sesiones dentro de una sola actividad de Moodle.

-   **Para Profesores**: Acceda al informe de **Asistencia** desde la página de la actividad para ver un resumen de la participación total de cada estudiante. Esto incluye el tiempo total de asistencia, si levantaron la mano, enviaron mensajes de chat, etc.
-   **Para Estudiantes**: Los estudiantes tienen su propio panel de autoservicio donde pueden ver su estado de asistencia y seguir su propia participación en comparación con los requisitos de la actividad.

![Captura de pantalla del informe de asistencia del profesor, mostrando una lista de estudiantes con su estado y métricas de participación.](/img/moodle/moodle_3.png)
![Captura de pantalla del informe de asistencia de los estudiantes, mostrando sus métricas de participación.](/img/moodle/moodle_4.png)

### Finalización de Actividad Avanzada

Esta es una de las características más potentes para las **aulas virtuales de Moodle**. Puede establecer reglas de finalización automatizadas y muy específicas basadas en la participación activa.

1.  En la configuración de la actividad, vaya a la sección **Condiciones de finalización de la actividad**.
2.  Seleccione **Añadir requisitos**.
3.  Marque las casillas de los criterios que desea aplicar. Ejemplos:
    -   Requerir que los estudiantes asistan por un total acumulado de **45 minutos**.
    -   Requerir que los estudiantes **envíen al menos un mensaje de chat**.
    -   Requerir que los estudiantes **activen su cámara web** al menos una vez.

Este sistema va más allá de la visualización pasiva y fomenta una participación activa y medible.

![Captura de pantalla de la configuración de finalización de la actividad, con reglas personalizadas de plugNmeet como "completionminutes" y "completionchatmessages" marcadas.](/img/moodle/moodle_5.png)

---

## 6. Monitorización de Sesiones en Tiempo Real

### Panel de Control en Vivo Dentro de la Actividad

Una vez que una sesión está activa, los profesores y moderadores acceden a un panel de control en tiempo real directamente en la página de la actividad de Moodle. Esta potente herramienta proporciona una visión general instantánea del estado de la sesión y la participación de los asistentes. Puede ver al instante:

*   **Lista de Asistentes en Vivo**: Un listado de todos los usuarios presentes en la sesión.
*   **Estado de Actividad**: Vea quién tiene su cámara web o micrófono activado.
*   **Resumen de la Sesión**: Un compendio de métricas clave, que incluye:
    *   **ID de la Sala**: El identificador único de la sesión.
    *   **Estado de la Grabación**: Indica si la sesión se está grabando en ese momento.
    *   **Número de Asistentes**: El total de usuarios en la sala.
    *   **Medios Activos**: El número total de cámaras web, micrófonos y pantallas compartidas activas.
    *   **Hora de Inicio**: Cuándo comenzó la sesión.

Estos datos en vivo permiten a los moderadores gestionar el **aula virtual** de manera eficaz sin necesidad de cambiar constantemente de ventana.

![Captura de pantalla de las sesiones activas en vivo con detalles de los participantes.](/img/moodle/moodle_7.png)

### Informe de Sesiones Activas en Todo el Sitio (Para Administradores)

Para los administradores, plugNmeet ofrece un informe en tiempo real de todas las sesiones activas en la totalidad del sitio Moodle. Esta es una herramienta fundamental para supervisar el uso de la plataforma de **videoconferencia para Moodle**.

-   **Cómo Acceder**: Un administrador puede añadir un enlace personalizado a su panel de administración o simplemente navegar a `https://susitio.moodle.com/mod/plugnmeet/index.php`.
-   **Qué Muestra**: El informe presenta una lista de todas las salas en funcionamiento, mostrando el título de la sala, el curso al que pertenece, el número de participantes y la duración de la sesión. Esto permite a los administradores evaluar de un vistazo cómo se está utilizando el sistema de **clases en línea**.

![Captura de pantalla del Informe de Salas Activas, mostrando una tabla de sesiones en vivo con el número de participantes.](/img/moodle/moodle_6.png)

---

## 7. Gestión de Grabaciones y Archivos Post-Sesión

Todos los archivos generados durante sus sesiones se organizan de forma ordenada y son accesibles directamente desde la página de la actividad de Moodle.

-   **Pestaña de Grabaciones**: Aquí puede encontrar todas las grabaciones en la nube. Los profesores pueden:
    -   Reproducir la grabación.
    -   Controlar la visibilidad (mostrar/ocultar a los estudiantes).
    -   Descargar el archivo de la grabación.
    -   Eliminar la grabación.
-   **Pestaña de Archivos (Artifacts)**: Esta pestaña contiene todos los demás archivos generados en la sesión, regidos por los permisos de Moodle. Esto incluye:
    -   Resúmenes de la reunión generados por IA.
    -   Archivos de transcripción (p. ej., VTT, SRT).
    -   Informes de análisis detallados por sesión en formato JSON.

![Captura de pantalla de las Grabaciones Activas.](/img/moodle/moodle_8.png)

![Captura de pantalla de los Archivos.](/img/moodle/moodle_9.png)

![Captura de pantalla de los Análisis.](/img/moodle/moodle_10.png)

---

## 8. Seguridad y Privacidad

plugNmeet está diseñado pensando en la seguridad para las instituciones educativas.

-   **Permisos Basados en Roles**: El plugin respeta los roles de Moodle. Por ejemplo, solo los usuarios con la capacidad `mod/plugnmeet:viewrecordings` pueden ver la pestaña de grabaciones. El Informe de Salas Activas también está protegido por una capacidad específica (`mod/plugnmeet:viewactiveroomsreport`).
-   **Seguro por Defecto**: Utilice los **Ajustes de Bloqueo Predeterminados** en su actividad para crear un entorno controlado donde los estudiantes deben solicitar permiso para compartir su pantalla o pizarra.
-   **Cifrado de Extremo a Extremo (E2EE)**: Para una máxima seguridad, puede habilitar el E2EE para sus sesiones.
-   **Control de Acceso de Invitados**: El acceso de invitados se puede deshabilitar globalmente desde la configuración de administrador, y el enlace de invitado de cada sesión tiene un tiempo de caducidad configurable.

Aquí concluye la guía detallada del **plugin de plugNmeet para Moodle**. Ahora está listo para construir una experiencia de **videoconferencia en Moodle** segura, atractiva y totalmente personalizada para sus usuarios.
