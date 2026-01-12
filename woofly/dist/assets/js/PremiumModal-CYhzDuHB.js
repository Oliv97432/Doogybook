import{j as e}from"./index-CLNZn26n.js";import{d as c}from"./vendor-react-DEK6ZklB.js";import{X as u,a2 as r,a as x,Y as p,a7 as f,a6 as h}from"./vendor-ui-DjEwDNDD.js";const N=({isOpen:o,onClose:t,reason:n="dogs"})=>{const l=c();if(!o)return null;const a={dogs:{icon:e.jsx(h,{size:48,className:"text-primary"}),title:"Limite atteinte : 1 chien",description:"Vous avez atteint la limite du compte gratuit. Passez Premium pour ajouter des chiens illimités !",features:["Chiens illimités ♾️","Photos illimitées 📸","Badge Premium 👑"]},photos:{icon:e.jsx(f,{size:48,className:"text-primary"}),title:"Limite atteinte : 10 photos",description:"Vous avez atteint la limite de 10 photos. Passez Premium pour un album photo illimité !",features:["Photos illimitées 📸","Chiens illimités ♾️","Badge Premium 👑"]},recipes:{icon:e.jsx(p,{size:48,className:"text-primary"}),title:"Recettes Premium",description:"Créez des recettes personnalisées et équilibrées pour votre chien avec notre générateur intelligent.",features:["Recettes sur mesure 🍽️","Calcul nutritionnel automatique 📊","Ingrédients 100% sécurisés ✅","Historique illimité 📚","Export PDF 📄"]}},s=a[n]||a.dogs,m=()=>{t(),l("/premium")};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn",onClick:t}),e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-card rounded-3xl max-w-md w-full shadow-2xl animate-slideUp",onClick:i=>i.stopPropagation(),children:[e.jsx("button",{onClick:t,className:"absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-smooth",children:e.jsx(u,{size:20,className:"text-muted-foreground"})}),e.jsxs("div",{className:"p-8 text-center",children:[e.jsx("div",{className:"w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center",children:s.icon}),e.jsx("h2",{className:"text-2xl font-bold text-foreground mb-3",children:s.title}),e.jsx("p",{className:"text-muted-foreground mb-6",children:s.description}),e.jsxs("div",{className:"bg-gradient-to-br from-primary/5 to-purple-50 rounded-2xl p-6 mb-6",children:[e.jsxs("div",{className:"flex items-center justify-center gap-2 mb-4",children:[e.jsx(r,{size:24,className:"text-primary"}),e.jsx("span",{className:"font-bold text-lg text-foreground",children:"Woofly Premium"})]}),e.jsx("div",{className:"space-y-3",children:s.features.map((i,d)=>e.jsxs("div",{className:"flex items-center gap-3 text-left",children:[e.jsx(x,{size:16,className:"text-primary flex-shrink-0"}),e.jsx("span",{className:"text-foreground font-medium",children:i})]},d))}),e.jsxs("div",{className:"mt-4 pt-4 border-t border-border",children:[e.jsxs("div",{className:"text-3xl font-bold text-primary mb-1",children:["3,99€",e.jsx("span",{className:"text-base font-normal text-muted-foreground",children:"/mois"})]}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"ou 39€/an (économisez 9€)"})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("button",{onClick:m,className:"w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-smooth flex items-center justify-center gap-2",children:[e.jsx(r,{size:20}),e.jsx("span",{children:"Passer Premium"})]}),e.jsx("button",{onClick:t,className:"w-full px-6 py-2 text-muted-foreground hover:text-foreground transition-smooth",children:"Plus tard"})]})]})]})}),e.jsx("style",{jsx:!0,children:`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `})]})};export{N as P};
