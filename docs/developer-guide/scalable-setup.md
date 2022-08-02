---
description: plugNmeet Scalable/Distributed setup
sidebar_position: 4
---

# Scalable/Distributed setup

plugNmeet allows you to install its components on multiple servers. We'll go over it in this article.

## Servers

I'm assuming we've following servers. You can have any number based on your requirements. For the services of Redis, MariaDB, and NFS, we will use a third-party provider. If you'd like, you can set up your own, but we won't go into that setup in this article.

| Component                                                              | IPs                                                      | Ports                                       | Domain                                   | Description                                                                                                             |
| :--------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------- | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| [plugNmeet-server](https://github.com/mynaparrot/plugNmeet-server)     | 100.100.100.1<br />100.100.100.1                         | 8080/tcp                                    | plugnmeet.example.com                    | We'll use 2 servers for plugNmeet. Ports open only for Haproxy,**not public**                                           |
| [livekit](https://github.com/livekit/livekit)                          | 100.100.100.10<br /> 100.100.100.11<br /> 100.100.100.12 | 7881/tcp<br />5349/tcp<br />50000-60000/UDP | livekit.example.com<br/>turn.example.com | We'll use 3 servers for livekit. 7881/tcp & 5349/tcp open only for Haproxy, not public. 50000-60000/UDP open for public |
| [plugNmeet-recorder](https://github.com/mynaparrot/plugNmeet-recorder) | 100.100.100.20<br /> 100.100.100.21 <br />100.100.100.22 |                                             | n/a                                      | We'll use 3 servers for recorder                                                                                        |
| [plugNmeet-etherpad](https://github.com/mynaparrot/plugNmeet-etherpad) | 100.100.100.30                                           | <br />9001/tcp                              | ether.example.com                        | We'll use 1 servers for etherpad. 9001/tcp open only for Haproxy, not public.                                           |
| Haproxy                                                                | 100.100.100.35                                           | 80/tcp<br />443/tcp                         | n/a                                      | We'll install haproxy in one server. Both ports are open for public                                                     |
| Mariadb                                                                | 100.100.100.40                                           |                                             | n/a                                      | We've a Mariadb cluster from provider                                                                                   |
| Redis                                                                  | 100.100.100.50                                           |                                             | n/a                                      | We've a Redis cluster from provider                                                                                     |
| NFS                                                                    | 100.100.100.60                                           |                                             | n/a                                      | We've a NFS storage from provider                                                                                       |

## OS

We'll use Ubuntu for all of above servers.

## Setup docker

We'll use docker for `plugNmeet-server`, `livekit` and `plugNmeet-etherpad`. So, we can install docker for all of those servers

```bash
sudo apt update && sudo apt -y install ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt update && sudo apt -y install docker-ce docker-ce-cli containerd.io docker-compose
```

## Font installation

For `plugNmeet-server` and `plugNmeet-etherpad` servers

```bash
sudo apt update && apt -y install --no-install-recommends \
    fonts-arkpandora \
    fonts-crosextra-carlito \
    fonts-crosextra-caladea \
    fonts-noto \
    fonts-noto-cjk \
    fonts-noto-core \
    fonts-noto-mono \
    fonts-noto-ui-core \
    fonts-liberation \
    fonts-dejavu \
    fonts-dejavu-extra \
    fonts-liberation \
    fonts-liberation2 \
    fonts-linuxlibertine \
    fonts-sil-gentium \
    fonts-sil-gentium-basic \
    fontconfig
```

## Setup livekit

Login to `livekit` server & follow:

```bash
sudo mkdir -p /opt/plugNmeet
cd /opt/plugNmeet
touch docker-compose.yaml
touch livekit.yaml
```

Open `docker-compose.yaml` & add:

```bash
version: "3"
services:
  livekit:
    image: livekit/livekit-server
    restart: always
    network_mode: "host"
    volumes:
      - .:/app
      - /etc/ssl/certs/:/etc/ssl/certs/:ro
    command: --config "/app/livekit.yaml" --node-ip PUBLIC_IP
    healthcheck:
      test: wget --no-verbose --tries=5 --spider http://localhost:7880 || kill 1
      interval: 20s
      timeout: 1s
      retries: 5
```

Change `PUBLIC_IP` with the public IP of this server.

Open `livekit.yaml` & add:

```bash
port: 7880
rtc:
  port_range_start: 50000
  port_range_end: 60000
  tcp_port: 7881
  use_external_ip: true
redis:
  address: 100.100.100.50:6379
  password: "my-pass"
  db: 0
room:
  auto_create: false
keys:
  LIVEKIT_API_KEY: LIVEKIT_SECRET
webhook:
  api_key: LIVEKIT_API_KEY
  urls:
    - "https://plugnmeet.example.com/webhook"
turn:
  enabled: true
  udp_port: 443
  tls_port: 5349
  external_tls: true
  domain: turn.example.com

```

Replace `LIVEKIT_API_KEY`, `LIVEKIT_SECRET`, `turn.example.com`, `plugnmeet.example.com`, `redis` with correct info. You can generate `LIVEKIT_SECRET` by:

```bash
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 36 | head -n 1
```

Make sure you're using same information to **all of your livekit server**.
Start docker:

```bash
docker-compose up -d
```

## Setup plugNmeet-etherpad

Login to `etherpad` server & follow:

```bash
sudo mkdir -p /opt/plugNmeet/etherpad
cd /opt/plugNmeet
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install-files/settings.json -O etherpad/settings.json
touch etherpad/APIKEY.txt
```

Open `docker-compose.yaml` & add:

```bash
version: "3"
services:
  redis:
    image: redis:6
    restart: always
    network_mode: "host"
    volumes:
      - ./redis-data:/data
    healthcheck:
      test: "redis-cli ping || kill 1"
      interval: 10s
      timeout: 1s
      retries: 5
  etherpad:
    image: mynaparrot/plugnmeet-etherpad
    restart: always
    network_mode: "host"
    volumes:
      - ./etherpad/APIKEY.txt:/opt/etherpad-lite/APIKEY.txt
      - ./etherpad/settings.json:/opt/etherpad-lite/settings.json
      - /usr/share/fonts/:/usr/share/fonts/:ro
      - /etc/fonts/:/etc/fonts/:ro
      - /usr/share/fontconfig/:/usr/share/fontconfig/:ro
      - /var/cache/fontconfig/:/var/cache/fontconfig/:ro
    depends_on:
      - redis
    healthcheck:
      test: curl -f --retry 5 --retry-delay 3 "http://localhost:9001/api" || kill 1
      interval: 20s
      timeout: 1s
      retries: 5
```

Open `etherpad/APIKEY.txt` & replace `ETHERPAD_API` with correct key. You can generate key by:

```bash
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 80 | head -n 1
```

Start docker:

```bash
docker-compose up -d
```

## Setup plugNmeet-server

Login to `plugNmeet-server` server & follow:

```bash
sudo update && sudo apt install --no-install-recommends -y wget libreoffice mupdf-tools
sudo mkdir -p /opt/plugNmeet/recording_files
cd /opt/plugNmeet
touch docker-compose.yaml
touch config.yaml
```

Open `docker-compose.yaml` & write:

```bash
version: "3"
services:
  plugnmeet:
    image: mynaparrot/plugnmeet-server
    restart: always
    network_mode: "host"
    volumes:
      - .:/app
      - /etc/ssl/certs/:/etc/ssl/certs/:ro
      - /usr/share/fonts/:/usr/share/fonts/:ro
      - /etc/fonts/:/etc/fonts/:ro
      - /usr/share/fontconfig/:/usr/share/fontconfig/:ro
      - /var/cache/fontconfig/:/var/cache/fontconfig/:ro
    command: --config "/app/config.yaml"
    healthcheck:
      test: wget --no-verbose --tries=5 --spider http://localhost:8080 || kill 1
      interval: 20s
      timeout: 1s
      retries: 5
```

Open `config.yaml`. Latest contents can be found from either [here](https://raw.githubusercontent.com/mynaparrot/plugNmeet-server/main/config_sample.yaml) or [here](https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install-files/config.yaml)

```bash
client:
  port: 8080
  debug: false
  path: "/app/client/dist"
  ## this will require during authentication. Use random secret.
  # openssl rand -hex 32
  # OR
  # cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 36 | head -n 1
  api_key: PLUG_N_MEET_API_KEY
  secret: PLUG_N_MEET_SECRET
  webhook_conf:
    # enable webhook. This will post response for different events
    enable: false
    # set url bellow. This will be use as global.
    # this is optional
    url: ""
    # During create room you can set custom hook URL too.
    # if you set enable_for_per_meeting: true
    # then extra post response will send in that address too
    enable_for_per_meeting: false
  prometheus:
    enable: false
    metrics_path: "/metrics"
  proxy_header: "X-Forwarded-For"
log_settings:
  log_file: "/app/log/plugNmeet.log"
  # maxsize of log file in MB
  maxsize: 20
  maxbackups: 4
  # max age of log before rotate in days
  maxage: 2
livekit_info:
  host: "https://livekit.example.com"
  api_key: LIVEKIT_API_KEY
  secret: LIVEKIT_SECRET
  # value in minutes. Default 10 minutes. Client will renew token automatically
  token_validity: 10m
redis_info:
  address: 100.100.100.50:6379
  password: "my-pass"
  db: 0
mysql_info:
  host: 100.100.100.40
  port: 3306
  username: "root"
  password: "DB_ROOT_PASSWORD"
  db: "plugnmeet"
  prefix: "pnm_"
upload_file_settings:
  path: "/app/upload"
  # file size in MB. Default 50MB
  max_size: 50
  # By default, files will be deleted as soon as the session will be finish.
  # You can set it true to disable deleting files.
  keep_forever: false
  allowed_types:
    - "jpg"
    - "png"
    - "jpeg"
    - "svg"
    - "pdf"
    - "docx"
    - "txt"
    - "xlsx"
    - "pptx"
    - "zip"
    - "mp4"
    - "webm"
    - "mp3"
recorder_info:
  # this value should be same as recorder's copy_to_dir path
  recording_files_path: "/app/recording_files"
  token_validity: 30m
shared_notepad:
  enabled: true
  # multiple hosts can be added here
  # server will be selected based on load
  # the value of id should be unique
  etherpad_hosts:
    -
      id: "node_01"
      host: "https://ether.example.com"
      api_key: "ETHERPAD_API"
lti_info:
  v1_tool_url: https://plugnmeet.example.com/lti/v1
```

Replace `PLUG_N_MEET_API_KEY`, `PLUG_N_MEET_SECRET`,`LIVEKIT_API_KEY`, `LIVEKIT_SECRET`, `turn.example.com`, `plugnmeet.example.com`, `redis`, `ether.example.com`, `ETHERPAD_API`, `mysql_info` with correct info. You can generate `PLUG_N_MEET_SECRET` by:

```bash
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 36 | head -n 1
```

Make sure you're using same information to **all of your plugNmeet server**.
Start docker:

```bash
docker-compose up -d
```

We'll mount `NFS` server into `/opt/plugNmeet/recording_files`

```bash
sudo apt install nfs-common
sudo mount 100.100.100.60:/recording_files /opt/plugNmeet/recording_files
```

To make it permanent by adding in `/etc/fstab`

```bash
100.100.100.60:/recording_files    /opt/plugNmeet/recording_files   nfs4    noauto  0  0
```

## Setup plugNmeet-recorder

Login to `plugNmeet-recorder` server & follow:

```bash
mkdir -p /opt/plugNmeet/
cd /opt/plugNmeet

curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >/etc/apt/sources.list.d/google-chrome.list

## prepare nodejs
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

## install require software
sudo apt update && sudo apt -y install nodejs xvfb google-chrome-stable ffmpeg unzip
```

```bash
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install-files/plugnmeet-recorder.service -O /etc/systemd/system/plugnmeet-recorder.service
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install-files/plugnmeet-recorder@main.service -O /etc/systemd/system/plugnmeet-recorder@main.service
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install-files/plugnmeet-recorder@websocket.service -O /etc/systemd/system/plugnmeet-recorder@websocket.service

systemctl daemon-reload
systemctl enable plugnmeet-recorder
systemctl enable plugnmeet-recorder@main
systemctl enable plugnmeet-recorder@websocket

wget https://github.com/mynaparrot/plugNmeet-recorder/releases/latest/download/recorder.zip -O recorder.zip
unzip recorder.zip
cp recorder/config_sample.yaml recorder/config.yaml
```

Now open `recorder/config.yaml` & replace `PLUG_N_MEET_SERVER_DOMAIN`, `PLUG_N_MEET_API_KEY`, `PLUG_N_MEET_SECRET` & `redis` info. Make sure you're using same info as above setups into all recording servers.

**Note: Make sure `id` and `sub_path` info is unique for each server.** For example: server 1 `node_01`; server 2 `node_02`; server 3 `node_03` .....

`WEBSOCKET_AUTH_TOKEN` can be generate by:

```bash
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1
```

We'll mount `NFS` server into `/opt/plugNmeet/recording_files`

```bash
sudo apt install nfs-common
sudo mount 100.100.100.60:/recording_files /opt/plugNmeet/recording_files
```

To make it permanent by adding in `/etc/fstab`

```bash
100.100.100.60:/recording_files    /opt/plugNmeet/recording_files   nfs4    noauto  0  0
```

Now start server:

```bash
systemctl start plugnmeet-recorder
```

## Setup Haproxy

Login to your haproxy server & follow:

```bash
apt update && apt install -y --no-install-recommends software-properties-common
add-apt-repository ppa:vbernat/haproxy-2.6 -y
apt -y update && apt install -y haproxy
service haproxy stop
```

```bash
cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg_bk
mkdir -p /etc/haproxy/ssl
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install-files//haproxy_lets_encrypt.cfg -O /etc/haproxy/haproxy.cfg
service haproxy start
```

Configure lets encrypt. Make sure replace with correct info:

```bash
apt install -y snapd

snap install core
snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

certbot certonly --standalone -d PLUG_N_MEET_SERVER_DOMAIN -d TURN_SERVER_DOMAIN \
-d ETHERPAD_SERVER_DOMAIN -d LIVEKIT_SERVER_DOMAIN \
--non-interactive --agree-tos --email YOUR_EMAIL \
--http-01-port=9080

ln -s /etc/letsencrypt/live/PLUG_N_MEET_SERVER_DOMAIN/fullchain.pem /etc/haproxy/ssl/PLUG_N_MEET_SERVER_DOMAIN.pem
ln -s /etc/letsencrypt/live/PLUG_N_MEET_SERVER_DOMAIN/privkey.pem /etc/haproxy/ssl/PLUG_N_MEET_SERVER_DOMAIN.pem.key

openssl dhparam -out /etc/haproxy/dhparams-2048.pem 2048

service haproxy stop
```

Now edit `/etc/haproxy/haproxy.cfg` as bellow:

```bash
global
	log /dev/log	local0
	log /dev/log	local1 notice
	chroot /var/lib/haproxy
	stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
	stats timeout 30s
	user haproxy
	group haproxy
	daemon

	# Default SSL material locations
	ca-base /etc/ssl/certs
	crt-base /etc/ssl/private
	ssl-dh-param-file /etc/haproxy/dhparams-2048.pem

	# See: https://ssl-config.mozilla.org/#server=haproxy&server-version=2.0.3&config=intermediate
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
	log	global
	mode	http
	#option	httplog
	option	dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000
    default-server init-addr last,libc,none
	errorfile 400 /etc/haproxy/errors/400.http
	errorfile 403 /etc/haproxy/errors/403.http
	errorfile 408 /etc/haproxy/errors/408.http
	errorfile 500 /etc/haproxy/errors/500.http
	errorfile 502 /etc/haproxy/errors/502.http
	errorfile 503 /etc/haproxy/errors/503.http
	errorfile 504 /etc/haproxy/errors/504.http

frontend frontend-http
    bind :80
    mode http

    # ACL for detecting Let's Encrypt validation requests
    acl is_certbot path_beg /.well-known/acme-challenge/
    use_backend backend-certbot if is_certbot

    ## without acme-challenge we'll redirect to https
    ## because our service won't work on non-ssl
    http-request redirect scheme https if ! is_certbot

    ## by default it will be certbot server
    default_backend backend-certbot

backend backend-certbot
    mode http
    server certbot 127.0.0.1:9080

frontend ft_ssl
    mode tcp

    # HAProxy will take the fitting certificate from the available ones
    bind *:443 ssl crt /etc/haproxy/ssl/

    tcp-request inspect-delay 5s
    tcp-request content accept if { req_ssl_hello_type 1 }

    # Pass TURN requests to LiveKit Turn server
    # LiveKit expects unencrypted traffic on tls_port,
    # and still advertise tls_port as a TURN/TLS candidate.
    use_backend bk_livekit_turn  if { ssl_fc_sni -i TURN_SERVER_DOMAIN }
    use_backend bk_livekit  if { ssl_fc_sni -i LIVEKIT_SERVER_DOMAIN }
    use_backend bk_etherpad  if { ssl_fc_sni -i ETHERPAD_SERVER_DOMAIN }

    ## default will be bk_plugnmeet_server
    default_backend bk_plugnmeet_server

backend bk_livekit_turn
    mode tcp

    server s1 100.100.100.10:5349 check
    server s2 100.100.100.11:5349 check
    server s3 100.100.100.12:5349 check

backend bk_plugnmeet_server
    mode http
    option forwardfor

    # Pass the requests to plugnmeet-server
    server s1 100.100.100.1:8080 check
    server s2 100.100.100.2:8080 check

backend bk_livekit_api
    mode http
    option forwardfor

    # Pass the requests to the LiveKit HTTP API
    server s1 100.100.100.10:7880 check
    server s2 100.100.100.11:7880 check
    server s3 100.100.100.12:7880 check

backend bk_etherpad
    mode http
    option forwardfor

    # Pass the requests to etherpad
    server s1 100.100.100.30:9001 check
```

Replace `TURN_SERVER_DOMAIN`, `LIVEKIT_SERVER_DOMAIN`, `ETHERPAD_SERVER_DOMAIN` with correct information

Now start haproxy

```bash
service start haproxy
```

Now using [client](https://github.com/mynaparrot/plugNmeet-client) you should be able to connect with `plugNmeet`
