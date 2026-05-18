---
title: API para Eliminar una Grabación | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para eliminar una grabación de una reunión específica del servidor.
keywords: [api, eliminar grabación, quitar grabación, api de grabación, punto final]
sidebar_position: 4
sidebar_label: Eliminar
---

# Eliminar una Grabación

Punto final: `/recording/delete`

Este punto final le permite eliminar permanentemente una grabación del servidor. Esta acción es irreversible y eliminará el archivo de grabación y todos los metadatos asociados.

Esta es una función administrativa crítica para administrar el almacenamiento y garantizar el cumplimiento de las políticas de retención de datos. Normalmente, integraría esto en la interfaz de su aplicación para permitir que los usuarios autorizados eliminen las grabaciones que ya no necesitan.

| Campo     | Tipo   | Posición | Requerido | Descripción                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | raíz     | Sí      | El ID de la grabación que desea eliminar. |

**Ejemplo**:

```json
{
  "record_id": "RM_RKD4jeiFMZDS-1645753430902"
}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | raíz     | El estado de la solicitud. |
| msg    | string  | raíz     | Mensaje de respuesta.          |
| status_code | number | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
