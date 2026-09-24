---
title: "plugNmeet Benchmarks: How Many Users Can a Room Hold?"
description: "Real load-test results for self-hosted open-source video conferencing: from a laptop to a single installer server (20–500 users clean, ~900 limit) to a cluster with 1,000 users. Plain-English summary plus technical details."
keywords: [benchmark, load test, performance, scalability, 1000 users, webinar capacity, self-hosted video conferencing, open source webrtc, livekit scaling, nats fan-out, virtual classroom size, BigBlueButton alternative]
sidebar_label: Benchmarks
sidebar_position: 4
---

# How many people can plugNmeet handle? We tested it.

> Tested September 2026 · plugNmeet [server](https://github.com/mynaparrot/plugNmeet-server) v2.5.1 · [client](https://github.com/mynaparrot/plugNmeet-client) v2.5.2 · [loadtester](https://github.com/mynaparrot/plugNmeet-loadtester) v1.0.1

We often say plugNmeet is lightweight and scalable. That is easy to claim, harder to prove — so we measured it.

We filled real rooms with simulated participants that behave like browser users: they join, chat, draw on the whiteboard, raise hands, react, and send heartbeats. Then we watched what happened on three setups you actually care about:

1. **One laptop doing everything** — the worst case.
2. **One normal server installed with our [single install script](/docs/installation)** — what most self-hosters run.
3. **A production cluster** — what you grow into.

If you are not technical, the next section gives you the whole story in 60 seconds. If you are, keep scrolling for tables, latencies, and how to reproduce it.

## If you only read 60 seconds

Think of a meeting as two jobs: **talking about the meeting** (who joined, chat, whiteboard, reactions) and **moving video and audio**. The first job is cheap for plugNmeet. The second depends on how many cameras are on at once.

Here is what we found:

- **A small class or team meeting (20–100 people in one room): easy.** Even a laptop handles it. A single server answers in ~25–30 ms with zero drops.
- **A large webinar (300–500 people in one room, 1–2 cameras on, everyone else watching): comfortable on one server.** We ran 300 and 500 users in a single room on a 4-vCore / 16 GB server with **zero missed heartbeats, zero errors, ~100% delivery**. Adding live video did not break anything: video joined in ~350 ms and traveled in ~25 ms.
- **Many small rooms are quieter than one giant room.** 10 rooms × 30 users and 5 rooms × 100 users both ran perfectly on the same single server, with slightly better response times than putting all 500 in one room.
- **Around 900 people in one room is where a single 4-vCore server stops.** At 1,000 attempted joins, 901 got in, 99 timed out, and heartbeats started missing. The server did not crash — it just ran out of headroom.
- **1,000 people in one interactive room is possible, but not on one box.** On our managed cluster it ran clean for 18 minutes with zero drops and no lag for two real humans who joined in normal browsers. That cluster uses a custom multi-server media routing setup that is **not part of the open-source single-server install** (more on that below).

Bottom line: **start with one server, grow only when you must.** Most schools, creators, and teams never need more than that. When you do, follow the [Scalable Deployment guide](/docs/developer-guide/scalable-setup).

## How to read this page

- **Non-technical track:** read the summaries, the “what this means for you” section, and skip the tables.
- **Technical track:** read everything, especially [Methodology](#methodology-how-we-tested) and [Test it yourself](#test-it-yourself).

Three terms appear everywhere:

- **p50 / p95:** sort every response time from fastest to slowest. **p50** is the middle — half were faster. **p95** is what 95 out of 100 beat — it shows the unlucky few. Under ~100 ms feels instant.
- **Missed heartbeats:** every user asks “still there?” every 10 seconds. Missed = 0 means nobody lost connection. Anything above 0 means trouble.
- **Fan-out:** when one person chats or draws, the server must deliver it to everyone else. 100% means nobody missed anything.

A run counts as clean when: `joined == requested`, errors show `none`, missed heartbeats = 0, reconnects = 0, fan-out ≈ 100%.

## The three setups

### 1. Laptop (worst case)

One Lenovo laptop (i9-13900H, 32 GB RAM) ran the plugNmeet server, NATS message bus, database, **and** all simulated users at once. Deliberately unfair — if it works here, it works on real hardware.

### 2. Single server via installer (the one most readers will run)

This is the missing piece people asked for: a plain server set up exactly the way the docs describe, using the [Installation Quick Start](/docs/installation).

- **plugNmeet server:** OVH `b3-16-flex`, 4 vCore, 16 GB RAM, Gravelines, France (GRA11). Full install: plugNmeet server + LiveKit + NATS + Redis + MariaDB + HAProxy on one box. Recorder installed but **not recording** during tests.
- **Load generator:** separate OVH box, 8 vCore, 32 GB RAM, Warsaw, Poland (WAW1), running our open-source [plugnmeet-loadtester](https://github.com/mynaparrot/plugnmeet-loadtester).
- **Why two cities?** To include real internet latency. Baseline round-trip between tester and server was ~25–30 ms — similar to what a European audience would see. This is not a localhost trick.
- **Join speed:** 1 user per second globally (so 300 users need at least 5 minutes; we used 10-minute runs, 2 minutes for tiny rooms, 18 minutes for the 1,000-user push).

No special tuning. Firewall as per [Firewall guide](/docs/firewall). Fresh room ID per run.

### 3. Production cluster

Our own cloud edge cluster across two zones, public entry points only. Same application code as open source, but media routing uses a **custom multi-LiveKit setup** that spreads one room across multiple media servers. The open-source install runs one room on a single LiveKit node — that distinction matters for the 1,000-user headline below. Resource usage stayed low throughout — the point of the cluster is headroom and distribution, not struggling hardware.

## Results: laptop

| Users | Joined | Errors | Missed | Heartbeat p50 / p95 | Laptop CPU | Server process |
|-------|--------|--------|--------|---------------------|------------|----------------|
| 20 | 20/20 | none | 0 | 6.0 / 9.6 ms | 8% | under 1% of one core |
| 100 | 100/100 | none | 0 | 5.1 / 9.7 ms | 14% | 1.4% |
| 300 | 300/300 | none | 0 | 5.2 / 18.3 ms | 37% | 3.7% |
| 500 | 500/500 | none | 0 | 4.4 / 27.9 ms | 53% | 6.0% |
| 1000 | 795/1000 | 146 | 673 | 9.2 / 2,719 ms | 59% | 7.9% |

Translation: **clean through 500**, and at 1,000 the laptop itself gave out while the server process stayed under 8% of one core. The bottleneck was the test bench, not plugNmeet.

## Results: single server, meeting activity only (no video yet)

Same webinar shape — chat, whiteboard, notepad, reactions, hands, heartbeats — but no cameras. This isolates the “talking about the meeting” cost.

| Users in one room | Joined | Missed | Heartbeat p50 / p95 | Chat delivery p50 / p95 | Whiteboard pointer p50 / p95 | Fan-out |
|-------------------|--------|--------|---------------------|-------------------------|------------------------------|---------|
| 20 | 20/20 | 0 | 27.8 / 53.1 ms | 26.3 / 26.5 ms | 26.1 / 26.5 ms | 100% |
| 50 | 50/50 | 0 | 27.4 / 53.5 ms | 26.2 / 26.9 ms | 26.1 / 26.8 ms | 100% |
| 100 | 100/100 | 0 | 28.0 / 52.8 ms | 26.0 / 27.4 ms | 26.1 / 27.6 ms | 100% |
| 300 | 300/300 | 0 | 27.9 / 44.2 ms | 26.5 / 33.3 ms | 26.2 / 33.2 ms | 100% |
| 500 | 500/500 | 0 | 33.8 / 103.1 ms | 27.7 / 43.4 ms | 27.8 / 44.4 ms | ~100% (chat 99.9%, rest 100%) |
| 1000 | 901/1000 | 8,109 | 163.8 / 7,734 ms | 73.2 / 224.5 ms | 71.3 / 188.4 ms | degraded |

Notes:

- 20–100 ran for 2 minutes each, 300 and 500 for 10 minutes each, 1,000 for 18 minutes.
- At 500, everything still joined and heartbeats never missed, but p95s start climbing (heartbeat p95 ~103 ms, user-list fetch p50 ~73 ms, p95 ~180 ms). That is the server telling you it is getting busy, not failing.
- At 1,000, 99 users failed with `initialData.timeout` and the rest saw seconds-long replies. Honest ceiling on this 4-vCore box: **somewhere around 900 in one room for meeting activity alone**.
- Server-side during these runs: NATS, LiveKit, and HAProxy were the busiest processes (bursts around 1–1.6 cores for the proxy/bus during fan-out), none saturated the 4 cores. The plugNmeet app process itself stayed light — the heavy lifting is copying each message to everyone, which is NATS’s job.

## Results: same single server, now with live video

We then turned cameras on using `--media video`. Notation: `publishers=2v+5a` means 2 users publish camera+mic and 5 publish mic-only; `subscribers=100/300` means 100 of the 300 users connect to LiveKit, the other 200 are meeting-activity-only.

| Room | Video setup | Joined | Missed | Core (chat/pointer p50) | Video join p50 / p95 | Video travel p50 / p95 | Fan-out |
|------|-------------|--------|--------|-------------------------|----------------------|------------------------|---------|
| 50 users | 1 camera, all 50 watching | 50/50 | 0 | ~26 ms | 349 / 450 ms | 25.2 / 25.7 ms | 100% |
| 20 users | 10 cameras, all 20 watching | 20/20 | 0 | ~26 ms | 350 / 450 ms | 25.2 / 25.4 ms | 100% |
| 300 users | 2 cameras, all 300 watching | 300/300 | 0 | ~26 ms | 357 / 395 ms | 25.2 / 27.8 ms | 100% |
| 300 users (mixed) | 2 cameras + 5 mics, 100 on video, 200 activity-only | 300/300 | 0 | ~26 ms | 351 / 448 ms | 25.2 / 27.6 ms | 100% |

What this means in plain words:

- **Viewers are cheap, publishers cost.** Going from 1 to 10 publishers, or from 50 to 300 viewers, did not move core latencies. Video join stayed ~350 ms, video travel stayed ~25 ms.
- **About the TURN warnings in the video logs.** On the single-server runs you will see `Fail to refresh permissions` / `write: broken pipe` to port 443. That is the installer’s co-located TURN (sharing port 443 TCP on the same box) struggling with refreshes from a distant tester over TCP. It did not affect these results (0 missed, 100% fan-out). On our cluster, which uses a dedicated TURN server, we do not see these errors — careful clustering with TURN separated solves most of it. For production video, keep UDP 50000–60000 open per the [Firewall guide](/docs/firewall) and separate TURN/media as in [Scalable Deployment](/docs/developer-guide/scalable-setup).
- We did **not** test 50+ simultaneous publishers here. Each live camera multiplies media work, so treat the rows above as “webinar shape” (a few presenters, many watchers), not “everyone on camera.”

## Results: same single server, many small rooms

Same 300 or 500 total users, but split up. Real schools and SaaS products look like this, not one giant room.

| Layout | Joined | Missed | Heartbeat p50 / p95 | Fan-out |
|--------|--------|--------|---------------------|---------|
| 10 rooms × 30 users (300 total) | 300/300 | 0 | 32.7 / 58.0 ms | 100% |
| 5 rooms × 100 users (500 total) | 500/500 | 0 | 29.2 / 77.9 ms | 100% |

Splitting helps: per-message fan-out is smaller, lists are shorter, p95s stay flatter than putting all 500 in one room. If your use case is classes or team meetings, this is the row to quote.

## Results: cluster, 1,000 in one room

For completeness, the headline from our managed cluster (custom multi-media-server routing, same app code otherwise):

- Single room, **2 live webcams**, everyone watching, whiteboard + chat + reactions + hands active, **18 minutes**.
- **0 missed heartbeats** (58,161/58,161), **0 reconnects**, **100% fan-out** on every message kind.
- Whiteboard p50 ~15 ms, pointer ~29 ms, chat ~29 ms, heartbeat ~68 ms, video round-trip ~5 ms across 114,000+ samples.
- App server ~21% of one core per node. Each client absorbed ~78 messages/sec sustained.
- Two real humans joined in normal browsers: **no perceptible lag**.

Do not compare this directly to the single-server 1,000-user row. The difference is the media layer: the cluster spreads one room over multiple LiveKit backends; the open-source install keeps one room on one LiveKit node. Everything else (NATS design, API, recorder split) follows the [Scalable Deployment guide](/docs/developer-guide/scalable-setup).

## What this means for you

- **20–100 in a room:** any small VPS from the [Installation guide](/docs/installation) works. Test with 2 vCPU / 4 GB and grow if needed.
- **300–500 in one room (webinar shape):** a single 4-vCore / 16 GB server is comfortable. Keep the recorder on a separate box if you record a lot — transcoding steals CPU from live meetings (see [Scalable Deployment](/docs/developer-guide/scalable-setup)).
- **500+ total across rooms:** same single server still works (5 × 100 was clean). Scale vertically first before clustering.
- **~900+ in one interactive room:** plan a cluster, or use the broadcast pattern: private studio + RTMP to YouTube/Facebook, bring guests on stage via waiting room. See [Hosting large-scale events](/blog/hosting-large-scale-events-the-smart-way).
- **Video rule of thumb:** viewers add little; each extra camera/mic adds real media work. Place media servers close to participants — geography matters more than CPU for video quality.
- **Bandwidth matters more than RAM.** Our install docs recommend minimum 100 Mbits/sec; more is always better for video.

## Honest limits: what we did not test

- **Recorder ON vs OFF:** all rows above ran with the recorder idle. Recording + transcoding on the same box will lower capacity. Isolate it first.
- **Many publishers, 1,000 with video, slow/mobile networks, multi-hour events:** not covered here. They are good “run it yourself” tests — the tool supports `--video-publishers`, `--audio-publishers`, `--subscribers`, `--rooms`, and `--disable` to shape them.
- **Open-source single-room media ceiling:** open-source LiveKit keeps one room on one media node. That is why the single-server 1,000-user push stopped around 900 while the custom cluster went further. If huge single rooms are your product, budget for media clustering work.

If you need one of these gaps filled with numbers before you commit, tell us — we append new results to this page as they come in.

## Methodology: how we tested

- **Tool:** [plugnmeet-loadtester](https://github.com/mynaparrot/plugnmeet-loadtester). Simulated users speak the same HTTP + NATS-WebSocket protocol as the web client, so the server cannot tell them apart. Optional `--media` flag drives LiveKit with real black-frame video.
- **Behavior per user:** join handshake (`verifyToken`, `getJoinToken`, `initialData`), heartbeat every 10 s, online/user lists, chat, whiteboard pointer + scene updates, notepad sync, reactions, hands. Whiteboard cursors dominate (~80%+ of messages) — real audiences are quieter, so these results are a lower bound, not a ceiling.
- **Commands (examples):**
  ```bash
  # meeting activity only, 500 in one room
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-01 --users 500 --duration 10m

  # webinar shape: 300 users, 2 cameras, everyone watches
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-video --users 300 --duration 10m \
    --media video --video-publishers 2 --subscribers 300

  # mixed: 300 users, 2 cameras + 5 mics, 100 on video
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-mixed --users 300 --duration 10m \
    --media video --video-publishers 2 --audio-publishers 5 --subscribers 100

  # many rooms: 5 rooms x 100 users
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-multi --rooms 5 --users 100 --duration 10m
  ```
- **Rules we followed:** fresh `--room` per run (stale rooms block joins), `--join-rate 1/s` default, size the generator at ~10 MB RAM per simulated user, only test servers you own.
- **What we recorded:** `connect`, join paperwork, `ping`, `delivery.*` RTT + fan-out, `mediaJoin`/`mediaRtt` when video is on, plus generator CPU/RSS and machine load. Full flag reference is in the [tool README](https://github.com/mynaparrot/plugnmeet-loadtester).

## Test it yourself

You do not need our hardware. Install with the [Installation Quick Start](/docs/installation), open [Firewall ports](/docs/firewall), then run the commands above starting at `--users 50` and doubling. Stop when missed heartbeats rise above 0 or fan-out drops below ~100% — that is your server’s honest limit for that shape.

### Numbers alone are not enough — join with real browsers

The load tester tells you the server stayed up. Only a human can tell you it *felt* good. So do what we did: mix bots with at least **2 real users in normal browsers** in the same room while the run is going.

- Bots provide the stress (hundreds of joins, chat, whiteboard flood).
- Real users check what bots cannot: whiteboard sync with your own eyes, video smoothness, audio clarity, and whether clicks feel instant.

Just open the room URL twice (two laptops, or one laptop + one phone) and use it normally while the bots run. If the whiteboard stays in sync and audio/video stays smooth, the numbers and the experience agree.

### Test from a different zone if you can

Run the tester and join the real browsers from a different city or network than the server — that adds real internet latency, like your actual audience. Our single-server runs did exactly this (server in France, tester in Poland, ~25–30 ms baseline).

One honest caveat: our managed cluster adds **GEO routing** (users connect to the nearest media region), which is not part of the open-source single-server install. So expect higher video latency at distance on a single server — that is geography, not a bug. Place media servers close to participants when it matters.

Related reading: [Scalable Deployment](/docs/developer-guide/scalable-setup) · [Installation](/docs/installation) · [Backend Architecture Deep Dive](/blog/backend-architecture-deep-dive) · [Scaling Architecture Saves Money](/blog/scaling-architecture-saves-money) · [Hosting large-scale events](/blog/hosting-large-scale-events-the-smart-way)
