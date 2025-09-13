---
title: How to Install plugNmeet Server | Self-Hosted Installation Guide
description: A step-by-step guide to installing the open-source plugNmeet server on your Linux machine using our simple, automated script.
keywords: [install, setup, server, linux, self-host, docker, ubuntu, installation, webrtc server]
sidebar_position: 3
sidebar_label: Installation Guide
---

# Installation

This guide details the official installation process for a self-hosted PlugNmeet server. Our recommended method uses a Docker-based script that automates the setup of all necessary components on a clean Ubuntu or Debian system. The source code for this installation script is available in the [plugNmeet-install](https://github.com/mynaparrot/plugNmeet-install) repository.

Alternatively, for those who prefer a managed service, our official **[PlugNmeet Cloud solution](https://www.plugnmeet.cloud)** provides a ready-to-use server, allowing you to bypass the installation process entirely. Our cloud solution is built with the same commitment to privacy as our open-source version, following strict security best practices to keep your data safe. For large-scale deployments, it also includes our Intelligent Geo-Distribution feature to reduce latency. You can [start with a free plan](https://www.plugnmeet.cloud/pricing) and upgrade as you grow.

This guide will show you how easy it is to set up your own PlugNmeet web conferencing system using the installation script, so you can start video conferencing right away.

## Requirements

- A clean **Ubuntu or Debian** server with a **public IP address**. We recommend **Ubuntu 24.04 LTS**.
- If your infrastructure uses a **firewall**, please [configure ports and firewall](/docs/firewall) before proceeding.
- The server should not have Apache or Nginx pre-installed, or the installation will fail.
- **Hardware recommendations:** The requirements depend on your usage. For small groups, a modest server is sufficient. For production environments, we recommend:
  - **CPU:** At least 4 cores (8 cores or more if using the recorder). A dedicated CPU is recommended.
  - **RAM:** At least 4GB (8GB or more if using the recorder).
  - **Storage:** PlugNmeet does not require much storage unless you use the recorder.
  - **Connection speed:** At least 100 Mbits/sec bandwidth.
- You will need two subdomains pointing to your server's public IP: one for the main PlugNmeet URL (e.g., **plugnmeet.example.com**) and one for the TURN server (e.g., **turn.example.com**).
- A valid email address is required to generate a [Let's Encrypt](httpshttps://letsencrypt.org/) SSL certificate.

**Note:** If DNS resolution fails for either domain, the installation will be aborted.

## Installation Steps

Connect to your Ubuntu/Debian server via SSH. Download and run the installation script as the root user:

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh
```

```bash
sudo bash install.sh
```

Or:

```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh)" root
```

Follow the prompts in the terminal. You will be asked to provide information as needed. At the end of the installation, you will receive all relevant details. The script creates a directory under `/opt` called `plugNmeet` and sets up all necessary files and configurations there.

## Managing Services

```bash
# Start services
systemctl start plugnmeet
systemctl start plugnmeet-recorder

# Restart services
systemctl restart plugnmeet
systemctl restart plugnmeet-recorder

# Stop services
systemctl stop plugnmeet
systemctl stop plugnmeet-recorder

# View log files
cd /opt/plugNmeet
tail -n 100 log/plugNmeet.log
tail -n 100 recorder/logs/recorder.log
```

## Optional: Fonts Installation

If you need to export or import Microsoft Word files containing non-English characters, you may encounter font issues. You can install additional fonts on your Ubuntu/Debian server using the following command:

```bash
sudo apt update && sudo apt -y install --no-install-recommends \
culmus \
fonts-beng \
fonts-hosny-amiri \
fonts-lklug-sinhala \
fonts-lohit-guru \
fonts-lohit-knda \
fonts-samyak-gujr \
fonts-samyak-mlym \
fonts-samyak-taml \
fonts-sarai \
fonts-sil-abyssinica \
fonts-sil-padauk \
fonts-telu \
fonts-thai-tlwg \
ttf-wqy-zenhei \
fonts-arphic-ukai \
fonts-arphic-uming \
fonts-ipafont-mincho \
fonts-ipafont-gothic \
fonts-unfonts-core \
ttf-mscorefonts-installer \
fonts-noto-color-emoji
```

## Updating PlugNmeet

To update PlugNmeet, use the `update.sh` script. This will update all Docker images, the client, and the recorder (if installed).

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh
```

```bash
sudo bash update.sh
```

Or:

```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh)" root
```

## Scalable/Distributed setup

PlugNmeet can be set up on multiple hosts to support a large distribution. The setup procedures were discussed in [this article](/docs/developer-guide/scalable-setup).
