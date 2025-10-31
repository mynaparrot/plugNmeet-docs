---
title: "Scalable PlugNmeet Deployment | A Guide to Distributed Setups"
description: "A high-level guide for scaling a self-hosted plugNmeet deployment. Learn how to create a distributed, multi-server architecture with clustered LiveKit, NATS, and more for high availability."
keywords: [scalable webrtc, distributed setup, plugnmeet scaling, high availability, load balancing, livekit cluster, nats cluster, redis cluster, self-hosted scaling, enterprise webrtc]
sidebar_position: 4
sidebar_label: Scalable Deployment
---

# Scaling Your PlugNmeet Deployment

This guide provides a high-level overview and recommended strategies for scaling a self-hosted plugNmeet deployment to support a large number of concurrent users across multiple servers.

### Before You Begin: A Phased Approach to Scaling

It is critical to understand that a fully distributed, multi-server setup is the most advanced and complex configuration. For many users, simpler scaling strategies can provide the necessary performance boost without the added complexity.

We recommend approaching scaling in phases:

#### Phase 1: Isolate the Recorder (The Most Common Bottleneck)

For optimal performance, especially when recording frequently, we strongly recommend deploying the **`plugnmeet-recorder` on a dedicated server**, separate from your main `plugnmeet-server` and LiveKit instance.

*   **Why?** Recording and post-processing (transcoding) are CPU-intensive tasks. Isolating them prevents recording jobs from impacting the performance of your live meetings.
*   **When?** This should be your first step if you notice performance degradation during active recordings.

However, if you only plan to record sessions infrequently, running the recorder on the same server (as the default installation script does) is a perfectly viable option.

#### Phase 2: Vertically Scale Your Main Server

If you are not recording heavily but are still seeing performance issues, the next step is to **vertically scale** your single server. This simply means adding more CPU cores and RAM. A single, well-provisioned server can comfortably handle **hundreds of concurrent users**.

#### Phase 3: Go Fully Distributed

Only after you have isolated the recorder and vertically scaled your main server should you consider the fully distributed setup described in the rest of this guide. This advanced architecture is intended for very large-scale deployments where a single server is no longer sufficient.

---

## Conceptual Architecture

In a distributed setup, the core components of plugNmeet are separated onto different machines. A typical large-scale architecture consists of:

1.  **Stateless Application & Media Layers:**
    *   Multiple `plugnmeet-server` instances.
    *   Multiple `LiveKit` media server instances.
    *   A standard Load Balancer.
2.  **Stateful & Clustered Infrastructure Layers:**
    *   A `NATS` cluster.
    *   A `Redis` cluster.
    *   A `MariaDB` cluster.
3.  **Horizontally Scaled Recorders:**
    *   Multiple `plugnmeet-recorder` instances, potentially in different operational modes.

---

## Component Scaling Strategy

The key to a successful distributed setup is understanding how each component scales. The components fall into two main categories: stateless services that can be easily load-balanced, and stateful services that require their own specific clustering configurations.

### 1. Stateless Application & Media Layers

These components can be placed behind a standard load balancer, whose primary role is to terminate SSL and distribute initial traffic.

#### The plugNmeet Server

The main `plugnmeet-server` application is **stateless**.
*   **Action:** You can run multiple instances on different machines and place them behind a standard L4 or L7 load balancer using a simple algorithm like round-robin or least connections.
*   **Configuration:** Each instance must be configured to point to the same shared infrastructure (NATS, Redis, and MariaDB).

#### LiveKit Media Server

LiveKit also works behind a load balancer for initial connections.
*   **Action:** The load balancer can terminate SSL and proxy the initial connection to any available LiveKit node.
*   **Critical Note:** Once the connection is established, LiveKit's own internal clustering logic handles all complex media routing. It is **essential to follow the official LiveKit documentation for clustering** to configure the backend correctly.
*   **Firewall Configuration:** Ensure that your firewall rules allow the necessary TCP and UDP ports for WebRTC traffic to reach your LiveKit instances. For a detailed list of required ports, please refer to our **[Firewall Configuration Guide](/docs/firewall.md)**.
*   **Dependency:** A standalone or clustered Redis instance is required for LiveKit clustering.

