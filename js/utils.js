export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
export const money=(n,c='EUR')=>new Intl.NumberFormat(undefined,{style:'currency',currency:c}).format(n);
export const ls={get:(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(_){return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
export const vip={is:()=>!!(ls.get('ibg.vip')||ls.get('ibg.sub')==='active'),markLifetime:()=>ls.set('ibg.vip',true),markSub:()=>ls.set('ibg.sub','active')};
export const unlock={set:()=>new Set(ls.get('ibg.unlocked',[])),has:(id)=>new Set(ls.get('ibg.unlocked',[])).has(id)||vip.is(),add:(id)=>{const s=new Set(ls.get('ibg.unlocked',[]));s.add(id);ls.set('ibg.unlocked',[...s])}};
