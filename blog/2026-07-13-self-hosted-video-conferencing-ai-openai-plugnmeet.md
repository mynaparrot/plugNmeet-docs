---
title: "plugNmeet OpenAI Integration: Self-Hosted AI for Video Conferencing" 
description: "Configure OpenAI-compatible APIs in plugNmeet to enable live transcription, real-time translation, spoken translations, AI chat, and post-meeting summaries on your self-hosted video conferencing server." 
authors: [jibon] 
tags: [plugnmeet, open-source, WebRTC, openai, transcription, translation, summarization, tts, compatible-api, self-hosted-llm, websocket, video-conferencing, ai-meetings] 
keywords: ["plugNmeet OpenAI integration", "self-hosted video conferencing AI", "OpenAI compatible API video conferencing", "WebRTC live transcription", "meeting translation AI", "self-hosted meeting summarization", "open-source video conferencing", "Ollama OpenAI compatible API", "LocalAI plugNmeet", "AI meeting assistant"]
---

At **plugNmeet**, our open-source WebRTC video conferencing platform is built around flexibility, privacy, and control. While plugNmeet already supports specialized cognitive services from **Azure** and **Google**, we are excited to introduce a major upgrade to the **Insights** framework: the official **OpenAI Provider for plugNmeet**.

With this integration, you can bring powerful AI features to your self-hosted video conferencing server, including **live transcription**, **real-time translation**, **live chat translation**, **spoken translations using text-to-speech**, **AI meeting summaries**, and an **in-meeting AI chatbot**.

Even better, the provider is designed around the standard OpenAI API format, which means you can use OpenAI directly or connect plugNmeet to any **OpenAI-compatible API**, including alternative AI providers and self-hosted LLM platforms.

:::info[Sneak Peek & Early Access]
This feature is currently in the final stages of review and is planned for an upcoming release.

Developers who want to test it early or review the implementation can follow the GitHub Pull Request:

https://github.com/mynaparrot/plugNmeet-server/pull/883
:::

<!--truncate-->

## Why This Matters for Self-Hosted Video Conferencing

AI features are becoming essential for modern online meetings. Teams increasingly expect searchable transcripts, multilingual communication, automated summaries, and intelligent meeting assistants.

However, many hosted video conferencing platforms lock these features behind proprietary services. plugNmeet takes a different approach.

With the OpenAI provider, you can choose the AI backend that best fits your needs:

- Use **OpenAI** for high-quality managed AI services.
- Use **Azure OpenAI** or another cloud provider with an OpenAI-compatible interface.
- Use **Groq**, **Together AI**, **Anyscale**, or another compatible API provider.
- Use **Ollama**, **LocalAI**, or another self-hosted LLM platform for more control over privacy and infrastructure.
- Optimize your setup for cost, performance, latency, compliance, or data ownership.

This makes plugNmeet a strong choice for organizations that want **AI-powered video conferencing without giving up control of their infrastructure**.

## Key Features of the plugNmeet OpenAI Provider

By enabling the OpenAI provider in plugNmeet, you can unlock a full set of AI-powered meeting features.

### Live Transcription

The OpenAI provider supports real-time speech-to-text through a **WebSocket-based connection**. This enables low-latency transcription during live meetings.

Live transcription is useful for:

- Accessibility
- Meeting notes
- Searchable conversation history
- Real-time translation workflows
- Post-meeting summaries

### Real-Time Multilingual Translation

plugNmeet can translate finalized transcription text during the meeting. This helps participants communicate across languages and reduces language barriers in international meetings, online classes, webinars, and remote team discussions.

### Spoken Translations with Text-to-Speech

The integration also supports spoken translations using text-to-speech. A translator bot can join the meeting and speak translated content aloud using an AI-generated voice.

This is especially useful for:

- Multilingual events
- Remote classrooms
- Global team meetings
- Cross-border business calls
- Accessibility-focused deployments

### Live Chat Translation

The OpenAI provider can also translate chat messages in real time. This allows participants from different linguistic backgrounds to communicate seamlessly through text chat, making meetings more inclusive and productive. Each user can select their preferred language and view translated messages instantly.

### Automated Meeting Summarization

After a meeting ends, plugNmeet can generate a concise AI-powered summary from the meeting transcript.

Summaries can include:

- Key discussion points
- Important decisions
- Action items
- Follow-up tasks
- Meeting outcomes

This helps users save time and makes recorded meetings easier to review.

### In-Meeting AI Chatbot

The OpenAI provider can also power an AI chatbot inside plugNmeet conference rooms. Participants can interact with the assistant during the meeting for contextual help, questions, and AI-powered support.

### How to Configure OpenAI in plugNmeet

Configuring the OpenAI integration on your self-hosted server is straightforward. All you need is an active API key and a quick update to your `config.yaml`.

#### 1. Define Your Provider Account

Add your provider account under the `insights.providers` section:

```yaml
insights:
  enabled: true
  providers:
    openai:
      - id: "default-openai" # A unique name for this account
        credentials:
          api_key: "YOUR_API_KEY"
        options:
          # This is the magic key for compatibility! For local LLMs (Ollama), use e.g. "http://localhost:11434/v1"
          endpoint: "https://api.openai.com/v1"
```

#### Beyond OpenAI: Universal API Compatibility

The `endpoint` option is your gateway to a universe of AI providers. Because our integration is built on the standard OpenAI API specification, you can use **any service that offers an OpenAI-compatible API**.

This means you are not locked into a single vendor. You can point plugNmeet to:

*   **Alternative AI Providers**: Services like **Groq**, **Together AI**, or **Anyscale**.
*   **Self-Hosted Open Source Models**: Run your own LLMs locally using tools like **Ollama** or **LocalAI**.
*   **Major Cloud Providers**: Use services like **Azure OpenAI** which provide a compatible API layer.

