---
title: Hooks de Scripting y Almacenamiento
description: Aprenda a usar los hooks de scripting en el grabador para automatizar los flujos de trabajo de transcodificación y los hooks de almacenamiento en el servidor para una gestión avanzada de archivos con proveedores externos.
keywords: [hooks, scripting, almacenamiento, grabador, servidor, automatización, s3, almacenamiento personalizado, nodejs, bash]
sidebar_position: 4
sidebar_label: Hooks
---

# Hooks de Scripting y Almacenamiento

plugNmeet ofrece potentes mecanismos de "hooks" tanto en los componentes del `recorder` (grabador) como del `server` (servidor) para permitir una personalización y automatización avanzadas de sus flujos de trabajo de medios. Un "script" puede ser cualquier archivo ejecutable (un script de shell, un programa de Go compilado, un script de NodeJS, etc.) que pueda leer desde `stdin` (entrada estándar) y escribir en `stdout` (salida estándar).

---

## Grabador: Hooks de Scripting

Los hooks de scripting le permiten automatizar tareas en diferentes etapas del proceso de grabación y transcodificación. Esto es especialmente útil en una configuración de múltiples servidores donde la grabación y la transcodificación ocurren en máquinas diferentes.

Todos los scripts siguen una interfaz estándar: reciben una carga útil (payload) JSON a través de **stdin** y, opcionalmente, pueden devolver una carga útil JSON modificada a través de **stdout**. Si se definen múltiples scripts para un solo hook, forman una cadena (pipeline): el **stdout** del primer script se convierte en el **stdin** del segundo, y así sucesivamente.

### Etapas de los Hooks

1.  **`post_recording`**: Se ejecuta en el **GRABADOR** después de que se guarda el archivo sin procesar.
    *   **Propósito**: Subir el archivo sin procesar a un almacenamiento compartido (NFS, S3, etc.).
    *   **Acción**: Debe devolver un JSON con la `file_path` (ruta del archivo) actualizada a la nueva ubicación accesible por la red para el transcodificador.

2.  **`pre_transcoding`**: Se ejecuta en el **TRANSCODIFICADOR** antes de que `ffmpeg` comience.
    *   **Propósito**: Descargar el archivo desde el almacenamiento compartido a una ruta local.
    *   **Acción**: Debe devolver un JSON con la `file_path` actualizada a la ruta local final para que `ffmpeg` la utilice.

3.  **`post_transcoding`**: Se ejecuta en el **TRANSCODIFICADOR** después de que `ffmpeg` finaliza.
    *   **Propósito**: Limpieza final, notificación o subida del archivo procesado.
    *   **Acción**: Opcionalmente, puede devolver un JSON con la `file_path` actualizada (p. ej., a una URL de S3) para ser enviada al servidor principal de plugNmeet.

### Configuración

Añada la ruta a su(s) ejecutable(s) en la sección `hooks` del archivo `config.yaml` de su grabador.

```yaml
# config.yaml
hooks:
  post_recording:
    - "./scripts/post-recording/upload.sh"
  pre_transcoding:
    - "./scripts/pre-transcoding/download.sh"
  post_transcoding:
    - "./scripts/post-transcoding/upload-to-s3.sh"
    - "./scripts/post-transcoding/notify-slack.sh"
```

### Carga de Datos (`stdin`)

Su script recibirá un objeto JSON con la siguiente estructura:

```json
{
  "task": "single",
  "recording_id": "REC_ax9s3djn2s",
  "room_table_id": 123,
  "room_id": "room01",
  "room_sid": "SID_d82k3s9d2l",
  "file_name": "REC_ax9s3djn2s.mp4",
  "file_path": "/path/to/recording/files/node_01/room01/REC_ax9s3djn2s.mp4",
  "file_paths": ["/path/to/segment1.mp4"],
  "file_size": 123.45,
  "recorder_id": "node_01"
}
```

### Ejemplos de Scripts

#### Bash con `jq`

Este ejemplo lee la `file_path` desde `stdin`, la registra y pasa el JSON original a `stdout`.

```bash
#!/bin/bash
# scripts/post-recording/upload.sh

# Leer toda la entrada estándar
JSON_DATA=$(cat)

# Usar jq para extraer la file_path
FILE_PATH=$(echo $JSON_DATA | jq -r '.file_path')

# Registrar la acción (p. ej., en un archivo o en stderr)
echo "Subiendo archivo: $FILE_PATH" >&2

# Aquí, añadiría su lógica de subida (p. ej., aws s3 cp ...)
# Para este ejemplo, simplemente pasaremos los datos.

# Devolver el JSON original a stdout para el siguiente script en la cadena
echo $JSON_DATA
```

#### Node.js

Este ejemplo analiza los datos de `stdin`, registra el `recording_id` y devuelve un objeto JSON modificado a `stdout`.

