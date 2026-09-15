---
title: "Domine sus Flujos de Trabajo Multimedia: Presentamos los Hooks de Scripting y Almacenamiento"
authors: [jibon]
tags: [plugnmeet, desarrollador, hooks, scripting, almacenamiento, automatización, s3, personalización, arquitectura]
---

En plugNmeet, nuestro objetivo es ofrecer una plataforma potente, abierta y flexible que se adapte a sus necesidades, y no al contrario. A medida que las implementaciones crecen y se trasladan a la nube, la gestión de archivos multimedia como grabaciones y artefactos se convierte en un desafío fundamental. ¿Cómo almacenar archivos en S3? ¿Cómo automatizar notificaciones cuando una grabación está lista? ¿Cómo gestionar flujos de trabajo complejos en un clúster multiservidor?

Hasta ahora, resolver estos desafíos solía exigir modificar el código central de la aplicación, lo que dificultaba las actualizaciones y convertía el mantenimiento en una tarea pesada.

Hoy nos complace anunciar una nueva función que lo cambia todo: los **Hooks de Scripting y Almacenamiento**. Este nuevo mecanismo le permite ampliar y personalizar el flujo de trabajo multimedia de plugNmeet mediante la ejecución de sus propios scripts personalizados, ya sea como eficientes **procesos de larga duración** o como sencillos **comandos de única ejecución**, en etapas clave. Toda la comunicación se realiza mediante **JSON delimitado por saltos de línea** a través de la entrada y salida estándar, de modo que puede integrar su propia lógica sin modificar una sola línea del código central.

<!--truncate-->

### Por Qué los Hooks: El Poder de una Arquitectura Desacoplada

¿Por qué supone esto un cambio tan importante? Los hooks le permiten **desacoplar** su lógica de negocio de la lógica de la aplicación. En lugar de quedar limitado al almacenamiento en disco local, ahora puede integrarse con prácticamente cualquier servicio externo.

Esto es lo que puede lograr con los hooks:

*   **Integre cualquier proveedor de almacenamiento:** utilice AWS S3, Google Cloud Storage, Backblaze, MinIO o incluso un servidor FTP personalizado. Si puede escribir un script para ello, puede utilizarlo.
*   **Automatice flujos de trabajo personalizados:** envíe automáticamente una notificación a Slack cuando se procese una grabación, llame a la API de su CRM con las analíticas de la reunión o active un servicio de indexación de vídeo.
*   **Habilite implementaciones complejas y escalables:** en un clúster multiservidor, los hooks son esenciales. Un nodo de grabación puede subir automáticamente una grabación sin procesar a un bucket central de S3, y se puede activar un nodo de transcodificación independiente para descargarla, procesarla y volver a subir el MP4 final.
*   **Prepare su instalación para el futuro:** su estrategia de almacenamiento puede evolucionar sin quedar atada al ciclo de versiones de plugNmeet.

### Cómo Funciona: Conceptos Fundamentales

El nuevo sistema se divide en dos mecanismos distintos pero relacionados: los **Hooks del Grabador** y los **Hooks de Almacenamiento del Servidor**. Antes de entrar en detalles, veamos los conceptos fundamentales que se aplican a todos los hooks.

#### Modelos de ejecución: larga duración frente a única ejecución

Para ofrecer la máxima flexibilidad, puede ejecutar sus hooks de dos maneras:

*   **Procesos de larga duración (recomendado)**: su script se inicia una sola vez y se ejecuta de forma continua, escuchando solicitudes en `stdin`. Es altamente eficiente, ya que evita el coste de iniciar un proceso por cada evento.
*   **Comandos de única ejecución**: para tareas más sencillas, puede ejecutar un comando por cada evento. Es ideal para `curl`, `wget` o la utilidad integrada.

Y hablando de utilidades, hemos incluido un práctico comando de única ejecución para simplificar las llamadas a API externas:

*   **Utilidad integrada `http-request`**: un comando sencillo para enviar el payload JSON del hook a un endpoint HTTP/HTTPS.
    *   **Uso:** `http-request <URL>`

#### El modelo de tubería (pipeline)

Si define varios scripts para un mismo hook, estos forman una tubería. La respuesta `stdout` del primer script se convierte en la solicitud `stdin` del segundo, y así sucesivamente. Si un script de la cadena no necesita modificar los datos, **debe** igualmente pasar el objeto JSON original, sin modificar, a `stdout`.

