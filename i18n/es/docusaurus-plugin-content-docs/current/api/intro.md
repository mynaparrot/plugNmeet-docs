---
title: Introducción a la referencia de la API | Documentación para desarrolladores de plugNmeet
description: Una introducción a la API de plugNmeet. Aprenda a autenticarse, realizar solicitudes y usar nuestros potentes endpoints para crear aplicaciones de video personalizadas.
keywords: [api, rest api, desarrollador, sdk, autenticación, clave api, endpoints, webhook]
sidebar_position: 1
sidebar_label: Introducción
---

# Introducción

Plug-N-Meet proporciona una API segura para interactuar con su servidor. Todas las solicitudes de API autenticadas comparten una ruta base común.

## Demostración en Vivo

Explore las características de Plug-N-Meet y pruebe su API con nuestra demostración en vivo.

**Explore las características:** [https://demo.plugnmeet.com/landing.html](https://demo.plugnmeet.com/landing.html)

**Credenciales de la API de Demostración para Desarrolladores:**
```
URL del servidor plugNmeet: https://demo.plugnmeet.com
Clave API de plugNmeet: plugnmeet
Secreto de API de plugNmeet: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

### Estructura de los puntos finales

Para usar la API, enviará una solicitud `POST` a un punto final que comienza con la URL de su servidor seguida de la ruta `/auth`. Luego se le añade la ruta del método API específico.

**Ruta base de la API autenticada:**
```
https://plugnmeet.example.com/auth
```

Por ejemplo, si está llamando al método `/room/getActiveRoomInfo`, la URL completa del punto final sería:
```
https://plugnmeet.example.com/auth/room/getActiveRoomInfo
```

Todas las llamadas a la API deben ser solicitudes `POST` con un cuerpo JSON.

### Encabezados de autenticación

Todas las solicitudes a estos puntos finales deben incluir los siguientes encabezados para la autenticación:

- **`API-KEY`**: Su clave de API del servidor Plug-N-Meet
- **`HASH-SIGNATURE`**: Una firma HMAC SHA256 (en formato hexadecimal) del cuerpo de la solicitud JSON sin procesar, generada utilizando su secreto de API como clave.
- **`Content-Type`**: `application/json`

---

## Generación de la HASH-SIGNATURE

La `HASH-SIGNATURE` es el núcleo del proceso de autenticación. Demuestra que la solicitud proviene de una fuente confiable y que el cuerpo del mensaje no ha sido manipulado. Es una firma HMAC (Código de autenticación de mensajes basado en hash) estándar.

Aquí está el proceso independiente del lenguaje para generarla:

1.  **Obtenga el cuerpo de la solicitud sin procesar**: Comience con el cuerpo de la solicitud JSON completo como una única cadena sin procesar. Es fundamental que esta cadena sea exactamente lo que se enviará en la solicitud `POST`.
2.  **Seleccione el algoritmo**: Utilice el algoritmo **HMAC-SHA256**. Esta es una función estándar disponible en la biblioteca de criptografía o hash de casi cualquier lenguaje de programación.
3.  **Use su clave secreta**: La "clave" para la función HMAC es su **secreto de API**.
4.  **Calcule el hash**: Pase la cadena del cuerpo de la solicitud sin procesar y su secreto de API a la función HMAC-SHA256.
5.  **Codifique el resultado**: La salida de la función HMAC es un hash binario. Debe convertir este valor binario en su **representación hexadecimal en minúsculas**. Esta cadena hexadecimal final es el valor para su encabezado `HASH-SIGNATURE`.

Siguiendo estos pasos, puede generar una firma válida en cualquier lenguaje, asegurando una comunicación segura con la API.

## Categorías de la API

La API de Plug-N-Meet se organiza en varias categorías según su funcionalidad.

*   **Gestión de salas:** Endpoints para crear, gestionar y consultar el estado de las salas de reuniones en vivo.
*   **Autenticación:** Endpoints para generar tokens de acceso para los participantes.
*   **Gestión de grabaciones:** Endpoints para obtener, descargar y eliminar grabaciones de reuniones.
*   **Gestión de artefactos:** Endpoints para obtener, descargar y eliminar artefactos de reuniones generados por IA, como resúmenes y transcripciones.

---

## Ejemplos de implementación

Los siguientes ejemplos demuestran cómo implementar el proceso de generación de firma en varios lenguajes populares.

### Shell con cURL

Este ejemplo demuestra todo el proceso utilizando herramientas de línea de comandos. Muestra cómo construir los encabezados y el cuerpo, generar la firma y enviar la solicitud.

```bash
# 1. El cuerpo JSON sin procesar como una cadena
BODY='{"room_id":"room01"}'

# Sus credenciales de API
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"

# 2. Generar la firma HMAC-SHA256 y codificarla en hexadecimal
#    (Este comando realiza los pasos 2-5 del proceso anterior)
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 3. Realizar la solicitud POST con los encabezados y el cuerpo correctos
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
// usando la biblioteca CryptoJS
const body = JSON.stringify({ room_id: "room01" });
const hash = CryptoJS.HmacSHA256(body, "SECRET");
const signature = CryptoJS.enc.Hex.stringify(hash);
```

### TypeScript (Node.js crypto integrado)

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

Para una integración aún más fácil, puede usar los siguientes SDKs listos para usar que manejan el proceso de autenticación por usted:

- [PHP](https://github.com/mynaparrot/plugNmeet-sdk-php)
- [JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js) ([NodeJS](https://www.npmjs.com/package/plugnmeet-sdk-js) & [Deno](https://deno.land/x/plugnmeet))
- [Python](https://github.com/vector-mj/plugnmeet-sdk) (Soportado por la comunidad)
