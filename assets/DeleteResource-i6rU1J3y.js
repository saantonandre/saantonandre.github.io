import{r as o,j as e,B as m}from"./index-vp4pGgIL.js";import{B as l}from"./Basic-Y2N1I0k9.js";import{R as u}from"./index-q_kn9JCy.js";import{s as f}from"./constants-pJ9mU_zC.js";import"./HeaderPage-zmBV8aKL.js";import"./useEnv-l5vZWxHp.js";import"./useInViewport-a7KaABag.js";const B=({resourceMetadata:t})=>{const[n,s]=o.useState(!1),[a,r]=o.useState(!1),i=f+"/resources/delete/"+t.id,c=async()=>{r(!0);try{await fetch(i,{method:"POST"}),r(!1),s(!1)}catch(d){console.error(d),r(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx(l,{className:"hover:text-contrast text-contrast2 bg-transparent py-0",onClick:()=>s(!0),children:"Remove"}),e.jsxs(m,{open:n,close:()=>s(!1),title:`Deleting resource "${t.title}"`,loading:a,children:[e.jsx("div",{children:"Are you sure you want to delete this resource?"}),e.jsx("div",{className:"text-contrast my-4",children:e.jsx(u,{omitControls:!0,resource:t})}),e.jsx("div",{className:"flex w-full justify-end",children:e.jsx(l,{onClick:c,children:"Confirm deletion"})})]})]})};export{B as DeleteResource,B as default};