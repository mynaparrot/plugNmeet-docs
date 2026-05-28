---
title: Guía del Moderador | Cómo Organizar y Gestionar una Reunión de plugNmeet
description: Una guía completa para moderadores sobre cómo gestionar reuniones, participantes, grabaciones y usar funciones avanzadas como salas de grupos, encuestas y uso compartido de pantalla.
keywords: [moderador, anfitrión, gestionar reunión, salas de grupos, encuestas, grabación, compartir pantalla, gestión de usuarios]
sidebar_position: 2
sidebar_label: Guía del Moderador
---

# Guía del Moderador: Cómo Organizar y Gestionar una Reunión

Le damos la bienvenida a la Guía del Moderador. Este documento ofrece una descripción detallada de todas las funciones y controles disponibles para usted como anfitrión o moderador de una reunión.

El moderador tiene el control total de la sesión, lo que incluye la gestión de los participantes, el uso de herramientas de presentación y la configuración de la sala. Esta guía ha sido diseñada para ayudarle a localizar rápidamente la función que necesite.

---

## Primeros Pasos: Acceso a la Sala y Configuración de Audio

Al entrar por primera vez a una sala de PlugNmeet, se le solicitará que elija cómo desea unirse a la sesión de audio. Este es el paso inicial más importante.

![Onboarding-Desktop.jpg](/img/moderator/Onboarding-Desktop.jpg)

-   **Habilitar Micrófono y Cámara:** Seleccione esta opción para hablar y compartir su video durante la reunión. Su navegador le solicitará permiso para acceder a su micrófono y cámara.
-   **Continuar como oyente:** Elija esta opción para unirse sin activar el micrófono ni la cámara. Podrá escuchar todo, pero no podrá intervenir ni compartir video.

**Importante:** Esta elección no es permanente. Si decide **Continuar como oyente**, podrá activar su micrófono y cámara más tarde desde la barra de control principal.

---
 
## Sección 1: Controles Principales de Multimedia y Grabación

Estos son los controles básicos de audio y video, ubicados en la parte inferior izquierda de la barra de controles.

### Gestión de Micrófono y Audio

- **Silenciar/Activar Sonido:** Si se ha unido con acceso al micrófono y a la cámara, haga clic en el icono de **Micrófono** en la parte inferior izquierda para silenciarse o activar su sonido.
- **Activar Micrófono:** Si ha accedido en modo "Continuar como oyente", el icono mostrará unos auriculares. Haga clic en él para salir del modo de solo escucha y activar su micrófono.
- **Cambiar la Fuente de Audio:** Haga clic en la pequeña flecha situada junto al icono del micrófono para alternar entre los diferentes micrófonos disponibles.

![microphone-pop.webp](/img/moderator/microphone-pop.webp)

### Gestión de Cámara Web y Fondos Virtuales

- **Iniciar/Detener Cámara Web:** Haga clic en el icono de **Cámara Web** para comenzar o detener el uso compartido de su video. También puede alternar la visibilidad de su video en la reunión.
- **Fondos Virtuales:** Al activar su cámara web, aparecerá una ventana de vista previa. Aquí podrá seleccionar un fondo virtual (desenfoque o imagen) o cargar su propia imagen (usando el icono "+") antes de hacer clic en **Compartir**.

![share-webcam-pop.webp](/img/moderator/share-webcam-pop.webp)

### Grabación de la Reunión

Plug-N-Meet ofrece dos métodos para grabar la sesión: **Grabación en la Nube** (en el servidor) y **Grabación Local** (en el navegador). Para iniciar cualquiera de ellas, haga clic en el icono **REC** de la barra de control y elija la opción deseada.

![recording.png](/img/moderator/recording.png)

#### Grabación en la Nube (Recomendado)

Es el método más fiable. La grabación se procesa en el servidor, capturando toda la sesión sin depender del rendimiento de su equipo local.

