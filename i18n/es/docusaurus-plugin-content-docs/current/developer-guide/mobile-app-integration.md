---
title: "Cree una Aplicación de Videoconferencia Personalizada con la Integración Híbrida de plugNmeet"
description: "Aprenda a crear una aplicación de videoconferencia autoalojada y personalizada para iOS, Android, Flutter, React Native o escritorio utilizando la arquitectura híbrida WebView de plugNmeet, publicación de medios nativa y la interfaz de usuario web de plugNmeet."
sidebar_position: 5
sidebar_label: Guía de Aplicación de Video Personalizada
---

# Cree una Aplicación de Videoconferencia Personalizada con la Integración Híbrida de plugNmeet

El modelo de integración híbrida de plugNmeet proporciona un camino rápido y flexible para construir aplicaciones de videoconferencia personalizadas para plataformas nativas como iOS, Android, Flutter, React Native o escritorio.

Esta arquitectura combina una capa de medios nativa con el cliente web completo de plugNmeet, que se ejecuta dentro de una WebView. La aplicación nativa se encarga de toda la publicación de medios (micrófono, cámara y pantalla compartida), mientras que el cliente web proporciona la interfaz de reunión rica en funciones. Este enfoque permite a los desarrolladores aprovechar el rendimiento nativo para el manejo de medios, evitando al mismo tiempo la necesidad de construir una compleja interfaz de usuario de conferencias desde cero. Es especialmente útil para habilitar funciones como el uso compartido de pantalla en dispositivos móviles, que no está bien soportado en los navegadores móviles.

## Véalo en Acción: Aplicaciones de Demostración

Antes de sumergirse en los detalles técnicos, puede ver esta integración híbrida en acción explorando nuestras aplicaciones de demostración de código abierto.

Notará que plugNmeet no proporciona su propio SDK móvil. Esta es una elección de diseño deliberada. Dado que plugNmeet utiliza LiveKit para su capa de medios, puede usar directamente los excelentes SDKs nativos de LiveKit (para iOS, Android, React Native, etc.) para manejar todas las tareas relacionadas con los medios.

En lugar de un SDK restrictivo, proporcionamos un **patrón** flexible: ejecute el cliente web de plugNmeet, rico en funciones, en una WebView para la interfaz de usuario, y use los SDKs nativos de LiveKit para la capa de medios. Nuestras aplicaciones de demostración muestran lo simple que es implementar esto, brindándole rendimiento nativo y control total sin tener que construir una interfaz de usuario desde cero.

