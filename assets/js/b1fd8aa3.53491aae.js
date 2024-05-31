"use strict";(self.webpackChunkplugnmeet_documentation=self.webpackChunkplugnmeet_documentation||[]).push([[115],{8558:(t,e,i)=>{i.r(e),i.d(e,{assets:()=>o,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>d,toc:()=>c});var n=i(4848),l=i(8453);const s={sidebar_position:4},r="Get active room info",d={id:"api/room/room-info",title:"Get active room info",description:"End point: /room/getActiveRoomInfo",source:"@site/docs/api/room/room-info.md",sourceDirName:"api/room",slug:"/api/room/room-info",permalink:"/docs/api/room/room-info",draft:!1,unlisted:!1,editUrl:"https://github.com/mynaparrot/plugNmeet-docs/edit/main/docs/api/room/room-info.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Room Status (active/inactive)",permalink:"/docs/api/room/is-active"},next:{title:"Get active rooms info",permalink:"/docs/api/room/rooms-info"}},o={},c=[{value:"Response",id:"response",level:2},{value:"Room",id:"room",level:3},{value:"Room Info",id:"room-info",level:3},{value:"Participant info",id:"participant-info",level:3}];function x(t){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,l.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.h1,{id:"get-active-room-info",children:"Get active room info"}),"\n",(0,n.jsxs)(e.p,{children:["End point: ",(0,n.jsx)(e.code,{children:"/room/getActiveRoomInfo"})]}),"\n",(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{children:"Field"}),(0,n.jsx)(e.th,{children:"Type"}),(0,n.jsx)(e.th,{children:"Position"}),(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Required"}),(0,n.jsx)(e.th,{children:"Description"})]})}),(0,n.jsx)(e.tbody,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:"room_id"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{children:"root"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Yes"}),(0,n.jsx)(e.td,{children:"Room Id"})]})})]}),"\n",(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:"Example"}),":"]}),"\n",(0,n.jsx)(e.pre,{children:(0,n.jsx)(e.code,{className:"language-json",children:'{\n  "room_id": "room01"\n}\n'})}),"\n",(0,n.jsx)(e.h2,{id:"response",children:"Response"}),"\n",(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Field"}),(0,n.jsx)(e.th,{children:"Type"}),(0,n.jsx)(e.th,{children:"Position"}),(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsxs)(e.tbody,{children:[(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"status"}),(0,n.jsx)(e.td,{children:"boolean"}),(0,n.jsx)(e.td,{children:"root"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"The status of the request"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"msg"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{children:"root"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Response message"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:(0,n.jsx)(e.a,{href:"#room",children:"room"})}),(0,n.jsxs)(e.td,{children:["object<",(0,n.jsx)(e.a,{href:"#room",children:"room"}),">"]}),(0,n.jsx)(e.td,{children:"root"}),(0,n.jsx)(e.td,{style:{textAlign:"left"}})]})]})]}),"\n",(0,n.jsx)(e.h3,{id:"room",children:"Room"}),"\n",(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Field"}),(0,n.jsx)(e.th,{children:"Type"}),(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsxs)(e.tbody,{children:[(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:(0,n.jsx)(e.a,{href:"#room-info",children:"room_info"})}),(0,n.jsxs)(e.td,{children:["object<",(0,n.jsx)(e.a,{href:"#room-info",children:"room_info"}),">"]}),(0,n.jsx)(e.td,{style:{textAlign:"left"}})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:(0,n.jsx)(e.a,{href:"#participant-info",children:"participants_info"})}),(0,n.jsxs)(e.td,{children:["array<",(0,n.jsx)(e.a,{href:"#participant-info",children:"participant_info"}),">"]}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Array of current participants"})]})]})]}),"\n",(0,n.jsx)(e.h3,{id:"room-info",children:"Room Info"}),"\n",(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Field"}),(0,n.jsx)(e.th,{children:"Type"}),(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsxs)(e.tbody,{children:[(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"room_title"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Title of the meeting"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"room_id"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Room Id"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"sid"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Room Sid"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"joined_participants"}),(0,n.jsx)(e.td,{children:"number"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Total number of users joined"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"is_running"}),(0,n.jsx)(e.td,{children:"boolean"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"If the room is active now"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"is_recording"}),(0,n.jsx)(e.td,{children:"boolean"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"If recording active"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"is_active_rtmp"}),(0,n.jsx)(e.td,{children:"boolean"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"If RTMP active"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"creation_time"}),(0,n.jsx)(e.td,{children:"number"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Room creation time in unix format"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"metadata"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Room metadata"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"webhook_url"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Webhook URL"})]})]})]}),"\n",(0,n.jsx)(e.h3,{id:"participant-info",children:"Participant info"}),"\n",(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Field"}),(0,n.jsx)(e.th,{children:"Type"}),(0,n.jsx)(e.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsxs)(e.tbody,{children:[(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"sid"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Participant Sid"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"identity"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Participant userId"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"name"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Participant name"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"state"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Participant state"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"metadata"}),(0,n.jsx)(e.td,{children:"string"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Participant metadata"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"joined_at"}),(0,n.jsx)(e.td,{children:"number"}),(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"Participant joined time in unix format"})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"version"}),(0,n.jsx)(e.td,{children:"number"}),(0,n.jsx)(e.td,{style:{textAlign:"left"}})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{style:{textAlign:"left"},children:"permission"}),(0,n.jsx)(e.td,{children:"object"}),(0,n.jsx)(e.td,{style:{textAlign:"left"}})]})]})]})]})}function h(t={}){const{wrapper:e}={...(0,l.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(x,{...t})}):x(t)}},8453:(t,e,i)=>{i.d(e,{R:()=>r,x:()=>d});var n=i(6540);const l={},s=n.createContext(l);function r(t){const e=n.useContext(s);return n.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function d(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(l):t.components||l:r(t.components),n.createElement(s.Provider,{value:e},t.children)}}}]);