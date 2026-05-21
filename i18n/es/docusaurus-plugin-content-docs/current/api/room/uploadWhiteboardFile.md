---
title: API para Subir Archivo a la Pizarra | Referencia de la API de plugNmeet
description: Documentación del endpoint de la API para subir archivos a la pizarra en una sala de videoconferencia en vivo. Aprenda a añadir documentos o imágenes a la pizarra de forma programática.
keywords: [api, pizarra, subir, archivo, documento, imagen, api de video, endpoint, pizarra digital]
sidebar_position: 7
sidebar_label: Subir Archivo a la Pizarra
---

# Subir Archivo a la Pizarra

Endpoint: `/room/uploadWhiteboardFile`

Aunque los presentadores pueden subir archivos directamente a través de la interfaz del cliente de Plug-N-Meet, este endpoint de la API proporciona la flexibilidad de inyectar archivos en una sesión en vivo desde un sistema externo. Actúa como un puente entre el backend de su aplicación y la sala de Plug-N-Meet, permitiendo flujos de trabajo potentes y automatizados.

Por ejemplo, podría construir una integración que permita a los usuarios seleccionar un archivo de un servicio de almacenamiento en la nube como Google Drive o un bucket de S3. Su aplicación se encargaría de descargar el archivo del servicio y luego usaría esta API para enviarlo a la sesión activa de Plug-N-Meet.

Después de una subida exitosa a través de esta API:
1.  El presentador recibe una notificación dentro de la sala.
2.  El nuevo archivo aparece en la **lista de archivos de la pizarra**.
3.  El presentador puede entonces elegir cuándo mostrar el archivo en la pizarra para todos los participantes.

Esto permite precargar múltiples archivos en la lista de archivos de la sesión. Tenga en cuenta que cada solicitud de API solo puede contener un archivo a la vez.

## Prerrequisitos

Para que esta llamada a la API tenga éxito, se deben cumplir las siguientes condiciones:
1.  La sesión (`room_id`) debe estar activa.
2.  Al menos un usuario con el rol de `presenter` (presentador) debe estar presente en la sala.

Esta funcionalidad es diferente de la opción `preload_file` disponible en la [API de Creación de Sala](/docs/api/room/create). La opción `preload_file` acepta una URL directa y prepara el archivo cuando se crea la sala (antes de que esté activa). Este endpoint, en cambio, está diseñado para subir archivos a una sesión que ya está en curso.

## Solicitud

La solicitud debe enviarse como una petición `multipart/form-data` e incluir las cabeceras requeridas.

### Cabeceras

