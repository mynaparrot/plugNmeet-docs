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

## Parámetros de la Solicitud

La solicitud debe enviarse como una petición `multipart/form-data`.

| Campo      | Tipo   | Requerido | Descripción                                                                                                                                                                                            |
| ---------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `room_id`  | string | Sí        | El identificador único de la sala activa a la que desea subir el archivo.                                                                                                                            |
| `document` | file   | Sí        | El archivo a subir. El tamaño del archivo no debe exceder el límite `max_size_whiteboard_file` definido en la configuración del servidor. Los tipos de archivo admitidos también se configuran en el servidor (p. ej., PDF, Doc, etc.). |

## Autenticación para Solicitudes Multipart

A diferencia de las solicitudes JSON estándar, las solicitudes `multipart/form-data` requieren un método de autenticación especial. Dado que el contenido exacto del cuerpo puede variar entre solicitudes debido a los límites de las partes múltiples, la `HASH-SIGNATURE` **debe generarse a partir de una cadena vacía**.

-   **`Content-Type`**: Debe ser `multipart/form-data`. cURL y la mayoría de los clientes HTTP lo establecerán automáticamente cuando utilice campos de formulario.
-   **`HASH-SIGNATURE`**: Una firma HMAC-SHA256 generada usando su Secreto de API, con una **cadena vacía** como cuerpo del mensaje.

## Ejemplo de Solicitud cURL

Este ejemplo demuestra cómo generar correctamente la firma y enviar una solicitud de subida de archivo.

```bash
# Sus credenciales de API
API_KEY="plugnmeet"
SECRET="zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"

# 1. Para multipart/form-data, genere la firma a partir de un cuerpo vacío.
SIGNATURE=$(echo -n "" | openssl dgst -sha256 -mac HMAC -macopt key:"$SECRET" | awk '{print $2}')

# 2. Realice la solicitud POST con las cabeceras y los datos de formulario correctos.
#    cURL establecerá automáticamente el Content-Type a multipart/form-data.
curl --location 'https://plugnmeet.example.com/auth/room/uploadWhiteboardFile' \
--header "API-KEY: $API_KEY" \
--header "HASH-SIGNATURE: $SIGNATURE" \
--form 'room_id="sala01"' \
--form 'document=@"/ruta/a/su/presentacion.pdf"'
```

## Respuesta

Si el archivo se sube con éxito, el servidor transmitirá la información necesaria a todos los participantes de la sala para mostrar la nueva página de la pizarra.

| Campo       | Tipo    | Descripción                              |
| ----------- | ------- | ---------------------------------------- |
| status      | boolean | Indica si la solicitud fue exitosa.      |
| msg         | string  | Mensaje de respuesta.                    |
| status_code | number  | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
