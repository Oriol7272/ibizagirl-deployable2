(function (w, d) {
  'use strict';
  const CFG = w.IBZ_PAYPAL || {};
  const log = (...a) => console.log('[payments]', ...a);

  function loadSdk(kind) {
    return new Promise((resolve, reject) => {
      const id = kind === 'subs' ? 'pp-sdk-subs' : 'pp-sdk-order';
      const ns = kind === 'subs' ? 'paypal_subs' : 'paypal_order';
      if (w[ns]) return resolve(w[ns]);
      const existing = d.getElementById(id);
      if (existing && w[ns]) return resolve(w[ns]);

      const qs = new URLSearchParams({
        'client-id': CFG.clientId,
        components: 'buttons',
        currency: CFG.currency || 'EUR',
        'data-namespace': ns
      });
      if (kind === 'subs') { qs.set('intent', 'subscription'); qs.set('vault','true'); }
      else { qs.set('intent', 'capture'); }

      const s = d.createElement('script');
      s.id = id;
      s.src = 'https://www.paypal.com/sdk/js?' + qs.toString();
      s.onload = () => resolve(w[ns]);
      s.onerror = (e) => { console.warn('[payments] sdk load error', e); reject(e); };
      d.head.appendChild(s);
    });
  }

  async function renderSubscriptions(opts) {
    const paypal = await loadSdk('subs');
    const mc = d.querySelector(opts.monthlyContainer || '#paypal-monthly');
    const ac = d.querySelector(opts.annualContainer  || '#paypal-annual');
    if (mc && opts.monthly) {
      paypal.Buttons({
        style: { label: 'subscribe', layout: 'horizontal', tagline: false, height: 40 },
        createSubscription: (_d, a) => a.subscription.create({ plan_id: opts.monthly }),
        onApprove: (data) => log('monthly approved', data),
        onError: (err) => console.warn('[payments] monthly error', err)
      }).render(mc);
    }
    if (ac && opts.annual) {
      paypal.Buttons({
        style: { label: 'subscribe', layout: 'horizontal', tagline: false, height: 40 },
        createSubscription: (_d, a) => a.subscription.create({ plan_id: opts.annual }),
        onApprove: (data) => log('annual approved', data),
        onError: (err) => console.warn('[payments] annual error', err)
      }).render(ac);
    }
  }

  async function renderLifetime(opts) {
    const el = d.querySelector(opts.container || '#paypal-lifetime');
    if (!el) return;
    const paypal = await loadSdk('order');
    const price = Number(opts.price || 0).toFixed(2);
    const currency = CFG.currency || 'EUR';
    paypal.Buttons({
      style: { layout: 'horizontal', tagline: false, label: 'pay' },
      createOrder: (_d, a) => a.order.create({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: currency, value: price }, description: opts.description || 'Lifetime access' }],
        application_context: { shipping_preference: 'NO_SHIPPING' }
      }),
      onApprove: (_d, a) => a.order.capture().then(o => log('lifetime ok', o)),
      onError: (err) => console.warn('[payments] lifetime error', err)
    }).render(el);
  }

  async function renderMiniBuyButton(opts) {
    const el = typeof opts.selector === 'string' ? d.querySelector(opts.selector) : opts.el;
    if (!el) return;
    const paypal = await loadSdk('order');
    const price = Number(opts.price || 0).toFixed(2);
    const currency = CFG.currency || 'EUR';
    paypal.Buttons({
      style: { layout: 'horizontal', tagline: false, label: opts.label || 'pay' },
      createOrder: (_d, a) => a.order.create({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: currency, value: price }, description: opts.description || 'Buy video' }]
      }),
      onApprove: (_d, a) => a.order.capture().then(o => { log('mini-buy ok', o); if (typeof opts.onApprove==='function') opts.onApprove(o); }),
      onError: (err) => console.warn('[payments] mini-buy error', err)
    }).render(el);
  }

  w.Payments = { renderSubscriptions, renderLifetime, renderMiniBuyButton };
})(window, document);
