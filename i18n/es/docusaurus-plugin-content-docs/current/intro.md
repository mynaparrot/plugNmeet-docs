---
title: plugNmeet – Plataforma de videoconferencia autoalojada de código abierto
description: plugNmeet es la plataforma de videoconferencia autoalojada y de código abierto para su sitio web o aplicación. Descubra qué es, para quién es, cómo funciona y cómo empezar.
keywords: [código abierto, webrtc, videoconferencia, autoalojado, on-premise, videochat, seminario web, aula virtual, alternativa a zoom, api de video, ia]
sidebar_position: 1
sidebar_label: Introducción
---

# plugNmeet: videoconferencia autoalojada de código abierto para su sitio web

Bienvenido a plugNmeet, la plataforma de videoconferencia pensada para ofrecerle el máximo control, flexibilidad y una **escalabilidad rentable**. Organice reuniones seguras, de alta calidad e **impulsadas por IA** directamente desde su sitio web, con su propia marca y con pleno dominio sobre la experiencia del usuario.

Lo que realmente distingue a plugNmeet es su **capacidad de personalización sin igual**. La interfaz se controla por completo, lo que le permite adaptar cada detalle: desde la imagen de marca con su logotipo y sus colores, hasta la activación de funciones concretas para crear desde un videochat minimalista hasta un **aula virtual** completa, o incluso un gran evento en directo con **cientos de participantes**.

