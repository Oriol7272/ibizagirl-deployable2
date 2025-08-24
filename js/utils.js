export function hashSeed(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return function(){let t=(a+=0x6D2B79F5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export function getDailySeed(){return hashSeed(new Date().toISOString().slice(0,10))}
export function shuffleSeeded(arr,seed){const a=arr.slice();const rnd=mulberry32(seed>>>0);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function sampleSeeded(arr,n,seed){return shuffleSeeded(arr,seed).slice(0,Math.min(n,arr.length))}
export function waitUntil(fn,timeout=10000,step=100){return new Promise((res,rej)=>{const t0=Date.now();const id=setInterval(()=>{try{const v=fn();if(v){clearInterval(id);res(v)}else if(Date.now()-t0>timeout){clearInterval(id);rej(new Error('timeout'))}}catch(e){clearInterval(id);rej(e)}},step)})}
export const money=(v)=>new Intl.NumberFormat(undefined,{style:'currency',currency:(window.IBG?.CURRENCY||'EUR')}).format(v);
export function isSubscribed(){try{return localStorage.getItem('ibg_sub_active')==='1'||localStorage.getItem('ibg_lifetime')==='1'}catch{return false}}
export function markUnlocked(id){try{const k='ibg_unlocked';const s=new Set(JSON.parse(localStorage.getItem(k)||'[]'));s.add(id);localStorage.setItem(k,JSON.stringify([...s]))}catch{}}
export function isUnlocked(id){try{const k='ibg_unlocked';const s=new Set(JSON.parse(localStorage.getItem(k)||'[]'));return s.has(id)}catch{return false}}
export function b64Decode(txt){try{return atob(txt||'')}catch{return ''}}
