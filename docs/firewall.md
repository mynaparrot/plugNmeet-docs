---
title: Firewall Configuration for plugNmeet Server
description: How to configure your firewall and NAT for a self-hosted plugNmeet server, including required TCP/UDP ports for WebRTC, TURN, and HTTPS.
keywords: [firewall, ports, networking, nat, turn, stun, udp, tcp, webrtc ports]
sidebar_position: 2
sidebar_label: Ports & Firewall
---

# Ports & Firewall

PlugNmeet and LiveKit use several ports to communicate with clients. Before installing PlugNmeet, ensure that these ports are not blocked by your firewall.

## Required Ports

If you are installing PlugNmeet behind a firewall, ensure the following ports are open:

| Port        | Type | Required | Description                                                                                                   |
| ----------- | ---- | -------- | :------------------------------------------------------------------------------------------------------------ |
| 80          | TCP  | Yes      | Required for issuing SSL certificates with Let's Encrypt.                                                     |
| 443         | TCP  | Yes      | The primary HTTPS port for communication with HAProxy, which interacts with other services.                          |
| 7881        | TCP  | Yes      | Used when clients cannot connect via UDP (e.g., VPNs, corporate firewalls).                                   |
| 50000-60000 | UDP  | Yes      | LiveKit uses these ports as WebRTC host candidates (each participant will use two ports in this range).        |
| 443         | UDP  | No       | Optional                                                                                                      |

## Firewall Configuration Guides

Depending on your server provider, follow the relevant guide:

- [Amazon AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html)
- [Google Cloud](https://cloud.google.com/vpc/docs/using-firewalls)
- [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/nsg-quickstart-portal)
- [DigitalOcean](https://docs.digitalocean.com/products/networking/firewalls/how-to/configure-rules/)

## Testing Your Firewall

After updating your firewall settings, test your configuration before proceeding with the installation.

To verify that the required ports are open, use the `netcat` tool to listen for connections. You will run `netcat` on your PlugNmeet server and use an external computer (outside the firewall) to initiate connections. If the connection test fails, your firewall configuration is incorrect.

First, install `netcat` on your PlugNmeet server:

```bash
sudo apt install netcat
```

If you have already installed the PlugNmeet server using the installation script, stop HAProxy and the PlugNmeet server before testing. Otherwise, the ports will remain in use.

```bash
systemctl stop plugnmeet
systemctl stop haproxy
```

Run `netcat` on your PlugNmeet server to listen on the required ports. As root, execute the following command:

```bash
nc -l 80
```

`netcat` will now echo any text it receives on port 80 to the terminal (you can quit the command later using Ctrl/Control + c).

Next, on an external computer (outside of the firewall), install `netcat`. If you are using **Windows**, you can download netcat from [here](https://eternallybored.org/misc/netcat/). Replace `YOUR_SERVER_IP` with your PlugNmeet domain or the IP address of your PlugNmeet server, and run the following command:

```bash
nc YOUR_SERVER_IP 80
```

Type the word `test` and press ENTER. If the firewall is correctly forwarding incoming connections on port 80 to the internal PlugNmeet server, you should see the word `test` appear after the `nc -l 80` command, like this:

```bash
nc -l 80
test
```

If the word `test` does not appear, double-check the firewall configuration to ensure it is forwarding connections on port 80, and then test again.

Repeat these tests for ports `443` and `7881`. This covers the testing for TCP ports.

Next, test that UDP connections in the range 50000-60000 are also forwarded. On your PlugNmeet server, run the following netcat command to listen for incoming data via UDP on port 50008 (we're picking a port in the range 50000-60000):

```bash
nc -u -l 50008
```

Again, on a computer outside the firewall, replace `YOUR_SERVER_IP` with your PlugNmeet domain or the IP address of your PlugNmeet server, and run the command:

```bash
nc -u YOUR_SERVER_IP 50008
```

Type `test` into the terminal and press ENTER. You should see the word `test` appear on the terminal of the PlugNmeet server, like this:

```bash
nc -u -l 50008
test
```

As before, if the above test fails, double-check the settings of the firewall to ensure it is properly forwarding UDP packets in the range 50000-60000, and test again.
