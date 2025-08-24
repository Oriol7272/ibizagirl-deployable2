(function (g) {
  const ENV = (g && g.ENV) ? g.ENV : {};
  const CLIENT_ID   = (ENV.PAYPAL_CLIENT_ID || '').trim();
  const PLAN_MONTH  = (ENV.PAYPAL_PLAN_MONTHLY_1499 || ENV.PAYPAL_PLAN_MONTHLY || '').trim();
  const PLAN_YEAR   = (ENV.PAYPAL_PLAN_ANNUAL_4999  || ENV.PAYPAL_PLAN_ANNUAL  || '').trim();

  function loadPayPalSDK(currency) {
    return new Promise((resolve, reject) => {
      if (!CLIENT_ID) {
        console.warn('PAYPAL_CLIENT_ID vacío');
        return reject(new Error('PAYPAL_CLIENT_ID vacío'));
      }
      if (g.paypal) return resolve(g.paypal);

      const s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js'
            + '?client-id=' + encodeURIComponent(CLIENT_ID)
            + '&intent=subscription&vault=true&components=buttons'
            + '&currency=' + encodeURIComponent(currency || 'EUR');
      s.onload  = () => resolve(g.paypal);
      s.onerror = () => reject(new Error('No se pudo cargar el SDK de PayPal'));
      document.head.appendChild(s);
    });
  }

  async function mountButtonsMonthly(selector, opts={}) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) throw new Error('No existe contenedor de PayPal mensual');
    const paypal = await loadPayPalSDK(opts.currency || 'EUR');
    return paypal.Buttons({
      style: { layout:'vertical', color:'gold', shape:'rect', label:'paypal' },
      createSubscription: (data, actions) => {
        if (!PLAN_MONTH) throw new Error('PLAN mensual no configurado');
        return actions.subscription.create({ plan_id: PLAN_MONTH });
      },
      onApprove: (data) => {
        console.log('Sub MONTH aprobada:', data);
        if (g.Paywall && g.Paywall.setAccess) g.Paywall.setAccess({ subscription: true });
      }
    }).render(el);
  }

  async function mountButtonsAnnual(selector, opts={}) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) throw new Error('No existe contenedor de PayPal anual');
    const paypal = await loadPayPalSDK(opts.currency || 'EUR');
    return paypal.Buttons({
      style: { layout:'vertical', color:'gold', shape:'rect', label:'paypal' },
      createSubscription: (data, actions) => {
        if (!PLAN_YEAR) throw new Error('PLAN anual no configurado');
        return actions.subscription.create({ plan_id: PLAN_YEAR });
      },
      onApprove: (data) => {
        console.log('Sub YEAR aprobada:', data);
        if (g.Paywall && g.Paywall.setAccess) g.Paywall.setAccess({ subscription: true });
      }
    }).render(el);
  }

  g.Payments = { mountButtonsMonthly, mountButtonsAnnual };
})(window);
