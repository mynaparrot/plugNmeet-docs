---
description: PlugNmeet interface design customization using external CSS
sidebar_position: 3
---

# Design Customisation

## Using config.js

Open the `config.js` file located in `dist/assets/config.js` of the `plugNmeet-client`. You will find a field called `window.DESIGN_CUSTOMIZATION`, which accepts a JSON value like this:

```js
window.DESIGN_CUSTOMIZATION = `{
  "primary_color": "#004D90",
  "secondary_color": "#24AEF7",
  "background_color": "#0b7db4",
  "background_image": "https:\/\/mydomain.com\/custom_bg.png",
  "header_bg_color": "#45b3ec",
  "footer_bg_color": "#45b3ec",
  "left_side_bg_color": "#04a2f3",
  "right_side_bg_color": "#04a2f3",
  "custom_css_url": "https:\/\/mydomain.com\/plugNmeet_desing.css"
}`;
```

You can customize any or all of the above options. Alternatively, you can pass this JSON format via a URL parameter using `custom_design`.

## Design Parameters

| Field               | Description                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| primary_color       | The primary color code in hex format.                                                                                                                                  |
| secondary_color     | The secondary color code in hex format.                                                                                                                                |
| background_color    | Sets the default background color of the room.                                                                                                                         |
| background_image    | Adds a custom background image. The link must be a direct HTTPS URL. If `background_image` is set, `background_color` will be ignored.                                 |
| header_bg_color     | Header background color.                                                                                                                                               |
| footer_bg_color     | Footer background color.                                                                                                                                               |
| left_side_bg_color  | Background color for the left panel.                                                                                                                                   |
| right_side_bg_color | Background color for the right panel.                                                                                                                                  |
| custom_css_url      | URL to your custom CSS file for advanced customization. The link must be a direct HTTPS URL.                                                                           |

## Global Changes Using CSS

**Primary Color**

```css
.primaryColor {
    color: #004D90;
}
.text-primaryColor {
    color: #004D90;
}
```

![brand-color1-min.png](/img/design-customisation/brand-color1-min.png)

**Secondary Color**

```css
.secondaryColor {
    color: #24AEF7;
}
.text-secondaryColor {
    color: #24AEF7;
}
```

![brand-color2-min.png](/img/design-customisation/brand-color2-min.png)

**Primary Background**

```css
.bg-primaryColor {
    background: #004D90;
}
```

![bg-brand1.png](/img/design-customisation/bg-brand1.png)

**Secondary Background Color**

```css
.bg-secondaryColor {
    background: #24AEF7;
}
```

![bg-brand2.png](/img/design-customisation/bg-brand2.png)

## Header

You can change the header background, logo, color, and more.

**Header Background Color**

Use this class to change the header background color:

```css
header#main-header {
  background-color: azure;
}
```

![HeaderBG.png](/img/design-customisation/HeaderBG.png)

**Logo**

Change the logo using this class:

```css
.header-logo {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
```

![HeaderLOGO.png](/img/design-customisation/HeaderLOGO.png)

**Header Start and End Shape**

Use these classes to change the header's start and end shapes:

```css
.header-before-start {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
.header-before-end {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
```

![HeaderShape.png](/img/design-customisation/HeaderShape.png)

**Header Title**

Change the header title style using this class:

```css
h2.header-title {
    color: blue;
    font-size: 20px;
}
```

![HeaderTitle.png](/img/design-customisation/HeaderTitle.png)

## Participants

You can customize the participants section, including background, width, and padding:

```css
.participants-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```

![participants-min.png](/img/design-customisation/participants-min.png)

**Participants Headline**

```css
.participants-wrapper .top p {
    font-size: 20px;
    color: grey;
}
```

![participants-headline-min.png](/img/design-customisation/participants-headline-min.png)

**Participant Name**

```css
.all-participants-wrap p {
    font-size: 18px;
    color: grey;
}
```

![participants-name-min.png](/img/design-customisation/participants-name-min.png)

**Participant Thumbnail**

```css
.all-participants-wrap .thumb {
    font-size: 14px;
    color: grey;
    background-color: antiquewhite;
}
```

![participants-thumb-min.png](/img/design-customisation/participants-thumb-min.png)

## Messages

Customize the messages section, including background, width, and padding:

```css
.MessageModule-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```

![messages.png](/img/design-customisation/messages.png)

## Start-Up Page

Change the style of the start-up page using this class:

```css
#startupJoinModal {
    background-color: aqua;
}
```

![startup-page.png](/img/design-customisation/startup-page.png)

## Error Page

Customize the error page background:

```css
.error-app-bg {
    background-image: url("./assets/imgs/header-before2.png") !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
```

Or use a solid color:

```css
.error-app-bg {
    background: aliceblue !important;
}
```

![error-page.png](/img/design-customisation/error-page.png)