:::danger La limpieza de archivos es su responsabilidad
Cuando el sistema de hooks está habilitado, plugNmeet delega la gestión de archivos a sus scripts. Si un hook le proporciona un archivo local temporal (por ejemplo, mediante `input_path`), **plugNmeet no eliminará ese archivo**.

Su script es responsable de eliminar el archivo local de origen una vez procesado (por ejemplo, tras subirlo al almacenamiento remoto). Esto es fundamental para evitar que el disco de su servidor se llene.
:::

:::warning La consistencia de las rutas es su responsabilidad
plugNmeet **no valida** el `output_path` que devuelve su hook. Se almacena como una cadena y se utiliza como `input_path` en las llamadas posteriores a `download_hook` y `delete_hook`.

*   **Si su script modifica el `output_path`** (por ejemplo, al cambiar una ruta local por una clave de S3 en un `upload_hook` o en un hook `post_transcoding`), usted asume toda la responsabilidad sobre esa ruta. **DEBE** implementar también los correspondientes `download_hook` y `delete_hook` que comprendan y procesen el formato de ruta personalizado que ha definido.

*   **Si su script es solo de observación** (por ejemplo, registra estadísticas o envía una notificación) y no modifica el `output_path`, no necesita proporcionar los demás hooks. El flujo de trabajo predeterminado continuará con la ruta original.

Si no proporciona un `download_hook` y un `delete_hook` compatibles tras cambiar el `output_path`, las descargas y eliminaciones dejarán de funcionar.
:::

#### Protocolo de comunicación

*   **`stdin`**: su script debe leer de `stdin` en un bucle. Cada línea que lea será un objeto JSON completo que representa una única solicitud del componente de plugNmeet.
*   **`stdout`**: por cada solicitud recibida, su script **DEBE** imprimir una única línea de JSON en `stdout`. Esa línea es la respuesta.
*   **`stderr`**: puede utilizar `stderr` para el registro dentro de su script. plugNmeet ignora esta salida, pero resulta muy valiosa para depurar su lógica personalizada.

:::danger IMPORTANTE: los scripts siempre deben responder
La llamada para ejecutar un script de hook es **bloqueante**. Su script **DEBE** escribir una respuesta en `stdout` por cada solicitud que reciba en `stdin`. Si un script no devuelve una respuesta, el servicio de plugNmeet quedará suspendido indefinidamente, a la espera de que el script termine.

Si un script no necesita modificar los datos (por ejemplo, un script que solo llama a una API externa para registro), **debe** igualmente devolver el objeto JSON original, sin modificar, que recibió.
:::

#### Gestión de errores

Si su script encuentra un error, debe rellenar el campo `error` en su respuesta JSON a `stdout`. La aplicación principal registrará este error. Es fundamental devolver siempre el objeto JSON de entrada completo, con el campo `error` debidamente rellenado, para garantizar que los scripts siguientes de la tubería reciban la estructura de datos esperada.

Si la respuesta no es un JSON válido, plugNmeet registra una **advertencia** y descarta la salida. Los datos JSON *originales* (el `stdin` de su script) se pasan al siguiente script de la tubería. De este modo se evita que un único script defectuoso interrumpa toda la cadena.

### Hooks del Servidor: Gestión de Artefactos y Descargas

Estos hooks están diseñados para controlar cómo el servidor principal de plugNmeet gestiona los archivos, principalmente los diversos **artefactos de sala** y las descargas de cara al usuario.

*   **`upload_hook`**: se activa cuando el servidor crea un artefacto (por ejemplo, un archivo de analíticas de la reunión). Su script toma el archivo local (`input_path`) y lo sube a su proveedor, devolviendo un `output_path` único que indica al servidor cómo localizarlo más adelante.
*   **`download_hook`**: se activa cuando un usuario solicita descargar un artefacto o una grabación. Su script recibe el identificador del archivo (`input_path`) e indica al servidor cómo proceder (por ejemplo, proporcionando un `redirect_url` o una ruta `serve_local`).
*   **`delete_hook`**: se activa cuando es necesario eliminar un archivo. Su script recibe el identificador del archivo (`input_path`) y se encarga de eliminarlo de su almacenamiento externo.
*   **`resumable_upload_hook`**: gestiona las subidas de archivos por fragmentos para la función de chat. Su script se encarga de comprobar, subir y combinar las partes del archivo, lo cual es ideal para delegar en servicios como S3 Multipart Upload.
*   **`room_end_hook`**: realiza tareas de limpieza cuando finaliza una sesión de sala, como eliminar fragmentos abandonados de subidas reanudables.

