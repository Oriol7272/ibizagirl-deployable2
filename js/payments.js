import {plan, unlocks} from './lock-guard.js';
export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };
export function ensurePayPalLoaded(){
  return new Promise((res,rej)=>{
    if(window.paypal) return res();
    const cid=window.__ENV?.PAYPAL_CLIENT_ID;
    if(!cid) return rej('PAYPAL_CLIENT_ID vacío');
    const s=document.createElement('script');
    s.src=`https://www.paypal.com/sdk/js?client-id=${cid}&currency=EUR&components=buttons,subscriptions,marks`;
    s.onload=()=>res(); s.onerror=()=>rej('Fallo PayPal SDK'); document.head.appendChild(s);
  });
}
export async function buyItem(itemId, kind='photo'){
  await ensurePayPalLoaded();
  const cents=PRICES[kind];
  window.paypal.Buttons({
    style:{layout:'vertical',shape:'rect'},
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(cents/100).toFixed(2) }, description:`${kind}:${itemId}` }] }),
    onApprove:async(_d,a)=>{
      const det=await a.order.capture();
      if(det.status==='COMPLETED'){ unlocks.add(itemId); alert('✔ Desbloqueado'); location.reload(); }
    }
  }).render('#paypal-modal-target');
}
export async function subscribe(planKey='monthly'){
  await ensurePayPalLoaded();
  const MAP={ monthly:window.__ENV?.PAYPAL_PLAN_MONTHLY, yearly:window.__ENV?.PAYPAL_PLAN_YEARLY };
  const pid=MAP[planKey]; if(!pid){ alert('Plan no disponible'); return; }
  window.paypal.Buttons({
    createSubscription:(_d,a)=>a.subscription.create({ plan_id:pid }),
    onApprove:()=>{ plan.set(planKey); alert('✔ Suscripción activa'); location.reload(); }
  }).render('#paypal-modal-target');
}
export async function buyLifetime(){
  await ensurePayPalLoaded();
  const cents=PRICES.lifetime;
  window.paypal.Buttons({
    style:{layout:'vertical',shape:'rect'},
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(cents/100).toFixed(2) }, description:'lifetime:all' }] }),
    onApprove:async(_d,a)=>{
      const det=await a.order.capture();
      if(det.status==='COMPLETED'){ plan.set('lifetime'); alert('✔ Lifetime activo: todo desbloqueado y sin anuncios'); location.reload(); }
    }
  }).render('#paypal-modal-target');
}
