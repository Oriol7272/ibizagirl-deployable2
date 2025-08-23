export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };
function ensurePayPal(){ return new Promise((res,rej)=>{ if(window.paypal) return res(); const cid=window.__ENV?.PAYPAL_CLIENT_ID; if(!cid) return rej('PAYPAL_CLIENT_ID empty'); const s=document.createElement('script'); s.src='https://www.paypal.com/sdk/js?client-id='+cid+'&currency=EUR&components=buttons,subscriptions,marks'; s.onload=res; s.onerror=()=>rej('PayPal load fail'); document.head.appendChild(s); }); }
export async function buyItem(itemId, kind='photo'){
  await ensurePayPal();
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES[kind]/100).toFixed(2) }, description:kind+':'+itemId }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('unlocks_'+itemId,'1'); alert('Unlocked'); location.reload(); } }
  }).render('#paypal-modal-target');
}
export async function subscribe(planKey='monthly'){
  await ensurePayPal();
  const MAP={ monthly:window.__ENV?.PAYPAL_PLAN_MONTHLY, yearly:window.__ENV?.PAYPAL_PLAN_YEARLY };
  const pid=MAP[planKey]; if(!pid){ alert('Plan not available'); return; }
  window.paypal.Buttons({ createSubscription:(_d,a)=>a.subscription.create({ plan_id:pid }), onApprove:()=>{ localStorage.setItem('plan', planKey); alert('Subscription active'); location.reload(); } }).render('#paypal-modal-target');
}
export async function buyLifetime(){
  await ensurePayPal();
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES.lifetime/100).toFixed(2) }, description:'lifetime:all' }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('plan','lifetime'); document.documentElement.classList.add('hide-ads'); alert('Lifetime active'); location.reload(); } }
  }).render('#paypal-modal-target');
}
