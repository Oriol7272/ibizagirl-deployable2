(function (global) {
  const cfg = global.PaymentsConfig || {};
  const CURRENCY = cfg.CURRENCY || 'EUR';
  const CLIENT_ID = cfg.LIVE_CLIENT_ID;
  const BUYER_COUNTRY = 'ES';

  if (!CLIENT_ID) {
    console.warn('[payments] Falta LIVE_CLIENT_ID en PaymentsConfig. No se renderizan botones.');
    return;
  }

  function loadSdk(params, namespace) {
    return new Promise(function (resolve, reject) {
      if (global[namespace]) return resolve(global[namespace]);
      const base = 'https://www.paypal.com/sdk/js';
      const usp = new URLSearchParams(params);
      const s = document.createElement('script');
      s.src = base + '?' + usp.toString();
      s.async = true;
      s.setAttribute('data-namespace', namespace);
      s.onload = function () { resolve(global[namespace] || global.paypal); };
      s.onerror = function () { reject(new Error('PayPal SDK load failed: ' + s.src)); };
      document.head.appendChild(s);
    });
  }

  function ensureSubsSdk() {
    return loadSdk({
      'client-id': CLIENT_ID,
      components: 'buttons',
      currency: CURRENCY,
      intent: 'subscription',
      vault: 'true',
      'buyer-country': BUYER_COUNTRY,
      'disable-funding': 'paylater,card'
    }, 'paypal_subs');
  }

  function ensureCheckoutSdk() {
    return loadSdk({
      'client-id': CLIENT_ID,
      components: 'buttons',
      currency: CURRENCY,
      intent: 'capture',
      'buyer-country': BUYER_COUNTRY,
      'disable-funding': 'paylater,card'
    }, 'paypal_chk');
  }

  const Payments = {
    async renderSubscriptions(opts) {
      const o = Object.assign({
        monthly: null,
        annual: null,
        monthlyContainer: '#paypal-monthly',
        annualContainer: '#paypal-annual',
        style: { label: 'subscribe', layout: 'vertical', height: 40 }
      }, opts || {});
      const pp = await ensureSubsSdk();

      function subBtn(planId, container) {
        if (!planId || !container) return;
        pp.Buttons({
          style: o.style,
          createSubscription: (_d, actions) => actions.subscription.create({ plan_id: planId }),
          onApprove: (data) => { console.log('[payments] sub ok', data); location.href = cfg.SUBS_RETURN_URL || '/premium'; },
          onError: (err) => { console.warn('[payments] sub error', err); }
        }).render(container);
      }

      subBtn(o.monthly, o.monthlyContainer);
      subBtn(o.annual,  o.annualContainer);
    },

    async renderLifetime(opts) {
      const o = Object.assign({
        price: 100.00,
        description: 'Acceso de por vida a IbizaGirl.pics',
        container: '#paypal-lifetime',
        style: { label: 'pay', layout: 'vertical', height: 40 }
      }, opts || {});
      const pp = await ensureCheckoutSdk();

      pp.Buttons({
        style: o.style,
        createOrder: (_d, actions) => actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [{
            description: o.description,
            amount: { currency_code: CURRENCY, value: Number(o.price).toFixed(2) }
          }],
          application_context: { shipping_preference: 'NO_SHIPPING' }
        }),
        onApprove: (data, actions) =>
          actions.order.capture().then(order => {
            console.log('[payments] lifetime ok', order);
            location.href = cfg.CHECKOUT_RETURN_URL || '/premium';
          }),
        onError: (err) => { console.warn('[payments] lifetime error', err); }
      }).render(o.container);
    },

    async renderMiniBuy(opts) {
      const o = Object.assign({
        selector: '.mini-buy',
        price: 0.30,
        description: 'Compra vídeo IbizaGirl'
      }, opts || {});
      const nodes = Array.from(document.querySelectorAll(o.selector));
      if (!nodes.length) return;

      const pp = await ensureCheckoutSdk();
      nodes.forEach((node) => {
        pp.Buttons({
          style: { label: 'pay', layout: 'horizontal', height: 25 },
          createOrder: (_d, actions) => actions.order.create({
            purchase_units: [{
              description: o.description,
              amount: { currency_code: CURRENCY, value: Number(o.price).toFixed(2) }
            }],
            application_context: { shipping_preference: 'NO_SHIPPING' }
          }),
          onApprove: (data, actions) =>
            actions.order.capture().then(order => {
              console.log('[payments] video ok', order);
              node.closest('[data-item-id]')?.classList.add('unlocked');
            }),
          onError: (err) => { console.warn('[payments] video error', err); }
        }).render(node);
      });
    }
  };

  global.Payments = Payments;
})(window);
