import {qs, hasUnlock, plan} from './utils.js';

export function renderCarousel(el, items){
  if(!el) return; el.classList.add('carousel');
  const track=document.createElement('div'); track.className='carousel-track';
  items.forEach(it=>{
    const d=document.createElement('div'); d.className='carousel-item card';
    const img=document.createElement('img'); img.loading='lazy'; img.src=it.thumb||it.src; img.alt=''; d.appendChild(img);
    track.appendChild(d);
  });
  el.innerHTML=''; el.appendChild(track);
  let i=0; const N=items.length; if(N>1){
    setInterval(()=>{ i=(i+1)%N; track.style.transform='translateX(' + (-i*346) + 'px)'; }, 1000);
  }
}

export function renderGrid(el, items, {publicGrid=false, withPrice=false, kind='photo'}={}){
  if(!el) return; el.classList.add('grid'); el.innerHTML='';
  const userPlan = plan(); const hasPlan = (userPlan==='lifetime'||userPlan==='monthly'||userPlan==='yearly');
  items.forEach(it=>{
    const card=document.createElement('div'); card.className='card';
    const unlocked = publicGrid || hasPlan || hasUnlock(it.id);
    if(it.type==='video'){
      const v=document.createElement('video'); v.preload='none'; v.poster=it.thumb||'';
      if(unlocked && it.src){ const s=document.createElement('source'); s.src=it.src; s.type='video/mp4'; v.appendChild(s); v.controls=true; }
      if(!unlocked) v.classList.add('locked');
      card.appendChild(v);
    }else{
      const img=document.createElement('img'); img.loading='lazy'; img.src=it.thumb||it.src; if(!unlocked) img.classList.add('locked'); card.appendChild(img);
    }
    if(!unlocked){
      const buy=document.createElement('button'); buy.className='buy-btn'; buy.dataset.id=it.id; buy.dataset.kind=(it.type==='video'?'video':'photo'); buy.innerHTML='<span class="pp-icon"></span><span class="buy-label">Comprar</span>'; card.appendChild(buy);
    }
    if(withPrice){ const price=document.createElement('div'); price.className='badge-price'; price.textContent=(it.type==='video'?'€0,30':'€0,10'); card.appendChild(price); }
    if(it.isNew){ const bn=document.createElement('div'); bn.className='badge-new'; bn.textContent='NEW'; card.appendChild(bn); }
    el.appendChild(card);
  });
}

export function setCounter(sel, total, news){
  const c=qs(sel); if(!c) return;
  c.textContent = (typeof news==='number') ? ('Novedades de hoy: '+news+' - Total: '+total) : ('Total: '+total);
}
