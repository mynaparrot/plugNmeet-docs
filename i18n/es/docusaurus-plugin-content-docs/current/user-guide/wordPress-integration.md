---
title: Plugin de plugNmeet para WordPress | Añade Videoconferencias a Tu Sitio
description: Cómo instalar y configurar el plugin de plugNmeet para WordPress para añadir videoconferencias seguras y autoalojadas directamente en tu sitio web de WordPress.
keywords: [wordpress, plugin, integración wordpress, videoconferencia wordpress, webrtc wordpress, alternativa a zoom wordpress]
sidebar_position: 4
sidebar_label: Integración con WordPress
---

# Cómo Añadir Videoconferencias a WordPress con el Plugin de Plug-N-Meet

Bienvenido a la guía definitiva para integrar **plugNmeet**, la potente solución de videoconferencia de código abierto, en tu sitio web de WordPress. Este documento proporciona un recorrido completo, desde la instalación hasta el aprovechamiento de las funciones avanzadas, permitiéndote alojar reuniones de video seguras y ricas en funciones directamente desde tu propio dominio. Con plugNmeet, puedes crear una experiencia de reunión virtual fluida que se siente como una parte nativa de tu sitio.

---

## 1. Características Clave de la Integración con WordPress

El plugin de plugNmeet es más que una simple forma de incrustar una videollamada; es una integración profunda que trae potentes herramientas de gestión directamente a tu panel de WordPress.

*   **Integración Fluida con Shortcode:** Incrusta una sala de videoconferencia con todas las funciones en cualquier página o entrada con un simple shortcode de WordPress.
*   **Gestión desde el Backend:** Crea salas, gestiona grabaciones, visualiza análisis y accede a los artefactos de las reuniones sin salir de tu área de administración de WordPress.
*   **Análisis Avanzados Post-Sesión:** Ve más allá de la simple asistencia. Obtén informes detallados sobre la participación de los asistentes, el tiempo de habla y la calidad de la conexión, todo exportable a Excel.
*   **Control Total de Activos:** Accede, descarga y gestiona fácilmente todos los activos de la sala, incluyendo grabaciones, transcripciones de voz y resúmenes de reuniones generados por IA.
*   **Permisos Basados en Roles:** Utiliza los roles de usuario estándar de WordPress para controlar quién puede unirse a las reuniones como moderador y quién puede gestionar las grabaciones.
*   **Amigable para Desarrolladores:** Amplía la funcionalidad del plugin conectándote a eventos de webhook para procesar datos de tus reuniones en tiempo real.

---

## 2. Instalación y Configuración Inicial

Esta sección cubre la instalación del plugin y su conexión a tu servidor de PlugNmeet.

### Paso 2.1: Instalar y Activar el Plugin

1.  Desde tu panel de WordPress, ve a **Plugins > Añadir nuevo**.
2.  En la barra de búsqueda, escribe **plugnmeet**.
3.  Encuentra el plugin oficial de Plug-N-Meet y haz clic en **Instalar ahora**, y luego en **Activar**.

### Paso 2.2: Conectar a Tu Servidor (Ajustes de API)

Este es el paso más importante. El plugin requiere una conexión a un servidor de PlugNmeet que esté funcionando.

1.  Desde tu panel de WordPress, ve al nuevo elemento del menú **Plug-N-Meet** y selecciona **Ajustes**.
2.  Rellena los tres campos: **URL del Servidor**, **Clave de API** y **Secreto de API** con las credenciales de tu servidor autoalojado o de PlugNmeet Cloud.
3.  **Debes reemplazar las credenciales de demostración predeterminadas para que el plugin funcione.**

**Nota:** El plugin incluye credenciales de demostración preconfiguradas para ayudarte a probar sus funciones de inmediato. Este servidor de demostración es un recurso compartido y **no está destinado para uso en producción**, ya que puede ser poco fiable. Para cualquier reunión importante, recomendamos encarecidamente usar tu propio servidor para garantizar una experiencia estable y profesional para ti y tus usuarios.

![Página de ajustes de API para el plugin de videoconferencia de PlugNmeet para WordPress.](/img/wordpress/1.png)

:::warning IMPORTANTE: Actualiza Tus Enlaces Permanentes
Después de guardar tus ajustes por primera vez, **debes** actualizar tus enlaces permanentes de WordPress. Esto asegura que los enlaces directos a tus salas de reuniones (p. ej., `tusitio.com/plugnmeet/room/tu-id-de-sala`) funcionen correctamente y no resulten en un error "404 No Encontrado".

