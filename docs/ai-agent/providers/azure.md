---
title: "Microsoft Azure Provider Guide: Speech to Text, Translator, Neural TTS & Azure OpenAI"
description: "Run all six plugNmeet Insights services on Microsoft Azure: native Cognitive Services for live speech to text, caption translation and neural voice synthesis, plus Azure OpenAI and Azure AI Foundry through the OpenAI-compatible provider for the voice agent, room copilot and meeting summaries."
keywords: [azure speech to text webrtc, azure live captions api, azure translator live captions, azure neural tts video conferencing, azure openai foundry voice agent, microsoft azure ai transcription, azure speech translation, azure cognitive services plugnmeet, azure openai api key header, azure deployment names config, self-hosted azure ai meetings, azure tts voice per language]
sidebar_label: Microsoft Azure
sidebar_position: 3
---

# Microsoft Azure Provider Guide

Azure is the one provider that needs **two** configuration paths in Plug-N-Meet. Use the correct section for each service:

| Part | Provider type | Services |
| --- | --- | --- |
| **Part 1** — native Azure Cognitive Services | `azure` | `transcription`, `translation`, `speech-synthesis` |
| **Part 2** — Azure OpenAI / Azure AI Foundry | `openai` | `ai_agent`, `ai_text_chat`, `meeting_summarizing` |

## Why Two Parts

**Part 1 — native `azure`.** Azure Speech and Azure Translator are purpose-built speech and translation services, and the `azure` provider talks to them directly: Speech-to-Text over the Speech SDK WebSocket, the Translator REST API, and Neural TTS. These three services are exactly what native `azure` implements. It has **no LLM runtime** — `ai_text_chat`, `meeting_summarizing`, and `ai_agent` are not available on `provider: "azure"`.

**Part 2 — Azure OpenAI through `provider: "openai"`.** Azure OpenAI and Azure AI Foundry expose an OpenAI-compatible surface at your resource's `/openai/v1` path. By defining that endpoint as an `openai` account with `auth_header: "api-key"`, the LLM services run on Azure models with no other code path.

Both parts live in the same `insights` block, so an Azure-only deployment uses two provider sections and six service entries.

## Part 1: Native Azure Cognitive Services

### Provider Accounts

Two accounts, because Speech and Translator are separate Azure resources with separate keys:

```yaml
insights:
  providers:
    azure:
      # Regional Speech resource: STT and Neural TTS
      - id: "eastus_standard"
        credentials:
          api_key: "YOUR_AZURE_SPEECH_KEY"
          region: "eastus"

      # Global Translator resource: chat and caption translation
      - id: "transGlobal"
        credentials:
          api_key: "YOUR_AZURE_TRANSLATOR_KEY"
          region: "global"
        options:
          endpoint: "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"
```

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique account name, for example `"eastus_standard"` or `"transGlobal"`. |
| `credentials.api_key` | string | Yes | Resource key. |
| `credentials.region` | string | Yes | Azure region. Use the Speech resource region for `transcription` and `speech-synthesis`, and `"global"` for a global Translator resource. |
| `options.endpoint` | string | Translator only | Full Translator request URL **including** `/translate?api-version=3.0`. The `translation` service fails without it. |

:::warning
The Translator `endpoint` must be the complete operation URL: `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`. Set it on the **provider account**, not on the service entry. A bare host is not enough.
:::

### `transcription`

Streams allowed speakers' microphone audio to Azure Speech-to-Text and publishes partial and final caption chunks to the room.

```yaml
transcription:
  provider: "azure"
  id: "eastus_standard"
  options:
    max_selected_trans_langs: 2
  pricing:
    default:
      price_per_hour: 0.36
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.max_selected_trans_langs` | integer | `2` | Maximum simultaneous caption languages per room. |

Azure Speech Translation performs live speech-to-text and target-language caption translation in a single pass, so rooms that request translated captions get them from the same audio stream rather than a second service call.

### `translation`

Uses the Azure Translator REST API for chat messages and bulk text translation. Rate, length, and language limits are Azure's.

```yaml
translation:
  provider: "azure"
  id: "transGlobal"
  options:
    max_selected_trans_langs: 5
  pricing:
    default:
      price_per_million_characters: 10.00
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `options.max_selected_trans_langs` | integer | `5` | Maximum target languages per room. Separate from the caption limit. |

This service must point at the **Translator** account. Pointing it at the regional Speech account fails, because Speech keys are not accepted by the Translator API.

### `speech-synthesis`

Speaks translated captions with Azure Neural voices. Voices are mapped **per language**, which is the main advantage of native Azure TTS.

```yaml
speech-synthesis:
  provider: "azure"
  id: "eastus_standard"
  options:
    voice-en: "en-US-JennyNeural"
    voice-es: "es-ES-ElviraNeural"
    voice-fr: "fr-FR-DeniseNeural"
    voice-de: "de-DE-AmalaNeural"
    voice-bn: "bn-IN-TanishaaNeural"
  pricing:
    default:
      price_per_million_characters: 16.00
