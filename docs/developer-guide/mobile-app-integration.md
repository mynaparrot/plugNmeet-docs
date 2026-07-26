---
title: "Build a Custom Video Conference App with plugNmeet Hybrid Integration"
description: "Learn how to build a custom, self-hosted video conferencing app for iOS, Android, Flutter, React Native, or desktop using plugNmeet's hybrid WebView architecture, native media publishing, and the plugNmeet web UI."
sidebar_position: 5
sidebar_label: Custom Video App Guide
---

# Build a Custom Video Conference App with plugNmeet Hybrid Integration

:::info[Upcoming Feature]
This hybrid integration is an upcoming feature in **v2.4.0**. A demo server is available now for testing and development.
:::

Create a **custom video conferencing app** for iOS, Android, Flutter, React Native, desktop, or any native platform using plugNmeet's hybrid integration model. This architecture lets you combine a native media layer with the complete plugNmeet web client interface, giving you a flexible path to build a **self-hosted video call app**, **white-label video app**, or **on-premise WebRTC solution** without rebuilding every conferencing feature from scratch.

In this model, your native application handles media publishing, such as microphone, camera, and screen sharing. The plugNmeet web client runs inside a WebView and provides the meeting interface, including participant lists, chat, whiteboard, moderation controls, and media subscription.

## Who This Guide Is For

This guide is for developers and teams who want to:

- Build an **open source video conference app** using plugNmeet.
- Add self-hosted WebRTC meetings to an existing native app.
- Create a branded or white-label meeting experience for mobile, desktop, or kiosk environments.
- Use native device APIs for microphone, camera, custom processing, or background handling.
- Keep the plugNmeet web UI for conferencing features while controlling the native app shell.

## What plugNmeet Provides and What You Build

plugNmeet provides the conferencing engine, web interface, server APIs, and bridge contract. You provide the native host application and native media implementation.

### plugNmeet Provides

- **plugNmeet Server**: The self-hosted conferencing backend and API layer.
- **plugNmeet Web Client**: The complete web meeting UI that runs inside your WebView.
- **Bridge Contract**: A protobuf-defined messaging protocol that lets the web client and native host communicate.
- **Hybrid Web Mode**: A web-client mode where the WebView acts as the UI controller and media subscriber, while the native app publishes media.

### You Build

- **Native App Shell**: Your iOS, Android, Flutter, React Native, desktop, or other native application.
- **Native Media Publisher**: The native LiveKit connection that captures and publishes microphone, camera, and screen-share tracks.
- **App-Specific UX**: Login, branding, navigation, app permissions, native camera/audio processing, and platform-specific behavior.

> Production native apps must not embed the plugNmeet API key or secret. Your backend should hold the API credentials and issue a plugNmeet JWT for the native app.

## Why Use the Hybrid Model?

The hybrid model gives you the flexibility of native development and the speed of using the existing plugNmeet meeting UI.

- **Native media performance**: Capture and publish media using platform-native APIs. This is especially important for features like screen sharing, which is not supported by most mobile browsers.
- **Full plugNmeet web UI**: Keep participant lists, chat, whiteboard, moderation controls, layout handling, and subscriber rendering inside the web client.
- **Faster mobile app development**: Build only the native shell and media layer instead of recreating the full meeting UI.
- **White-label customization**: Control your native app branding while using plugNmeet's customizable client assets.
- **Self-hosted deployment**: Keep the infrastructure under your control for privacy, compliance, and on-premise use cases.

## Architecture Overview

The core idea is simple: one logical user is represented by two LiveKit participants.

- The **web participant** subscribes to media and controls the meeting UI.
- The **native participant** publishes media from the native app.

![Hybrid Integration Architecture](/img/hybrid-architecture.png)

## Responsibilities by Component

### Native Application: Media Publisher and Device Manager

Your native app is responsible for:

- Hosting the plugNmeet web client inside a WebView.
- Receiving `serverUrl` and a plugNmeet JWT from your backend.
- Calling `POST /api/getClientFiles` with the JWT to fetch client assets.
- Building and loading the web-client HTML shell.
- Listening for bridge commands from the web client.
- Capturing microphone, webcam, and screen-share media using native APIs.
- Connecting to LiveKit with the native publish-only token.
- Publishing, muting, unmuting, and unpublishing native media tracks.
- Cleaning up media and LiveKit connections when the WebView leaves, reloads, or stops sending heartbeat messages.

### Web Client: UI Controller and Subscriber

The plugNmeet web client is responsible for:

- Rendering the full meeting UI inside the WebView.
- Verifying the plugNmeet JWT through `POST /api/verifyToken`.
- Entering hybrid mode when `client_type = HYBRID_WEB`.
- Hiding browser-side media publishing controls and device-processing options.
- Connecting to LiveKit with a subscribe-only token.
- Sending native media commands over the bridge.
- Receiving and displaying all subscribed tracks, including the local user's native-published tracks.
- Maintaining UI state from LiveKit events and native bridge status messages.

### Customer Backend

Your backend is responsible for:

- Holding the plugNmeet API key and secret.
- Creating rooms when needed.
- Calling `POST /auth/room/getJoinToken`.
- Setting `userInfo.client_type = HYBRID_WEB` when issuing a token for a hybrid native app.
- Passing the returned plugNmeet JWT to your native app.

## Identity Model

A single logical user has two LiveKit identities:

| Identity | Used By | Permission Model |
| --- | --- | --- |
| `[userID]` | Web client in WebView | Subscribe-only in hybrid mode |
| `[userID]-native` | Native app | Publish-only in hybrid mode |

The `-native` suffix is reserved for native publisher identities. The server rejects user-supplied join tokens whose `user_id` ends with this suffix to avoid identity collisions.

The web client maps any `*-native` identity back to the primary plugNmeet user ID:

- If the resolved primary ID is the local user, the track is adopted as the local user's own media.
- If the resolved primary ID belongs to another participant, the track is displayed as that participant's remote media.

This lets the web UI reuse the existing subscriber infrastructure while still showing native-published tracks in the correct participant tile.

## Production End-to-End Workflow

### Step 1: Authentication and Initialization

Native mobile apps should never contain the plugNmeet API key or secret. The production boot flow uses a plugNmeet JWT, also called the `access_token`.

1. Your backend calls `POST /auth/room/getJoinToken` using the plugNmeet API key.
2. Your backend sets `userInfo.client_type = HYBRID_WEB` in the join-token request.
3. The plugNmeet server returns a JWT.
4. Your backend sends `serverUrl` and the JWT to your native app.
5. The native app calls `POST /api/getClientFiles` using the JWT.
6. The native app builds an HTML shell in memory from the returned client asset files.
7. The native app loads the HTML into the WebView and supplies the JWT, for example through `?access_token=<jwt>` or by injecting it before boot.
8. The web client calls `POST /api/verifyToken`.
9. If the verify response contains `client_type = HYBRID_WEB`, the web client enters hybrid mode.

### Step 2: LiveKit Token Hand-Off

After joining the room services, the web client requests media server connection data.

For a normal web user, the server returns one LiveKit token with normal publish and subscribe permissions.

For a `HYBRID_WEB` user, the server returns:

- A **subscribe-only LiveKit token** for the web identity `[userID]`.
- A **publish-only LiveKit token** for the native identity `[userID]-native`.

The web client connects to LiveKit using the subscribe-only token. Then it sends the native publish-only token to the native host using the bridge action `INITIALIZE_NATIVE_PUBLISHER`.

Example wrapped `NativeBridgeMsg` payload (in standard proto3 JSON camelCase format):

```json
{
  "action": "INITIALIZE_NATIVE_PUBLISHER",
  "initializeNativePublisher": {
    "livekitUrl": "wss://livekit.plugnmeet.cloud",
    "token": "<native_publish_only_livekit_token>",
    "nativeUserId": "<userID>-native",
    "e2ee": {
      "enabled": false
    }
  }
}
```

### Step 3: Native Media Publishing

When the user starts microphone, webcam, or screen sharing from the web UI, the web client does not request browser media permissions. Instead, it sends a bridge command such as `PUBLISH_NATIVE_MEDIA`.

The native app then:

1. Requests platform permission if needed.
2. Captures the requested media source using native APIs.
3. Connects to LiveKit using the publish-only native token, if it is not already connected.
4. Publishes the track as `[userID]-native`.
5. Sends a status or track-state message back to the web client.

### Step 4: Display and Synchronization

The web client receives the native-published track through LiveKit subscription and maps `[userID]-native` back to `[userID]`.

For local native audio, the web client must avoid playing the subscribed audio back to the same user to prevent echo. The track can still be used for active speaker detection and UI state.

For video and screen-share tracks, the web UI displays the track under the primary participant identity.

## Communication Bridge API

The bridge contract is defined in `plugnmeet_native_bridge.proto`. The wire format is **proto3 JSON text** over the WebView messaging channel, not binary protobuf. Enum values appear as string names in JSON, which makes debugging easier in WebView environments.

The action names below are shown as the proto enum names used by the bridge contract.

### Web Client to Native Host

| Action | Payload | Description |
| --- | --- | --- |
| `INITIALIZE_NATIVE_PUBLISHER` | `{ livekitUrl, token, nativeUserId, e2ee? }` | Provides the native host with the LiveKit URL and publish-only token. |
| `PUBLISH_NATIVE_MEDIA` | `{ source }` | Requests native publishing for `MIC`, `WEBCAM`, or `SCREENSHARE`. |
| `UNPUBLISH_NATIVE_MEDIA` | `{ source }` | Requests that the native app stop publishing the selected media source. |
| `MUTE_NATIVE_MEDIA` | `{ source }` | Mutes an already-published native track without unpublishing it. |
| `UNMUTE_NATIVE_MEDIA` | `{ source }` | Unmutes a previously muted native track. |
| `NATIVE_HEARTBEAT_PING` | `{ ts }` | Web-to-native keepalive message. |
| `TEARDOWN_NATIVE_PUBLISHER` | `{}` | Requests that the native app disconnect from LiveKit and release media resources. |

### Native Host to Web Client

| Action | Payload | Description |
| --- | --- | --- |
| `NATIVE_MEDIA_STATUS` | `{ source?, deviceId?, error? }` | Confirms a native action or reports an error. |
| `NATIVE_TRACK_PUBLISHED` | `{ userId, kind, source }` | Notifies the web client that a native track was published. |
| `NATIVE_TRACK_UNPUBLISHED` | `{ userId, kind, source }` | Notifies the web client that a native track was unpublished. |
| `NATIVE_MEDIA_MUTED` | `{ source, muted }` | Confirms the native mute state. |
| `NATIVE_HEARTBEAT_PONG` | `{ ts }` | Native response to heartbeat ping. |
| `NATIVE_ERROR` | `{ msg, context? }` | Reports a generic error from the native host. |

### Media Sources

Supported media sources are:

- `MIC`
- `WEBCAM`
- `SCREENSHARE`

## Bridge Transport Support

The web client bridge should detect the available transport in this priority order:

1. `window.ReactNativeWebView.postMessage(...)` for React Native WebView.
2. `window.webkit.messageHandlers.<name>.postMessage(...)` for iOS WKWebView.
3. An Android-injected JavaScript interface, such as `window.PnmNative.postMessage(...)`.
4. `window.parent.postMessage(...)` as an iframe or desktop fallback.

Incoming messages should be handled in a way that works across WebView environments. React Native WebView may deliver messages through `document`, so implementations should listen on both `window` and `document` where applicable.

## Heartbeat and Reinitialization

The web client sends `NATIVE_HEARTBEAT_PING` while the room is active. The native host should respond with `NATIVE_HEARTBEAT_PONG`.

If the native host stops receiving pings for the watchdog window, it should assume that the WebView was closed, reloaded, or crashed. The native app should then:

- Unpublish all native tracks.
- Disconnect the native LiveKit client.
- Release microphone, camera, and other media resources.

If the native host receives `INITIALIZE_NATIVE_PUBLISHER` again, it should treat it as a reinitialization request. It should tear down any existing native LiveKit connection before connecting with the new credentials.

## Mute and Admin-Forced Mute