-   **Requisito:** Debe estar instalado el componente `plugnmeet-recorder` en el servidor.
-   **Solución de problemas:** Si aparece el mensaje "No hay grabador disponible", el componente no se está ejecutando.
-   **Funcionamiento:** Seleccione "Grabación en la Nube". El icono REC parpadeará para indicar que se está grabando. Haga clic de nuevo para detener.

    **Nuevas opciones de grabación:**
    Al iniciar una grabación en la nube, ahora tiene opciones adicionales para optimizar el diseño grabado:
    *   **Habilitar el cierre automático del panel de chat**: Si está habilitado, el panel de chat público se ocultará automáticamente después de un período de inactividad. Esto proporciona más espacio en pantalla para cámaras web, pantallas compartidas o presentaciones en la grabación final.
    *   **Duración después del último mensaje (en minutos)**: Especifique la duración de la inactividad (en minutos) después de la cual el panel de chat se cerrará automáticamente.

    Estas opciones aseguran que sus grabaciones sean limpias y se centren en el contenido principal, especialmente útil para la transmisión RTMP donde el espacio en pantalla es crucial. Nuestra filosofía de grabación asegura que lo que ve es lo que se graba, por lo que controlar la visibilidad del panel de chat impacta directamente en el video final.

#### Grabación Local (En el Navegador)

Este método utiliza el navegador para guardar la reunión directamente en su ordenador. **Solo es compatible con Google Chrome**.

> **Importante:** Es una función avanzada. Para obtener los mejores resultados, siga estas instrucciones atentamente.

Para capturar todo el audio de la sesión, la grabación debe realizarla un segundo usuario "virtual".

**Instrucciones paso a paso:**

1.  **Abra una nueva ventana de Chrome** (no una pestaña).
2.  En la nueva ventana, **acceda a la misma reunión con una cuenta diferente** que tenga permisos de moderador. Ahora tendrá dos sesiones suyas dentro de la reunión.
3.  En esta segunda ventana, haga clic en el icono **REC** y elija **Grabación Local**.
4.  En el aviso de Chrome, seleccione la pestaña de su sesión original.
5.  **Paso Crucial:** En la parte inferior de la ventana, marque la casilla **"Compartir el audio de la pestaña"**. Sin esto, no se grabará el sonido.

**Método Alternativo (solo su micrófono):**

Si solo necesita grabar su micrófono junto con el video principal, puede hacerlo sin necesidad de un segundo usuario. Debe **compartir su micrófono primero** y *luego* iniciar la grabación. Si comienza la grabación antes de compartir su micrófono, su propio audio no estará incluido.

---

## Sección 2: Herramientas de Presentación y Colaboración

Estas herramientas le permiten exponer contenido y colaborar con los asistentes.

### Compartir Pantalla

- Haga clic en el icono de **Compartir Pantalla** en la barra de control principal.
- Su navegador le solicitará que elija si desea compartir toda su pantalla, una ventana de aplicación específica o una pestaña del navegador.
- Para dejar de compartir, haga clic de nuevo en el icono de **Compartir Pantalla**.

![share-screen.webp](/img/moderator/share-screen.webp)

### Uso de la Pizarra Interactiva

La pizarra es una herramienta potente para la colaboración en tiempo real, basada en Excalidraw. Para abrirla, haga clic en el icono de **Pizarra** en la barra de control principal.

![white-board.webp](/img/moderator/white-board.png)

#### Herramientas de Dibujo y Anotación
La barra de herramientas ofrece un amplio conjunto de opciones para dibujar y realizar lluvias de ideas:
- Utilice la **herramienta de lápiz** para realizar trazos a mano alzada.
- Añada **formas**, **flechas** y **texto** para crear diagramas.
- Modifique **colores**, **estilos de trazo** y más.
- Puede **exportar** todo el lienzo de la pizarra como un archivo PNG o SVG en cualquier momento.

#### Añadir Contenido a la Pizarra
Existen dos métodos distintos para añadir contenido a la pizarra: uno para imágenes y otro para documentos de oficina.

**1. Añadir Imágenes**
Puede incorporar imágenes (como JPG o PNG) a la pizarra de varias maneras sencillas:
- **Arrastrar y Soltar:** Simplemente arrastre un archivo de imagen desde su ordenador y suéltelo directamente sobre el lienzo de la pizarra.
- **Copiar y Pegar:** Copie una imagen (de un sitio web o de un archivo local) y péguela en la pizarra pulsando `Ctrl+V` (o `Cmd+V` en Mac).
- **Icono de la Barra de Herramientas:** Haga clic en el icono de **Imagen** en la barra de herramientas de la pizarra para abrir el selector de archivos.

