import { ENV } from './env.js';

function loadPayPal(params){
  return new Promise((res, rej)=>{
    if (window.paypal) return res(window.paypal);
    const s=document.createElement('script');
    const q = new URLSearchParams({
      'client-id': ENV.PAYPAL_CLIENT_ID || '',
      'currency': 'EUR',
      'components': 'buttons',
      'intent': 'subscription', // importante para planes
      'vault': 'true'
    }).toString();
    s.src = `https://www.paypal.com/sdk/js?${q}`;
    s.onload = () => res(window.paypal);
    s.onerror = () => rej(new Error('PayPal SDK error'));
    document.head.appendChild(s);
  });
}

async function mountSubs(){
  try{
    const paypal = await loadPayPal();
    const mount = (id, planId) => {
      const el = document.getElementById(id);
      if(!el || !planId) return;
      paypal.Buttons({
        style: { layout:'vertical', color:'gold', label:'subscribe', shape:'pill' },
        createSubscription: (_, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: (data) => { alert('¡Suscripción activa! ID: '+data.subscriptionID); }
      }).render('#'+id);
    };
    mount('paypal-monthly', ENV.PAYPAL_PLAN_MONTHLY_1499);
    mount('paypal-annual',  ENV.PAYPAL_PLAN_ANNUAL_4999);
  }catch(e){
    console.error(e);
    alert('No se pudo cargar PayPal (400/401). Revisa que tu cuenta LIVE tenga Subscriptions activas y los Plan IDs.');
  }
}

function mountLifetime(){
  // Botón simple que redirige a PayPal o lanza un modal propio (placeholder).
  const btn = document.getElementById('lifetime-buy');
  if(!btn) return;
  btn.addEventListener('click', ()=> {
    alert('Lifetime: próximamente proceso de pago directo (100€).');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  mountSubs();
  mountLifetime();
});
