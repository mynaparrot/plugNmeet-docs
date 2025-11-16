---
title: How to Install plugNmeet Server | Self-Hosted Installation Guide
description: A step-by-step guide to installing the open-source plugNmeet a server on your Linux machine using our simple, automated script.
keywords: [install, setup, server, linux, self-host, docker, ubuntu, installation, webrtc server]
sidebar_position: 3
sidebar_label: Installation Guide
---

# Installation Quick Start

This guide will walk you through the fastest and easiest way to get your own self-hosted video conferencing platform up and running.

Our recommended method uses a simple, automated script that sets up all the necessary components required to run the platform on a clean Ubuntu or Debian server. Alternatively, for those who prefer a managed service, our official **[PlugNmeet Cloud solution](https://www.plugnmeet.cloud)** provides a ready-to-use server, allowing you to bypass the installation process entirely.

Let's get your server set up.

---

## Step 1: Server Requirements

Before you begin, make sure you have the following:

*   A **clean Ubuntu or Debian server** with a **public IP address**. We recommend any Ubuntu LTS release. It is critical that the server does **not** have other web servers like Apache or Nginx already running, as this will cause conflicts.
*   **Hardware & Bandwidth:** The Plug-N-Meet server itself is a very lightweight application. The hardware you need depends on your expected workload, specifically the number of concurrent users and your recording frequency.

    For a small group or testing, a simple server (e.g., 2 CPU cores, 2-4GB RAM) is sufficient.

    For a production environment, we recommend:
    *   **Bandwidth:** This is the most critical factor. A **minimum of 100 Mbits/sec** is recommended, but more is always better for a quality user experience.
    *   **CPU:** At least 4 cores (8+ recommended if using the recorder).
    *   **RAM:** At least 4GB (8GB+ recommended if using the recorder).
*   **Two subdomains** pointing to your server's public IP (e.g., `plugnmeet.example.com` and `turn.example.com`).
*   A **valid email address** for generating a Let's Encrypt SSL certificate.

:::info[Firewall Configuration]
If your server is behind a firewall, please review our **[Firewall Configuration Guide](/docs/firewall)** to ensure the necessary ports are open before you proceed.
:::

---

## Step 2: Run the Automated Installation

Connect to your server via SSH. The recommended and most transparent method is to download the script first and then execute it. This allows you to inspect the script's contents before running it as root.

```bash
# 1. Download the script
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh

# 2. Run the script as root
sudo bash install.sh
```

**Alternatively**, you can download and execute it in a single command:
```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh)" root
```

The script is interactive and will prompt you for the necessary information, such as your domain names and email address.

At the end of the process, the script will display your **Server URL**, **API Key**, and **API Secret**.

:::info[Your Server Credentials]
We recommend saving these credentials now for easy access. However, if you happen to close the window, don't worry! You can always find them later in the `/opt/plugNmeet/config.yaml` file on your server.
:::

---

## Step 3: Verify Your Installation

Once the installation is complete, you can verify that everything is running correctly.

1.  **Check the Service Status:**

    ```bash
    # Check the main server
    systemctl status plugnmeet

    # Check the recorder service
    systemctl status plugnmeet-recorder
    ```
    Both services should show an `active (running)` status.

2.  **Perform a Test Login:**
    The best way to confirm that the entire system is working is to join a test meeting.

    Navigate to `https://plugnmeet.example.com/login.html`. On this page, you can use the `API_KEY` and `API_SECRET` you saved from the installation to generate a temporary access token and join a test conference.

---

## What's Next?

Congratulations! You now have a fully functional, self-hosted video conferencing platform. Here are a few things you can do next:

*   **Start Using Plug-N-Meet:** Now that your server is running, visit our **[User Guide Overview](/docs/user-guide/overview)** to learn about the different ways you can integrate and use your new platform, from no-code plugins to our powerful API.
*   **Explore the API:** For developers ready to dive in, our **[API Documentation](/docs/api/intro)** provides all the details you need to start building.
*   **Manage Your Server:** Learn about the common commands for **[managing your services](#managing-services)**, including starting, stopping, and viewing logs.

---

## Advanced Topics

### Managing Services

All Plug-N-Meet components run as `systemd` services.

```bash
# To start, restart, or stop the services:
systemctl restart plugnmeet
systemctl restart plugnmeet-recorder
```

To view the log files:
```sh
tail -n 200 -f /opt/plugNmeet/log/plugNmeet.log
tail -n 200 -f /opt/plugNmeet/recorder/logs/recorder.log
```

### Updating Your Server

To update your Plug-N-Meet installation to the latest version, simply run the `update.sh` script:

```sh
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh)" root
```

### Scalable Deployments

For very large-scale needs, Plug-N-Meet can be deployed in a distributed, multi-server cluster. To learn more, read our **[Scalable Deployment Guide](/docs/developer-guide/scalable-setup)**.