![upload-images.webp](/img/moderator/upload-images.webp)

**2. Añadir Archivos de Ofimática y PDF**
Para presentar documentos como PDF, archivos de Word o presentaciones de PowerPoint, debe utilizar el cargador de archivos específico.
- Haga clic en el icono de **Archivos** en la barra de herramientas de la pizarra.
- Se abrirá un panel donde podrá cargar sus documentos.
- Una vez cargado, el archivo aparecerá en el listado. Selecciónelo para mostrarlo en la pizarra.

![upload-files.webp](/img/moderator/upload-files.webp)

:::tip Nota
El cargador de "Archivos" no admite imágenes. Está destinado exclusivamente a documentos de ofimática y PDF.
:::

### Uso del Bloc de Notas Compartido

- **Activar/Ocultar:** Abra el menú **Más Opciones** (...) en la barra de control y seleccione **Habilitar bloc de notas compartido**.
- El bloc de notas compartido permite que todos los participantes escriban y editen texto de forma conjunta y en tiempo real. Puede aplicar formato al texto e importar o exportar el contenido.

![shared-notepad.webp](/img/moderator/shared-notepad.webp)

### Uso del Asistente de IA

- **Activación de la IA:** Abra el menú **Más Opciones** (...) y seleccione **Herramientas de IA**.
- **Configuración de IA:** En la ventana emergente de **Configuración de IA de Insights**, podrá habilitar o deshabilitar el asistente de IA y decidir si estará disponible para todos los participantes o solo para usuarios específicos.

![ai-tools.webp](/img/moderator/ai-tools.webp)

- **Mostrar/Ocultar:** Haga clic en el icono de **Chat de IA** en la barra de control para mostrarlo u ocultarlo.
- **Enviar Mensaje:** Puede interactuar con el asistente de IA enviando mensajes y recibiendo respuestas.

![ai-chat-widget.webp](/img/moderator/ai-chat-widget.webp)

- **Resumen de la reunión mediante IA:** Utilice esta función para obtener un resumen de la conversación, identificar decisiones clave y generar una lista de tareas pendientes.

![ai-meeting-summerization.webp](/img/moderator/ai-meeting-summerization.webp)

### Transcripción y Traducción
- **Activación:** Acceda al menú **Más Opciones** (...) y seleccione **Transcripción y Traducción**.
- **Configuración:** En la ventana emergente correspondiente, podrá activar o desactivar este servicio.

![transcriptions-pop.webp](/img/moderator/transcriptions-pop.webp)

- **Iniciar Transcripción y Traducción:** Haga clic en el icono de **Transcripción y Traducción** en la barra de control para comenzar el proceso.

![transcriptions-settings-pop.webp](/img/moderator/transcriptions-settings-pop.webp)

- **Historial:** Podrá visualizar la **Transcripción y Traducción en Vivo** en tiempo real. Haga clic en el icono de **Historial** para consultar el registro completo de la sesión.

![transcriptions-history.webp](/img/moderator/transcriptions-history.webp)

**Importante:** Es necesario **Habilitar el Micrófono** para utilizar el servicio de **Transcripción y Traducción**.

### Compartir un Video Externo

Puede compartir un video mediante una URL (como YouTube) o desde un archivo local.

- Acceda al menú **Más Opciones** (...) y seleccione **Reproducir Video Externo**.
- Pegue la URL del video o cargue un archivo (MP4, WebM).
- El video se mostrará a todos los participantes y usted dispondrá de los controles de reproducción.

![external-video-player.webp](/img/moderator/external-video-player.webp)

### Mostrar un Sitio Web Externo (iframe)

Puede mostrar cualquier sitio web que permita su incrustación mediante un iframe.

- En el menú **Más Opciones** (...), seleccione **Compartir Enlace Externo**.
- Introduzca la URL del sitio web que desea mostrar.

