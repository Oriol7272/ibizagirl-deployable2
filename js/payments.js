function env(k){const E=window.__ENV||{};return E[k]||null}
const CLIENT_ID = env('PAYPAL_CLIENT_ID');
const PLAN_MONTH = env('PAYPAL_PLAN_MONTHLY_1499') || env('PAYPAL_PLAN_MONTHLY') || env('PAYPAL_PLAN_MONTH') || null;
const PLAN_YEAR  = env('PAYPAL_PLAN_ANNUAL_4999') || env('PAYPAL_PLAN_YEARLY')  || env('PAYPAL_PLAN_ANNUAL') || null;
const CURRENCY='EUR';

function ensureSDK(){
  return new Promise((res,rej)=>{
    if(window.paypal) return res();
    if(!CLIENT_ID){ alert('Falta PAYPAL_CLIENT_ID en ENV'); return rej('no client'); }
    const s=document.createElement('script');
    s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CLIENT_ID)}&currency=${CURRENCY}&components=buttons,subscriptions,marks`;
    s.async=true; s.onload=()=>res(); s.onerror=()=>{alert('No se pudo cargar PayPal (400/401). Revisa client-id y dominios en PayPal.'); rej('sdk fail')};
    document.head.appendChild(s);
  })
}

function openModal(){ let m=document.getElementById('paypal-modal'); if(m){m.classList.remove('hidden'); return m;}
  m=document.createElement('div'); m.id='paypal-modal';
  m.innerHTML=`<div id="paypal-modal-bg"><div id="paypal-modal-card"><button id="paypal-modal-close">✕</button><div id="pp-container"></div></div></div>`;
  document.body.appendChild(m);
  document.getElementById('paypal-modal-close').onclick=()=>m.classList.add('hidden');
  return m
}

export async function subscribe(kind){
  try{
    await ensureSDK(); const pid = (kind==='monthly')? PLAN_MONTH: PLAN_YEAR;
    if(!pid){ alert(`No encuentro el Plan ID de ${kind} en ENV. Revisa nombres en Vercel.`); return; }
    const m=openModal();
    window.paypal.Buttons({
      style:{layout:'vertical',color:'gold',shape:'pill'},
      createSubscription: (_,actions)=> actions.subscription.create({plan_id: pid}),
      onApprove: (d)=>{ localStorage.setItem('IBG_SUB_ACTIVE','1'); alert('¡Suscripción activa!'); m.classList.add('hidden'); location.reload(); },
      onError: (e)=>{ console.error(e); alert('Error en suscripción.'); }
    }).render('#pp-container');
  }catch(e){console.error(e)}
}

export async function buyLifetime(){
  try{
    await ensureSDK();
    const m=openModal();
    window.paypal.Buttons({
      style:{layout:'vertical',color:'blue',shape:'pill'},
      createOrder: (_,actions)=> actions.order.create({purchase_units:[{amount:{value:'100.00',currency_code:CURRENCY}}]}),
      onApprove: async (_,actions)=>{await actions.order.capture(); localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); alert('¡Acceso de por vida activado y sin anuncios!'); m.classList.add('hidden'); location.reload(); }
    }).render('#pp-container');
  }catch(e){console.error(e)}
}
