---
title: API para Obtener Grabaciones | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para obtener una lista de todas las grabaciones disponibles en el servidor.
keywords: [api, obtener grabaciones, listar grabaciones, api de grabación, punto final]
sidebar_position: 1
sidebar_label: Obtener Grabaciones
---

# Obtener Grabaciones

Punto final: `/recording/fetch`

## Parámetros de la Solicitud

| Campo    | Tipo   | Requerido | Descripción                                                                    |
| -------- | ------ | -------- |--------------------------------------------------------------------------------|
| room_ids | array  | Sí      | Un array de IDs de sala para obtener sus grabaciones.                          |
| room_sid   | string           | No       | Filtrar grabaciones de una sesión de sala específica proporcionando su `sid`.  |
| from     | number | No       | Índice inicial para los registros. El valor predeterminado es 0.               |
| limit    | number | No       | Número máximo de registros a devolver. El valor predeterminado es 20.          |
| order_by | string | No       | Orden de clasificación: `DESC` o `ASC`. El valor predeterminado es `DESC`.     |

**Ejemplo de Solicitud:**

```json
{
  "room_ids": ["sala01"],
  "from": 0,
  "limit": 20,
  "order_by": "DESC"
}
```

## Respuesta

| Campo             | Tipo                        | Posición | Descripción                                 |
| ----------------- | -------------------------- | -------- | ------------------------------------------- |
| status            | boolean                     | raíz     | Indica si la solicitud fue exitosa.    |
| msg               | string                      | raíz     | Mensaje de respuesta.                           |
| status_code | number | raíz     | Respuesta [código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10). |
| [result](#resultado) | object                      | raíz     | Contiene los datos de las grabaciones.               |

### Resultado

| Campo              | Tipo                                      | Descripción                                 |
| ------------------ | ----------------------------------------- | ------------------------------------------- |
| total_recordings   | number                                    | Número total de grabaciones encontradas.           |
| from               | number                                    | Índice inicial de los registros devueltos.    |
| limit              | number                                    | Número de registros devueltos.                 |
| order_by           | string                                    | Orden de clasificación utilizado para los registros.            |
| recordings_list    | Array\<[Información de la Grabación](#información-de-la-grabación)> | Lista de los registros de grabaciones.                  |

### Información de la Grabación

| Campo              | Tipo   | Descripción                                 |
| ------------------ | ------ | ------------------------------------------- |
| record_id          | string | Identificador único de la grabación.        |
| room_id            | string | ID de la sala asociada a la grabación.|
| room_sid           | string | SID (Identificador de Sesión) de la sala.                            |
| file_path          | string | Ruta al archivo de la grabación.                 |
| file_size          | number | Tamaño del archivo de la grabación en bytes.        |
| creation_time      | number | Fecha y hora de creación de la grabación (marca de tiempo Unix).   |
| room_creation_time | number | Fecha y hora de creación de la sala (marca de tiempo Unix).        |
| metadata           | [Objeto de Metadatos de Grabación](#objeto-de-metadatos-de-grabación) | Metadatos asociados a la grabación.     |

### Objeto de Metadatos de Grabación

| Campo       | Tipo                                               | Descripción                                                                |
| ----------- |----------------------------------------------------|----------------------------------------------------------------------------|
| title       | string                                             | El título de la grabación.                                                |
| description | string                                             | La descripción de la grabación.                                          |
| subtitles   | map [Objeto de Subtítulo de Grabación](#objeto-de-subtítulo-de-grabación) | Un mapa de códigos de idioma a objetos de subtítulos. Por ejemplo: `{"en": {"url": "..."}}` |
| extra_data  | map                               | Un mapa de datos adicionales almacenados con la grabación. Por ejemplo: `{"key": "value"}`     |

#### Objeto de Subtítulo de Grabación

| Campo | Tipo   | Descripción                  |
| ----- | ------ | ---------------------------- |
| label | string | La etiqueta para el subtítulo.  |
| url   | string | La URL del archivo de subtítulos.|
