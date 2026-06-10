---
title: Plugin de plugNmeet para Moodle | Añade Videoconferencias a Moodle
description: Cómo instalar y configurar el plugin de plugNmeet para Moodle para añadir una actividad de videoconferencia en vivo a tus cursos y clases online.
keywords: [moodle, plugin, integración moodle, videoconferencia moodle, aula virtual, clase en línea, e-learning, webrtc moodle, videoconferencia código abierto]
sidebar_position: 5
sidebar_label: Integración con Moodle
---

# Cómo Añadir una Actividad de Videoconferencia a Moodle con Plug-N-Meet

Bienvenido a la guía definitiva para integrar **plugNmeet**, una potente plataforma de **videoconferencia Moodle** de código abierto, en sus cursos Moodle. Este documento proporciona un recorrido exhaustivo, desde la configuración inicial hasta el aprovechamiento de funciones avanzadas, asegurando que pueda construir una experiencia de **aula virtual** fluida y atractiva. Con este **software de videoconferencia gratuito**, puede organizar **clases en línea en vivo**, seminarios web y reuniones sin salir de su sitio Moodle.

---

## 1. Introducción: Por qué plugNmeet es la Mejor Opción para Moodle

plugNmeet no es solo otra herramienta de videoconferencia; es una solución completa de **aula virtual** construida para una profunda integración con Moodle.

-   **Experiencia Nativa sin Interrupciones**: El aula se carga directamente dentro de su diseño de Moodle. Para sus estudiantes y profesores, se siente como una parte natural de su sitio, no una herramienta de terceros. Esto impulsa la adopción por parte del usuario y reduce la confusión.
-   **Código Abierto y Gratuito**: Como una solución líder de **videoconferencia de código abierto**, plugNmeet le otorga la propiedad completa. Usted controla sus datos, su infraestructura y sus costos.
-   **Profunda Integración con Moodle**: plugNmeet se conecta directamente a los sistemas centrales de Moodle, incluyendo el calendario, la finalización de actividades, la calificación y los permisos de usuario, para una experiencia verdaderamente integrada.
-   **Conjunto de Funciones Enriquecido**: Está repleto de herramientas diseñadas para la educación, incluyendo una pizarra interactiva, salas de grupos pequeños, encuestas en vivo y análisis avanzados.
-   **Personalización Inigualable**: Personalice toda el aula virtual —desde logotipos y colores hasta el propio diseño— para que coincida perfectamente con la identidad de su institución.

---

## 2. Instalación y Configuración

Para empezar con plugNmeet, su administrador de Moodle debe instalar el plugin y conectarlo a un servidor plugNmeet. Esta sección cubre la instalación y configuración del plugin de Moodle en sí.

### Paso 2.1: Instalar el Plugin plugNmeet Moodle

