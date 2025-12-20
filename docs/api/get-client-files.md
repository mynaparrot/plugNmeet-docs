---
title: Get Client Files API | plugNmeet API Reference
description: API endpoint documentation for fetching the plugNmeet client-side application files. This allows for self-hosting the front-end assets.
keywords: [api, get client files, client assets, front-end, self-host client, sdk, endpoint]
sidebar_position: 40
sidebar_label: Get Client Files
---

# Get Client Files

Endpoint: `/getClientFiles`

The Plug-N-Meet client is a powerful, standalone React application. While you can embed it using an iframe, we **strongly recommend** a more seamless approach using this API endpoint.

The `getClientFiles` API provides you with a list of all the necessary CSS and JavaScript files to render the Plug-N-Meet interface directly within your own web page. This method offers deeper integration, better performance, and avoids the complexities of iframes, allowing you to create a truly native-feeling video conferencing experience for your users.

It also gives you complete branding freedom. Since this method isn't tied to a specific domain, you can host the client on any SSL-enabled domain or subdomain, ensuring a seamless brand experience for your users.

### How to Use

1.  Call the `/getClientFiles` endpoint from your server-side application.
2.  The API will respond with two arrays: `css` and `js`, containing the URLs to the required asset files.
3.  Construct the full URL for each filename. The API returns plain filenames (e.g., `app.js`). You must prepend your Plug-N-Meet server's asset path and the correct subdirectory (`/js/` for JavaScript files, `/css/` for CSS files). For example: `https://plugnmeet.example.com/assets/js/app.js`.
4.  In the HTML page where you want to display the conference, dynamically generate `<link>` and `<script>` tags using the full URLs you just created.
5.  Ensure you have a `div` with the id `plugNmeet-app` in your `<body>`, as this is where the React application will mount itself.

This process ensures that your application always loads the correct and most up-to-date client assets.

For implementation examples, refer to the [conference.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/conference.php) file or our plugins for [Moodle](https://github.com/mynaparrot/moodle-mod_plugnmeet/blob/main/conference.php), [WordPress](https://github.com/mynaparrot/plugNmeet-WordPress/blob/main/plugnmeet/public/partials/plugnmeet-public-display-client.php), and [Joomla](https://github.com/mynaparrot/plugNmeet-Joomla/blob/main/components/com_plugnmeet/tmpl/room/conference.php).


**Example Request:**

```json
{}
```

## Response

| Field  | Type    | Position | Description                                 |
| :----- | :------ | :------- | :------------------------------------------ |
| status | boolean | root     | Indicates whether the request was successful |
| msg    | string  | root     | Response message                            |
| css    | array   | root     | An array of required CSS filenames.         |
| js     | array   | root     | An array of required JavaScript filenames.  |

### Example HTML Structure

Here is a simplified example using PHP to illustrate the logic. This approach can be easily adapted to any server-side language (like Node.js, Python, or Ruby) to dynamically generate the required HTML.

```php
<?php
// 1. Define your server URL.
$plugnmeet_server_url = 'https://plugnmeet.example.com';

// 2. Call the /getClientFiles API and get the response.
// This is a sample response for demonstration.
$api_response = [
    'status' => true,
    'css' => ['styles.8f34.css', 'vendor.9c3a.css'],
    'js' => ['runtime.3e4a.js', 'vendor.b12c.js', 'app.5d6e.js', 'main-module.a4f1.js'],
];

// 3. Construct the base path for your assets.
$assets_path = $plugnmeet_server_url . '/assets';

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>plugNmeet</title>

    <!-- 4. Dynamically generate <link> tags for CSS files. -->
    <?php foreach ($api_response['css'] as $css_file): ?>
        <link href="<?php echo $assets_path . '/css/' . $css_file ?>" rel="stylesheet" />
    <?php endforeach; ?>

    <!--
    5. Inject required window variables before loading scripts.
       These are essential for the client to initialize correctly.
    -->
    <script type="text/javascript">
        window.plugNmeetConfig = {
            // Required: The URL of your plugNmeet server.
            serverUrl: "<?php echo $plugnmeet_server_url ?>",

            // Required: The public path to the assets directory.
            staticAssetsPath: "<?php echo $assets_path ?>",

            // Optional: Add any other custom configurations.
            // See: https://github.com/mynaparrot/plugNmeet-client/blob/main/src/assets/config_sample.js
            enableSimulcast: true,
            enableDynacast: true
        };
    </script>
</head>
<body>
    <!-- This is the root element for the Plug-N-Meet client -->
    <div id="plugNmeet-app"></div>

    <!-- 6. Dynamically generate <script> tags for JS files. -->
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
