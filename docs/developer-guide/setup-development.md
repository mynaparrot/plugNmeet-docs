---
description: A guide to setting up a complete local development environment for contributing to the plugNmeet open-source project.
title: Development Environment Setup | plugNmeet Developer Guide
keywords: [contribute, development setup, local environment, plugnmeet development, docker, nodejs, pnpm, developer guide]
sidebar_position: 2
sidebar_label: Development Setup
---

# Setting Up Your Development Environment

Welcome to the plugNmeet development guide! We're excited that you're interested in contributing. This guide will walk you through setting up a complete local development environment, allowing you to run the entire plugNmeet stack on your own machine.

Following these steps will enable you to test new features, fix bugs, and see your changes in real-time.

---

## Prerequisites

Before you begin, please ensure you have the following software installed on your computer:

1.  **Docker**: Used to run the backend services (like LiveKit and NATS) in isolated containers, which simplifies the setup process significantly.
2.  **Node.js**: Required for running and developing the `plugNmeet-client`. We recommend using the latest LTS version.
3.  **Git**: For cloning the project repositories. You can use a command-line client or a GUI like GitHub Desktop.
4.  **FFMPEG**: (Optional) Required only if you plan to work on or test the recording features.

---

## Step 1: Clone the Repositories

First, create a main project directory and clone the necessary plugNmeet repositories into it. Open your terminal and run the following commands:

```sh
# Create and enter a new directory for the project
mkdir plugnmeet-dev
cd plugnmeet-dev

# Clone the main server repository
git clone https://github.com/mynaparrot/plugNmeet-server server

# Clone the front-end client repository
git clone https://github.com/mynaparrot/plugNmeet-client client

# Clone the recorder service repository
git clone https://github.com/mynaparrot/plugNmeet-recorder recorder
```

---

## Step 2: Configure and Run the Backend Server

The `plugNmeet-server` repository contains a `docker-compose.yaml` file that orchestrates all the necessary backend services.

```sh
# Navigate to the server directory
cd server

# For the first time setup, copy the sample configuration files
cp config_sample.yaml config.yaml
cp livekit_sample.yaml livekit.yaml
cp ingress_sample.yaml ingress.yaml
cp nats_server_sample.conf nats_server.conf
cp docker-compose_sample.yaml docker-compose.yaml

# Build and start all backend services
docker-compose up --build
```

The first time you run this, it may take a few minutes to download and build the container images. On subsequent runs, you can simply use `docker-compose up` to start the services much faster.

Leave this terminal window running, as it will show the logs for all backend services.

---

## Step 3: Configure and Run the Front-End Client

Now, let's get the user interface running. Open a **new terminal window or tab** so you can run the client simultaneously with the server.

```sh
# Navigate to the client directory from your main project folder
cd client

# Copy the sample configuration file
cp src/assets/config_sample.js src/assets/config.js

# Install all project dependencies
# If you don't have pnpm, you can install it with `npm install -g pnpm`
pnpm install

# Start the client development server
pnpm start
```

Once the development server is running, you can access the plugNmeet client in your web browser at: **[http://localhost:3000/login.html](http://localhost:3000/login.html)**

---

## Step 4: (Optional) Run the Recorder Service

If you need to work on the recording features, you can start the recorder service. Open a **third terminal window or tab**.

```sh
# Navigate to the recorder directory from your main project folder
cd recorder

# Copy the sample configuration files
cp config_sample.yaml config.yaml
cp docker-compose_sample.yaml docker-compose.yaml

# Build and start the recorder service
docker-compose up --build
```

The recorder will now be running and will automatically listen for recording jobs from the `plugNmeet-server`.

---

## Troubleshooting

### "I can't connect to the meeting room."

This is a common issue on local development setups, often caused by Docker's networking. The LiveKit server inside the container needs to know your host machine's local IP address to establish a WebRTC connection.

1.  Find your computer's local IP address (e.g., `192.168.1.100`).
2.  Open the `docker-compose.yaml` file inside the `server` directory.
3.  Find the `livekit` service section.
4.  Modify the `command` line to add the `--node-ip` flag with your IP:

```yaml
  # Before
  command: --config "/app/livekit.yaml" --dev

  # After
  command: --config "/app/livekit.yaml" --dev --node-ip YOUR_LOCAL_IP_HERE
```

5.  Restart the server with `docker-compose down` and `docker-compose up`.

---

## What's Next?

You now have a fully functional plugNmeet development environment! You can start making changes to the client or server code, and your changes will be reflected in real-time.

We welcome all contributions. A great place to start is by looking at the open issues on our GitHub repositories. Happy coding!
