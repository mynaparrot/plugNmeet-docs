---
description: A guide to customizing the plugNmeet interface design using configuration options and external CSS.
title: Design Customization | plugNmeet Developer Guide
keywords: [css, design, customization, branding, white-label, custom css, plugnmeet design, themes]
sidebar_position: 3
sidebar_label: Design Customization
---

# Design Customization

This guide explains how to customize the look and feel of the plugNmeet user interface. You can achieve a fully branded, white-label experience by using a combination of simple configuration parameters and your own custom CSS.

## Method 1: Using `config.js` for Basic Customization

For quick and easy branding, you can edit the `config.js` file located in the `dist/assets/` directory of the `plugNmeet-client` package.

In the latest version, all configuration is handled through the `window.plugNmeetConfig` object. You can define your design customizations within the `designCustomization` property of this object.

> **Note:** For backward compatibility, the legacy `window.DESIGN_CUSTOMIZATION` variable is still supported, but we recommend using the new `window.plugNmeetConfig` structure for all new deployments.

### Configuration Example

Here is how to set up your `config.js` with design customizations:

```javascript
window.plugNmeetConfig = {
  // ... other config options ...

  // Design customization in JS Object or JSON format.
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
    background_image: "https://mydomain.com/custom_bg.png",
    custom_css_url: "https://mydomain.com/plugNmeet_desing.css",
    custom_logo: "https://mydomain.com/logo.png"
  }
};
```

:::tip[Dynamic Customization]
You can also pass this same JSON object as a URL parameter named `custom_design` when joining a room. This allows you to apply different designs for different users or meetings dynamically.
:::

### Design Parameters

> **Important:** All external resources (`background_image`, `custom_css_url`, `custom_logo`, etc.) must be served over **HTTPS**. Using non-HTTPS (`http://`) URLs will cause mixed-content errors in the browser and prevent the resources from loading.

:::info[Dark Mode Limitation]
Most **color-related parameters** (e.g., `primary_color`, `header_bg_color`) currently apply only to the **Light Theme**. If a user switches to Dark Mode, these custom colors will be overridden by the default dark theme styles.

However, global assets like `custom_logo`, `background_image`, and `background_color` will still apply. For full control over Dark Mode styling, we recommend using the `custom_css_url` option to provide your own advanced CSS overrides.
:::

| Field                      | Description                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary_color`            | The primary brand color for buttons, icons, and other key highlights. (Hex format)                                                              |
| `primary_btn_bg_color`     | The background color for primary buttons. (Hex format)                                                                                          |
| `primary_btn_text_color`   | The text color for primary buttons. (Hex format)                                                                                                |
| `secondary_color`          | The secondary brand color, often used for accents. (Hex format)                                                                                 |
| `secondary_btn_bg_color`   | The background color for secondary buttons. (Hex format)                                                                                        |
| `secondary_btn_text_color` | The text color for secondary buttons. (Hex format)                                                                                              |
| `header_bg_color`          | The background color for the main header bar. (Hex format)                                                                                      |
| `footer_bg_color`          | The background color for the main footer and control bar. (Hex format)                                                                          |
| `footer_icon_bg_color`     | The background color for the icons in the footer. (Hex format)                                                                                  |
| `footer_icon_color`        | The color of the icons in the footer. (Hex format)                                                                                              |
| `side_panel_bg_color`      | The background color for the side panel (e.g., chat, participants etc). (Hex format)                                                            |
| `background_color`         | Sets the default background color of the main meeting room. (Hex format)                                                                        |
| `background_image`         | Sets a custom background image for the room. This must be a direct HTTPS URL. If `background_image` is set, `background_color` will be ignored. |
| `custom_css_url`           | A URL to your own custom CSS file for advanced, granular customization. This must be a direct HTTPS URL. See Method 2 below.                    |
| `custom_logo`              | A URL for your brand's logo, displayed on the welcome screen and in the header. **Must be a direct HTTPS URL.**                                 |

---

## Method 2: Advanced Customization via CSS

For complete control over every element in the interface—including fonts, spacing, hiding elements, or fine-tuning Dark Mode—you can provide a `custom_css_url` in your configuration.

This CSS file is loaded after all default stylesheets, giving your rules priority.

### How to Identify Classes

Since the application is actively developed, class names and structures may evolve. We recommend using your browser's developer tools to identify the correct selectors for the elements you wish to modify.

1.  **Right-click** on the element you want to customize.
2.  Select **Inspect** (or "Inspect Element").
3.  Identify the class name or ID in the Elements panel.
4.  Write your CSS rule targeting that selector.

**Example:**

If you wanted to change the font size of the header title, you would inspect the title element, find its class (e.g., `.header-title`), and add the following to your custom CSS file:

```css
.header-title {
    font-size: 24px !important;
}
```

> **Note:** Using `!important` may be necessary to override certain default styles, especially utility classes.