**(Link: [Official LiveKit Clustering Guide](https://docs.livekit.io/home/self-hosting/distributed))

---

### 2. Stateful & Clustered Infrastructure Layers

**Critical Warning:** The following components have their own robust clustering and service discovery mechanisms. Placing them behind a standard, simple TCP/L4 load balancer without specific, advanced configuration is **highly likely to cause system instability, data corruption, or complete failure.** Always follow the official clustering documentation for these services.

#### NATS Messaging System

*   **Recommendation:** NATS has its own clustering and client routing capabilities. Your `plugnmeet-server` and `plugnmeet-recorder` clients should be configured with a list of all NATS nodes in the cluster. The clients will automatically handle failover.
*   **Action:** Follow the **official NATS documentation for creating a cluster**.

**(Link: [Official NATS Clustering Documentation](https://docs.nats.io/running-a-nats-service/configuration/clustering/jetstream_clustering))

#### MariaDB Database

*   **Recommendation:** For high availability, the database must be clustered. All `plugnmeet-server` instances must point to the same database cluster.
*   **Action:** Use a managed, high-availability database service from a cloud provider, or set up your own solution like a MariaDB Galera Cluster. Follow the official documentation for your chosen solution.

**(Link: [Official MariaDB Documentation](https://mariadb.com/docs/server/ha-and-performance/standard-replication/setting-up-replication))

#### Redis Cache

*   **Recommendation:** For a highly available LiveKit cluster, your Redis instance must also be highly available.
*   **Action:** Use a managed Redis service or set up your own Redis Cluster or Sentinel configuration. Your LiveKit nodes should be configured to connect to this cluster directly.

**(Link: [Official Redis Sentinel Clustering Documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel))

---

### 3. The plugNmeet Recorder

The `plugnmeet-recorder` is a special case. While it is stateful during a job, its discovery and load balancing are handled automatically.

*   **Load Balancing & Discovery:** The recorder does **not** require an external load balancer. Recorders automatically announce their availability over NATS, and the `plugnmeet-server` distributes jobs to them.

*   **Operational Modes:** The `plugnmeet-recorder` supports different operational modes, allowing for a highly scalable and resilient pipeline. Each instance can be configured via the `mode` setting in `config.yaml`:
    *   **`recorderOnly`:** This instance will *only* handle live session recording. Once a raw recording file is captured, it publishes a transcoding job to a queue and immediately becomes available for the next live session. This is ideal for your primary recording servers as it keeps them lightweight and responsive.
    *   **`transcoderOnly`:** This instance will *only* process transcoding jobs. It subscribes to the job queue, performs the CPU-intensive conversion of raw files to MP4, and does not handle any live recordings. You can run a fleet of these workers on cheaper, CPU-optimized VMs to process recordings in parallel without impacting live meetings.
    *   **`both` (Default):** A single instance performs both live recording and transcoding. This is suitable for smaller setups or if you record infrequently.

*   **Configuration:** Each recorder instance must be configured to connect to the same NATS cluster.

*   **Action:** For detailed setup, refer to the **official `plugnmeet-recorder` repository README**.

**(Link: [Official plugNmeet-recorder README](https://github.com/mynaparrot/plugNmeet-recorder))

---

### 4. Shared Filesystem: A Critical Requirement for Data Consistency

In a distributed environment where requests can be handled by any `plugnmeet-server` instance, it is **absolutely critical** that all stateless servers have access to a shared filesystem for storing and retrieving persistent files. Without this, your users will experience broken features like missing file downloads or inaccessible recordings.

You must mount a shared network storage solution (such as **NFS**, **GlusterFS**, or an **S3-compatible object store** mounted as a filesystem) to the same path on **all** of your `plugnmeet-server` and `plugnmeet-recorder` instances.

The following paths in your `config.yaml` must point to this shared location:

*   **`recorder_info.recording_files_path`**: `plugnmeet-recorder` instances write MP4 files here, but **all** `plugnmeet-server` instances need read access to serve download requests via the API.
*   **`analytics_settings.files_store_path`**: When a room ends, any `plugnmeet-server` might write the analytics JSON file. Later, a request to download that file could be handled by a different server, which needs to be able to read it.
*   **`upload_file_settings.path`**: When a user uploads a file in chat, the request might be handled by one server. When another user tries to download it, that request could go to any other server in the cluster.

---

## Configuration

Once your distributed infrastructure is in place, you simply need to update your `config.yaml` file for each `plugnmeet-server` instance to point to the new clustered services.

```yaml
# Example config snippet
redis_info:
  host: "your-redis-cluster-endpoint:6379"
  # ... other redis settings

database_info:
  host: "your-mariadb-cluster-endpoint"
  port: 3306
  username: "your_user"
  password: "your_password"
  db: "plugnmeet"

nats_info:
  nats_urls:
    - "nats://node1.your-domain.com:4222"
    - "nats://node2.your-domain.com:4222"
    - "nats://node3.your-domain.com:4222"

livekit_info:
  host: "http://your-livekit-endpoint" # The endpoint for your LiveKit cluster
  # ... other livekit settings
```

By following this conceptual guide and leveraging the official documentation for each component, you can build a robust, scalable plugNmeet deployment capable of supporting a massive user base.
