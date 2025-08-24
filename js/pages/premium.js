import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { applyBlur, attachBuyHandlers, renderPrice } from '../paywall.js';
export async function initPremium(){
  const root=document.getElementById('app'); root.innerHTML = `<section class="grid" id="premiumGrid"></section>`;
  const {prem100}=getDaily(); const grid=document.getElementById('premiumGrid');
  prem100.forEach((it,i)=>{const id=it.id||it.file||`prem-${i}`;const url=it.thumb||it.src||it.file||it.url||it.path;const c=document.createElement('div');c.className='card';c.dataset.id=id;c.dataset.lock='1';c.innerHTML=`
    ${it.isNew?`<div class="badge">${t('new')}</div>`:''}
    <img loading="lazy" src="${url}" alt="">
    <div class="price"></div>
    <button class="btn" data-buy data-price="0.10" style="position:absolute;left:8px;bottom:8px">${t('unlock')}</button>`;grid.appendChild(c);renderPrice(c,0.10);});
  applyBlur(grid); await attachBuyHandlers(grid);
}