1.  Ve a **Ajustes > Enlaces permanentes** en tu panel de WordPress.
2.  No necesitas cambiar ningún ajuste. Simplemente haz clic en el botón **"Guardar cambios"**.

Debes repetir este paso cada vez que cambies la **Ruta del Slug de la Sala** en los ajustes de Plug-N-Meet.
:::

---

## 3. Creando y Publicando Tu Primera Reunión

### Paso 3.1: Navegar a la Página de Creación de Sala

Para crear una nueva sala de reuniones, ve a **Plug-N-Meet > Salas** desde tu panel de WordPress y haz clic en el botón **"Añadir nueva"**. Esto te llevará a la página de configuración detallada de la sala, que está organizada en varias pestañas.

![Navegando a la página 'Añadir nueva' sala en el plugin de conferencias de PlugNmeet para WordPress.](/img/wordpress/2.png)

### Paso 3.2: Configuración Detallada de la Sala

Este formulario te da un control granular sobre cada aspecto de la sesión.

![La interfaz de configuración detallada de la sala para el plugin de PlugNmeet para WordPress, mostrando múltiples pestañas para personalización.](/img/wordpress/3.png)

#### Básico
Esta pestaña cubre la información esencial para tu sala.
- **Título y Descripción:** Dale a tu sala de reuniones un título claro y una descripción opcional.
- **Contraseñas:** Establece contraseñas separadas para moderadores y asistentes.
- **Mensaje de Bienvenida:** Personaliza el mensaje inicial que aparece en el chat cuando los usuarios se unen.
- **Máximo de Participantes:** Establece un límite en el número de usuarios que pueden unirse (usa `0` para ilimitado).

#### Funciones de la Sala
Esta sección te permite habilitar o deshabilitar las funciones interactivas principales de la sala de reuniones, como webcams, compartir pantalla y chat.

#### Otras Funciones
Esta pestaña ofrece una amplia gama de ajustes para controlar funcionalidades específicas dentro de la sala:
- **Grabación:** Habilita o deshabilita la grabación en la nube.
- **Transmisión Externa:** Configura opciones para transmitir tu reunión a plataformas externas.
- **Chat, Bloc de Notas Compartido, Pizarra:** Activa o desactiva estas herramientas colaborativas.
- **Reproductor de Medios Externo:** Permite a los moderadores reproducir medios de fuentes externas.
- **Sala de Espera:** Habilita una sala de espera para filtrar a los participantes antes de que se unan.
- **Salas de Grupos Pequeños (Breakout Rooms):** Permite a los moderadores dividir a los participantes en grupos más pequeños.
- **Mostrar Enlace Externo:** Configura un enlace personalizado para mostrar a los participantes.
- **Ingress (Entrada de Flujo):** Configura opciones para traer flujos de medios externos a la reunión.
- **Encuestas:** Habilita la función de encuestas para obtener retroalimentación interactiva.
- **Llamada SIP:** Configura opciones para que los usuarios se unan mediante una llamada telefónica SIP.
- **Cifrado de Extremo a Extremo:** Habilita E2EE para una máxima seguridad.

#### IA de Insights
En esta pestaña, puedes habilitar o deshabilitar funciones impulsadas por IA para la reunión, como la transcripción automática y los resúmenes de reuniones.

#### Ajustes de Bloqueo Predeterminados
Configura el estado inicial de "bloqueo" para varias funciones cuando un participante se une. Por ejemplo, puedes iniciar la reunión con los micrófonos, webcams o la pizarra bloqueados para mantener el orden. Los moderadores pueden desbloquear estas funciones durante la reunión.

#### Personalización del Diseño
Esta pestaña te permite anular los ajustes de diseño globales para esta sala específica. Puedes cambiar el logo, el fondo y la paleta de colores para que coincidan con tu marca o el tema de la reunión.

#### Permisos
Esta potente pestaña te permite definir exactamente cómo los diferentes roles de usuario de WordPress interactúan con la sala de reuniones y sus grabaciones.

![La tabla de permisos de roles de usuario en el plugin de videoconferencia de PlugNmeet para WordPress, permitiendo un control granular sobre el acceso a la reunión.](/img/wordpress/4.png)

