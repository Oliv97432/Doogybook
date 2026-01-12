import{j as e,B as l,a5 as t}from"./vendor-react-CkOypKSt.js";const c=({tier:n,size:r="md",variant:s="default"})=>{if(!n||n==="free")return null;const i={sm:{container:"px-2 py-0.5 text-xs gap-1",icon:12},md:{container:"px-3 py-1 text-sm gap-1.5",icon:14},lg:{container:"px-4 py-1.5 text-base gap-2",icon:16}}[r];return n==="professional"?s==="minimal"?e.jsx("div",{className:"inline-flex items-center justify-center",children:e.jsx(l,{size:i.icon,className:"text-blue-600","aria-label":"Refuge vérifié"})}):e.jsxs("div",{className:`
        inline-flex items-center font-medium rounded-full
        bg-gradient-to-r from-blue-500 to-blue-600 
        text-white shadow-sm
        ${i.container}
      `,children:[e.jsx(l,{size:i.icon,className:"fill-current"}),e.jsx("span",{children:"Refuge"})]}):n==="premium"?s==="minimal"?e.jsx("div",{className:"inline-flex items-center justify-center",children:e.jsx(t,{size:i.icon,className:"text-yellow-500 fill-yellow-500","aria-label":"Premium"})}):e.jsxs("div",{className:`
        inline-flex items-center font-medium rounded-full
        bg-gradient-to-r from-yellow-400 to-yellow-500 
        text-yellow-900 shadow-sm
        ${i.container}
      `,children:[e.jsx(t,{size:i.icon,className:"fill-current"}),e.jsx("span",{children:"Premium"})]}):null};export{c as S};
