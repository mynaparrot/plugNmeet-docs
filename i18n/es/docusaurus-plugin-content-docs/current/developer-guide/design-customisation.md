---
description: Una guía para personalizar el diseño de la interfaz de plugNmeet utilizando opciones de configuración y CSS externo.
title: Personalización del Diseño | Guía del Desarrollador de plugNmeet
keywords: [css, diseño, personalización, branding, marca blanca, css personalizado, diseño de plugnmeet, temas]
sidebar_position: 3
sidebar_label: Personalización del Diseño
---

# Personalización del Diseño

Esta guía explica cómo personalizar la apariencia de la interfaz de usuario de plugNmeet. Puede lograr una experiencia de marca blanca integral mediante una combinación de parámetros de configuración sencillos y su propio CSS personalizado.

## Método 1: Uso de `config.js` para Personalización Básica

Para una personalización de marca rápida y sencilla, puede editar el archivo `config.js` ubicado en el directorio `dist/assets/` del paquete `plugNmeet-client`.

En la última versión, toda la configuración se gestiona a través del objeto `window.plugNmeetConfig`. Puede definir sus personalizaciones de diseño dentro de la propiedad `designCustomization` de este objeto.

> **Nota:** Para mantener la compatibilidad con versiones anteriores, la variable heredada `window.DESIGN_CUSTOMIZATION` aún es compatible, pero recomendamos utilizar la nueva estructura `window.plugNmeetConfig` para todas las nuevas implementaciones.

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
    background_image: "https://midominio.com/fondo_personalizado.png",
    custom_css_url: "https://midominio.com/diseno_plugNmeet.css",
    custom_logo: "https://midominio.com/logo.png"
  }
};
```

:::tip[Personalización Dinámica]
También puede enviar este mismo objeto JSON como un parámetro de URL llamado `custom_design` al unirse a una sala. Esto le permite aplicar diferentes diseños para distintos usuarios o reuniones de forma dinámica.
:::

### Parámetros de Diseño

> **Importante:** Todos los recursos externos (`background_image`, `custom_css_url`, `custom_logo`, etc.) deben servirse a través de **HTTPS**. El uso de URLs no HTTPS (`http://`) provocará errores de contenido mixto en el navegador e impedirá que los recursos se carguen.

:::info[Limitación del Modo Oscuro]
Actualmente, la mayoría de los **parámetros de color** (p. ej., `primary_color`, `header_bg_color`) solo se aplican al **Tema Claro**. Si un usuario cambia al Modo Oscuro, estos colores personalizados serán reemplazados por los estilos predeterminados del tema oscuro.

Sin embargo, los recursos globales como `custom_logo`, `background_image` y `background_color` seguirán aplicándose. Para un control total sobre el estilo del Modo Oscuro, recomendamos usar la opción `custom_css_url` para aplicar sus propias personalizaciones avanzadas mediante CSS.
:::

| Campo                      | Descripción                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary_color`            | El color principal de la marca para botones, iconos y otros elementos clave. (Formato hexadecimal)                                                              |
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
| `custom_css_url`           | Una URL a su propio archivo CSS para una personalización avanzada y granular. Debe ser una URL HTTPS directa. Consulte el Método 2 a continuación.                    |
| `custom_logo`              | Una URL para el logotipo de su marca, que se muestra en la pantalla de bienvenida y en el encabezado. **Debe ser una URL HTTPS directa.**                                 |

---

## Método 2: Personalización Avanzada a través de CSS

Para un control total sobre cada elemento de la interfaz —incluyendo fuentes, espaciado, ocultación de elementos o el ajuste fino del Modo Oscuro— puede utilizar la opción `custom_css_url` en su configuración.

Este archivo CSS se carga después de todas las hojas de estilo predeterminadas, lo que otorga prioridad a sus reglas.

### Cómo Identificar Clases

Dado que la aplicación está en desarrollo activo, los nombres y las estructuras de las clases pueden cambiar con el tiempo. Recomendamos usar las herramientas de desarrollador de su navegador para identificar los selectores correctos para los elementos que desea modificar.

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
