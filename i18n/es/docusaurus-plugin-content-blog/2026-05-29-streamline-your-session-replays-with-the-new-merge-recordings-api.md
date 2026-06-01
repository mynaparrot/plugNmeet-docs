---
title: "Optimice sus Repeticiones de Sesión: Presentamos la Nueva API de Fusión de Grabaciones"
slug: merge-recordings-api
authors: [jibon, simon]
tags: [API, desarrollador, grabación, integración, automatización, edición de video, Moodle, caso de uso, plugin videoconferencia Moodle, servidor de videollamadas, servidor de videoconferencia]
---

En Plug-N-Meet, trabajamos constantemente para mejorar la experiencia post-sesión tanto para administradores como para usuarios finales. Un desafío común en eventos de larga duración como seminarios web, clases en línea o sesiones de capacitación de varias partes es la gestión de múltiples segmentos de grabación. Detener e iniciar una grabación suele ser necesario, pero esto deja una colección fragmentada de archivos de video.

Hoy, nos complace resolver este problema con la introducción de la API `/recording/mergeRecordings`, una nueva y potente herramienta diseñada para consolidar múltiples archivos de grabación en un único video sin interrupciones. Esta función es imprescindible para cualquiera que ejecute un **servidor de videoconferencias** autoalojado y busque ofrecer una experiencia pulida y profesional.

<!--truncate-->

---

### El Problema: Grabaciones Fragmentadas

Imagine que está organizando un taller de tres horas en su **servidor de videollamadas**. Pausa la grabación durante un descanso de 15 minutos y luego la reanuda. O quizás tenga que reiniciar una grabación debido a un problema técnico. Al final de la sesión, tiene dos o más archivos de video separados.

Esto crea una experiencia inconexa para cualquiera que vea la repetición. También genera trabajo adicional para los administradores que tienen que descargar, editar y volver a cargar manualmente los archivos para crear un video único y coherente.

### La Solución: La API `mergeRecordings`

La API `mergeRecordings` automatiza todo este proceso. Le permite combinar programáticamente múltiples archivos de grabación de una sesión en un solo video continuo. Los archivos originales se mantienen intactos y se crea una nueva grabación fusionada con su propio `record_id` único.

Este proceso ocurre de forma asíncrona en segundo plano, por lo que no ocupa su sistema. Simplemente realiza la solicitud a la API, y cuando la fusión se completa, su aplicación recibe una notificación de webhook (`recording_proceeded`) con los detalles del nuevo archivo de grabación unificado.

### Caso de Uso Destacado: Fusión Perfecta en Nuestro Plugin de Videoconferencia para Moodle

Esta no es solo una característica teórica, ya está mejorando nuestro [Plugin oficial de Plug-N-Meet para Moodle](/docs/user-guide/moodle-integration#merge-multiple-recordings). Como un plugin líder de **videoconferencia para Moodle**, creemos en proporcionar flujos de trabajo fluidos para los educadores.

**El Escenario:** Un profesor imparte una clase larga y la graba en dos partes. Después de la sesión, ve ambas grabaciones listadas en su actividad de Moodle.

**La Forma Antigua:** El profesor tendría que indicar a los estudiantes que vieran ambos videos en orden, o descargarlos y editarlos manualmente.

**La Nueva Forma con la API:**
1.  El profesor navega a la pestaña "Grabaciones" en la actividad de su curso de Moodle.
2.  Selecciona las grabaciones que desea combinar.
3.  Hace clic en un botón "Fusionar" directamente dentro de la interfaz de Moodle.
4.  El backend de Moodle llama a la API `mergeRecordings`.
5.  Poco tiempo después, un nuevo archivo de grabación único aparece automáticamente en la lista, listo para que los estudiantes lo vean.

**El Resultado:** Un flujo de trabajo increíblemente simple e intuitivo para los educadores. Pueden crear una repetición de sesión pulida y única sin salir de su panel de Moodle, demostrando el poder de esta API para crear funciones fáciles de usar en cualquier **servidor de videoconferencias**.

### Cómo Funciona: Dos Potentes Estrategias de Fusión

La API ofrece dos formas flexibles de combinar sus grabaciones:

1.  **Fusionar por Sesión (`by_session`)**: Este es el método más simple. Proporciona un `room_sid` (el identificador único de una sesión), y la API encuentra automáticamente todos los archivos de grabación asociados con esa sesión y los fusiona en orden cronológico. Incluso puede optar por excluir grabaciones específicas si necesita eliminar un inicio falso o un segmento no deseado.

2.  **Fusionar por IDs (`by_ids`)**: Este método le brinda un control granular. Proporciona una lista explícita de `recording_ids` en el orden exacto en que desea que se fusionen. Esto es perfecto para escenarios más complejos donde podría estar combinando grabaciones de diferentes sesiones en una sola compilación.

### Vistazo Técnico Rápido

-   **Operación Asíncrona**: Este es un trabajo en segundo plano. Su aplicación realiza la llamada a la API y obtiene una confirmación inmediata. El procesamiento real es manejado por una instancia de `plugnmeet-recorder`.
-   **Notificación de Webhook**: Debe tener un endpoint de webhook configurado para recibir el evento `recording_proceeded`. Este evento indicará que el archivo fusionado está listo y proporcionará su nuevo `record_id`.
-   **Los Originales Están Seguros**: El proceso de fusión no es destructivo. Sus archivos de grabación originales nunca se eliminan, lo que le da la libertad de gestionarlos como mejor le parezca.

Para ejemplos detallados de solicitud y respuesta, consulte la [Documentación oficial de la API `mergeRecordings`](/docs/api/recording/merge-recordings).

### Conclusión: Una Experiencia Más Fluida para Todos

La API `mergeRecordings` cambia las reglas del juego para cualquiera que necesite ofrecer repeticiones de sesión pulidas y profesionales. Al automatizar la consolidación de grabaciones fragmentadas, ahorra tiempo a los administradores, simplifica los flujos de trabajo de postproducción y proporciona una experiencia de visualización perfecta para su audiencia.

Esta función es un ejemplo perfecto de nuestro compromiso de proporcionar una plataforma flexible y basada en API que pueda adaptarse a sus necesidades únicas, haciendo que su **servidor de videollamadas** sea más potente que nunca.

---
**¿Listo para simplificar la gestión de sus grabaciones?**

*   **[Explore la Documentación de la API `mergeRecordings`](/docs/api/recording/merge-recordings)**
*   **[Consulte nuestra Referencia Completa de la API](/docs/api/intro)**
*   **[Obtenga más información sobre nuestra Integración con Moodle](/docs/user-guide/moodle-integration)**