```

| Key | Type | Description |
| --- | --- | --- |
| `options.voice-<lang>` | string | Neural voice used when synthesizing that target language, for example `voice-en`, `voice-es`, `voice-fr`, `voice-de`, `voice-bn`. |

Add one `voice-<lang>` key per language you want spoken. A language without a voice is not spoken aloud, and an invalid voice ID fails only that language, not the session.

### Pricing

| Service | Key | Meters |
| --- | --- | --- |
| `transcription` | `pricing.default.price_per_hour` | `SPEECH_TRANSCRIPTION_USAGE` from transcribed duration |
| `translation` | `pricing.default.price_per_million_characters` | `CHAT_TRANSLATION_USAGE` from translated character count |
| `speech-synthesis` | `pricing.default.price_per_million_characters` | `SYNTHESIZED_SPEECH_USAGE` from synthesized characters |

Translation cost is metered by **characters**, not tokens. Omit the rate and translation artifacts show zero cost.

## Part 2: Azure OpenAI via the `openai` Provider

Add your Azure OpenAI resource as a second provider section. The base URL is the resource's OpenAI-compatible v1 path:

```yaml
insights:
  providers:
    openai:
      - id: "azure-openai"
        credentials:
          api_key: "YOUR_AZURE_OPENAI_KEY"
        options:
          endpoint: "https://<your-resource>.openai.azure.com/openai/v1"
          auth_header: "api-key"
```

| Key | Value | Why |
| --- | --- | --- |
| `credentials.api_key` | Azure OpenAI key | Sent as the request credential. |
| `options.endpoint` | `https://<your-resource>.openai.azure.com/openai/v1` | Azure's OpenAI-compatible surface. `https` is converted to `wss` automatically for WebSocket services. |
| `options.auth_header` | `"api-key"` | Azure expects `api-key: <key>`. The default `Authorization: Bearer` is rejected. |

For `ai_agent`, also set `realtime_auth_header: "api-key"`. The agent opens its own WebSocket and does not inherit the account header.

### Deployment names, not model names

Every model field in the service `options` is an **Azure deployment name**, not the upstream OpenAI model identifier:

- `options.realtime_model` / `options.live_model`
- `options.chat_model`
- `options.summarize_model`
- `options.transcription_model`
- `options.delegation_model`

`pricing` keys follow the same rule. If your deployment is named `gpt-realtime-prod`, write `pricing: gpt-realtime-prod: ...` (quoted), or use `pricing.default` to avoid repeating deployment names.

Not every OpenAI model is available in every region. Deploy the models you need in the Foundry portal first, then reference those deployment names.

### `ai_text_chat`

```yaml
ai_text_chat:
  provider: "openai"
  id: "azure-openai"
  options:
    chat_model: "gpt-chat-prod"
    summarize_model: "gpt-mini-prod"
    context_window: 5
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

### `meeting_summarizing`

```yaml
meeting_summarizing:
  provider: "openai"
  id: "azure-openai"
  options:
    transcription_model: "whisper-prod"
    summarize_model: "gpt-mini-prod"
  pricing:
    default:
      input_price_per_million_tokens: 1.25
      output_price_per_million_tokens: 10.00
```

Large recordings are chunked into segments of 20 MB or less, each transcribed with the audio transcription deployment, then summarized.

### `ai_agent`

Both agent architectures run on Azure deployments. Realtime mode:

```yaml
ai_agent:
  provider: "openai"
  id: "azure-openai"
  options:
    realtime_model: "gpt-realtime-prod"
    summarize_model: "gpt-mini-prod"
    default_voice: "marin"
    turn_detection: "semantic_vad"
    realtime_auth_header: "api-key"
  pricing:
    realtime_model:
      input_price_per_million_tokens: 4.00
      audio_input_price_per_million_tokens: 32.00
      image_input_price_per_million_tokens: 4.00
      output_price_per_million_tokens: 16.00
      audio_output_price_per_million_tokens: 64.00
    summarize_model:
      input_price_per_million_tokens: 0.25
      output_price_per_million_tokens: 2.00
