---
title: "How to Add an Interactive AI Assistant to Your Video App in 15 Minutes"
slug: how-to-add-ai-meeting-assistant-features
authors: [jibon]
tags: [tutorial, how-to, ai-meeting-assistant, ai-text-chat, ai-meeting-notes, meeting-summary-ai, ai-meeting-summarizer, meeting-assistant-ai, developer]
---

In today's competitive landscape, a basic video call is no longer enough. Users expect intelligent, accessible, and productive experiences. What if you could offer an **AI meeting assistant** that provides live translation, generates **AI meeting notes**, and can even answer questions directly in the chat?

With Plug-N-Meet, you can. This isn't a complex, multi-month integration project. It's a 15-minute configuration change.

This guide will show you how to add world-class **AI meeting assistant features**—powered by **Microsoft Azure** for translation and **Google Gemini** for your **meeting summary AI** and live chat assistant—to your Plug-N-Meet integration.

<!--truncate-->

---

## The Goal

By the end of this guide, your **meeting assistant AI** will be able to:
1.  Provide live, real-time captions and translation.
2.  Answer questions and provide help through a dedicated, private chat channel.
3.  Generate a full **meeting summary AI** with key decisions and action items after the session ends.

## Prerequisites

*   A running Plug-N-Meet server. If you don't have one, follow our [Installation Guide](/docs/installation).
*   API keys from your chosen AI providers:
    *   **For Live Translation:** An API Key and Region from [Microsoft Azure's Cognitive Services](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text).
    *   **For AI Chat & Summaries:** An API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) for the Gemini API.

---

### Step 1: Configure the AI Providers

The first step is to tell your Plug-N-Meet server how to connect to the AI services. Open your `config.yaml` file on your server and find the `insights` section.

The new configuration is highly flexible. First, you define your `providers` (your accounts), and then you assign those providers to specific `services`.

Here is a minimal configuration to enable all three features:

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
        # Use gemini-1.5-flash for faster, cost-effective summaries.
        summarize_model: "gemini-2.5-pro"
```

Save the file and **restart your PlugNmeet server** for the changes to take effect.

```bash
sudo systemctl restart plugnmeet
```

---

### Step 2: Enable AI Features in Your Room

Now that the server is configured, you can enable these features on a per-room basis. When you make your `createRoom` API call, add the `insights_features` block to your metadata.

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

In just a few minutes, you've transformed a standard video call into an intelligent, interactive, and globally inclusive meeting experience. By leveraging Plug-N-Meet's provider-agnostic AI layer, you can easily add a powerful **meeting assistant AI** that gives you a significant edge, all while maintaining full control over your self-hosted platform.

The real power of this platform is that your data isn't trapped. After the meeting ends, you can use the **[Artifacts API](/docs/api/artifact/fetch)** to programmatically retrieve the summary and transcription, allowing you to build powerful integrations with your new **AI meeting notes**.
