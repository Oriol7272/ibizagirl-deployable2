import { isSubscribed } from './utils.js';
function loadPaypal(){ return new Promise(res=>{ if(window.paypal){res();return;} const c=window.IBG?.PAYPAL_CLIENT_ID||''; const s=document.createElement('script'); s.src=`https://www.paypal.com/sdk/js?client-id=${c}&components=buttons,hosted-buttons,subscriptions&vault=true&intent=capture&currency=EUR`; s.onload=()=>res(); document.head.appendChild(s); }); }
export async function mountSubscriptions(selMonthly,selAnnual){
  await loadPaypal();
  const m = document.querySelector(selMonthly), a = document.querySelector(selAnnual);
  const mid = window.IBG?.PAYPAL_PLAN_MONTHLY_1499||'', aid = window.IBG?.PAYPAL_PLAN_ANNUAL_4999||'';
  if(m && mid){ paypal.Buttons({style:{shape:'pill',label:'subscribe'},createSubscription:(d,a)=>a.subscription.create({plan_id:mid}),onApprove:()=>{ localStorage.setItem('ibg_sub_active','1'); location.href='/index.html'; }}).render(m); }
  if(a && aid){ paypal.Buttons({style:{shape:'pill',label:'subscribe'},createSubscription:(d,a)=>a.subscription.create({plan_id:aid}),onApprove:()=>{ localStorage.setItem('ibg_sub_active','1'); location.href='/index.html'; }}).render(a); }
}
export async function mountLifetime(sel){
  await loadPaypal();
  const host=document.querySelector(sel);
  if(!host) return;
  paypal.Buttons({
    style:{shape:'pill',label:'pay'},
    createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:'100.00'},description:'IBIZAGIRL.PICS Lifetime'}]}),
    onApprove:async(d,a)=>{ await a.order.capture(); localStorage.setItem('ibg_lifetime','1'); localStorage.setItem('ibg_sub_active','1'); location.href='/index.html'; }
  }).render(host);
}
export async function mountPayPerItem(selector){
  await loadPaypal();
  document.querySelectorAll(selector).forEach(btn=>{
    const amount = btn.getAttribute('data-amount') || '0.10';
    const host = document.createElement('div'); host.style.marginTop='6px'; btn.parentElement.appendChild(host);
    paypal.Buttons({
      style:{shape:'pill',label:'pay'},
      createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:amount},description:'IBIZAGIRL.PICS item'}]}),
      onApprove:async(d,a)=>{ await a.order.capture(); /* aquí podrías desbloquear el item si quisieras; guardamos sub_active para UX */ localStorage.setItem('ibg_sub_active','1'); location.reload(); }
    }).render(host);
  });
}
