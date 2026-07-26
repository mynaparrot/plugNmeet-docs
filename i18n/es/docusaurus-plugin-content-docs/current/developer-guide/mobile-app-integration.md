---
title: "Cree una Aplicación de Videoconferencia Personalizada con la Integración Híbrida de plugNmeet"
description: "Aprenda a crear una aplicación de videoconferencia autoalojada y personalizada para iOS, Android, Flutter, React Native o escritorio utilizando la arquitectura híbrida WebView de plugNmeet, publicación de medios nativa y la interfaz de usuario web de plugNmeet."
sidebar_position: 5
sidebar_label: Guía de Aplicación de Video Personalizada
---

# Cree una Aplicación de Videoconferencia Personalizada con la Integración Híbrida de plugNmeet

:::info[Próxima Característica]
Esta integración híbrida es una característica próxima en **v2.4.0**. Un servidor de demostración ya está disponible para pruebas y desarrollo.
:::

Cree una **aplicación de videoconferencia personalizada** para iOS, Android, Flutter, React Native, escritorio o cualquier plataforma nativa utilizando el modelo de integración híbrida de plugNmeet. Esta arquitectura le permite combinar una capa de medios nativa con la interfaz completa del cliente web de plugNmeet, brindándole un camino flexible para construir una **aplicación de videollamadas autoalojada**, una **aplicación de video de marca blanca** o una **solución WebRTC en las propias instalaciones (on-premise)** sin reconstruir cada característica de conferencia desde cero.

En este modelo, su aplicación nativa se encarga de la publicación de medios, como el micrófono, la cámara y el uso compartido de pantalla. El cliente web de plugNmeet se ejecuta dentro de una WebView y proporciona la interfaz de la reunión, incluyendo listas de participantes, chat, pizarra, controles de moderación y suscripción a medios.

## ¿Para Quién es Esta Guía?

Esta guía es para desarrolladores y equipos que desean:

- Construir una **aplicación de videoconferencia de código abierto** utilizando plugNmeet.
- Añadir reuniones WebRTC autoalojadas a una aplicación nativa existente.
- Crear una experiencia de reunión de marca o de marca blanca para entornos móviles, de escritorio o de quiosco.
- Utilizar APIs de dispositivos nativos para el micrófono, la cámara, el procesamiento personalizado o el manejo en segundo plano.
- Mantener la interfaz de usuario web de plugNmeet para las funciones de conferencia mientras se controla el contenedor de la aplicación nativa.

## Lo que plugNmeet Proporciona y lo que Usted Construye

plugNmeet proporciona el motor de conferencias, la interfaz web, las APIs del servidor y el contrato de comunicación (bridge). Usted proporciona la aplicación anfitriona nativa y la implementación de medios nativa.

### plugNmeet Proporciona

- **Servidor plugNmeet**: El backend de conferencias autoalojado y la capa de API.
- **Cliente Web de plugNmeet**: La interfaz de usuario web completa de la reunión que se ejecuta dentro de su WebView.
- **Contrato de Comunicación (Bridge Contract)**: Un protocolo de mensajería definido por protobuf que permite la comunicación entre el cliente web y el anfitrión nativo.
- **Modo Web Híbrido**: Un modo de cliente web donde la WebView actúa como el controlador de la interfaz de usuario y el suscriptor de medios, mientras que la aplicación nativa publica los medios.

### Usted Construye

- **Contenedor de Aplicación Nativa (App Shell)**: Su aplicación de iOS, Android, Flutter, React Native, escritorio u otra aplicación nativa.
- **Publicador de Medios Nativo**: La conexión nativa de LiveKit que captura y publica las pistas de micrófono, cámara y de pantalla compartida.
- **Experiencia de Usuario Específica de la Aplicación**: Inicio de sesión, marca, navegación, permisos de la aplicación, procesamiento nativo de cámara/audio y comportamiento específico de la plataforma.

> Las aplicaciones nativas de producción no deben incrustar la clave o el secreto de la API de plugNmeet. Su backend debe mantener las credenciales de la API y emitir un JWT de plugNmeet para la aplicación nativa.

