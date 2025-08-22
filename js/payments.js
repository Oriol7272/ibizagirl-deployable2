/**
 * payments.js — PayPal (LIVE) para:
 *  - Suscripciones: mensual/anual/lifetime (simulamos lifetime como pago único)
 *  - Pagos por ítem (foto 0.10€, video 0.30€)
 *  - Packs: 10 fotos 0.80€, 5 vídeos 1.00€
 *
 * Requiere que en el HTML exista un <div id="paypal-sdk-loader"></div> para cargar el SDK UNA vez.
 * Y contenedores con data-product, data-price, etc.
 */

(function () {
  const ST = {
    sdkLoaded: false,
    sdkPromise: null,
    clientId: null,
    currency: 'EUR',
  };

  // 1) Descarga config (clientId) del backend si existe, o del meta
  async function loadConfig() {
    // Opción A: /api/config devuelve { paypalClientId: "..." }
    try {
      const r = await fetch('/api/config', { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (j && j.paypalClientId) {
          ST.clientId = j.paypalClientId;
          return;
        }
      }
    } catch (_) {}
    // Opción B: meta-tag fallback
    const meta = document.querySelector('meta[name="paypal-client-id"]');
    if (meta) ST.clientId = meta.getAttribute('content');
  }

  // 2) Cargar SDK PayPal 1 sola vez
  function ensurePayPalSDK(params = '') {
    if (ST.sdkPromise) return ST.sdkPromise;
    ST.sdkPromise = new Promise(async (resolve, reject) => {
      if (!ST.clientId) await loadConfig();
      if (!ST.clientId) {
        console.error('PayPal: clientId no disponible');
        return reject(new Error('clientId missing'));
      }
      const qs = params || `client-id=${encodeURIComponent(ST.clientId)}&currency=${ST.currency}&intent=capture&components=buttons`;
      const src = `https://www.paypal.com/sdk/js?${qs}`;
      if (window.paypal) {
        ST.sdkLoaded = true;
        return resolve(window.paypal);
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => { ST.sdkLoaded = true; resolve(window.paypal); };
      s.onerror = () => reject(new Error('No se pudo cargar PayPal SDK'));
      document.head.appendChild(s);
    });
    return ST.sdkPromise;
  }

  // 3) Crear botón genérico (pago único)
  async function renderSinglePayButton({ container, description, value }) {
    const paypal = await ensurePayPalSDK();
    paypal.Buttons({
      style: { layout: 'horizontal', height: 40 },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { currency_code: ST.currency, value: value.toFixed(2) },
            description
          }]
        });
      },
      onApprove: async function (data, actions) {
        try {
          const details = await actions.order.capture();
          console.log('Pago capturado:', details);
          // Desbloqueo simple client-side:
          container.dispatchEvent(new CustomEvent('paid', { detail: { description, value, order: details } }));
        } catch (e) {
          console.error('Error al capturar:', e);
          alert('No se pudo completar el pago.');
        }
      }
    }).render(container);
  }

  // 4) Inicializar contenedores "data-paypal"
  async function initPayNowButtons() {
    const nodes = document.querySelectorAll('[data-paypal="single"]');
    nodes.forEach(async (el) => {
      const price = parseFloat(el.getAttribute('data-price') || '0');
      const label = el.getAttribute('data-label') || 'Compra';
      const product = el.getAttribute('data-product') || 'Item';
      const container = el.querySelector('.paypal-button') || el;
      await renderSinglePayButton({
        container,
        description: `${product} — ${label}`,
        value: price
      });
    });
  }

  // 5) Suscripciones
  // Nota: PayPal suscripciones reales usan "subscriptions" componente y planes.
  // Aquí, implementamos:
  //  - Mensual/Anual: pago único simulado + storage "isSubscriber" con expiración aproximada.
  //  - Lifetime: pago único y flag permanente.
  async function initSubscriptions() {
    const monthly = document.querySelector('#paypal-monthly');
    const yearly  = document.querySelector('#paypal-yearly');
    const life    = document.querySelector('#paypal-lifetime');

    async function make(container, { description, value, subType }) {
      await renderSinglePayButton({
        container,
        description,
        value
      });
      container.addEventListener('paid', (ev) => {
        try {
          const now = Date.now();
          if (subType === 'monthly') {
            localStorage.setItem('ibg_sub_until', String(now + 30*24*3600*1000));
          } else if (subType === 'yearly') {
            localStorage.setItem('ibg_sub_until', String(now + 365*24*3600*1000));
          } else if (subType === 'lifetime') {
            localStorage.setItem('ibg_sub_life', '1');
          }
          localStorage.setItem('ibg_is_sub', '1');
          alert('¡Suscripción activada! Refresca para desbloquear todo.');
        } catch (e) { console.warn(e); }
      });
    }

    if (monthly) await make(monthly, { description: 'Suscripción mensual', value: 3.99, subType: 'monthly' });
    if (yearly)  await make(yearly,  { description: 'Suscripción anual',   value: 24.99, subType: 'yearly'  });
    if (life)    await make(life,    { description: 'Acceso lifetime',     value: 49.99, subType: 'lifetime' });
  }

  // 6) API pública
  window.IBGPayments = {
    ensurePayPalSDK,
    initPayNowButtons,
    initSubscriptions,
  };

  // 7) Auto-init si hay data-paypal o contenedores de suscripción
  document.addEventListener('DOMContentLoaded', async () => {
    const needsSDK = document.querySelector('[data-paypal="single"], #paypal-monthly, #paypal-yearly, #paypal-lifetime');
    if (!needsSDK) return;
    const loader = document.getElementById('paypal-sdk-loader') || document.body;
    await ensurePayPalSDK(); // carga sdk
    await Promise.all([initPayNowButtons(), initSubscriptions()]);
  });
})();
