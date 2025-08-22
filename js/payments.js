/* payments.js — loader robusto + renderers (suscripciones, lifetime y per-item)
   Reglas clave del SDK:
   - Órdenes (pago único): components=buttons&intent=capture&currency=EUR
   - Suscripciones:      components=buttons&vault=true&intent=subscription
   ¡No mezclar "subscriptions" en components! */

/* -------------------- utilidades -------------------- */
const Payments = (() => {
  const state = {
    sdkPromise: null,
    mode: null, // 'order' | 'subscription'
    clientId: null,
    currency: 'EUR'
  };

  const getConfig = () => (window.CONFIG && window.CONFIG.payments) || {};

  function buildSdkUrl({ clientId, mode, currency='EUR' }) {
    const base = 'https://www.paypal.com/sdk/js';
    const params = new URLSearchParams();
    params.set('client-id', clientId);
    params.set('components', 'buttons');

    if (mode === 'subscription') {
      params.set('intent', 'subscription');
      params.set('vault', 'true');
    } else {
      params.set('intent', 'capture');
      params.set('currency', currency || 'EUR');
    }

    // Opcionales:
    // params.set('buyer-country', 'ES');
    // params.set('disable-funding', 'paylater,venmo'); // si quieres
    return `${base}?${params.toString()}`;
  }

  function loadSdk({ clientId, mode, currency='EUR' }) {
    if (!clientId) throw new Error('[payments] Falta CLIENT_ID');
    if (state.sdkPromise && state.mode === mode && state.clientId === clientId) {
      return state.sdkPromise;
    }
    state.mode = mode;
    state.clientId = clientId;
    state.currency = currency;

    const url = buildSdkUrl({ clientId, mode, currency });
    state.sdkPromise = new Promise((resolve, reject) => {
      // Evitar doble carga
      if (window.paypal && window.paypal.Buttons) return resolve(window.paypal);

      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => {
        if (window.paypal && window.paypal.Buttons) resolve(window.paypal);
        else reject(new Error('[payments] SDK cargado pero paypal.Buttons no disponible'));
      };
      s.onerror = () => reject(new Error('[payments] No se pudo cargar PayPal SDK'));
      document.head.appendChild(s);
    });

    return state.sdkPromise;
  }

  /* -------------------- renderers -------------------- */

  async function renderSubscriptions({ monthlyDivId, annualDivId, planMonthly, planAnnual }) {
    const cfg = getConfig();
    const clientId = cfg.clientId || cfg.CLIENT_ID;
    if (!clientId) {
      console.warn('[payments] Falta CLIENT_ID, no se renderizan botones de suscripción');
      return;
    }
    const paypal = await loadSdk({ clientId, mode: 'subscription' });

    function renderOne(targetId, planId) {
      const el = document.getElementById(targetId);
      if (!el) return;
      paypal.Buttons({
        style: { layout:'horizontal', color:'gold', label:'subscribe', height: 45 },
        createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: (data) => {
          console.log('[payments] Subscribed ok', targetId, data);
          try { localStorage.setItem('ibg_pro', '1'); } catch(_e){}
          alert('¡Suscripción activada! 🟢');
        },
        onError: (err) => {
          console.error('[payments] subscription error', targetId, err);
          alert('Error en suscripción. Reintenta más tarde.');
        }
      }).render(`#${targetId}`);
    }

    renderOne(monthlyDivId, planMonthly);
    renderOne(annualDivId, planAnnual);
  }

  async function renderLifetime({ targetId, priceEUR = 100.00, description = 'IbizaGirl.pics Lifetime' }) {
    const cfg = getConfig();
    const clientId = cfg.clientId || cfg.CLIENT_ID;
    if (!clientId) {
      console.warn('[payments] Falta CLIENT_ID para Lifetime');
      return;
    }
    const paypal = await loadSdk({ clientId, mode: 'order', currency: 'EUR' });

    const el = document.getElementById(targetId);
    if (!el) return;

    paypal.Buttons({
      style: { layout:'horizontal', color:'blue', label:'checkout', height: 45 },
      createOrder: (_data, actions) => actions.order.create({
        purchase_units: [{
          amount: { value: String(priceEUR.toFixed ? priceEUR.toFixed(2) : Number(priceEUR).toFixed(2)), currency_code: 'EUR' },
          description
        }]
      }),
      onApprove: async (_data, actions) => {
        try {
          const details = await actions.order.capture();
          console.log('[payments] Lifetime OK', details);
          try { localStorage.setItem('ibg_pro', '1'); } catch(_e){}
          alert('¡Pago Lifetime realizado! 🟢');
        } catch (e) {
          console.error('[payments] capture error', e);
          alert('Error al capturar el pago. Reintenta.');
        }
      },
      onError: (err) => {
        console.error('[payments] lifetime error', err);
        alert('Error en el pago. Reintenta.');
      }
    }).render(`#${targetId}`);
  }

  // Mini botón para VÍDEO (0,30 €) y FOTO (0,10 €). packs: 1€ (5 vídeos), 0,80€ (10 fotos)
  async function renderMiniBuyButton({ selector, priceEUR, label='Comprar', meta={} }) {
    const cfg = getConfig();
    const clientId = cfg.clientId || cfg.CLIENT_ID;
    if (!clientId) return;

    const paypal = await loadSdk({ clientId, mode: 'order', currency: 'EUR' });
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((host) => {
      // Evitar re-render
      if (host.dataset.ppRendered) return;

      const btn = document.createElement('div');
      host.appendChild(btn);

      paypal.Buttons({
        style: { layout:'horizontal', color:'gold', label:'pay', height: 35, shape:'pill' },
        createOrder: (_data, actions) => actions.order.create({
          purchase_units: [{
            amount: { value: String(Number(priceEUR).toFixed(2)), currency_code: 'EUR' },
            description: `${label} • ${meta.type || 'asset'} ${meta.id || ''}`.trim()
          }]
        }),
        onApprove: async (_data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log('[payments] mini OK', details);
            alert('Pago completado ✅');
          } catch (e) {
            console.error('[payments] mini capture error', e);
            alert('No se pudo capturar el pago.');
          }
        },
        onError: (err) => console.error('[payments] mini error', err)
      }).render(btn);

      host.dataset.ppRendered = '1';
    });
  }

  return {
    loadSdk,
    renderSubscriptions,
    renderLifetime,
    renderMiniBuyButton
  };
})();

/* Exponer globalmente por si hiciera falta */
window.Payments = Payments;
