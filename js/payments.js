export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };

function pickPlanId(kind){
  const E = window.__ENV || {};
  const MAP = {
    monthly: [
      'PAYPAL_PLAN_MONTHLY','PAYPAL_MONTHLY_PLAN_ID','PAYPAL_PLAN_MENSUAL','PAYPAL_PLAN_MES','PAYPAL_SUBS_MONTHLY'
    ],
    yearly: [
      'PAYPAL_PLAN_YEARLY','PAYPAL_YEARLY_PLAN_ID','PAYPAL_PLAN_ANUAL','PAYPAL_PLAN_ANNUAL','PAYPAL_SUBS_YEARLY'
    ]
  };
  for(const key of (MAP[kind]||[])){
    if(E[key]) return E[key];
  }
  return null;
}

function loadSDK({subs=false}={}){
  return new Promise((resolve,reject)=>{
    if(window.paypal){
      const s=document.getElementById('pp-sdk');
      const want=subs?'1':'0';
      if(s && s.dataset.subs!==want){ s.remove(); delete window.paypal; }
      else return resolve();
    }
    const cid = (window.__ENV && window.__ENV.PAYPAL_CLIENT_ID) || '';
    if(!cid){ alert('PAYPAL_CLIENT_ID vacío en la página. Revisa ENV en Vercel.'); return reject(new Error('no cid')); }
    const comps = subs ? 'buttons,subscriptions,marks' : 'buttons,marks';
    const intent = subs ? 'subscription' : 'capture';
    const vault = subs ? '&vault=true' : '';
    const s=document.createElement('script');
    s.id='pp-sdk'; s.dataset.subs=subs?'1':'0';
    s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent='+intent+vault+'&components='+comps;
    s.onload=()=>resolve();
    s.onerror=()=>{ alert('No se pudo cargar PayPal (400/401). Si es suscripción, asegúrate de tener Subscriptions activo en LIVE y Plan IDs correctos.'); reject(new Error('sdk load')); };
    document.head.appendChild(s);
  });
}

export async function buyItem(itemId, kind='photo'){
  await loadSDK({subs:false});
  window.paypal.Buttons({
    createOrder:(_,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES[kind]/100).toFixed(2) }, description:kind+':'+itemId }] }),
    onApprove:async(_,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('unlocks_'+itemId,'1'); alert('Desbloqueado'); location.reload(); } }
  }).render('#paypal-modal-target');
}

export async function subscribe(kind='monthly'){
  const pid = pickPlanId(kind);
  if(!pid){ alert('No encuentro el Plan ID de '+kind+' en ENV. Revisa nombres en Vercel.'); return; }
  await loadSDK({subs:true});
  window.paypal.Buttons({
    createSubscription:(_,a)=>a.subscription.create({ plan_id:pid }),
    onApprove:()=>{ localStorage.setItem('plan', kind); alert('Suscripción activa'); location.reload(); }
  }).render('#paypal-modal-target');
}

export async function buyLifetime(){
  await loadSDK({subs:false});
  window.paypal.Buttons({
    createOrder:(_,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES.lifetime/100).toFixed(2) }, description:'lifetime:all' }] }),
    onApprove:async(_,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('plan','lifetime'); document.documentElement.classList.add('hide-ads'); alert('Lifetime activo (sin anuncios)'); location.reload(); } }
  }).render('#paypal-modal-target');
}
