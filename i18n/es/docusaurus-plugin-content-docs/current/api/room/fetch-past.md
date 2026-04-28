---
title: API para Obtener Salas Anteriores | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener una lista de salas de videoconferencia pasadas (inactivas) dentro de un rango de fechas especificado.
keywords: [api, obtener salas anteriores, historial de salas, historial de reuniones, api de sala, punto final]
sidebar_position: 6
sidebar_label: Obtener Salas Anteriores
---

# Obtener Información de Salas Anteriores

Punto final: `/room/fetchPastRooms`

## Parámetros de Solicitud

| Campo    | Tipo   | Requerido | Descripción                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| room_ids | array  | Sí      | Array de IDs de sala para consultar.                 |
| from     | number | No       | Índice de inicio para los registros. El valor predeterminado es 0.   |
| limit    | number | No       | Número máximo de registros a devolver. El valor predeterminado es 20. |
| order_by | string | No       | Orden de clasificación: `DESC` o `ASC`. El valor predeterminado es `DESC`. |

**Ejemplo de Solicitud:**

```json
{
  "room_ids": ["room01"],
  "from": 0,
  "limit": 20,
  "order_by": "DESC"
}
```

## Respuesta

| Campo             | Tipo                        | Posición | Descripción                       |
| ----------------- | -------------------------- | -------- | --------------------------------- |
| status            | boolean                     | raíz     | Indica si la solicitud fue exitosa. |
| msg               | string                      | raíz     | Mensaje de respuesta.                 |
| [result](#resultado) | object                      | raíz     | Contiene los datos de los resultados.        |

### Resultado

| Campo            | Tipo                                      | Descripción                                 |
| ---------------- | ----------------------------------------- | ------------------------------------------- |
| total_rooms      | number                                    | Número total de salas encontradas para la consulta.  |
| from             | number                                    | Índice de inicio para los registros devueltos.    |
| limit            | number                                    | Número de registros devueltos.                 |
| order_by         | string                                    | Orden de clasificación utilizado para los registros.            |
| rooms_list       | Array\<[Información de Sala Anterior](#información-de-sala-anterior)> | Lista de registros de salas anteriores.                  |

### Información de Sala Anterior

| Campo               | Tipo   | Descripción                                                                                   |
| ------------------- | ------ | --------------------------------------------------------------------------------------------- |
| room_title          | string | Título de la sala.                                                                            |
| room_id             | string | Identificador único para la sala.                                                               |
| room_sid            | string | SID de la sala.                                                                              |
| joined_participants | number | Número de participantes que se unieron (puede no ser exacto; use análisis para obtener información detallada). |
| webhook_url         | string | URL de webhook asociada con la sala.                                                         |
| created             | string | Hora de creación de la sala.                                                                           |
| ended               | string | Hora de finalización de la sala.                                                                                |
| analytics_file_id   | string | Identificador del archivo de análisis, si está disponible.                                                      |
