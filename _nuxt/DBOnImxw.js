import{m as w,r as n,c as i,a as t,v as p,s as c,x as v,t as m,B as _,u as k,o as d,_ as h}from"./Bn0b61HB.js";import{u as B}from"./CymKluOc.js";const S={class:"container mx-auto p-4"},D={key:0,class:"text-red-500 text-sm"},I={key:0,class:"text-red-500 text-sm"},P=["disabled"],V=w({__name:"create",setup(C){const l=n(""),a=n(""),o=n(null),s=n(null),b=k(),x=B(),f=()=>{l.value.length>12?o.value="Название не должно превышать 12 символов":o.value=null},y=()=>{a.value.length>50?s.value="Описание не должно превышать 50 символов":s.value=null},g=async()=>{if(o.value||s.value)return;const u={title:l.value,description:a.value,createdAt:new Date().toISOString()};await x.createPost(u),b.push("/")};return(u,e)=>(d(),i("div",S,[t("button",{onClick:e[0]||(e[0]=r=>u.$router.push("/")),class:"bg-gray-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-600"}," Назад "),e[5]||(e[5]=t("h1",{class:"text-2xl font-bold mb-4"},"Создать пост",-1)),t("form",{onSubmit:_(g,["prevent"]),class:"space-y-4"},[t("div",null,[e[3]||(e[3]=t("label",{for:"title",class:"block text-sm font-semibold text-gray-700"},"Название",-1)),p(t("input",{"onUpdate:modelValue":e[1]||(e[1]=r=>l.value=r),onInput:f,type:"text",id:"title",class:"border px-4 py-2 rounded-md w-full",placeholder:"Введите название поста",required:""},null,544),[[v,l.value]]),o.value?(d(),i("p",D,m(o.value),1)):c("",!0)]),t("div",null,[e[4]||(e[4]=t("label",{for:"description",class:"block text-sm font-semibold text-gray-700"},"Описание",-1)),p(t("textarea",{"onUpdate:modelValue":e[2]||(e[2]=r=>a.value=r),onInput:y,id:"description",rows:"4",class:"border px-4 py-2 rounded-md w-full",placeholder:"Введите описание поста",required:""},null,544),[[v,a.value]]),s.value?(d(),i("p",I,m(s.value),1)):c("",!0)]),t("button",{type:"submit",class:"bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400",disabled:!!o.value||!!s.value}," Создать ",8,P)],32)]))}}),M=h(V,[["__scopeId","data-v-80bf8fc7"]]);export{M as default};
