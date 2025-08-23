export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };

// Carga SDK con componentes dinámicos
function loadSDK({subs=false}={}){
  return new Promise((resolve,reject)=>{
    if(window.paypal) return resolve();
    const cid = window.__ENV && window.__ENV.PAYPAL_CLIENT_ID;
    if(!cid){ alert('PAYPAL_CLIENT_ID vacío. Revisa las variables en Vercel.'); return reject(new Error('missing client id')); }
    const comps = subs ? 'buttons,subscriptions,marks' : 'buttons,marks';
    const url = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent=capture&components='+comps;
    const s=document.createElement('script'); s.id='pp-sdk'; s.src=url;
    s.onload=()=> resolve();
    s.onerror=()=>{ alert('No se pudo cargar PayPal (400/401). Revisa client-id LIVE o permisos de Subscriptions.'); reject(new Error('sdk load fail')); };
    document.head.appendChild(s);
  });
}

export async function buyItem(itemId, kind='photo'){
  await loadSDK({subs:false});
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES[kind]/100).toFixed(2) }, description:kind+':'+itemId }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('unlocks_'+itemId,'1'); alert('Desbloqueado'); location.reload(); } }
  }).render('#paypal-modal-target');
}

export async function subscribe(planKey='monthly'){
  await loadSDK({subs:true});
  const MAP={ monthly:window.__ENV?.PAYPAL_PLAN_MONTHLY, yearly:window.__ENV?.PAYPAL_PLAN_YEARLY };
  const pid=MAP[planKey]; if(!pid){ alert('Plan no disponible (PAYPAL_PLAN_* en Vercel).'); return; }
  window.paypal.Buttons({
    createSubscription:(_d,a)=>a.subscription.create({ plan_id:pid }),
    onApprove:()=>{ localStorage.setItem('plan', planKey); alert('Suscripción activa'); location.reload(); }
  }).render('#paypal-modal-target');
}

export async function buyLifetime(){
  await loadSDK({subs:false});
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES.lifetime/100).toFixed(2) }, description:'lifetime:all' }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('plan','lifetime'); document.documentElement.classList.add('hide-ads'); alert('Lifetime activo'); location.reload(); } }
  }).render('#paypal-modal-target');
}
