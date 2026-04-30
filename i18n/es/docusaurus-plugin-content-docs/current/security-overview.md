---
title: Resumen de Seguridad y Privacidad de Plug-N-Meet | Su Solución de Videoconferencia Autoalojada
description: Una descripción detallada de la arquitectura de seguridad, los mecanismos de autenticación, autorización y cifrado de extremo a extremo (E2EE) dentro de la plataforma Plug-N-Meet.
keywords: [seguridad, privacidad, manejo de datos, e2ee, cifrado de extremo a extremo, autenticación, autorización, hmac, jwt, nats, livekit, seguridad webrtc]
sidebar_position: 3
sidebar_label: Seguridad y Privacidad
---

# Resumen de Seguridad y Privacidad de Plug-N-Meet

Este documento ofrece un panorama completo de la arquitectura de seguridad y los principios de privacidad que rigen la plataforma Plug-N-Meet. No solo detalla las medidas técnicas que implementamos para proteger sus reuniones contra accesos no autorizados, sino que también ofrece una explicación transparente sobre cómo se manejan, almacenan y gestionan sus datos durante todo su ciclo de vida. El sistema está diseñado desde su concepción para ser seguro por defecto y para otorgarle a usted, como operador, el control total sobre sus datos.

## Tabla de Contenidos

