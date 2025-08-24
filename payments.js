(function(){
  const C = (window.IBG_ENV||{}), P = (window.IBG_PAYMENTS||{plans:{}});
  const CLIENT_ID = C.PAYPAL_CLIENT_ID || '';
  const CURRENCY  = C.CURRENCY || 'EUR';

  function loadSDK(){
    return new Promise((res, rej)=>{
      if (window.paypal) return res();
      if (!CLIENT_ID){ console.warn('[PayPal] Falta PAYPAL_CLIENT_ID en env.js'); return rej(new Error('missing-client-id')); }
      const s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(CLIENT_ID)+'&currency='+encodeURIComponent(CURRENCY)+'&intent=capture&components=buttons';
      s.async = true;
      s.onload = ()=>res();
      s.onerror = ()=>rej(new Error('paypal-sdk-load-failed'));
      document.head.appendChild(s);
    });
  }

  async function render(amount){
    try{
      await loadSDK();
    }catch(e){ return; } // sin client id, no hace nada
    const mount = document.querySelector('#pp-container') || document.body;
    window.paypal.Buttons({
      style:{layout:'vertical', color:'blue', shape:'pill'},
      createOrder: (_, actions)=> actions.order.create({ purchase_units:[{ amount:{ value: amount, currency_code: CURRENCY }}]}),
      onApprove: async (_, actions)=>{
        try{
          await actions.order.capture();
          if (amount === (P.plans.lifetime || '100.00')){
            localStorage.setItem('IBG_LIFETIME','1');
          } else {
            localStorage.setItem('IBG_USER','premium');
          }
          document.documentElement.classList.add('hide-ads','is-premium');
          alert('Acceso activado. ¡Gracias!');
          location.reload();
        }catch(e){ console.error(e); }
      }
    }).render(mount);
  }

  window.IBG_buyMonthly  = ()=> render((P.plans.monthly  || '9.99'));
  window.IBG_buyLifetime = ()=> render((P.plans.lifetime || '100.00'));
})();