El enfoque recomendado para las descargas es devolver una URL temporal prefirmada (`action: "redirect"`). De este modo, el usuario descarga el archivo directamente desde su proveedor de almacenamiento (por ejemplo, S3), y el tráfico ni siquiera pasa por su servidor de plugNmeet, lo que le permite ahorrar ancho de banda y recursos.

### Hooks del Grabador: Automatización de la Tubería de Grabación

Estos hooks le otorgan el control sobre la tubería de grabación y transcodificación. Aunque existen hooks para cada etapa (`post_recording`, `pre_transcoding`, `post_transcoding`), el caso de uso más habitual es la gestión del archivo final ya procesado.

### Ejemplo 1: Integración Completa con S3 para los Hooks del Servidor

Veamos un ejemplo real de integración con S3 para toda la gestión de archivos del lado del servidor utilizando Node.js. Con estos tres scripts dispondrá de una solución de almacenamiento completa, sólida y escalable para su servidor plugNmeet.

#### Configuración del proyecto

```bash
mkdir plugnmeet-hooks
cd plugnmeet-hooks
npm init -y
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### Configuración del servidor (`server/config.yaml`)

```yaml
hooks:
  upload_hook:
    pool_size: 2 # Opcional: controla la ejecución en paralelo
    scripts:
      - script: "/path/to/plugnmeet-hooks/upload.js"
        is_one_shot: false # Se trata de un script de larga duración
  download_hook:
    scripts:
      - script: "/path/to/plugnmeet-hooks/download.js"
        is_one_shot: false
  delete_hook:
    scripts:
      - script: "/path/to/plugnmeet-hooks/delete.js"
        is_one_shot: false
  room_end_hook:
    scripts:
      - script: "http-request http://localhost:8090/room-ended-notification"
        is_one_shot: true
```

#### El script de subida (`upload.js`)

Este script sube a S3 los artefactos generados por el servidor (como las analíticas).

```javascript
#!/usr/bin/env node
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream, unlinkSync } from "fs";
import { basename } from "path";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-artifacts"; // A bucket for artifacts
const log = (message) => console.error(`S3Upload: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("S3 artifact upload hook script started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    const { input_path, room_id } = request;
    const output_path = `artifacts/${room_id}/${basename(input_path)}`;

    const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: output_path, Body: createReadStream(input_path) });
    await s3Client.send(command);
    log(`Successfully uploaded to ${output_path}`);

    try {
      unlinkSync(input_path);
      log(`Cleaned up local file: ${input_path}`);
    } catch (cleanupError) {
      log(`Error cleaning up file: ${cleanupError.message}`);
    }

    request.output_path = output_path;
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`Error: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message, output_path: "" } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

#### El script de descarga (`download.js`)

Este script se activa cuando un usuario necesita acceder a un archivo. Recibe la clave de S3 en `input_path` y genera una URL prefirmada, temporal y segura, para que el usuario descargue el archivo directamente desde S3.