In hybrid mode, the web UI forwards media state changes to the native app. Muting and unmuting should not necessarily unpublish the track.

- `MUTE_NATIVE_MEDIA` mutes an existing native track.
- `UNMUTE_NATIVE_MEDIA` unmutes an existing native track.
- `UNPUBLISH_NATIVE_MEDIA` fully stops publishing the selected source.

When a moderator forces mute for a user, the web client should forward the mute request to the native host. The server-side mute behavior should also apply to the `[userID]-native` participant tracks so all participants see the correct muted state.

## E2EE Hand-Off

If end-to-end encryption is enabled for the room, the native publisher must use the same encryption key as the web client. The key is handed to the native app as part of `INITIALIZE_NATIVE_PUBLISHER`.

Example:

```json
{
  "livekitUrl": "wss://livekit.example.com",
  "token": "<native_publish_only_livekit_token>",
  "nativeUserId": "<userID>-native",
  "e2ee": {
    "enabled": true,
    "key": "<base64_encoded_key>"
  }
}
```

For production security:

- Do not send E2EE keys with a wildcard target origin.
- Prefer platform-native bridge channels where available.
- Do not log bridge handshake payloads.
- If a target native platform cannot support E2EE, do not enable E2EE for that hybrid session.

## Native App Implementation Checklist

Use this checklist when building your native app shell.

### Required

- Receive `serverUrl` and plugNmeet JWT from your backend.
- Call `POST /api/getClientFiles` with the JWT.
- Build and load the web-client HTML shell in the WebView.
- Pass the JWT to the web client.
- Implement bridge receive/send logic.
- Handle `INITIALIZE_NATIVE_PUBLISHER`.
- Connect to LiveKit using the native publish-only token.
- Implement `PUBLISH_NATIVE_MEDIA` for microphone and camera.
- Implement `MUTE_NATIVE_MEDIA` and `UNMUTE_NATIVE_MEDIA`.
- Implement `UNPUBLISH_NATIVE_MEDIA`.
- Implement `TEARDOWN_NATIVE_PUBLISHER`.
- Send `NATIVE_MEDIA_STATUS` for success or error states.
- Send `NATIVE_TRACK_PUBLISHED` and `NATIVE_TRACK_UNPUBLISHED` when track state changes.
- Reply to `NATIVE_HEARTBEAT_PING` with `NATIVE_HEARTBEAT_PONG`.
- Tear down the native publisher if the WebView heartbeat stops.

### Recommended

- Implement `PUBLISH_NATIVE_MEDIA` for screen sharing.
- Treat repeated `INITIALIZE_NATIVE_PUBLISHER` as a full reinitialization.
- Provide native permission prompts and clear error messages.
- Keep native media and WebView lifecycle tightly synchronized.
- Avoid embedding API keys or secrets in production apps.
- Label any internal demo that embeds API credentials as demo-only.

### Optional

- E2EE support.
- Native virtual background or camera effects.
- Custom device picker UI.
- Background mode handling.
- Platform-specific audio routing controls.

## Demo Applications

plugNmeet does not require a mobile SDK. The hybrid approach uses the web client in a WebView with a native media bridge. We provide demo apps that showcase this hybrid integration pattern, which is the recommended way to build a mobile app with plugNmeet.

This pattern—hosting the web client in a WebView and publishing media (mic, webcam, and screen share) natively—is necessary because most mobile browsers do not support screen sharing directly. By using a native bridge, you gain full control over device hardware.

Check the demo apps in our [plugNmeet mobile app repository](https://github.com/mynaparrot/plugnmeet-mobile-app) to understand the pattern.

> Demo-only note: an internal demo may use API key and secret inside the app for convenience, but production apps must never do this. Production apps should receive only `serverUrl` and a plugNmeet JWT from a trusted backend.

## Summary

plugNmeet hybrid integration lets you build a custom native video conferencing app while keeping the full plugNmeet web meeting UI. The web client acts as the UI controller and subscriber. The native app acts as the media publisher and device manager. Together, they provide a practical architecture for building self-hosted, white-label, mobile-friendly WebRTC conferencing apps with strong native control and fast integration.
