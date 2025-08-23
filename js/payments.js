export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };
function ensurePayPal(){
  return new Promise((res,rej)=>{
    if(window.paypal) return res();
    const cid=window.__ENV?.PAYPAL_CLIENT_ID||'';
    if(!cid){
      alert('PAYPAL_CLIENT_ID no configurado en Vercel (Environment Variables).');
      return rej('missing client id');
    }
    const s=document.createElement('script');
    s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&components=buttons,subscriptions,marks';
    s.onload=res; s.onerror=()=>{ alert('No se pudo cargar PayPal (400/401). Revisa client-id y que el dominio este permitido en PayPal.'); rej('sdk load fail'); };
    document.head.appendChild(s);
  });
}
export async function buyItem(itemId, kind='photo'){
  await ensurePayPal();
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES[kind]/100).toFixed(2) }, description:kind+':'+itemId }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('unlocks_'+itemId,'1'); alert('Desbloqueado'); location.reload(); } }
  }).render('#paypal-modal-target');
}
export async function subscribe(planKey='monthly'){
  await ensurePayPal();
  const MAP={ monthly:window.__ENV?.PAYPAL_PLAN_MONTHLY, yearly:window.__ENV?.PAYPAL_PLAN_YEARLY };
  const pid=MAP[planKey]; if(!pid){ alert('Plan no disponible (revisa PAYPAL_PLAN_* en Vercel)'); return; }
  window.paypal.Buttons({ createSubscription:(_d,a)=>a.subscription.create({ plan_id:pid }), onApprove:()=>{ localStorage.setItem('plan', planKey); alert('Suscripcion activa'); location.reload(); } }).render('#paypal-modal-target');
}
export async function buyLifetime(){
  await ensurePayPal();
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES.lifetime/100).toFixed(2) }, description:'lifetime:all' }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('plan','lifetime'); document.documentElement.classList.add('hide-ads'); alert('Lifetime activo'); location.reload(); } }
  }).render('#paypal-modal-target');
}
