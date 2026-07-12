---
title: "Integración de plugNmeet con OpenAI: IA autoalojada para videoconferencias" 
description: "Configure las API compatibles con OpenAI en plugNmeet para habilitar la transcripción en vivo, traducción en tiempo real, traducciones de voz, chat de IA y resúmenes posteriores a las reuniones en su propio servidor de videoconferencias." 
authors: [jibon] 
tags: [plugnmeet, codigo-abierto, WebRTC, openai, transcripcion, traduccion, resumen-ia, tts, api-compatible, llm-autoalojado, videoconferencia, reuniones-ia] 
keywords: ["integracion plugNmeet OpenAI", "videoconferencia IA autoalojada", "API compatible con OpenAI videoconferencia", "transcripcion en vivo WebRTC", "traduccion de reuniones con IA", "resumen de reuniones autoalojado", "videoconferencia de codigo abierto", "Ollama API compatible OpenAI", "LocalAI plugNmeet espanol", "asistente de reuniones con IA"]
---

En **plugNmeet**, nuestra plataforma de videoconferencias de código abierto basada en WebRTC se ha desarrollado en torno a la flexibilidad, la privacidad y el control de los datos. Aunque plugNmeet ya es compatible con los servicios cognitivos especializados de **Azure** y **Google**, nos complace presentar una actualización de gran relevancia para el entorno de **Insights**: el **proveedor oficial de OpenAI para plugNmeet**.

Con esta integración, podrá incorporar potentes funciones de inteligencia artificial a su servidor de videoconferencias autoalojado. Entre ellas se incluyen la **transcripción en vivo**, la **traducción en tiempo real**, las **traducciones de voz mediante tecnología de texto a voz (TTS)**, la generación de **resúmenes de reuniones con IA** y un **asistente de chat con IA en la sala**.

Lo mejor de todo es que este proveedor se ha diseñado respetando el formato estándar de la API de OpenAI, lo que significa que podrá utilizar directamente los servicios de OpenAI o conectar plugNmeet a cualquier **API compatible con OpenAI**, incluyendo proveedores alternativos de IA y plataformas de modelos de lenguaje (LLM) autoalojados.

:::info[Adelanto y acceso anticipado]
Esta función se encuentra actualmente en las fases finales de revisión y está previsto que se incluya en el próximo lanzamiento.

Los desarrolladores que deseen probarla con antelación o revisar los detalles de la implementación pueden seguir el Pull Request en GitHub:

https://github.com/mynaparrot/plugNmeet-server/pull/883
:::

<!--truncate-->

## Por qué es importante para las videoconferencias autoalojadas

Las funciones de inteligencia artificial se están convirtiendo en elementos indispensables en las reuniones virtuales modernas. Los equipos de trabajo esperan contar con transcripciones en las que se puedan realizar búsquedas, comunicación multilingüe, resúmenes automatizados y asistentes virtuales inteligentes.

Sin embargo, muchas plataformas comerciales limitan estas prestaciones a sus propios servicios cerrados de suscripción. plugNmeet adopta un enfoque diferente.

Gracias al proveedor de OpenAI, tendrá la libertad de elegir el backend de IA que mejor se adapte a sus requisitos:

- Utilizar **OpenAI** para disponer de servicios gestionados de IA de alta calidad.
- Emplear **Azure OpenAI** u otro proveedor en la nube con una interfaz compatible con OpenAI.
- Conectarse a **Groq**, **Together AI**, **Anyscale** o cualquier otro proveedor de API compatible.
- Utilizar **Ollama**, **LocalAI** u otra plataforma de LLM autoalojada para obtener un control absoluto sobre la privacidad y la infraestructura física.
- Optimizar su instalación según criterios de coste, rendimiento, latencia, cumplimiento de normativas o propiedad de la información.

Esto convierte a plugNmeet en una excelente alternativa para aquellas organizaciones que buscan **reuniones virtuales potenciadas por IA sin renunciar al control total de su infraestructura**.

## Características principales del proveedor OpenAI en plugNmeet

Al activar el proveedor de OpenAI en plugNmeet, podrá habilitar un conjunto completo de herramientas inteligentes para sus sesiones de videoconferencia.

### Transcripción en vivo

El proveedor de OpenAI admite el procesamiento de voz a texto en tiempo real a través de una **conexión basada en WebSockets**. Esto permite disfrutar de una transcripción con latencia mínima durante las reuniones en vivo.

La transcripción en vivo resulta de gran utilidad para:

- Mejorar la accesibilidad.
- Generar actas y notas de reuniones.
- Consultar un historial de conversación con motor de búsqueda integrado.
- Facilitar los flujos de traducción en tiempo real.
- Elaborar resúmenes posteriores a las reuniones.

### Traducción multilingüe en tiempo real

plugNmeet puede traducir el texto definitivo de la transcripción durante el transcurso de la reunión. Esto facilita la comunicación fluida entre participantes con distintos idiomas nativos, reduciendo las barreras lingüísticas en seminarios web, clases virtuales, reuniones internacionales y dinámicas de equipos de trabajo distribuidos geográficamente.

