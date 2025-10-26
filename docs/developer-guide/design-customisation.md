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

For quick and easy branding, you can edit the `config.js` file located in the `dist/assets/` directory of the `plugNmeet-client` package. Inside this file, you will find a `window.DESIGN_CUSTOMIZATION` variable.

This variable accepts a JSON string with various parameters to control the primary visual elements of the interface. You can also pass this same JSON object as a URL parameter named `custom_design` when joining a room.

```javascript
window.DESIGN_CUSTOMIZATION = `{
  "primary_color": "#004D90",
  "secondary_color": "#24AEF7",
  "background_color": "#F5F5F5",
  "background_image": "https://mydomain.com/custom_bg.png",
  "header_bg_color": "#FFFFFF",
  "footer_bg_color": "#FFFFFF",
  "left_side_bg_color": "#FFFFFF",
  "right_side_bg_color": "#FAFAFA",
  "custom_css_url": "https://mydomain.com/plugnmeet_design.css",
  "custom_logo": "https://mydomain.com/logo.png"
}`;
```

### Design Parameters

> **Important:** All external resources (`background_image`, `custom_css_url`, `custom_logo`, etc.) must be served over **HTTPS**. Using non-HTTPS (`http://`) URLs will cause mixed-content errors in the browser and prevent the resources from loading.

| Field               | Description                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary_color`       | The primary brand color for buttons, icons, and other key highlights. (Hex format)                                                                                    |
| `secondary_color`     | The secondary brand color, often used for accents. (Hex format)                                                                                                       |
| `background_color`    | Sets the default background color of the main meeting room.                                                                                                            |
| `background_image`    | Sets a custom background image for the room. This must be a direct HTTPS URL. If `background_image` is set, `background_color` will be ignored.                         |
| `header_bg_color`     | The background color for the main header bar.                                                                                                                          |
| `footer_bg_color`     | The background color for the main footer and control bar.                                                                                                              |
| `left_side_bg_color`  | The background color for the left-side panel (e.g., participants list).                                                                                                |
| `right_side_bg_color` | The background color for the right-side panel (e.g., chat).                                                                                                            |
| `custom_css_url`      | A URL to your own custom CSS file for advanced, granular customization. This must be a direct HTTPS URL. See Method 2 below.                                            |
| `custom_logo`         | A URL for your brand's logo, displayed on the welcome screen and in the header. **Must be a direct HTTPS URL.**                                                          |

---

## Method 2: Using Custom CSS for Advanced Customization

For complete control over every element in the interface, you can provide a `custom_css_url` in the configuration. This CSS file will be loaded after all default stylesheets, allowing you to override any class.

Below are some common examples of how to customize various UI components.

### Global Color Classes

These classes are used throughout the application and are a good starting point for applying your brand colors.

**Primary Color & Background**
```css
.primaryColor, .text-primaryColor {
    color: #004D90;
}
.bg-primaryColor {
    background: #004D90;
}
```
![brand-color1-min.png](/img/design-customisation/brand-color1-min.png)

**Secondary Color & Background**
```css
.secondaryColor, .text-secondaryColor {
    color: #24AEF7;
}
.bg-secondaryColor {
    background: #24AEF7;
}
```
![brand-color2-min.png](/img/design-customisation/brand-color2-min.png)

### Header Elements

You can change the header's background, logo, title, and decorative shapes.

**Header Background Color**
```css
header#main-header {
  background-color: azure;
}
```
![HeaderBG.png](/img/design-customisation/HeaderBG.png)

**Header Logo**
```css
.header-logo {
    background-image: url(./assets/imgs/your-logo.png) !important;
}
```
![HeaderLOGO.png](/img/design-customisation/HeaderLOGO.png)

**Header Title**
```css
h2.header-title {
    color: blue;
    font-size: 20px;
}
```
![HeaderTitle.png](/img/design-customisation/HeaderTitle.png)

### Participants Panel

Customize the participants panel, including its background, width, and the style of the text.

**Panel Wrapper**
```css
.participants-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```
![participants-min.png](/img/design-customisation/participants-min.png)

**Panel Headline**
```css
.participants-wrapper .top p {
    font-size: 20px;
    color: grey;
}
```
![participants-headline-min.png](/img/design-customisation/participants-headline-min.png)

### Messages Panel

Customize the chat and messages panel.

```css
.MessageModule-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```
![messages.png](/img/design-customisation/messages.png)

### Key Pages

**Welcome/Join Page**

Change the style of the initial join modal.
```css
#startupJoinModal {
    background-color: aqua;
}
```
![startup-page.png](/img/design-customisation/startup-page.png)

**Error Page**

Customize the background of the error page with an image or a solid color.
```css
.error-app-bg {
    background: aliceblue !important;
}
```
![error-page.png](/img/design-customisation/error-page.png)

> **Pro Tip:** To find the class for any element you want to change, simply use the "Inspect Element" tool in your web browser to identify its CSS selector.
