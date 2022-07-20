---
sidebar_position: 2
---

# Ports & firewall

To communicate with clients, plugNmeet and LiveKit use several ports. Before installing `plugNmeet`, ensure that those ports are not blocked by your firewall.

## Ports

When installing plugNmeet behind a firewall, make sure the following ports are open:

| Port        | Type | Required | Description                                                                                                |
| ----------- | ---- | -------- | :--------------------------------------------------------------------------------------------------------- |
| 80          | TCP  | Yes      | Usually required when issuing an SSL certificate with Let's Encrypt.                                       |
| 443         | TCP  | Yes      | The primary HTTPS port for communicating with haproxy. Haproxy will interact with other services.          |
| 7881        | TCP  | Yes      | Used when the client could not connect via UDP (e.g. VPN, corporate firewalls)                             |
| 50000-60000 | UDP  | Yes      | LiveKit advertises these ports as WebRTC host candidates (each participant in the room will use two ports) |
| 443         | UDP  | No       | Optional                                                                                                   |

## Testing the firewall

After you have made the changes to you firewall settings, before proceeding to the installation, take a moment and test that you have configured the firewall correctly.

To test connections on various ports needed by plugNmeet, you will use a tool called `netcat` to listen for connections. You’ll use `netcat` on the plugNmeet server and on external server (outside the firewall) to generate connections. If the connections test fails, the firewall configuration is incorrect.

First, install `netcat` on the plugNmeet server using the following command:

```bash
sudo apt install netcat
```

If you've already installed plugNmeet server using the installation script, you'll need to stop haproxy and plugnmeet server before testing. Otherwise ports will be keep using.

```bash
systemctl stop plugnmeet
systemctl stop haproxy
```

We can now run netcat to listen on ports and try connecting from an external computer. As root, run the following command:

```bash
nc -l 80
```

`netcat` is now going to echo to the terminal any text it receives on port 80 (you can quit the command later using Ctrl/Control + c).

Next, on a second computer that is outside of the firewall, it must go through the firewall to access the plugNmeet server – install `netcat` as well. If you're using **Windows**, you can get netcat [here](https://eternallybored.org/misc/netcat/). Replace YOUR_SERVER_IP with your plugNmeet domain or IP address of your plugNmeet server, run the following command

```bash
nc YOUR_SERVER_IP 80
```

and type type the word `test` and press ENTER. If the firewall is forwarding incoming connections on port 80 to the internal plugNmeet server, you should see the word `test` appear after the `nc -l 80` command, as in

```bash
nc -l 80
test
```

If the word `test` does not appear, double-check the firewall configuration to ensure its forwarding connections on port 80 and then test again.

Repeat these tests with port `443` & `7881`. That covers the TCP ports.

Next, we need to test that UDP connections in the range 50000-60000 are forwarded as well. On your plugNmeet server, run the following netcat command to listen for incoming data via UDP on port 50008 (here, we’re picking a port in the range 50000-60000).

```bash
nc -u -l 50008
```

Again, on a computer outside the firewall, replace YOUR_SERVER_IP with your plugNmeet domain or IP address of your plugNmeet server and run the command

```bash
nc -u YOUR_SERVER_IP 50008
```

Type `test` into the terminal and press ENTER. You should see the word test appear on the terminal of the plugNmeet server, as in

```bash
nc -u -l 50008
test
```

As before, if the above test fails, double-check the settings of the firewall to ensure its properly forwarding UDP packets in the range 50000-60000 and test again.