```

If your resource exposes a Live model, set `live_model` **and** `delegation_model` (both deployment names). `delegation_model` is enforced at startup, and Mode 2 bills speech by `pricing.live_model.price_per_minute` instead of per token. See the [OpenAI & Self-Hosted guide](/docs/ai-agent/providers/openai).

## Complete All-Azure Production Configuration

All six services on Microsoft Azure: Speech and Translator for the speech stack, Azure OpenAI for the LLM stack.

```yaml
insights:
  enabled: true
  providers:
    azure:
      - id: "eastus_standard"
        credentials:
          api_key: "YOUR_AZURE_SPEECH_KEY"
          region: "eastus"
      - id: "transGlobal"
        credentials:
          api_key: "YOUR_AZURE_TRANSLATOR_KEY"
          region: "global"
        options:
          endpoint: "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"

    openai:
      - id: "azure-openai"
        credentials:
          api_key: "YOUR_AZURE_OPENAI_KEY"
        options:
          endpoint: "https://<your-resource>.openai.azure.com/openai/v1"
          auth_header: "api-key"

  services:
    transcription:
      provider: "azure"
      id: "eastus_standard"
      options:
        max_selected_trans_langs: 2
      pricing:
        default:
          price_per_hour: 0.36

    translation:
      provider: "azure"
      id: "transGlobal"
      options:
        max_selected_trans_langs: 5
      pricing:
        default:
          price_per_million_characters: 10.00

    speech-synthesis:
      provider: "azure"
      id: "eastus_standard"
      options:
        voice-en: "en-US-JennyNeural"
        voice-es: "es-ES-ElviraNeural"
        voice-fr: "fr-FR-DeniseNeural"
        voice-de: "de-DE-AmalaNeural"
        voice-bn: "bn-IN-TanishaaNeural"
      pricing:
        default:
          price_per_million_characters: 16.00

    ai_text_chat:
      provider: "openai"
      id: "azure-openai"
      options:
        chat_model: "gpt-chat-prod"
        summarize_model: "gpt-mini-prod"
        context_window: 5
      pricing:
        default:
          input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 10.00

    meeting_summarizing:
      provider: "openai"
      id: "azure-openai"
      options:
        transcription_model: "whisper-prod"
        summarize_model: "gpt-mini-prod"
      pricing:
        default:
          input_price_per_million_tokens: 1.25
          output_price_per_million_tokens: 10.00

    ai_agent:
      provider: "openai"
      id: "azure-openai"
      options:
        realtime_model: "gpt-realtime-prod"
        summarize_model: "gpt-mini-prod"
        default_voice: "marin"
        turn_detection: "semantic_vad"
        realtime_auth_header: "api-key"
      pricing:
        realtime_model:
          input_price_per_million_tokens: 4.00
          cached_input_price_per_million_tokens: 0.40
          audio_input_price_per_million_tokens: 32.00
          audio_cached_input_price_per_million_tokens: 0.40
          image_input_price_per_million_tokens: 4.00
          output_price_per_million_tokens: 16.00
          audio_output_price_per_million_tokens: 64.00
        summarize_model:
          input_price_per_million_tokens: 0.25
          output_price_per_million_tokens: 2.00
```

Everything stays inside your Azure tenant and region: audio never leaves the speech resources, and LLM traffic goes to your own Foundry deployment.

## Common Pitfalls

- **`provider: "azure"` for the agent, chat, or summaries.** Native `azure` does not implement those services. Use the `azure-openai` account with `provider: "openai"`.
- **Missing Translator endpoint path.** The endpoint must be the full `/translate?api-version=3.0` URL on the provider account.
- **Default auth header against Azure OpenAI.** Set `auth_header: "api-key"` on the account and `realtime_auth_header: "api-key"` on the agent, or every call returns 401.
- **OpenAI model names as deployment names.** Use the deployment name you created in Foundry, and quote any pricing key that contains a hyphenated custom name you did not create as `default`.
- **Wrong region on the Speech account.** TTS and STT both fail when `region` does not match the resource.

## Related Pages

- [Server & Provider Setup](/docs/ai-agent/configuration): shared provider structure, capability matrix, and BYOK.
- [OpenAI & Self-Hosted Provider Guide](/docs/ai-agent/providers/openai): full detail on the LLM services used in Part 2.
- [Google Gemini Provider Guide](/docs/ai-agent/providers/google)
- [Live Captions, STT & Translation](/docs/ai-agent/speech-to-text-and-translation)
- [AI Meeting Summarization](/docs/ai-agent/meeting-summarization)
