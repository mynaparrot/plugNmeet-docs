---
title: API para Finalizar Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para finalizar forzosamente una sala de videoconferencia activa y desconectar a todos los participantes.
keywords: [api, finalizar sala, cerrar sala, terminar reunión, api de sala, punto final]
sidebar_position: 7
sidebar_label: Finalizar
---

# Finalizar sala

Punto final: `/room/endRoom`

| Campo   | Tipo   | Posición | Requerido | Descripción |
| ------- | ------ | -------- | :------- | ----------- |
| room_id | string | raíz     | Sí      | ID de la sala     |

**Ejemplo**:

```json
{
  "room_id": "room01"
}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | raíz     | El estado de la solicitud |
| msg    | string  | raíz     | Mensaje de respuesta          |
