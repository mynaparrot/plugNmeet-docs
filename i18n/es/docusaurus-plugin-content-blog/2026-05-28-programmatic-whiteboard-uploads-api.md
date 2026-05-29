---
title: "Inyectando Contenido en Tiempo Real: Guía para Desarrolladores de la Nueva API `uploadWhiteboardFile`"
slug: programmatic-whiteboard-uploads-api
authors: [jibon, simon]
tags: [API, desarrollo, pizarra virtual, integración, automatización, tiempo real, subida de archivos, Moodle, plugin Moodle, videoconferencia, servidor de videollamadas, servidor de videoconferencia]
---

En Plug-N-Meet, nuestro objetivo es ofrecer una plataforma, no solo un producto. Si bien nuestra interfaz de usuario es rica en funciones, el verdadero poder de nuestra arquitectura reside en su diseño "API-first". Hoy, nos complace presentar un nuevo endpoint que brinda a los desarrolladores un control sin precedentes sobre las sesiones en vivo: `/room/uploadWhiteboardFile`.

Esta API permite que su aplicación backend cargue archivos programáticamente directamente en la pizarra de una reunión activa, abriendo la puerta a flujos de trabajo de contenido potentes, fluidos y automatizados. Esta guía le mostrará los casos de uso clave de esta nueva función y cómo puede transformar su integración.

<!--truncate-->

---

### ¿Por qué una Nueva API de Carga? El Poder del Tiempo Real

Puede que esté familiarizado con la opción `preload_file` en nuestra [API de Creación de Salas](/docs/api/room/create). Aunque útil, está diseñada para un propósito diferente: cargar un documento *antes* de que comience una sesión.

El nuevo endpoint `uploadWhiteboardFile` es fundamentalmente diferente. Está diseñado para inyectar contenido en una **sesión en vivo y en curso**. Esta capacidad en tiempo real cambia las reglas del juego para las aplicaciones dinámicas. Cuando su backend llama a esta API, el archivo aparece instantáneamente en la lista de archivos del presentador dentro de la reunión en vivo, listo para ser mostrado.

Exploremos lo que puede construir con esto.

### Caso de Uso 1: Integración Fluida con Almacenamiento en la Nube (Google Drive, Dropbox, etc.)

**El Escenario:** Un usuario de su aplicación desea presentar un archivo almacenado en su Google Drive.

**La Forma Antigua:** El usuario tendría que descargar el archivo de Google Drive a su computadora y luego cargarlo manualmente a través de la interfaz de usuario de Plug-N-Meet. Este es un proceso torpe y de varios pasos.

**La Nueva Forma con la API:**
1.  La interfaz de usuario de su aplicación proporciona un botón: "Presentar desde Google Drive".
2.  Utilizando la API de Google Drive, permite al usuario seleccionar un archivo.
3.  Su servidor backend descarga de forma segura el archivo de Google Drive.
4.  Su backend luego llama inmediatamente a la API `uploadWhiteboardFile`, enviando el archivo directamente a la sesión en vivo de Plug-N-Meet.

**El Resultado:** Una experiencia fluida y profesional. El usuario pasa de seleccionar un archivo en su aplicación a tenerlo listo para presentar en la reunión con un solo clic.

**Consejo Profesional:** Para un flujo de trabajo aún más eficiente, puede usar el parámetro `document_link`. En lugar de descargar el archivo a su servidor primero, puede generar una URL temporal de acceso público para el archivo en el almacenamiento en la nube y pasar ese enlace a la API. El servidor de Plug-N-Meet se encargará de la descarga directamente.

### Caso de Uso 2: Biblioteca Centralizada de Recursos para Empresas y Educación

**El Escenario:** Una empresa quiere asegurarse de que todas las presentaciones de ventas utilicen la última plantilla aprobada, o una universidad quiere proporcionar a los profesores una biblioteca de materiales de curso oficiales.

**La Forma Antigua:** Los presentadores tendrían que buscar y descargar el archivo correcto desde un portal separado o una unidad compartida antes de cada reunión.

**La Nueva Forma con la API:**
1.  Usted construye una "Biblioteca de Recursos" directamente en el panel de control de su aplicación.
2.  Un presentador, ya en una reunión en vivo, puede navegar por esta biblioteca desde la interfaz de su aplicación.
3.  Cuando hacen clic en "Añadir a la Pizarra" en un recurso específico (por ejemplo, `Q3-Sales-Deck.pptx`), su backend recupera el archivo de su almacenamiento centralizado.
4.  Su backend llama a la API `uploadWhiteboardFile` para inyectarlo en la sesión actual del presentador.

**El Resultado:** Perfecta coherencia de marca y acceso sin esfuerzo a materiales actualizados y oficiales, todo gestionado desde una única fuente de verdad.

### Caso de Uso 3: Generación Dinámica de Informes y Análisis sobre la Marcha

