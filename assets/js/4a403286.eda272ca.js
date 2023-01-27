"use strict";(self.webpackChunkplugnmeet_documentation=self.webpackChunkplugnmeet_documentation||[]).push([[883],{3905:(t,e,l)=>{l.d(e,{Zo:()=>g,kt:()=>u});var a=l(7294);function n(t,e,l){return e in t?Object.defineProperty(t,e,{value:l,enumerable:!0,configurable:!0,writable:!0}):t[e]=l,t}function o(t,e){var l=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),l.push.apply(l,a)}return l}function i(t){for(var e=1;e<arguments.length;e++){var l=null!=arguments[e]?arguments[e]:{};e%2?o(Object(l),!0).forEach((function(e){n(t,e,l[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(l)):o(Object(l)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(l,e))}))}return t}function r(t,e){if(null==t)return{};var l,a,n=function(t,e){if(null==t)return{};var l,a,n={},o=Object.keys(t);for(a=0;a<o.length;a++)l=o[a],e.indexOf(l)>=0||(n[l]=t[l]);return n}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(a=0;a<o.length;a++)l=o[a],e.indexOf(l)>=0||Object.prototype.propertyIsEnumerable.call(t,l)&&(n[l]=t[l])}return n}var m=a.createContext({}),p=function(t){var e=a.useContext(m),l=e;return t&&(l="function"==typeof t?t(e):i(i({},e),t)),l},g=function(t){var e=p(t.components);return a.createElement(m.Provider,{value:e},t.children)},s="mdxType",d={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},c=a.forwardRef((function(t,e){var l=t.components,n=t.mdxType,o=t.originalType,m=t.parentName,g=r(t,["components","mdxType","originalType","parentName"]),s=p(l),c=n,u=s["".concat(m,".").concat(c)]||s[c]||d[c]||o;return l?a.createElement(u,i(i({ref:e},g),{},{components:l})):a.createElement(u,i({ref:e},g))}));function u(t,e){var l=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var o=l.length,i=new Array(o);i[0]=c;var r={};for(var m in e)hasOwnProperty.call(e,m)&&(r[m]=e[m]);r.originalType=t,r[s]="string"==typeof t?t:n,i[1]=r;for(var p=2;p<o;p++)i[p]=l[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,l)}c.displayName="MDXCreateElement"},9774:(t,e,l)=>{l.r(e),l.d(e,{assets:()=>m,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>r,toc:()=>p});var a=l(7462),n=(l(7294),l(3905));const o={description:"plugNmeet user guide for Learning Tools Interoperability (LTI)",sidebar_position:7},i="LTI",r={unversionedId:"user-guide/lti",id:"user-guide/lti",title:"LTI",description:"plugNmeet user guide for Learning Tools Interoperability (LTI)",source:"@site/docs/user-guide/lti.md",sourceDirName:"user-guide",slug:"/user-guide/lti",permalink:"/docs/user-guide/lti",draft:!1,editUrl:"https://github.com/mynaparrot/plugNmeet-docs/docs/user-guide/lti.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{description:"plugNmeet user guide for Learning Tools Interoperability (LTI)",sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"Joomla Integration",permalink:"/docs/user-guide/joomla-integration"},next:{title:"Introduction",permalink:"/docs/developer-guide/intro"}},m={},p=[{value:"Intro",id:"intro",level:2},{value:"plugNmeet API info",id:"plugnmeet-api-info",level:2},{value:"Custom parameters (optional)",id:"custom-parameters-optional",level:2},{value:"UI view",id:"ui-view",level:2},{value:"Canvas LMS Example",id:"canvas-lms-example",level:2},{value:"Chamilo LMS Example",id:"chamilo-lms-example",level:2},{value:"Moodle LMS Example",id:"moodle-lms-example",level:2}],g={toc:p};function s(t){let{components:e,...o}=t;return(0,n.kt)("wrapper",(0,a.Z)({},g,o,{components:e,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"lti"},"LTI"),(0,n.kt)("h2",{id:"intro"},"Intro"),(0,n.kt)("p",null,"plugNmeet support LTI ",(0,n.kt)("strong",{parentName:"p"},"v1.0/1.1")," as Provider. Users can join/manage sessions and download recordings from any LTI supported platform without changing any code."),(0,n.kt)("h2",{id:"plugnmeet-api-info"},"plugNmeet API info"),(0,n.kt)("p",null,"Following information will require:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"Launch URL: https://your-plug-n-meet.com/lti/v1\nConsumer key: plug-n-meet API Key\nShared secret: plug-n-meet API Secret\n")),(0,n.kt)("p",null,"For demo you can try following information:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"Launch URL: https://demo.plugnmeet.com/lti/v1\nConsumer key: plugnmeet\nShared secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6\n")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Note:")," Allowing ",(0,n.kt)("inlineCode",{parentName:"p"},"launcher's name")," is recommended; otherwise, the user will see an empty name."),(0,n.kt)("h2",{id:"custom-parameters-optional"},"Custom parameters (optional)"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"Field"),(0,n.kt)("th",{parentName:"tr",align:null},"Type"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"room_duration"),(0,n.kt)("td",{parentName:"tr",align:null},"Number"),(0,n.kt)("td",{parentName:"tr",align:"left"},"If you want to set duration for the session. The should be in minutes. Default 0 which mean no limit.")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_polls"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_shared_note_pad"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_breakout_room"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_recording"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_rtmp"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_view_other_webcams"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"allow_view_other_users_list"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: true")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"mute_on_start"),(0,n.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Default: false")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"primary_color"),(0,n.kt)("td",{parentName:"tr",align:null},"String"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Interface primary color in hex code. Example: #004D90")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"secondary_color"),(0,n.kt)("td",{parentName:"tr",align:null},"String"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Interface secondary color in hex code. Example: #004D90")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"background_color"),(0,n.kt)("td",{parentName:"tr",align:null},"String"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Interface background color in hex code. Example: #004D90")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"custom_logo"),(0,n.kt)("td",{parentName:"tr",align:null},"String"),(0,n.kt)("td",{parentName:"tr",align:"left"},"This should be direct https link. Example: ",(0,n.kt)("a",{parentName:"td",href:"https://mydomain.com/logo.png"},"https://mydomain.com/logo.png"))))),(0,n.kt)("h2",{id:"ui-view"},"UI view"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Moderator/Admin view")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"lti1.png",src:l(3030).Z,width:"2146",height:"694"})),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"lti2.png",src:l(3660).Z,width:"2188",height:"728"})),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Student/Attendee view")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"lti3.png",src:l(2644).Z,width:"2370",height:"664"})),(0,n.kt)("h2",{id:"canvas-lms-example"},"Canvas LMS Example"),(0,n.kt)("p",null,"Here we take Canvas LMS as an example to show you how it works."),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"Go to the Settings section and select ",(0,n.kt)("strong",{parentName:"li"},'"Apps"'),".")),(0,n.kt)("img",{src:"/img/lti/lti-add-apps.png",alt:"/img/moderator/attendee-poll-min.png",loading:"lazy"}),(0,n.kt)("ol",{start:2},(0,n.kt)("li",{parentName:"ol"},"Then click on ",(0,n.kt)("strong",{parentName:"li"},'"View App Configurations"'),".")),(0,n.kt)("img",{src:"/img/lti/lti-app-config.png",alt:"/img/moderator/attendee-poll-min.png",loading:"lazy"}),(0,n.kt)("ol",{start:3},(0,n.kt)("li",{parentName:"ol"},"Select ",(0,n.kt)("strong",{parentName:"li"},'"+App"'),".")),(0,n.kt)("img",{src:"/img/lti/lti-click-add.png",alt:"/img/moderator/attendee-poll-min.png",loading:"lazy"}),(0,n.kt)("ol",{start:4},(0,n.kt)("li",{parentName:"ol"},"Fill in the API information.\nYou can use following demo api information for testing:")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"Name: plugNmeet\nLaunch URL: https://demo.plugnmeet.com/lti/v1\nConsumer key: plugnmeet\nShared secret: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6\n")),(0,n.kt)("img",{src:"/img/lti/lti-canvas-1.png",loading:"lazy"}),(0,n.kt)("ol",{start:5},(0,n.kt)("li",{parentName:"ol"},"Click ",(0,n.kt)("strong",{parentName:"li"},'"Submit"')," to save the changes.")),(0,n.kt)("img",{src:"/img/lti/lti-click-submit.png",alt:"/img/moderator/attendee-poll-min.png",loading:"lazy"}),(0,n.kt)("ol",{start:6},(0,n.kt)("li",{parentName:"ol"},"A ",(0,n.kt)("strong",{parentName:"li"},"notification")," will appear that the plugNmeet app has been installed.\nYou are able to join plugNmeet meetings via LTI now.")),(0,n.kt)("img",{src:"/img/lti/lti-sucess.png",alt:"/img/moderator/attendee-poll-min.png",loading:"lazy"}),(0,n.kt)("h2",{id:"chamilo-lms-example"},"Chamilo LMS Example"),(0,n.kt)("p",null,"To install plugNmeet, the following steps must be performed:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},'Go to the "Portal\u201d section and select "Plugins".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-1.png",loading:"lazy"}),(0,n.kt)("ol",{start:2},(0,n.kt)("li",{parentName:"ol"},'Search for "IMS/LTI" and select its checkbox and then click on "Enable the selected plugins".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-2.png",loading:"lazy"}),(0,n.kt)("ol",{start:3},(0,n.kt)("li",{parentName:"ol"},'Then, the "Plugins" page will load again and in the "IMS/LTI" section you will select "Configure".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-3.png",loading:"lazy"}),(0,n.kt)("ol",{start:4},(0,n.kt)("li",{parentName:"ol"},'Select "Yes" and click on "Save".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-4.png",loading:"lazy"}),(0,n.kt)("ol",{start:5},(0,n.kt)("li",{parentName:"ol"},'Now that "IMS/LTI" is enabled, you must go to "My Courses".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-5.png",loading:"lazy"}),(0,n.kt)("ol",{start:6},(0,n.kt)("li",{parentName:"ol"},"You choose the course where you want to add plugNmeet and click the pencil icon to edit the course.")),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-6.png",loading:"lazy"}),(0,n.kt)("ol",{start:7},(0,n.kt)("li",{parentName:"ol"},'Go to the "IMS/LTI" section and click on "Configure external tools".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-7.png",loading:"lazy"}),(0,n.kt)("ol",{start:8},(0,n.kt)("li",{parentName:"ol"},'You fill in the following data and then select "Add external tool".')),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-8.png",loading:"lazy"}),(0,n.kt)("ol",{start:9},(0,n.kt)("li",{parentName:"ol"},"You select the title of your course.")),(0,n.kt)("img",{src:"/img/lti/lti-chamilo-9.png",loading:"lazy"}),(0,n.kt)("ol",{start:10},(0,n.kt)("li",{parentName:"ol"},'You go to the "Interaction" section, and you can view "plugNmeet" to use it.',(0,n.kt)("img",{src:"/img/lti/lti-chamilo-10.png",loading:"lazy"}))),(0,n.kt)("h2",{id:"moodle-lms-example"},"Moodle LMS Example"),(0,n.kt)("p",null,"If your Moodle provider doesn\u2019t support to install custom plugins, then you can use LTI tools to join the plugNmeet meeting. Here is how you can do it. "),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},'Go to "Site administration".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-1.png",loading:"lazy"}),(0,n.kt)("ol",{start:2},(0,n.kt)("li",{parentName:"ol"},'Click on "Plugins".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-2.png",loading:"lazy"}),(0,n.kt)("ol",{start:3},(0,n.kt)("li",{parentName:"ol"},'Scroll down and select "Manage tools".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-3.png",loading:"lazy"}),(0,n.kt)("ol",{start:4},(0,n.kt)("li",{parentName:"ol"},'Click on "Configure a tool manually".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-4.png",loading:"lazy"}),(0,n.kt)("ol",{start:5},(0,n.kt)("li",{parentName:"ol"},'Fill in the following data and then select "Save changes".')),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"Name: plugNmeet\nTool URL: https://your-plug-n-meet/lti/v1\nConsumer key: plug-n-meet API Key\nShared secret: plug-n-meet API Secret\n\n")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Replace with your own API key and Secret")),(0,n.kt)("img",{src:"/img/lti/lti-moodle-5.png",loading:"lazy"}),(0,n.kt)("ol",{start:6},(0,n.kt)("li",{parentName:"ol"},"PlugNmeet is now ready to use via LTI tools on Moodle.")),(0,n.kt)("img",{src:"/img/lti/lti-moodle-6.png",loading:"lazy"}),(0,n.kt)("ol",{start:7},(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"After the LTI tool is ready,then you can go to My course page to add a new course with LTI. ")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},'Create a course or choose an existing one by going to the "My courses" section. In this case, a course will be created by clicking on "Create new course". "Edit mode" needs to be enabled.'),(0,n.kt)("img",{src:"/img/lti/lti-moodle-8.png",loading:"lazy"})),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"We input the name of the course"))),(0,n.kt)("img",{src:"/img/lti/lti-moodle-9.png",loading:"lazy"}),(0,n.kt)("ol",{start:10},(0,n.kt)("li",{parentName:"ol"},'Click on "Save and display".then we come to the course page. ')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-10.png",loading:"lazy"}),(0,n.kt)("ol",{start:11},(0,n.kt)("li",{parentName:"ol"},'Select "Add an activity or resource".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-11.png",loading:"lazy"}),(0,n.kt)("ol",{start:12},(0,n.kt)("li",{parentName:"ol"},'Click on "External tool".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-12.png",loading:"lazy"}),(0,n.kt)("ol",{start:13},(0,n.kt)("li",{parentName:"ol"},'Type the name of the activity and select in Preconfigured tool: "plugNmeet".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-13.png",loading:"lazy"}),(0,n.kt)("ol",{start:14},(0,n.kt)("li",{parentName:"ol"},'Click on "Save and display".')),(0,n.kt)("img",{src:"/img/lti/lti-moodle-14.png",loading:"lazy"}),(0,n.kt)("ol",{start:15},(0,n.kt)("li",{parentName:"ol"},"Then user can click the activity and join the plugNmeet meeting. ")),(0,n.kt)("img",{src:"/img/lti/lti-moodle-15.png",loading:"lazy"}))}s.isMDXComponent=!0},3030:(t,e,l)=>{l.d(e,{Z:()=>a});const a=l.p+"assets/images/lti1-4b5115799650a8da215ef559fe5f79ed.png"},3660:(t,e,l)=>{l.d(e,{Z:()=>a});const a=l.p+"assets/images/lti2-c155a331f4a6b3f8f835a7d057b55088.png"},2644:(t,e,l)=>{l.d(e,{Z:()=>a});const a=l.p+"assets/images/lti3-8dc51406a70788482eb3a110759d8796.png"}}]);