import{r,j as e}from"./index-BWXcGAJO.js";import{u as i,H as m,m as l}from"./markdownConverter-DrBAlRac.js";import{B as d}from"./Basic-DVyez0MJ.js";import{B as c}from"./Basic-kI4Yd9jd.js";import{B as h}from"./TextArea-CNsQsKof.js";const u=`
# Welcome to my website!
Hi, my name is Andrea and right now you are on my personal website. In the
**Projects** section I've included most of the projects I've worked on in my free
time through the years; a lot of them are small videogames or proof of
concepts for mechanics I've designed myself.

# Who am I?
My name is Andrea(*he/him*) and I'm based in **Sardinia**, Italy. I'm a professional *and* hobbyist developer.
You might notice a common "**retro**" theme across my works (this website included): partly because of the efficiency benefits (assets size, loading time), in some part nostalgia, but mostly because I like drawing **pixel art** and owning the assets I use.

I have deleted most of my social media accounts, and I consider the few survivors as personal. If you'd like to reach me out, plese feel free to send me an email using the form down here!
`,f="and.santona@gmail.com",p=()=>{const[o,s]=r.useState({subject:"",body:""}),n=()=>{const a=new URLSearchParams(o);window.open(`mailto:${f}?${a}`)};return e.jsxs("form",{className:"flex flex-col gap-2",onSubmit:a=>{a.preventDefault(),n()},children:[e.jsx("b",{children:"Send me an e-mail"}),e.jsx(c,{placeholder:"Subject",onChange:a=>{s(t=>({...t,subject:a.target.value}))}}),e.jsx(h,{placeholder:"Body",onChange:a=>{s(t=>({...t,body:a.target.value}))}}),e.jsx(d,{type:"submit",children:"Send e-mail"})]})},I=()=>(i("About"),e.jsxs(m,{header:e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"text-contrast2 text-xl font-bold",children:"About me"}),e.jsx("div",{children:"Some informations about me, this website and my projects"})]}),children:[e.jsx("div",{className:"markdown-simple",dangerouslySetInnerHTML:{__html:l.makeHtml(u)}}),e.jsx(p,{})]}));export{I as About,I as default};
