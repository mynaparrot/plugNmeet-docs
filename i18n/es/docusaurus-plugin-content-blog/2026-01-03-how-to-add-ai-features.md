---
title: "Cómo Añadir un Asistente de IA Interactivo a tu Aplicación de Video en 15 Minutos"
slug: how-to-add-ai-meeting-assistant-features
authors: [jibon]
tags: [tutorial, cómo-hacer, asistente-de-reuniones-con-ia, chat-de-texto-con-ia, notas-de-reunión-con-ia, resumen-de-reunión-con-ia, resumidor-de-reuniones-con-ia, asistente-de-ia-para-reuniones, desarrollador]
---

En el competitivo panorama actual, una simple videollamada ya no es suficiente. Los usuarios esperan experiencias inteligentes, accesibles y productivas. ¿Qué pasaría si pudieras ofrecer un **asistente de reuniones con IA** que proporcione traducción en vivo, genere **notas de reunión con IA** e incluso pueda responder preguntas directamente en el chat?

Con Plug-N-Meet, puedes hacerlo. No se trata de un complejo proyecto de integración de varios meses. Es un cambio de configuración de 15 minutos.

Esta guía te mostrará cómo añadir funciones de **asistente de reuniones con IA** de clase mundial —impulsadas por **Microsoft Azure** para la traducción y **Google Gemini** para tu **IA de resumen de reuniones** y asistente de chat en vivo— a tu integración de Plug-N-Meet.

<!--truncate-->

---

## El Objetivo

Al final de esta guía, tu **asistente de IA para reuniones** podrá:
1.  Proporcionar subtítulos y traducción en vivo y en tiempo real.
2.  Responder preguntas y ofrecer ayuda a través de un canal de chat privado y dedicado.
3.  Generar un **resumen completo de la reunión con IA** con las decisiones clave y los puntos de acción una vez que finalice la sesión.

## Requisitos Previos

*   Un servidor de Plug-N-Meet en funcionamiento. Si no tienes uno, sigue nuestra [Guía de Instalación](/docs/installation).
*   Claves de API de tus proveedores de IA elegidos:
    *   **Para la Traducción en Vivo:** Una Clave de API y una Región de los [Servicios Cognitivos de Microsoft Azure](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text).
    *   **Para el Chat y los Resúmenes con IA:** Una Clave de API de [Google AI Studio](https://aistudio.google.com/app/apikey) para la API de Gemini.

---

### Paso 1: Configura los Proveedores de IA

El primer paso es decirle a tu servidor de Plug-N-Meet cómo conectarse a los servicios de IA. Abre tu archivo `config.yaml` en tu servidor y busca la sección `insights`.

La nueva configuración es muy flexible. Primero, defines tus `providers` (tus cuentas) y luego asignas esos proveedores a `services` específicos.

Aquí tienes una configuración mínima para habilitar las tres funciones:

```yaml
insights:
  enabled: true
  # 1. Define todas las cuentas de proveedores disponibles UNA SOLA VEZ.
  providers:
    azure:
      - id: "mi-cuenta-azure" # Un nombre único que elijas
        credentials:
          api_key: "TU_CLAVE_DE_AZURE"
          region: "eastus"
    google:
      - id: "mi-cuenta-gemini" # Un nombre único que elijas
        credentials:
          api_key: "TU_CLAVE_DE_API_DE_GEMINI"

  # 2. Define los servicios que UTILIZAN los proveedores.
  services:
    # La transcripción es necesaria tanto para los subtítulos en vivo como para la traducción.
    transcription:
      provider: "azure"
      id: "mi-cuenta-azure"

    # El asistente de chat de texto con IA.
    ai_text_chat:
      provider: "google"
      id: "mi-cuenta-gemini"
      options:
        chat_model: "gemini-1.5-pro" # Modelo potente para respuestas detalladas

    # El resumidor de reuniones utilizará el audio del servicio de transcripción.
    meeting_summarizing:
      provider: "google"
      id: "mi-cuenta-gemini"
      options:
        # Usa gemini-1.5-flash para resúmenes más rápidos y económicos.
        summarize_model: "gemini-1.5-flash"
```

Guarda el archivo y **reinicia tu servidor de PlugNmeet** para que los cambios surtan efecto.

```bash
sudo systemctl restart plugnmeet
```

---

### Paso 2: Habilita las Funciones de IA en tu Sala

Ahora que el servidor está configurado, puedes habilitar estas funciones por sala. Cuando realices tu llamada a la API `createRoom`, añade el bloque `insights_features` a tus metadatos.

```json
{
  "room_id": "sala-con-ia",
  "metadata": {
    "room_features": {
      // ... otras características como allow_webcams, etc.
      "insights_features": {
        "is_allow": true,
        "transcription_features": {
          "is_allow": true,
          "is_allow_translation": true
        },
        "ai_features": {
          "is_allow": true,
          "ai_text_chat_features": {
            "is_allow": true
          },
          "meeting_summarization_features": {
            "is_allow": true
          }
        }
      }
    }
  }
}
```

¡Eso es todo! Cualquier sala creada con estos metadatos ahora tendrá habilitado el Asistente de Reuniones con IA.

---

### Paso 3: Vívelo en Directo

Cuando un usuario se une a una sala creada con esta configuración, las funciones de IA están disponibles para ser activadas.

*   **Subtítulos y Traducción en Vivo:** Un moderador debe primero habilitar el servicio desde el **menú de 3 puntos > Transcripción y Traducción**. Una vez habilitado, los participantes verán un nuevo **icono "T"** en su barra de control principal. Al hacer clic, se abre un menú donde pueden ver los subtítulos en vivo y seleccionar su propio idioma preferido para la traducción.

*   **Asistente de Chat Interactivo con IA:** Cualquier usuario puede interactuar con el asistente de IA. En el panel lateral, aparecerá una nueva pestaña de **"Asistente de IA"**. Al hacer clic, se abre una interfaz de chat dedicada donde un usuario puede hacer preguntas privadas a la IA sobre el contenido de la reunión, obtener aclaraciones o pedir ayuda sin saturar el chat principal de los participantes.

*   **Notas de Reunión Automatizadas:** Para generar **notas de reunión con IA**, un moderador debe iniciar el servicio desde el **menú de 3 puntos > Herramientas de IA > Resumen de la Reunión**. El **asistente de IA para reuniones** procesará entonces el audio en segundo plano.

## Conclusión

En solo unos minutos, has transformado una videollamada estándar en una experiencia de reunión inteligente, interactiva e inclusiva a nivel mundial. Al aprovechar la capa de IA agnóstica de proveedores de Plug-N-Meet, puedes añadir fácilmente un potente **asistente de IA para reuniones** que te da una ventaja significativa, todo mientras mantienes el control total sobre tu plataforma autoalojada.

El verdadero poder de esta plataforma es que tus datos no están atrapados. Después de que termine la reunión, puedes usar la **[API de Artefactos](/docs/api/artifact/fetch)** para recuperar programáticamente el resumen y la transcripción, lo que te permite construir integraciones potentes con tus nuevas **notas de reunión con IA**.
