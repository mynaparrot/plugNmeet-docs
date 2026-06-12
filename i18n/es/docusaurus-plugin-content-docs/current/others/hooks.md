---
title: Hooks de Scripting y Almacenamiento
description: Aprenda a usar los hooks de scripting en el grabador y el servidor para automatizar flujos de trabajo de medios e integrarse con proveedores de almacenamiento externos.
keywords: [hooks, scripting, almacenamiento, grabador, servidor, automatización, s3, almacenamiento personalizado, nodejs, bash, long-lived]
sidebar_position: 4
sidebar_label: Hooks
---

# Hooks de Scripting y Almacenamiento

plugNmeet ofrece un potente mecanismo de "hooking" para permitir una personalización y automatización avanzadas de sus flujos de trabajo de medios. Los hooks están disponibles tanto en los componentes `recorder` (grabador) como `server` (servidor), lo que le permite integrarse con cualquier proveedor de almacenamiento externo (por ejemplo, S3, Google Cloud Storage), llamar a APIs personalizadas u orquestar complejas tuberías multi-servidor.

## El Modelo de Proceso de Larga Duración

Para un rendimiento y eficiencia máximos, todos los scripts de hook se gestionan como **procesos de larga duración**. Cuando un componente de plugNmeet (como `server` o `recorder`) se inicia, lanza cada uno de sus scripts de hook configurados **una vez**. El script luego se ejecuta continuamente en segundo plano, esperando solicitudes.

Este modelo elimina la significativa sobrecarga de iniciar un nuevo proceso para cada evento de hook, lo que resulta en una ejecución casi instantánea.

### Protocolo de Comunicación

Toda la comunicación con su script de hook se realiza a través de sus tuberías de E/S estándar utilizando **JSON delimitado por nueva línea**.

*   **`stdin`**: Su script debe leer de `stdin` en un bucle. Cada línea que lea será un objeto JSON completo que representa una única solicitud del componente plugNmeet.
*   **`stdout`**: Para cada solicitud que reciba, su script **debe** imprimir una sola línea de JSON en `stdout`. Esta línea es la respuesta.
*   **`stderr`**: Puede usar `stderr` para registrar información dentro de su script. Esta salida es ignorada por plugNmeet pero es invaluable para depurar su lógica personalizada.

El principio central del sistema de hooks es que **un script recibe un objeto JSON y devuelve exactamente el mismo objeto**, solo modificando campos específicos como `output_path` o `error`. Si se definen múltiples scripts para un solo hook, forman una tubería: la respuesta de `stdout` del primer script se convierte en la solicitud de `stdin` para el segundo, y así sucesivamente.

### Cómo Crear un Hook

1.  **Cree un Script de Larga Duración:** Un "script" puede ser cualquier archivo ejecutable (un script de shell, un programa Go compilado, un script NodeJS, etc.) que se ejecute en un bucle, leyendo de `stdin` y escribiendo en `stdout`.
2.  **Hágalo Ejecutable:** Asegúrese de que su script tenga permisos de ejecución (`chmod +x your_script.js`).
3.  **Habilite en la Configuración:** Agregue la ruta completa a su ejecutable en la sección `hooks` apropiada de su `config.yaml`.

---

## Hooks del Grabador (`recorder`)

Estos hooks le permiten gestionar el archivo de grabación a medida que avanza por la cadena de transcodificación. Esto es fundamental para despliegues multi-servidor donde la grabación y la transcodificación se realizan en máquinas diferentes.

**Configuración en `recorder/config.yaml`:**

```yaml
hooks:
  post_recording:
    - "/ruta/a/su/script_de_subida_post_grabacion.sh"
  pre_transcoding:
    - "/ruta/a/su/script_de_descarga_pre_transcodificacion.sh"
  post_transcoding:
    - "/ruta/a/su/script_de_notificacion_post_transcodificacion.sh"
```

### Etapas del Hook y Carga de Datos

Todos los hooks del grabador utilizan la misma estructura JSON `RecordingHookData`.

#### Estructura de `RecordingHookData`

