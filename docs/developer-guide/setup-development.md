---
description: plugNmeet setup development environment
sidebar_position: 2
---

# Setting up for development

## Prerequisite

You'll require following software installed in your PC:

1. [Docker](https://www.docker.com/products/docker-desktop)
2. [NodeJS](https://nodejs.org/en/download/)
3. Git ([Desktop](https://desktop.github.com/) or [cli](https://git-scm.com/downloads))
4. [FFMPEG](https://www.ffmpeg.org/download.html) (Optional)

## Prepare

Open your terminal & run following commands:

```
mkdir plugNmeet
cd plugNmeet

# clone server
git clone https://github.com/mynaparrot/plugNmeet-server server

# clone client
git clone https://github.com/mynaparrot/plugNmeet-client client

# clone recorder
git clone https://github.com/mynaparrot/plugNmeet-recorder recorder

```

## Server

To start server run following command:

```
# for first time
cd server
cp config_sample.yaml config.yaml
cp livekit_sample.yaml livekit.yaml
cp ingress_sample.yaml ingress.yaml
cp nats_server_sample.conf nats_server.conf
cp docker-compose_sample.yaml docker-compose.yaml

# to start server
docker-compose up --build

# after every time
docker-compose up

```

## Client

Open another tab from your terminal & run:

```
# navigate to client directory that you created above
cd client
cp src/assets/config_sample.js src/assets/config.js
pnpm install

# start client
pnpm start
```

When the npm will complete to start up, you will be able to access client from: http://localhost:3000/login.html

## Recorder

Open another tab from your terminal & run:

```
# navigate to recorder directory that you created above
cd recorder
cp config_sample.yaml config.yaml
cp docker-compose_sample.yaml docker-compose.yaml

# start recorder
docker compose build
docker compose start
```

Now the recorder should be ready for getting signal from `plugNmeet-server`.

## Troubleshooting

1. I can't enter to the server showing response error
   > Open `docker-compose.yaml` file. Under `livekit` section:

```
--config "/app/livekit.yaml" --dev
```

add your device's IP address:

```
--config "/app/livekit.yaml" --dev --node-ip YOUR_IP_HERE
```

Now start the server again.
