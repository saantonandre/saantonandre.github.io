import{u as T,a as S,b as v,r as o,j as e,t as A,c as E,I as U,B as J,d as D,_ as W,e as b,m as N}from"./index-4sbYn_Wp.js";import{T as f,u as L,P as O,a as V,A as B,p as P,b as k}from"./prepareGrid-M7jXO22t.js";import{B as p}from"./Basic-_-pcZrcT.js";import{u as X}from"./HeaderPage-abN_HVsn.js";import{m as I,u as H}from"./useInViewport-iOz6AFza.js";import{s as K}from"./constants-pJ9mU_zC.js";import{u as z,M as Z}from"./useEnv-uKDzx3Eu.js";const q="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nN2XOxJCIQxFU97uNdYOtTuwcgmuxnEtWa0WT94wmfALImBxuwz3QD4A4XSmkaLSQH48X14tMSYA3hc8pBmUxJgA+LPwdrkd8gZix2pMEwArC4cGoWIxOQiyApRoTQBO5LUFItYdlKrkVnOtXiQEWY7bXe+qLGmhb5lbIagGQJr5Y62FMAE4xTgsVglSBYAMhDSXFR2C5CDUGkAGQgOIzYwUQLILUACQGywS4v8AXM8U8Mgi5NFtyCsMoq3nKMboywgzXMeY4UGCGZ5kWAUAv3iWY/THBDN8zaB3hznGDNBLbwQcbYVca5QjAAAAAElFTkSuQmCC",_=({frameRef:s,isLoaded:n})=>{const a=T(),{id:t}=S(),r=v(),[l,i]=o.useState(!1);o.useEffect(()=>{s.current&&(s.current.onmouseenter=()=>i(!1))},[s]);const d=a.pathname.split("/").includes("focus");return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:A("bg-neutral2 absolute bottom-0 w-full translate-y-[105%] p-4 transition-all",l&&"translate-y-0"),style:{...E,borderLeft:0,borderRight:0,borderBottom:0},children:e.jsxs("div",{className:"ml-20 flex gap-3",children:[e.jsx(f,{tip:"Launches the project's window in full screen",children:e.jsx(p,{onClick:()=>{var c;return(c=s.current)==null?void 0:c.requestFullscreen()},children:"Fullscreen"})}),e.jsx(f,{tip:"Enables/Disables some UI elements on page (warning: RELOADS THE PAGE)",children:d?e.jsx(p,{onClick:()=>r(a.pathname.replace("focus/"+t,String(t))),children:"Unfocus"}):e.jsx(p,{onClick:()=>r(a.pathname.replace(String(t),"focus/"+t)),children:"Focus mode"})})]})}),e.jsx("div",{className:A("absolute bottom-4 left-4 w-fit shrink-0 opacity-80",l&&"opacity-100"),onTouchStart:()=>i(c=>!c),onMouseEnter:()=>i(!0),role:"button",children:e.jsx(f,{controlled:!0,active:!1,tip:e.jsxs("div",{children:[e.jsx("span",{className:"sm:hidden",children:"Tap"}),e.jsx("span",{className:"hidden sm:inline",children:"Hover"})," here to show the configs"]}),children:e.jsx("img",{alt:"decoration",src:q})})})]})},$="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAGCAYAAABThMdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAd0lEQVR4nGPgEJH7TwJmgGJqqWcgwzw4H8z5dm0vGKOzsfGRxXGx8aknVf4bFvUwPtzx2AzBRWPzLCnqOUiUx0bDHQ/Chxd3wWkYxsVHpnGx8dGH8ZiHSz2y+TA+2PEzS8vBGMYmhcbGpsS8mUh6CcmTklkGHQYAruUDoZa49gQAAAAASUVORK5CYII=",ee="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABvElEQVR4nN2WPVLEMAxGVapLQ8245gZU1DTiCMxwA45AyzU4B9XegaPQLgMzgY031p8lJ0vxzaTY2O9JsjeAV9dwyYGtAXCHAkchuxQ4znl5emYTLQMjoDNlwAvvhRZkIFugq+KGjkCGgGcszhLdDYiCnwHL7cNPvp8/P97PYjzsECFgAufgawnUrd0lYALXwte/R3kflwC7aA3ugS/Vux4Js0AGfBEkPALD4YtTYlfwxSFhEphu7hbRwNfvaILRAhG3TUQXUCGgGp9s+GIYI3P1s8ZmUo6SKED3j4vUnweHt9dmIipfqmKt8bQE2IM7svKToQti9edFpMpnhpguiAISfHbQIrDWKm5sRgR7R2jL6h+sHbj4EaL/eIink+tMksi6RkkpsDsJNP6RiQKjJTBCYCsJZFjEz2lJYIQEKqqvFji9Uutk3U6kqL5ZoFWp6E5gp4C5C9GdICU8J7CZBBngXQKZEsTvZxYYKkEOeI0AKxFxO5G8NvQKiBItEQ5euR5ECagkpNEyrgHRAmCB8AT/RCFLwNQNBzxY4xX47UaPDC7HC0YLuGQioDFBYFWmkdD9IEFgaGBrgF6BL6JtVAfisIFRAAAAAElFTkSuQmCC",se="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABs0lEQVR4nN2WvVEEMQxGFSrbhJhxTAdElEA1DD3QgWLqILoeKOXSY4aZhVuz1p8le4/gy26970mybgHv7uGWA7MB8IACFyGHFLisOX9+sImWgRHQmTLghfdCCzKQLdBVcUNHIEPAMxZ/Et0NiIJfAcvj83dazxgvO0QImMA5+L0unTsl3PB74Fr4+vcov8cloIbwwhfls5yEWSADvujujUlgOHxxShwKvjgkTALLw9MmGvj6GU0wWiBi20R0ARUC6tWXCV8MY2SuftbYLMpREgXo5XWT+vPg9P7WTETlS1WsPZ6WAFvNkZVfDF0Qq78eIlU+M8R0QRSQ4LODFoG9VnFjMyLYO0Izq3+yduDmR4j+4yVertaZJJG1RkkpcDgJNP6RiQKjJTBCYJYEMizi57QkMEICFdVXC1yv1DpZ24kU1TcLtCoV3QnsFDB3IboTpITnBKZJkAHeJZApQfz7zAJDJcgBrxFgJSK2E8lnQ6+AKNES4eCV50GUgEpCGi3jGRAtABYIT/BXFLIETN1wwIM1XoGfbvTI4Ha8YLSASyYCGhMEdmUaCX0fJAgMDcwG6BX4AhBf784jmkP/AAAAAElFTkSuQmCC",te="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABl0lEQVR4nN2WPW7EQAhGKeloUkeuc4NUOULuf5qNFCnZn+zA9zEwtlOgldae8XvAYIu+vMqZQ/YG0AMKXII4pMDlJ7b3TzeqZWQFdKeMZOGz0IGMdAtMZZyoiHQIZNriT1RXQ6rgHwFHa8jDLhUCFLgH/6xK26REGn4EgEAxFdFAIg3P/I9c16QELdABv2HnhhJYDr8lJQ4FvyUkKAF7+7gLBP5xDRJaLVAxbSqqoIAAtFk3/Ea0EZ39rrYxsJVCAW+TCK76Q08HPCMBd4OVmTeiCmH2b3+9h3SGOVUIBboyy1TAUIGOadIxjZRtodNUwM7eQvYfD7GB7dQ5Rg0UOJyEki8y6CCvlNAKgb0k1GEJP6fRTHRKKJB9WOBmcTghkDWZyWMVAplMZyqhkwJ0FaorYSC8J7CbhBHwKYFOCfPX0QJLJSwBjwi4EhXTyeL7ZFYglBiJePeB+0mVACQx0+eWgGcFviUycx0NvYpKlwBVjQS8sJEV+K3GjIzet5esFkjJVEBrg8BTmUGUPk8aBJaG7A0wK/AF80M8pP4XQJcAAAAASUVORK5CYII=",ne="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABwUlEQVR4nOWYMU7EQAxFXbqbhhql5gZU1DThCEjcgCNsyzU4B1XuwFFoF4ESYCeTmW+P7SxQ/GalJO/5O6PdJb64pN8c2huAz1Dg2MhZChyXHB4eq7GWoQhoTxnSwmuhGzLkLdA1cUEj5CGgWYtVrNsgK/gF8O31ZZWPz4fru88IX3ayEIAnXoIvSaAiDEio4ReAHEoiMQAiLQk1fA7SIzHM12kkxAI1eC8JVgio4aMlyAM+UoIkAunqRhxEIhWuMRXQTN/idDooBMzWp1eCwRag6WtWR7tOg7CFlcB4e38Si+nnUNPz02Y4+9pR4tkScJ2+9sXmRgvN6XtmajSxCNRaaArUHuIdnkVhgVJVtaojwr0rtGcD09zC/1mh8S++xMnpGEXgk1AgRMISnqMFJPDJSsBKwgJ+BARcWpDCJ3D6sEDviYQclZwFmb5YIGLySbA+1R/1Fi1oJs8C+JpAt0QEPGsEEAlL+LFDQCURCc/on7tbN89FrE6bEYRHBZoSP0VQePB+ZCUASSDvh+AeZC1AEghN+FuUvAREbSjgSRqtwFcbPTJ8ul4ULaCSsYBmB4GizEZMn0cOAqGhvQF6Bd4BLcxUB4gs48cAAAAASUVORK5CYII=",ae="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABuUlEQVR4nOWYMVLDQAxFVarbJjXjmhtQ5QichuEO3MA150jlO3CUtGFgYiAbe/WlleQAxW8ysfOevryThHh3R785tDUA36DASchNCpzmHN8OzXjLUAZ0pAxZ4a3QggxFC3RNXNEIRQhY1uIq3m2QF3wL8OP14eHxM8qHnTwE4IlL75slUBEGJMzwM0ANpZEYABFJwgxfg/RIDMJ1LQm1QAs+SoINAmb4bAmKgM+UII1Aud+rg0gU8BqzgGX6HqfT0SDgtj69Egy2AE3fsjrWdRqULVwJjE/PF/GYfg01vb6shquvHUs8awKh07c+2Cy0IE4/MpPQxCzQakEUaH1IdPgsCgssVdWqOiPcu0JbNjCdW/g/KzT+xYe4BB2jCHxRCqRIeMJztoAGvngJeEl4wI+AQEgLWvgCTh8W6D2RkKOSqyDTVwtkTL4o1qf5o96jBcvkWQHfEuiWyIBniwAi4Qk/dgiYJDLhGf1zd+3mtYjXaTOC8KiAKPFTBIUH70deApAE8nwo7kHeAqSBsIS/RSlKQNWGAZ60sQp8tdEjw5frRdkCJhkPaA4QWJRZievnUYBAamhrgF6Bd5uv787CIkOYAAAAAElFTkSuQmCC",le="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO2YQW4CMQxFvfTOm66rrHuDrjhC738aKlVqmQqS/P9jB1C7sJAYhnnP38kMmL+82jOX3RvAH1DgPKmHFDh/V3v/GFa2jO2ArpQxFV6FnshYtcBSx4lErEJAGYuryk7DsuBHgMf3ycVuGQJwx2efQ4UbISHD3wJgJRogMpOQ4ZVjo+MuStAC6PxmSrggIMPvlrAK+J0SxgjE24kuRCLAc2SB1buvujs1QSBtfFYlHEwB6r4yOuo4NTKFKwH2okoSqKR3eHoCpd1XF7ZPUph2v7JiInl87aUwFahIgEnKGYGK3adi9/JnSSD+3AjF/yI+yWMRneNMAlvGKBPedwsw8JElkCWRAR+AQEkKLHyA3YcFDieXPDI4eM6ywI7OBzE+wx/1GSkonXcCfiSwLLED3hUBRCITPhYEJImd8I7+uYtCZe02AcKjAlOJIyAKD36fZQlAEqvrI0h4VuBLQrkfoOUXUasSoNIQ4I0tVeAnjRUZ/z1etltAksmA9gKBmzKdSr2eFQhsLbs3wKrAJ25TPKQQKXb1AAAAAElFTkSuQmCC",Q=({left:s=!1,className:n,projectId:a})=>{const t=v(),r=s?a+1>Ae-1:a-1<0;return e.jsx("button",{className:A("group select-none",n),disabled:r,onClick:()=>t(`/projects/${s?a+1:a-1}`),children:e.jsxs(f,{tip:r?`This is ${s?"currently the newest":"the oldest"} project in the archive`:`View a${s?" (more recent)":"n older"} project`,children:[e.jsx("img",{src:s?ee:ne,alt:`Arrow ${s?"left":"right"}`,className:"block group-hover:hidden group-disabled:hidden"}),e.jsx("img",{src:s?se:ae,alt:`Arrow ${s?"left":"right"}`,className:"hidden group-hover:block group-disabled:hidden"}),e.jsx("img",{src:s?te:le,alt:`Arrow ${s?"left":"right"}`,className:"hidden group-disabled:block"})]})})},ie=({project:s,src:n,className:a})=>{const[t,r]=o.useState(!1),l=o.useRef(null),i=o.useRef(null),{name:d,width:c,height:m}=s.metadata,w=680+Number(c),g=L(),u=g<w,[h,j]=o.useState(!1),C=new URL(s.metadata.thumbnail,window.location.origin+s.url+"/").href;return o.useEffect(()=>{var x;(x=i.current)!=null&&x.contentWindow},[i]),o.useEffect(()=>{r(!1)},[d]),o.useEffect(()=>{document.onfullscreenchange=()=>{j(!!document.fullscreenElement);const x=i.current;x&&(x.src=String(x.src))}},[]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[e.jsxs("div",{style:{...E,...u?{}:{height:m+"px",width:c+"px"}},ref:l,className:A("relative flex items-center justify-center overflow-hidden",u&&"aspect-square w-full",h&&"h-full w-full",a),children:[e.jsx("iframe",{src:n,title:d,width:h?"100%":c,height:h?"100%":m,className:A("bg-contrast",u&&!h&&"hidden"),onLoad:()=>r(!0),ref:i}),e.jsx(U,{src:C,className:A("h-full w-full rounded",(!u||h)&&"hidden")}),e.jsx("div",{className:A("bg-neutral2 pointer-events-none absolute inset-0 opacity-100 transition-all delay-500 duration-1000",t&&"opacity-0")}),(!u||h)&&e.jsx(_,{frameRef:i,isLoaded:t}),e.jsx(O,{isLoaded:t})]}),e.jsx("div",{className:"pointer-events-none absolute -bottom-1 left-0 right-0 z-0 flex justify-center ",children:e.jsx("img",{src:$,className:"h-4",alt:"decoration"})}),e.jsx(Q,{left:!0,className:"absolute bottom-0 left-0 z-10 -translate-x-1/3 translate-y-1/3",projectId:s.id}),e.jsx(Q,{className:"absolute bottom-0 right-0 z-10 translate-x-1/3 translate-y-1/3",projectId:s.id})]}),g<w&&e.jsxs("div",{className:"flex flex-col items-center justify-center gap-2",children:[e.jsx("div",{className:"flex flex-col items-center gap-2 text-center",children:e.jsx(p,{className:"mx-2 inline",onClick:()=>{const x=l.current;x&&x.requestFullscreen()},children:"Launch (fullscreen)"})}),e.jsx("div",{className:"text-center",children:"The project window cannot fit in this resolution, but you can try to launch it anyway on fullscreen."})]})]})},F=({url:s,metadata:n,id:a,isFocus:t,heightClass:r="h-20 sm:h-16"})=>{const l=v(),[i,d]=o.useState(!1),{instructions:c,creation_date:m,description:w,width:g,height:u,name:h,short_name:j,resources:C,links:x,thumbnail:G,start_url:he,desktop:Y,mobile:M}=n;return e.jsx("div",{onClick:()=>{l("/projects/"+(t?"focus/":"")+a)},role:"button",className:"animate-fade-in group max-w-full",onMouseLeave:()=>{d(!1)},onMouseEnter:()=>{d(!0)},children:e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(f,{tooltipWrapperClass:"pointer-events-none",placement:"left",tip:e.jsx(V,{project:n,url:s}),className:"relative flex shrink",children:[e.jsx(U,{src:new URL(G,window.location.origin+s+"/").href,className:A("w-32 sm:w-24",r),style:E,loading:"lazy"}),e.jsx("div",{className:"from-neutral2/60 absolute inset-0 bg-gradient-to-t to-transparent "}),e.jsxs("div",{className:"absolute bottom-1 flex h-[30%] w-full justify-end gap-3",children:[e.jsx(B,{device:"desktop",compatible:Y}),e.jsx(B,{device:"mobile",compatible:M})]})]}),e.jsxs("div",{className:"flex min-w-0 flex-col p-1 text-base transition-all sm:text-sm",children:[e.jsx("div",{className:"min-w-0 overflow-hidden",style:{...i?{textShadow:"0px 0px 10px white"}:{}},children:e.jsx("span",{className:"min-w-0 max-w-full",children:j})}),e.jsx("div",{className:"text-contrast2 text-sm",children:m})]})]})})},re=({className:s,src:n,placeholder:a=D,title:t,withModal:r=!0,imageClassName:l,containerClassName:i,...d})=>{const[c,m]=o.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:A("shrink-0 overflow-hidden",r&&"cursor-zoom-in",s,i),role:"img",onClick:()=>m(!0),children:e.jsx(R,{className:A(s,"h-full w-full",l),...d,src:n,placeholder:a})}),r&&e.jsx(J,{open:c,title:t,close:()=>m(!1),closableOnOverlayClick:!0,children:e.jsx("div",{className:"w-full sm:min-h-[300px]",children:e.jsx(R,{preview:!0,...d,src:n,className:s,placeholder:a})})})]})},R=({preview:s=!1,placeholder:n,className:a,src:t,...r})=>{const[l,i]=o.useState(!1);return(t==null?void 0:t.split(".").pop())==="mp4"?e.jsx("video",{className:A("object-cover opacity-0 transition-none",s?"h-full w-full rounded-2xl object-contain":a,l&&"opacity-100"),onCanPlay:c=>{i(!0)},controls:!0,autoPlay:!0,muted:!0,loop:!0,children:e.jsx("source",{src:t,type:"video/mp4"})}):e.jsx("img",{className:A("object-cover opacity-0 transition-none",s?"h-full w-full rounded-2xl object-contain":a,l&&"opacity-100"),alt:"placeholder",src:String(t),onLoad:c=>{i(!0)},...r})},oe=({resources:s,projectUrl:n})=>{const a=L(),[t,r]=o.useState(a),l=o.useRef(null);if(o.useEffect(()=>{if(!l.current)return;const c=l.current.getBoundingClientRect();r(c.width)},[a]),s.length===0)return e.jsx(e.Fragment,{});const[i,d]=P(s.length,{step:250,availableWidth:t});return e.jsxs("div",{ref:l,children:[e.jsx("h2",{className:" text-contrast2",children:"Resources"}),e.jsx("hr",{}),e.jsx("div",{className:"flex flex-col gap-4",children:new Array(d).fill(0).map((c,m)=>e.jsx("div",{className:"flex w-full justify-between gap-4",children:new Array(i).fill(0).map((w,g)=>{const u=s[m*i+g];if(!u)return e.jsx("div",{className:"aspect-square flex-1"},m*i+g);const h=u.split("/").pop();return e.jsxs("div",{className:"bg-neutral border-contrast2 relative flex aspect-square flex-1 flex-col overflow-hidden rounded border",children:[e.jsx("div",{className:"flex grow items-center",children:e.jsx(re,{src:new URL(u,window.location.origin+n+"/").href,className:"relative h-full w-full flex-1 rounded-lg object-contain",title:h})}),e.jsx("div",{className:"bg-neutral2 overflow-hidden text-ellipsis whitespace-nowrap p-1 px-2 text-sm",children:h})]},m*i+g)})},`row-${m}`))})]})},ce=o.lazy(()=>W(()=>import("./ProjectEditor-_s0qV9ry.js"),__vite__mapDeps([0,1,2,3,4,5,6,7]))),y=k,Ae=y.length,de=1450,me=()=>{const{id:s}=S(),n=k.find(l=>String(l.id)===String(s));X((n==null?void 0:n.metadata.name)||"Not found");const a=z();if(!n)return e.jsx("div",{});const t=n.metadata,r=window.location.pathname.split("/").includes("focus");return e.jsx("div",{className:A("-m-3 mt-0 flex grow justify-center"),children:e.jsxs("div",{className:A("markdown flex grow","text-contrast relative","lg:flex-row lg:justify-center","flex-col justify-start"),style:{maxWidth:de},children:[e.jsxs("div",{className:"bg-neutral2 top-full m-6 flex h-fit grow flex-col items-center gap-6",style:b,children:[e.jsxs("div",{className:"border-contrast2 -m-5 mb-0 flex w-full flex-col justify-between border-b pb-2 text-center sm:flex-row sm:items-end sm:text-left",children:[e.jsx("h2",{className:"text-contrast !mb-0 shrink",children:t.name}),e.jsx("span",{className:"text-contrast2 !mb-0 flex w-full justify-end sm:w-fit",children:t.creation_date})]}),e.jsx(ie,{src:new URL(t.start_url,window.location.origin+n.url+"/").href,project:n}),a==="development"&&e.jsxs("div",{className:"flex gap-3",children:[e.jsx(o.Suspense,{children:e.jsx(ce,{project:n})}),e.jsx(p,{onClick:async()=>{const l=K+"/project/code/"+n.id,i=await fetch(l);console.log({openCodeRequestRes:i})},children:"OPEN VSCODE"})]}),e.jsxs("div",{className:"flex w-full flex-col gap-4",style:{maxWidth:Number(t.width)>800?t.width:"800px"},children:[t.instructions&&e.jsxs("div",{children:[e.jsx("h2",{className:" text-contrast2",children:"Instructions"}),e.jsx("hr",{}),e.jsx("div",{className:"px-0 sm:px-4",children:t.instructions&&e.jsx("div",{dangerouslySetInnerHTML:{__html:I.makeHtml(t.instructions)}})})]}),t.description&&e.jsxs("div",{children:[e.jsx("h2",{className:" text-contrast2",children:"Description"}),e.jsx("hr",{}),e.jsx("div",{className:"px-0 sm:px-4",children:t.description&&e.jsx("div",{className:"markdown",dangerouslySetInnerHTML:{__html:I.makeHtml(t.description)}})})]}),e.jsx(Z,{links:t.links}),e.jsx(oe,{resources:t.resources,projectUrl:n.url}),e.jsx("div",{className:"fixed top-0"})]})]}),e.jsxs("div",{className:A("bg-neutral2 m-6 flex h-fit shrink-0 flex-wrap gap-6","relative items-stretch lg:w-[300px]"),style:{...b},children:[e.jsx("img",{className:"absolute left-0 top-0 hidden h-12 -translate-x-[170%] lg:block",alt:"decoration",src:N}),e.jsx("img",{className:"absolute left-0 top-[400px] hidden h-12 -translate-x-[170%] lg:block",alt:"decoration",src:N}),e.jsxs("div",{className:"relative -m-4 flex shrink grow flex-col items-stretch gap-2",children:[e.jsx("div",{className:"bg-neutral pointer-events-none mb-1",children:e.jsx(F,{...n},n.id)}),e.jsx("hr",{className:"opacity-60"}),y.filter(l=>l.id!==Number(s)).reverse().map(l=>e.jsx(ue,{project:l,isFocus:r},l.id))]})]})]},n.id)})},ue=({project:s,isFocus:n})=>{const[a,t]=H(),r="h-20 sm:h-16";return e.jsx("div",{className:r,ref:a,children:t&&e.jsx(F,{...s,isFocus:n,heightClass:r},s.id)})},Ee=me;export{me as Project,Ee as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/ProjectEditor-_s0qV9ry.js","assets/index-4sbYn_Wp.js","assets/index-Yl0CcgFA.css","assets/Basic-_-pcZrcT.js","assets/Basic-YpUJMpCQ.js","assets/ResourceEditor-EyQrKpj1.js","assets/useInViewport-iOz6AFza.js","assets/constants-pJ9mU_zC.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}