```json
{
  "task": "single",
  "recording_id": "REC_ax9s3djn2s",
  "room_table_id": 123,
  "room_id": "room01",
  "room_sid": "SID_d82k3s9d2l",
  "file_name": "REC_ax9s3djn2s.mp4",
  "recorder_id": "node_01",
  "file_size": 123.45,
  "input_path": "/ruta/al/archivo.mp4",
  "input_paths": ["/ruta/al/segmento1.mp4"],
  "output_path": "",
  "error": "",
  "should_cleanup": false,
  "source_for_cleanup": ""
}
```

#### Etapas del Hook y Responsabilidades del Script

1.  **`post_recording`**
    *   **Contexto**: Se ejecuta en el nodo del **GRABADOR** después de que el archivo de grabación en bruto se guarda.
    *   **Propósito**: Subir el archivo en bruto desde el disco local del grabador a una ubicación accesible por la red (por ejemplo, NFS, S3) para que el transcodificador pueda acceder a él.
    *   **`stdin`**: Recibe `RecordingHookData` con `input_path` apuntando al archivo en bruto en el disco del grabador.
    *   **`stdout`**: Su script debe devolver el mismo JSON, modificando `output_path` para que sea la nueva ubicación del archivo, accesible por la red.

2.  **`pre_transcoding`**
    *   **Contexto**: Se ejecuta en el nodo del **TRANSCODIFICADOR** antes de que `ffmpeg` comience a procesar.
    *   **Propósito**: Descargar el archivo en bruto del almacenamiento de red a un directorio local temporal en la máquina del transcodificador.
    *   **`stdin`**: Recibe la salida JSON del hook `post_recording`.
    *   **`stdout`**: Su script debe devolver el mismo JSON, modificando `output_path` para que sea la nueva **ruta local** en el disco del transcodificador donde `ffmpeg` puede encontrar el archivo.

3.  **`post_transcoding`**
    *   **Contexto**: Se ejecuta en el nodo del **TRANSCODIFICADOR** después de que `ffmpeg` ha creado con éxito el archivo procesado final (por ejemplo, `.mp4`).
    *   **Propósito**: Realizar acciones finales, como subir el archivo procesado a un almacenamiento permanente, limpiar archivos temporales o notificar a una API externa.
    *   **`stdin`**: Recibe la salida JSON del hook `pre_transcoding`, con `output_path` ahora apuntando al archivo procesado final.
    *   **`stdout`**: Su script puede devolver el JSON, modificando opcionalmente `output_path` de nuevo si el archivo se movió a su ubicación pública final (por ejemplo, una URL pública de S3). Este `output_path` final es lo que se envía al `server`.

---

## Hooks de Almacenamiento del Servidor (`server`)

Los hooks de almacenamiento en el `server` le permiten anular el almacenamiento de archivos local predeterminado e integrarse con cualquier proveedor de almacenamiento externo. Estos hooks se utilizan para los **artefactos de sala** (por ejemplo, análisis, transcripciones) y para gestionar el acceso a las **grabaciones**.

**Configuración en `server/config.yaml`:**

```yaml
storage_hooks:
  upload_hook:
    - "/ruta/a/su/script_de_subida.sh"
  download_hook:
    - "/ruta/a/su/script_de_descarga.sh"
  delete_hook:
    - "/ruta/a/su/script_de_eliminacion.sh"
```

### Tipos de Hooks y Cargas de Datos

#### `upload_hook`

*   **Contexto**: Se ejecuta cuando el `server` genera un artefacto de sala. **Este hook NO se usa para grabaciones.**
*   **Propósito**: Subir el archivo del artefacto desde el disco local del servidor a su almacenamiento externo.
*   **`stdin` (`UploadHookData`)**:
    ```json
    {
      "input_path": "/path/on/server/disk/analytics.json",
      "service_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l",
      "room_table_id": 123
    }
    ```
*   **`stdout`**: Su script **debe** devolver el mismo JSON, modificando `output_path` para que sea un identificador único que sus otros scripts usarán para encontrar el archivo más tarde.
    ```json
    {
      "input_path": "/path/on/server/disk/analytics.json",
      "service_type": "artifact",
      "room_id": "room01",
      "room_sid": "SID_d82k3s9d2l",
      "room_table_id": 123,
      "output_path": "artifacts/room01/analytics.json"
    }
    ```