![external-link-iframe.webp](/img/moderator/external-link-iframe.webp)

---

## Sección 3: Gestión de Participantes

Estas funciones le permiten supervisar e interactuar con los asistentes.

### Ver la Lista de Participantes

- Haga clic en el icono de **Participantes** para abrir el panel lateral, donde podrá ver a todas las personas presentes en la reunión.

### Uso de la Sala de Espera

Si la sala de espera está activa, deberá autorizar a los asistentes antes de que puedan entrar.

- En el menú **Más Opciones** (...), seleccione **Gestionar Sala de Espera**.
- En el panel correspondiente, verá el listado de usuarios aguardando. Puede **Aceptar** o **Rechazar** sus solicitudes de forma individual o grupal.
- También puede autorizar a los usuarios directamente desde la lista de participantes.

![manage-waiting-room.webp](/img/moderator/manage-waiting-room.webp)

### Envío de Mensajes Privados

- Abra el panel de **Participantes**.
- Haga clic en el menú de tres puntos junto al nombre de un usuario y elija **Enviar mensaje privado**.
- Se abrirá una pestaña de chat privado en el panel de mensajería.

![private-message.webp](/img/moderator/private-message.webp)

### Configuración de Bloqueo de la Sala

Esta función le permite restringir las acciones de los asistentes.

- En el menú **Más Opciones** (...), seleccione **Configuración de Bloqueo de la Reunión**.
- Desde aquí, podrá bloquear micrófonos, cámaras, el uso compartido de pantalla, la pizarra, el bloc de notas o el chat.
- Estas restricciones no afectan a otros moderadores.

![lock-settings.webp](/img/moderator/lock-settings.webp)

### Silenciar a Todos los Usuarios

- Para silenciar a todos los asistentes simultáneamente, acceda al menú **Más Opciones** (...) y elija **Silenciar a todos los usuarios**.
- Esta acción no afectará a otros moderadores.

---

## Sección 4: Funciones Avanzadas de Interacción

Utilice estas herramientas para que su sesión sea más interactiva y dinámica.

### Creación y Gestión de Encuestas

- En el menú **Más Opciones** (...), seleccione **Habilitar Encuestas**. Esto activará la función y aparecerá un icono de **Encuestas** en la barra de control principal.
- Haga clic en **Crear nueva Encuesta**.
- Defina la pregunta y las opciones de respuesta, y luego haga clic en **Crear encuesta**.
- Los asistentes recibirán una notificación para votar. Podrá ver los resultados en tiempo real, finalizar la encuesta y publicar los resultados en el chat público.

![polls.webp](/img/moderator/polls.webp)

### Uso de Salas de Grupos Pequeños (Breakout Rooms)

Divida a los participantes en grupos reducidos y temporales para debates específicos.

- En el menú **Más Opciones** (...), elija **Gestionar Salas de Grupos Pequeños**.
- Configure el número de salas, la duración y asigne a los participantes (manualmente o de forma aleatoria).
- Haga clic en **Iniciar salas de grupos pequeños**.
- Mientras las salas estén activas, podrá enviar mensajes a todos los grupos, unirse a salas específicas o finalizar la sesión grupal.

![breakout-room.webp](/img/moderator/breakout-room.webp)

### Transmisión en Vivo (RTMP)

Puede retransmitir su reunión en directo en plataformas como YouTube o Facebook.

- En el menú **Más Opciones** (...), seleccione **Iniciar Transmisión en Vivo**.
- Introduzca la **Clave de Transmisión** y la **URL de Transmisión** proporcionadas por su plataforma de streaming.
- Haga clic en **Iniciar Transmisión** para comenzar la difusión.

![live-streaming.webp](/img/moderator/live-streaming.webp)

### Entrada de Transmisión en Vivo (Ingress)
##### Retransmita como un profesional: Cómo integrar OBS en su sala de plugNmeet
Configurarlo es sumamente sencillo. Siga estos pasos desde su sala de plugNmeet:

