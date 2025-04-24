import{r,j as e}from"./index-CQbe2RcN.js";import{u as m,H as i,m as l}from"./markdownConverter-BWaZ0tGM.js";import{B as c}from"./Basic-Bkgc3bz1.js";import{B as d}from"./Basic-ClmRrspZ.js";import{B as h}from"./TextArea-BLsAGEfQ.js";const u=`\r
# Welcome to my website!\r
Hi, my name is Andrea and right now you are on my personal website. In the\r
**Projects** section I've included most of the projects I've worked on in my free\r
time through the years; a lot of them are small videogames/proof of\r
concepts for mechanics I've worked on.\r
\r
# Who am I?\r
My name is Andrea(*he/him*, I've got to specify because it's gender-neutral name) and I'm based in **Sardinia**, Italy. I'm a professional *and* hobbyist developer.\r
You might notice a common "**retro**" theme across my works (this website included): that is partly because of efficiency reasons, reduced assets size, nostalgia, but mostly I'm pretty into **pixel art** so I like to make all the assets myself.\r
\r
I recently deleted my twitter account, and I consider my other social media accounts as personal so I won't share them here.\r
However, if you'd like to reach me out, plese feel free to send me an email using the form down here!\r
`,p="and.santona@gmail.com",f=()=>{const[s,o]=r.useState({subject:"",body:""}),n=()=>{const t=new URLSearchParams(s);window.open(`mailto:${p}?${t}`)};return e.jsxs("form",{className:"flex flex-col gap-2",onSubmit:t=>{t.preventDefault(),n()},children:[e.jsx("b",{children:"Send me an e-mail"}),e.jsx(d,{placeholder:"Subject",onChange:t=>{o(a=>({...a,subject:t.target.value}))}}),e.jsx(h,{placeholder:"Body",onChange:t=>{o(a=>({...a,body:t.target.value}))}}),e.jsx(c,{type:"submit",children:"Send e-mail"})]})},I=()=>(m("About"),e.jsxs(i,{header:e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"text-contrast2 text-xl font-bold",children:"About me"}),e.jsx("div",{children:"Some informations about me, this website and my projects"})]}),children:[e.jsx("div",{className:"markdown-simple",dangerouslySetInnerHTML:{__html:l.makeHtml(u)}}),e.jsx(f,{})]}));export{I as About,I as default};