:::info ¿Qué es este `output_path`?
El `output_path` es una **ruta lógica** o un identificador único que su script de subida crea y entiende. El `server` es completamente ajeno a su formato; simplemente guarda esta cadena y la pasa a sus `download_hook` y `delete_hook` más tarde.

Aunque *puede* usar una URL completa como `s3://mi-bucket/artifacts/file.json`, un patrón más flexible es devolver solo la clave del objeto (`artifacts/file.json`). Sus scripts de descarga/eliminación pueden configurarse con el nombre del bucket y construir la URL completa ellos mismos. Esto desacopla su base de datos de su configuración de almacenamiento.
:::

#### `download_hook`

*   **Contexto**: Se ejecuta cuando un usuario solicita descargar una grabación o un artefacto.
*   **Propósito**: Proporcionar una forma segura y eficiente para que los usuarios accedan al archivo desde su almacenamiento externo.
*   **`stdin` (`DownloadHookData`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics.json",
      "service_type": "artifact"
    }
    ```
*   **`stdout`**: Su script **debe** devolver el mismo JSON, modificando el campo `action` y su valor correspondiente.
    *   **`action: "redirect"` (Recomendado)**: Su script debe establecer `action` en `"redirect"` y rellenar `redirect_url` con una URL temporal pre-firmada.
        ```json
        {
          "input_path": "artifacts/room01/analytics.json",
          "service_type": "artifact",
          "action": "redirect",
          "redirect_url": "https://s3.presigned.url/..."
        }
        ```
    *   **`action: "serve_local"`**: Su script debe descargar el archivo a una ruta local temporal en el servidor, establecer `action` en `"serve_local"`, y rellenar tanto `output_path` (la ruta local) como el `mime_type` del archivo.
        ```json
        {
          "input_path": "artifacts/room01/analytics.json",
          "service_type": "artifact",
          "action": "serve_local",
          "output_path": "/tmp/downloads/analytics.json",
          "mime_type": "application/json"
        }
        ```

#### `delete_hook`

*   **Contexto**: Se ejecuta cuando se elimina una grabación o un artefacto.
*   **Propósito**: Eliminar el archivo de su almacenamiento externo.
*   **`stdin` (`DeleteHookData`)**:
    ```json
    {
      "input_path": "artifacts/room01/analytics.json",
      "service_type": "artifact"
    }
    ```
*   **`stdout`**: Su script puede añadir opcionalmente un `msg` para el registro.
    ```json
    {
      "input_path": "artifacts/room01/analytics.json",
      "service_type": "artifact",
      "msg": "Archivo eliminado correctamente"
    }
    ```

### Ejemplo de Script Node.js de Larga Duración

Este ejemplo muestra la estructura básica de un script Node.js de larga duración que puede manejar solicitudes.

```javascript
#!/usr/bin/env node
// scripts/my_hook.js

const readline = require('readline');

// Una función de registro simple para escribir en stderr
const log = (message) => {
  console.error(`MyHook: ${message}`);
};

log('Iniciando mi script de hook Node.js de larga duración...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Escuchar cada línea de stdin
rl.on('line', (line) => {
  try {
    log(`Solicitud recibida: ${line}`);
    const requestData = JSON.parse(line);

    // --- Su Lógica Aquí ---
    //
    // Realice su acción (subir, descargar, eliminar) basándose en requestData.
    // Por ejemplo, para un hook de subida, podría subir el archivo en `requestData.input_path`.
    //
    // Después de su acción, modifique el objeto.
    // Para este ejemplo, simplemente agregaremos un nuevo output_path.
    const newPath = `s3://my-bucket/new-path/${Date.now()}`;
    requestData.output_path = newPath;
    // ---

    // Escriba el objeto JSON modificado de vuelta a stdout, seguido de un salto de línea.
    process.stdout.write(JSON.stringify(requestData) + '\n');

  } catch (e) {
    log(`Error al procesar la solicitud: ${e.message}`);
    // Si ocurre un error, escriba un objeto JSON de error en stdout
    const errorResponse = { error: e.message };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

rl.on('close', () => {
  log('Stdin ha sido cerrado. Saliendo del script.');
  process.exit(0);
});
```
