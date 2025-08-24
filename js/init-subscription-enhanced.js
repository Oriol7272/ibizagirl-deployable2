(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const cfg = window.PaymentsConfig || {};
    try{
      if (window.Payments?.init) Payments.init({ clientId: cfg.clientId, currency: cfg.currency||'EUR' });
    }catch(e){ console.warn(e); }
    const m = document.querySelector('#paypal-monthly') || document.body.appendChild(Object.assign(document.createElement('div'),{id:'paypal-monthly'}));
    const a = document.querySelector('#paypal-annual')  || document.body.appendChild(Object.assign(document.createElement('div'),{id:'paypal-annual'}));
    const l = document.querySelector('#paypal-lifetime')|| document.body.appendChild(Object.assign(document.createElement('div'),{id:'paypal-lifetime'}));
    try{
      if (window.Payments?.renderSubscriptions) {
        Payments.renderSubscriptions({
          monthly: cfg.plans?.monthly,
          annual:  cfg.plans?.annual,
          monthlyContainer: '#paypal-monthly',
          annualContainer:  '#paypal-annual'
        });
      }
      if (window.Payments?.renderLifetime) {
        Payments.renderLifetime({
          container: '#paypal-lifetime',
          price: cfg.lifetime?.price || 100.00,
          description: cfg.lifetime?.description || 'Acceso lifetime a IbizaGirl.pics'
        });
      }
    }catch(e){ console.warn('subs/lifetime', e); }
  });
})();