## ¿Por Qué Usar el Modelo Híbrido?

El modelo híbrido le brinda la flexibilidad del desarrollo nativo y la velocidad de usar la interfaz de usuario de reuniones existente de plugNmeet.

- **Rendimiento de medios nativo**: Capture y publique medios utilizando las APIs nativas de la plataforma. Esto es especialmente importante para funciones como el uso compartido de pantalla, que no es compatible con la mayoría de los navegadores móviles.
- **Interfaz de usuario web completa de plugNmeet**: Mantenga las listas de participantes, el chat, la pizarra, los controles de moderación, el manejo del diseño y la renderización de suscriptores dentro del cliente web.
- **Desarrollo de aplicaciones móviles más rápido**: Construya solo el contenedor nativo y la capa de medios en lugar de recrear toda la interfaz de usuario de la reunión.
- **Personalización de marca blanca**: Controle la marca de su aplicación nativa mientras utiliza los activos personalizables del cliente de plugNmeet.
- **Implementación autoalojada**: Mantenga la infraestructura bajo su control para la privacidad, el cumplimiento y los casos de uso en las propias instalaciones (on-premise).

## Descripción General de la Arquitectura

La idea central es simple: un usuario lógico está representado por dos participantes de LiveKit.

- El **participante web** se suscribe a los medios y controla la interfaz de usuario de la reunión.
- El **participante nativo** publica los medios desde la aplicación nativa.

![Arquitectura de Integración Híbrida](/img/hybrid-architecture.png)

## Responsabilidades por Componente

### Aplicación Nativa: Publicador de Medios y Gestor de Dispositivos

Su aplicación nativa es responsable de:

- Alojar el cliente web de plugNmeet dentro de una WebView.
- Recibir `serverUrl` y un JWT de plugNmeet desde su backend.
- Escuchar los comandos del puente (bridge) desde el cliente web.
- Capturar medios de micrófono, cámara web y de pantalla compartida utilizando APIs nativas.
- Conectarse a LiveKit con el token nativo de solo publicación.
- Publicar, silenciar, reactivar y dejar de publicar pistas de medios nativas.
- Limpiar los medios y las conexiones de LiveKit cuando la WebView se va, se recarga o deja de enviar mensajes de latido (heartbeat).

### Cliente Web: Controlador de UI y Suscriptor

El cliente web de plugNmeet es responsable de:

- Renderizar la interfaz de usuario completa de la reunión dentro de la WebView.
- Verificar el JWT de plugNmeet a través de `POST /api/verifyToken`.
- Entrar en modo híbrido cuando `client_type = HYBRID_WEB`.
- Ocultar los controles de publicación de medios del lado del navegador y las opciones de procesamiento de dispositivos.
- Conectarse a LiveKit con un token de solo suscripción.
- Enviar comandos de medios nativos a través del puente (bridge).
- Recibir y mostrar todas las pistas suscritas, incluidas las pistas publicadas de forma nativa por el usuario local.
- Mantener el estado de la interfaz de usuario a partir de los eventos de LiveKit y los mensajes de estado del puente nativo.

### Backend del Cliente

Su backend es responsable de:

- Mantener la clave y el secreto de la API de plugNmeet.
- Crear salas cuando sea necesario.
- Llamar a `POST /auth/room/getJoinToken`.
- Establecer `userInfo.client_type = HYBRID_WEB` al emitir un token para una aplicación nativa híbrida.
- Pasar el JWT de plugNmeet devuelto a su aplicación nativa.

## Modelo de Identidad

Un único usuario lógico tiene dos identidades de LiveKit:

| Identidad | Usado Por | Modelo de Permisos |
| --- | --- | --- |
| `[userID]` | Cliente web en WebView | Solo suscripción en modo híbrido |
| `[userID]-native` | Aplicación nativa | Solo publicación en modo híbrido |

El sufijo `-native` está reservado para las identidades de publicadores nativos. El servidor rechaza los tokens de unión proporcionados por el usuario cuyo `user_id` termina con este sufijo para evitar colisiones de identidad.