| Cabecera         | Tipo   | Requerido | Descripción                                                                 |
| ---------------- | ------ | --------- | --------------------------------------------------------------------------- |
| `API-KEY`        | string | Sí        | Su clave de API para la autenticación.                                      |
| `HASH-SIGNATURE` | string | Sí        | La firma HMAC-SHA256. Consulte [Autenticación](#autenticación-para-solicitudes-multipart) para más detalles. |
| `Room-Id`        | string | Sí        | El identificador único de la sala activa a la que desea subir el archivo. |

### Cuerpo

Debe proporcionar `document` (para la subida directa de archivos) o `document_link` (para la descarga desde el servidor), pero no ambos. Todas las subidas están sujetas a las [Restricciones de Archivo](#restricciones-de-archivo) detalladas a continuación.

| Campo           | Tipo   | Requerido | Descripción                                                                 |
| --------------- | ------ | --------- | --------------------------------------------------------------------------- |
| `document`      | file   | No        | El archivo a subir. Consulte [Restricciones de Archivo](#restricciones-de-archivo). |
| `document_link` | string | No        | Una URL desde la cual el servidor descargará el archivo. Consulte [Restricciones de Archivo](#restricciones-de-archivo). |

### Restricciones de Archivo

-   **Tipos de Archivo Admitidos**: Este punto final está diseñado para documentos de oficina y presentaciones. Los formatos admitidos incluyen **PDF, DOC, DOCX, PPT, PPTX, etc.** Los archivos de imagen (p. ej., JPG, PNG) no son compatibles y serán rechazados.
-   **Límite de Tamaño de Archivo**: El tamaño del archivo, ya sea subido directamente o descargado a través de `document_link`, no debe exceder el límite `max_size_whiteboard_file` definido en la configuración de su servidor.

## Autenticación para Solicitudes Multipart

A diferencia de las solicitudes JSON estándar, las solicitudes `multipart/form-data` requieren un método de autenticación especial. Para este punto final específico, la `HASH-SIGNATURE` **debe generarse a partir del valor de la cabecera `Room-Id`**.

-   **`Content-Type`**: Debe ser `multipart/form-data`. cURL y la mayoría de los clientes HTTP lo establecerán automáticamente cuando utilice campos de formulario.
-   **`HASH-SIGNATURE`**: Una firma HMAC-SHA256 generada usando su Secreto de API, con el `Room-Id` como cuerpo del mensaje.

## Ejemplos de Solicitudes cURL

Esta sección demuestra cómo generar correctamente la firma y enviar una solicitud de subida de archivo utilizando ambos métodos.

### Ejemplo 1: Subir un archivo directamente

```bash
# Sus credenciales de API
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"
ROOM_ID="sala01"

# 1. Genere la firma a partir del valor de Room-Id.
SIGNATURE=$(echo -n "$ROOM_ID" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 2. Realice la solicitud POST.
curl -X POST 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
--header "API-KEY: $API_KEY" \
--header "HASH-SIGNATURE: $SIGNATURE" \
--header "Room-Id: $ROOM_ID" \
--form 'document=@"/ruta/a/su/presentacion.pdf"'
```

### Ejemplo 2: Subir un archivo a través de un enlace

```bash
# Sus credenciales de API
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"
ROOM_ID="sala01"
DOCUMENT_LINK="https://example.com/mi_presentacion.pdf"

# 1. Genere la firma a partir del valor de Room-Id.
SIGNATURE=$(echo -n "$ROOM_ID" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 2. Realice la solicitud POST.
curl -X POST 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
--header "API-KEY: $API_KEY" \
--header "HASH-SIGNATURE: $SIGNATURE" \
--header "Room-Id: $ROOM_ID" \
--form "document_link=$DOCUMENT_LINK"
```

## Respuesta

**Notas Importantes sobre Subidas Concurrentes y Tiempos de Espera:**

El servidor aplica una estricta política de subida de un solo archivo a la vez por sala para garantizar la integridad de los datos. Esto se aplica tanto si está subiendo un archivo directamente (`document`) como si proporciona una URL (`document_link`).

-   **Subidas Concurrentes**: El servidor rechazará cualquier nueva solicitud de subida para una sala si ya hay otra subida en progreso. Si intenta una subida concurrente, la API responderá con un código de estado HTTP `409` (Conflicto).
-   **Tiempos de Espera y Procesamiento en Segundo Plano**: El proceso de conversión de archivos puede consumir muchos recursos. Si la solicitud inicial excede el tiempo de espera, el servidor continuará procesando el archivo en segundo plano. Una vez completado, notificará al cliente y se liberará el bloqueo de subida de la sala, permitiendo subir otro archivo.
-   **Duración del Bloqueo de Subida**: Por defecto, el bloqueo de subida para una sala está configurado en 5 minutos. Si el procesamiento del archivo no se completa en este intervalo, la operación excederá el tiempo de espera. Es crucial seleccionar archivos que puedan ser procesados razonablemente dentro de este marco de tiempo.

Si el archivo se sube y procesa con éxito, el servidor transmitirá la información necesaria a todos los participantes de la sala, haciendo que el nuevo archivo esté disponible en la pizarra.

| Campo       | Tipo    | Descripción                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indica si la solicitud fue exitosa.      |
| msg         | string  | Mensaje de respuesta.                    |
| status_code | string  | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