### Traducciones de voz mediante texto a voz (TTS)

Esta integración también admite traducciones de voz gracias a la síntesis de texto a voz. Un bot traductor puede unirse a la sala e interpretar el contenido en voz alta utilizando voces generadas de forma artificial.

Esta función resulta especialmente idónea para:

- Eventos internacionales y multiculturales.
- Aulas virtuales de idiomas o clases a distancia.
- Reuniones empresariales transfronterizas.
- Entornos con un fuerte enfoque en el cumplimiento de normativas de accesibilidad.

### Resúmenes automatizados de las reuniones

Una vez finalizada la sesión, plugNmeet es capaz de elaborar un resumen estructurado a partir del archivo de la transcripción de audio.

Estos resúmenes pueden incluir de forma automatizada:

- Los puntos de discusión clave.
- Las decisiones tomadas.
- Las tareas asignadas y elementos de acción.
- Los próximos pasos o seguimientos de tareas.

Esto permite a los participantes ahorrar tiempo y facilita el repaso de las reuniones grabadas.

### Asistente de chat de IA en la sala

El proveedor de OpenAI también puede dar vida a un asistente virtual de chat en las salas de conferencia de plugNmeet. De esta manera, los asistentes pueden interactuar directamente con la inteligencia artificial durante la sesión para resolver dudas, realizar consultas contextuales y obtener asistencia inmediata.

### Cómo configurar OpenAI en plugNmeet

La configuración de esta integración en su servidor autoalojado es muy sencilla. Solo requiere una clave de API activa y una rápida modificación en el archivo `config.yaml`.

#### 1. Defina la cuenta de su proveedor

Añada la cuenta del proveedor en el apartado `insights.providers`:

```yaml
insights:
  enabled: true
  providers:
    openai:
      - id: "default-openai" # Un nombre único para identificar esta cuenta
        credentials:
          api_key: "YOUR_API_KEY"
        options:
          # ¡Esta es la clave para la compatibilidad con otras herramientas! Para LLM locales (como Ollama), use por ejemplo "http://localhost:11434/v1"
          endpoint: "https://api.openai.com/v1"
```

#### Más allá de OpenAI: Compatibilidad universal de la API

La opción de configuración `endpoint` es el puente de acceso a un ecosistema diverso de proveedores. Al estar diseñada de acuerdo con la especificación estándar de la API de OpenAI, la integración permite conectar **cualquier servicio que use este formato compatible**.

De esta forma, evitará depender de un único proveedor de servicios en la nube. Puede redirigir plugNmeet hacia:

*   **Otros proveedores de IA**: Servicios de alto rendimiento como **Groq**, **Together AI** o **Anyscale**.
*   **Modelos de código abierto autoalojados**: Ejecutar sus propios modelos de lenguaje en su hardware local mediante utilidades como **Ollama** o **LocalAI**.
*   **Grandes infraestructuras cloud**: Utilizar soluciones corporativas como **Azure OpenAI** que exponen una capa compatible.

Esta versatilidad le permite ajustar su configuración de acuerdo con criterios de privacidad, costes y rendimiento sin necesidad de cambiar el código de plugNmeet.

:::info[Nota técnica sobre endpoints y conexiones WebSocket]
Para que el servicio de **transcripción en vivo** funcione correctamente, es requisito indispensable que su endpoint sea compatible con **conexiones WebSocket** (`ws://` o `wss://`).

Nuestro proveedor intentará convertir de forma automática el protocolo del endpoint HTTP suministrado a su equivalente en WebSocket (por ejemplo, transformando `https://api.example.com` en `wss://api.example.com`), por lo que su servidor web intermedio o proxy debe estar preparado para gestionar este tipo de conexiones. El resto de las funciones, como la síntesis de voz (TTS) o los resúmenes de texto, continuarán operando sobre peticiones HTTP estándar.
:::

### Requisito importante: Activación de la traducción en vivo

La traducción de la transcripción en tiempo real es una de las funciones más valiosas del sistema, pero cuenta con una dependencia técnica que debe considerar:

**Es obligatorio que tenga configurados y habilitados de forma conjunta los servicios de `transcription` y `ai_text_chat`.**

El proceso de traducción recupera el texto consolidado del servicio de transcripción y lo procesa a través del modelo lingüístico definido para el módulo `ai_text_chat`. Sin esta última configuración, el sistema no podrá determinar qué modelo debe emplear para la traducción y la función fallará sin emitir alertas en la interfaz de usuario.

Una configuración mínima necesaria para contar con transcripción y traducción simultáneas se estructuraría del siguiente modo:

```yaml
services:
  transcription:
    provider: "openai"
    id: "default-openai"

  ai_text_chat:
    provider: "openai"
    id: "default-openai"
    options:
      # Este modelo se empleará tanto para el asistente de chat como para la traducción en tiempo real.
      chat_model: "gpt-4"
```

### Ejemplos completos de configuración de los servicios

