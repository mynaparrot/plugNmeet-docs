---
title: "Guía para desarrolladores: cómo crear una interfaz de videochat personalizada con la API headless de Plug-N-Meet"
slug: developer-guide-custom-video-chat-ui-headless-api
authors: [jibon]
tags: [desarrollador, tutorial, guía, api, headless, getClientFiles, marca-blanca, personalización, javascript]
---

Ya ha logrado integrar Plug-N-Meet en su aplicación. Puede crear salas, generar tokens de acceso e incrustar el cliente en un `<iframe>`. Es rápido y funciona. Pero ahora quiere ir más allá. Quiere romper los límites del `<iframe>` y crear una experiencia de usuario realmente fluida, donde el cliente de video se sienta como una parte nativa de la interfaz de su aplicación.

Aquí es donde entra en juego el modo de integración «headless» de Plug-N-Meet.

Esta guía está dirigida a desarrolladores que desean superar la incrustación básica. Le mostraremos cómo utilizar la potente API `getClientFiles` para renderizar el cliente de Plug-N-Meet directamente en el DOM de su propia página, obteniendo así el control total sobre el diseño, la imagen de marca y la experiencia de usuario.

<!--truncate-->

---

### El problema de los iframes

Un `<iframe>` es una forma sencilla de incrustar contenido, pero en esencia es una «ventana» hacia otro sitio web. Esto conlleva varias limitaciones para quienes buscan un producto profesional y profundamente integrado:

*   **La caja negra:** El `<iframe>` crea una barrera rígida entre su aplicación principal y el cliente de video, lo que hace que la comunicación entre ambos sea compleja y limitada.
*   **Restricciones de diseño:** Usted queda sujeto al diseño que ofrece la URL de origen. No puede colocar con facilidad los componentes de su propia aplicación (como un encabezado personalizado o una barra lateral con datos del usuario) «dentro» de la experiencia de video.
*   **Estilo e imagen de marca:** Aunque puede pasar algunos parámetros de personalización, su capacidad para adaptar a fondo el aspecto visual es limitada.

### La solución: integración headless con `getClientFiles`

La API `getClientFiles` es la clave para lograr una integración de video verdaderamente «headless». En lugar de proporcionarle una URL para incrustar, le entrega la lista exacta de los recursos CSS y JavaScript que necesita para renderizar el cliente usted mismo.

Con este enfoque, Plug-N-Meet deja de ser una aplicación independiente y se convierte en una biblioteca de componentes de interfaz que usted controla.

#### El flujo de trabajo en tres pasos

La lógica es sencilla y puede implementarse en cualquier lenguaje de backend (PHP, Node.js, Python, etc.).

1.  **Su backend obtiene la lista de recursos:** Su servidor realiza una llamada segura de servidor a servidor al endpoint `/auth/getClientFiles`.
2.  **Plug-N-Meet responde con un objeto JSON:** Este objeto contiene dos arreglos, `css` y `js`, con los nombres de todos los recursos necesarios.
3.  **Su plantilla genera las etiquetas `<link>` y `<script>`:** Su motor de plantillas del lado del servidor recorre estos arreglos e inyecta dinámicamente las etiquetas requeridas en la página HTML que recibirá el navegador del usuario.

---

### Un ejemplo práctico (Node.js con EJS)

Veamos un ejemplo simplificado con Node.js y el motor de plantillas EJS.

#### Paso 1: La ruta del backend (p. ej., en `server.js`)

Esta ruta se encargará de las llamadas a la API y de renderizar la página final.

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

#### Paso 2: La plantilla del frontend (p. ej., en `views/meeting.ejs`)

Este archivo EJS tomará los datos del backend y construirá la página HTML.

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

### El resultado: una experiencia verdaderamente integrada

Cuando un usuario visite `/meeting`, verá el encabezado y la barra lateral personalizados de su aplicación, con el cliente de video de Plug-N-Meet renderizado de forma fluida en el centro. El cliente se mostrará con los colores de marca dinámicos que usted definió desde el backend.

Habrá logrado así salir de la «caja» del `<iframe>`.

A partir de aquí, las posibilidades son infinitas. Puede utilizar el estado de su propia aplicación para interactuar con la reunión, crear diseños personalizados que respondan a los eventos de la reunión y ofrecer una experiencia de usuario totalmente única para su producto.

Este es el verdadero poder de una plataforma headless y API-first. Le ofrece los componentes necesarios no solo para añadir una función, sino para construir un producto profundamente integrado y profesional.

---
**¿Listo para crear su interfaz personalizada?**

*   **Consulte la [documentación completa de la API `getClientFiles`](/docs/api/get-client-files).**
*   **Explore nuestra [guía de personalización de diseño](/docs/developer-guide/design-customisation) para más opciones de marca.**
*   **Descubra nuestro [SDK oficial para JavaScript](https://github.com/mynaparrot/plugNmeet-sdk-js) para simplificar su código de backend.**