**Valores Predeterminados Inteligentes:** El plugin comienza con valores predeterminados sensatos. Los roles con capacidades administrativas (como `edit_users` o `edit_posts`, que típicamente se aplican a Administradores y Editores) se configuran automáticamente para unirse como **moderadores** con acceso completo a las grabaciones. Todos los demás roles, incluidos los **Invitados** no autenticados, se unen por defecto como **asistentes** con permisos más restringidos.

**Personalización:** Estos valores predeterminados son solo un punto de partida. Puedes anularlos para cada rol usando las siguientes opciones:
- **Unirse como Moderador/Asistente:** Determina los privilegios del usuario dentro de la sala.
- **Requerir Contraseña:** Si se marca, los usuarios con este rol deben introducir la contraseña de asistente para unirse, incluso si han iniciado sesión.
- **Permitir Ver/Reproducir/Descargar/Eliminar Grabaciones:** Proporciona un control granular sobre cómo cada rol puede interactuar con las grabaciones de la sala. Al rol "Invitado/Público" no se le puede conceder permiso para eliminar grabaciones.

### Paso 3.3: Publicar la Sala

Tienes dos métodos principales para hacer que una sala esté disponible para tus usuarios.

#### Opción A: Incrustar en una Página con un Shortcode

Este método es ideal para integrar una sala de reuniones en una página o entrada existente junto con otro contenido.

1.  Ve a **Plug-N-Meet > Salas** y encuentra la sala que acabas de crear.
2.  En la columna **Shortcode**, copia el shortcode único para esa sala.
3.  Pega el shortcode en el área de contenido de cualquier página o entrada de WordPress.
4.  Publica la página. Cuando un usuario la visite, verá un formulario personalizable para unirse a la reunión.

![Copiando un shortcode de sala para incrustar una videoconferencia autoalojada en una página de WordPress con el plugin PlugNmeet.](/img/wordpress/5.png)

#### Opción B: Usar un Enlace Directo Limpio y Compartible

Cada sala que creas tiene automáticamente un enlace directo y compartible. Esto es perfecto para enviar por correo electrónico o para un aspecto limpio y profesional. La estructura de la URL consiste en un slug base y el ID único de la sala: `tusitio.com/[slug]/[id-de-sala]`.

Tienes control total sobre esta estructura:

1.  **Personalizar el Slug de la URL (Opcional):**
    -   Ve a **Plug-N-Meet > Ajustes > Opciones**.
    -   Encuentra el campo **Ruta del Slug de la Sala**. Por defecto, es `plugnmeet/room`.
    -   Puedes cambiarlo a algo más único, como `reuniones`. Tu nueva estructura de URL será `tusitio.com/reuniones/tu-id-de-sala/`.

2.  **Asegurar un Diseño Limpio con una Página Anfitriona:**
    -   Por defecto, al visitar el enlace directo se puede mostrar la reunión dentro del diseño de entrada estándar de tu tema (con barras laterales, etc.). Para asegurar una vista limpia y sin distracciones, debes asignar una página en blanco como plantilla.
    -   **Crea una Página en Blanco:** Ve a **Páginas > Añadir nueva** y crea una nueva página vacía. Nómbrala "Anfitrión de Reunión" o algo similar.
    -   **Asigna la Página Anfitriona:** Vuelve a **Plug-N-Meet > Ajustes > Opciones** y selecciona la página que acabas de crear en el menú desplegable **Página Anfitriona de la Sala**.

3.  **Actualizar los Enlaces Permanentes:**
    -   Después de personalizar el slug o establecer la página anfitriona, **debes** actualizar tus enlaces permanentes.
    -   Ve a **Ajustes > Enlaces permanentes** y simplemente haz clic en **"Guardar Cambios."**

Ahora, todos tus enlaces directos a las salas se abrirán en un diseño limpio y profesional usando tu estructura de URL personalizada.

---

## 4. Gestión Post-Sesión

Después de que una reunión concluye, todos los activos generados se organizan de forma ordenada y son accesibles desde la página **Plug-N-Meet > Salas** en tu área de administración de WordPress. Desde la lista de salas, puedes acceder a las **Grabaciones** y **Artefactos** de cada sesión.

### Gestión de Grabaciones

![La página de gestión de grabaciones en el plugin de PlugNmeet para WordPress, mostrando opciones para descargar y fusionar archivos de video.](/img/wordpress/7.png)

