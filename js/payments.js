(function (w, d) {
  'use strict';
  const CFG = w.PAYMENTS_CONFIG || {};
  let sdkPromise = null;
  function log(){ try{ console.debug('[payments]', ...arguments) }catch(e){} }

  function ensureSdk() {
    if (w.paypal) return Promise.resolve(w.paypal);
    if (sdkPromise) return sdkPromise;

    const params = new URLSearchParams({
      'client-id': CFG.clientId,
      components: 'buttons',
      currency: CFG.currency || 'EUR',
      intent: 'capture',
      vault: 'true',
      commit: 'true',
      'enable-funding': 'card'
    });
    const src = `https://www.paypal.com/sdk/js?${params.toString()}`;

    sdkPromise = new Promise((resolve, reject) => {
      const existing = d.getElementById('paypal-sdk');
      if (existing) {
        const tick = () => w.paypal ? resolve(w.paypal) : setTimeout(tick, 40);
        return tick();
      }
      const s = d.createElement('script');
      s.id = 'paypal-sdk';
      s.src = src;
      s.async = true;
      s.onload = () => w.paypal ? resolve(w.paypal) : reject(new Error('paypal sdk loaded but window.paypal undefined'));
      s.onerror = (e) => reject(e);
      d.head.appendChild(s);
    });
    return sdkPromise;
  }

  function renderSubscriptions(opts){
    const o = Object.assign({
      monthly: CFG.planMonthly,
      annual:  CFG.planAnnual,
      monthlyContainer: '#paypal-monthly',
      annualContainer:  '#paypal-annual'
    }, opts || {});
    return ensureSdk().then(paypal => {
      const mk = (planId) => ({
        style: { layout:'vertical', height:45, color:'gold', label:'subscribe' },
        createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: (data) => log('subscribe ok', data),
        onError: (err) => console.warn('[payments] subscribe error', err)
      });
      if (o.monthly && d.querySelector(o.monthlyContainer)) paypal.Buttons(mk(o.monthly)).render(o.monthlyContainer);
      if (o.annual  && d.querySelector(o.annualContainer))   paypal.Buttons(mk(o.annual)).render(o.annualContainer);
    });
  }

  function renderLifetime(opts){
    const o = Object.assign({
      container: '#paypal-lifetime',
      price: 100.00,
      description: 'Acceso lifetime a IbizaGirl.pics'
    }, opts || {});
    return ensureSdk().then(paypal => {
      const el = d.querySelector(o.container);
      if (!el) return;
      paypal.Buttons({
        style: { layout:'vertical', height:45, color:'gold', label:'pay' },
        createOrder: (_d, actions) => actions.order.create({
          purchase_units: [{
            description: o.description,
            amount: { currency_code: CFG.currency || 'EUR', value: Number(o.price).toFixed(2) }
          }]
        }),
        onApprove: (_d, actions) => actions.order.capture().then(order => log('lifetime ok', order)),
        onError: (err) => console.warn('[payments] lifetime error', err)
      }).render(el);
    });
  }

  function renderMiniBuy(opts){
    const o = Object.assign({
      selector: '.mini-buy',
      price: 0.30,
      description: 'Compra vídeo IbizaGirl'
    }, opts || {});
    return ensureSdk().then(paypal => {
      d.querySelectorAll(o.selector).forEach(node => {
        paypal.Buttons({
          style: { label:'pay', layout:'horizontal', height:38, tagline:false },
          createOrder: (_d, actions) => actions.order.create({
            purchase_units: [{
              description: o.description,
              amount: { currency_code: CFG.currency || 'EUR', value: Number(o.price).toFixed(2) }
            }]
          }),
          onApprove: (_d, actions) => actions.order.capture().then(order => {
            log('mini-buy ok', order);
            node.closest('[data-item-id]')?.classList.add('unlocked');
          }),
          onError: (err) => console.warn('[payments] mini-buy error', err)
        }).render(node);
      });
    });
  }

  w.Payments = { ensureSdk, renderSubscriptions, renderLifetime, renderMiniBuy };
})(window, document);
