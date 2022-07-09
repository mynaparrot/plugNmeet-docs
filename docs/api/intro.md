---
sidebar_position: 1
---

# Introduction

Plug-N-Meet server accept `json` **POST request**. You'll require to send 2 information in header:

```
API-KEY: <Plug-N-Meet Server API Key>
API-SECRET: <Plug-N-Meet Server API Secret>
```

You also require to send content type json

```
Content-type: application/json
```

Default end point will be your Plug-N-Meet Server URL: `https://plugnmeet.example.com/auth`

## SDKs

You can use following ready to use SDKs:

- [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php)
- [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))
