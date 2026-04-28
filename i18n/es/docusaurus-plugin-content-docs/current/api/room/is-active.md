---
title: API para Verificar si la Sala está Activa | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para verificar si una sala de videoconferencia está actualmente activa y tiene participantes.
keywords: [api, está activa, verificar sala, estado de la sala, api de sala, punto final]
sidebar_position: 3
sidebar_label: Estado de la Sala
---

# Estado de la Sala (Activa/Inactiva)

Punto final: `/room/isRoomActive`

| Campo   | Tipo   | Posición | Requerido | Descripción           |
| ------- | ------ | -------- | :------- | --------------------- |
| room_id | string | raíz     | Sí      | El ID único de la sala a verificar. |

**Ejemplo de Solicitud:**

```json
{
  "room_id": "room01"
}
```

## Respuesta

| Campo     | Tipo    | Posición | Descripción                          |
| :-------- | ------- | -------- | :----------------------------------- |
| status    | boolean | raíz     | Indica si la solicitud fue exitosa. |
| is_active | boolean | raíz     | Indica si la sala está actualmente activa. |
| msg       | string  | raíz     | Mensaje de respuesta.                    |