This flexibility allows you to optimize for cost, privacy, and performance without changing your plugNmeet setup.

:::info[A Note on Endpoints and WebSockets]
A key requirement for the **Live Transcription** service is that your endpoint must support **WebSocket connections** (`ws://` or `wss://`).

Our provider will automatically attempt to upgrade the HTTP endpoint you provide to its WebSocket equivalent (e.g., `https://api.example.com` becomes `wss://api.example.com`), but your server must be configured to handle this connection type. Other services like TTS and summarization will continue to use standard HTTP requests.
:::

### Important: Enabling Live Transcription Translation

One of the most powerful features is the ability to translate live transcriptions in real time. To enable this, there is a crucial dependency to be aware of:

**You must have both the `transcription` and `translation` services configured and enabled.**

The translation process works by taking the finalized text from the transcription service and passing it to the language model configured in the `translation` service. Without the `translation` configuration, the system won't know which model to use for the translation task, and it will fail silently.

Therefore, a minimal setup for live transcription with translation would look like this:

```yaml
services:
  transcription:
    provider: "openai"
    id: "default-openai"

  translation:
    provider: "openai"
    id: "default-openai"
    options:
      # This model will be used for real-time transcription and chat translation.
      model: "gpt-4-turbo"
      max_selected_trans_langs: 5
```

### Complete Service Configuration Examples

Here is a comprehensive guide to all the services and their available options. You can uncomment and adjust them to fine-tune the behavior.

```yaml
services:
  # Service 1: Live Transcription (Real-time Speech-to-Text)
  # This service uses a real-time WebSocket API for live audio streams.
  transcription:
    provider: "openai"
    id: "default-openai"
    options:
      # The model for real-time transcription.
      realtime_transcription_model: "gpt-realtime-whisper"
      #
      # --- Advanced Customization (Optional) ---
      #
      # Use a custom authentication header if your provider (like Azure)
      # expects something other than the default 'Authorization' header.
      # realtime_auth_header: "api-key"
      #
      # Latency vs. accuracy tradeoff for gpt-realtime-whisper.
      # Supported values: "minimal", "low", "medium", "high", "xhigh".
      # transcription_delay: "medium"
      #
      # Voice Activity Detection (VAD) mode. For gpt-realtime-whisper,
      # this should effectively be 'manual', where plugNmeet commits audio.
      # Other modes like 'server_vad' may be supported by other models.
      # transcription_turn_detection: "manual"
      #
      # Fine-tune the 'manual' VAD behavior.
      # transcription_min_commit_ms: 1500       # Min duration of speech to be a valid segment.
      # transcription_silence_commit_ms: 900    # Silence duration that triggers a final transcript.
      # transcription_max_commit_ms: 12000      # Max duration of a segment before forcing a final transcript.
      # transcription_speech_rms: 500           # Audio level (RMS) threshold to detect speech.
      # transcription_max_buffered_silence_ms: 400 # Pre-speech silence to include for better context.

  # Service 2: Real-time and Chat Translation
  translation:
    provider: "openai"
    id: "default-openai"
    options:
      # The model to use for translating text (from chat or transcriptions).
      model: "gpt-4-turbo"
      #
      # --- Advanced Customization (Optional) ---
      #
      # Maximum number of languages a user can select for translation.
      # max_selected_trans_langs: 5

  # Service 3: Text-to-Speech (TTS) for Spoken Translations
  speech-synthesis:
    provider: "openai"
    id: "default-openai"
    options:
      # The TTS model to use (e.g., "tts-1", "tts-1-hd").
      model: "tts-1"
      #
      # --- Advanced Customization (Optional) ---
      #
      # OpenAI's TTS models require a 24000Hz sample rate. This is set
      # automatically but can be overridden if your provider requires a different rate.
      # tts_sample_rate: 24000
      #
      # The default voice to use if a language-specific one isn't set.
      # Voices: alloy, echo, fable, onyx, nova, shimmer.
      # default_voice: "alloy"
      #
      # Assign specific voices to different languages.
      # voice-en: "alloy"
      # voice-es: "nova"
      # voice-fr: "shimmer"

  # Service 4: AI-Powered Chat
  ai_text_chat:
    provider: "openai"
    id: "default-openai"
    options:
      # This model is used for the in-meeting AI assistant.
      chat_model: "gpt-4"
      #
      # --- Advanced Customization (Optional) ---
      #
      # The model used to summarize chat history when the context window is full.
      # summarize_model: "gpt-3.5-turbo"
      #
      # Number of recent messages to keep in memory before summarizing.
      # context_window: 5

  # Service 5: Post-Meeting Summarization (Batch Audio File)
  # This service transcribes a recorded audio file and then summarizes it.
  meeting_summarizing:
    provider: "openai"
    id: "default-openai"
    options:
      # The model for the initial audio-to-text transcription.
      transcription_model: "whisper-1"
      #
      # --- Advanced Customization (Optional) ---
      #
      # The model for the final summarization of the transcript.
      # summarize_model: "gpt-3.5-turbo-16k"
```

### A More Intelligent and Open Future

The new OpenAI provider is a powerful addition to the plugNmeet Insights framework, offering more choice, flexibility, and intelligence than ever before. By embracing the OpenAI API standard, we're giving you the freedom to choose the best tools for the job—whether that's OpenAI's own models, a major cloud service like Azure, or a self-hosted solution.

---

**Ready to build your own video conferencing platform?**

*   **[Follow our Installation Guide](/docs/installation) to get your self-hosted server running in minutes.**
*   **[Try the Live Demo](https://demo.plugnmeet.com/landing.html) to explore the features.**