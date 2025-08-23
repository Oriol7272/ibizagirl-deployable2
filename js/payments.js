/* payments.js: un solo SDK por página, sin mezclar intents */
(function() {
  const state = { sdkParams: null, sdkPromise: null };

  function loadPayPal({ intent, components = 'buttons', vault = false }){
    const base = 'https://www.paypal.com/sdk/js';
    const { clientId, currency } = window.PAYMENTS_CONFIG;
    const params = new URLSearchParams({
      'client-id': clientId,
      components, currency
    });
    if (intent) params.set('intent', intent);
    if (vault)  params.set('vault', 'true');

    const nextParams = params.toString();
    if (state.sdkParams && state.sdkParams !== nextParams) {
      console.error('[payments] SDK ya cargado con otros parámetros:', state.sdkParams, ' / nuevo:', nextParams);
      return Promise.reject(new Error('paypal-sdk-params-mismatch'));
    }
    if (state.sdkPromise) return state.sdkPromise;

    state.sdkParams = nextParams;
    state.sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `${base}?${nextParams}`;
      s.async = true;
      s.onload = () => resolve(window.paypal);
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
      console.log('[payments] SDK loading', s.src);
    });
    return state.sdkPromise;
  }

  // Suscripciones (mensual/anual)
  async function renderSubscriptions(buttons) {
    await loadPayPal({ intent: 'subscription', vault: true, components: 'buttons' });
    if (!window.paypal || typeof window.paypal.Buttons !== 'function') throw new Error('paypal.Buttons no disponible');

    buttons.forEach(({ container, planId, label='Suscribirse' }) => {
      const el = (typeof container === 'string') ? document.querySelector(container) : container;
      if (!el) return;

      const btn = window.paypal.Buttons({
        style: { label: 'subscribe', layout: 'horizontal', height: 38 },
        createSubscription: function(data, actions) {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: function(data) {
          console.log('[PayPal] Sub approved', data);
          el.classList.add('paid');
        },
        onError: function(err) {
          console.error('[PayPal] Sub error', err);
        }
      });
      btn.render(el);
    });
  }

  // Pago único (vídeos, lifetime, etc.)
  async function renderCaptures(buttons) {
    await loadPayPal({ intent: 'capture', components: 'buttons' });
    if (!window.paypal || typeof window.paypal.Buttons !== 'function') throw new Error('paypal.Buttons no disponible');

    buttons.forEach(({ container, amount='0.30', description='Vídeo' }) => {
      const el = (typeof container === 'string') ? document.querySelector(container) : container;
      if (!el) return;

      const btn = window.paypal.Buttons({
        style: { label: 'buynow', layout: 'horizontal', height: 34 },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: { value: amount, currency_code: window.PAYMENTS_CONFIG.currency },
              description
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            console.log('[PayPal] Capture OK', details);
            el.classList.add('paid');
          });
        },
        onError: function(err) {
          console.error('[PayPal] Capture error', err);
        }
      });
      btn.render(el);
    });
  }

  window.Payments = { loadPayPal, renderSubscriptions, renderCaptures };
})();
