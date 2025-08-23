import {buyItem, subscribe, buyLifetime} from './payments.js';
export function wirePurchases(){
  const modal=document.getElementById('paypal-modal'); const close=document.getElementById('paypal-modal-close');
  if(close) close.onclick=()=>modal.classList.add('hidden');
  document.body.addEventListener('click',e=>{
    const b=e.target.closest('.buy-btn'); if(b){ e.preventDefault(); if(modal) modal.classList.remove('hidden'); buyItem(b.dataset.id, b.dataset.kind); }
    const s=e.target.closest('[data-sub]'); if(s){ e.preventDefault(); if(modal) modal.classList.remove('hidden'); subscribe(s.dataset.sub); }
    const L=e.target.closest('#buy-lifetime'); if(L){ e.preventDefault(); if(modal) modal.classList.remove('hidden'); buyLifetime(); }
  });
}
