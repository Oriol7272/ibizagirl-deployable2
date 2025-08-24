(function(g){
  const ENV = g.ENV || {};
  function loadSDK(){
    return new Promise((res,rej)=>{
      if(g.paypal) return res(g.paypal);
      if(!ENV.PAYPAL_CLIENT_ID){ console.warn('PAYPAL_CLIENT_ID vacío'); return rej(new Error('PAYPAL_CLIENT_ID vacío')); }
      const s=document.createElement('script');
      const q=new URLSearchParams({ 'client-id': ENV.PAYPAL_CLIENT_ID, currency:'EUR', components:'buttons', intent:'subscription', vault:'true' }).toString();
      s.src = 'https://www.paypal.com/sdk/js?'+q; s.onload=()=>res(g.paypal); s.onerror=()=>rej(new Error('SDK error'));
      document.head.appendChild(s);
    });
  }
  function mountSubs(){
    loadSDK().then((paypal)=>{
      const mount=(id,planId)=>{ const el=document.getElementById(id); if(!el||!planId) return;
        paypal.Buttons({
          style:{layout:'vertical',color:'gold',label:'subscribe',shape:'pill'},
          createSubscription:(_,actions)=>actions.subscription.create({plan_id:planId}),
          onApprove:(data)=>alert('¡Suscripción activa! ID: '+data.subscriptionID)
        }).render('#'+id);
      };
      mount('paypal-monthly', ENV.PAYPAL_PLAN_MONTHLY_1499);
      mount('paypal-annual', ENV.PAYPAL_PLAN_ANNUAL_4999);
    }).catch((e)=>{ console.error(e); alert('No se pudo cargar PayPal (¿IDs/Live?).'); });
  }
  function mountLifetime(){
    const btn=document.getElementById('lifetime-buy'); if(!btn) return;
    btn.addEventListener('click', ()=>alert('Lifetime 100€ — flujo de pago se añade en el siguiente paso.'));
  }
  document.addEventListener('DOMContentLoaded', ()=>{ mountSubs(); mountLifetime(); });
})(window);
