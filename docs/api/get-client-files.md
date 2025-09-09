---
sidebar_position: 40
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

Here is a simplified example using PHP that demonstrates how to construct the full asset paths correctly.

```php
<?php
// The base URL of your Plug-N-Meet server
$plugnmeet_server_url = 'https://plugnmeet.example.com';

// A sample API response containing the asset filenames
$api_response = [
    'css' => ['styles.css', 'vendor.css'],
    'js' => ['runtime.js', 'vendor.js', 'app.js'],
];

$assets_path = $plugnmeet_server_url . '/assets';
?>

<html>
<head>
    <!-- ... your other head elements ... -->

    <!-- Dynamically insert CSS links -->
    <?php foreach ($api_response['css'] as $css_file): ?>
        <link rel="stylesheet" href="<?= $assets_path . '/css/' . $css_file ?>">
    <?php endforeach; ?>
</head>
<body>
    <!-- This is the root element for the Plug-N-Meet client -->
    <div id="plugNmeet-app"></div>

    <!-- Dynamically insert JS scripts -->
    <?php foreach ($api_response['js'] as $js_file): ?>
        <script src="<?= $assets_path . '/js/' . $js_file ?>" defer="defer"></script>
    <?php endforeach; ?>
</body>
</html>
```