El cliente web mapea cualquier identidad `*-native` de vuelta al ID de usuario principal de plugNmeet:

- Si el ID primario resuelto es el usuario local, la pista se adopta como el propio medio del usuario local.
- Si el ID primario resuelto pertenece a otro participante, la pista se muestra como el medio remoto de ese participante.

Esto permite que la interfaz de usuario web reutilice la infraestructura de suscriptores existente mientras sigue mostrando las pistas publicadas de forma nativa en el mosaico del participante correcto.

## Flujo de Trabajo de Producción de Extremo a Extremo

### Paso 1: Autenticación y Carga del Cliente Web

Las aplicaciones móviles nativas nunca deben contener la clave o el secreto de la API de plugNmeet. El flujo de arranque de producción utiliza un JWT de plugNmeet, también llamado `access_token`.

1.  Su backend llama a `POST /auth/room/getJoinToken` utilizando la clave de API de plugNmeet.
2.  Su backend establece `userInfo.client_type = HYBRID_WEB` en la solicitud de token de unión.
3.  El servidor de plugNmeet devuelve un JWT.
4.  Su backend envía `serverUrl` y el JWT a su aplicación nativa.

En este punto, tiene dos opciones principales para cargar el cliente web en su WebView:

#### Opción A: Cargar el Cliente Web Alojado Directamente (Simple)

Este es el enfoque más fácil. Simplemente construya la URL y cárguela en su WebView.

```kotlin
// Ejemplo para Android
val url = "${serverUrl.trimEnd('/')}/?access_token=${jwt}"
webView.loadUrl(url)
```

Con este método, el cliente web utilizará la configuración de diseño predeterminada (logotipo, colores, etc.) de su servidor plugNmeet. Aún puede aplicar personalizaciones del lado del cliente inyectando un objeto `window.plugNmeetConfig`. Consulte nuestra [Guía de Personalización de Diseño](./design-customisation) para más detalles.

#### Opción B: Construir un Contenedor HTML Personalizado (Avanzado)

Este enfoque le da el máximo control sobre el contenedor HTML.

1.  La aplicación nativa llama a `POST /api/getClientFiles` utilizando el JWT.
2.  La aplicación nativa construye un contenedor HTML en memoria a partir de los archivos de activos del cliente devueltos.
3.  La aplicación nativa carga el HTML en la WebView y proporciona el JWT, por ejemplo, a través de `?access_token=<jwt>` o inyectándolo antes del arranque.

### Paso 2: Entrar en Modo Híbrido

El cliente web llama a `POST /api/verifyToken` para validar la sesión. Luego, entra en modo híbrido basándose en una de dos condiciones:

-   **Método Principal (Basado en Token)**: La respuesta de `verifyToken` contiene `client_type = HYBRID_WEB`. Este es el enfoque de producción recomendado.
-   **Método Alternativo (Basado en Configuración)**: Su aplicación nativa inyecta `force_hybrid_web: true` en el objeto `window.plugNmeetConfig`. Si esta bandera está presente y es verdadera, el cliente web entrará en modo híbrido independientemente del `client_type` del token. Esto es útil para simplificar la configuración, para pruebas o para esquemas de URL personalizados donde el `client_type` puede no estar establecido.

### Paso 3: Transferencia de Token de LiveKit

Después de unirse a los servicios de la sala, el cliente web solicita los datos de conexión del servidor de medios. Para un usuario `HYBRID_WEB`, el servidor devuelve:

- Un **token de LiveKit de solo suscripción** para la identidad web `[userID]`.
- Un **token de LiveKit de solo publicación** para la identidad nativa `[userID]-native`.

El cliente web se conecta a LiveKit utilizando el token de solo suscripción. Luego, envía el token nativo de solo publicación al anfitrión nativo utilizando la acción del puente `INITIALIZE_NATIVE_PUBLISHER`.

### Paso 4: Publicación de Medios Nativos

Cuando el usuario interactúa con los controles de medios en la interfaz de usuario web, el cliente web envía comandos de puente como `PUBLISH_NATIVE_MEDIA`. La aplicación nativa luego maneja todo el proceso de captura y publicación de medios utilizando APIs nativas.

