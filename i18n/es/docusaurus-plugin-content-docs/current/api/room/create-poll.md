---
title: API para Crear Encuestas | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para enviar una encuesta a una sala de videoconferencia en vivo desde una aplicación externa. Aprenda a crear encuestas, cuestionarios y votaciones anónimas en una sesión activa.
keywords: [api, crear encuesta, encuesta, cuestionario, votación, sondeo, api de sala, api de video, endpoint]
sidebar_position: 9
sidebar_label: Crear Encuesta
---

# Crear encuesta

Endpoint: `/room/createPoll`

Esta API permite que su servidor backend envíe una encuesta completa a una sesión activa de plugNmeet en tiempo real. Aunque los moderadores pueden crear encuestas desde el cliente, este punto final permite que una aplicación externa inyecte una encuesta directamente en una sesión en curso, lo que lo convierte en un componente fundamental para integraciones automatizadas.

Este punto final es ideal para crear integraciones como:
*   Lanzar un cuestionario en vivo en un aula desde una plataforma de aprendizaje externa.
*   Recopilar votos de la audiencia activados por eventos en su aplicación.
*   Programar encuestas o sondeos recurrentes desde una herramienta externa.

Una vez que se envía la encuesta, se crea en estado de ejecución de inmediato:
1.  Cada participante en la sala en vivo recibe la notificación de nueva encuesta y puede votar de inmediato.
2.  El moderador puede luego cerrarla, publicar los resultados o reabrirla, al igual que cualquier encuesta creada desde el cliente.
3.  Si se establece una `duration`, la encuesta se cierra automáticamente cuando se acaba el tiempo.

Para que esta llamada a la API tenga éxito, la sesión (`room_id`) debe ser una sala actualmente activa. La solicitud falla si la sala no ha sido creada o ya ha finalizado.

## Parámetros de la solicitud

| Campo        | Tipo    | Requerido | Descripción                                                                                                                              |
| ------------ | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| room_id      | string  | Sí      | El identificador único de la sala activa en la que desea enviar la encuesta.                                                            |
| user_id      | string  | No       | El ID de usuario al que se atribuirá la encuesta. Si se omite, el valor predeterminado es `external-api`.                                                          |
| question     | string  | Sí      | La pregunta de la encuesta. No debe estar vacía.                                                                                                     |
| [options](#opción-de-encuesta) | array | Sí | Las opciones de la encuesta. Se requieren al menos dos y cada una debe tener un texto no vacío. Consulte [Opción de Encuesta](#opción-de-encuesta).                           |
| is_anonymous | boolean | No       | Si es `true`, la votación es anónima: las opciones de los votantes individuales nunca se almacenan por usuario. Predeterminado: `false`.                                     |
| is_multiple  | boolean | No       | Si es `true`, los participantes pueden seleccionar múltiples opciones al votar. Predeterminado: `false`.                                                        |
| is_quiz      | boolean | No       | Si es `true`, la encuesta se ejecuta como un cuestionario. Las respuestas correctas se ocultan mientras el cuestionario está en curso y se revelan en los resultados después de cerrarlo. Un cuestionario requiere al menos una opción marcada como correcta. Predeterminado: `false`. |
| duration     | number  | No       | Duración de cierre automático en segundos. Si es mayor que `0`, la encuesta se cierra automáticamente cuando se acaba el tiempo. Máximo: `3600` (60 minutos). Predeterminado: `0` (sin límite de tiempo). |

### Opción de encuesta

Cada entrada en el array `options` representa una opción seleccionable.

| Campo      | Tipo    | Requerido | Descripción                                                                    |
| ---------- | ------- | -------- | ------------------------------------------------------------------------------ |
| id         | number  | Sí      | Un número secuencial simple que identifica la opción (1, 2, 3, ...).              |
| text       | string  | Sí      | El texto de la opción. No debe estar vacío.                                            |
| is_correct | boolean | No       | Si es `true`, esta opción es una respuesta correcta. Solo tiene sentido cuando `is_quiz` es `true`. |

## Ejemplo

### Ejemplo 1: Una encuesta simple

```json
{
  "room_id": "sala01",
  "question": "¿Qué tema deberíamos cubrir a continuación?",
  "options": [
    {
      "id": 1,
      "text": "Funciones avanzadas de la pizarra"
    },
    {
      "id": 2,
      "text": "Grabación y reproducción"
    }
  ]
}
```

### Ejemplo 2: Una encuesta anónima de selección múltiple

```json
{
  "room_id": "sala01",
  "user_id": "usuario-42",
  "question": "¿A qué sesiones asistió hoy?",
  "options": [
    {
      "id": 1,
      "text": "Discurso de apertura de la mañana"
    },
    {
      "id": 2,
      "text": "Taller de producto"
    },
    {
      "id": 3,
      "text": "Sesión de networking"
    }
  ],
  "is_anonymous": true,
  "is_multiple": true
}
```

### Ejemplo 3: Un cuestionario cronometrado

```json
{
  "room_id": "sala01",
  "question": "¿Qué contiene la cabecera HASH-SIGNATURE?",
  "options": [
    {
      "id": 1,
      "text": "Una firma HMAC-SHA256 del cuerpo de la solicitud",
      "is_correct": true
    },
    {
      "id": 2,
      "text": "La clave de la API"
    }
  ],
  "is_quiz": true,
  "duration": 120
}
```

## Respuesta

| Campo       | Tipo    | Descripción                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indica si la solicitud fue exitosa. |
| msg         | string  | Mensaje de respuesta.                        |
| poll_id     | string  | El ID único de la encuesta recién creada. |
| status_code | string  | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |

## Respuestas de error

En caso de fallo, `status` es `false` y `msg` describe el problema. Los fallos de validación devuelven claves estables y legibles por máquina que la interfaz de usuario del cliente puede traducir directamente:

| Clave de msg                      | Descripción                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| `polls.errors.question-required`  | El campo `question` falta o está vacío.                                |
| `polls.errors.min-options`        | Se proporcionaron menos de dos opciones.                                    |
| `polls.errors.option-required`    | A una opción le falta su texto.                                           |
| `polls.errors.quiz-needs-correct` | La encuesta está marcada como un cuestionario, pero ninguna opción está marcada como correcta.        |
| `polls.errors.duration-cap`       | La `duration` excede el máximo de 3600 segundos (60 minutos).         |

Otras fallas comunes se devuelven como mensajes de texto sin formato: un `room_id` faltante o una sala que no está actualmente activa (este punto final requiere que la sesión esté en ejecución en el momento en que se envía la encuesta).
