/**
 * payments.js — loader robusto del SDK y render de botones
 * - Lee window.PAYPAL_CONFIG (definida en js/pp-config.js)
 * - Renderiza suscripciones y lifetime si encuentra contenedores
 * - Evita 400/Bad Request por client-id vacío o parámetros incorrectos
 */
(function () {
  const CFG = (window.PAYPAL_CONFIG || {});
  const STATE = { sdkLoading: null, sdkLoaded: false, currentSrc: '' };

  function buildSdkSrc({ vault = false, intent = 'capture' } = {}) {
    const params = new URLSearchParams();
    params.set('client-id', CFG.clientId || '');
    params.set('components', 'buttons');
    params.set('currency', CFG.currency || 'EUR');
    if (vault) {
      params.set('vault', 'true');
      params.set('intent', 'subscription');
    } else {
      params.set('intent', intent || 'capture');
    }
    return `https://www.paypal.com/sdk/js?${params.toString()}`;
  }

  function loadSdk(opts) {
    // Si no hay clientId, no intentamos cargar nada (evita 400).
    if (!CFG.clientId || CFG.clientId === 'PEGA_AQUI_TU_CLIENT_ID_LIVE') {
      console.warn('[payments] Falta CLIENT_ID, no se renderizan botones.');
      return Promise.resolve(null);
    }

    const src = buildSdkSrc(opts);

    // Ya cargado y usable
    if (window.paypal && STATE.sdkLoaded) return Promise.resolve(window.paypal);

    // Si estamos cargando, reusa la promesa
    if (STATE.sdkLoading) return STATE.sdkLoading;

    // Si existe un <script id="paypal-sdk"> pero aún no cargó, espera
    const existing = document.getElementById('paypal-sdk');
    if (existing) {
      STATE.sdkLoading = new Promise((res, rej) => {
        existing.addEventListener('load', () => { STATE.sdkLoaded = true; res(window.paypal); }, { once: true });
        existing.addEventListener('error', () => rej(new Error('PayPal SDK load error')), { once: true });
      });
      return STATE.sdkLoading;
    }

    // Inyecta desde cero
    STATE.currentSrc = src;
    STATE.sdkLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.id = 'paypal-sdk';
      s.src = src;
      s.async = true;
      s.onload = () => { STATE.sdkLoaded = true; resolve(window.paypal); };
      s.onerror = () => reject(new Error('No se pudo cargar PayPal SDK'));
      document.head.appendChild(s);
    });

    return STATE.sdkLoading;
  }

  async function renderSubscription(containerId, planId) {
    try {
      const paypal = await loadSdk({ vault: true });
      if (!paypal) return;
      paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'subscribe' },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: (data) => {
          console.log('[payments] Sub OK:', data);
          alert('¡Suscripción activada!');   // TODO: desbloqueo UI real
        },
        onError: (err) => console.error('[payments] Sub error:', err)
      }).render('#' + containerId);
    } catch (e) {
      console.error('[payments] renderSubscription fallo:', e);
    }
  }

  async function renderOneTime(containerId, { amount, description }) {
    try {
      const paypal = await loadSdk({ vault: false, intent: 'capture' });
      if (!paypal) return;
      paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'pay' },
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{
            amount: { value: amount, currency_code: CFG.currency || 'EUR' },
            description: description || 'Payment'
          }]
        }),
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log('[payments] Capture OK:', details);
            alert('¡Pago completado!');
          } catch (e) { console.error('[payments] Capture error:', e); }
        },
        onError: (err) => console.error('[payments] OneTime error:', err)
      }).render('#' + containerId);
    } catch (e) {
      console.error('[payments] renderOneTime fallo:', e);
    }
  }

  function initSubscriptionsIfPresent() {
    const subs = CFG.subscriptions || {};
    const one = CFG.onetime || {};

    if (document.getElementById('paypal-monthly') && subs.monthly) {
      renderSubscription('paypal-monthly', subs.monthly);
    }
    if (document.getElementById('paypal-annual') && subs.annual) {
      renderSubscription('paypal-annual', subs.annual);
    }
    if (document.getElementById('paypal-lifetime') && one.lifetime) {
      renderOneTime('paypal-lifetime', { amount: one.lifetime.amount, description: one.lifetime.name });
    }
  }

  window.Payments = { loadSdk, renderSubscription, renderOneTime, initSubscriptionsIfPresent };

  // Auto-init en páginas donde existan los contenedores
  document.addEventListener('DOMContentLoaded', initSubscriptionsIfPresent);
})();
