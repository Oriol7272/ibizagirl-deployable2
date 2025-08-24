import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl, isSubscribed } from '../utils.js';
import { mountPayPerItem } from '../paypal.js';

export async function initVideos(){
  const root=document.getElementById('app');
  const {vids20}=getDaily();

  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('videos')}</h2>
    <section class="grid" id="vidGrid"></section>
  `;
  const grid=document.getElementById('vidGrid');

  vids20.forEach((it,i)=>{
    const id=it.id||it.file||`v-${i}`, u=imgUrl(it);
    const locked=!isSubscribed();
    const poster=u;
    const card=document.createElement('div'); card.className='card'; card.dataset.id=id;
    card.innerHTML = `
      <img loading="lazy" src="${poster}" alt="" style="${locked?'filter:blur(8px)':'filter:none'}">
      ${locked?`<div style="position:absolute;inset:auto 8px 8px auto;background:rgba(0,0,0,.6);padding:6px 8px;border-radius:999px;font-size:12px">${t('price_vid')}</div>`:''}
      <div style="position:absolute;inset:auto 8px 8px 8px;display:flex;gap:6px;justify-content:flex-end">
        ${locked?`<button class="btn" data-buy="${id}" data-amount="0.30">${t('buy')}</button>`:''}
      </div>
    `;
    grid.appendChild(card);
  });

  if(!isSubscribed()){
    mountPayPerItem('[data-buy]');
  }
}
