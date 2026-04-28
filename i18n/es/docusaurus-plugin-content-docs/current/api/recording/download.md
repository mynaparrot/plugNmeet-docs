---
title: API para Descargar Grabación | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener una URL firmada y temporal para descargar un archivo de grabación de reunión específico.
keywords: [api, descargar grabación, obtener url de grabación, api de grabación, punto final]
sidebar_position: 3
sidebar_label: Descargar
---

# Descargar Grabación (Token)

Punto final: `/recording/getDownloadToken`

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
| token  | string  | raíz     | Token de descarga.                  |

Una vez que reciba el token, puede construir la URL de descarga utilizando el siguiente formato:
```
https://Su-Servidor-Plug-N-Meet.com/download/recording/<TOKEN AQUÍ>
```
