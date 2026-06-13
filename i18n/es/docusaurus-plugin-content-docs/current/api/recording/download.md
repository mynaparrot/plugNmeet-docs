---
title: API para Descargar una Grabación | Referencia de la API de plugNmeet
description: Documentación del endpoint de la API para obtener una URL temporal firmada que permite descargar un archivo específico de grabación de una reunión.
keywords: [api, descargar grabación, obtener url de grabación, api de grabación, endpoint]
sidebar_position: 3
sidebar_label: Descargar
---

# Descargar una Grabación (Token)

Endpoint: `/recording/getDownloadToken`

Este endpoint genera un token seguro y temporal que se puede utilizar para descargar un archivo de grabación. En lugar de proporcionar un enlace directo y permanente a la grabación, esta API crea un token de corta duración y de un solo uso.

Esta es una de las mejores prácticas de seguridad que evita el acceso no autorizado y el uso compartido de sus archivos de grabación. El flujo de trabajo típico es:
1. Un usuario de su aplicación hace clic en un botón "Descargar".
2. Su backend llama a esta API para obtener un token.
3. Su aplicación construye la URL de descarga con el token y redirige al usuario a ella.

El token caducará después de un corto período, lo que garantiza que el enlace de descarga no se pueda reutilizar ni compartir.

| Campo     | Tipo   | Posición | Requerido | Descripción                                 |
| --------- | ------ | -------- | :------- | ------------------------------------------- |
| record_id | string | raíz     | Sí      | El ID de la grabación que desea descargar. |

**Ejemplo de Solicitud:**

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción                       |
| :----- | ------- | -------- | :------------------------------- |
| status | boolean | raíz     | Indica si la solicitud fue exitosa. |
| msg    | string  | raíz     | Mensaje de respuesta.                |
| status_code | string | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
| token  | string  | raíz     | El token de descarga.                  |

Una vez que reciba el token, puede construir la URL de descarga utilizando el siguiente formato:
```
https://Su-Servidor-Plug-N-Meet.com/download/recording/<TOKEN_AQUÍ>
```
