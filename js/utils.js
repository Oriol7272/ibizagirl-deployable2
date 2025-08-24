export function hashSeed(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return function(){let t=(a+=0x6D2B79F5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export const getDailySeed=()=>hashSeed(new Date().toISOString().slice(0,10));
export function shuffleSeeded(arr,seed){const a=arr.slice();const rnd=mulberry32(seed>>>0);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export const sampleSeeded=(arr,n,seed)=>shuffleSeeded(arr,seed).slice(0,Math.min(n,arr.length));
export const isSubscribed=()=>{try{return localStorage.getItem('ibg_sub_active')==='1'||localStorage.getItem('ibg_lifetime')==='1'}catch{return false}};
export const b64Decode=t=>{try{return atob(t||'')}catch{return ''}};
export function imgUrl(it){return it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path}
