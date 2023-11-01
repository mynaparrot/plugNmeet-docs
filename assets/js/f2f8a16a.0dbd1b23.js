"use strict";(self.webpackChunkplugnmeet_documentation=self.webpackChunkplugnmeet_documentation||[]).push([[58],{9410:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>d,default:()=>x,frontMatter:()=>r,metadata:()=>l,toc:()=>h});var s=n(5893),i=n(1151);const r={sidebar_position:1},d="Fetch analytics",l={id:"api/analytics/fetch",title:"Fetch analytics",description:"End point: /analytics/fetch",source:"@site/docs/api/analytics/fetch.md",sourceDirName:"api/analytics",slug:"/api/analytics/fetch",permalink:"/docs/api/analytics/fetch",draft:!1,unlisted:!1,editUrl:"https://github.com/mynaparrot/plugNmeet-docs/docs/api/analytics/fetch.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Delete recording",permalink:"/docs/api/recording/delete"},next:{title:"Download analytics (token)",permalink:"/docs/api/analytics/download"}},c={},h=[{value:"Response",id:"response",level:2},{value:"Result",id:"result",level:3},{value:"Analytics info",id:"analytics-info",level:3}];function o(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"fetch-analytics",children:"Fetch analytics"}),"\n",(0,s.jsxs)(t.p,{children:["End point: ",(0,s.jsx)(t.code,{children:"/analytics/fetch"})]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Field"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Required"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"room_ids"}),(0,s.jsx)(t.td,{children:"array"}),(0,s.jsx)(t.td,{children:"Yes"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Array of room Ids'"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"from"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"No"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"From point. Default 0"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"limit"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"No"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Limit of records. Default 20"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"order_by"}),(0,s.jsx)(t.td,{children:"string"}),(0,s.jsx)(t.td,{children:"No"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Ordering DESC or ASC. Default: DESC"})]})]})]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Example"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-json",children:'{\n  "room_ids": ["room01"],\n  "from": 0,\n  "limit": 20,\n  "order_by": "DESC"\n}\n'})}),"\n",(0,s.jsx)(t.h2,{id:"response",children:"Response"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Field"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Position"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"status"}),(0,s.jsx)(t.td,{children:"boolean"}),(0,s.jsx)(t.td,{children:"root"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The status of the request"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"msg"}),(0,s.jsx)(t.td,{children:"string"}),(0,s.jsx)(t.td,{children:"root"}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Response message"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.a,{href:"#result",children:"result"})}),(0,s.jsxs)(t.td,{children:["object<",(0,s.jsx)(t.a,{href:"#result",children:"result"}),">"]}),(0,s.jsx)(t.td,{children:"root"}),(0,s.jsx)(t.td,{style:{textAlign:"left"}})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"result",children:"Result"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Field"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"total_analytics"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"Total number of analytics for the query"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"from"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"Requested from point"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"limit"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"Requested limit of records"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"order_by"}),(0,s.jsx)(t.td,{children:"string"}),(0,s.jsx)(t.td,{children:"Record order"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"analytics_list"}),(0,s.jsxs)(t.td,{children:["Array<",(0,s.jsx)(t.a,{href:"#analytics-info",children:"analytics-info"}),">"]}),(0,s.jsx)(t.td,{})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"analytics-info",children:"Analytics info"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Field"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"room_id"}),(0,s.jsx)(t.td,{children:"string"}),(0,s.jsx)(t.td,{children:"Room Id"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"file_id"}),(0,s.jsx)(t.td,{children:"string"}),(0,s.jsx)(t.td,{children:"File Id"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"file_name"}),(0,s.jsx)(t.td,{children:"string"}),(0,s.jsx)(t.td,{children:"File name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"file_size"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"File size"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"creation_time"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"Creation time in unix format"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"room_creation_time"}),(0,s.jsx)(t.td,{children:"number"}),(0,s.jsx)(t.td,{children:"Room creation time in unix format"})]})]})]})]})}function x(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>l,a:()=>d});var s=n(7294);const i={},r=s.createContext(i);function d(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);