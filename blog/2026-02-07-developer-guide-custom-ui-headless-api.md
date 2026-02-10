---
title: "A Developer's Guide to Building a Custom Video Chat UI with Plug-N-Meet's Headless API"
slug: developer-guide-custom-video-chat-ui-headless-api
authors: [jibon]
tags: [developer, tutorial, how-to, api, headless, getClientFiles, white-label, customization, javascript]
---

You've successfully integrated Plug-N-Meet into your application. You can create rooms, generate join tokens, and embed the client in an `<iframe>`. It's fast and it works. But now you want to go deeper. You want to break out of the `<iframe>` box and build a truly seamless user experience where the video client feels like a native part of your application's UI.

This is where Plug-N-Meet's "headless" integration mode comes in.

This guide is for developers who want to move beyond basic embedding. We'll show you how to use the powerful `getClientFiles` API to render the Plug-N-Meet client directly into your own page's DOM, giving you ultimate control over layout, branding, and the user experience.

<!--truncate-->

---

### The Problem with Iframes

An `<iframe>` is a simple way to embed content, but it's essentially a "window" into another website. This creates several limitations for developers aiming for a professional, deeply integrated product:

*   **The Black Box:** The `<iframe>` creates a hard boundary between your parent application and the video client, making communication between them complex and limited.
*   **Layout Restrictions:** You are stuck with the layout provided by the `src` URL. You can't easily place your own application's components (like a custom header or a sidebar with user data) "inside" the video experience.
*   **Styling and Branding:** While you can pass some branding parameters, your ability to deeply customize the look and feel is limited.

### The Solution: Headless Integration with `getClientFiles`

The `getClientFiles` API is the key to unlocking a truly "headless" video integration. Instead of providing you with a URL to embed, it gives you a list of the exact CSS and JavaScript assets you need to render the client yourself.

This approach transforms Plug-N-Meet from a separate application into a UI component library that you control.

#### The Three-Step Workflow

The logic is simple and can be implemented in any backend language (PHP, Node.js, Python, etc.).

1.  **Your Backend Fetches the Asset List:** Your server makes a secure, server-to-server API call to the `/auth/getClientFiles` endpoint.
2.  **Plug-N-Meet Responds with a JSON Object:** This object contains two arrays: `css` and `js`, listing the filenames of all the necessary assets.
3.  **Your Template Renders the `<link>` and `<script>` Tags:** Your server-side templating engine loops through these arrays and dynamically injects the required tags into the HTML page that will be sent to the user's browser.

---

### A Practical Example (Node.js with EJS)

Let's walk through a simplified example using Node.js and the EJS templating engine.

#### Step 1: The Backend Route (e.g., in `server.js`)

This route will handle the API calls and render the final page.

```javascript
import express from 'express';
import { PlugNmeet } from 'plugnmeet-sdk-js';

const app = express();
app.set('view engine', 'ejs');

// Your Plug-N-Meet credentials (use environment variables in production)
const API_KEY = 'plugnmeet';
const API_SECRET = 'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6';
const PLUGNMEET_URL = 'https://demo.plugnmeet.com';

const pnm = new PlugNmeet(PLUGNMEET_URL, API_KEY, API_SECRET);

app.get('/meeting', async (req, res) => {
  try {
    // 1. Get the asset files
    const clientFiles = await pnm.getClientFiles();

    // 2. Create a room and generate a join token for the user
    const room = {
      room_id: 'my-custom-room',
      metadata: {
        room_title: 'My Custom UI Room',
        room_features: {
          allow_webcams: true,
          // ... other features
        },
      },
    };
    await pnm.createRoom(room);

    const joinToken = await pnm.getJoinToken({
      room_id: 'my-custom-room',
      user_info: {
        name: 'John Doe',
        user_id: 'user-123',
      },
    });

    // 3. Define dynamic branding options
    const designOptions = {
      primary_color: '#004D90',
      secondary_color: '#24AEF7',
      custom_logo: 'https://my-app.com/logo.png',
    };

    // 4. Render the view, passing all the necessary data
    res.render('meeting', {
      plugnmeetUrl: PLUGNMEET_URL,
      clientFiles: clientFiles.res,
      accessToken: joinToken.res.token,
      designOptions: JSON.stringify(designOptions),
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error setting up meeting');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
```

#### Step 2: The Frontend Template (e.g., in `views/meeting.ejs`)

This EJS file will take the data from the backend and construct the HTML page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Custom Video App</title>

  <!-- Dynamically inject CSS files -->
  <% clientFiles.css.forEach(file => { %>
    <link href="<%= plugnmeetUrl %>/assets/css/<%= file %>" rel="stylesheet" />
  <% }); %>

  <!-- Inject essential window variables BEFORE loading scripts -->
  <script type="text/javascript">
    window.plugNmeetConfig = {
      // Required: The URL of your plugNmeet server.
      serverUrl: "<%= plugnmeetUrl %>",

      // Required: The public path to the assets directory.
      staticAssetsPath: "<%= plugnmeetUrl %>/assets",
      
      // Required: Pass the design customization options.
      designCustomization: <%- designOptions %>,

      // Optional: Add any other custom configurations.
      // See: https://github.com/mynaparrot/plugNmeet-client/blob/main/src/assets/config_sample.js
      enableSimulcast: true,
      enableDynacast: true
    };
  </script>
</head>
<body>
  <!-- Your Custom Application UI -->
  <header style="background: #0A1929; color: white; padding: 1rem;">
    <h1>My Application Header</h1>
  </header>

  <div style="display: flex;">
    <!-- The Plug-N-Meet client will mount itself in this div -->
    <div id="plugNmeet-app" style="flex-grow: 1; height: 90vh;"></div>

    <!-- Your Custom Application Sidebar -->
    <aside style="width: 250px; background: #f4f4f4; padding: 1rem;">
      <h2>Meeting Notes</h2>
      <p>This sidebar is part of my parent application!</p>
    </aside>
  </div>

  <!-- Dynamically inject JavaScript files -->
  <% clientFiles.js.forEach(file => { %>
    <% if (file.startsWith('main-module.')) { %>
      <script src="<%= plugnmeetUrl %>/assets/js/<%= file %>" type="module"></script>
    <% } else { %>
      <script src="<%= plugnmeetUrl %>/assets/js/<%= file %>" defer></script>
    <% } %>
  <% }); %>

  <script>
    // Add the access token to the URL without reloading the page
    const url = new URL(window.location);
    url.searchParams.set('access_token', '<%= accessToken %>');
    window.history.pushState({}, '', url);
  </script>
</body>
</html>
```

---

### The Result: A Truly Integrated Experience

When a user visits `/meeting`, they will see your application's custom header and sidebar, with the Plug-N-Meet video client rendered seamlessly in the middle. The client will be styled with the dynamic brand colors you passed from the backend.

You have successfully broken out of the `<iframe>` box.

From here, the possibilities are endless. You can use your own application's state to interact with the meeting, build custom layouts that respond to meeting events, and create a user experience that is completely unique to your product.

This is the true power of a headless, API-first platform. It gives you the building blocks not just to add a feature, but to build a deeply integrated and professional product.

---

**Ready to build your custom UI?**

*   **Review the full [`getClientFiles` API Documentation](/docs/api/get-client-files).**
*   **Explore our [Design Customization Guide](/docs/developer-guide/design-customisation) for more branding options.**
*   **Check out our official [JavaScript SDK](https://github.com/mynaparrot/plugNmeet-sdk-js) to simplify your backend code.**
