(fun(fun(f() {
  const st = (msg) => {
    const el = document.getElementById('paypal-status');
    if (el) el.textContent = msg;
    console.log('[paypal]', msg);
  };

  function loadSDK(clientId, currency) {
    return new Promise((resolve, reject) => {
      if (!clientId) return reject(new Error('PAYPAL_CLIENT_ID vacío'));
      const url = new URL('https://www.paypal.com/sdk/js');
      url.searchParams.set('client-id', clientId);
      url.searchParams.set('currency', currency || 'EUR');
      url.searchParams.set('intent', 'subscription');
      url.searchParams.set('vault', 'true');
      url.searchParams.set('components', 'buttons');
      const s = document.createElement('script');
      s.src = url.toString();
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Fallo al cargar SDK PayPal'));
      document.head.appendChild(s);
    });
  }

  function renderSub(btnSelector, planId) {
    const el = document.querySelector(btnSelector);
    if (!el) return;
    if (!planId) { el.innerHTML = '<small>Falta PLAN_ID</small>'; return; }
    if (!window.paypal || !paypal.Buttons) { el.innerHTML = '<small>SDK no cargado</small>'; return; }
    paypal.Buttons({
      style: { layout: 'vertical', shape: 'pill', label: 'subscribe', height: 45 },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
      onApprove: (data) => {
        st('✅ Suscripción aprobada: ' + (data.subscriptionID||''));
      },
      onError: (err) => {
        console.error('[paypal] onError', err);
        st('⚠️ Error PayPal: ' + (err && err.message ? err.message : err));
      }
    }).render(el);
  }

  try {
    const ENV = window.__ENV||{};
    const cid = ENV.PAYPAL_CLIENT_ID || '';
    const cur = ENV.PAYPAL_CURRENCY || 'EUR';
    const planMonthly  = ENV.PAYPAL_PLAN_MONTHLY   || '';
    const planYearly   = ENV.PAYPAL_PLAN_YEARLY    || '';
    const planLifetime = ENV.PAYPAL_PLAN_LIFETIME  || '';

    st('Inicializando PayPal…');

    loadSDK(cid, cur).then(() => {
      st('SDK cargado. Renderizando botones…');
      renderSub('#paypal-monthly',  planMonthly);
      renderSub('#paypal-yearly',   planYearly);
      renderSub('#paypal-lifetime', planLifetime);
      st('Listo. Si no ves botones, revisa plan_id en env.js');
    }).catch(err => {
      console.error(err);
      st('⚠️ ' + err.message);
    });
  } catch (e) {
    console.error(e);
    st('⚠️ Error inesperado: ' + e.message);
  }
})();