### Paso 5: Visualización y Sincronización

El cliente web recibe la pista publicada de forma nativa a través de la suscripción de LiveKit y la muestra en el mosaico del participante correcto, creando una experiencia fluida.

## API del Puente de Comunicación

El contrato del puente se define en `plugnmeet_native_bridge.proto`. El formato en la transmisión es **texto JSON proto3** sobre el canal de mensajería de la WebView, no protobuf binario. Los valores de enumeración aparecen como nombres de cadena en JSON, lo que facilita la depuración en entornos de WebView.

Los nombres de las acciones a continuación se muestran como los nombres de enumeración de proto utilizados por el contrato del puente.

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

### Fuentes de Medios

Las fuentes de medios compatibles son:

- `MIC`
- `WEBCAM`
- `SCREENSHARE`

## Soporte de Transporte del Puente

El puente del cliente web debe detectar el transporte disponible en este orden de prioridad:

1. `window.ReactNativeWebView.postMessage(...)` para React Native WebView.
2. `window.webkit.messageHandlers.<name>.postMessage(...)` para iOS WKWebView.
3. Una interfaz de JavaScript inyectada en Android, como `window.PnmNative.postMessage(...)`.
4. `window.parent.postMessage(...)` como un fallback para iframe o escritorio.

Los mensajes entrantes deben manejarse de una manera que funcione en todos los entornos de WebView. React Native WebView puede entregar mensajes a través de `document`, por lo que las implementaciones deben escuchar tanto en `window` como en `document` cuando sea aplicable.

## Latido (Heartbeat) y Reinicialización

El cliente web envía `NATIVE_HEARTBEAT_PING` mientras la sala está activa. El anfitrión nativo debe responder con `NATIVE_HEARTBEAT_PONG`.

Si el anfitrión nativo deja de recibir pings durante la ventana de vigilancia, debe asumir que la WebView se cerró, se recargó o se bloqueó. La aplicación nativa debe entonces:

- Dejar de publicar todas las pistas nativas.
- Desconectar el cliente nativo de LiveKit.
- Liberar el micrófono, la cámara y otros recursos de medios.

Si el anfitrión nativo recibe `INITIALIZE_NATIVE_PUBLISHER` de nuevo, debe tratarlo como una solicitud de reinicialización. Debe desmontar cualquier conexión nativa de LiveKit existente antes de conectarse con las nuevas credenciales.

## Silencio y Silencio Forzado por el Administrador

En modo híbrido, la interfaz de usuario web reenvía los cambios de estado de los medios a la aplicación nativa. Silenciar y reactivar no necesariamente deben dejar de publicar la pista.

- `MUTE_NATIVE_MEDIA` silencia una pista nativa existente.
- `UNMUTE_NATIVE_MEDIA` reactiva una pista nativa existente.
- `UNPUBLISH_NATIVE_MEDIA` detiene por completo la publicación de la fuente seleccionada.

Cuando un moderador fuerza el silencio para un usuario, el cliente web debe reenviar la solicitud de silencio al anfitrión nativo. El comportamiento de silencio del lado del servidor también debe aplicarse a las pistas del participante `[userID]-native` para que todos los participantes vean el estado de silencio correcto.

## Transferencia de E2EE

Si el cifrado de extremo a extremo (E2EE) está habilitado para la sala, el publicador nativo debe usar la misma clave de cifrado que el cliente web. La clave se entrega a la aplicación nativa como parte de `INITIALIZE_NATIVE_PUBLISHER`.

Ejemplo:

```json
{
  "livekitUrl": "wss://livekit.example.com",
  "token": "<token_livekit_solo_publicacion_nativo>",
  "nativeUserId": "<userID>-native",
  "e2ee": {
    "enabled": true,
    "key": "su-clave-e2ee-en-texto-plano"
  }
}
```

Para la seguridad en producción:

