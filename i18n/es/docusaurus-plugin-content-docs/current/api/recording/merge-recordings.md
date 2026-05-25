---
title: API para Unir Grabaciones | Referencia de la API de plugNmeet
description: Documentación del endpoint de la API para unir múltiples archivos de grabación de una sola sesión en una grabación continua. Aprenda a combinar segmentos de grabación separados.
keywords: [api, grabación, unir, combinar, api de video, endpoint]
sidebar_position: 7
sidebar_label: Unir Grabaciones
---

# Unir Grabaciones

Endpoint: `/recording/mergeRecordings`

En sesiones de larga duración, es común que los administradores o presentadores detengan y reinicien una grabación, lo que resulta en múltiples archivos de video separados. Esta API proporciona una solución poderosa para consolidar estos segmentos en una grabación continua, mejorando la experiencia de visualización.

Utilizando la función de anexado de FFmpeg, este endpoint une todos los archivos de grabación en una nueva grabación con un `record_id` único. Los archivos de grabación originales no se eliminan, lo que le brinda la flexibilidad de administrarlos o descartarlos según sea necesario. Esto es ideal para crear una versión final y pulida de una sesión que fue grabada en partes.

## Operación Asíncrona y Notificación por Webhook

Esta operación de la API es asíncrona. Cuando llama a este endpoint, la solicitud se asigna inmediatamente a una instancia de `plugnmeet-recorder` para ser procesada en segundo plano. Esto requiere que tenga al menos una instancia de grabador activa ejecutándose en modo `both` o `transcoderOnly`. La API devolverá instantáneamente una confirmación de que el trabajo ha sido programado.

Debido a que la unión ocurre en segundo plano, el resultado final se entrega a través de un webhook. Una vez que el nuevo archivo de grabación esté listo, su servidor recibirá un evento `recording_proceeded` que contendrá el `record_id` y otros metadatos del archivo recién unido, al igual que una grabación estándar.

## Casos de Uso
*   **Crear un único archivo para seminarios web largos:** Si pausa una grabación durante un descanso, puede unir las partes para una reproducción sin interrupciones.
*   **Combinar módulos de sesiones de capacitación:** Unir módulos grabados por separado en un video de capacitación completo.
*   **Simplificación de la postproducción:** Proporcionar un único archivo para facilitar la edición y distribución.

## Parámetros de la Solicitud

El cuerpo de la solicitud debe contener uno de los siguientes ámbitos: `by_session` o `by_ids`.

### `by_session`

Une todas las grabaciones de una única sesión de sala. Las grabaciones se anexan cronológicamente en orden ascendente (ASC) según fueron guardadas, asegurando una secuencia natural.

| Campo                 | Tipo           | Requerido | Descripción                                                                                                                                                             |
| --------------------- | -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| room_sid              | string         | Sí        | El identificador único de la sesión (`sid`) de la sala cuyas grabaciones desea unir. Todas las grabaciones bajo este `room_sid` serán consideradas para la unión.        |
| exclude_recording_ids | array (string) | No        | Un arreglo de `record_id`s para excluir de la unión. Esto es útil si necesita omitir segmentos específicos, como un inicio en falso o una parte no deseada de la sesión. |

### `by_ids`

Une una lista específica de grabaciones. El video final se generará anexando las grabaciones en el orden en que se proporcionan en el arreglo `recording_ids`.

| Campo         | Tipo           | Requerido | Descripción                                                                                                                                                           |
| ------------- | -------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| room_id       | string         | Sí        | El `room_id` al que pertenecen todos los `recording_ids`.                                                                                                             |
| recording_ids | array (string) | Sí        | Una lista de `record_id`s para unir. Todas las grabaciones deben pertenecer al `room_id` especificado, pero pueden ser de diferentes sesiones. La lista debe contener al menos dos `record_id`s. |

## Ejemplos de Solicitud

### Ejemplo 1: Unir por Sesión

Este ejemplo une todas las grabaciones de la sesión `c5b79ab5...` excepto una grabación excluida.

```json
{
  "by_session": {
    "room_sid": "c5b79ab5-b832-4972-9f9b-ba1f1e3369bd",
    "exclude_recording_ids": [
      "c5b79ab5-b832-4972-9f9b-ba1f1e3369bd-1779521611869"
    ]
  }
}
```

### Ejemplo 2: Unir por IDs

Este ejemplo une dos grabaciones específicas de la sala `sala01` en el orden especificado.

```json
{
  "by_ids": {
    "room_id": "sala01",
    "recording_ids": [
      "RM_abc-123",
      "RM_def-456"
    ]
  }
}
```

## Respuesta

La API proporciona una respuesta inmediata que indica que el trabajo de unión ha sido programado con éxito. El resultado final de la operación de unión se entregará a través de un evento de webhook `recording_proceeded` una vez que se complete el proceso.

| Campo       | Tipo    | Descripción                                                                                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| status      | boolean | Indica si la solicitud fue exitosa.                                                                                                      |
| msg         | string  | Un mensaje confirmando que el trabajo fue puesto en cola.                                                                                |
| status_code | number  | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