A continuación, se detalla una guía de referencia con los distintos servicios y sus parámetros disponibles. Puede descomentar y ajustar los valores según las necesidades de su entorno.

```yaml
services:
  # Servicio 1: Transcripción en vivo (Procesamiento de voz a texto en tiempo real)
  # Este servicio utiliza una API WebSocket de baja latencia para flujos de audio continuos.
  transcription:
    provider: "openai"
    id: "default-openai"
    options:
      # El modelo empleado para la transcripción en vivo.
      realtime_transcription_model: "gpt-realtime-whisper"
      #
      # --- Configuración avanzada (Opcional) ---
      #
      # Use un encabezado de autorización personalizado si su proveedor (como Azure)
      # requiere un parámetro diferente al estándar "Authorization".
      # realtime_auth_header: "api-key"
      #
      # Balance de rendimiento entre latencia y precisión para gpt-realtime-whisper.
      # Valores soportados: "minimal", "low", "medium", "high", "xhigh".
      # transcription_delay: "medium"
      #
      # Modo de detección de actividad de voz (VAD). Para gpt-realtime-whisper,
      # se recomienda establecerlo en "manual", donde plugNmeet confirma el segmento de audio.
      # Otros modelos compatibles podrían admitir "server_vad".
      # transcription_turn_detection: "manual"
      #
      # Parámetros para la detección de voz en modo "manual".
      # transcription_min_commit_ms: 1500       # Duración mínima de la voz para considerarse un segmento válido.
      # transcription_silence_commit_ms: 900    # Silencio mínimo necesario para cerrar y procesar un segmento.
      # transcription_max_commit_ms: 12000      # Duración máxima de un bloque de audio antes de forzar su procesamiento.
      # transcription_speech_rms: 500           # Umbral de nivel de audio (RMS) para detectar el inicio de voz.
      # transcription_max_buffered_silence_ms: 400 # Silencio previo al habla que se conserva para enriquecer el contexto.

  # Servicio 2: Síntesis de voz (TTS) para traducciones habladas
  speech-synthesis:
    provider: "openai"
    id: "default-openai"
    options:
      # El modelo de síntesis de voz a emplear (por ejemplo, "tts-1" o "tts-1-hd").
      model: "tts-1"
      #
      # --- Configuración avanzada (Opcional) ---
      #
      # Los modelos TTS de OpenAI procesan el audio a una tasa de muestreo de 24000Hz por defecto.
      # Esto se configura de forma automática, pero puede modificarse si su proveedor requiere otra tasa.
      # tts_sample_rate: 24000
      #
      # Voz predeterminada en caso de no especificarse una según el idioma.
      # Voces disponibles en OpenAI: alloy, echo, fable, onyx, nova, shimmer.
      # default_voice: "alloy"
      #
      # Asignación de voces específicas para distintos idiomas.
      # voice-en: "alloy"
      # voice-es: "nova"
      # voice-fr: "shimmer"

  # Servicio 3: Chat de IA (Requerido para el funcionamiento de la traducción en vivo)
  ai_text_chat:
    provider: "openai"
    id: "default-openai"
    options:
      # Modelo de lenguaje principal para el asistente y las traducciones de texto.
      chat_model: "gpt-4"
      #
      # --- Configuración avanzada (Opcional) ---
      #
      # Modelo utilizado para compactar y resumir el historial del chat cuando se completa el contexto de memoria.
      # summarize_model: "gpt-3.5-turbo"
      #
      # Cantidad de mensajes de chat recientes que se mantendrán activos en la memoria de contexto.
      # context_window: 5

  # Servicio 4: Resúmenes de reuniones mediante procesamiento por lotes (Batch Audio)
  # Este servicio transcribe de manera asíncrona un archivo de audio grabado para luego resumirlo.
  meeting_summarizing:
    provider: "openai"
    id: "default-openai"
    options:
      # El modelo empleado para la transcripción inicial del archivo de audio.
      transcription_model: "whisper-1"
      #
      # --- Configuración avanzada (Opcional) ---
      #
      # El modelo empleado para generar el resumen final a partir del texto transcrito.
      # summarize_model: "gpt-3.5-turbo-16k"
```

### Un horizonte abierto a la innovación y al software libre

El soporte para OpenAI amplía el alcance de la arquitectura de Insights de plugNmeet, facilitando una mayor libertad de elección tecnológica, flexibilidad de despliegue y potencial de automatización inteligente. Al adoptar la interfaz estándar de OpenAI, le garantizamos total libertad para configurar la tecnología que prefiera: desde la nube de OpenAI o Microsoft Azure hasta soluciones completamente de almacenamiento propio y bajo su administración.

---

**¿Todo listo para configurar su propio servidor de videoconferencias?**

*   **Consulte nuestra [guía de instalación](/docs/installation) para iniciar su servidor autoalojado en pocos minutos.**
*   **Pruebe la [demostración en vivo](https://demo.plugnmeet.com/landing.html) para comprobar estas funciones de primera mano.**
