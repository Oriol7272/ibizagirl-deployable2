const ENV=window.__ENV||{};
const CURRENCY=(ENV.PP_CURRENCY||ENV.PAYPAL_CURRENCY||'EUR');
function getClientId(){return ENV.PP_CLIENT_LIVE||ENV.PAYPAL_CLIENT_ID||ENV.PP_CLIENT_ID||''}
function planId(k){
  if(k==='monthly') return ENV.PP_PLAN_MONTHLY||ENV.PAYPAL_PLAN_MONTHLY||ENV.SUB_MONTHLY_ID||'';
  if(k==='annual')  return ENV.PP_PLAN_ANNUAL ||ENV.PAYPAL_PLAN_ANNUAL ||ENV.SUB_ANNUAL_ID ||'';
  return '';
}
export function ensureSDK(){
  if(window.paypal) return Promise.resolve(window.paypal);
  const cid=getClientId(); if(!cid){console.error('NO PayPal CLIENT_ID'); return Promise.reject(new Error('NO_CLIENT'))}
  return new Promise((res,rej)=>{
    const src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cid)}&currency=${encodeURIComponent(CURRENCY)}&vault=true&intent=subscription&components=buttons,marks`;
    const s=document.createElement('script'); s.src=src; s.async=true;
    s.onload=()=>res(window.paypal); s.onerror=()=>rej(new Error('SDK_LOAD_FAIL'));
    document.head.appendChild(s);
  });
}
function ensureModal(){
  let m=document.getElementById('paypal-modal'); if(m) return m;
  m=document.createElement('div'); m.id='paypal-modal';
  m.innerHTML=`<div style="position:fixed;inset:0;background:#0008;display:flex;align-items:center;justify-content:center;z-index:9999">
    <div style="background:#fff;min-width:320px;max-width:90vw;border-radius:.8rem;padding:1rem;position:relative;color:#111">
      <button id="paypal-modal-close" style="position:absolute;top:.6rem;right:.8rem;background:none;border:none;font-size:1.2rem;cursor:pointer"></button>
      <div id="pp-container"></div>
    </div></div>`;
  document.body.appendChild(m);
  m.querySelector('#paypal-modal-close')?.addEventListener('click',()=>m.remove());
  return m;
}
export async function buyLifetime(){
  const price=(ENV.PP_LIFETIME_PRICE||'100.00');
  try{
    await ensureSDK(); const m=ensureModal();
    window.paypal.Buttons({
      style:{layout:'vertical',color:'blue',shape:'pill'},
      createOrder:(_d,a)=>a.order.create({purchase_units:[{amount:{value:String(price),currency_code:CURRENCY}}]}),
      onApprove:async(_d,a)=>{await a.order.capture(); localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso de por vida activado'); m.remove(); location.reload();}
    }).render('#pp-container');
  }catch(e){console.error('lifetime',e); alert('No se pudo iniciar PayPal');}
}
export async function buySubscription(kind){
  const pid=planId(kind); if(!pid){alert('Plan PayPal no configurado'); return;}
  try{
    await ensureSDK(); const m=ensureModal();
    window.paypal.Buttons({
      style:{layout:'vertical',color:'blue',shape:'pill'},
      createSubscription:(_d,a)=>a.subscription.create({plan_id:pid}),
      onApprove:async()=>{alert('Suscripcinnn activa'); m.remove(); location.reload();}
    }).render('#pp-container');
  }catch(e){console.error('sub',e); alert('No se pudo iniciar PayPal');}
}
export function wirePurchaseButtons(){
  document.querySelectorAll('[data-pp="lifetime"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); buyLifetime();}));
  document.querySelectorAll('[data-pp-sub="monthly"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); buySubscription('monthly');}));
  document.querySelectorAll('[data-pp-sub="annual"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); buySubscription('annual');}));
}
document.addEventListener('DOMContentLoaded',()=>{try{wirePurchaseButtons();}catch(e){}});
