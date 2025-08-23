import {buyItem, subscribe} from './payments.js';
import {qsa,qs} from './utils.js';
function openModal(){ qs('#paypal-modal')?.classList.remove('hidden'); }
function closeModal(){ qs('#paypal-modal')?.classList.add('hidden'); qs('#paypal-modal-target').innerHTML=''; }
export function wireCardPurchases(rootSel='body'){
  const root=qs(rootSel) || document;
  root.addEventListener('click', (e)=>{
    const b=e.target.closest('.buy-btn'); if(!b) return;
    const id=b.getAttribute('data-id'); const kind=b.getAttribute('data-kind')||'photo';
    openModal(); buyItem(id, kind);
  });
  qs('#paypal-modal-close')?.addEventListener('click', closeModal);
  qs('#paypal-modal-bg')?.addEventListener('click', (ev)=>{ if(ev.target.id==='paypal-modal-bg') closeModal(); });
}
export function wireSubs(){
  qsa('[data-sub]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      openModal(); subscribe(btn.getAttribute('data-sub'));
    });
  });
  qs('#paypal-modal-close')?.addEventListener('click', ()=>qs('#paypal-modal')?.classList.add('hidden'));
}
