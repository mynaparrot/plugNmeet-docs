---
title: Hooks de Scripting y Almacenamiento
description: Aprende a usar hooks de scripting en el grabador y el servidor para automatizar flujos de trabajo de medios e integrarte con proveedores de almacenamiento externos.
keywords: [hooks, scripting, almacenamiento, grabador, servidor, automatización, s3, almacenamiento personalizado, nodejs, bash, long-lived, external_url_hook, hook de url externa, conocimiento del agente de ia, hook de servidor mcp]
sidebar_position: 4
sidebar_label: Hooks
---

# Hooks de scripting y almacenamiento

plugNmeet cuenta con un potente sistema de "hooks" (ganchos) que le permite ejecutar scripts o comandos personalizados en puntos clave del ciclo de vida de la gestión de archivos y medios. Esto posibilita una personalización profunda, permitiéndole integrarse con cualquier proveedor de almacenamiento externo (por ejemplo, S3, Google Cloud), llamar a APIs personalizadas u orquestar complejas canalizaciones (pipelines) multiservidor.

Los hooks están disponibles tanto en los componentes `server` como `recorder`.

:::tip ¿Buscas Ejemplos?
Esta página cubre los detalles técnicos del sistema de hooks. Para ejemplos prácticos del mundo real en varios lenguajes de programación, consulta nuestras publicaciones de blog etiquetadas con **[hooks](/blog/tags/hooks)**.
:::

:::info Fuente de Referencia
Las estructuras de datos JSON para los hooks pueden cambiar con el tiempo. Esta documentación proporciona ejemplos, pero para las definiciones más actualizadas, por favor consulte el repositorio oficial `plugnmeet-protocol`:

[https://github.com/mynaparrot/plugnmeet-protocol/tree/main/hooks](https://github.com/mynaparrot/plugnmeet-protocol/tree/main/hooks)
:::

## Conceptos fundamentales

Todos los hooks, independientemente de dónde se ejecuten, comparten el mismo diseño fundamental. Comprender estos conceptos es esencial antes de implementar sus propios scripts personalizados.

### Modelos de ejecución

Para obtener el máximo rendimiento y flexibilidad, los scripts de los hooks pueden configurarse como **procesos de larga duración** o como **comandos de única ejecución**.

*   **Procesos de Larga Duración**: Cuando un componente de plugNmeet (como `server` o `recorder`) se inicia, lanza su script **una sola vez**. El script se ejecuta de forma continua, escuchando solicitudes. Este modelo es altamente eficiente ya que evita la sobrecarga de iniciar un nuevo proceso para cada evento. **Este es el enfoque recomendado para la mayoría de los casos de uso.**
*   **Comandos de Única Ejecución**: Son comandos simples (como `curl`, `wget`, o la utilidad integrada `http-request`) que se ejecutan para cada evento de hook. Son adecuados para tareas sencillas y autocontenidas.

### Protocolo de comunicación

La comunicación con su script de hook se realiza a través de las tuberías de E/S estándar utilizando **JSON delimitado por saltos de línea**.

*   **`stdin`**: Su script lee solicitudes desde `stdin`. Cada línea es un objeto JSON completo que representa una única solicitud.
*   **`stdout`**: Por cada solicitud recibida, su script **debe** imprimir una única línea de JSON en `stdout` como respuesta.
*   **`stderr`**: Puede usar `stderr` para registrar información y depurar dentro de su script. plugNmeet ignora esta salida, pero es invaluable para el desarrollo.

:::danger CRÍTICO: Los Scripts son Bloqueantes
La llamada a un script de hook es **síncrona y bloqueante**. Su script **DEBE** escribir una respuesta en `stdout` por cada solicitud que reciba. Si un script no devuelve una respuesta, el servicio de plugNmeet se quedará colgado indefinidamente.
:::

### El modelo de tubería (pipeline)

Si define múltiples scripts para un solo hook, estos forman una tubería. La respuesta `stdout` del primer script se convierte en la solicitud `stdin` para el segundo, y así sucesivamente.

Si un script en la cadena no necesita modificar los datos (por ejemplo, solo registra el evento), **debe** aun así pasar el objeto JSON original y sin modificar a `stdout`.

### Manejo de errores y datos

*   **Respuesta JSON Válida**: Si su script devuelve un JSON válido, este se pasa al siguiente script o se utiliza como el resultado final.
*   **Respuesta JSON Inválida**: Si la respuesta no es un JSON válido, plugNmeet registra una **advertencia** y descarta la salida. Los datos JSON *originales* (el `stdin` de su script) se pasarán al siguiente script en la tubería. Esto evita que un solo script defectuoso rompa toda la cadena.
*   **Reporte de Errores**: Si su script encuentra un error, debe poblar el campo `error` en su respuesta JSON. Es crucial **devolver siempre el objeto JSON de entrada completo, con el campo `error` poblado**, para asegurar que los scripts posteriores en una tubería reciban la estructura de datos esperada. La aplicación principal registrará este error.

### Cómo crear un hook

1.  **Cree un Script o Comando**: Escriba su lógica en cualquier lenguaje (Shell, NodeJS, Go, etc.).
2.  **Hágalo Ejecutable**: Asegúrese de que su script tenga permisos de ejecución (p. ej., `chmod +x su_script.js`).
3.  **Configure en `config.yaml`**: Añada la ruta absoluta de su ejecutable (o el comando) en la sección `hooks` apropiada de su `config.yaml`.

### Utilidad integrada `http-request`

plugNmeet proporciona un comando de única ejecución conveniente, `http-request`, para enviar la carga útil (payload) JSON del hook a un punto final HTTP/HTTPS.

**Uso:**
`http-request <URL>`

**Ejemplo en `config.yaml`:**
```yaml
scripts:
  - script: "http-request http://localhost:8090/su/endpoint"
    is_one_shot: true
```

---

## Responsabilidades clave

### Responsabilidad de la limpieza de archivos

:::danger Importante
Cuando habilita un hook que recibe una ruta de archivo (como `upload_hook` o `post_transcoding`), plugNmeet **desactiva su propia limpieza automática de archivos** para esa etapa.
:::

Esta es una característica de seguridad crítica. La aplicación delega la gestión de archivos a su script porque no puede conocer su naturaleza (p. ej., si es un cargador o solo un notificador). Si la aplicación eliminara un archivo antes de que su script pudiera procesarlo, causaría un error.

Por lo tanto, la responsabilidad de la gestión de archivos se le transfiere a usted, y el rol de su script determina su responsabilidad:

*   **Si su script MUEVE o SUBE el archivo** (p. ej., a S3), **DEBE** eliminar el archivo fuente local de `input_path` después de que la transferencia sea exitosa. Esto es esencial para evitar que el disco de su servidor se llene.

*   **Si su script solo OBSERVA el archivo** (p. ej., para registro, análisis o envío de una notificación) y no lo mueve, **NO DEBE** eliminar el archivo. El archivo todavía es necesario para el almacenamiento interno de plugNmeet o para hooks posteriores en una tubería.

### Responsabilidad de la consistencia de las rutas

:::warning La Consistencia de las Rutas es Su Responsabilidad
**plugNmeet no valida la `output_path` que usted devuelve desde un hook. Se almacena como una cadena de texto y se utiliza como `input_path` para las llamadas posteriores a `download_hook` y `delete_hook`.**
:::

*   **Si su script modifica `output_path`** (por ejemplo, cambiando una ruta local por una clave de S3 en un `upload_hook` o `post_transcoding_hook`), asume la total responsabilidad de esa ruta. **DEBE** implementar también los correspondientes `download_hook` y `delete_hook` que puedan entender y procesar el formato de ruta personalizado que ha definido.

*   **Si su script es solo para observación** (por ejemplo, para registrar estadísticas o enviar una notificación) y no modifica la `output_path`, entonces no necesita proporcionar los otros hooks. El flujo de trabajo predeterminado continuará con la ruta original.

No proporcionar scripts `download_hook` y `delete_hook` compatibles después de cambiar la `output_path` resultará en descargas y eliminaciones rotas.

---

## Hooks de almacenamiento del servidor (`server`)

Los hooks del servidor le permiten anular el almacenamiento de archivos local de forma predeterminada para artefactos de sala, archivos de chat y grabaciones, permitiendo la integración con cualquier proveedor de almacenamiento externo.

**Configuración en `server/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controla la ejecución en paralelo. Predeterminado: 1.
  # 'hook_timeout' establece un tiempo de espera. Predeterminado: 5m.
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

### Tipos de hooks

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

## Hook de URL externa (`server`)

`external_url_hook` permite que su script participe en el tratamiento de URL externas del Agente de IA. El servidor le pide que apruebe una URL y, si lo desea, que proporcione el contenido en lugar de que plugNmeet lo descargue. Cubre las dos fuentes externas: las páginas de conocimiento (cuando una sala establece `allow_web_fetch`) y los servidores MCP externos.

**Configuración en `server/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controla la ejecución en paralelo. Predeterminado: 1.
  # 'hook_timeout' establece un tiempo de espera. Predeterminado: 5m.
  external_url_hook:
    pool_size: 1
    hook_timeout: 5m
    scripts:
      - script: "/ruta/a/su/script_de_url_externa.sh"
        is_one_shot: false
```

El hook utiliza los mismos [modelos de ejecución](#modelos-de-ejecución), el mismo [protocolo de comunicación](#protocolo-de-comunicación) y el mismo [modelo de tubería](#el-modelo-de-tubería-pipeline) que los demás hooks. Se invoca **una sola vez por solicitud y sin reintentos**. La solicitud se rechaza solo cuando el script falla: un `error` no vacío en su respuesta, una ejecución fallida o un tiempo de espera agotado. Una respuesta que no sea JSON válido se registra como advertencia y se descarta, de modo que la solicitud continúa con la carga útil que ya tenía. Devuelva siempre JSON válido y use `error` para denegar una solicitud.

### Entrada: `ExternalUrlHookData`

```json
{
  "stage": "validate",
  "type": "knowledge",
  "room_id": "sala01",
  "url": "https://docs.example.com/api/auth",
  "allowed_urls": ["https://docs.example.com/api/"]
}
```

```json
{
  "stage": "fetch",
  "type": "mcp",
  "room_id": "sala01",
  "url": "https://mcp.example.com/mcp",
  "server_key": "acme-docs"
}
```

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `stage` | string | `validate` o `fetch`. |
| `type` | string | `knowledge` para una página de conocimiento externa, `mcp` para un servidor MCP externo. |
| `room_id` | string | La sala a la que pertenece la solicitud. |
| `room_sid` | string | Reservado. El servidor aún no lo rellena, por lo que el campo se omite. |
| `url` | string | La URL que se comprueba o se descarga: en `validate`, un prefijo de conocimiento o un endpoint MCP tomado de la solicitud de la sala; en `fetch`, la página o el endpoint al que plugNmeet está a punto de conectarse. |
| `server_key` | string | Solo con `type: "mcp"`. La clave del servidor en `mcp_servers`, por ejemplo `acme-docs`. |
| `allowed_urls` | string[] | Solo con `type: "knowledge"`. Los prefijos de `allowed_knowledge_urls` de la sala. |

### Salida

Devuelva el objeto JSON con los campos que desee establecer:

| Campo | Descripción |
| --- | --- |
| `error` | Un valor no vacío rechaza la solicitud. El mensaje se devuelve a quien la realizó. |
| `action` | `allow_fetch` para que plugNmeet descargue la URL por su cuenta, o `provide_content` para devolver su propio `content`. |
| `target_url` | URL de reemplazo que se usará en lugar de `url`. |
| `content` | Cuerpo de la respuesta, usado con `provide_content`. |
| `mime_type` | Tipo de medio de `content`. |

Con `action: "provide_content"` en una URL de conocimiento, plugNmeet usa su `content` y no realiza ninguna solicitud saliente, lo que resulta útil cuando la página está detrás de su propia pasarela o debe generarse a partir de un índice local.

:::warning Deniegue con `error`, no con una salida mal formada
Una salida mal formada o vacía **no** es un rechazo. El ejecutor la registra, la descarta y deja pasar la carga útil anterior, por lo que la solicitud se trata como aprobada. Solo un `error` no vacío, una ejecución fallida o un tiempo de espera agotado rechazan la solicitud.
:::

### Etapas

#### `validate`

Se ejecuta **al crear la sala**, después de que las comprobaciones integradas de funciones y de URL hayan aceptado la solicitud, y antes de que la sala comience. El hook solo ve las entradas que superaron esas comprobaciones:

*   una vez por cada prefijo aceptado en `allowed_knowledge_urls` del Agente de IA, y
*   una vez por cada clave de `mcp_servers` del Agente de IA y del chat de texto con IA.

Un prefijo mal formado, que no use HTTPS, que no sea público o que no use el puerto 443 lo rechaza primero la comprobación integrada, así que el hook nunca lo ve. Los prefijos de conocimiento solo se comprueban cuando el Agente de IA está habilitado, y las claves MCP cuando lo está el Agente de IA o el chat de texto con IA. Las salas de grupos (breakout) se omiten, porque heredan endpoints que la sala principal ya tenía verificados.

Devuelva un `error` para rechazar la entrada. En ese caso plugNmeet cancela la creación de la sala y devuelve su mensaje a quien la solicitó.

#### `fetch`

Se ejecuta en lugares distintos según `type`:

*   **`knowledge`**: solo cuando no hay caché. Una página servida desde la caché de conocimiento nunca llega al hook.
*   **`mcp`**: antes de contactar con el servidor durante el descubrimiento y el precalentamiento, y antes de cada llamada a una herramienta, de modo que un resultado en caché no omita el hook.

Devuelva un `error` para rechazar la solicitud.

### Lo que el hook no puede modificar

El hook funciona por encima de las protecciones integradas y no puede debilitarlas:

*   Un destino MCP sigue teniendo que ser un endpoint HTTPS público en el puerto 443 y, en el caso de MCP, solo se respeta `target_url`: `content` se ignora.
*   Un `target_url` reescrito para una página de conocimiento se vuelve a comprobar con las reglas integradas de HTTPS y de host público no interno, pero no está fijado al puerto 443 ni tiene que coincidir con la lista de permitidos de la sala.
*   Los límites de ejecución siguen aplicándose a cualquier descarga que haga plugNmeet: una lista de tipos de contenido permitidos, un cuerpo de 256 KiB, un máximo de 12.000 caracteres entregados al modelo y un máximo de 3 redirecciones.

:::info Reglas de los prefijos de conocimiento
Una sala puede declarar como máximo 20 prefijos, de hasta 1024 caracteres cada uno. Cada prefijo debe usar HTTPS en el puerto 443, sin credenciales, fragmento, dirección IP literal ni host interno, y cualquier cadena de consulta debe coincidir exactamente.
:::

Para conocer las reglas subyacentes, consulte [Seguridad del conocimiento externo y de los servidores MCP externos](/docs/ai-agent/developer-guide#seguridad-del-conocimiento-externo-y-de-los-servidores-mcp-externos) y el [Resumen de seguridad](/docs/security-overview#5-servicios-de-ia-y-privacidad-de-datos-plataforma-de-análisis).

---

## Hooks del grabador (`recorder`)

Los hooks del grabador se utilizan para gestionar el archivo de grabación a medida que avanza por la tubería de transcodificación. Esto es esencial para despliegues multiservidor donde la grabación y la transcodificación pueden ocurrir en máquinas diferentes.

**Configuración en `recorder/config.yaml`:**
```yaml
hooks:
  # 'pool_size' controla cuántas tuberías de hooks pueden ejecutarse en paralelo. Predeterminado: 1.
  # 'hook_timeout' establece un tiempo de espera para toda la cadena de hooks. Predeterminado: 1h.
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

### Carga de datos (payload): `RecordingHookData`

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

### Etapas del hook

#### 1. `post_recording`
*   **Cuándo**: Se ejecuta en el nodo **GRABADOR** después de que se guarda el archivo de grabación en bruto.
*   **Propósito**: Subir el archivo en bruto a una ubicación accesible por red (p. ej., S3, NFS) para que pueda ser accedido por un transcodificador.
*   **Entrada**: El campo `input_path` contiene la ruta al archivo de grabación en bruto en el disco local del grabador.
*   **Tarea del Script**: Subir el archivo y devolver el JSON con `output_path` establecido a la nueva ubicación/identificador de red del archivo (p. ej., una clave de S3). **Después de una subida exitosa, debe eliminar el archivo fuente local de `input_path`.**

#### 2. `pre_transcoding`
*   **Cuándo**: Se ejecuta en el nodo **TRANSCODIFICADOR** antes de que comience el procesamiento con `ffmpeg`.
*   **Propósito**: Descargar el archivo en bruto desde una ubicación de red a una ruta local temporal en el transcodificador.
*   **Entrada**: El campo `input_path` contiene la ubicación/identificador de red del archivo en bruto (este es el `output_path` de la etapa `post_recording`).
*   **Tarea del Script**: Descargar el archivo y devolver el JSON con `output_path` establecido a la nueva **ruta local** en el disco del transcodificador.

#### 3. `post_transcoding`
*   **Cuándo**: Se ejecuta en el nodo **TRANSCODIFICADOR** después de que `ffmpeg` crea con éxito el archivo `.mp4` final.
*   **Propósito**: Subir el archivo procesado final al almacenamiento permanente y realizar la limpieza.
*   **Entrada**: El campo `input_path` contiene la ruta al archivo `.mp4` final y transcodificado en el disco local del nodo transcodificador.
*   **Tarea del Script**: Subir el archivo final y devolver el JSON, actualizando opcionalmente `output_path`. Los campos `should_cleanup` y `source_for_cleanup` se pueden usar para gestionar la limpieza de archivos temporales de la etapa `pre_transcoding`.

---

## Ejemplo: Script de larga duración en Node.js

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
