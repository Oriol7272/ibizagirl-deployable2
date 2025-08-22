(function () {
  const STATE = {
    cfg: null,
    sdkLoaded: false,
    hasSubs: false
  };

  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  async function fetchConfig() {
    try {
      const r = await fetch('/api/config', { cache: 'no-store' });
      if (!r.ok) throw new Error('config fetch failed');
      return await r.json();
    } catch (e) {
      console.error('❌ /api/config error', e);
      return { paypalClientId: "", paypalPlans: { monthly: "", annual: "", lifetime: "" } };
    }
  }

  function addScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const base = src.split('?')[0];
      if (document.querySelector(`script[src^="${base}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  async function loadSDK(clientId, intent) {
    const params = new URLSearchParams({
      'client-id': clientId,
      components: 'buttons',
      currency: 'EUR',
      'enable-funding': 'card',
      vault: 'true',
      intent
    });
    const url = `https://www.paypal.com/sdk/js?${params.toString()}`;
    await addScriptOnce(url);
  }

  function mountSingleButtons() {
    if (!window.paypal) return;
    const targets = $all('[data-paypal="single"] .paypal-button, [data-paypal="single"].paypal-button');
    targets.forEach(el => {
      const host = el.closest('[data-paypal="single"]') || el;
      const product = host.getAttribute('data-product') || 'Item';
      const price = parseFloat(host.getAttribute('data-price') || '0.10').toFixed(2);

      try {
        window.paypal.Buttons({
          style: { layout: 'horizontal', height: 35, label: 'pay' },
          createOrder: (_, actions) => actions.order.create({
            intent: 'CAPTURE',
            application_context: { shipping_preference: 'NO_SHIPPING' },
            purchase_units: [{ amount: { currency_code: 'EUR', value: price }, description: product }]
          }),
          onApprove: async (_, actions) => {
            try {
              const capture = await actions.order.capture();
              console.log('✅ Pago OK', product, price, capture);
              alert(`Pago completado: ${product} (${price} €)`);
            } catch (e) {
              console.error('❌ capture error', e);
              alert('No se pudo completar el pago.');
            }
          },
          onError: (err) => console.error('❌ PayPal single error', err)
        }).render(el);
      } catch (e) {
        console.warn('⚠️ paypal render single', e);
      }
    });
  }

  function mountSubscriptions(cfg) {
    if (!window.paypal) return;
    const map = cfg?.paypalPlans || {};
    const hosts = $all('[data-paypal="subscription"]');
    hosts.forEach(host => {
      const key = host.getAttribute('data-plan') || '';
      const explicit = host.getAttribute('data-plan-id') || '';
      const plan_id = explicit || map[key] || '';

      const target = host.querySelector('.paypal-button') || host;
      if (!plan_id) {
        target.innerHTML = '<div class="pay-error">⚠️ Falta plan_id</div>';
        console.warn('⚠️ Falta plan_id para', key);
        return;
      }

      try {
        window.paypal.Buttons({
          style: { layout: 'vertical', label: 'subscribe', height: 40 },
          createSubscription: (_, actions) => actions.subscription.create({ plan_id }),
          onApprove: (data) => {
            console.log('✅ Suscripción OK', data);
            alert('¡Suscripción activa!');
          },
          onError: (err) => console.error('❌ PayPal subs error', err)
        }).render(target);
      } catch (e) {
        console.warn('⚠️ paypal render subs', e);
      }
    });
  }

  async function main() {
    STATE.cfg = await fetchConfig();
    if (!STATE.cfg?.paypalClientId) {
      console.error('❌ Falta PAYPAL_CLIENT_ID');
      return;
    }

    STATE.hasSubs = $all('[data-paypal="subscription"]').length > 0;
    // Si hay suscripciones en la página, cargamos el SDK con intent=subscription (vale también para single)
    await loadSDK(STATE.cfg.paypalClientId, STATE.hasSubs ? 'subscription' : 'capture');
    STATE.sdkLoaded = true;

    mountSingleButtons();
    if (STATE.hasSubs) mountSubscriptions(STATE.cfg);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
