(function (w, d) {
  const cfg = w.PAYMENTS_CONFIG || {};
  const CURRENCY = cfg.currency || 'EUR';
  const log = (...a) => console.log('[payments]', ...a);

  let sdkPromise = null;
  function loadSdk() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      if (w.paypal && w.paypal.Buttons) { resolve(w.paypal); return; }
      const s = d.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js'
        + '?client-id=' + encodeURIComponent(cfg.clientId)
        + '&components=buttons'
        + '&currency=' + encodeURIComponent(CURRENCY)
        + '&vault=true'
        + '&intent=capture';
      s.onload = () => w.paypal ? resolve(w.paypal) : reject(new Error('SDK not available'));
      s.onerror = () => reject(new Error('SDK load error'));
      d.head.appendChild(s);
    });
    return sdkPromise;
  }

  async function renderSubscriptions(opts) {
    const paypal = await loadSdk();
    const m = d.querySelector(opts.monthlyContainer || '#paypal-monthly');
    const a = d.querySelector(opts.annualContainer  || '#paypal-annual');
    const l = d.querySelector(opts.lifetimeContainer || opts.container || '#paypal-lifetime');

    if (m && cfg.monthlyPlanId) {
      paypal.Buttons({
        style: { layout: 'vertical', label: 'subscribe' },
        createSubscription: (_, actions) => actions.subscription.create({ plan_id: cfg.monthlyPlanId }),
        onApprove: (data) => log('monthly subscribed', data),
      }).render(m);
    }

    if (a && cfg.annualPlanId) {
      paypal.Buttons({
        style: { layout: 'vertical', label: 'subscribe' },
        createSubscription: (_, actions) => actions.subscription.create({ plan_id: cfg.annualPlanId }),
        onApprove: (data) => log('annual subscribed', data),
      }).render(a);
    }

    if (l && Number.isFinite(Number(opts.lifetimePrice))) {
      paypal.Buttons({
        style: { layout: 'vertical' },
        createOrder: (_, actions) => actions.order.create({
          purchase_units: [{
            description: opts.lifetimeDescription || 'Acceso lifetime a IbizaGirl.pics',
            amount: { currency_code: CURRENCY, value: Number(opts.lifetimePrice).toFixed(2) }
          }],
          application_context: { shipping_preference: 'NO_SHIPPING' }
        }),
        onApprove: (data, actions) => actions.order.capture().then(det => log('lifetime paid', det)),
      }).render(l);
    }
  }

  async function renderMiniBuy(opts) {
    const paypal = await loadSdk();
    const selector = (opts && opts.selector) || '.mini-buy';
    const amount = (opts && opts.price) || 0.30;
    const description = (opts && opts.description) || 'Compra vídeo IbizaGirl';

    d.querySelectorAll(selector).forEach(el => {
      paypal.Buttons({
        style: { layout: 'horizontal', tagline: false, label: 'pay' },
        createOrder: (_, actions) => actions.order.create({
          purchase_units: [{
            description,
            amount: { currency_code: CURRENCY, value: Number(amount).toFixed(2) }
          }],
          application_context: { shipping_preference: 'NO_SHIPPING' }
        }),
        onApprove: (data, actions) =>
          actions.order.capture().then(det => { log('video paid', det); el.classList.add('paid'); }),
      }).render(el);
    });
  }

  w.Payments = { loadSdk, renderSubscriptions, renderMiniBuy };
})(window, document);
