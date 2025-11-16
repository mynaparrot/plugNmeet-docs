---
title: "From Iframe to Integration: A Developer's Guide to White-Labeling Plug-N-Meet"
slug: deep-integration-white-label-guide
authors: [jibon]
tags: [developer, tutorial, video-conferencing, white-label, branding, customization, getClientFiles, deep-integration]
---

In our popular guide, **["How to Build a Video Conferencing App in Under an Hour,"](/blog/build-video-conferencing-app-in-under-an-hour)** we showed you how to get a fully functional video meeting running by simply embedding a URL in an `<iframe>`. It’s a fantastic way to get started, but to build a truly professional and seamless product, you need to go deeper.

An `<iframe>` is a box. It isolates the meeting client from your main application, creating a visible separation that can feel clunky and limit your branding potential.

This guide is the next step in your developer journey. We will show you how to break out of the box and create a deeply integrated, fully white-labeled video conferencing experience using Plug-N-Meet's powerful "headless" integration and design customization APIs.

<!--truncate-->

---

## Step 1: Eliminate the Iframe with the `getClientFiles` API

The key to a seamless user experience is to make the video client feel like a native part of your application. The `getClientFiles` API is designed for exactly this purpose. Instead of embedding a pre-built page, this API gives you the power to render the Plug-N-Meet client directly within your own page's HTML structure.

**The Workflow:**

1.  **Your Backend Fetches the Assets:** Your server makes a call to the `/getClientFiles` endpoint.
2.  **The API Responds:** Plug-N-Meet returns a simple JSON object containing two arrays: one with the required CSS filenames and one with the JavaScript filenames.
3.  **You Dynamically Build the Page:** Your server-side code (PHP, Node.js, Python, etc.) iterates through these arrays and dynamically generates the necessary `<link>` and `<script>` tags in your HTML.

Here is a simplified example using PHP to illustrate the logic. This approach can be easily adapted to any server-side language.

```php
<?php
// Your Plug-N-Meet server details
$plugnmeet_server_url = 'https://plugnmeet.example.com';
$api_key = 'plugnmeet';
$api_secret = 'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6';

// Define design options for this session
$designOptions = [
    'primary_color' => '#004D90',
    'secondary_color' => '#24AEF7',
    'custom_logo' => 'https://mydomain.com/logo.png',
    'custom_css_url' => 'https://mydomain.com/my-custom-styles.css'
];

// 1. Call the getClientFiles API (using a helper function or SDK)
// For this example, we'll use a sample response.
$clientFilesResponse = [
    'status' => true,
    'css' => ['styles.8f34.css', 'vendor.9c3a.css'],
    'js' => ['runtime.3e4a.js', 'vendor.b12c.js', 'main-module.a4f1.js'],
];

$assets_path = $plugnmeet_server_url . '/assets';

// This is the access token you generated for the user
$access_token = '...your_generated_access_token...';
?>

<!doctype html>
<html lang="en">
<head>
    <title>My Custom Video App</title>

    <!-- 2. Dynamically generate CSS <link> tags -->
    <?php foreach ($clientFilesResponse['css'] as $css_file): ?>
        <link href="<?php echo $assets_path . '/css/' . $css_file; ?>" rel="stylesheet" />
    <?php endforeach; ?>

    <!-- 3. Inject essential window variables BEFORE loading scripts -->
    <script type="text/javascript">
        window.PLUG_N_MEET_SERVER_URL = "<?php echo $plugnmeet_server_url; ?>";
        window.STATIC_ASSETS_PATH = "<?php echo $assets_path; ?>";
        // The client will automatically look for the `access_token` in the URL query string.
        // Ensure your page URL is something like: https://your-domain.com/conference?access_token=...

        // Inject design customization as a JSON string
        window.DESIGN_CUSTOMIZATION = `<?php echo json_encode($designOptions); ?>`;
    </script>
</head>
<body>
    <!-- 4. The client will mount itself in this div -->
    <div id="plugNmeet-app"></div>

    <!-- 5. Dynamically generate JS <script> tags -->
    <?php foreach ($clientFilesResponse['js'] as $js_file): ?>
        <?php if (str_starts_with($js_file, 'main-module.')): ?>
            <script src="<?php echo $assets_path . '/js/' . $js_file; ?>" type="module"></script>
        <?php else: ?>
            <script src="<?php echo $assets_path . '/js/' . $js_file; ?>" defer="defer"></script>
        <?php endif; ?>
    <?php endforeach; ?>
</body>
</html>
```

By following this pattern, you've achieved a "headless" integration. The video conference now loads as a native component of your page, giving you complete control over the surrounding layout and user experience.

> For a complete walkthrough, see the **[getClientFiles API Documentation](/docs/api/get-client-files)**.

---

## Step 2: Full Branding with Client-Side Configuration

Now that the client is running natively on your page, it's time to make it look like *your* brand. Plug-N-Meet offers two powerful layers of design customization.

### Method A: Quick Branding with `window.DESIGN_CUSTOMIZATION`

The most flexible way to apply branding in a headless integration is to set the `window.DESIGN_CUSTOMIZATION` variable directly in your HTML page. This gives you dynamic, per-session control over the user interface.

As shown in the full example in Step 1, you can define these options in a PHP array, convert it to JSON, and inject it directly into the `<head>` of your page. This allows you to dynamically change the branding for different users or tenants.

### Method B: Total Control with Custom CSS

For ultimate control, the `custom_css_url` parameter is your best friend. This allows you to load your own stylesheet *after* all the default Plug-N-Meet styles, giving you the power to override any element.

Want to change the font of the header title or the background of the participants panel? Simply find the element's CSS class using your browser's inspector and add your own rules to your custom CSS file.

**Example `my-custom-styles.css`:**
```css
/* Change the main header background and border */
header#main-header {
    background-color: #0A1929;
    border-bottom: 1px solid #004D90;
}

/* Customize the header title font */
h2.header-title {
    font-family: 'Poppins', sans-serif;
    color: #E1EFFF;
    font-weight: 600;
}

/* Style the main control bar buttons */
.control-bar-wrapper .btn {
    background-color: #0E2A47;
    border-radius: 12px;
}
```

> For a full list of parameters and CSS examples, check out our **[Design Customization Guide](/docs/developer-guide/design-customisation)**.

---

## Conclusion: You Own the Experience

By combining the `getClientFiles` API with robust design customization, you elevate your application from a simple integration to a professional, white-labeled platform. You are no longer just embedding a tool; you are delivering a seamless experience that reinforces your brand and gives your users confidence.

This is the power of an API-first platform. It provides the building blocks not just to create a feature, but to build a product that is truly your own.

---
**Ready to get started?**

*   **Follow the [Installation Guide](/docs/installation)**
*   **Explore the [API Documentation](/docs/api/intro)**
