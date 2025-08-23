(function (w, d) {
  const cfg = w.SITE_CONFIG || {};
  const CID = cfg.PAYPAL_CLIENT_ID || '';
  const CUR = cfg.CURRENCY || 'EUR';

  function log(){ try{console.log.apply(console, ['[payments]'].concat([].slice.call(arguments)));}catch(_){} }

  function loadSdk() {
    return new Promise((resolve, reject) => {
      if (!CID) { console.error('[payments] FALTA CLIENT_ID'); return reject(new Error('NO_CLIENT_ID')); }
      if (w.paypal) return resolve(w.paypal);
      const id = 'paypal-sdk-main';
      if (d.getElementById(id)) return d.getElementById(id).addEventListener('load', () => resolve(w.paypal));
      const s = d.createElement('script');
      s.id = id;
      s.src = 'https://www.paypal.com/sdk/js?client-id='
        + encodeURIComponent(CID)
        + '&components=buttons'
        + '&vault=true'
        + '&currency=' + encodeURIComponent(CUR);
      s.onload = () => resolve(w.paypal);
      s.onerror = () => reject(new Error('SDK_LOAD_ERROR'));
      d.head.appendChild(s);
    });
  }

  const Payments = {
    init: loadSdk,

    // Suscripciones (usa los plan_id del config si no se pasan en opts)
    async renderSubscriptions(opts = {}) {
      const paypal = await loadSdk();
      const monthlyId = opts.monthly || cfg.PAYPAL_PLAN_MONTHLY;
      const annualId  = opts.annual  || cfg.PAYPAL_PLAN_ANNUAL;
      const mSel = opts.monthlyContainer || '#paypal-monthly';
      const aSel = opts.annualContainer  || '#paypal-annual';

      if (monthlyId && mSel) {
        paypal.Buttons({
          style: { layout: 'horizontal', tagline: false, label: 'subscribe' },
          createSubscription: (data, actions) => actions.subscription.create({ plan_id: monthlyId }),
          onApprove: (data) => log('monthly ok', data),
          onError: (e) => console.warn('monthly error', e)
        }).render(mSel);
      }

      if (annualId && aSel) {
        paypal.Buttons({
          style: { layout: 'horizontal', tagline: false, label: 'subscribe' },
          createSubscription: (data, actions) => actions.subscription.create({ plan_id: annualId }),
          onApprove: (data) => log('annual ok', data),
          onError: (e) => console.warn('annual error', e)
        }).render(aSel);
      }
    },

    // Pago puntual para un botón concreto (vídeos o lifetime)
    async renderCheckout({ container, amount, description }) {
      const paypal = await loadSdk();
      return paypal.Buttons({
        style: { layout: 'horizontal', tagline: false, label: 'pay' },
        createOrder: (data, actions) =>
          actions.order.create({
            purchase_units: [
              { amount: { currency_code: CUR, value: String(amount || '1.00') }, description: description || 'Purchase' }
            ],
            application_context: { shipping_preference: 'NO_SHIPPING' }
          }),
        onApprove: (data, actions) => actions.order.capture().then(o => log('order ok', o)),
        onError: (e) => console.warn('checkout error', e)
      }).render(container);
    }
  };

  w.Payments = Payments;
})(window, document);
