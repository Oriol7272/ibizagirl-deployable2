import {seedToday, shuffleSeeded} from './utils.js';
export function startBannerRotation(){
  const el=document.getElementById('banner-rotator'); if(!el) return;
  const imgs = (window.DECOR_IMAGES||[]).slice();
  if(!imgs.length){ el.style.background='#111'; return; }
  const arr = shuffleSeeded(imgs, seedToday()); let i=0;
  const apply=()=>{ el.style.backgroundImage = 'url(\"'+arr[i%arr.length]+'\")'; i++; };
  apply(); setInterval(apply, 6000);
}