1.  [Autenticación de la API](#1-autenticación-de-la-api)
2.  [Autenticación y Autorización de Usuarios](#2-autenticación-y-autorización-de-usuarios)
3.  [Cifrado de Extremo a Extremo (E2EE)](#3-cifrado-de-extremo-a-extremo-e2ee)
    -   [Claves Generadas por el Servidor](#31-claves-generadas-por-el-servidor)
    -   [Claves Proporcionadas por el Usuario](#32-claves-proporcionadas-por-el-usuario)
4.  [Seguridad del Transporte y de los Datos en Tránsito](#4-seguridad-del-transporte-y-de-los-datos-en-tránsito)
    -   [Comunicación NATS](#41-comunicación-nats)
    -   [Servidor de Medios (LiveKit)](#42-servidor-de-medios-livekit)
    -   [Pasarela SIP (SIP Gateway)](#43-pasarela-sip-sip-gateway)
5.  [Servicios de IA y Privacidad de Datos (La Plataforma Insights)](#5-servicios-de-ia-y-privacidad-de-datos-la-plataforma-insights)
6.  [Flujo de Sesión Segura](#6-flujo-de-sesión-segura)
7.  [Almacenamiento en el Navegador (IndexedDB)](#7-almacenamiento-en-el-navegador-indexeddb)
8.  [Manejo y Persistencia de Datos en el Servidor](#8-manejo-y-persistencia-de-datos-en-el-servidor)

---

### 1. Autenticación de la API

Todas las solicitudes de API de servidor a servidor, como la creación de una sala o la generación de un token de acceso, deben ser autenticadas para prevenir el acceso no autorizado. Esto se logra mediante un sólido proceso de verificación de firma basado en HMAC. Para obtener información detallada sobre los puntos finales de la API y sus parámetros, consulte la [Documentación de la API](/docs/api/intro).

-   **Clave de API**: Cada solicitud debe incluir una `API-KEY` válida en sus encabezados.
-   **Firma HMAC**: Se debe proporcionar un encabezado `HASH-SIGNATURE`, que es un hash **HMAC-SHA256** del cuerpo de la solicitud, firmado con el `API-SECRET` compartido.

El servidor valida la clave de API y recalcula el hash de forma independiente. Luego, realiza una comparación en tiempo constante con la firma proporcionada para prevenir ataques de temporización. Cualquier solicitud con una clave o firma inválida es rechazada de inmediato.

*Referencia: `server/pkg/controllers/auth.go` (`HandleAuthHeaderCheck`)*

### 2. Autenticación y Autorización de Usuarios

Antes de que un usuario pueda conectarse a la infraestructura en tiempo real de una sala (NATS y LiveKit), su token de acceso debe ser verificado.

1.  El cliente envía su token de acceso al punto final `/api/verifyToken`.
2.  El servidor backend valida el JWT, verifica si existen conexiones duplicadas, comprueba que el usuario no esté en una lista de bloqueo y se asegura de que la sala no exceda su límite de participantes.
3.  Tras una verificación exitosa, el servidor proporciona los detalles de conexión necesarios, incluyendo las URLs de WebSocket de NATS y una lista de temas (subjects) de NATS con los que el usuario tiene permitido interactuar.

Todas las llamadas de API subsiguientes del cliente al backend durante la sesión requieren el encabezado `Authorization` con el token de acceso del usuario.

Para mantener una sesión segura e ininterrumpida, la aplicación cliente es responsable de renovar de forma proactiva el token de acceso antes de que expire. Este proceso de renovación ocurre de forma segura a través de NATS: el cliente envía una solicitud de renovación a través de NATS y el servidor responde con un nuevo token actualizado a través del mismo canal seguro.

*Referencias: `server/pkg/controllers/auth.go` (`HandleVerifyToken`), `client/src/helpers/api/plugNmeetAPI.ts`*

### 3. Cifrado de Extremo a Extremo (E2EE)

Plug-N-Meet proporciona un sólido cifrado de extremo a extremo (E2EE) para todos los datos entre pares, incluyendo flujos de medios (audio, video, pantalla compartida), mensajes de chat, datos de la pizarra y todas las notificaciones. Esto garantiza que el servidor nunca pueda acceder al contenido sin cifrar.

#### 3.1. Claves Generadas por el Servidor

Cuando se crea una sala con E2EE habilitado pero `enabled_self_insert_encryption_key` es `false`, el servidor backend genera de forma segura una cadena aleatoria de 32 bytes para que sirva como secreto base. Este secreto se almacena como parte de los metadatos de la sala y se distribuye a los participantes autenticados cuando se unen.

-   Al recibir este secreto, la aplicación del lado del cliente **no** lo usa directamente para el cifrado.
-   En su lugar, procesa el secreto mediante el algoritmo **PBKDF2 (Password-Based Key Derivation Function 2)**, utilizando el **ID de sesión** único de la sala como "sal" (salt). Esto garantiza que, incluso si se reutiliza el mismo `roomId`, cada sesión genere una clave criptográfica única.
-   De este proceso se deriva una clave AES-256 robusta que se utiliza para todas las operaciones de cifrado y descifrado posteriores.

*Referencias: `protocol/utils/create_room.go` (`SetCreateRoomDefaultValues`), `protocol/proto_files/plugnmeet_create_room.proto`*

#### 3.2. Claves Proporcionadas por el Usuario

Para la máxima seguridad y un modelo de confianza cero (zero-trust), las salas pueden configurarse con `enabled_self_insert_encryption_key` establecido en `true`.

-   En este modo, se solicita a cada usuario que ingrese una clave secreta o frase de contraseña al unirse. Es responsabilidad de los participantes coordinar y compartir la misma clave secreta, ya que el servidor tiene conocimiento cero de la clave, puesto que esta nunca abandona el dispositivo del usuario en texto plano. Si los participantes usan claves diferentes, no podrán comunicarse entre sí en la sesión cifrada.
-   La aplicación del lado del cliente procesa esta frase de contraseña a través del mismo robusto algoritmo **PBKDF2**, utilizando el **ID de sesión** único de la sala como "sal". Este proceso es intencionalmente lento para hacer inviables los ataques de fuerza bruta contra la frase de contraseña del usuario.
-   La robusta clave criptográfica derivada de este proceso se utiliza para todo el cifrado y descifrado, asegurando que el secreto original del usuario nunca se use directamente y esté protegido contra ataques.

*Referencias: `client/src/components/extra-pages/InsertE2EEKey.tsx`, `client/src/helpers/libs/cryptoMessages.ts` (`importSecretKeyFromPlainText`), `client/src/helpers/nats/ConnectNats.ts` (`createMediaServerConn`)*

### 4. Seguridad del Transporte y de los Datos en Tránsito

#### 4.1. Comunicación NATS

La comunicación para la señalización, el chat y otros mensajes de datos se maneja a través de NATS.

-   **Permisos**: Cuando un usuario se conecta a NATS, el `nats-auth-controller` en el backend genera dinámicamente un conjunto de permisos basados en el token validado del usuario. Esto limita estrictamente a qué temas (subjects) puede publicar o suscribirse un usuario, aplicando el principio de mínimo privilegio.
-   **E2EE**: Si el E2EE está habilitado para la sala, todas las cargas de datos (ej., mensajes de chat, actualizaciones de la pizarra) se cifran en el lado del cliente *antes* de ser publicadas en NATS. El servidor se limita a enrutar los bloques de datos cifrados.

*Referencias: `server/pkg/controllers/nats_auth_controller.go`, `client/src/helpers/nats/ConnectNats.ts`*

#### 4.2. Servidor de Medios (LiveKit)

Los flujos de medios son gestionados por LiveKit, que tiene soporte integrado para E2EE.

-   La misma clave criptográfica utilizada para los datos de NATS se pasa al SDK de LiveKit.
-   El SDK del cliente de LiveKit maneja el cifrado y descifrado de todas las pistas de audio, cámara web y pantalla compartida directamente en el dispositivo del usuario. El servidor de medios (SFU) retransmite únicamente paquetes de medios cifrados.

*Referencia: `client/src/helpers/livekit/ConnectLivekit.ts`*

#### 4.3. Pasarela SIP (SIP Gateway)

La función de marcación telefónica está impulsada por el proyecto **[livekit/sip](https://github.com/livekit/sip)**. Esta es una función avanzada que requiere que el administrador del servidor la configure con un proveedor externo de troncales SIP para servir de puente para las llamadas entre la red telefónica (PSTN) y su sesión de WebRTC.

-   **Responsabilidad del administrador:** Usted, como administrador, es responsable de la configuración y seguridad de esta integración. Para obtener instrucciones detalladas de configuración, consulte el [repositorio oficial de livekit/sip en GitHub](https://github.com/livekit/sip).
-   **Cifrado de transporte (SRTP):** El servicio `livekit/sip` admite `SIPMediaEncryption` (SRTP), que cifra el flujo de audio entre la pasarela SIP y su proveedor. Es su responsabilidad habilitar esto y asegurarse de que su proveedor lo admita.
-   **Incompatibilidad con E2EE:** La pasarela SIP debe procesar audio sin cifrar para conectar la llamada entre las redes PSTN y WebRTC. Debido a esto, es, **por su naturaleza, incompatible** con el cifrado de extremo a extremo. La función de marcación SIP se desactiva automáticamente para cualquier sala donde el E2EE esté activo.

### 5. Servicios de IA y Privacidad de Datos (La Plataforma Insights)

La plataforma Insights de Plug-N-Meet se integra con proveedores de IA de terceros (como Microsoft Azure y Google) para ofrecer funciones avanzadas. Como operador de la plataforma, es su responsabilidad comprender cómo se manejan estos datos y actualizar su propia política de privacidad para reflejarlo.

#### 5.1. Funciones de IA Basadas en Audio

Las funciones que requieren comprender las palabras habladas, como la **Conversión de Voz a Texto (Speech-to-Text)**, las **Traducciones Habladas** y los **Resúmenes de Reuniones con IA**, funcionan procesando el audio de la reunión.

*   **Cómo funciona:** Cuando se habilitan estas funciones, un agente de IA se une a la sesión. Este agente captura el flujo de audio mezclado de la reunión y lo envía directamente al proveedor de IA configurado para su procesamiento.
*   **Flujo de datos:** Los datos de audio se transmiten desde su servidor Plug-N-Meet hacia los servidores del proveedor de IA de terceros.

#### 5.2. Funciones de IA Basadas en Texto

Las funciones basadas en texto tienen diferentes modelos de flujo de datos según su propósito.

*   **Traducción de chat:** Esta es una función de **difusión (broadcast)**. Cuando un usuario envía un mensaje de chat, el texto se envía al proveedor de IA para su traducción. El texto traducido es recibido por el servidor Plug-N-Meet y se transmite a los participantes pertinentes.
*   **Asistente de chat con IA:** Esta es una función **privada e individual**. Cuando un usuario envía un mensaje al asistente de IA, ese mensaje se envía al proveedor de IA. La respuesta se devuelve **exclusivamente a ese usuario específico** y no se transmite a nadie más en la reunión.

#### 5.3. El Impacto del Cifrado de Extremo a Extremo (E2EE)

Su privacidad y seguridad son nuestra máxima prioridad. La interacción entre las funciones de IA y el E2EE está diseñada para ser segura por defecto.

*   **Cuando el E2EE está habilitado con una clave proporcionada por el usuario (`enabled_self_insert_encryption_key: true`), todas las funciones de IA basadas en audio se desactivan automáticamente.** Esta es una medida de seguridad deliberada. El agente de IA no puede descifrar el flujo de audio y, por lo tanto, no puede funcionar.
*   **Las funciones basadas en texto, como la traducción de chat y el asistente de chat con IA, seguirán funcionando.** Esto se debe a que el texto se envía al proveedor de IA *antes* de ser cifrado para su transporte a través de NATS.

**Aviso legal para operadores:** Usted es el responsable del tratamiento de los datos. Es su responsabilidad informar a sus usuarios que cuando las funciones de IA están habilitadas, sus datos de audio y/o texto serán procesados por proveedores de IA de terceros. Debe asegurarse de que sus términos de servicio y política de privacidad reflejen de manera transparente este flujo de datos.

### 6. Flujo de Sesión Segura

El proceso de conexión de extremo a extremo está diseñado con seguridad en cada paso. El flujo exacto puede variar según la configuración de la sala (p. ej., si el E2EE está habilitado).

1.  **Verificación de token**: El cliente verifica su token de acceso con el backend.
2.  **Conexión NATS**: El cliente se conecta a NATS utilizando las credenciales del paso 1. El servicio de autenticación de NATS otorga permisos detallados para la sesión.
3.  **Obtención de datos iniciales**: El cliente solicita los datos iniciales de la sala a través de la conexión segura de NATS.
4.  **(Condicional) Importación de clave E2EE**: Si el cifrado de extremo a extremo está habilitado para la sala, el cliente importa la clave E2EE. Esta clave se recibe del servidor o se deriva de la entrada manual del usuario, según la configuración de E2EE de la sala.
5.  **Conexión de medios**: El cliente se conecta al servidor de medios LiveKit. Si el E2EE está activo, habilita el cifrado con la clave importada.
6.  **Comunicación segura**: Todos los datos y medios subsiguientes se manejan ahora de acuerdo con la configuración de seguridad de la sala, con el E2EE aplicado si fue habilitado.

### 7. Almacenamiento en el Navegador (IndexedDB)

Para mejorar la experiencia del usuario y garantizar la continuidad de la sesión, la aplicación utiliza el almacenamiento IndexedDB integrado del navegador. Esto se utiliza con fines estrictamente funcionales, como restaurar la sesión de un usuario si actualiza accidentalmente su página.

Para lograr esto, la aplicación almacena temporalmente datos de sesión efímeros en el dispositivo local del usuario final. Las categorías de datos almacenados pueden incluir, entre otros:

*   **Preferencias de usuario y sesión:** Para recordar configuraciones como el idioma de subtítulos elegido.
*   **Contenido e historial de la sesión:** Para restaurar mensajes de chat, transcripciones de voz a texto y el estado de la pizarra.
*   **Cachés de rendimiento:** Como imágenes en caché para mejorar los tiempos de carga.

#### Ciclo de Vida de los Datos y Cifrado

Los datos almacenados en IndexedDB están diseñados para ser efímeros y se manejan de la siguiente manera:

*   **Cifrado:** Los datos almacenados en IndexedDB **no están cifrados** por la aplicación. Esta es una elección de diseño deliberada, ya que los datos residen en el propio dispositivo del usuario final y están protegidos por las medidas de seguridad del sistema operativo y el perfil del navegador del usuario. El enfoque principal de seguridad está en cifrar los datos *en tránsito* y asegurar que no se persistan en ningún servidor.
*   **Fin de sesión normal:** Cuando un usuario finaliza correctamente su sesión (p. ej., haciendo clic en "Finalizar reunión" o "Salir de la reunión"), todos los datos almacenados para esa sesión se **eliminan de forma inmediata y permanente** del navegador.
*   **Fin de sesión anormal (p. ej., cerrar la pestaña del navegador):** Si una sesión no finaliza correctamente, los datos permanecen en el IndexedDB del navegador. Sin embargo, en el siguiente inicio de la aplicación, se ejecuta un proceso de limpieza. Este proceso identifica y elimina automáticamente cualquier dato almacenado de sesiones anteriores que haya superado una antigüedad máxima predefinida (p. ej., varias horas). Esta antigüedad máxima es configurable y está sujeta a cambios en futuras versiones para optimizar el rendimiento y la privacidad.

**Puntos Clave:**

*   Estos datos se almacenan **solo en el navegador del usuario final** y nunca se transmiten a otro lugar con fines de almacenamiento.
*   El almacenamiento es esencial para la funcionalidad esperada de la aplicación y no se utiliza para seguimiento o análisis.

**Aviso legal para operadores:** Como la persona u organización que despliega este software, usted es responsable de crear y mantener su propia Política de Privacidad. Debe utilizar esta información para asegurarse de que su política sea transparente y cumpla con cualquier regulación de protección de datos aplicable (p. ej., GDPR).

### 8. Manejo y Persistencia de Datos en el Servidor

Para proporcionar una imagen completa del ciclo de vida de los datos, esta sección describe cómo se manejan y almacenan los datos en el lado del servidor. La arquitectura está diseñada para separar los datos volátiles en tiempo real de los datos persistentes a largo plazo, con un fuerte énfasis en la retención de datos controlada por el usuario.

#### 8.1. Estado de la Sesión en Tiempo Real (Redis o NATS KV)

Durante una reunión activa, el servidor necesita gestionar el estado en tiempo real de la sala, como la lista de participantes, su estado de silencio y otros metadatos inmediatos. Esto se maneja mediante un almacén de clave-valor en memoria de alto rendimiento (ya sea Redis o NATS KV).

-   **Propósito:** Coordinación rápida y en tiempo real de una sesión activa.
-   **Ciclo de vida:** Estos datos son volátiles y están vinculados a la vida de la sesión. Se borran automáticamente cuando finaliza la sesión.

#### 8.2. Base de Datos Persistente (MariaDB)

Para fines de referencia histórica y administrativos, se almacena un pequeño subconjunto de información no sensible en una base de datos relacional persistente (MariaDB).

-   **Propósito:** Mantenimiento de registros a largo plazo de las reuniones ocurridas.
-   **Datos almacenados:** Esto típicamente incluye información básica de la sala como `roomId`, `title`, hora de creación/finalización, etc.

#### 8.3. Datos de Análisis Opcionales

PlugNmeet ofrece la opción de persistir análisis detallados de una sesión para ayudar a los administradores a comprender los patrones de uso. Esta función se rige por una configuración que proporciona a los administradores el control sobre la retención de datos.

-   **Control del usuario:** La decisión de **persistir** los datos de análisis la toma el administrador por cada sala mediante el flag `enable_analytics`, adhiriéndose al principio de privacidad por defecto.
-   **Datos recopilados (Metadatos, no contenido):** Para proteger la privacidad del usuario, PlugNmeet **no almacena el contenido sin procesar** de las interacciones del usuario en sus análisis. En su lugar, agrega metadatos y contadores de eventos. Por ejemplo, el sistema registra:
    -   El *número de veces* que un usuario envió un mensaje de chat, no los mensajes de chat en sí.
    -   El *número de veces* que un usuario dibujó en la pizarra, no el contenido de los dibujos.
    -   La *duración total* que un usuario habló, no el audio de lo que dijo.
    -   Otros eventos de participación como horas de unión/salida, archivos cargados y votos en encuestas.
-   **Almacenamiento:** Si se persisten, estos metadatos agregados **siempre se almacenan como un archivo JSON** en el sistema de archivos del servidor. Una referencia al nombre del archivo y su sala asociada se almacena luego en una tabla dedicada en la base de datos persistente para una fácil recuperación.
-   **Ciclo de vida:** Los datos de análisis se agregan en memoria durante el transcurso de una sesión activa. Al finalizar la sesión, el sistema verifica la configuración `enable_analytics` de la sala.
    -   Si es `true`, los metadatos agregados se escriben en un archivo JSON y su referencia se guarda en la base de datos.
    -   Si es `false`, los datos en memoria se descartan inmediatamente y no se persisten de ninguna forma.

#### 8.4. Grabaciones en la Nube

Cuando se habilita la grabación en la nube para una sesión, el archivo de medios resultante (MP4) se almacena en el servidor.

-   **Propósito:** Proporcionar un registro persistente y compartible de una reunión.
-   **Almacenamiento:** Los archivos MP4 se almacenan en un directorio configurable en el sistema de archivos del servidor. Para permitir una fácil gestión y recuperación a través de la API, se almacena una referencia a cada grabación (incluyendo su `record_id`, `roomId` asociado, `file_path`, `file_size` y marca de tiempo de creación) en una tabla dedicada en la base de datos persistente.
-   **Control del usuario y ciclo de vida:** La gestión de estas grabaciones está totalmente controlada por el administrador a través de la API. Las grabaciones se retienen en el servidor indefinidamente hasta que se eliminan explícitamente mediante la llamada a la API `/recording/delete`. Esto le da al administrador el control total sobre el ciclo de vida de retención de datos.
-   **Incompatibilidad con E2EE:** La grabación del lado del servidor es **fundamentalmente incompatible** con el cifrado de extremo a extremo de confianza cero. Por lo tanto, la grabación en la nube se desactiva automáticamente y no se puede iniciar si la sala está configurada con `enabled_self_insert_encryption_key: true`. Esto se debe a que el servidor no tiene acceso a los flujos de medios no cifrados necesarios para crear la grabación, que es la garantía principal del modelo E2EE.

#### 8.5. Artefactos del Servicio de IA

Cuando se utilizan funciones de IA como la transcripción o el resumen, estas generan artefactos de datos valiosos. Al igual que con las grabaciones en la nube y los análisis, Plug-N-Meet le da al administrador el control total sobre estos datos.

-   **Propósito:** Proporcionar un registro persistente y recuperable de la inteligencia de la reunión generada por IA.
-   **Almacenamiento:** Los archivos generados (ej., archivos de transcripción VTT, resúmenes de texto) se almacenan en un directorio configurable en el sistema de archivos del servidor. Para permitir una fácil gestión y recuperación, se almacenan los **metadatos** sobre estos artefactos (como el `roomId` asociado, `file_path`, uso de tokens de IA y duración del habla) en la tabla `pnm_room_artifacts` de la base de datos persistente.
-   **Control del usuario y ciclo de vida:** La gestión de estos artefactos está totalmente controlada por el administrador a través de la API. Usted puede:
    -   **Descargar** los archivos de transcripción o resumen.
    -   **Eliminar el archivo del artefacto:** La API le permite eliminar los archivos generados del sistema de archivos del servidor para ahorrar espacio de almacenamiento.
    -   **Metadatos retenidos:** Los metadatos asociados en la tabla `pnm_room_artifacts` están vinculados al historial de la reunión y se **retienen** para sus registros, incluso después de que se elimine el archivo. Esto asegura que siempre tenga un registro permanente para auditar y analizar el uso y los costos del servicio de IA.

---

Este enfoque por capas para la seguridad y el manejo de datos hace más que solo proteger contra amenazas comunes; proporciona un marco transparente y flexible que lo pone a usted, el operador, al mando. Al combinar medidas de seguridad sólidas con una filosofía de "**_privacidad por diseño_**", Plug-N-Meet le brinda las herramientas y la transparencia necesarias para cumplir con sus propias obligaciones de privacidad y cumplimiento con confianza.
