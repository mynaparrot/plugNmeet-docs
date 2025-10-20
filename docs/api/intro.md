---
title: API Reference Introduction | plugNmeet Developer Docs
description: An introduction to the plugNmeet API. Learn how to authenticate, make requests, and use our powerful endpoints to build custom video applications.
keywords: [api, rest api, developer, sdk, authentication, api key, endpoints, webhook]
sidebar_position: 1
sidebar_label: Intro
---

# Introduction

Plug-N-Meet provides a secure API for interacting with your server. All authenticated API requests share a common base path.

### Endpoint Structure

To use the API, you will send a `POST` request to an endpoint that starts with your server's URL followed by the `/auth` path. The specific API method path is then appended to it.

**Base authenticated API path:**
```
https://plugnmeet.example.com/auth
```

For example, if you are calling the `/room/getActiveRoomInfo` method, the full endpoint URL would be:
```
https://plugnmeet.example.com/auth/room/getActiveRoomInfo
```

All API calls must be `POST` requests with a JSON body.

### Authentication Headers

All requests to these endpoints must include the following headers for authentication:

- **`API-KEY`**: Your Plug-N-Meet Server API Key
- **`HASH-SIGNATURE`**: An HMAC SHA256 signature (in hex format) of the raw JSON request body, generated using your API Secret as the key.
- **`Content-Type`**: `application/json`

---

## Generating the HASH-SIGNATURE

The `HASH-SIGNATURE` is the core of the authentication process. It proves that the request is coming from a trusted source and that the message body has not been tampered with. It is a standard HMAC (Hash-based Message Authentication Code) signature.

Here is the language-agnostic process to generate it:

1.  **Get the Raw Request Body**: Start with the complete JSON request body as a single, raw string. It is crucial that this string is exactly what will be sent in the `POST` request.
2.  **Select the Algorithm**: Use the **HMAC-SHA256** algorithm. This is a standard function available in the cryptography or hashing library of almost any programming language.
3.  **Use Your Secret Key**: The "key" for the HMAC function is your **API Secret**.
4.  **Compute the Hash**: Pass the raw request body string and your API Secret to the HMAC-SHA256 function.
5.  **Encode the Result**: The output of the HMAC function is a binary hash. You must convert this binary value into its **lowercase hexadecimal representation**. This final hex string is the value for your `HASH-SIGNATURE` header.

By following these steps, you can generate a valid signature in any language, ensuring secure communication with the API.

## Implementation Examples

The following examples demonstrate how to implement the signature generation process in various popular languages.

### Shell with cURL

This example demonstrates the entire process using command-line tools. It shows how to construct the headers and body, generate the signature, and send the request.

```bash
# 1. The raw JSON body as a string
BODY='{"room_id":"room01"}'

# Your API credentials
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"

# 2. Generate the HMAC-SHA256 signature and encode it in hex
#    (This command performs steps 2-5 from the process above)
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 3. Make the POST request with the correct headers and body
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

For an even easier integration, you can use the following ready-to-use SDKs which handle the authentication process for you:

- [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php)
- [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))
