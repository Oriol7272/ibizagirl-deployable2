export const dailySeed = () => new Date().toISOString().slice(0,10);
export function seededPick(arr, n, salt=''){
  const s = (dailySeed()+salt).split('').reduce((a,c)=>(a*33 + c.charCodeAt(0))>>>0,5381);
  const rnd = (a=>()=>((a=Math.imul(a^=a>>>15,1|a))+=(a^=a>>>7),((a^=a>>>14)>>>0)/4294967296))(s);
  const pool = arr.slice(); for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]}
  return pool.slice(0,Math.min(n,pool.length));
}
export const imgURL = it => it?.banner||it?.cover||it?.thumb||it?.src||it?.file||it?.url||it?.path;
