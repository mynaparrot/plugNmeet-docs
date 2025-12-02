---
title: "Introducing the AI Meeting Assistant: Automated Notes and Summaries"
slug: ai-meeting-assistant-automated-summaries
authors: [jibon]
tags: [ai, meeting-summary, note-taker, gemini, developer, productivity, insights, artifacts]
---

With our major [UI redesign on the horizon](/blog/plugnmeet-next-generation), we're also excited to unveil a feature that will fundamentally change how you experience meetings: the **AI Meeting Assistant**.

We've all been there: you're trying to lead a discussion while frantically typing notes, only to miss a key decision. Or you join a meeting late and have no idea what's going on. The AI Meeting Assistant solves this problem forever by acting as your personal scribe, powered by **Google's Gemini Pro**.

This isn't just a tech demo; it's a powerful productivity tool built on a sophisticated, cost-effective architecture.

<!--truncate-->

## Your AI-Powered Meeting Scribe

When you enable the AI Assistant for a session, it silently goes to work. By creating a lightweight, audio-only recording of the meeting, the Insights Platform can generate two powerful assets for you:

1.  **A Full, Time-Stamped Transcription (VTT File):** You can enable speech-to-text processing to generate a detailed transcription of the entire conversation in the standard VTT format. This is perfect for creating closed captions for a video recording or for maintaining a searchable, word-for-word archive of the meeting.
2.  **An Intelligent Summary:** Using the audio, our asynchronous `StartBatchSummarizeAudioFile` process sends the data to Gemini to generate a high-level summary, identify key decisions, and list action items.

:::caution[A Note on End-to-End Encryption]
The AI Meeting Assistant requires access to the meeting's audio to function. If you enable End-to-End Encryption (E2EE) with a self-provided key, the AI agent will be unable to decrypt the audio stream.

As a result, the following features will be **automatically disabled** for that session to protect your privacy:
*   Live Speech-to-Text & Transcription
*   Spoken Translations (Text-to-Speech)
*   AI-Powered Meeting Summaries

This is a deliberate security design. It ensures that when you choose maximum privacy with E2EE, no service—not even our AI assistant—can access the content of your conversation.
:::

### Unlock Your Meeting Data with the Artifacts API

The real power of the Insights Platform is what happens next. All of this generated data is available to you through the new **Artifacts API**. Instead of being trapped, your meeting intelligence becomes a programmable asset.

With a simple API call, you can retrieve:
*   The full meeting summary and action items.
*   The detailed, time-stamped **VTT transcription file**.
*   Token usage data for cost analysis and tracking.
*   Speech duration and other metadata.

This allows you to build powerful integrations, such as automatically sending meeting summaries to your project management tool or using the VTT file to add captions to your video recordings.

## The Insights Platform: A Multi-Provider AI Powerhouse

The **Insights Platform** is designed to use the best tool for every job. Instead of locking you into a single vendor, our new provider-agnostic architecture allows us to integrate the world's best AI services for each specific task.

*   **AI Summarization & Chat:** Powered by **Google Gemini**, providing world-class generative AI capabilities. You have the flexibility to choose between Google's powerful `Gemini Pro` for the highest quality summaries, or the faster, more cost-effective `Gemini Flash` model for less critical tasks.
*   **Real-Time Translation:** Powered by **Microsoft Azure**, offering robust and affordable speech-to-text and translation services.

## An Open Platform for Developers

The power of the Insights Platform comes from its open and flexible architecture. The entire system is built on a set of provider interfaces.

```go
// Provider is the master interface for all AI services.
type Provider interface {
	// Azure-powered features
	CreateTranscription(ctx context.Context, roomId, userId string, options []byte) (TranscriptionStream, error)
	TranslateText(ctx context.Context, text, sourceLang string, targetLangs []string) (*plugnmeet.InsightsTextTranslationResult, error)
	SynthesizeText(ctx context.Context, options []byte) (io.ReadCloser, error)

	// Google Gemini-powered features
	AITextChatStream(ctx context.Context, chatModel string, history []*plugnmeet.InsightsAITextChatContent) (<-chan *plugnmeet.InsightsAITextChatStreamResult, error)
	AIChatTextSummarize(ctx context.Context, summarizeModel string, history []*plugnmeet.InsightsAITextChatContent) (summaryText string, promptTokens uint32, completionTokens uint32, err error)
	StartBatchSummarizeAudioFile(ctx context.Context, filePath, summarizeModel, userPrompt string) (jobId string, fileName string, err error)
	GetBatchSummarizeResult(ctx context.Context, jobId string) (*plugnmeet.BatchSummarizeResult, error)

	// Common
	GetSupportedLanguages(serviceType ServiceType) []*plugnmeet.InsightsSupportedLangInfo
}
```

This modularity gives you the freedom to choose the best provider *and* the best model for each task, giving you unparalleled control over your platform's performance and cost.

:::warning[Deprecation Notice]
This new, flexible Insights Platform officially deprecates the old, hard-coded speech-to-text feature, which was tied exclusively to Azure.
:::

## What's Next?

The launch of the AI Meeting Assistant is a huge leap forward. With the core summarization engine and the Artifacts API now in place, our next step is to build the user-facing interfaces to view, edit, and share these automated meeting notes.

We're incredibly excited about the future of intelligent, productive communication in Plug-N-Meet.

---

**Ready to upgrade?**

*   **[Explore the Open-Source Project on GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **[Review the API Documentation](/docs/api/intro)**
*   **[Check out the Live Demo to see the new UI in action](https://demo.plugnmeet.com/landing.html)**
