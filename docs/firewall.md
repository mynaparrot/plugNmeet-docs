---
title: Firewall Configuration Guide for Plug-N-Meet
description: How to configure your firewall and NAT for a self-hosted Plug-N-Meet server, including required TCP/UDP ports for WebRTC, TURN, and HTTPS.
keywords: [firewall, ports, networking, nat, turn, stun, udp, tcp, webrtc ports]
sidebar_position: 2
sidebar_label: Firewall & Ports
---

# Firewall & Ports Configuration

A correctly configured firewall is the most critical step for a successful Plug-N-Meet installation. If your server is behind a firewall or NAT (which is true for almost all cloud providers like AWS, Google Cloud, Azure, etc.), you must ensure that the correct ports are open to allow traffic to reach the server.

This guide will show you which ports to open and how to test your configuration.

---

## Required Ports

You must allow incoming traffic on the following ports:

| Port          | Protocol | Required | Description                                                  |
| :------------ | :------- | :------- | :----------------------------------------------------------- |
| **80**        | TCP      | **Yes**  | Required by Let's Encrypt to issue SSL certificates.         |
| **443**       | TCP      | **Yes**  | The primary HTTPS port for all application and API traffic.  |
| **7881**      | TCP      | **Yes**  | A fallback port for WebRTC media when UDP is blocked.        |
| **50000-60000** | UDP      | **Yes**  | The primary port range for all WebRTC audio and video media. |

:::info[What about TURN?]
The installation script automatically sets up and configures a TURN server for you on port 443 over TCP/UDP, so you typically do not need to open a separate port for it.
:::

---

## Cloud Provider Guides

Most cloud providers have a "Security Group" or "Firewall" section where you can create these rules. Here are links to the official documentation for popular providers:

*   [Amazon AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html)
*   [Google Cloud](https://cloud.google.com/vpc/docs/using-firewalls)
*   [Microsoft Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/nsg-quickstart-portal)
*   [DigitalOcean](https://docs.digitalocean.com/products/networking/firewalls/how-to/configure-rules/)

---

## Testing Your Configuration (Optional but Recommended)

Before running the main installation script, it's a good idea to verify that your ports are open. The `ncat` tool (an improved version of `netcat`) is perfect for this.

### 1. On Your Plug-N-Meet Server

First, install `ncat` and start listening on a port. We'll use port 443 as an example.

```sh
# Install the tool
sudo apt update && sudo apt install -y nmap

# Listen for TCP traffic on port 443
sudo ncat -l -p 443 --keep-open --verbose
```

The server will now wait for a connection.

### 2. From an External Computer

On a *different computer* (like your laptop), use `ncat` to connect to your server. Replace `your_server_ip` with your server's public IP address.

```bash
# On macOS (with Homebrew) or Linux: brew install nmap
# On Windows: download from nmap.org

ncat your_server_ip 443 --verbose
```

Now, type `hello` and press Enter.

### 3. Check the Results

*   If the connection is **successful**, you will see "Connection from [your_ip] received" on your server, and the word `hello` will appear.
*   If the connection **fails** (it times out or is refused), your firewall rule is incorrect. Double-check your cloud provider's settings and try again.

You can repeat this test for the other ports (`80`, `7881`) and for UDP by adding the `-u` flag (e.g., `sudo ncat -u -l -p 50005 ...`).
