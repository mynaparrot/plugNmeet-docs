---
title: API para Eliminar Grabación | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para eliminar una grabación de reunión específica del servidor.
keywords: [api, eliminar grabación, quitar grabación, api de grabación, punto final]
sidebar_position: 4
sidebar_label: Eliminar
---

# Eliminar grabación

Punto final: `/recording/delete`

| Campo     | Tipo   | Posición | Requerido | Descripción                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | raíz     | Sí      | ID de la grabación que desea eliminar |

**Ejemplo**:

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | raíz     | El estado de la solicitud |
| msg    | string  | raíz     | Mensaje de respuesta          |
