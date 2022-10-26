---
sidebar_position: 1
---

# Introduction

Default end point will be your Plug-N-Meet Server URL: `https://plugnmeet.example.com/auth`

Plug-N-Meet server accept `json` **POST request**. You'll require to send 2 information in header:

```
API-KEY: <Plug-N-Meet Server API Key>
HASH-SIGNATURE: <hex value of hmac_sha256 using request body & Plug-N-Meet Server API Secret>
```

You also require to send content type json

```
Content-type: application/json
```

**Examples:**

`PHP`

```php
$body = json_encode(array(
            "room_id" => "room01",
        ));
$signature = hash_hmac("sha256", $body, "SECRET");
```

`NodeJS`
```js
// using CryptoJS library
const body = JSON.stringify({
    "room_id" => "room01",
});
const hash = CryptoJS.HmacSHA256(body, "SECRET");
const signature = CryptoJS.enc.Hex.stringify(hash);
```
OR
```ts
import { createHmac } from 'crypto';

const body = JSON.stringify({
    "room_id" => "room01",
});
const signature = createHmac("sha256", "SECRET")
    .update(body)
    .digest("hex");
```

`Go`
```go
const body = `{"room_id":"room01"}`
mac := hmac.New(sha256.New, []byte("SECRET"))
mac.Write([]byte(body))
signature := hex.EncodeToString(mac.Sum(nil))
```


## SDKs

You can use following ready to use SDKs:

- [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php)
- [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))
