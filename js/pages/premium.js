import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl, isSubscribed } from '../utils.js';
import { mountPayPerItem } from '../paypal.js';

export async function initPremium(){
  const root=document.getElementById('app');
  const {prem100,newSet}=getDaily();

  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('premium')}</h2>
    <section class="grid" id="premGrid"></section>
  `;
  const grid=document.getElementById('premGrid');

  prem100.forEach((it,i)=>{
    const id=it.id||it.file||`p-${i}`, u=imgUrl(it);
    const card=document.createElement('div'); card.className='card'; card.dataset.id=id;
    const isNew = newSet.has(id);
    const locked = !isSubscribed();
    card.innerHTML = `
      ${isNew?'<span class="badge">'+t('new')+'</span>':''}
      <img loading="lazy" src="${u}" alt="" style="${locked?'filter:blur(8px)':'filter:none'}">
      ${locked?`<div style="position:absolute;inset:auto 8px 8px auto;background:rgba(0,0,0,.6);padding:6px 8px;border-radius:999px;font-size:12px">${t('price_img')}</div>`:''}
      <div style="position:absolute;inset:auto 8px 8px 8px;display:flex;gap:6px;justify-content:flex-end">
        ${locked?`<button class="btn" data-buy="${id}" data-amount="0.10">${t('buy')}</button>`:''}
      </div>
    `;
    grid.appendChild(card);
  });

  if(!isSubscribed()){
    mountPayPerItem('[data-buy]'); // paypal por item
  }
}
