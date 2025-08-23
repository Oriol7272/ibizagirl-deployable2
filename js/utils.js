export const qs=(s,r=document)=>r.querySelector(s);
export const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
export const todaySeed=()=>{const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();};
export const storage={get:(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k))??d;}catch{return d;}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),del:(k)=>localStorage.removeItem(k)};
export const fmtEur=(c)=> (c/100).toFixed(2).replace('.',',');
