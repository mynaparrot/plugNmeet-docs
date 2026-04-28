---
title: API para Actualizar Metadatos de Grabación | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para actualizar los metadatos de una grabación específica.
keywords: [api, actualizar metadatos de grabación, api de grabación, punto final]
sidebar_position: 6
sidebar_label: Actualizar Metadatos
---

# Actualizar Metadatos de Grabación

Punto final: `/recording/updateMetadata`

Esta API le permite actualizar los metadatos de una grabación específica. Maneja de forma inteligente las actualizaciones parciales basadas en los campos proporcionados:
- Para actualizar un campo, proporcione un nuevo valor.
- Para borrar un campo de texto (como Título), proporcione una cadena vacía "".
- Para borrar una entrada de mapa específica (como un subtítulo), proporcione un objeto vacío para esa clave.
- Si se omite un campo (es decir, nulo), se mantiene su valor existente.

| Campo     | Tipo   | Posición | Requerido | Descripción                          |
| --------- | ------ | -------- | :------- | ------------------------------------ |
| record_id | string | raíz     | Sí      | El ID de la grabación a actualizar. |
| metadata  | [Metadatos de Grabación](/docs/api/recording/fetch#objeto-de-metadatos-de-grabación) | raíz     | No       | Los metadatos a actualizar.   |

**Ejemplo de Solicitud:**

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

| Campo  | Tipo    | Posición | Descripción               |
| :----- | ------- | -------- | :------------------------ |
| status | boolean | raíz     | El estado de la solicitud |
| msg    | string  | raíz     | Mensaje de respuesta          |
