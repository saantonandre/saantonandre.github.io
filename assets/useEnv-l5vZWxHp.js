import{j as e,r as a}from"./index-vp4pGgIL.js";const c=s=>{const t=new URL(s).host;return`https://www.google.com/s2/favicons?domain=${encodeURIComponent(t)}`},d=({links:s,omitTitle:t})=>s.length===0?e.jsx(e.Fragment,{}):e.jsxs("div",{children:[!t&&e.jsxs(e.Fragment,{children:[e.jsx("h2",{className:" text-contrast2",children:"Links"}),e.jsx("hr",{})]}),e.jsx("div",{className:"px-0 sm:px-4",children:e.jsx("ul",{children:s.map(({url:n,name:r})=>e.jsxs("li",{className:"my-1",children:[e.jsx("img",{className:"mr-1 inline h-5 w-5",alt:"",src:c(n)}),e.jsx("a",{href:n,target:"_blank",children:r})]},n))})})]}),i="production",o=()=>i,h=()=>{const[s,t]=a.useState(o());return a.useEffect(()=>{crypto.randomUUID();const n=r=>{r.data.type==="switchenv"&&t(o())};return window.addEventListener("message",n),()=>{window.removeEventListener("message",n)}},[]),s};export{d as M,h as u};