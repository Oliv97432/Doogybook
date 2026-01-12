import{r as o}from"./vendor-react-DEK6ZklB.js";import{u as m,s as i}from"./index-CA2N9EnP.js";const A=()=>{const{user:t}=m(),[l,s]=o.useState([]),[u,n]=o.useState(0),[f,d]=o.useState(!0);o.useEffect(()=>{if(!(t!=null&&t.id))return;c();const e=i.channel("notifications").on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:`user_id=eq.${t.id}`},r=>{c()}).subscribe();return()=>{i.removeChannel(e)}},[t==null?void 0:t.id]);const c=async()=>{if(t!=null&&t.id)try{d(!0);const{data:e,error:r}=await i.from("notifications").select(`
          *,
          actor:actor_id (
            id,
            email,
            user_profiles (
              full_name,
              avatar_url
            )
          ),
          post:post_id (
            id,
            title,
            content
          ),
          comment:comment_id (
            id,
            content
          )
        `).eq("user_id",t.id).order("created_at",{ascending:!1}).limit(50);if(r)throw r;s(e||[]),n((e==null?void 0:e.filter(a=>!a.is_read).length)||0)}catch(e){console.error("Erreur fetch notifications:",e)}finally{d(!1)}};return{notifications:l,unreadCount:u,loading:f,markAsRead:async e=>{try{await i.from("notifications").update({is_read:!0}).eq("id",e),s(r=>r.map(a=>a.id===e?{...a,is_read:!0}:a)),n(r=>Math.max(0,r-1))}catch(r){console.error("Erreur mark as read:",r)}},markAllAsRead:async()=>{try{await i.from("notifications").update({is_read:!0}).eq("user_id",t.id).eq("is_read",!1),s(e=>e.map(r=>({...r,is_read:!0}))),n(0)}catch(e){console.error("Erreur mark all as read:",e)}},refresh:c}};export{A as u};
