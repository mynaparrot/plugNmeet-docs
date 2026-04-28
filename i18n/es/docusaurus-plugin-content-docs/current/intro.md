---
title: Introducción a plugNmeet | Su solución de videoconferencia auto-alojada
description: Una introducción a plugNmeet, la plataforma de videoconferencia de código abierto diseñada para el control, la flexibilidad y el escalado rentable.
keywords: [código abierto, webrtc, videoconferencia, auto-alojado, on-premise, video chat, webinar, aula virtual, alternativa a zoom, api de video, ai]
sidebar_position: 1
sidebar_label: Introducción
---

# Plug-N-Meet: Su solución de conferencias WebRTC de código abierto

Bienvenido a Plug-N-Meet, la plataforma de videoconferencia diseñada para el máximo control, flexibilidad y **escalado rentable**. Organice reuniones seguras, de alta calidad y **potenciadas por IA** directamente desde su sitio web, con su propia marca y propiedad completa de la experiencia del usuario.

Lo que realmente diferencia a Plug-N-Meet es su **personalización inigualable**. La interfaz es totalmente controlable, lo que le permite adaptar toda la experiencia, desde el simple branding con su propio logotipo y colores, hasta la habilitación de funciones específicas para crear cualquier cosa, desde un chat de video minimalista hasta un **aula virtual** con todas las funciones, o incluso un evento masivo en vivo con **cientos de participantes**.

## Diseñado para todos, desde individuos hasta empresas

La flexibilidad de Plug-N-Meet lo convierte en la solución perfecta para una amplia gama de usuarios que valoran la privacidad, la personalización y el control.

-   **Para educadores y formadores:** Desde **tutores independientes** y **formadores en línea**, hasta padres que dirigen sesiones de **educación en el hogar en línea**, hasta **centros de aprendizaje de idiomas** a gran escala o **aulas virtuales** universitarias masivas.
-   **Para profesionales de la salud:** Proporcionando sesiones seguras, privadas y con E2EE habilitado para **asesoramiento psicológico**, **consultas de telemedicina** y otros servicios médicos confidenciales.
-   **Para empresas, ONGs y organizaciones de alta seguridad:** Desde la coordinación de esfuerzos para **organizaciones sin fines de lucro (ONG)** hasta la organización de reuniones confidenciales para **bancos y agencias gubernamentales**, o la integración de un componente de video totalmente personalizado en un ERP corporativo, Plug-N-Meet proporciona la privacidad y el control que las organizaciones modernas requieren.
-   **Para desarrolladores e innovadores:** Creando un **chat de video con marca personalizada para una comunidad**, o integrando profundamente un potente motor de video en cualquier aplicación con nuestras herramientas de código abierto.

---

## Características principales

### Conferencias y colaboración principales
- **Audio y video de alta calidad:** Experimente audio claro y videollamadas HD fluidas. Los usuarios también pueden usar fondos virtuales para ocultar su entorno.
- **Conferencias basadas en el navegador:** Únase a las reuniones al instante en su navegador web con una interfaz moderna y ligera. No se requieren descargas ni instalaciones.
- **Streaming adaptativo (Simulcast y Dynacast):** Garantiza una experiencia de video fluida e ininterrumpida, incluso en redes lentas. Ahorra ancho de banda de forma inteligente al pausar las transmisiones de video de los participantes fuera de la pantalla y ajustar la calidad del video para las miniaturas. Esto evita el retraso y reduce significativamente el uso de datos para todos en la llamada.
- **Pantalla compartida en HD:** Comparta la pantalla de su computadora con otros en calidad de alta definición.
- **Pizarra interactiva y bloc de notas:** Dibujen y escriban juntos en un lienzo en blanco, o carguen archivos PDF y de Office para presentar y dibujar sobre ellos.
- **Chat público y privado:** Envíe mensajes y comparta archivos con todos en la reunión, o envíelos de forma privada a una sola persona.

### Herramientas de participación y moderación
- **Salas de grupos (Breakout Rooms):** Divida una reunión grande en salas más pequeñas y separadas para discusiones de grupo enfocadas.
- **Herramientas de moderación y participación:** Gestione su audiencia con funciones como encuestas, levantar la mano y una sala de espera para controlar quién se une a la reunión.
- **Permisos avanzados de participantes:** Controle lo que cada participante puede hacer, como bloquear su micrófono, cámara o chat.

### Grabación y transmisión en vivo
- **Grabación de reuniones:** Guarde las reuniones como archivos de video MP4 en su computadora (grabación local) o en la nube.
- **Transmisión en vivo por RTMP:** Transmita su reunión en vivo a YouTube, Facebook o cualquier otro servicio de streaming.
- **Ingreso RTMP y WHIP:** Use herramientas profesionales como OBS Studio para enviar video de alta calidad a su sala de reuniones.
- **Reproducción de video compartido:** Vea un video de YouTube o reproduzca un archivo de video para todos en la reunión al mismo tiempo.

