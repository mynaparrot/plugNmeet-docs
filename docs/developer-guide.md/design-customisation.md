---
sidebar_position: 1
---

# Design Customisation

## Global Changes

Brand Color 1
```
.brand-color1 {
    color: #004D90;
}
```
![An image from the static](/img/participants/brand-color1-min.png)

Brand Color 2
```
.brand-color2 {
    color: #24AEF7;
}
```
![An image from the static](/img/participants/brand-color2-min.png)


## Header

For your need, You can change header Background, Logo, Color etc.

To change **Header Background Color** use this class: see screenshot below.
```
header#main-header {
  background-color: azure;
}
```
![An image from the static](/img/HeaderBG.png)


<div style={{marginBottom: 100 + 'px'}}></div>


Change **Logo** using this class name:
```
.header-logo {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
```
![An image from the static](/img/HeaderLOGO.png)


<div style={{marginBottom: 100 + 'px'}}></div>


Change **Header Start and End Shape** using these class: 
```
.header-before-start {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
.header-before-end {
    background-image: url(./assets/imgs/app-banner.jpg) !important;
}
```
![An image from the static](/img/HeaderShape.png)


<div style={{marginBottom: 100 + 'px'}}></div>


Change **Header Title** using these class: 
```
h2.header-title {
    color: blue;
    font-size: 20px;
}
```
![An image from the static](/img/HeaderTitle.png)



## Participants

You can change **participants Background, width, padding** etc. Using this class name: 
```
.participants-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```
![An image from the static](/img/participants/participants-min.png)


You can change **participants Headline** using this class name: 
```
.participants-wrapper .top p {
    font-size: 20px;
    color: grey;
}
```
![An image from the static](/img/participants/participants-headline-min.png)


You can change **participant name** using this class name: 
```
.all-participants-wrap p {
    font-size: 18px;
    color: grey;
}
```
![An image from the static](/img/participants/participants-name-min.png)


You can change **participant thumb** using this class name: 
```
.all-participants-wrap .thumb {
    font-size: 14px;
    color: grey;
    background-color: antiquewhite;
}
```
![An image from the static](/img/participants/participants-thumb-min.png)



## Messages

You can change **Messages Background, width, padding** etc. Using this class name: 
```
.MessageModule-wrapper {
    background: #fff;
    width: 300px;
    padding: 14px;
}
```
![An image from the static](/img/messages/messages.png)


You can change **Welcome Messages** using this class name: 
```
.all-MessageModule-wrap .message-item .system p.message-content {
    background-color: grey;
    color: aqua;
    font-size: 15px;
}
```
![An image from the static](/img/messages/message-welcome.png)