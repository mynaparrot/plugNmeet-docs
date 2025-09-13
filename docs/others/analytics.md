---
title: Meeting Analytics Overview | plugNmeet
description: An overview of the meeting analytics and reporting features in plugNmeet, which provide insights into session duration and participant engagement.
keywords: [analytics, reporting, meeting stats, usage data, insights]
sidebar_position: 1
sidebar_label: Analytics
---

# Analytics data

plugNmeet will provide detail analytics data about the session. After session had been finished PNM will create a `json` file with all the data. You can manage analytics data by [analytics API](/docs/api/analytics/fetch).

### Room data

```
"room_id", "room_title", "room_creation", "room_ended", "room_duration", "room_total_users", "enabled_e2ee", "recording_status", "rtmp_status", "speech_service_total_usage", "external_media_player_status", "etherpad_status", "external_display_link_status", "ingress_created", "breakout_room"
```

### User data

```
"name", "user_id", "is_admin", "duration", "joined", "left", "mic_status", "mic_muted", "talked", "talked_duration", "webcam_status", "raise_hand", "voted_poll", "whiteboard_annotated", "whiteboard_files", "screen_share_status", "speech_services_usage", "public_chat", "private_chat", "chat_files", "interface_invisible", "connection_quality"
```
