export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
export const money=(n,c="EUR")=>new Intl.NumberFormat(undefined,{style:"currency",currency:c}).format(n);
export const ls={get:(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(_){return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
export const vip={is:()=>!!(ls.get("ibg.vip")||ls.get("ibg.sub")==="active"),markLifetime:()=>ls.set("ibg.vip",true),markSub:()=>ls.set("ibg.sub","active")};
export function todaySeed(){ return new Date().toISOString().slice(0,10).replace(/-/g,""); }
export const seedToday=todaySeed;
export function seededShuffle(arr,seedStr){let seed=0;for(let i=0;i<seedStr.length;i++)seed=(seed*31+seedStr.charCodeAt(i))>>>0;const a=arr.slice();for(let i=a.length-1;i>0;i--){seed=(1103515245*seed+12345)&0x7fffffff;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
export const shuffleSeeded=seededShuffle;
export const pickN=(arr,n,seed=null)=> (seed?seededShuffle(arr,seed):arr.slice().sort(()=>Math.random()-0.5)).slice(0,n);
export const uidFromPath=(p)=>String(p||"").replace(/^.*\//,"");
export const unlock={set:()=>new Set(ls.get("ibg.unlocked",[])),has:(id)=>new Set(ls.get("ibg.unlocked",[])).has(id)||vip.is(),add:(id)=>{const s=new Set(ls.get("ibg.unlocked",[]));s.add(id);ls.set("ibg.unlocked",[...s])}};
export const hasUnlock=(id)=>unlock.has(id);
export const addUnlock=(id)=>unlock.add(id);
export const getUnlocks=()=>Array.from(unlock.set());
if(typeof window!=="undefined"){window.Utils={ $, $$, money, ls, vip, todaySeed, seedToday, seededShuffle, shuffleSeeded, pickN, uidFromPath, unlock, hasUnlock, addUnlock, getUnlocks };}
