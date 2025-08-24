import { money, isUnlocked, markUnlocked, isSubscribed } from './utils.js';
import { loadPayPal } from './integrations.js';
export function applyBlur(container){
  container.querySelectorAll('[data-lock]').forEach(el=>{
    const id=el.getAttribute('data-id');
    if(isSubscribed() || isUnlocked(id)){ el.classList.remove('blurred'); el.querySelector('.price')?.classList.add('hidden'); return; }
    el.classList.add('blurred');
  });
}
export async function attachBuyHandlers(container){
  await loadPayPal(); if(!window.paypal) return;
  container.querySelectorAll('[data-buy]').forEach(btn=>{
    if(btn.dataset.bound) return; btn.dataset.bound='1';
    btn.addEventListener('click',async()=>{
      const card=btn.closest('[data-id]'); const id=card.getAttribute('data-id'); const price=parseFloat(btn.getAttribute('data-price'));
      try{
        const buttons=paypal.Buttons({
          createOrder:(_d,actions)=>actions.order.create({purchase_units:[{amount:{value:price.toFixed(2),currency_code:'EUR'},description:`IBG item ${id}`}] }),
          onApprove:async(_d,actions)=>{await actions.order.capture(); markUnlocked(id); card.classList.remove('blurred'); card.querySelector('.price')?.classList.add('hidden');}
        });
        const tmp=document.createElement('div'); tmp.style.display='none'; document.body.appendChild(tmp); buttons.render(tmp);
      }catch(e){console.error('Pay error',e)}
    });
  });
}
export function renderPrice(el,v){let p=el.querySelector('.price'); if(!p){p=document.createElement('div'); p.className='price'; el.appendChild(p);} p.textContent=money(v);}
