---
title: Actualizar Metadatos de Grabación | Referencia de la API de plugNmeet
description: Documentación del endpoint de la API para actualizar los metadatos de una grabación específica.
keywords: [api, actualizar metadatos de grabación, api de grabación, endpoint]
sidebar_position: 6
sidebar_label: Actualizar Metadatos
---

# Actualizar Metadatos de Grabación

Endpoint: `/recording/updateMetadata`

Esta API le permite actualizar los metadatos de una grabación específica. Gestiona de manera inteligente las actualizaciones parciales basándose en los campos proporcionados:
- Para actualizar un campo, proporcione un nuevo valor.
- Para borrar un campo de texto (como el Título), proporcione una cadena vacía "".
- Para borrar una entrada de mapa específica (como un subtítulo), proporcione un objeto vacío para esa clave.
- Si se omite un campo (es decir, es nulo), se conservará su valor actual.

| Campo     | Tipo   | Ubicación | Requerido | Descripción                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | raíz     | Sí      | El ID de la grabación que desea actualizar. |
| metadata  | [Metadatos de Grabación](/docs/api/recording/fetch#objeto-de-metadatos-de-grabación) | raíz     | No       | Los metadatos que se actualizarán.   |

**Ejemplo de solicitud:**

```json
{
  "record_id": "7f867cd7-7956-4a17-af46-6ddd4015a497-1761814595173",
  "metadata": {
    "title": "Nuevo Título de Grabación",
    "description": "Sesión de introducción",
    "subtitles": {
      "en": {
        "label": "Inglés",
        "url": "https://example.com/subtitle.vtt"
      }
    },
    "extra_data": {
      "any_key": "any_value",
      "source": "cloud"
    }
  }
}
```

## Respuesta

| Campo  | Tipo    | Ubicación | Descripción               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | raíz     | El estado de la solicitud |
| msg    | string  | raíz     | Mensaje de la respuesta   |
| status_code | number | raíz     | Respuesta [código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