:::tip En 30 segundos
- **Qué es:** Una sala de reuniones completa: audio y video, pantalla compartida, pizarra, chat, encuestas, salas de grupos, grabación, transmisión en directo e IA para resúmenes y transcripciones.
- **Cómo se controla:** Instale el servidor gratuito en su propio servidor u olvide la infraestructura con [plugNmeet Cloud](https://www.plugnmeet.cloud). En ambos casos la reunión funciona bajo su marca.
- **Cómo se utiliza:** Plugins sin código para WordPress, Moodle, Joomla y cualquier LMS mediante LTI, o bien la API de plugNmeet + SDK para aplicaciones a medida.
- **Por qué lo eligen los equipos:** Privacidad desde el diseño con cifrado de extremo a extremo opcional, marca blanca real mediante configuración (sin modificar el código) y una arquitectura ligera y escalable.
:::

## ¿Qué perfil tiene usted? Elija su punto de partida

| Si usted es… | Obtiene… | Empiece aquí |
|---|---|---|
| **Creador, docente o empresa** — quiere video en su sitio sin programar | Instale un plugin, introduzca la URL del servidor + la clave y cree reuniones desde su panel | [Resumen de la guía de usuario](/docs/user-guide/overview) |
| **Administrador o responsable de infraestructura** — le importan la privacidad, el coste y el control | Un servidor Go en un único binario + script de instalación automática; sus datos y sus grabaciones le pertenecen | [Guía rápida de instalación](/docs/installation) |
| **Desarrollador** — quiere integrar, automatizar o publicar aplicaciones móviles | API de plugNmeet, SDK para PHP/JS, webhooks, aplicaciones móviles a medida y personalización total de la interfaz sin quedar atrapado en un iframe | [Guía de desarrollo](/docs/developer-guide/intro) · [Introducción a la API](/docs/api/intro) |

Los caminos se pueden combinar: muchos equipos autoalojan el servidor una vez, mientras el profesorado utiliza el plugin de Moodle y los desarrolladores automatizan las salas mediante la API.

## ¿Qué puede crear con plugNmeet?

El mismo motor da lugar a productos muy distintos; basta con activar lo que necesite:

- **Aula virtual y formación:** Pizarra + bloc de notas compartido + encuestas + salas de grupos + asistencia mediante [analíticas](/docs/others/analytics). Funciona desde Moodle, WordPress o cualquier LMS vía [LTI](/docs/user-guide/lti).
- **Seminario web y evento en directo:** Sala de espera, controles de moderación, [transmisión en directo por RTMP](/blog/custom-qna-webinar-rtmp-broadcast-api) hacia YouTube/Facebook, [entrada profesional desde OBS](/blog/obs-rtmp-whip-ingress) por RTMP/WHIP y reproducción sincronizada de video para todos.
- **Telemedicina y consultoría privada:** Acceso solo con navegador, sala bloqueable, permisos por usuario y [cifrado de extremo a extremo](/docs/security-overview) opcional, donde ni siquiera el servidor puede leer el audio ni el chat.
- **Llamadas para comunidades o marketplaces:** Videochat minimalista integrado en su producto, con su logotipo, sus colores y su dominio. Sin mención alguna a plugNmeet.
- **Reuniones internas e integración con ERP:** Salas creadas por API, inicio de sesión con sus usuarios actuales y grabaciones en MP4 estándar en su propio almacenamiento.
- **Aplicaciones móviles y de escritorio a medida:** Publique su propia aplicación con marca para iOS, Android, Flutter, React Native o escritorio gracias a la [integración híbrida](/docs/developer-guide/mobile-app-integration): rendimiento multimedia nativo más la interfaz web completa de plugNmeet en un WebView, sin depender de un SDK móvil propietario.

Si viene de BigBlueButton, consulte [Migrar desde BigBlueButton](/docs/tutorials/migration-from-bbb): plugNmeet entiende la API de BBB, de modo que sus aplicaciones actuales siguen funcionando.

## Capacidades principales de un vistazo

No necesita aprenderlo todo el primer día. Esta es la caja de herramientas completa que su sala puede ofrecer:

### Reunirse sin fricciones
- **Audio y video HD con fondos virtuales**, acceso desde cualquier navegador moderno, sin instalar nada. Véase [Guía del participante](/docs/user-guide/attendee).
- **Estable incluso con redes débiles:** La calidad adaptativa reduce las miniaturas y pausa los videos fuera de pantalla para evitar cortes.
- **Pantalla compartida en HD**, chat público + privado con envío de archivos.

### Colaborar en directo
- **Pizarra interactiva:** Dibuje en equipo, suba PDF u Office y anote sobre ellos.
- **Bloc de notas compartido** para actas en directo.
- **Incruste cualquier contenido web** (Google Doc, panel de control) o reproduzca un video de YouTube o un archivo de forma sincronizada para todos.

### Dinamizar y moderar
- **Salas de grupos** para trabajo en equipos pequeños, **encuestas con modo cuestionario**, mano levantada, sala de espera.
- **Permisos detallados:** Bloquee micrófono, cámara, chat o pizarra por participante. Véase [Guía del moderador](/docs/user-guide/moderator).

### Grabar y transmitir
- **Grabación en la nube a MP4** en su servidor + grabación local en el navegador.
- **Transmisión en directo a YouTube/Facebook** por RTMP, y entrada profesional desde [OBS por RTMP/WHIP](/blog/obs-rtmp-whip-ingress).
- **Acceso telefónico (SIP)** para unirse solo por audio, sin internet.

### Convertir las reuniones en conocimiento con IA
- Subtítulos en directo, traducción hablada, transcripciones, resúmenes y asistente de chat, con su propio proveedor de IA (compatible con OpenAI).
- Usted decide cuándo actúa la IA y adónde van los datos. Las salas con E2EE desactivan de forma automática la IA del servidor que necesitaría escuchar el audio. Detalles en [Resumen de seguridad](/docs/security-overview).

### Seguridad y control
- Datos autoalojados, API firmada con HMAC + sesiones JWT, TLS en todo momento y **cifrado de extremo a extremo (E2EE)** opcional para audio, video y chat.
- Analíticas por sala con metadatos (conteos, no contenido) y auditoría completa por API. Empiece por [Seguridad y privacidad](/docs/security-overview).

## Cómo funciona: solo 3 piezas

Olvide los diagramas complejos. Solo hay tres piezas:

1. **Servidor plugNmeet: el motor.** Ejecuta sus conferencias y gestiona salas, usuarios, grabaciones e integraciones de IA. Puede autoalojarlo o utilizar Cloud.
2. **Interfaz de reunión: la sala.** El cliente web moderno que ven sus usuarios. Marca blanca total mediante configuración: logotipo, colores, funciones activadas o no, sin modificar el código.
3. **Conexión: el puente.** Enlaza su sitio web con el servidor:
   - **Sin código:** Plugin de WordPress / Joomla / Moodle, o cualquier LMS mediante LTI y compatibilidad con BBB.
   - **Con código:** La API de plugNmeet + SDK crean salas y generan enlaces de acceso desde su sistema. Para iOS, Android, Flutter, React Native o escritorio, utilice la [integración móvil híbrida](/docs/developer-guide/mobile-app-integration) con los SDK nativos de LiveKit + interfaz WebView.

```
Usuarios (navegador, 1 clic, sin instalar nada)
  |
Su sitio/app (WordPress, Moodle, Joomla o código a medida)
  |  crea la sala + el enlace mediante la API
Servidor plugNmeet (su propio servidor o Cloud)
  |  aloja audio, video, chat y grabaciones cifrados
Sala de reunión (su marca, su dominio)
```

Su sistema nunca expone el secreto: firma la petición a la API, obtiene un token de corta duración para ese usuario y lo redirige a la sala.

## Bajo el capó (para perfiles técnicos)

Si evalúa la arquitectura, esto es lo esencial:

- **Un único binario en Go** para la lógica de aplicación: sin entornos que gestionar, fácil de desplegar y de escalar en horizontal.
- **LiveKit (SFU)** para el enrutamiento multimedia con simulcast/dynacast: cada participante sube una vez y el servidor distribuye con eficiencia.
- **NATS JetStream** para señalización, chat y estado colaborativo, con permisos mínimos por usuario y sala, y TLS.
- **Grabador independiente** que genera MP4 portable. Ejecútelo en otra máquina para que la transcodificación nunca ralentice las reuniones en directo.
- **Redis/NATS-KV (efímero) + MariaDB (historial)**: el estado en directo desaparece al terminar la sesión; solo se conserva lo que usted decide (grabaciones, JSON de analíticas, artefactos de IA).
- **API-first + compatible con BBB:** `POST /auth/*` con `API-KEY` + `HMAC-SHA256`, SDK para [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php) y [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js), [webhooks](/docs/others/webhooks) y [hooks](/docs/others/hooks) para flujos de trabajo, compatibilidad `/bigbluebutton/` para una migración directa y [aplicaciones móviles híbridas](/docs/developer-guide/mobile-app-integration) con SDK nativos de LiveKit + WebView (sin SDK móvil propietario).

Lecturas a fondo: [Arquitectura interna con LiveKit y NATS](https://www.plugnmeet.org/blog/backend-architecture-deep-dive), [Despliegue escalable](/docs/developer-guide/scalable-setup), [Por qué creamos plugNmeet](https://www.plugnmeet.org/blog/why-we-built-plugnmeet).

## Por qué los equipos eligen plugNmeet frente al SaaS o a plataformas pesadas

- **Sus datos y su marca son suyos:** Su dominio, su logotipo, su almacenamiento. Sin dependencia de terceros ni coste por usuario para reuniones básicas.
- **Marca blanca sin modificar el código:** Cambie aspecto y funciones por API/configuración y CSS propio. Las actualizaciones no rompen su diseño.
- **Ligero de operar:** Un binario + LiveKit + NATS en lugar de arquitecturas enormes en varios lenguajes. Un servidor pequeño basta para probar; el escalado vertical + grabador aislado cubre cientos de usuarios concurrentes antes de necesitar un clúster.
- **Grabaciones portables:** Archivos MP4 estándar que puede descargar, combinar o mover, sin procesos propietarios complicados.
- **Pensado para quienes construyen:** Desde plugins CMS en un clic hasta incrustación headless con `getClientFiles`, [aplicaciones móviles a medida](/docs/developer-guide/mobile-app-integration) y automatización total; nunca queda atado a la interfaz de otro.

## Empiece en 15 minutos

### Paso 1: obtenga un servidor

**Opción A: autoalojado (gratuito, control total)**

Necesita un servidor limpio con Ubuntu/Debian, IP pública, 2 subdominios y un correo para el SSL. Después:

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh
sudo bash install.sh
```

Guarde al final la URL del servidor, la clave API y el secreto. Lista completa en [Guía rápida de instalación](/docs/installation).

**Opción B: Cloud (gestionado, lo más rápido)**

Sin trabajo de servidor. Cree una cuenta en **[plugNmeet Cloud](https://www.plugnmeet.cloud)**, obtenga sus credenciales y empiece con el [plan gratuito](https://www.plugnmeet.cloud/pricing). Mismo modelo de privacidad, más enrutamiento geográfico para audiencias globales.

### Paso 2: conéctelo a su sitio

- **¿WordPress / Joomla / Moodle?** Instale el plugin oficial, pegue los datos del servidor y cree su primera sala. Véase [WordPress](/docs/user-guide/wordPress-integration), [Joomla](/docs/user-guide/joomla-integration), [Moodle](/docs/user-guide/moodle-integration), [LTI](/docs/user-guide/lti).
- **¿Aplicación a medida?** Siga [Inicio rápido con PHP](/docs/tutorials/quick_php) o lea [Introducción a la API](/docs/api/intro): crear sala → generar token → redirigir al usuario. Para empezar no necesita ningún SDK de frontend.

## Pruébelo ahora mismo: demostración en vivo

Explore la interfaz y pruebe la API sin instalar nada:

**Demostración de sala:** [https://demo.plugnmeet.com/landing.html](https://demo.plugnmeet.com/landing.html)

**API de demostración para desarrolladores:**
```
URL del servidor plugNmeet: https://demo.plugnmeet.com
Clave de API de plugNmeet: plugnmeet
Secreto de API de plugNmeet: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

## Próximos pasos

- **¿Solo quiere utilizarlo?** → [Resumen de la guía de usuario](/docs/user-guide/overview) → [Guía del moderador](/docs/user-guide/moderator)
- **¿Quiere alojarlo?** → [Instalación](/docs/installation) → [Resumen de seguridad](/docs/security-overview)
- **¿Quiere desarrollar sobre él?** → [Guía de desarrollo](/docs/developer-guide/intro) → [Introducción a la API](/docs/api/intro) → [Inicio rápido con PHP](/docs/tutorials/quick_php)
- **¿Necesita escala o migración?** → [Despliegue escalable](/docs/developer-guide/scalable-setup) → [Migrar desde BBB](/docs/tutorials/migration-from-bbb)
- **¿Le gusta el proyecto?** Apóyenos en [GitHub](https://github.com/mynaparrot/plugNmeet-server) y únase a [Discord](https://discord.gg/2X2ZaCHu4C).