```javascript
#!/usr/bin/env node
// scripts/post-recording/upload.js

let data = '';

process.stdin.on('readable', () => {
  let chunk;
  while (null !== (chunk = process.stdin.read())) {
    data += chunk;
  }
});

process.stdin.on('end', () => {
  if (!data) {
    process.exit(0);
  }
  const scriptData = JSON.parse(data);

  // Su lógica aquí
  console.error(`Procesando grabación: ${scriptData.recording_id}`);

  // Ejemplo: Modificar la file_path después de una subida
  scriptData.file_path = `s3://mi-bucket/${scriptData.file_name}`;

  // Enviar el JSON modificado a stdout
  process.stdout.write(JSON.stringify(scriptData));
});
```

---

## Servidor: Hooks de Almacenamiento

Los hooks de almacenamiento le permiten anular el almacenamiento de archivos local predeterminado e integrarse con cualquier proveedor de almacenamiento externo (p. ej., S3, Google Cloud Storage) mediante scripts personalizados. Esto es ideal para implementaciones nativas en la nube o de múltiples servidores donde necesita un almacenamiento centralizado y escalable.

Estos hooks se utilizan principalmente para los **artefactos de sala**. El `upload_hook` se activa cuando el servidor genera un artefacto. El `download_hook` y el `delete_hook` se utilizan tanto para artefactos como para grabaciones.

*   **Artefactos de Sala**: Esto incluye tipos de artefactos como `MEETING_SUMMARY`, `SPEECH_TRANSCRIPTION` y `MEETING_ANALYTICS`. Para obtener una lista completa, consulte la [definición oficial de protobuf](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_room_artifacts.proto).
*   **Grabaciones**: El servidor **no** utiliza el `upload_hook` para las grabaciones. En su lugar, el grabador debe subir la grabación final a su almacenamiento externo directamente a través de su hook `post_transcoding`. Luego, el servidor utiliza el `download_hook` y el `delete_hook` para gestionar el acceso a esa grabación.

Si esta sección se omite en su `config.yaml`, el servidor almacenará todos los archivos en el disco local.

### Configuración

Añada la sección `storage_hooks` al archivo `config.yaml` de su servidor.

```yaml
# config.yaml
storage_hooks:
  upload_hook:
    - "./scripts/server_hooks/upload.sh"
  download_hook:
    - "./scripts/server_hooks/download.sh"
  delete_hook:
    - "./scripts/server_hooks/delete.sh"
```

### Tipos de Hooks y Cargas Útiles (Payloads)

#### Hook de Subida (Upload Hook)

*   **Solicitud (`stdin`)** - *Usado solo para artefactos.*
    ```json
    {
      "source_file_path": "/path/on/disk/analytics.json",
      "service_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l",
      "room_table_id": 123
    }
    ```
*   **Respuesta (`stdout`)**: El script final *debe* devolver la `logical_path`.
    ```json
    {
      "logical_path": "artifacts/room01/analytics_SID_d82k3s9d2l.json",
      "error": ""
    }
    ```

:::info ¿Qué es una `logical_path`?
La `logical_path` (ruta lógica) es un identificador único que su script de subida crea y entiende. Puede tener cualquier formato de cadena que elija, como una clave de objeto de S3 (`mi-bucket/artifacts/file.json`), un ID de archivo de un servicio de almacenamiento o un simple nombre de archivo. Este mismo valor se pasará más tarde a sus scripts `download_hook` y `delete_hook`, para que sepan sobre qué archivo actuar.
:::

#### Hook de Descarga (Download Hook)

*   **Solicitud (`stdin`)**:
    ```json
    {
      "logical_path": "artifacts/room01/analytics_SID_d82k3s9d2l.json",
      "service_type": "artifact"
    }
    ```
*   **Respuesta (`stdout`)**: El script final *debe* devolver una `action` (acción) y un valor correspondiente.
    ```json
    {
      "action": "redirect",
      "redirect_url": "https://s3.presigned.url/...",
      "error": ""
    }
    ```

La `action` determina cómo el servidor proporcionará el archivo al usuario:

*   `redirect` **(Recomendado)**: Su script debe devolver una `redirect_url`. El servidor enviará una redirección `307 Temporary Redirect` al cliente, permitiéndole descargar el archivo directamente desde su almacenamiento externo. Esto es muy eficiente, ya que el archivo no pasa a través de su servidor. Un caso de uso común es generar una URL pre-firmada para un objeto de S3.

*   `serve_local`: Su script primero debe descargar el archivo desde su almacenamiento externo a una ubicación temporal en el disco local del servidor. Luego, debe devolver la `local_path` (ruta local) completa **y** el `mime_type` correcto para el archivo (p. ej., `application/json`, `video/mp4`). El servidor leerá el archivo desde esta ruta y lo transmitirá al cliente con la cabecera `Content-Type` adecuada. Este método consume más recursos del servidor y generalmente no se recomienda a menos que la redirección directa no sea posible.

#### Hook de Eliminación (Delete Hook)

*   **Solicitud (`stdin`)**:
    ```json
    {
      "logical_path": "artifacts/room01/analytics_SID_d82k3s9d2l.json",
      "service_type": "artifact"
    }
    ```
*   **Respuesta (`stdout`)**: Opcional, para fines de registro.
    ```json
    {
      "msg": "Archivo eliminado con éxito",
      "error": ""
    }
    ```