```javascript
#!/usr/bin/env node
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-artifacts"; 
const log = (message) => console.error(`S3Download: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("S3 download hook script started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    const { input_path } = request;

    // Note: You might have different buckets for artifacts and recordings.
    // A real-world script would have logic to determine the correct bucket.
    const bucket = input_path.startsWith("recordings/") ? "my-plugnmeet-recordings" : BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: input_path,
    });

    const redirect_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    log(`Generated pre-signed URL for ${input_path}`);

    request.action = "redirect";
    request.redirect_url = redirect_url;
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`Error: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

#### El script de eliminación (`delete.js`)

Este script se encarga de eliminar un archivo de su bucket de S3 cuando se borra desde plugNmeet.

```javascript
#!/usr/bin/env node
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-artifacts";
const log = (message) => console.error(`S3Delete: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("S3 delete hook script started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    const { input_path } = request;

    const bucket = input_path.startsWith("recordings/") ? "my-plugnmeet-recordings" : BUCKET_NAME;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: input_path,
    });

    await s3Client.send(command);
    log(`Successfully deleted ${input_path}`);

    request.msg = "File deleted successfully";
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`Error: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

### Ejemplo 2: Cómo Completar el Flujo de Trabajo con un Hook del Grabador

Ahora creemos el script más importante del flujo de grabación: el hook `post_transcoding`. En muchas configuraciones, basta con actuar cuando el MP4 final está listo. Este hook se ejecuta en el nodo de grabación/transcodificación y es ideal para subir el archivo final a su ubicación de almacenamiento permanente.

#### Configuración del grabador (`recorder/config.yaml`)

```yaml
hooks:
  post_transcoding:
    scripts:
      - script: "/path/to/plugnmeet-hooks/post-transcoding-upload.js"
        is_one_shot: false
```

#### El script de subida tras la transcodificación (`post-transcoding-upload.js`)

Este script se ejecuta cuando una grabación se ha transcodificado correctamente a MP4. Recibe la ruta al MP4 final en el disco local mediante `input_path`, lo sube a un bucket permanente de S3 y devuelve la clave del objeto S3 en `output_path` para que el servidor la almacene.

```javascript
#!/usr/bin/env node
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream, unlinkSync } from "fs";
import readline from "readline";

const s3Client = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = "my-plugnmeet-recordings"; // Use a dedicated bucket for recordings
const log = (message) => console.error(`PostTranscoding: ${message}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

log("Post-transcoding upload hook started.");

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
    log(`Received request: ${JSON.stringify(request)}`);

    // In the post_transcoding stage, `input_path` contains the path to the final MP4 on the local disk.
    const { input_path, file_name } = request;
    
    // Use the canonical file_name from the hook data to construct the final S3 key.
    const final_s3_key = `recordings/${file_name}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: final_s3_key,
      Body: createReadStream(input_path),
      ContentType: "video/mp4",
    });

    await s3Client.send(command);
    log(`Successfully uploaded to ${final_s3_key}`);

    // This script is responsible for cleaning up the local MP4 file it was given.
    try {
      unlinkSync(input_path);
      log(`Cleaned up local transcoded file: ${input_path}`);
    } catch (cleanupError) {
      log(`WARN: Failed to clean up local file: ${cleanupError.message}`);
    }

    // Set the final S3 key in `output_path` for the server to store in the database.
    request.output_path = final_s3_key;
    
    process.stdout.write(JSON.stringify(request) + "\n");
  } catch (e) {
    log(`ERROR: ${e.message}`);
    const errorResponse = request ? { ...request, error: e.message, output_path: "" } : { error: `JSON parse error: ${e.message}` };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
```

:::warning Se requiere compatibilidad en el lado del servidor
El `output_path` final de este hook `post_transcoding` (por ejemplo, `recordings/REC_123.mp4`) se envía a `plugNmeet-server` y se almacena en la base de datos.

Cuando un usuario solicita descargar esta grabación, el **servidor** utilizará su propio `download_hook` con esta ruta como `input_path`. Debe asegurarse de que el `download_hook` de su `server` (como el que se muestra en el primer ejemplo) sea capaz de comprender y procesar el formato de `output_path` generado por este script.
:::

### Empiece Hoy Mismo

Este nuevo sistema de hooks abre un mundo de posibilidades para la automatización y las arquitecturas avanzadas nativas de la nube. Está diseñado para desarrolladores y administradores de sistemas que desean construir una plataforma de videoconferencia verdaderamente personalizada, escalable y sólida.

¿Listo para profundizar? Consulte nuestra nueva y completa **[Documentación de Hooks de Scripting y Almacenamiento](/docs/others/hooks)** para obtener especificaciones técnicas detalladas, estructuras de payload y más ejemplos.

¡Estamos deseando ver los increíbles flujos de trabajo que usted construirá!

---

**¿Listo para crear su propia plataforma de videoconferencia?**

*   **[Siga nuestra Guía de Instalación](/docs/installation) para poner en marcha su servidor autoalojado en cuestión de minutos.**
*   **[Pruebe la Demostración en Vivo](https://demo.plugnmeet.com/landing.html) para explorar las funciones.**
