import{j as e,a5 as l,a9 as c,U as m,H as p,ab as x,$ as d,w as u}from"./vendor-react-CkOypKSt.js";import{b as h,u as b}from"./vendor-router-M7WQPhYn.js";const f=({size:i="md",variant:s="default"})=>{const t={sm:{container:"px-2 py-0.5 text-xs gap-1",icon:12},md:{container:"px-3 py-1 text-sm gap-1.5",icon:14},lg:{container:"px-4 py-1.5 text-base gap-2",icon:16}}[i];return s==="minimal"?e.jsx("div",{className:"inline-flex items-center justify-center",children:e.jsx(l,{size:t.icon,className:"text-yellow-500 fill-yellow-500","aria-label":"Premium"})}):e.jsxs("div",{className:`
      inline-flex items-center font-bold rounded-full
      bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 
      text-yellow-950 shadow-md border border-yellow-300/50
      animate-in fade-in zoom-in duration-300
      ${t.container}
    `,children:[e.jsx(l,{size:t.icon,className:"fill-yellow-900/20"}),e.jsx("span",{className:"uppercase tracking-tight",children:"Premium"})]})},j=()=>{const i=h(),s=b(),n=[{path:"/dog-profile",label:"Mon Chien",icon:c},{path:"/social-feed",label:"Communauté",icon:m},{path:"/adoption",label:"Adoption",icon:p},{path:"/daily-tip",label:"Conseils",icon:x},{path:"/recipes",label:"Recettes",icon:d,premium:!0},{path:"/reminders",label:"Rappels",icon:u,premium:!0}],t=a=>s.pathname===a||s.pathname.startsWith(a+"/");return e.jsx("div",{className:"sticky top-[73px] z-40 bg-white border-b border-gray-200",children:e.jsx("div",{className:"max-w-screen-xl mx-auto",children:e.jsx("div",{className:"flex overflow-x-auto scrollbar-hide",children:n.map(a=>{const r=a.icon,o=t(a.path);return e.jsxs("button",{onClick:()=>i(a.path),className:`
                  flex-shrink-0 flex items-center justify-center gap-2 py-4 px-4
                  font-medium text-sm transition-all relative
                  ${o?"text-blue-600":"text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
                `,children:[e.jsx(r,{size:20}),e.jsx("span",{className:"whitespace-nowrap",children:a.label}),a.premium&&e.jsx(f,{size:"sm",variant:"minimal"}),o&&e.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"})]},a.path)})})})})};export{j as T};
