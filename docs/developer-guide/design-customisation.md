---
description: plugNmeet interface design customisation using external CSS
sidebar_position: 3
---

# Design Customisation

## Global Changes

Brand Color 1

```
.brand-color1 {
    color: #004D90;
}
```

![brand-color1-min.png](/img/design-customisation/brand-color1-min.png)

Brand Color 2

```
.brand-color2 {
    color: #24AEF7;
}
```

![brand-color2-min.png](/img/design-customisation/brand-color2-min.png)


Brand Background Color 1

```
.bg-brandColor1 {
    background: #004D90;
}
```

![bg-brand1.png](/img/design-customisation/bg-brand1.png)


Brand Background Color 2

```
.bg-brandColor2 {
    background: #24AEF7;
}
```

![bg-brand1.png](/img/design-customisation/bg-brand2.png)


## Header

For your need, You can change header Background, Logo, Color etc.

To change **Header Background Color** style use this class: see screenshot below.

```
header#main-header {
  background-color: azure;
}
```

![HeaderBG.png](/img/design-customisation/HeaderBG.png)

<div style={{marginBottom: 100 + 'px'}}></div>

Change **Logo** using this class name:

```
.header-logo {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
```

![HeaderLOGO.png](/img/design-customisation/HeaderLOGO.png)

<div style={{marginBottom: 100 + 'px'}}></div>

Change **Header Start and End Shape** style using these class:

```
.header-before-start {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
.header-before-end {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
```

![HeaderShape.png](/img/design-customisation/HeaderShape.png)

<div style={{marginBottom: 100 + 'px'}}></div>

Change **Header Title** style using these class:

```
h2.header-title {
    color: blue;
    font-size: 20px;
}
```

![HeaderTitle.png](/img/design-customisation/HeaderTitle.png)

## Participants

You can change **participants Background, width, padding** etc. Style Using this class name:

```
.participants-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```

![participants-min.png](/img/design-customisation/participants-min.png)

You can change **participants Headline** style using this class name:

```
.participants-wrapper .top p {
    font-size: 20px;
    color: grey;
}
```

![participants-headline-min.png](/img/design-customisation/participants-headline-min.png)

You can change **participant name** style using this class name:

```
.all-participants-wrap p {
    font-size: 18px;
    color: grey;
}
```

![participants-name-min.png](/img/design-customisation/participants-name-min.png)

You can change **participant thumb** style using this class name:

```
.all-participants-wrap .thumb {
    font-size: 14px;
    color: grey;
    background-color: antiquewhite;
}
```

![participants-thumb-min.png](/img/design-customisation/participants-thumb-min.png)

## Messages

You can change **Messages Background, width, padding** etc. Style Using this class name:

```
.MessageModule-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```

![messages.png](/img/design-customisation/messages.png)


## Start-Up Page

You can change **Start-Up page** style using this class name:

```
#startupJoinModal {
    background-color: aqua;
}
```

![startup-page.png](/img/design-customisation/startup-page.png)


## Error Page

You can change **Error Page** style using this class name:

```
.error-app-bg {
    background-image: url("./assets/imgs/header-before2.png") !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
```
Or 
```
.error-app-bg {
    background: aliceblue !important;
}
```

![error-page.png](/img/design-customisation/error-page.png)