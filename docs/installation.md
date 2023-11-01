---
sidebar_position: 3
---

# Installation

Using [docker](https://docs.docker.com/get-docker/) you can install plugNmeet into any platform. We've created an easy to install script which can be used to install all the necessary components in few minutes. The source code can be found in the [plugNmeet-install](https://github.com/mynaparrot/plugNmeet-install) repository.

You can also look into the [plugNmeet cloud solution](https://www.plugnmeet.cloud). plugNmeet Cloud is a ready to use hosting solution. You won't have to worry about server setup or maintenance. We offer a scalable cloud-based solution with a 99.99% SLA. You can start with [free package](https://www.plugnmeet.cloud/pricing) & can upgrade when necessary. 

In this article, we'll go over how simple it is to set up your own plugNmeet web conferencing system using the plugNmeet installation script and immediately begin video conferencing.

## Requirements

  - You'll need a clean **Ubuntu or Debian** server with a **public IP address**. **Ubuntu 22.04 LTS** recommended.
  If your infrastructure is protected by a **firewall**, please first [configure ports & firewall](/docs/firewall) before proceeding.
  - Ubuntu/Debian server does not come pre-installed with apache or nginx, or else the installation will fail.
  - **Hardware recommendation** for server: It's really difficult to provide an estimate. It will depend on how you intend to use it. If you only intend to use plugNmeet with a few users, a smaller server will suffice. Still adhering to the minimum server requirements for production environment:
    
      - **CPU:** At least 4 cores. 8 cores or more, if installed with recorder. **Dedicated CPU** is recommended.
      - **RAM:** At least 4GB; 8GB or more, if installed with recorder.
      - **Storage:** Unless a recorder is also being used, plugNmeet doesn't consume much storage.
      - **Connection speed:** this is a crucial factor, a bandwidth of at least 100 Mbits/sec or greater.
    
  - You'll need 2 subdomains that point to the public IP address of this Ubuntu/Debian server. One for plugNmeet main URL (example: **plugnmeet.example.com**); another for TURN server (example: **turn.example.com**).
  - A valid email address is also required to generate a [Let's Encrypt](https://letsencrypt.org/) SSL certificate.

**_Note:_** If DNS fails for those 2 domains, the installation will be aborted.

## Install

Using SSH, connect to your Ubuntu/Debian server. Download and run the installation script as the root user.

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh
```

```bash
sudo bash install.sh
```

OR

```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh)" root
```

Now, follow the steps in terminal. It will ask you to enter information when necessary. You'll receive the relevant
information at the end of the installation. This script will create a directory under `/opt` called `plugNmeet` and create all directories and configuration files there.

To manage services:

```bash
# to start
systemctl start plugnmeet
systemctl start plugnmeet-recorder

# to restart
systemctl restart plugnmeet
systemctl restart plugnmeet-recorder

# to stop
systemctl stop plugnmeet
systemctl stop plugnmeet-recorder
```

## Fonts installation (optional)

When exporting or importing Microsoft Word files that contain characters other than English, you may run into issues because of font missing. You may install additional fonts in the Ubuntu/Debian server using the commands below:

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
ttf-mscorefonts-installer
```

## Update

To update you can use `update.sh` script. This will update all the docker images, client & recorder (if installed).

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh
```

```bash
sudo bash update.sh
```

OR

```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh)" root
```

## Scalable/Distributed setup

PlugNmeet can be set up on multiple hosts to support a large distribution. The setup procedures were discussed in [this article](/docs/developer-guide/scalable-setup).
