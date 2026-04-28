---
description: Una guía para personalizar el diseño de la interfaz de plugNmeet utilizando opciones de configuración y CSS externo.
title: Personalización del Diseño | Guía del Desarrollador de plugNmeet
keywords: [css, diseño, personalización, branding, marca blanca, css personalizado, diseño de plugnmeet, temas]
sidebar_position: 3
sidebar_label: Personalización del Diseño
---

# Personalización del Diseño

Esta guía explica cómo personalizar la apariencia de la interfaz de usuario de plugNmeet. Puede lograr una experiencia de marca blanca totalmente personalizada utilizando una combinación de parámetros de configuración simples y su propio CSS personalizado.

## Método 1: Uso de `config.js` para Personalización Básica

Para una personalización rápida y sencilla, puede editar el archivo `config.js` ubicado en el directorio `dist/assets/` del paquete `plugNmeet-client`.

En la última versión, toda la configuración se maneja a través del objeto `window.plugNmeetConfig`. Puede definir sus personalizaciones de diseño dentro de la propiedad `designCustomization` de este objeto.

> **Nota:** Para la compatibilidad con versiones anteriores, la variable heredada `window.DESIGN_CUSTOMIZATION` todavía es compatible, pero recomendamos usar la nueva estructura `window.plugNmeetConfig` para todas las nuevas implementaciones.

### Ejemplo de Configuración

A continuación se muestra cómo configurar su `config.js` con personalizaciones de diseño:

```javascript
window.plugNmeetConfig = {
  // ... otras opciones de configuración ...

  // Personalización del diseño en formato de objeto JS o JSON.
  designCustomization: {
    primary_color: "#004D90",
    primary_btn_bg_color: "#00a1f28c",
    primary_btn_text_color: "#ffffff",
    secondary_color: "#24AEF7",
    secondary_btn_bg_color: "#ffffff8c",
    secondary_btn_text_color: "#0c131a",
    header_bg_color: "#45b3ec",
    footer_bg_color: "#45b3ec",
    footer_icon_bg_color: "#004d90",
    footer_icon_color: "#ffffff",
    side_panel_bg_color: "#04a2f3",
    background_color: "#0b7db4",
    background_image: "https://midominio.com/custom_bg.png",
    custom_css_url: "https://midominio.com/plugNmeet_desing.css",
    custom_logo: "https://midominio.com/logo.png"
  }
};
```

:::tip[Personalización Dinámica]
También puede pasar este mismo objeto JSON como un parámetro de URL llamado `custom_design` al unirse a una sala. Esto le permite aplicar diferentes diseños para diferentes usuarios o reuniones de forma dinámica.
:::

### Parámetros de Diseño

> **Importante:** Todos los recursos externos (`background_image`, `custom_css_url`, `custom_logo`, etc.) deben servirse a través de **HTTPS**. El uso de URLs no HTTPS (`http://`) causará errores de contenido mixto en el navegador e impedirá que los recursos se carguen.

:::info[Limitación del Modo Oscuro]
La mayoría de los **parámetros relacionados con el color** (p. ej., `primary_color`, `header_bg_color`) actualmente se aplican solo al **Tema Claro**. Si un usuario cambia al Modo Oscuro, estos colores personalizados serán anulados por los estilos predeterminados del tema oscuro.

Sin embargo, los activos globales como `custom_logo`, `background_image` y `background_color` seguirán aplicándose. Para un control total sobre el estilo del Modo Oscuro, recomendamos usar la opción `custom_css_url` para proporcionar sus propias anulaciones de CSS avanzadas.
:::

| Campo                      | Descripción                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary_color`            | El color principal de la marca para botones, iconos y otros elementos destacados clave. (Formato hexadecimal)                                                              |
| `primary_btn_bg_color`     | El color de fondo para los botones primarios. (Formato hexadecimal)                                                                                          |
| `primary_btn_text_color`   | El color del texto para los botones primarios. (Formato hexadecimal)                                                                                                |
| `secondary_color`          | El color secundario de la marca, a menudo utilizado para acentos. (Formato hexadecimal)                                                                                 |
| `secondary_btn_bg_color`   | El color de fondo para los botones secundarios. (Formato hexadecimal)                                                                                        |
| `secondary_btn_text_color` | El color del texto para los botones secundarios. (Formato hexadecimal)                                                                                              |
| `header_bg_color`          | El color de fondo para la barra de encabezado principal. (Formato hexadecimal)                                                                                      |
| `footer_bg_color`          | El color de fondo para el pie de página principal y la barra de control. (Formato hexadecimal)                                                                          |
| `footer_icon_bg_color`     | El color de fondo para los iconos en el pie de página. (Formato hexadecimal)                                                                                  |
| `footer_icon_color`        | El color de los iconos en el pie de página. (Formato hexadecimal)                                                                                              |
| `side_panel_bg_color`      | El color de fondo para el panel lateral (p. ej., chat, participantes, etc.). (Formato hexadecimal)                                                            |
| `background_color`         | Establece el color de fondo predeterminado de la sala de reuniones principal. (Formato hexadecimal)                                                                        |
| `background_image`         | Establece una imagen de fondo personalizada para la sala. Debe ser una URL HTTPS directa. Si se establece `background_image`, se ignorará `background_color`. |
| `custom_css_url`           | Una URL a su propio archivo CSS personalizado para una personalización avanzada y granular. Debe ser una URL HTTPS directa. Consulte el Método 2 a continuación.                    |
| `custom_logo`              | Una URL para el logotipo de su marca, que se muestra en la pantalla de bienvenida y en el encabezado. **Debe ser una URL HTTPS directa.**                                 |

---

## Método 2: Personalización Avanzada a través de CSS

Para un control completo sobre cada elemento de la interfaz, incluidas las fuentes, el espaciado, la ocultación de elementos o el ajuste fino del Modo Oscuro, puede proporcionar una `custom_css_url` en su configuración.

Este archivo CSS se carga después de todas las hojas de estilo predeterminadas, lo que da prioridad a sus reglas.

### Cómo Identificar Clases

Dado que la aplicación se desarrolla activamente, los nombres y las estructuras de las clases pueden evolucionar. Recomendamos usar las herramientas de desarrollador de su navegador para identificar los selectores correctos para los elementos que desea modificar.

1.  **Haga clic con el botón derecho** en el elemento que desea personalizar.
2.  Seleccione **Inspeccionar** (o "Inspeccionar elemento").
3.  Identifique el nombre de la clase o el ID en el panel de Elementos.
4.  Escriba su regla CSS dirigida a ese selector.

**Ejemplo:**

Si quisiera cambiar el tamaño de la fuente del título del encabezado, inspeccionaría el elemento del título, encontraría su clase (p. ej., `.header-title`) y agregaría lo siguiente a su archivo CSS personalizado:

```css
.header-title {
    font-size: 24px !important;
}
```

> **Nota:** Puede ser necesario usar `!important` para anular ciertos estilos predeterminados, especialmente las clases de utilidad.