1.  Descargue la última versión del plugin desde el [Directorio de Plugins de Moodle](https://moodle.org/plugins/mod_plugnmeet) o el [repositorio oficial de GitHub](https://github.com/mynaparrot/moodle-mod_plugnmeet).
2.  Inicie sesión en su sitio Moodle como administrador.
3.  Navegue a `Administración del sitio > Plugins > Instalar plugins`.
4.  Suba el archivo ZIP del plugin y haga clic en **"Instalar plugin desde el archivo ZIP"**.
5.  Moodle verificará el plugin y le pedirá que **"Actualice la base de datos de Moodle ahora"**. Proceda con la actualización.

### Paso 2.2: Configurar la Conexión del Plugin

Este es el paso más crítico. Necesita indicarle a Moodle cómo conectarse a su servidor plugNmeet. Su administrador de servidor le proporcionará las credenciales necesarias.

1.  Después de la instalación, será dirigido a la página de configuración. También puede encontrarla más tarde en `Administración del sitio > Plugins > plugNmeet`.
2.  **Configuración de la API**:
    -   **URL del Servidor**: Introduzca la URL completa de su servidor plugNmeet (por ejemplo, `https://pnm.sudominio.com`).
    -   **Clave API**: Introduzca la `PLUGNMEET_API_KEY` proporcionada por su administrador de servidor.
    -   **Secreto API**: Introduzca el `PLUGNMEET_SECRET` proporcionado por su administrador de servidor.
3.  **Método de Carga del Cliente**:
    -   Elija **Remoto (Incrustado)**. Esta es la configuración recomendada para una experiencia fluida y de marca blanca donde el aula se carga dentro de su página de Moodle.
    -   `Redireccionar` es una opción de respaldo que envía a los usuarios a la interfaz predeterminada del servidor plugNmeet, lo cual no es ideal para la marca.
4.  **Guardar cambios**. El plugin intentará conectarse al servidor. Si tiene éxito, ¡está listo para empezar! Si no, verifique sus credenciales y la URL del servidor.

![Captura de pantalla de la página de configuración de administración de Moodle con campos para las credenciales de la API y el método de carga del cliente resaltados.](/img/moodle/moodle_1.png)

---

## 3. Creación y Gestión de una Sesión en Vivo

Añadir una videoconferencia a un curso es sencillo.

1.  Navegue al curso de Moodle donde desea añadir la sesión.
2.  Active el **Modo de edición**.
3.  En la sección deseada, haga clic en **Añadir una actividad o recurso**.
4.  Seleccione **plugNmeet** del selector de actividades. Será dirigido a la página de configuración de la actividad.

![añadir actividad plugnmeet](/img/moodle/moodle_2.png)

### Opciones de Configuración Detalladas

Este formulario le otorga un control granular sobre cada aspecto de la sesión.

-   **Configuración General**:
    -   **Título de la Sala**: El nombre de su sesión (por ejemplo, "Seminario Semanal de Biología"). Esto es lo que verán los estudiantes.
    -   **Mensaje de Bienvenida**: Un mensaje personalizado que aparece en el chat cuando los usuarios se unen. Ideal para publicar una agenda o instrucciones.
    -   **Máximo de Participantes**: Limita el número de usuarios que pueden unirse a la sesión.

-   **Funciones de la Sala (Sección Colapsable)**:
    -   **El moderador debe unirse primero**: Evita que los estudiantes inicien la sesión sin un profesor presente.
    -   **Silenciar al inicio**: Una excelente herramienta de gestión del aula para asegurar un comienzo tranquilo de la sesión.
    -   **Permitir Compartir Pantalla / Cámaras Web**: Habilite o deshabilite estas funciones principales. Incluso puede configurarlo como "Solo cámaras web del administrador" para un seminario web estilo presentación.

-   **Funciones de Grabación**:
    -   **Permitir Grabación**: Interruptor maestro para habilitar/deshabilitar todos los tipos de grabación.
    -   **Permitir Grabación en la Nube**: Habilita la grabación directamente en el servidor. Esta es la opción más común y útil.
    -   **Habilitar Grabación en la Nube de Inicio Automático**: La sesión comenzará a grabarse automáticamente tan pronto como se una la primera persona.

-   **Configuración de Bloqueo Predeterminada**:
    -   Estas configuraciones establecen el estado *inicial* de los bloqueos de la sala para los participantes (no para los moderadores).
    -   Para un aula segura por defecto, puede **Bloquear Compartir Pantalla**, **Bloquear Pizarra** y **Bloquear Bloc de Notas Compartido**. Los participantes tendrán que pedir permiso (levantar la mano) para usar estas herramientas.

-   **Disponibilidad**:
    -   **Disponible desde**: Establece la hora de inicio de la sesión. Esto crea automáticamente un evento en el Calendario de Moodle, convirtiéndolo en una herramienta crucial para programar su **seminario web o clase de Moodle**.
    -   **Fecha límite**: Establece la hora de finalización. Después de esta hora, el botón "Unirse" desaparecerá.

---

## 4. Funciones en la Sala para Clases en Línea Atractivas

plugNmeet está repleto de herramientas para fomentar la interacción y la colaboración.

-   **Pizarra Interactiva**: Una potente herramienta para la colaboración en tiempo real. Puede dibujar, escribir texto, subir y anotar PDFs/presentaciones, y trabajar junto con los estudiantes.
-   **Compartir Pantalla**: Comparta su pantalla completa, una sola ventana de aplicación o una pestaña del navegador con resolución de alta calidad.
-   **Salas de Grupos Pequeños**: Divida su sesión principal en grupos más pequeños y privados para discusiones enfocadas o trabajo en proyectos. Los moderadores pueden moverse entre salas y transmitir mensajes a todos.
-   **Encuestas**: Cree encuestas sobre la marcha para involucrar a los estudiantes, verificar la comprensión o votar sobre temas. Los resultados se pueden publicar en vivo.
-   **Bloc de Notas Compartido**: Un editor de texto colaborativo simple y en tiempo real para tomar notas compartidas.
-   **Funciones Impulsadas por IA**: Si están habilitadas en el servidor, puede acceder a:
    -   **Transcripción y Traducción en Vivo**: Obtenga una transcripción en tiempo real de la conversación, que los usuarios pueden traducir a su idioma preferido.
    -   **Resumen de Reuniones con IA**: Genere y descargue automáticamente un resumen de los puntos clave de la reunión.

---

## 5. Análisis Avanzados, Asistencia y Seguimiento de Finalización

La integración de plugNmeet con Moodle proporciona información inigualable sobre la participación de los estudiantes.

### Informe de Asistencia Acumulativa

A diferencia de las herramientas que solo informan sobre una sola sesión, plugNmeet agrega datos de *todas* las sesiones dentro de una única actividad de Moodle.

-   **Para Profesores**: Acceda al informe de **Asistencia** desde la página de la actividad para ver un resumen de la participación total de cada estudiante. Esto incluye el tiempo total asistido, si levantaron la mano, enviaron mensajes de chat, etc.
-   **Para Estudiantes**: Los estudiantes tienen su propio panel de control de autoservicio donde pueden ver su estado de asistencia y seguir su propio compromiso con los requisitos de la actividad.

![Captura de pantalla del informe de asistencia del profesor, que muestra una lista de estudiantes con su estado y métricas de participación.](/img/moodle/moodle_3.png)
![Captura de pantalla del informe de asistencia del estudiante, que muestra sus métricas de participación.](/img/moodle/moodle_4.png)

### Finalización de Actividad Avanzada

Esta es una de las características más potentes para las **aulas virtuales de Moodle**. Puede establecer reglas de finalización altamente específicas y automatizadas basadas en la participación activa.

1.  En la configuración de la actividad, vaya a la sección **Finalización de actividad**.
2.  Establezca el **Seguimiento de finalización** en "Mostrar la actividad como completada cuando se cumplan las condiciones".
3.  Marque las casillas de los criterios que desea aplicar. Ejemplos:
    -   Requerir que los estudiantes asistan durante un total acumulado de **45 minutos**.
    -   Requerir que los estudiantes **envíen al menos un mensaje de chat**.
    -   Requerir que los estudiantes **activen su cámara web** al menos una vez.

Este sistema va más allá de la visualización pasiva y fomenta un compromiso activo y medible.

![Captura de pantalla de la configuración de finalización de actividad, con reglas personalizadas de plugNmeet como "completionminutes" y "completionchatmessages" marcadas.](/img/moodle/moodle_5.png)

---

## 6. Monitoreo e Interacción de Sesiones en Tiempo Real

### Panel de Control en Vivo en la Actividad

Una vez que una sesión está en vivo, los profesores y moderadores obtienen acceso a un panel de control en tiempo real directamente en la página de actividad de Moodle. Esta potente herramienta proporciona una visión general del estado de la sesión y permite la interacción directa. Puede ver instantáneamente:

*   **Lista de Participantes en Vivo**: Una lista de todos los usuarios actualmente en la sesión.
*   **Estado de la Actividad**: Vea quién tiene su cámara web o micrófono activo.
*   **Resumen de la Sesión**: Un resumen de las métricas clave, incluyendo el recuento de participantes, el estado de la grabación y los medios activos.

Estos datos en vivo permiten a los moderadores gestionar el aula de manera efectiva sin tener que cambiar constantemente entre ventanas.

![Captura de pantalla de las sesiones en vivo activas con detalles de los participantes.](/img/moodle/moodle_7.png)

### Subir a la Pizarra desde Moodle

Mientras una sesión está en curso, los administradores y profesores pueden subir archivos directamente a la pizarra desde el repositorio de archivos de Moodle. Esta función agiliza el proceso de compartir materiales del curso sin salir del aula virtual.

1.  Desde el panel de control en vivo en la página de actividad de Moodle, haga clic en el nuevo botón **"Subir a la Pizarra"**.
2.  Esto abrirá el conocido selector de archivos de Moodle.
3.  Puede seleccionar un archivo existente de los archivos de su curso.
4.  Una vez seleccionado, el archivo se añade automáticamente a la lista de archivos de la pizarra dentro de la sesión en vivo, listo para que lo presente a la clase.

![Captura de pantalla del selector de archivos de Moodle que se utiliza para subir un archivo a la pizarra.](/img/moodle/moodle_11.png)

### Informe de Sesiones Activas en Todo el Sitio (Extracción de Datos del Administrador)

Para los administradores, plugNmeet ofrece una "extracción de datos en vivo" en tiempo real de todas las sesiones activas en todo el sitio de Moodle. Esta es una herramienta esencial para monitorear la actividad en todo el sitio.

-   **Cómo Acceder**: Un administrador puede añadir un enlace personalizado a su panel de administración o simplemente navegar a `https://susitiomoodle.com/mod/plugnmeet/index.php`.
-   **Lo que Muestra**: El informe muestra una lista de todas las salas actualmente en funcionamiento, mostrando el título de la sala, el curso, el número de participantes y la duración de la sesión. Esto permite a los administradores ver de un vistazo cómo se está utilizando el sistema de **videoconferencia de Moodle**.

![Captura de pantalla del Informe de Salas Activas, que muestra una tabla de sesiones en vivo con recuentos de participantes.](/img/moodle/moodle_6.png)

---

## 7. Gestión de Grabaciones y Artefactos Post-Sesión

Todos los archivos generados durante sus sesiones están perfectamente organizados y accesibles directamente desde la página de actividad de Moodle.

### Pestaña Grabaciones
Aquí puede encontrar todas las grabaciones en la nube. Los profesores pueden:
-   Reproducir la grabación.
-   Controlar la visibilidad (mostrar/ocultar a los estudiantes).
-   Descargar el archivo de grabación.
-   Eliminar la grabación.

![Captura de pantalla de las Grabaciones Activas.](/img/moodle/moodle_8.png)

### Fusionar Múltiples Grabaciones

Si una sesión se grabó en varios segmentos, ahora puede fusionarlos fácilmente en un solo video continuo directamente desde la interfaz de Moodle.

1.  Navegue a la pestaña **Grabaciones** de la actividad plugNmeet.
2.  Verá casillas de verificación junto a cada grabación. Seleccione las grabaciones en el orden específico en que desea que aparezcan en el video final.
3.  Haga clic en el botón **"Fusionar Grabaciones"** que aparece en la parte inferior de la lista.
4.  Una ventana emergente de confirmación mostrará la lista de IDs de grabación que está a punto de fusionar, verificando la secuencia de su selección.
5.  Confirme la acción para iniciar el proceso de fusión. La nueva grabación fusionada aparecerá en la lista una vez que esté lista.

![Captura de pantalla de la lista de grabaciones de Moodle con casillas de verificación y un botón de fusión, que muestra la ventana emergente de confirmación de fusión.](/img/moodle/moodle_12.png)

### Pestaña Artefactos
Esta pestaña contiene todos los demás archivos generados por la sesión, regidos por los permisos de Moodle. Esto incluye:
-   Resúmenes de reuniones generados por IA.
-   Archivos de transcripción (por ejemplo, VTT, SRT).
-   Informes detallados de análisis por sesión en formato JSON.

![Captura de pantalla de los Artefactos.](/img/moodle/moodle_9.png)

![Captura de pantalla de los Análisis.](/img/moodle/moodle_10.png)

---

## 8. Seguridad y Privacidad

plugNmeet está diseñado pensando en la seguridad para instituciones educativas.

-   **Permisos Basados en Roles**: El plugin respeta los roles de Moodle. Por ejemplo, solo los usuarios con la capacidad `mod/plugnmeet:viewrecordings` pueden ver la pestaña de grabaciones. El Informe de Salas Activas también está protegido por una capacidad específica (`mod/plugnmeet:viewactiveroomsreport`).
-   **Seguro por Defecto**: Utilice la **Configuración de Bloqueo Predeterminada** en su actividad para crear un entorno controlado donde los estudiantes deben solicitar permiso para compartir su pantalla o pizarra.
-   **Cifrado de Extremo a Extremo (E2EE)**: Para máxima seguridad, puede habilitar E2EE para sus sesiones.
-   **Control de Acceso de Invitados**: El acceso de invitados se puede deshabilitar globalmente desde la configuración de administración, y el enlace de invitado de cada sesión tiene un tiempo de caducidad configurable.

Esto concluye la guía detallada del **plugin plugNmeet Moodle**. Ahora está listo para construir una experiencia de **videoconferencia de Moodle** segura, atractiva y completamente personalizada para sus usuarios.
