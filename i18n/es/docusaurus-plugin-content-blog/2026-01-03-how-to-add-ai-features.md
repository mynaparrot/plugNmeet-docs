---
title: "Cómo Añadir un Asistente de IA Interactivo a tu Aplicación de Video en 15 Minutos"
slug: how-to-add-ai-meeting-assistant-features
authors: [jibon]
tags: [tutorial, cómo-hacer, asistente-de-reuniones-con-ia, chat-de-texto-con-ia, notas-de-reunión-con-ia, resumen-de-reunión-con-ia, resumidor-de-reuniones-con-ia, asistente-de-ia-para-reuniones, desarrollador]
---

En el competitivo panorama actual, una simple videollamada ya no es suficiente. Los usuarios esperan experiencias inteligentes, accesibles y productivas. ¿Qué pasaría si pudieras ofrecer un **asistente de reuniones con IA** que proporcione subtítulos y traducción en vivo, genere **notas de reunión con IA** e incluso pueda responder preguntas directamente en el chat?

Con Plug-N-Meet, puedes hacerlo. No se trata de un complejo proyecto de integración de varios meses. Es un cambio de configuración de 15 minutos —y nunca quedas atado a un único proveedor de IA.

Esta guía te ofrece la visión completa: qué funciones de **asistente de reuniones con IA** ofrece plugNmeet, qué proveedores pueden potenciar cada una (Azure, Google Gemini, OpenAI o cualquier API compatible con OpenAI, incluidos LLM autoalojados) y la configuración exacta a nivel de sala, que es idéntica sin importar el proveedor que elijas.

<!--truncate-->

---

## Lo que obtienes: el conjunto de funciones de IA

Una sola configuración desbloquea tres capacidades en cada sala:

1.  **Subtítulos y traducción en vivo** — transcripción de voz a texto en tiempo real con subtítulos traducidos por usuario, además de mensajes de chat traducidos.
2.  **Asistente de chat interactivo con IA** — una pestaña privada de «Asistente de IA» donde cada usuario puede hacer preguntas sobre la reunión sin saturar el chat principal.
3.  **Notas de reunión automatizadas** — un **resumen de la reunión con IA** posterior a la sesión, con decisiones clave y puntos de acción, recuperable mediante la [API de Artefactos](/docs/api/artifact/fetch).

Las tres se controlan por sala con los mismos metadatos `insights_features` (Paso 2), sea cual sea el proveedor.

## ¿Qué proveedor de IA deberías usar?

El marco `insights` de plugNmeet es agnóstico de proveedores. Defines las cuentas una sola vez en `config.yaml` y luego las asignas a los servicios. Puedes combinarlos libremente —por ejemplo, Azure para la transcripción con OpenAI para el chat y los resúmenes.

| Proveedor | Ideal para | Cubre |
|---|---|---|
| **Microsoft Azure** | Transcripción y traducción probadas en tiempo real | Transcripción, traducción |
| **Google Gemini** | Respuestas de chat sólidas y resúmenes económicos | Chat de texto con IA, resumen de reuniones |
| **OpenAI** | Un solo proveedor para todo, con máxima calidad de modelos | Transcripción, traducción, TTS/traducción hablada, chat, resúmenes |
| **APIs compatibles con OpenAI** (Groq, Together AI, Anyscale, Azure OpenAI) | Optimizar coste, latencia o cumplimiento sin cambiar tu configuración | Los mismos servicios que OpenAI |
| **LLM autoalojados** (Ollama, LocalAI) | Máxima privacidad —la IA se ejecuta en tu propia infraestructura | Los mismos servicios que OpenAI |

Esta guía utiliza **Azure + Google Gemini** como ejemplo concreto, porque combina la transcripción en tiempo real más madura con resúmenes económicos y de alta calidad. Si prefieres apostar por OpenAI o un LLM autoalojado, sigue la configuración de proveedor en [Integración de plugNmeet con OpenAI: IA autoalojada para videoconferencias](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet) y regresa aquí —**los Pasos 2 y 3 son idénticos para todos los proveedores**.

## Requisitos Previos

*   Un servidor de Plug-N-Meet en funcionamiento. Si no tienes uno, sigue nuestra [Guía de Instalación](/docs/installation).
*   Claves de API de los proveedores que elijas:
    *   **Esta guía (Azure + Gemini):** una clave de API y una región de los [Servicios Cognitivos de Microsoft Azure](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text), más una clave de API de [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Ruta OpenAI en su lugar:** una clave y un endpoint de API de OpenAI (o compatible) —consulta la [guía de integración con OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet) para el bloque de proveedor, incluidos Ollama/LocalAI autoalojados.

---

### Paso 1: Configura los Proveedores de IA

Abre el archivo `config.yaml` de tu servidor y busca la sección `insights`. Primero defines tus `providers` (tus cuentas) y luego asignas esos proveedores a `services` específicos.

Aquí tienes la configuración de Azure + Gemini utilizada en esta guía:

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
        chat_model: "gemini-2.5-pro" # Modelo potente para respuestas detalladas

    # El resumidor de reuniones utilizará el audio del servicio de transcripción.
    meeting_summarizing:
      provider: "google"
      id: "mi-cuenta-gemini"
      options:
        # Usa gemini-2.5-flash para resúmenes más rápidos y económicos.
        summarize_model: "gemini-2.5-flash"
```

Guarda el archivo y **reinicia tu servidor de PlugNmeet** para que los cambios surtan efecto.

```bash
sudo systemctl restart plugnmeet
```

:::tip ¿Usas OpenAI o un LLM autoalojado en su lugar?
Mantén la misma estructura —solo tienes que añadir un proveedor `openai` con tu `api_key` y tu `endpoint` (OpenAI, Groq, Together AI, Azure OpenAI o `http://localhost:11434/v1` para Ollama) y apuntar cualquier servicio a `provider: "openai"`. Además, OpenAI desbloquea las **traducciones habladas mediante TTS** y la transcripción en vivo por WebSocket. Encontrarás ejemplos completos servicio por servicio en la [guía de integración con OpenAI](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet).
:::

---

### Paso 2: Habilita las Funciones de IA en tu Sala

Ahora que el servidor está configurado, puedes habilitar estas funciones por sala. Cuando realices tu llamada a la API `createRoom`, añade el bloque `insights_features` a tus metadatos. Este bloque es **el mismo para todos los proveedores**:

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

En solo unos minutos, has transformado una videollamada estándar en una experiencia de reunión inteligente, interactiva e inclusiva a nivel mundial. Ya conoces el conjunto completo de funciones de IA, qué proveedores pueden potenciar cada parte —Azure, Google Gemini, OpenAI, nubes compatibles con OpenAI o LLM totalmente autoalojados— y la única configuración de sala que funciona con todos ellos.

El verdadero poder de esta plataforma es que tus datos no están atrapados. Después de que termine la reunión, puedes usar la **[API de Artefactos](/docs/api/artifact/fetch)** para recuperar programáticamente el resumen y la transcripción, lo que te permite construir integraciones potentes con tus nuevas **notas de reunión con IA**.
