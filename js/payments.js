export const PRICES={ photo:10, video:30, monthly:1499, yearly:4999, lifetime:10000 };

function pickPlanId(kind){
  const E = window.__ENV || {};
  // Acepta cualquier PAYPAL_PLAN_* que contenga monthly/mensual/mes o yearly/annual/anual
  const tests = (kind==='monthly')
    ? [/^PAYPAL_PLAN_.*(MONTHLY|MENSUAL|MES)/i]
    : [/^PAYPAL_PLAN_.*(YEARLY|ANNUAL|ANUAL)/i];
  let found=null;
  for(const [k,v] of Object.entries(E)){
    if(typeof v==='string' && v.startsWith('P-') && tests.some(rx=>rx.test(k))){ found=v; break; }
  }
  console.debug('[PayPal] ENV keys:', Object.keys(E));
  console.debug('[PayPal] kind=',kind,'pid=',found);
  return found;
}

function loadSDK({subs=false}={}){
  return new Promise((resolve,reject)=>{
    if(window.paypal){
      const tag=document.getElementById('pp-sdk');
      const want=subs?'1':'0';
      if(tag && tag.dataset.subs!==want){ tag.remove(); delete window.paypal; }
      else return resolve();
    }
    const cid = (window.__ENV && window.__ENV.PAYPAL_CLIENT_ID) || '';
    if(!cid){ alert('PAYPAL_CLIENT_ID vacío en ENV.'); return reject(new Error('no cid')); }
    const comps  = subs ? 'buttons,subscriptions,marks' : 'buttons,marks';
    const intent = subs ? 'subscription' : 'capture';
    const vault  = subs ? '&vault=true' : '';
    const s=document.createElement('script');
    s.id='pp-sdk'; s.dataset.subs=subs?'1':'0';
    s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent='+intent+vault+'&components='+comps;
    s.onload=()=>resolve();
    s.onerror=()=>{ alert('No se pudo cargar PayPal (400/401). Revisa que los planes sean LIVE y pertenezcan al mismo cliente.'); reject(new Error('sdk')); };
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

export async function subscribe(kind='monthly'){
  const pid = pickPlanId(kind);
  if(!pid){ alert('No encuentro el Plan ID de '+kind+' en ENV (mira consola).'); return; }
  await loadSDK({subs:true});
  window.paypal.Buttons({
    createSubscription:(_d,a)=>a.subscription.create({ plan_id:pid }),
    onApprove:()=>{ localStorage.setItem('plan', kind); alert('Suscripción activa'); location.reload(); }
  }).render('#paypal-modal-target');
}

export async function buyLifetime(){
  await loadSDK({subs:false});
  window.paypal.Buttons({
    createOrder:(_d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:(PRICES.lifetime/100).toFixed(2) }, description:'lifetime:all' }] }),
    onApprove:async(_d,a)=>{ const d=await a.order.capture(); if(d.status==='COMPLETED'){ localStorage.setItem('plan','lifetime'); document.documentElement.classList.add('hide-ads'); alert('Lifetime activo (sin anuncios)'); location.reload(); } }
  }).render('#paypal-modal-target');
}
