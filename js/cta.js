import {subscribe,buyLifetime} from './payments.js';
document.addEventListener('DOMContentLoaded',()=>{
  const h=document.querySelector('header.site');if(!h)return;
  const bar=document.createElement('div');bar.className='cta-fixed';
  bar.innerHTML=`<strong>Lifetime</strong> — desbloquea todo y sin anuncios por <strong>100€</strong>
    <button id="cta-month" class="btn">Mensual 14,99€</button>
    <button id="cta-year" class="btn">Anual 49,99€</button>
    <button id="cta-life" class="btn">Comprar</button>`;
  h.after(bar);
  document.getElementById('cta-month').onclick=()=>subscribe('monthly');
  document.getElementById('cta-year').onclick=()=>subscribe('yearly');
  document.getElementById('cta-life').onclick=()=>buyLifetime();
})