- Haga clic en el menú de tres puntos en la esquina **superior derecha** y seleccione **Configuración**.
- Localice **Entrada de Transmisión en Vivo**: En el panel de ajustes, diríjase a la pestaña **Entrada de Transmisión en Vivo**.
- Seleccione el **Tipo de "Canal" (RTMP o WHIP)**: Elija la tecnología de entrada que prefiera. RTMP es el estándar para transmisiones profesionales, mientras que WHIP es ideal para baja latencia.
- Asigne un **Nombre a su Transmisión**: En el campo **Nombre para Mostrar**, escriba el nombre con el que aparecerá su transmisión en la lista de participantes (por ejemplo, "Cámara Principal"). Si lo deja en blanco, se usará "Emisor" por defecto.
- Genere **su Enlace Privado**: Haga clic en el botón **Generar enlace**. plugNmeet creará una dirección única y segura. Verá dos campos: una URL y un Secreto (o "Clave de Transmisión").

![live-stream-input.webp](/img/moderator/live-stream-input.webp)
![stream-key-host.webp](/img/moderator/stream-key-host.webp)

#### Configuración de su Software de Retransmisión (ej. OBS)

Ahora, configure su software (usaremos OBS como ejemplo) para enviar la señal.

#### Para RTMP (Estándar Universal):

- En los ajustes de OBS, vaya a **Emisión**.
- En **Servicio**, seleccione **Personalizado...**
- Copie la **URL** de plugNmeet y péguela en el campo **Servidor** de OBS.
- Copie el **Secreto** de plugNmeet y péguela en el campo **Clave de Transmisión** de OBS.

![obs-custom.webp](/img/moderator/obs-custom.webp)

#### Para WHIP (Opción Moderna):

- En los ajustes de OBS, vaya a **Emisión**.
- En **Servicio**, seleccione **WHIP**.
- Combine la **URL** y el **Secreto** de plugNmeet en una sola línea. Ejemplo: `https://su-dominio.com/whip/CLAVE_SECRETA`
- Pegue esta dirección combinada en el campo **Servidor** de OBS.
- Deje el campo **Token de Portador** vacío.

![obs-whip.webp](/img/moderator/obs-whip.webp)

Al pulsar **"Iniciar Transmisión"** en OBS, su señal aparecerá como un nuevo participante en la sala de plugNmeet. Para más detalles, consulte nuestra entrada de blog: [Retransmita como un profesional: Cómo integrar OBS en su sala de plugNmeet](https://www.plugnmeet.org/blog/obs-rtmp-whip-ingress)

### Acceso Telefónico SIP/VoIP

:::note[Requiere Configuración del Servidor]
Esta es una función avanzada disponible solo si el administrador del sistema ha configurado la integración SIP en el servidor.
:::

Esta función permite que los participantes se unan al audio de la reunión marcando un número de teléfono estándar.

![sip_1.png](/img/moderator/sip_1.png)

- Haga clic en el menú de tres puntos en la esquina **superior derecha** y seleccione **Configuración**.
- Diríjase a la pestaña de **Acceso telefónico SIP/VoIP**.
- **Habilitar Servicio:** Si el servicio no está activo, haga clic en el botón **Activar** para iniciar la puerta de enlace SIP en esta sesión.

![sip_2.png](/img/moderator/sip_2.png)

- **Ver Información de Acceso Telefónico:** una vez activo, este panel mostrará los **Números de Acceso** y el **PIN** único de la reunión actual.
- **Compartir en el Chat:** Haga clic en **Compartir en el Chat** para publicar automáticamente estos datos en el chat público.

---

## Sección 5: Gestión de la Sesión

Estas acciones controlan la sesión general de la reunión.

### Ajustes de la Aplicación

- En el menú de tres puntos (**superior derecha**), seleccione **Configuración**.
- Aquí podrá cambiar el idioma, gestionar el ahorro de datos, alternar sonidos de notificación y configurar la retransmisión en directo.

![app-settings.webp](/img/moderator/app-settings.webp)

### Finalizar vs. Salir de la Reunión

- **Salir de la Reunión:** Si elige esta opción, usted abandonará la sesión, pero esta continuará activa para los demás participantes.
- **Finalizar Reunión:** Esta opción cerrará la sesión para **todos** los participantes.

![meeting-end.webp](/img/moderator/meeting-end.webp)
