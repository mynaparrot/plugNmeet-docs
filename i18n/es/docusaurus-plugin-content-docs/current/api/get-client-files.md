---
title: API para Obtener Archivos de Cliente | Referencia de la API de plugNmeet
description: Documentación del endpoint de API para obtener los archivos de la aplicación cliente de plugNmeet. Esto permite alojar los recursos del front-end en un servidor propio.
keywords: [api, obtener archivos de cliente, recursos de cliente, front-end, cliente autoalojado, sdk, endpoint]
sidebar_position: 40
sidebar_label: Obtener Archivos de Cliente
---

# Obtener Archivos de Cliente

Endpoint: `/getClientFiles`

El cliente de Plug-N-Meet es una potente aplicación React independiente. Aunque puede incrustarla usando un iframe, **recomendamos encarecidamente** utilizar este endpoint de API para una integración más fluida y sencilla.

La API `getClientFiles` le proporciona una lista de todos los archivos CSS y JavaScript necesarios para renderizar la interfaz de Plug-N-Meet directamente en su propia página web. Este método ofrece una integración más profunda, un mejor rendimiento y evita las complejidades de los iframes, permitiéndole crear una experiencia de videoconferencia verdaderamente nativa para sus usuarios.

Además, le brinda total libertad para su marca. Dado que este método no está vinculado a un dominio específico, puede alojar el cliente en cualquier dominio o subdominio habilitado para SSL, garantizando una experiencia de marca coherente para sus usuarios.

### Cómo Utilizarlo

1.  Llame al endpoint `/getClientFiles` desde la aplicación de su servidor.
2.  La API devolverá dos arrays: `css` y `js`, que contienen las URL de los archivos de recursos requeridos.
3.  Construya la URL completa para cada nombre de archivo. La API devuelve nombres de archivo simples (p. ej., `app.js`). Usted debe anteponer la ruta de los recursos de su servidor Plug-N-Meet y el subdirectorio correcto (`/js/` para archivos JavaScript, `/css/` para archivos CSS). Por ejemplo: `https://plugnmeet.ejemplo.com/assets/js/app.js`.
4.  En la página HTML donde desea mostrar la conferencia, genere dinámicamente las etiquetas `<link>` y `<script>` utilizando las URLs completas que acaba de crear.
5.  Asegúrese de tener un `div` con el id `plugNmeet-app` en su `<body>`, ya que aquí es donde se montará la aplicación de React.

Este proceso garantiza que su aplicación siempre cargue los recursos de cliente correctos y más actualizados.

Para ver ejemplos de implementación, consulte el archivo [conference.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/conference.php) o nuestros plugins para [Moodle](https://github.com/mynaparrot/moodle-mod_plugnmeet/blob/main/conference.php), [WordPress](https://github.com/mynaparrot/plugNmeet-WordPress/blob/main/plugnmeet/public/partials/plugnmeet-public-display-client.php) y [Joomla](https://github.com/mynaparrot/plugNmeet-Joomla/blob/main/components/com_plugnmeet/tmpl/room/conference.php).


**Ejemplo de Solicitud:**

```json
{}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción                                 |
| :----- | :------ | :------- | :------------------------------------------ |
| status | boolean | raíz     | Indica si la solicitud fue exitosa. |
| msg    | string  | raíz     | Mensaje de respuesta.                            |
| status_code | string | raíz     | [Código de estado](https://github.com/mynaparrot/plugnmeet-protocol/blob/main/proto_files/plugnmeet_common_api.proto#L10) de la respuesta. |
| css    | array   | raíz     | Un array de nombres de archivo CSS requeridos.         |
| js     | array   | raíz     | Un array de nombres de archivo JavaScript requeridos.  |

### Ejemplo de Estructura HTML

A continuación, se muestra un ejemplo simplificado usando PHP para ilustrar la lógica. Este enfoque se puede adaptar fácilmente a cualquier lenguaje del lado del servidor (como Node.js, Python o Ruby) para generar dinámicamente el HTML requerido.

```php
<?php
// 1. Defina la URL de su servidor.
$plugnmeet_server_url = 'https://plugnmeet.ejemplo.com';

// 2. Llame a la API /getClientFiles y obtenga la respuesta.
// Esta es una respuesta de ejemplo para fines de demostración.
$api_response = [
    'status' => true,
    'css' => ['styles.8f34.css', 'vendor.9c3a.css'],
    'js' => ['runtime.3e4a.js', 'vendor.b12c.js', 'app.5d6e.js', 'main-module.a4f1.js'],
];

// 3. Construya la ruta base para sus activos.
$assets_path = $plugnmeet_server_url . '/assets';

?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>plugNmeet</title>

    <!-- 4. Genere dinámicamente las etiquetas <link> para los archivos CSS. -->
    <?php foreach ($api_response['css'] as $css_file): ?>
        <link href="<?php echo $assets_path . '/css/' . $css_file ?>" rel="stylesheet" />
    <?php endforeach; ?>

    <!--
    5. Inyecte las variables de ventana requeridas antes de cargar los scripts.
       Estas son esenciales para que el cliente se inicialice correctamente.
    -->
    <script type="text/javascript">
        window.plugNmeetConfig = {
            // Requerido: La URL de su servidor plugNmeet.
            serverUrl: "<?php echo $plugnmeet_server_url ?>",

            // Requerido: La ruta pública al directorio de activos.
            staticAssetsPath: "<?php echo $assets_path ?>",

            // Opcional: Agregue cualquier otra configuración personalizada.
            // Ver: https://github.com/mynaparrot/plugNmeet-client/blob/main/src/assets/config_sample.js
            enableSimulcast: true,
            enableDynacast: true
        };
    </script>
</head>
<body>
    <!-- Este es el elemento raíz para el cliente de Plug-N-Meet -->
    <div id="plugNmeet-app"></div>

    <!-- 6. Genere dinámicamente las etiquetas <script> para los archivos JS. -->
    <?php foreach ($api_response['js'] as $js_file): ?>
        <?php if (str_starts_with($js_file, 'main-module.')): ?>
            <script src="<?php echo $assets_path . '/js/' . $js_file ?>" type="module"></script>
        <?php else: ?>
            <script src="<?php echo $assets_path . '/js/' . $js_file ?>" defer="defer"></script>
        <?php endif; ?>
    <?php endforeach; ?>
</body>
</html>
```
