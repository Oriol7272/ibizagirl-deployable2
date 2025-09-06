import {seedToday, shuffleSeeded} from './utils.js';
export function startBannerRotation(){
  const el=document.getElementById('banner-rotator'); if(!el) return;
  const all=(window.DECOR_IMAGES||[]).filter(p=>!/paradise-beach\.png$/i.test(p));
  if(!all.length){ el.style.background='#0b1f33'; return; }
  const arr=shuffleSeeded(all, seedToday());
  let i=0;
  const apply=()=>{ el.style.backgroundImage='url("'+arr[i%arr.length]+'")'; i++; };
  apply(); setInterval(apply, 5000);
}