La página de **Grabaciones** para cada sala te permite:
- Descargar y eliminar grabaciones.
- **Fusionar múltiples segmentos de grabación** en un único archivo MP4 continuo para una fácil distribución.

### Acceso a Artefactos

![La página de gestión de artefactos en el plugin de PlugNmeet para WordPress, mostrando informes de análisis descargables y resúmenes de IA.](/img/wordpress/6.png)

La página de **Artefactos** contiene todos los demás archivos y datos generados durante la sesión. Esto incluye:
- **Informes de Análisis:** Descarga análisis completos post-reunión en formato Excel, detallando la participación de los asistentes, tiempo de habla, calidad de la conexión y más.
- **Resúmenes Generados por IA:** Accede y descarga resúmenes de reuniones creados por la IA.
- **Archivos de Transcripción:** Descarga transcripciones de voz a texto del audio de la reunión.

---

## 5. Configuración Avanzada

### Anulación de Plantillas del Plugin para Desarrolladores de Temas

Para una máxima flexibilidad, el plugin de plugNmeet permite a los desarrolladores de temas anular cualquiera de sus archivos de plantilla del front-end creando copias en el directorio de su propio tema. El plugin sigue la jerarquía de plantillas estándar de WordPress, buscando archivos en este orden:

1.  `[tu-tema-hijo]/plugnmeet/`
2.  `[tu-tema-padre]/plugnmeet/`
3.  `[directorio-del-plugin]/public/partials/` (el predeterminado)

**Cómo Anular:**

1.  **Localiza el archivo original:** Encuentra la plantilla que quieres cambiar dentro del directorio `/wp-content/plugins/plugnmeet/public/partials/` del plugin.
2.  **Replica la estructura:** En la carpeta de tu tema (preferiblemente un tema hijo), crea un directorio `plugnmeet`. Si el archivo original está en una subcarpeta (p. ej., `parts/`), crea también esa subcarpeta dentro de tu directorio `plugnmeet`.
3.  **Copia y modifica:** Copia el archivo original a la nueva ubicación en tu tema y personalízalo según tus necesidades.

**Ejemplo 1: Personalización Menor**
Para cambiar el diseño del formulario de acceso, copiarías:
`[dir-plugin]/public/partials/parts/login-form.php`
a
`[tu-tema]/plugnmeet/parts/login-form.php`
y luego editarías el archivo en tu tema.

**Ejemplo 2: Cambios Estructurales Mayores**
Para cambiar completamente la estructura general de la vista de la sala, puedes anular el archivo de visualización principal. Copia:
`[dir-plugin]/public/partials/plugnmeet-public-display.php`
a
`[tu-tema]/plugnmeet/plugnmeet-public-display.php`
Esto te permite añadir divs contenedores personalizados, cambiar el orden de las partes de la plantilla o incluso cargar condicionalmente diferentes partes basándote en tu propia lógica.

### Hooks para Desarrolladores

El plugin dispara un hook de acción `plugnmeet_webhook_data`, permitiéndote procesar datos de eventos en tiempo real de tus reuniones. Puedes conectarte a este hook en el archivo `functions.php` de tu tema o en un plugin personalizado.

```php
add_action( 'plugnmeet_webhook_data', 'mi_manejador_webhook_plugnmeet', 10, 1 );

function mi_manejador_webhook_plugnmeet( $data ) {
  // Procesa los datos del webhook aquí
  // p. ej., registrar en un archivo, enviar a un CRM, etc.
}
```

---

## 6. Seguridad y Privacidad

La seguridad es una fortaleza central de la plataforma plugNmeet.
*   **Control de Datos:** Como tú controlas el servidor (ya sea autoalojado o a través de nuestro servicio en la nube privado), tú controlas tus datos.
*   **Alojamiento On-Premises:** Para una máxima privacidad, el servidor de código abierto de plugNmeet puede instalarse en tu propio hardware local, asegurando que los datos sensibles nunca salgan de tu red. Esto es ideal para organizaciones con estrictas necesidades de cumplimiento de datos (p. ej., GDPR, HIPAA).
*   **Cifrado:** Toda la comunicación está cifrada por defecto usando estándares WebRTC. Para una máxima seguridad, puedes habilitar el **Cifrado de Extremo a Extremo (E2EE)** para tus reuniones.