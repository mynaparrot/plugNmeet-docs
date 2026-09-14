---
title: "How to Add an Interactive AI Assistant to Your Video App in 15 Minutes"
slug: how-to-add-ai-meeting-assistant-features
authors: [jibon]
tags: [tutorial, how-to, ai-meeting-assistant, ai-text-chat, ai-meeting-notes, meeting-summary-ai, ai-meeting-summarizer, meeting-assistant-ai, developer]
---

In today's competitive landscape, a basic video call is no longer enough. Users expect intelligent, accessible, and productive experiences. What if you could offer an **AI meeting assistant** that provides live captions and translation, generates **AI meeting notes**, and can even answer questions directly in the chat?

With Plug-N-Meet, you can. This isn't a complex, multi-month integration project. It's a 15-minute configuration change — and you are never locked into a single AI vendor.

This guide walks you through the full picture: which **AI meeting assistant features** plugNmeet offers, which providers can power each one (Azure, Google Gemini, OpenAI, or any OpenAI-compatible API including self-hosted LLMs), and the exact room setup that is identical no matter which provider you pick.

<!--truncate-->

---

## What you get: the AI feature set

One configuration unlocks three capabilities in every room:

1.  **Live captions & translation** — real-time speech-to-text with per-user translated captions, plus translated chat messages.
2.  **Interactive AI chat assistant** — a private "AI Assistant" tab where each user can ask questions about the meeting without cluttering the main chat.
3.  **Automated meeting notes** — a post-meeting **meeting summary AI** with key decisions and action items, retrievable via the [Artifacts API](/docs/api/artifact/fetch).

All three are controlled per room through the same `insights_features` metadata (Step 2 below), regardless of provider.

## Which AI provider should you use?

plugNmeet's `insights` framework is provider-agnostic. You define provider accounts once in `config.yaml`, then assign them to services. Mix and match freely — for example, Azure for transcription with OpenAI for chat and summaries.

| Provider | Good for | Supports |
|---|---|---|
| **Microsoft Azure** | Proven real-time transcription & translation | Transcription, translation |
| **Google Gemini** | Strong chat answers & cost-effective summaries | AI text chat, meeting summarization |
| **OpenAI** | One vendor for everything, highest model quality | Transcription, translation, TTS/spoken translation, chat, summarization |
| **OpenAI-compatible APIs** (Groq, Together AI, Anyscale, Azure OpenAI) | Cost, latency, or compliance tuning without changing your setup | Same services as OpenAI |
| **Self-hosted LLMs** (Ollama, LocalAI) | Maximum privacy — AI runs on your own infrastructure | Same services as OpenAI |

This guide uses **Azure + Google Gemini** as the concrete example because it pairs the most mature real-time transcription with cheap, high-quality summaries. If you'd rather go all-in on OpenAI or a self-hosted LLM, follow the provider setup in [plugNmeet OpenAI Integration: Self-Hosted AI for Video Conferencing](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet), then return here — **Steps 2 and 3 below are identical for every provider**.

## Prerequisites

*   A running Plug-N-Meet server. If you don't have one, follow our [Installation Guide](/docs/installation).
*   API keys for the providers you choose:
    *   **This guide (Azure + Gemini):** an API key and region from [Microsoft Azure Cognitive Services](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text), plus an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **OpenAI route instead:** an OpenAI (or compatible) API key and endpoint — see the [OpenAI integration guide](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet) for the provider block, including self-hosted Ollama/LocalAI.

---

### Step 1: Configure the AI Providers

Open `config.yaml` on your server and find the `insights` section. First you define your `providers` (your accounts), then you assign those providers to specific `services`.

Here is the Azure + Gemini setup used in this guide:

```yaml
insights:
  enabled: true
  # 1. Define all available provider accounts ONCE.
  providers:
    azure:
      - id: "my-azure-account" # A unique name you choose
        credentials:
          api_key: "YOUR_AZURE_KEY"
          region: "eastus"
    google:
      - id: "my-gemini-account" # A unique name you choose
        credentials:
          api_key: "YOUR_GEMINI_API_KEY"

  # 2. Define the services that USE the providers.
  services:
    # Transcription is required for both live captions and translation.
    transcription:
      provider: "azure"
      id: "my-azure-account"

    # The AI text chat assistant.
    ai_text_chat:
      provider: "google"
      id: "my-gemini-account"
      options:
        chat_model: "gemini-2.5-pro" # Powerful model for in-depth answers

    # The meeting summarizer will use the audio from the transcription service.
    meeting_summarizing:
      provider: "google"
      id: "my-gemini-account"
      options:
        # Use gemini-2.5-flash for faster, cost-effective summaries.
        summarize_model: "gemini-2.5-flash"
```

Save the file and **restart your PlugNmeet server** for the changes to take effect.

```bash
sudo systemctl restart plugnmeet
```

:::tip Using OpenAI or a self-hosted LLM instead?
Keep the same structure — just add an `openai` provider with your `api_key` and `endpoint` (OpenAI, Groq, Together AI, Azure OpenAI, or `http://localhost:11434/v1` for Ollama), then point any service at `provider: "openai"`. OpenAI additionally unlocks **spoken translations via TTS** and live transcription over WebSocket. Full service-by-service examples are in the [OpenAI integration guide](/blog/2026/07/13/self-hosted-video-conferencing-ai-openai-plugnmeet).
:::

---

### Step 2: Enable AI Features in Your Room

Now that the server is configured, you can enable these features on a per-room basis. When you make your `createRoom` API call, add the `insights_features` block to your metadata. This block is **the same for every provider**:

```json
{
  "room_id": "ai-powered-room",
  "metadata": {
    "room_features": {
      // ... other features like allow_webcams, etc.
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

That's it! Any room created with this metadata will now have the AI Meeting Assistant enabled.

---

### Step 3: Experience It Live

When a user joins a room created with these settings, the AI features are available to be activated.

*   **Live Captions & Translation:** A moderator must first enable the service from the **3-dots menu > Transcription and Translation**. Once enabled, participants will see a new **"T" icon** in their main control bar. Clicking this opens a menu where they can view the live captions and select their own preferred language for translation.

*   **Interactive AI Chat Assistant:** Any user can interact with the AI assistant. In the side panel, a new **"AI Assistant"** tab will appear. Clicking this opens a dedicated chat interface where a user can privately ask the AI questions about the meeting content, get clarifications, or ask for help without cluttering the main participant chat.

*   **Automated Meeting Notes:** To generate **AI meeting notes**, a moderator must start the service from the **3-dots menu > AI Tools > Meeting Summarization**. The **meeting assistant AI** will then process the audio in the background.

## Conclusion

In just a few minutes, you've transformed a standard video call into an intelligent, interactive, and globally inclusive meeting experience. You now know the full AI feature set, which providers can power each part — Azure, Google Gemini, OpenAI, OpenAI-compatible clouds, or fully self-hosted LLMs — and the one room configuration that works with all of them.

The real power of this platform is that your data isn't trapped. After the meeting ends, you can use the **[Artifacts API](/docs/api/artifact/fetch)** to programmatically retrieve the summary and transcription, allowing you to build powerful integrations with your new **AI meeting notes**.