### Integración avanzada y seguridad
- **Agente de reuniones con IA:** Convierta sus reuniones en inteligencia procesable. Nuestro potente agente de IA proporciona traducciones habladas en vivo, genera resúmenes automatizados, crea transcripciones completas, **y mucho más...**
- **Cifrado de extremo a extremo (E2EE):** Mantenga sus reuniones completamente privadas con el nivel más alto de seguridad para todo el audio, video y datos. Para profundizar en nuestra arquitectura de seguridad, incluyendo la autenticación y la protección de datos en tránsito, consulte nuestro detallado **[Resumen de seguridad](/docs/security-overview)**.
- **Marcado telefónico (SIP Gateway):** Permita que los participantes se unan al audio de su reunión marcando un número de teléfono estándar, sin necesidad de internet.
- **Subtítulos en vivo y traducción:** Vea las palabras habladas como texto en tiempo real, lo que le permite también traducir la conversación a diferentes idiomas.
- **Incrustar contenido web:** Muestre cualquier sitio web o aplicación en línea, como un Google Doc o un panel de control de proyectos, directamente dentro de la ventana de la reunión.
- **Analítica e informes:** Obtenga informes detallados sobre reuniones y usuarios para comprender cómo se está utilizando la plataforma.

---

## Cómo funciona

Ahora que ha visto lo que es posible, aquí está el concepto simple detrás de Plug-N-Meet. La plataforma tiene dos componentes:

1.  **El Servidor:** El potente motor que ejecuta sus videoconferencias.
2.  **La Integración:** El cliente que conecta el servidor a su sitio web (como un plugin o código personalizado).

Su primer paso es elegir cómo configurar su servidor.

## Paso 1: Elija su servidor

### Opción A: Auto-alojado (La forma de código abierto)
Para el máximo control, privacidad y personalización, puede instalar el servidor Plug-N-Meet de código abierto en su propio entorno. Proporcionamos un [script de instalación automatizado simple](/docs/installation) que maneja toda la configuración compleja del servidor por usted. **Esto significa que no necesita habilidades especiales de administración de sistemas;** si se siente cómodo usando una línea de comandos y siguiendo las instrucciones en pantalla, puede tener un servidor funcionando en minutos. Como software de código abierto, es **completamente gratuito para descargar, usar y modificar**, lo que le otorga la propiedad completa de sus datos y la capacidad de crear una experiencia de usuario totalmente personalizada y con su marca.

### Opción B: plugNmeet Cloud (La forma gestionada)
Si desea evitar la configuración y el mantenimiento del servidor, nuestro servicio oficial **[plugNmeet Cloud](https://www.plugnmeet.cloud)** le proporciona un servidor gestionado y listo para usar. Nuestra solución en la nube se basa en el mismo compromiso con la privacidad que nuestra versión de código abierto, siguiendo estrictas mejores prácticas de seguridad para mantener sus datos a salvo y sus conversaciones privadas.

Para despliegues a gran escala o globales, la versión en la nube también resuelve el complejo desafío de la latencia de red con nuestra función de **Distribución Geográfica Inteligente**. Enruta automáticamente a los participantes al servidor más cercano, lo que reduce drásticamente el retraso y garantiza una alta calidad para las reuniones internacionales.

Puede comenzar con un [plan gratuito](https://www.plugnmeet.cloud/pricing) y actualizar a medida que crezca. Esta es la forma más fácil de comenzar.

---

## Paso 2: Integrar con su sitio web

Una vez que tenga las credenciales de API de su servidor (ya sea de su configuración auto-alojada o de su cuenta Cloud), puede conectarlo a su sitio web.

#### Para sitios WordPress, Joomla y Moodle
Si usa un CMS popular, nuestros plugins oficiales son la forma más fácil de integrar. Simplemente instale el plugin y proporcione los detalles de su servidor.
- [Plugin de WordPress](/docs/user-guide/wordPress-integration)
- [Componente de Joomla](/docs/user-guide/joomla-integration)
- [Plugin de Moodle](/docs/user-guide/moodle-integration)
- [LTI para plataformas educativas](/docs/user-guide/lti)

#### Para aplicaciones personalizadas
Para los desarrolladores que crean aplicaciones personalizadas, proporcionamos SDKs oficiales y documentación completa de la API.

- **[Documentación de la API](/docs/api/intro):** La referencia completa para todos los puntos finales, parámetros y eventos en tiempo real disponibles.
- **SDKs:** Envoltorios convenientes para acelerar su desarrollo.
  - [PHP SDK](https://github.com/mynaparrot/plugNmeet-sdk-php)
  - [JavaScript SDK](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))
  - [Python SDK](https://github.com/vector-mj/plugnmeet-sdk) (Soportado por la comunidad)

---

## Demostración en vivo

Explore las características de Plug-N-Meet y pruebe su API con nuestra demostración en vivo.

**Explore las características:** [https://demo.plugnmeet.com/landing.html](https://demo.plugnmeet.com/landing.html)

**Credenciales de API de demostración para desarrolladores:**
```
URL del servidor plugNmeet: https://demo.plugnmeet.com
plugNmeet API KEY: plugnmeet
plugNmeet API SECRET: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```
