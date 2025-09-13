---
title: API Reference Introduction | plugNmeet Developer Docs
description: An introduction to the plugNmeet API. Learn how to authenticate, make requests, and use our powerful endpoints to build custom video applications.
keywords: [api, rest api, developer, sdk, authentication, api key, endpoints, webhook]
sidebar_position: 1
sidebar_label: Intro
---

# Introduction

Plug-N-Meet provides a secure API for interacting with your server.  
To use the API, send a `POST` request with a JSON body to your server endpoint:

```
https://plugnmeet.example.com/auth
```

**Required headers:**
- `API-KEY`: Your Plug-N-Meet Server API Key
- `HASH-SIGNATURE`: HMAC SHA256 signature (hex) of the request body, using your API Secret

**Content type:**
- `Content-Type: application/json`

All requests must be in JSON format and include the above

---

## Examples

### Shell with cURL

```bash
BODY='{"room_id":"room01"}'
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"

SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

curl -X POST https://demo.plugnmeet.com/auth/room/getActiveRoomInfo \
  -H "Content-Type: application/json" \
  -H "API-KEY: $API_KEY" \
  -H "HASH-SIGNATURE: $SIGNATURE" \
  -d "$BODY"
```

### PHP

```php
$body = json_encode([
    "room_id" => "room01",
]);
$signature = hash_hmac("sha256", $body, "SECRET");
```

### NodeJS

```js
// using CryptoJS library
const body = JSON.stringify({ room_id: "room01" });
const hash = CryptoJS.HmacSHA256(body, "SECRET");
const signature = CryptoJS.enc.Hex.stringify(hash);
```

### TypeScript (Node.js built-in crypto)

```ts
import { createHmac } from 'crypto';

const body = JSON.stringify({ room_id: "room01" });
const signature = createHmac("sha256", "SECRET")
    .update(body)
    .digest("hex");
```

### Go

```go
const body = `{"room_id":"room01"}`
mac := hmac.New(sha256.New, []byte("SECRET"))
mac.Write([]byte(body))
signature := hex.EncodeToString(mac.Sum(nil))
```

### Python

```python
import hmac
import hashlib

body = '{"room_id":"room01"}'
secret = b'SECRET'
signature = hmac.new(secret, body.encode(), hashlib.sha256).hexdigest()
```

### Java

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

String body = "{\"room_id\":\"room01\"}";
String secret = "SECRET";
Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
sha256_HMAC.init(secret_key);
String signature = javax.xml.bind.DatatypeConverter.printHexBinary(sha256_HMAC.doFinal(body.getBytes())).toLowerCase();
```

### Ruby

```ruby
require 'openssl'

body = '{"room_id":"room01"}'
secret = 'SECRET'

digest = OpenSSL::Digest.new('sha256')
signature = OpenSSL::HMAC.hexdigest(digest, secret, body)
```

---

## SDKs

You can use the following ready-to-use SDKs:

- [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php)
- [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))
