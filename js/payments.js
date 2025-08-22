/* =========================================================================
 * IbizaGirl.pics — payments.js (FULL)
 * - Expone: Payments.renderSubscriptions, Payments.renderMiniBuyButton, Payments.renderLifetime
 * - Carga dinámica del PayPal SDK (una sola vez) con parámetros correctos.
 * - Evita el 400 anterior (usamos components=buttons; vault=true solo en subs).
 * ========================================================================= */
(function (w, d) {
  const LOG = (...a) => console.log('[payments]', ...a);
  const WARN = (...a) => console.warn('[payments]', ...a);
  const ERR = (...a) => console.error('[payments]', ...a);

  const DEFAULTS = {
    currency: 'EUR',
    locale: 'es_ES',
    // Tus planes REALES (cámbialos si los renuevas):
    plans: {
      monthly: 'P-3WE8037612641383DNCUKNJI',  // 14,99 €/mes
      annual:  'P-43K261214Y571983RNCUKN7I'   // 49,99 €/año
    },
    amounts: {
      lifetime: '100.00',  // 100 €
      photo:    '0.10',    // 0,10 € (si alguna vez renderizas mini-botón en fotos)
      video:    '0.30'     // 0,30 € (mini-botón por vídeo)
    }
  };

  const state = {
    clientId: null,          // para suscripciones y pago único (puede ser el mismo)
    sdkLoadingKey: null,     // cadena con los parámetros de la URL del SDK
    sdkPromise: null
  };

  /** Construye la URL del SDK con parámetros válidos */
  function buildSdkUrl({ clientId, currency, locale, intent = 'capture', vault = false }) {
    const u = new URL('https://www.paypal.com/sdk/js');
    u.searchParams.set('client-id', clientId);
    u.searchParams.set('components', 'buttons'); // IMPORTANTE: "buttons" (nada de "subscriptions")
    u.searchParams.set('currency', currency || DEFAULTS.currency);
    u.searchParams.set('intent', intent);        // 'subscription' para subs, 'capture' para pagos únicos
    if (vault) u.searchParams.set('vault', 'true');
    // (Opcional) idioma
    if (locale) u.searchParams.set('locale', locale);
    return u.toString();
  }

  /** Carga el SDK una sola vez con una combinación de parámetros */
  function loadSdk({ clientId, currency, locale, intent, vault }) {
    if (!clientId) {
      WARN('Falta CLIENT_ID, no se puede cargar PayPal SDK');
      return Promise.reject(new Error('CLIENT_ID missing'));
    }
    const key = JSON.stringify({ clientId, currency, locale, intent, vault });
    if (state.sdkPromise && state.sdkLoadingKey === key && w.paypal) {
      return state.sdkPromise;
    }
    const url = buildSdkUrl({ clientId, currency, locale, intent, vault });
    state.sdkLoadingKey = key;

    state.sdkPromise = new Promise((resolve, reject) => {
      // Si ya está inyectado con exactamente la misma URL, resolvemos
      const existing = Array.from(d.querySelectorAll('script[src*="paypal.com/sdk/js"]'))[0];
      if (existing && w.paypal) {
        LOG('SDK ya presente');
        resolve(w.paypal);
        return;
      }
      const s = d.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => {
        LOG('SDK cargado OK');
        resolve(w.paypal);
      };
      s.onerror = (e) => {
        ERR('No se pudo cargar PayPal SDK', e);
        reject(new Error('paypal_sdk_load_error'));
      };
      d.head.appendChild(s);
    });

    return state.sdkPromise;
  }

  /** Renderiza los 2 botones de suscripción (Mensual/Anual) */
  async function renderSubscriptions(opts = {}) {
    const clientId = opts.clientId || state.clientId;
    if (!clientId) {
      WARN('Falta CLIENT_ID, no se renderizan botones de suscripción');
      return;
    }
    const monthlyPlanId = opts.monthlyPlanId || DEFAULTS.plans.monthly;
    const annualPlanId  = opts.annualPlanId  || DEFAULTS.plans.annual;
    const selMonthly = (opts.selectors && opts.selectors.monthly) || '#paypal-monthly';
    const selAnnual  = (opts.selectors && opts.selectors.annual)  || '#paypal-annual';

    // Carga SDK con intent=subscription y vault=true
    await loadSdk({ clientId, currency: DEFAULTS.currency, locale: DEFAULTS.locale, intent: 'subscription', vault: true });

    const renderSub = (selector, planId, label) => {
      const el = d.querySelector(selector);
      if (!el) return WARN(`No existe el contenedor ${selector} para ${label}`);
      el.innerHTML = ''; // limpia "Cargando..."
      return w.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'subscribe' },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: (data) => {
          LOG(`${label} suscrito OK`, data);
          alert('🎉 Suscripción completada correctamente.');
          try { localStorage.setItem('ibg_subscribed', '1'); } catch (_) {}
        },
        onError: (err) => { ERR(`${label} error`, err); alert('⚠️ Error con PayPal. Inténtalo de nuevo.'); }
      }).render(el);
    };

    await renderSub(selMonthly, monthlyPlanId, 'Mensual');
    await renderSub(selAnnual,  annualPlanId,  'Anual');
  }

  /** Renderiza botón de pago único (Lifetime u otros “one-shot”) */
  async function renderLifetime(opts = {}) {
    const clientId = opts.clientId || state.clientId;
    if (!clientId) { WARN('Falta CLIENT_ID para Lifetime'); return; }
    const container = opts.container || '#paypal-lifetime';
    const amount = (opts.amount || DEFAULTS.amounts.lifetime).toString();

    await loadSdk({ clientId, currency: DEFAULTS.currency, locale: DEFAULTS.locale, intent: 'capture', vault: false });

    const el = d.querySelector(container);
    if (!el) return WARN(`No existe contenedor Lifetime ${container}`);
    el.innerHTML = '';
    return w.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'pay' },
      createOrder: (_data, actions) => actions.order.create({
        purchase_units: [{
          amount: { currency_code: DEFAULTS.currency, value: amount },
          description: 'IbizaGirl.pics — Acceso Lifetime'
        }],
        application_context: { shipping_preference: 'NO_SHIPPING' }
      }),
      onApprove: async (_data, actions) => {
        try { await actions.order.capture(); } catch(e){ /* noop */ }
        LOG('Lifetime pagado OK');
        alert('🎉 Pago completado. ¡Gracias!');
        try { localStorage.setItem('ibg_lifetime', '1'); } catch (_) {}
      },
      onError: (err) => { ERR('Lifetime error', err); alert('⚠️ Error con PayPal.'); }
    }).render(el);
  }

  /**
   * Mini-botón “Comprar” para cada ítem (p. ej., vídeos a 0,30 €)
   * Firmas compatibles con tu código existente:
   *   Payments.renderMiniBuyButton(selector|element, { amount: '0.30', description: 'Vídeo XYZ' })
   */
  async function renderMiniBuyButton(target, options = {}) {
    const clientId = options.clientId || state.clientId;
    if (!clientId) { WARN('Falta CLIENT_ID en mini-botón'); return; }
    const amount = (options.amount || DEFAULTS.amounts.video).toString();
    const description = options.description || 'Compra individual';

    await loadSdk({ clientId, currency: DEFAULTS.currency, locale: DEFAULTS.locale, intent: 'capture', vault: false });

    const el = typeof target === 'string' ? d.querySelector(target) : target;
    if (!el) return WARN('Mini-buy: contenedor no encontrado', target);
    el.innerHTML = '';
    el.classList.add('pp-mini-ready');

    return w.paypal.Buttons({
      style: { layout: 'horizontal', color: 'gold', height: 35, label: 'pay', shape: 'pill' },
      createOrder: (_data, actions) => actions.order.create({
        purchase_units: [{
          amount: { currency_code: DEFAULTS.currency, value: amount },
          description
        }],
        application_context: { shipping_preference: 'NO_SHIPPING' }
      }),
      onApprove: async (_data, actions) => {
        try { await actions.order.capture(); } catch(e){ /* noop */ }
        LOG('Mini-buy OK', { amount, description });
        alert('✅ Compra realizada.');
      },
      onError: (err) => { ERR('Mini-buy error', err); alert('⚠️ Error con PayPal.'); }
    }).render(el);
  }

  /** API pública */
  const API = {
    /** Inicializa clientId (opcional si lo pasas en cada render) */
    init: (cfg = {}) => {
      if (cfg.clientId) state.clientId = cfg.clientId;
      if (cfg.plans) DEFAULTS.plans = Object.assign({}, DEFAULTS.plans, cfg.plans);
      if (cfg.amounts) DEFAULTS.amounts = Object.assign({}, DEFAULTS.amounts, cfg.amounts);
      LOG('init', { clientId: state.clientId, plans: DEFAULTS.plans });
    },
    renderSubscriptions,
    renderLifetime,
    renderMiniBuyButton
  };

  w.Payments = API;
})(window, document);
