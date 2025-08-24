import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { applyBlur, attachBuyHandlers, renderPrice } from '../paywall.js';
export async function initVideos(){
  const root=document.getElementById('app'); root.innerHTML = `<section class="grid" id="videoGrid"></section>`;
  const {vids20}=getDaily(); const grid=document.getElementById('videoGrid');
  vids20.forEach((it,i)=>{const id=it.id||it.file||`vid-${i}`;const poster=it.thumb||it.poster||it.src||it.file||it.url||it.path;const c=document.createElement('div');c.className='card';c.dataset.id=id;c.dataset.lock='1';c.innerHTML=`
    <video preload="metadata" muted playsinline poster="${poster}"></video>
    <div class="price"></div>
    <button class="btn" data-buy data-price="0.30" style="position:absolute;left:8px;bottom:8px">${t('unlock')}</button>`;grid.appendChild(c);renderPrice(c,0.30);});
  applyBlur(grid); await attachBuyHandlers(grid);
}
