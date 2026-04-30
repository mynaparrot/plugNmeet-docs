---
title: "Presentamos el Asistente de Reuniones con IA: Notas y Resúmenes Automatizados"
slug: ai-meeting-assistant-automated-summaries
authors: [jibon]
tags: [ia, resumen-de-reunion, tomador-de-notas, gemini, desarrollador, productividad, insights, artefactos]
---

Con nuestro importante [rediseño de la interfaz de usuario en el horizonte](/blog/plugnmeet-next-generation), también estamos emocionados de presentar una función que cambiará fundamentalmente la forma en que experimenta las reuniones: el **Asistente de Reuniones con IA**.

Todos hemos estado allí: estás tratando de dirigir una discusión mientras escribes notas frenéticamente, solo para perderte una decisión clave. O te unes a una reunión tarde y no tienes idea de lo que está pasando. El Asistente de Reuniones con IA resuelve este problema para siempre al actuar como su escriba personal, impulsado por **Gemini Pro de Google**.

Esto no es solo una demostración tecnológica; es una poderosa herramienta de productividad construida sobre una arquitectura sofisticada y rentable.

<!--truncate-->

## Su Escriba de Reuniones Impulsado por IA

Cuando habilita el Asistente de IA para una sesión, se pone a trabajar en silencio. Al crear una grabación de solo audio y ligera de la reunión, la Plataforma de Insights puede generar dos activos potentes para usted:

1.  **Una Transcripción Completa con Marca de Tiempo (Archivo VTT):** Puede habilitar el procesamiento de voz a texto para generar una transcripción detallada de toda la conversación en el formato VTT estándar. Esto es perfecto para crear subtítulos para una grabación de video o para mantener un archivo de la reunión palabra por palabra y con capacidad de búsqueda.
2.  **Un Resumen Inteligente:** Usando el audio, nuestro proceso asíncrono `StartBatchSummarizeAudioFile` envía los datos a Gemini para generar un resumen de alto nivel, identificar decisiones clave y listar elementos de acción.

:::caution[Una Nota sobre el Cifrado de Extremo a Extremo]
El Asistente de Reuniones con IA requiere acceso al audio de la reunión para funcionar. Si habilita el Cifrado de Extremo a Extremo (E2EE) con una clave proporcionada por usted mismo, el agente de IA no podrá descifrar el flujo de audio.

Como resultado, las siguientes funciones se **deshabilitarán automáticamente** para esa sesión para proteger su privacidad:
*   Voz a Texto y Transcripción en Vivo
*   Traducciones Habladas (Texto a Voz)
*   Resúmenes de Reuniones Impulsados por IA

Este es un diseño de seguridad deliberado. Asegura que cuando elige la máxima privacidad con E2EE, ningún servicio, ni siquiera nuestro asistente de IA, puede acceder al contenido de su conversación.
:::

### Desbloquee los Datos de su Reunión con la API de Artefactos

El verdadero poder de la Plataforma de Insights es lo que sucede a continuación. Todos estos datos generados están disponibles para usted a través de la nueva **API de Artefactos**. En lugar de quedar atrapada, la inteligencia de su reunión se convierte en un activo programable.

Con una simple llamada a la API, puede recuperar:
*   El resumen completo de la reunión y los elementos de acción.
*   El archivo de **transcripción VTT** detallado y con marca de tiempo.
*   Datos de uso de tokens para análisis de costos y seguimiento.
*   Duración del habla y otros metadatos.

Esto le permite construir integraciones potentes, como enviar automáticamente resúmenes de reuniones a su herramienta de gestión de proyectos o usar el archivo VTT para agregar subtítulos a sus grabaciones de video.

## La Plataforma de Insights: Una Potencia de IA de Múltiples Proveedores

La **Plataforma de Insights** está diseñada para usar la mejor herramienta para cada trabajo. En lugar de encerrarlo en un solo proveedor, nuestra nueva arquitectura agnóstica de proveedores nos permite integrar los mejores servicios de IA del mundo para cada tarea específica.

*   **Resumen y Chat con IA:** Impulsado por **Google Gemini**, que proporciona capacidades de IA generativa de clase mundial. Tiene la flexibilidad de elegir entre el potente `Gemini Pro` de Google para resúmenes de la más alta calidad, o el modelo `Gemini Flash` más rápido y rentable para tareas menos críticas.
*   **Traducción en Tiempo Real:** Impulsado por **Microsoft Azure**, que ofrece servicios de voz a texto y traducción robustos y asequibles.

## Una Plataforma Abierta para Desarrolladores

El poder de la Plataforma de Insights proviene de su arquitectura abierta y flexible. Todo el sistema está construido sobre un conjunto de interfaces de proveedores.

```go
// Provider es la interfaz maestra para todos los servicios de IA.
type Provider interface {
	// Funciones impulsadas por Azure
	CreateTranscription(ctx context.Context, roomId, userId string, options []byte) (TranscriptionStream, error)
	TranslateText(ctx context.Context, text, sourceLang string, targetLangs []string) (*plugnmeet.InsightsTextTranslationResult, error)
	SynthesizeText(ctx context.Context, options []byte) (io.ReadCloser, error)

	// Funciones impulsadas por Google Gemini
	AITextChatStream(ctx context.Context, chatModel string, history []*plugnmeet.InsightsAITextChatContent) (<-chan *plugnmeet.InsightsAITextChatStreamResult, error)
	AIChatTextSummarize(ctx context.Context, summarizeModel string, history []*plugnmeet.InsightsAITextChatContent) (summaryText string, promptTokens uint32, completionTokens uint32, err error)
	StartBatchSummarizeAudioFile(ctx context.Context, filePath, summarizeModel, userPrompt string) (jobId string, fileName string, err error)
	GetBatchSummarizeResult(ctx context.Context, jobId string) (*plugnmeet.BatchSummarizeResult, error)

	// Común
	GetSupportedLanguages(serviceType ServiceType) []*plugnmeet.InsightsSupportedLangInfo
}
```

Esta modularidad le da la libertad de elegir el mejor proveedor *y* el mejor modelo para cada tarea, lo que le brinda un control sin precedentes sobre el rendimiento y el costo de su plataforma.

:::warning[Aviso de Desuso]
Esta nueva y flexible Plataforma de Insights oficialmente deja en desuso la antigua función de voz a texto codificada de forma rígida, que estaba vinculada exclusivamente a Azure.
:::

## ¿Qué Sigue?

El lanzamiento del Asistente de Reuniones con IA es un gran salto adelante. Con el motor de resumen principal y la API de Artefactos ahora en su lugar, nuestro próximo paso es construir las interfaces orientadas al usuario para ver, editar y compartir estas notas de reunión automatizadas.

Estamos increíblemente emocionados por el futuro de la comunicación inteligente y productiva en Plug-N-Meet.

---

**¿Listo para actualizar?**

*   **[Explore el Proyecto de Código Abierto en GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **[Revise la Documentación de la API](/docs/api/intro)**
*   **[Consulte la Demostración en Vivo para ver la nueva interfaz de usuario en acción](https://demo.plugnmeet.com/landing.html)**
