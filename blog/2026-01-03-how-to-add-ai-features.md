---
title: "How to Add an AI Meeting Assistant to Your Video App in 15 Minutes"
slug: how-to-add-ai-meeting-assistant-features
authors: [jibon]
tags: [tutorial, how-to, ai-meeting-assistant, ai-meeting-notes, meeting-summary-ai, ai-meeting-summarizer, meeting-assistant-ai, developer]
---

In today's competitive landscape, a basic video call is no longer enough. Users expect intelligent, accessible, and productive experiences. What if you could offer an **AI meeting assistant** that provides live translation and automatically generates **AI meeting notes** after every session?

With Plug-N-Meet, you can. This isn't a complex, multi-month integration project. It's a 15-minute configuration change.

This guide will show you how to add world-class **AI meeting assistant features**—powered by **Microsoft Azure** for translation and **Google Gemini** for your **meeting summary AI**—to your Plug-N-Meet integration.

<!--truncate-->

---

## The Goal

By the end of this guide, your **meeting assistant AI** will be able to:
1.  Provide live, real-time captions of the conversation.
2.  Translate those captions into any user's preferred language with a single click.
3.  Generate a full **meeting summary AI** with key decisions and action items after the session ends.

## Prerequisites

*   A running Plug-N-Meet server. If you don't have one, follow our [Installation Guide](/docs/installation).
*   API keys from your chosen AI providers:
    *   **For Live Translation:** An API Key and Region from [Microsoft Azure's Cognitive Services](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text).
    *   **For AI Summaries:** An API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) for the Gemini API.

---

### Step 1: Configure the AI Providers

The first step is to tell your Plug-N-Meet server how to connect to the AI services. Open your `config.yaml` file on your server and find the `insights` section.

The new configuration is highly flexible. First, you define your `providers` (your accounts), and then you assign those providers to specific `services`.

Here is a minimal configuration to enable live transcription and the **AI meeting summarizer**:

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

    # The meeting summarizer will use the audio from the transcription service.
    meeting_summarizing:
      provider: "google"
      id: "my-gemini-account"
      options:
        # Use gemini-1.5-flash for faster, cost-effective summaries.
        # Use gemini-1.5-pro for the highest quality.
        summarize_model: "gemini-1.5-flash"
```

Save the file and **restart your PlugNmeet server** for the changes to take effect.

```bash
sudo systemctl restart plugnmeet
```

---

### Step 2: Enable AI Features in Your Room

Now that the server is configured, you can enable these features on a per-room basis. This gives you granular control, allowing you to offer **AI meeting assistant features** as a premium add-on or only for specific meeting types.

When you make your `createRoom` API call, add the `insights_features` block to the `room_features` section of your metadata.

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

When a user joins a room created with these settings, the AI features are available to be activated by a moderator.

*   **Live Captions & Translation:** A moderator must first enable the service.
    1.  Click the **3-dots menu** in the control bar.
    2.  Select **Transcription and Translation**.
    3.  In the pop-up, select the primary speaker and the language they will be speaking.
    4.  Click **Start Service**.
    
    Once enabled, participants will see a new **"T" icon** in their main control bar (next to icons like Raise Hand, Whiteboard, etc.). Clicking this "T" icon opens a menu where they can view the live captions and select their own preferred language for translation.

*   **Automated Meeting Notes:** To generate **AI meeting notes**, a moderator must start the summarization service.
    1.  Click the **3-dots menu** in the control bar.
    2.  Select **AI Tools**, then **Meeting Summarization**.
    3.  (Optional) Add custom instructions in the "Summarization Instructions" text area to guide the AI.
    4.  Click **Start Service**.

The **meeting assistant AI** will then process the audio in the background. After the meeting, the summary will be generated.

## Conclusion

In just a few minutes, you've transformed a standard video call into an intelligent, accessible, and globally inclusive meeting experience. By leveraging Plug-N-Meet's provider-agnostic AI layer, you can easily add a powerful **meeting assistant AI** that gives you a significant edge, all while maintaining full control over your self-hosted platform.

The real power of this platform is that your data isn't trapped. After the meeting ends, you can use the **[Artifacts API](/docs/api/artifact/fetch)** to programmatically retrieve the summary and transcription, allowing you to build powerful integrations with your new **AI meeting notes**.
