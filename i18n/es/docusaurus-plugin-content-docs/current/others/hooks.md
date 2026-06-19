---
title: Hooks de Scripting y Almacenamiento
description: Aprenda a utilizar los hooks de scripting en el grabador y el servidor para automatizar flujos de trabajo de medios e integrarse con proveedores de almacenamiento externo.
keywords: [hooks, scripting, storage, recorder, server, automation, s3, custom storage, nodejs, bash, long-lived]
sidebar_position: 4
sidebar_label: Hooks
---

# Hooks de Scripting y Almacenamiento

plugNmeet cuenta con un potente sistema de "hooks" (ganchos) que le permite ejecutar scripts o comandos personalizados en puntos clave del ciclo de vida de la gestión de archivos y medios. Esto posibilita una personalización profunda, permitiéndole integrarse con cualquier proveedor de almacenamiento externo (por ejemplo, S3, Google Cloud), llamar a APIs personalizadas u orquestar complejas canalizaciones (pipelines) multiservidor.

Los hooks están disponibles tanto en los componentes `server` como `recorder`.

:::info Fuente de Referencia
Las estructuras de datos JSON para los hooks pueden cambiar con el tiempo. Esta documentación proporciona ejemplos, pero para las definiciones más actualizadas, por favor consulte el repositorio oficial `plugnmeet-protocol`:

[https://github.com/mynaparrot/plugnmeet-protocol/tree/main/hooks](https://github.com/mynaparrot/plugnmeet-protocol/tree/main/hooks)
:::

## Conceptos Fundamentales

Todos los hooks, independientemente de dónde se ejecuten, comparten el mismo diseño fundamental. Comprender estos conceptos es esencial antes de implementar sus propios scripts personalizados.

### Modelos de Ejecución

Para obtener el máximo rendimiento y flexibilidad, los scripts de los hooks pueden configurarse como **procesos de larga duración** o como **comandos de única ejecución**.

*   **Procesos de Larga Duración**: Cuando un componente de plugNmeet (como `server` o `recorder`) se inicia, lanza su script **una sola vez**. El script se ejecuta de forma continua, escuchando solicitudes. Este modelo es altamente eficiente ya que evita la sobrecarga de iniciar un nuevo proceso para cada evento. **Este es el enfoque recomendado para la mayoría de los casos de uso.**
*   **Comandos de Única Ejecución**: Son comandos simples (como `curl`, `wget`, o el `http-request` integrado) que se ejecutan para cada evento de hook. Son adecuados para tareas sencillas y autocontenidas.

### Protocolo de Comunicación

La comunicación con su script de hook se realiza a través de las tuberías de E/S estándar utilizando **JSON delimitado por saltos de línea**.

*   **`stdin`**: Su script lee solicitudes desde `stdin`. Cada línea es un objeto JSON completo que representa una única solicitud.
*   **`stdout`**: Por cada solicitud recibida, su script **debe** imprimir una única línea de JSON en `stdout` como respuesta.
*   **`stderr`**: Puede usar `stderr` para registrar información y depurar dentro de su script. plugNmeet ignora esta salida, pero es invaluable para el desarrollo.

:::danger CRÍTICO: Los Scripts son Bloqueantes
La llamada a un script de hook es **síncrona y bloqueante**. Su script **DEBE** escribir una respuesta en `stdout` por cada solicitud que reciba. Si un script no devuelve una respuesta, el servicio de plugNmeet se quedará colgado indefinidamente.
:::

### El Modelo de Tubería (Pipeline)

Si define múltiples scripts para un solo hook, estos forman una tubería. La respuesta `stdout` del primer script se convierte en la solicitud `stdin` para el segundo, y así sucesivamente.

Si un script en la cadena no necesita modificar los datos (por ejemplo, solo registra el evento), **debe** aun así pasar el objeto JSON original y sin modificar a `stdout`.

### Manejo de Errores y Datos

*   **Respuesta JSON Válida**: Si su script devuelve un JSON válido, este se pasa al siguiente script o se utiliza como el resultado final.
*   **Respuesta JSON Inválida**: Si la respuesta no es un JSON válido, plugNmeet registra una **advertencia** y descarta la salida. Los datos JSON *originales* (el `stdin` de su script) se pasarán al siguiente script en la tubería. Esto evita que un solo script defectuoso rompa toda la cadena.
*   **Reporte de Errores**: Si su script encuentra un error, debe poblar el campo `error` en su respuesta JSON. Es crucial **devolver siempre el objeto JSON de entrada completo, con el campo `error` poblado**, para asegurar que los scripts posteriores en una tubería reciban la estructura de datos esperada. La aplicación principal registrará este error.

### Cómo Crear un Hook

1.  **Cree un Script o Comando**: Escriba su lógica en cualquier lenguaje (Shell, NodeJS, Go, etc.).
2.  **Hágalo Ejecutable**: Asegúrese de que su script tenga permisos de ejecución (p. ej., `chmod +x su_script.js`).
3.  **Configure en `config.yaml`**: Añada la ruta absoluta de su ejecutable (o el comando) en la sección `hooks` apropiada de su `config.yaml`.

### Utilidad Integrada `http-request`

plugNmeet proporciona un comando de única ejecución conveniente, `http-request`, para enviar la carga útil (payload) JSON del hook a un punto final HTTP/HTTPS.

**Uso:**
`http-request <URL>`

**Ejemplo en `config.yaml`:**
```yaml
scripts:
  - script: "http-request http://localhost:8080/su/endpoint"
    is_one_shot: true
```

---

## Responsabilidad de la Limpieza de Archivos

:::danger La Limpieza de Archivos es Su Responsabilidad
Cuando el sistema de hooks está habilitado, plugNmeet delega la gestión de archivos a sus scripts. Si un hook le proporciona un archivo local temporal (p. ej., a través de `input_path`), **plugNmeet no eliminará ese archivo**.

Su script es responsable de limpiar el archivo fuente local después de haberlo procesado (p. ej., después de subirlo a un almacenamiento remoto). Esto es crítico para evitar que el disco de su servidor se llene.
:::

---

## Hooks de Almacenamiento del Servidor (`server`)

Los hooks del servidor le permiten anular el almacenamiento de archivos local por defecto para artefactos de sala, archivos de chat y grabaciones, permitiendo la integración con cualquier proveedor de almacenamiento externo.

**Configuración en `server/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controla la ejecución en paralelo. Por defecto: 1.
  # 'hook_timeout' establece un tiempo de espera. Por defecto: 5m.
  upload_hook:
    pool_size: 2
    scripts:
      - script: "/ruta/a/su/script_de_subida.sh"
        is_one_shot: false

  download_hook:
    scripts:
      - script: "/ruta/a/su/script_de_descarga.sh"
        is_one_shot: false
  # ... otros hooks ...
```

### Tipos de Hooks

#### `upload_hook`
*   **Propósito**: Subir un archivo o directorio (p. ej., analíticas de sala, imágenes de pizarra) a un almacenamiento externo.
*   **Entrada (`UploadHookData`)**:
    ```json
    {
      "input_path": "/ruta/en/disco/servidor/analytics.json",
      "input_directory_path": "", // o "/ruta/a/imagenes/convertidas/"
      "hook_file_type": "artifact",
      "room_id": "sala01",
      "room_sid": "SID_d82k3s9d2l"
    }
    ```
*   **Tarea del Script**: Subir el contenido de `input_path` o `input_directory_path`. Devolver el JSON con `output_path` establecido a un identificador de almacenamiento único (p. ej., `artifacts/sala01/analytics.json`). **Después de una subida exitosa, debe eliminar el archivo/directorio fuente local.**

:::warning La Consistencia de las Rutas es Su Responsabilidad
plugNmeet **no valida** el `output_path` que usted devuelve. Se almacena como una cadena de texto y se utiliza como el `input_path` para las llamadas posteriores a `download_hook` y `delete_hook`.

Por lo tanto, si implementa un `upload_hook` personalizado, **debe** implementar también un `download_hook` y un `delete_hook` correspondientes que puedan entender el formato de `output_path` que ha definido.
:::

#### `download_hook`
*   **Propósito**: Proporcionar una forma segura para que los usuarios descarguen un archivo desde el almacenamiento externo.
*   **Entrada (`DownloadHookData`)**:
    ```json
    {
      "input_path": "artifacts/sala01/analytics.json", // El identificador de almacenamiento
      "hook_file_type": "artifact"
    }
    ```
*   **Tarea del Script**: Devolver un JSON especificando una `action`.
    *   **`action: "redirect"` (Recomendado)**: Generar una URL temporal y pre-firmada y devolverla en el campo `redirect_url`.
    *   **`action: "serve_local"`**: Descargar el archivo a una ruta local temporal en el servidor y devolver la ruta en `output_path` y el `mime_type` del archivo.

#### `delete_hook`
*   **Propósito**: Eliminar un archivo del almacenamiento externo.
*   **Entrada (`DeleteHookData`)**:
    ```json
    {
      "input_path": "artifacts/sala01/analytics.json", // El identificador de almacenamiento
      "hook_file_type": "artifact"
    }
    ```
*   **Tarea del Script**: Eliminar el archivo del almacenamiento y devolver una respuesta de confirmación.

#### `resumable_upload_hook`
*   **Propósito**: Manejar subidas de archivos en trozos (chunks) para la función de chat, típicamente delegando la lógica a un servicio como S3 Multipart Upload.
*   **Entrada (`ResumableUploadHookData`)**: Contiene un campo `type` (`part-check`, `part-upload`, `merge`) que dicta la acción requerida.
*   **Tarea del Script**: Interactuar con su backend de almacenamiento para verificar, subir o fusionar trozos de archivo. La respuesta debe indicar el resultado (p. ej., `part_exists`, `merge_success`).

#### `room_end_hook`
*   **Propósito**: Realizar tareas de limpieza después de que una sesión de sala ha finalizado completamente (p. ej., limpiar trozos de subidas reanudables abandonadas).
*   **Entrada (`RoomEndHookData`)**:
    ```json
    {
      "room_id": "sala01",
      "room_sid": "SID_d82k3s9d2l"
    }
    ```
*   **Tarea del Script**: Realizar la limpieza y devolver un mensaje de confirmación.

---

## Hooks del Grabador (`recorder`)

Los hooks del grabador se utilizan para gestionar el archivo de grabación a medida que avanza por la tubería de transcodificación. Esto es esencial para despliegues multiservidor donde la grabación y la transcodificación pueden ocurrir en máquinas diferentes.

**Configuración en `recorder/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controla cuántas tuberías de hooks pueden ejecutarse en paralelo. Por defecto: 1.
  # 'hook_timeout' establece un tiempo de espera para toda la cadena de hooks. Por defecto: 1h.
  post_recording:
    pool_size: 2
    hook_timeout: 2h
    scripts:
      - script: "./scripts/post-recording/upload.sh"
        is_one_shot: false

  pre_transcoding:
    scripts:
      - script: "./scripts/pre-transcoding/download.sh"
        is_one_shot: false

  post_transcoding:
    scripts:
      - script: "./scripts/post-transcoding/notify.sh"
        is_one_shot: false
```

### Carga de Datos (Payload): `RecordingHookData`

Todos los hooks del grabador reciben y se espera que devuelvan un objeto JSON con esta estructura.

```json
{
  "task": "single",
  "recording_id": "REC_ax9s3djn2s",
  "room_table_id": 123,
  "room_id": "sala01",
  "room_sid": "SID_d82k3s9d2l",
  "file_name": "REC_ax9s3djn2s.mp4",
  "recorder_id": "node_01",
  "file_size": 123.45,
  "input_path": "/ruta/al/archivo.mp4",
  "input_paths": [],
  "output_path": "",
  "error": "",
  "should_cleanup": false,
  "source_for_cleanup": ""
}
```

### Etapas del Hook

#### 1. `post_recording`
*   **Cuándo**: Se ejecuta en el nodo **RECORDER** después de que se guarda el archivo de grabación en bruto.
*   **Propósito**: Subir el archivo en bruto desde el disco local del grabador a una ubicación accesible por red (p. ej., S3, NFS) para que el transcodificador pueda acceder a él.
*   **Entrada**: `input_path` apunta al archivo en bruto en el disco local del grabador.
*   **Tarea del Script**: Subir el archivo y devolver el JSON con `output_path` establecido a la nueva ubicación/identificador del archivo. **Después de una subida exitosa, debe eliminar el archivo fuente local de `input_path`.**

#### 2. `pre_transcoding`
*   **Cuándo**: Se ejecuta en el nodo **TRANSCODER** antes de que comience el procesamiento con `ffmpeg`.
*   **Propósito**: Descargar el archivo en bruto desde el almacenamiento en red a una ruta local temporal en la máquina del transcodificador.
*   **Entrada**: Recibe el JSON del hook `post_recording`. `input_path` es la ubicación de red.
*   **Tarea del Script**: Descargar el archivo y devolver el JSON con `output_path` establecido a la nueva **ruta local** en el disco del transcodificador.

#### 3. `post_transcoding`
*   **Cuándo**: Se ejecuta en el nodo **TRANSCODER** después de que `ffmpeg` crea con éxito el archivo `.mp4` final.
*   **Propósito**: Subir el archivo procesado final al almacenamiento permanente y realizar la limpieza.
*   **Entrada**: Recibe el JSON del hook `pre_transcoding`. `output_path` ahora apunta al archivo procesado final en el disco local.
*   **Tarea del Script**: Subir el archivo final y devolver el JSON, actualizando opcionalmente `output_path`. Los campos `should_cleanup` y `source_for_cleanup` se pueden usar para gestionar la limpieza de archivos temporales de la etapa `pre_transcoding`.

:::warning Se Requiere Compatibilidad del Lado del Servidor
El `output_path` final de este hook se envía al `plugNmeet-server` y se almacena en la base de datos. Cuando un usuario solicita descargar esta grabación, el **servidor** usará su propio `download_hook` con esta ruta como `input_path`.

Debe asegurarse de que el `download_hook` de su `server` sea capaz de entender y procesar el formato de `output_path` generado by este script.
:::

---

## Ejemplo: Script de Larga Duración en Node.js

Este ejemplo muestra la estructura básica de un script de larga duración que analiza JSON de forma segura, realiza una acción y devuelve una respuesta.

```javascript
#!/usr/bin/env node
// scripts/mi_hook.js

const readline = require('readline');
const fs = require('fs');

// Usar stderr para el registro para que no interfiera con stdout
const log = (message) => {
  console.error(`[MiHook] ${new Date().toISOString()}: ${message}`);
};

log('Iniciando script de hook de larga duración...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  let requestData;
  try {
    requestData = JSON.parse(line);
    log(`Solicitud recibida para la sala: ${requestData.room_id || 'N/A'}`);

    // --- Su Lógica Personalizada Aquí ---
    // ej., subir a S3, llamar a una API, etc.
    // Después de una subida exitosa, recuerde limpiar el archivo de origen.
    if (requestData.input_path) {
      // En un script real, haría esto DESPUÉS de una subida exitosa.
      // fs.unlinkSync(requestData.input_path);
      // log(`Limpiado ${requestData.input_path}`);
    }
    
    requestData.processed_by_hook = true;
    // ---

    // SIEMPRE escriba una respuesta JSON válida en stdout
    process.stdout.write(JSON.stringify(requestData) + '\n');

  } catch (e) {
    log(`ERROR: ${e.message}`);
    // Si ocurre un error, devuelva el objeto requestData original con un campo 'error'.
    // Esto asegura que la estructura completa se mantenga para los scripts posteriores.
    const errorResponse = requestData 
      ? { ...requestData, error: e.message, output_path: "" } // Limpiar output_path en caso de error
      : { error: `Fallo al analizar el JSON entrante: ${e.message}` };
      
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

rl.on('close', () => {
  log('Stdin cerrado. Saliendo del script.');
  process.exit(0);
});
```
