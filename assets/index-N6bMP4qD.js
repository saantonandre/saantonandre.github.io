import{b as S,r as x,j as e,t as p,c as F,I as U,f as D,g as N}from"./index-SxvscFix.js";import{u as R,H as O}from"./HeaderPage-UySJM697.js";import{T as j,a as P,P as M,A as b,u as V,p as z,b as L}from"./prepareGrid-eDnV50Qi.js";import{m as G,u as K}from"./useIntersectionObserver-6Nd_qamj.js";import{B as H}from"./Basic-loRirUpg.js";import{B as k}from"./Basic-uvWueK4z.js";const X=[{unit:"year",ms:31536e6},{unit:"month",ms:2628e6},{unit:"day",ms:864e5},{unit:"hour",ms:36e5},{unit:"minute",ms:6e4},{unit:"second",ms:1e3}],Y=new Intl.RelativeTimeFormat("en",{numeric:"auto"});function Z(t,s=new Date){if(!t)return"";const a=t.getTime()-s.getTime();return Q(a)}function Q(t){for(const{unit:s,ms:a}of X)if(Math.abs(t)>=a||s==="second")return Y.format(Math.round(t/a),s);return""}const J=({url:t,metadata:s,id:a,className:n})=>{const l=S(),[A,i]=x.useState(!1),m=!0,{instructions:w,creation_date:c,description:d,width:f,height:B,name:h,short_name:v,resources:E,links:o,thumbnail:r,start_url:y,mobile:C,desktop:I}=s;return e.jsxs("div",{className:p("animate-fade-in flex aspect-[4/3] flex-col",n),children:[e.jsxs("div",{onClick:()=>{l("/projects/"+a)},role:"button",className:p("group flex max-w-full flex-col p-1",n),onMouseLeave:()=>{i(!1)},onMouseEnter:()=>{i(!0)},children:[e.jsx(j,{tooltipWrapperClass:"pointer-events-none",tip:e.jsx(P,{project:s}),className:"relative flex aspect-[16/9] grow",children:e.jsxs("div",{className:"absolute inset-0 overflow-hidden",style:F,children:[e.jsx(M,{isLoaded:m,className:"sm:hidden"}),e.jsx(U,{src:new URL(r,window.location.origin+t+"/").href,className:p("absolute inset-0 opacity-100 transition-all duration-200",A&&"scale-105"),loading:"lazy"}),e.jsx("div",{className:"from-neutral2/60 absolute inset-0 bg-gradient-to-t via-transparent "}),e.jsxs("div",{className:"absolute bottom-1 right-1 flex h-[20%] w-full justify-end gap-3",children:[e.jsx(b,{device:"desktop",compatible:I}),e.jsx(b,{device:"mobile",compatible:C})]})]})}),e.jsxs("div",{className:"flex min-w-0 flex-col p-1 transition-all",children:[e.jsx("div",{className:"min-w-0 overflow-hidden text-ellipsis text-lg",style:{...A?{textShadow:"0px 0px 10px white"}:{}},children:e.jsx("span",{className:"min-w-0 max-w-full whitespace-nowrap",children:v})}),e.jsxs("div",{className:"text-contrast2 text-sm sm:text-base",children:[c,e.jsxs("span",{className:"hidden sm:inline",children:[" ","- ",Z(new Date(c))]})]})]})]}),e.jsx("div",{className:"markdown line-clamp-3 px-2 sm:hidden",dangerouslySetInnerHTML:{__html:G.makeHtml(d)}})]})},W="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4klEQVR4nK2UsRHDIAxFKdW5ce1znQ1SZYTskA1S5FLTZgPqjMJgznEXcbIsY0mm+OcG3pMwKMA4BZ74eC5SQFh7lF0wjNMq0SnawBE4X+81w+W2EZkEFI7Q/P2sMhORRVIFCOfgzEIlKgGvvgVPr7e5i2CB5/+3rNV2oRIkAuddnBYkBrf+hyoomzTw7BFIXWjgUSOg1xS72INnzzXlD60ASqTKB8eLbo4KhFIwFqGVeIfdopUE67iORol67IJQAB5lS+ISgKETtwCUnZwSgEJyWgANSTcBCO+ou4BKuh9RKz/asX+AmtzZLAAAAABJRU5ErkJggg==",_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAmElEQVR4nGPgEJFjoCVmoKcF/6mMGTAs+HZtL1UwBy4LaO0DhqEfB4cXd1EFcwzbOGBAwygu4cAuR7YPsKZpDiT5maXlODEhC/BmHA4KfUBU7uQgNx+QkPz+k5UPkDGaof/RNFIUBygGcOCIZIpTEbZcyUHFfEB7H8wkYEFjUiFOTJQF2BRzUNMHBCxgoDgOsLmGmhZQDQMAZR0tItV+dewAAAAASUVORK5CYII=",q="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAmklEQVR4nGPgEJFjoCVmoKcF/6mMGTAs+HZtL1UwBy4LaO0DhqEfB4cXd1EFcwzbOGDA4xsGAvIk+wBrmuZAkp9ZWo4TU8UCDhr7gIHiOMCW5Dio6QNCFsykNA6wKeag0AcoCtB88B9PkiU6DvB6eyaqb8iOA6LClUNE7n9jUiFOTCgO8GrgoFYqwmM4AzXyAbIryTackAVUwQAfMyQmcdXPiAAAAABJRU5ErkJggg==",$=({className:t,children:s,...a})=>e.jsx("select",{className:p("w-full rounded-lg bg-neutral2 px-2 py-1 outline-0 focus-within:text-contrast text-contrast2 font-medium",t),...a,children:s});let g;const ee=t=>{g=t.reduce((s,{id:a,metadata:n})=>(s[a]=(n.name+n.description+n.instructions).toLowerCase().replace(/[^a-zA-Z0-9,;\-.!? ]/g,""),s),{})},te=(t,s,a,n)=>t.filter(({metadata:i})=>!!(i.desktop&&s||i.mobile&&a)).filter(({id:i})=>g?g[i].includes(n.toLowerCase()):!0),se={date:(t,s)=>t.metadata.creation_date>s.metadata.creation_date?1:-1,alphabetical:(t,s)=>t.metadata.name>s.metadata.name?1:-1,documentation:(t,s)=>g?g[t.id].length>g[s.id].length?1:-1:1},ne=(t,s,a)=>(t.sort(se[s]),a?t:t.reverse()),u={mobile:!0,desktop:!0,sortAscending:!1,sortType:"date",filter:""},ae=({projects:t,rawProjects:s,setProjects:a})=>{const[n,l]=D(),A=n.get("mobile"),i=n.get("desktop");n.get("filter");const m=n.get("sort-type"),w=n.get("ascending"),c=A?A==="yes":u.mobile,d=i?i==="yes":u.desktop,f=w?w==="yes":u.sortAscending,B=m||u.sortType,[h,v]=x.useState(u.filter);x.useEffect(()=>{g||ee(s)},[s]),x.useEffect(()=>{const o=te(s,d,c,h),r=ne(o,B,f);a(r)},[n,h]);const E=!h&&c&&d;return e.jsxs("div",{className:"flex flex-col w-full gap-4 -mt-4 -mb-2",children:[e.jsxs("div",{className:"flex items-center w-full gap-4",children:[e.jsxs("div",{className:"relative grow",children:[e.jsx(H,{className:"w-full pl-10 outline-none bg-neutral2",placeholder:"Search projects",defaultValue:h,onChange:o=>{v(o.currentTarget.value)},style:N}),e.jsx("div",{className:"absolute top-3 left-4",children:e.jsx("img",{src:W,className:"w-6 h-6",alt:"magnifying glass"})})]}),e.jsx(j,{tip:`${d?"Showing":"Hiding"} desktop compatible projects`,children:e.jsx(k,{className:p("aspect-square h-12 bg-neutral2",d&&"bg-neutral"),style:N,onClick:()=>{l(o=>{const r=d?"no":"yes";return!d===u.desktop?o.delete("desktop"):o.set("desktop",r),o})},children:e.jsx(b,{device:"desktop",noTip:!0})})}),e.jsx(j,{tip:`${c?"Showing":"Hiding"} mobile compatible projects`,children:e.jsx(k,{className:p("aspect-square h-12 bg-neutral2",c&&"bg-neutral"),style:N,onClick:()=>{l(o=>{const r=c?"no":"yes";return!c===u.mobile?o.delete("mobile"):o.set("mobile",r),o})},children:e.jsx(b,{device:"mobile",noTip:!0})})})]}),e.jsxs("div",{className:"flex items-center justify-between w-full text-sm text-contrast2",children:[e.jsx("div",{className:"text-sm",children:E?e.jsxs("div",{children:["Viewing all ",s.length," projects"]}):e.jsxs("div",{children:["Viewing ",t.length," project",t.length===1?"":"s"," out of ",s.length]})}),e.jsxs("div",{className:"flex items-center",children:[e.jsxs($,{className:"p-0 w-fit text-end text-contrast",role:"button",tabIndex:0,defaultValue:"date",onChange:o=>{l(r=>{const y=o.currentTarget.value;return y===u.sortType?r.delete("sort-type"):r.set("sort-type",y),r})},children:[e.jsx("option",{value:"date",children:"Date"}),e.jsx("option",{value:"alphabetical",children:"Alphabetical"}),e.jsx("option",{value:"documentation",children:"Documentation"})]}),e.jsx(j,{className:"w-6 h-6",offsets:[10,10],tip:`Sorting type: ${f?"Ascending":"Descending"}`,children:e.jsx("img",{src:f?_:q,alt:"sorting",className:"w-full h-full",role:"button",tabIndex:0,onClick:()=>l(o=>{const r=f?"no":"yes";return!f===u.sortAscending?o.delete("ascending"):o.set("ascending",r),o})})})]})]})]})},T=L,oe=()=>{R("Projects");const[t,s]=x.useState(T),a=V(),[n,l]=z(t.length,{clientWidth:a,breakPoint:700}),A=new Array(l).fill(0).map((i,m)=>new Array(n).fill(0).map((w,c)=>{const d=t[m*n+c];if(d)return d}));return e.jsxs(O,{header:e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"text-contrast2 text-xl font-bold",children:"Projects"}),e.jsxs("div",{children:["A list of my web-based projects from most recent to oldest. Note that most of them won't support mobile controls"," "]})]}),children:[e.jsx(ae,{rawProjects:T,projects:t,setProjects:s}),A.map((i,m)=>e.jsx(ie,{projects:i},m))]})},ie=({projects:t})=>{const[s,a]=K();return e.jsx("div",{className:"flex w-full justify-between gap-4",ref:s,children:t.map((n,l)=>e.jsx("div",{className:"aspect-[6/5] flex-1 w-full min-w-0",children:n&&a&&e.jsx(J,{...n,className:"aspect-[6/5] overflow-hidden [&_img.object-contain]:opacity-80 [&_img.object-contain]:hover:opacity-100"},n.id)},(n==null?void 0:n.id)??"blank"+l))})},Ae=oe;export{oe as Projects,Ae as default};