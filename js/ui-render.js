import {qs} from './utils.js';
import {plan, unlocks} from './lock-guard.js';
export function renderCarousel(el, items){
  if(!el) return;
  el.classList.add('carousel');
  const track=document.createElement('div'); track.className='carousel-track';
  for(const it of items){
    const d=document.createElement('div'); d.className='carousel-item card';
    const img=document.createElement('img'); img.loading='lazy'; img.src=it.thumb||it.src||it.url; img.alt=it.title||'';
    d.appendChild(img); track.appendChild(d);
  }
  el.innerHTML=''; el.appendChild(track);
}
export function renderGrid(el, items, {withPrice=false, lock=true, kind='photo'}={}){
  if(!el) return;
  el.classList.add('grid'); el.innerHTML='';
  const hasPlan = plan.get() !== 'none';
  for(const it of items){
    const card=document.createElement('div'); card.className='card';
    const media=(it.type==='video')?document.createElement('video'):document.createElement('img');
    media.loading='lazy'; media.src=it.thumb||it.src||it.url; media.alt=it.title||'';
    if(it.type==='video') media.muted=true;
    const shouldLock = lock && !hasPlan && !unlocks.has(it.id);
    if(shouldLock) media.classList.add('locked');
    card.appendChild(media);
    if(shouldLock){
      const buy=document.createElement('button');
      buy.className='buy-btn';
      buy.setAttribute('data-id', it.id || it.src || it.url || `${kind}-${Math.random()}`);
      buy.setAttribute('data-kind', it.type==='video'?'video':kind);
      buy.innerHTML='<span class="pp-icon" aria-hidden="true"></span><span class="buy-label"></span>';
      card.appendChild(buy);
    }
    if(withPrice){
      const price=document.createElement('div'); price.className='badge-price';
      price.textContent=it.priceLabel || (kind==='video'?'€0,30':'€0,10');
      card.appendChild(price);
    }
    if(it.isNew){ const bn=document.createElement('div'); bn.className='badge-new'; bn.textContent='NEW'; card.appendChild(bn); }
    el.appendChild(card);
  }
}