- No envíe claves E2EE con un origen de destino comodín.
- Prefiera los canales de puente nativos de la plataforma cuando estén disponibles.
- No registre las cargas útiles del handshake del puente.
- Si una plataforma nativa de destino no puede admitir E2EE, no habilite E2EE para esa sesión híbrida.

## Lista de Verificación de Implementación de la Aplicación Nativa

Utilice esta lista de verificación al construir el contenedor de su aplicación nativa.

### Requerido

- Recibir `serverUrl` y el JWT de plugNmeet desde su backend.
- Cargar el cliente web de plugNmeet en una WebView utilizando uno de los métodos descritos anteriormente.
- Implementar la lógica de recepción/envío del puente.
- Manejar `INITIALIZE_NATIVE_PUBLISHER`.
- Conectarse a LiveKit utilizando el token nativo de solo publicación.
- Implementar `PUBLISH_NATIVE_MEDIA` para micrófono y cámara.
- Implementar `MUTE_NATIVE_MEDIA` y `UNMUTE_NATIVE_MEDIA`.
- Implementar `UNPUBLISH_NATIVE_MEDIA`.
- Implementar `TEARDOWN_NATIVE_PUBLISHER`.
- Enviar `NATIVE_MEDIA_STATUS` para estados de éxito o error.
- Enviar `NATIVE_TRACK_PUBLISHED` y `NATIVE_TRACK_UNPUBLISHED` cuando cambie el estado de la pista.
- Responder a `NATIVE_HEARTBEAT_PING` con `NATIVE_HEARTBEAT_PONG`.
- Desmontar el publicador nativo si el latido de la WebView se detiene.

### Recomendado

- Implementar `PUBLISH_NATIVE_MEDIA` para compartir pantalla.
- Tratar `INITIALIZE_NATIVE_PUBLISHER` repetido como una reinicialización completa.
- Proporcionar avisos de permisos nativos y mensajes de error claros.
- Mantener el ciclo de vida de los medios nativos y de la WebView estrechamente sincronizados.
- Evitar incrustar claves o secretos de API en aplicaciones de producción.
- Etiquetar cualquier demostración interna que incruste credenciales de API como solo para demostración.

### Opcional

- Soporte para E2EE.
- Fondo virtual nativo o efectos de cámara.
- Interfaz de usuario de selección de dispositivos personalizada.
- Manejo del modo en segundo plano.
- Controles de enrutamiento de audio específicos de la plataforma.

## Aplicaciones de Demostración

plugNmeet no requiere un SDK móvil. El enfoque híbrido utiliza el cliente web en una WebView con un puente de medios nativo. Proporcionamos aplicaciones de demostración que muestran este patrón de integración híbrida, que es la forma recomendada de construir una aplicación móvil con plugNmeet.

Este patrón —alojar el cliente web en una WebView y publicar medios (micrófono, cámara web y uso compartido de pantalla) de forma nativa— es necesario porque la mayoría de los navegadores móviles no admiten el uso compartido de pantalla directamente. Al utilizar un puente nativo, se obtiene un control total sobre el hardware del dispositivo.

Consulte las aplicaciones de demostración en nuestro [repositorio de aplicaciones móviles de plugNmeet](https://github.com/mynaparrot/plugnmeet-mobile-app) para comprender el patrón.

> Nota solo para la demostración: una demostración interna puede usar la clave y el secreto de la API dentro de la aplicación por conveniencia, pero las aplicaciones de producción nunca deben hacer esto. Las aplicaciones de producción deben recibir solo `serverUrl` y un JWT de plugNmeet desde un backend de confianza.

## Resumen

La integración híbrida de plugNmeet le permite construir una aplicación de videoconferencia nativa personalizada mientras mantiene la interfaz de usuario completa de la reunión web de plugNmeet. El cliente web actúa como el controlador de la interfaz de usuario y el suscriptor. La aplicación nativa actúa como el publicador de medios y el gestor de dispositivos. Juntos, proporcionan una arquitectura práctica para construir aplicaciones de conferencias WebRTC autoalojadas, de marca blanca y compatibles con dispositivos móviles con un fuerte control nativo y una rápida integración.
