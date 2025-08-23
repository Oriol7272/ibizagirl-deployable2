import {seedToday, shuffleSeeded} from './utils.js';
function pick(arr, n, seed){ if(!arr||!arr.length) return []; const s=shuffleSeeded(arr, seed); return s.slice(0, Math.min(n, s.length)); }
export function getDailySets(){
  const seed = seedToday();
  const full = (window.FULL_IMAGES_POOL||[]).map((src,i)=>({id:'full-'+i, src, thumb:src, type:'photo'}));
  const premAll = [ ...(window.PREMIUM_IMAGES_PART1||[]), ...(window.PREMIUM_IMAGES_PART2||[]) ].map((src,i)=>({id:'p-'+i, src, type:'photo'}));
  const vidsAll = (window.PREMIUM_VIDEOS_POOL||[]).map((src,i)=>({id:'v-'+i, src, type:'video'}));

  const full20 = pick(full, 20, seed+1);
  const premium100 = pick(premAll, 100, seed+2);
  const vids20 = pick(vidsAll, 20, seed+3);

  // Thumbnails seguros desde FULL (si no hay full, usa decorative como backup)
  const thumbs = full.length ? full.map(x=>x.src) : (window.DECOR_IMAGES||[]);
  const t = (idx)=> thumbs.length ? thumbs[idx % thumbs.length] : '';
  premium100.forEach((x,i)=> x.thumb = t(i) );
  vids20.forEach((x,i)=> x.thumb = t(i+123) );

  // Marca NEW 30%
  const newCount = Math.floor(premium100.length*0.3);
  const idx = pick(premium100.map((_,i)=>i), newCount, seed+4);
  const flag = new Set(idx);
  premium100.forEach((x,i)=>{ if(flag.has(i)) x.isNew=true; });

  return { full20, premium100, vids20 };
}
