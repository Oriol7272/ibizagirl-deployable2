export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };

function loadSDK({subs=false}={}){
  return new Promise((resolve,reject)=>{
    // Quita SDK previo si el modo cambia
    if(window.paypal){
      const s=document.getElementById('pp-sdk');
      const wantSubs=subs;
      if(s && ((s.dataset.subs==='1')!==wantSubs)){ s.remove(); delete window.paypal; }
      else return resolve();
    }
    const cid = window.__ENV && window.__ENV.PAYPAL_CLIENT_ID;
    if(!cid){ alert('PAYPAL_CLIENT_ID vacío. Revisa ENV en Vercel.'); return reject(new Error('missing client id')); }
    const comps = subs ? 'buttons,subscriptions,marks' : 'buttons,marks';
    const intent = subs ? 'subscription' : 'capture';
    const vault = subs ? '&vault=true' : '';
    const url = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent='+intent+vault+'&components='+comps;
    const s=document.createElement('script'); s.id='pp-sdk'; s.dataset.subs=subs?'1':'0'; s.src=url;
    s.onload=()=> resolve();
    s.onerror=()=>{ alert('No se pudo cargar PayPal (400/401). Si es suscripción, activa Subscriptions en tu cuenta LIVE o revisa los Plan IDs.'); reject(new Error('sdk load fail')); };
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
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('plan','lifetime'); document.documentElement.classList.add('hide-ads'); alert('Lifetime activo (sin anuncios)'); location.reload(); } }
  }).render('#paypal-modal-target');
}