Consulte las aplicaciones de demostración en nuestro [repositorio de aplicaciones móviles de plugNmeet](https://github.com/mynaparrot/plugnmeet-mobile-app) para comprender el patrón.

## Arquitectura e Identidad

El núcleo del modelo híbrido es representar a un único usuario lógico con dos participantes en la sala de LiveKit:

| Identidad | Usado Por | Permisos |
| --- | --- | --- |
| `[userID]` | Cliente web en WebView | Solo suscripción |
| `[userID]-native` | Aplicación nativa | Solo publicación |

El cliente web renderiza la interfaz de usuario y se suscribe a todos los flujos de medios, mientras que la aplicación nativa se conecta por separado para publicar sus propios medios. El cliente web reconoce que las pistas de una identidad `*-native` que coinciden con su propio `userID` deben tratarse como medios locales, mostrándolos en el mosaico de la interfaz de usuario correcto sin eco. Esto permite que la interfaz de usuario web existente funcione con cambios mínimos.

![Arquitectura de Integración Híbrida](/img/hybrid-architecture.png)

## Flujo de Trabajo de Extremo a Extremo

### Paso 1: Obtener un Token de Acceso

El flujo de trabajo comienza en su backend. Para autorizar a un usuario, su servidor llama a la API de plugNmeet para generar un token de acceso. Para una aplicación híbrida, es crucial establecer el `client_type` en esta solicitud.

1.  **Backend:** Llame a [`POST /room/getJoinToken`](/docs/api/room/join).
2.  **En el cuerpo de la solicitud:** Establezca `user_info.client_type = "HYBRID_WEB"`.
3.  **Backend:** Reciba el JWT (`access_token`) del servidor de plugNmeet y páselo de forma segura a su aplicación nativa, junto con su `serverUrl`.

### Paso 2: Cargar el Cliente Web en una WebView

Una vez que la aplicación nativa tiene el `access_token`, debe cargar el cliente web de plugNmeet en una WebView. Hay dos métodos principales para esto:

#### Opción A: Cargar el Cliente Web Alojado Directamente (Simple)

Este es el enfoque más fácil. Construya la URL con el token de acceso y cárguela.

```kotlin
// Ejemplo para Android
val url = "${serverUrl.trimEnd('/')}/?access_token=${jwt}"
webView.loadUrl(url)
```

Para aplicar una apariencia personalizada, puede agregar un parámetro de consulta `custom_design` a la URL. El valor debe ser una cadena JSON codificada para URL. Esto se usa a menudo para cambiar el logotipo y los colores.

Para obtener una lista completa de los parámetros admitidos, consulte nuestra [Guía de Personalización de Diseño](./design-customisation) para más detalles.

```kotlin
// Ejemplo para Android con diseño personalizado
// El valor de custom_design es una cadena JSON codificada para URL como:
// {"logo":"https://your-domain.com/logo.png","primary_color":"#004D90"}
val customDesign = "%7B%22logo%22%3A%22https%3A%2F%2Fyour-domain.com%2Flogo.png%22%2C%22primary_color%22%3A%22%23004D90%22%7D"

val url = "${serverUrl.trimEnd('/')}/?access_token=${jwt}&custom_design=${customDesign}"
webView.loadUrl(url)
```

#### Opción B: Construir un Contenedor HTML Personalizado (Avanzado)

Esto le da el máximo control. La aplicación nativa llama a `POST /api/getClientFiles` usando el JWT para la autenticación (p. ej., `Authorization: <access_token>`). Este endpoint está diseñado para aplicaciones nativas y proporciona los mismos activos que el endpoint del lado del servidor `/auth/getClientFiles`, que utiliza autenticación con Clave/Secreto de API. Consulte la [API de Obtención de Archivos de Cliente](/docs/api/get-client-files) para detalles de la respuesta. Luego, la aplicación construye un contenedor HTML en memoria a partir de los activos devueltos y lo carga en la WebView.

Incluso con este método, se pueden aplicar personalizaciones del lado del cliente inyectando un objeto `window.plugNmeetConfig`. Consulte nuestra [Guía de Personalización de Diseño](./design-customisation) para más detalles.

### Paso 3: Entrar en Modo Híbrido

El cliente web valida la sesión llamando a `POST /api/verifyToken`. Luego, entra en modo híbrido basándose en una de dos condiciones:

-   **Basado en Token (Recomendado):** La respuesta de `verifyToken` contiene `client_type = HYBRID_WEB`.
-   **Anulación por Configuración:** La aplicación nativa inyecta `force_hybrid_web: true` en el objeto `window.plugNmeetConfig`. Esto fuerza el modo híbrido independientemente del `client_type` del token y es útil para pruebas o esquemas de URL personalizados.

### Paso 4: Transferencia al Publicador Nativo

En modo híbrido, el servidor de plugNmeet proporciona dos tokens de LiveKit al cliente web: un token de solo suscripción para sí mismo y un token de solo publicación para el gemelo nativo.

El cliente web se conecta a LiveKit y luego pasa el token de solo publicación a la aplicación nativa a través del puente de comunicación usando la acción `INITIALIZE_NATIVE_PUBLISHER`. Su aplicación nativa ahora tiene todo lo que necesita para conectarse a LiveKit y comenzar a publicar medios.

## API del Puente de Comunicación

La comunicación entre la WebView y el anfitrión nativo se maneja mediante un puente de mensajes definido en [`plugnmeet_native_bridge.proto`](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_native_bridge.proto). El formato en la transmisión es **texto JSON proto3**.

### Del Cliente Web al Anfitrión Nativo

| Acción | Carga Útil (Payload) | Descripción |
| --- | --- | --- |
| `INITIALIZE_NATIVE_PUBLISHER` | `{ livekitUrl, token, nativeUserId, e2ee? }` | Proporciona al anfitrión nativo la URL de LiveKit y el token de solo publicación. |
| `PUBLISH_NATIVE_MEDIA` | `{ source }` | Solicita la publicación nativa para `MIC`, `WEBCAM` o `SCREENSHARE`. |
| `UNPUBLISH_NATIVE_MEDIA` | `{ source }` | Solicita que la aplicación nativa deje de publicar la fuente de medios seleccionada. |
| `MUTE_NATIVE_MEDIA` | `{ source }` | Silencia una pista nativa ya publicada sin dejar de publicarla. |
| `UNMUTE_NATIVE_MEDIA` | `{ source }` | Reactiva una pista nativa previamente silenciada. |
| `NATIVE_HEARTBEAT_PING` | `{ ts }` | Mensaje de mantenimiento de conexión (keepalive) de la web al nativo. |
| `TEARDOWN_NATIVE_PUBLISHER` | `{}` | Solicita que la aplicación nativa se desconecte de LiveKit y libere los recursos de medios. |

### Del Anfitrión Nativo al Cliente Web

| Acción | Carga Útil (Payload) | Descripción |
| --- | --- | --- |
| `NATIVE_MEDIA_STATUS` | `{ source?, deviceId?, error? }` | Confirma una acción nativa o informa de un error. |
| `NATIVE_TRACK_PUBLISHED` | `{ userId, kind, source }` | Notifica al cliente web que se ha publicado una pista nativa. |
| `NATIVE_TRACK_UNPUBLISHED` | `{ userId, kind, source }` | Notifica al cliente web que se ha dejado de publicar una pista nativa. |
| `NATIVE_MEDIA_MUTED` | `{ source, muted }` | Confirma el estado de silencio nativo. |
| `NATIVE_HEARTBEAT_PONG` | `{ ts }` | Respuesta nativa al ping de latido (heartbeat). |
| `NATIVE_ERROR` | `{ msg, context? }` | Informa de un error genérico desde el anfitrión nativo. |

## Transferencia de E2EE

Si el cifrado de extremo a extremo está habilitado, la clave de cifrado en texto plano se entrega a la aplicación nativa como parte de la carga útil de `INITIALIZE_NATIVE_PUBLISHER`.

```json
{
  "action": "INITIALIZE_NATIVE_PUBLISHER",
  "initializeNativePublisher": {
    "livekitUrl": "wss://livekit.example.com",
    "token": "<token_livekit_solo_publicacion_nativo>",
    "nativeUserId": "<userID>-native",
    "e2ee": {
      "enabled": true,
      "key": "su-clave-e2ee-en-texto-plano"
    }
  }
}
```

## Lista de Verificación de Implementación de la Aplicación Nativa

### Requerido

-   Recibir `serverUrl` y el JWT de plugNmeet desde su backend.
-   Cargar el cliente web de plugNmeet en una WebView.
-   Implementar la lógica del puente para enviar y recibir mensajes.
-   Manejar `INITIALIZE_NATIVE_PUBLISHER` conectándose a LiveKit con el token proporcionado.
-   Implementar la captura y publicación de medios nativos para `PUBLISH_NATIVE_MEDIA` (micrófono y cámara).
-   Implementar `MUTE_NATIVE_MEDIA`, `UNMUTE_NATIVE_MEDIA` y `UNPUBLISH_NATIVE_MEDIA`.
-   Implementar `TEARDOWN_NATIVE_PUBLISHER` para limpiar los recursos.
-   Enviar mensajes de estado de vuelta al cliente web (`NATIVE_MEDIA_STATUS`, `NATIVE_TRACK_PUBLISHED`, etc.).
-   Responder a `NATIVE_HEARTBEAT_PING` con `NATIVE_HEARTBEAT_PONG`.
-   Implementar un vigilante (watchdog) para desmontar el publicador nativo si el latido de la WebView se detiene.

### Recomendado

-   Implementar `PUBLISH_NATIVE_MEDIA` para compartir pantalla.
-   Tratar las llamadas repetidas a `INITIALIZE_NATIVE_PUBLISHER` como una reinicialización completa.
-   Proporcionar avisos de permisos nativos claros y manejo de errores.
-   Evitar incrustar claves o secretos de API en aplicaciones de producción.

### Opcional

-   Soporte para E2EE.
-   Fondo virtual nativo o efectos de cámara.
-   Una interfaz de usuario de selección de dispositivos personalizada.
-   Controles de modo de fondo y enrutamiento de audio.