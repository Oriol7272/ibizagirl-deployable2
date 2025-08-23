import {seedToday, shuffleSeeded} from './utils.js';
const pick=(arr,n,seed)=>{ if(!arr||!arr.length) return []; const s=[...arr]; for(let i=s.length-1;i>0;i--){ const r=(seed*9301+49297)%233280; seed=r; const j=Math.floor(r/233280*(i+1)); [s[i],s[j]]=[s[j],s[i]]; } return s.slice(0,Math.min(n,s.length)); };

export function getDailySets(){
  const seed = seedToday();
  // HOME: solo contenido público FULL
  const fullPool = (window.FULL_IMAGES_POOL||[]).map((src,i)=>({id:'full-'+i, src, thumb:src, type:'photo'}));
  const full20_carousel = pick(fullPool, 20, seed+1);
  const full20_grid     = pick(fullPool.filter(x=>!full20_carousel.includes(x)), 20, seed+2);

  // PREMIUM/VÍDEOS para sus páginas
  const premPool = [ ...(window.PREMIUM_IMAGES_PART1||[]), ...(window.PREMIUM_IMAGES_PART2||[]) ]
      .map((src,i)=>({id:'p-'+i, src, type:'photo'}));
  const vidsPool = (window.PREMIUM_VIDEOS_POOL||[]).map((src,i)=>({id:'v-'+i, src, type:'video'}));

  const premium100 = pick(premPool, 100, seed+3);
  const vids20     = pick(vidsPool, 20, seed+4);

  // Asigna thumbs seguros
  const safeThumb = (arr,i)=> fullPool.length ? fullPool[(i)%fullPool.length].src : (window.DECOR_IMAGES||[])[i%(window.DECOR_IMAGES||['']).length];
  premium100.forEach((x,i)=> x.thumb = safeThumb(premium100,i));
  vids20.forEach((x,i)=> x.thumb = safeThumb(vids20,i+123));

  // Marca NEW 30% en premium
  const newN = Math.floor(premium100.length*0.3);
  const idxs = pick(premium100.map((_,i)=>i), newN, seed+5);
  const set = new Set(idxs);
  premium100.forEach((x,i)=>{ if(set.has(i)) x.isNew = true; });

  return { full20_carousel, full20_grid, premium100, vids20 };
}
