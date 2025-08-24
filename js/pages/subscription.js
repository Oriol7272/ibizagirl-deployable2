import { t } from '../i18n.js';
import { loadPayPal } from '../integrations.js';
export async function initSubscription(){
  const root=document.getElementById('app');
  const M=window.IBG?.PAYPAL_PLAN_MONTHLY_1499||''; const Y=window.IBG?.PAYPAL_PLAN_ANNUAL_4999||'';
  root.innerHTML=`<div style="padding:16px">
    <h2>${t('subs')}</h2>
    <p class="small">Mensual 14,99€ · Anual 49,99€ · ${t('lifetime')}</p>
    <div id="paypal-monthly"></div><div id="paypal-yearly" style="margin-top:12px"></div>
    <hr style="border-color:#274f6a;margin:16px 0">
    <h3>${t('lifetime')}</h3><div id="paypal-lifetime"></div>
    <p class="small">Tras comprar lifetime se desactivan todos los anuncios automáticamente.</p></div>`;
  await loadPayPal(); if(!window.paypal) return;
  if(M){ paypal.Buttons({style:{color:'gold',label:'subscribe',layout:'horizontal'},
    createSubscription:(_d,a)=>a.subscription.create({plan_id:M}),
    onApprove:()=>{localStorage.setItem('ibg_sub_active','1');alert('✅ Suscripción mensual activa');location.href='/index.html';}
  }).render('#paypal-monthly'); }
  if(Y){ paypal.Buttons({style:{color:'gold',label:'subscribe',layout:'horizontal'},
    createSubscription:(_d,a)=>a.subscription.create({plan_id:Y}),
    onApprove:()=>{localStorage.setItem('ibg_sub_active','1');alert('✅ Suscripción anual activa');location.href='/index.html';}
  }).render('#paypal-yearly'); }
  paypal.Buttons({style:{color:'blue',label:'pay',layout:'horizontal'},
    createOrder:(_d,a)=>a.order.create({purchase_units:[{amount:{value:'100.00',currency_code:'EUR'},description:'IBG Lifetime'}]}),
    onApprove:async(_d,a)=>{await a.order.capture();localStorage.setItem('ibg_lifetime','1');alert('🎉 Lifetime activado (sin anuncios)');location.href='/index.html';}
  }).render('#paypal-lifetime');
}