**El Escenario:** Un equipo está en una reunión en vivo discutiendo métricas de rendimiento. Se dan cuenta de que necesitan ver un informe específico y actualizado al minuto que aún no existe.

**La Forma Antigua:** Alguien tendría que salir de la reunión, generar el informe, guardarlo y luego cargarlo manualmente. El impulso de la reunión se pierde.

**La Nueva Forma con la API:**
1.  Su aplicación tiene un botón "Generar Informe en Vivo" integrado en su panel de control.
2.  Un usuario en la reunión hace clic en el botón y selecciona los parámetros requeridos.
3.  Su backend genera el informe (por ejemplo, un PDF de un gráfico) sobre la marcha.
4.  Tan pronto como se crea el archivo, su backend llama a la API `uploadWhiteboardFile`.

**El Resultado:** Se genera un informe y se entrega a la reunión en vivo en segundos, lo que permite una toma de decisiones verdaderamente en tiempo real y basada en datos.

### Caso de Uso 4: Integración con Moodle - Uniendo Contenido y Aula

**El Escenario:** Nuestro [Plugin oficial de Plug-N-Meet para Moodle](/docs/user-guide/moodle-integration) ya aprovecha esta API para crear una experiencia fluida para los educadores. Los profesores pueden gestionar un repositorio central de materiales del curso dentro de Moodle.

**La Nueva Forma con la API:**
1.  Un profesor está impartiendo una clase en vivo utilizando la actividad Plug-N-Meet en Moodle.
2.  Decide que necesita mostrar un PDF o una presentación específica de los archivos de su curso de Moodle.
3.  Desde una interfaz dentro de Moodle (fuera de la ventana de la sesión en vivo), el profesor selecciona el archivo.
4.  El backend de Moodle llama a la API `uploadWhiteboardFile`, enviando instantáneamente el documento seleccionado al aula virtual en vivo.

**El Resultado:** El profesor nunca tiene que salir de su entorno Moodle. Puede inyectar materiales del curso en la sesión en vivo sobre la marcha, creando una experiencia de enseñanza fluida e ininterrumpida. Esto demuestra cómo la API puede unir un sistema de gestión de contenido externo directamente con una sesión en vivo.

---

### Vistazo Técnico Rápido y Consideraciones Importantes

Este endpoint utiliza una solicitud `multipart/form-data`, que requiere un método de autenticación diferente al de nuestras APIs JSON estándar.

#### Autenticación

La `HASH-SIGNATURE` debe generarse utilizando su `API-SECRET` con el valor del encabezado `Room-Id` como cuerpo del mensaje. Esto es diferente de otras APIs donde la firma se genera a partir del cuerpo de la solicitud.

#### Restricciones de Archivo

-   **Tipos de Archivo Compatibles**: Esta API está optimizada para documentos de oficina y presentaciones (`PDF`, `PPT`, `DOC`, etc.). Los archivos de imagen como `JPG` o `PNG` **no** son compatibles y serán rechazados.
-   **Tamaño del Archivo**: El archivo no debe exceder el límite `max_size_whiteboard_file` definido en la configuración de su servidor.

#### Comportamiento del Servidor

-   **Cargas Concurrentes**: El servidor procesa solo una carga a la vez por sala. Si envía una nueva solicitud de carga mientras otra está en curso para la misma sala, recibirá un error `409 Conflict`.
-   **Tiempos de Espera y Procesamiento en Segundo Plano**: La conversión de archivos puede consumir muchos recursos. Si su llamada inicial a la API agota el tiempo de espera, no se preocupe. El servidor continúa procesando el archivo en segundo plano. Una vez completado, el archivo aparecerá en la sala y el bloqueo de carga se liberará.

Para un ejemplo completo de `curl` y descripciones detalladas de los parámetros, consulte la **[Documentación oficial de la API uploadWhiteboardFile](/docs/api/room/uploadWhiteboardFile)**.

### Conclusión: Su Aplicación es Ahora el Copresentador

La API `uploadWhiteboardFile` transforma la pizarra de una simple herramienta controlada por el usuario en un lienzo programable y dinámico. Permite que su aplicación se convierta en un participante activo en la reunión, entregando contenido relevante exactamente cuando se necesita.

Esta función profundiza el potencial de integración, permitiéndole construir flujos de trabajo más inteligentes, más automatizados y altamente profesionales que distinguen a su aplicación.

---
**¿Listo para empezar a construir?**

*   **[Explore la Documentación de la API `uploadWhiteboardFile`](/docs/api/room/uploadWhiteboardFile)**
*   **[Consulte nuestra Referencia Completa de la API](/docs/api/intro)**
*   **[Pruebe nuestra Demostración en Vivo](https://demo.plugnmeet.com/landing.html) para ver la pizarra en acción.**
