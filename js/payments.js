/*!
 * IbizaGirl.pics - payments.js
 * - Carga robusta del PayPal SDK (una sola vez)
 * - Suscripciones (vault=true, intent=subscription)
 * - Pago único (intent=capture) para “Lifetime” y micro-precios
 * - Tolerante al orden de carga: espera a IBG_CONFIG y DOM
 */
(function () {
  // ---- utilidades básicas ----
  const onDomReady = (fn)=> {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
    else fn();
  };
  const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));

  // Lee config desde window.IBG_CONFIG o desde data-attrs del body
  function getCfg() {
    const cfg = (window.IBG_CONFIG && window.IBG_CONFIG.paypal) ? window.IBG_CONFIG.paypal : {};
    const body = document.body || {};
    const ds   = body.dataset || {};
    return {
      clientId    : cfg.clientId || ds.paypalClientId || '',
      currency    : (cfg.currency || ds.paypalCurrency || 'EUR').toUpperCase(),
      planMonthly : cfg.planMonthly || ds.planMonthly || '',
      planAnnual  : cfg.planAnnual  || ds.planAnnual  || '',
    };
  }

  // Carga el SDK con parámetros válidos
  let sdkPromise = null;
  function loadPayPalSDK({ clientId, currency, vault }) {
    if (!clientId) return Promise.reject(new Error('Falta clientId'));

    // Si ya existe y coincide con vault actual, reutiliza
    if (sdkPromise && window.paypal) return sdkPromise;

    sdkPromise = new Promise((resolve, reject) => {
      // elimina SDK previo si quedó mal cargado
      const prev = document.querySelector('script[data-ibg-ppsdk="1"]');
      if (prev) prev.remove();

      const qs = new URLSearchParams();
      qs.set('client-id', clientId);
      qs.set('components', 'buttons');             // <-- NO pongas “subscriptions”
      qs.set('commit', 'true');
      qs.set('currency', currency || 'EUR');

      if (vault) {                                 // Suscripciones
        qs.set('vault', 'true');
        qs.set('intent', 'subscription');
      } else {                                     // Pago único
        qs.set('intent', 'capture');
      }

      const s = document.createElement('script');
      s.src = `https://www.paypal.com/sdk/js?${qs.toString()}`;
      s.async = true;
      s.defer = true;
      s.dataset.ibgPpsdk = '1';
      s.onload = () => {
        if (window.paypal && window.paypal.Buttons) resolve(window.paypal);
        else reject(new Error('SDK cargado sin paypal.Buttons'));
      };
      s.onerror = () => reject(new Error('No se pudo cargar PayPal SDK'));
      document.head.appendChild(s);
    });

    return sdkPromise;
  }

  // Render de SUSCRIPCIONES (Mensual + Anual)
  async function renderSubscriptions() {
    const cfg = getCfg();

    // Espera breve por si IBG_CONFIG llega un pelín tarde
    if (!cfg.clientId) { await sleep(50); Object.assign(cfg, getCfg()); }
    if (!cfg.clientId)  { console.warn('[payments] Falta CLIENT_ID, no se renderizan botones de suscripción'); return; }

    const monthlyEl = document.querySelector('#pp-monthly');
    const annualEl  = document.querySelector('#pp-annual');

    if (!monthlyEl && !annualEl) return; // nada que hacer

    try {
      const paypal = await loadPayPalSDK({ clientId: cfg.clientId, currency: cfg.currency, vault: true });
      const common = { style: { shape:'pill', label:'subscribe', height: 40 } };

      // Mensual
      if (monthlyEl && cfg.planMonthly) {
        paypal.Buttons({
          ...common,
          createSubscription: (_d, actions) => actions.subscription.create({ plan_id: cfg.planMonthly }),
          onApprove: (d) => { console.log('[payments] monthly OK', d); monthlyEl.innerHTML = '✅ Suscrito (mensual)'; },
          onError: (err) => console.error('[payments] monthly error', err)
        }).render('#pp-monthly');
      }

      // Anual
      if (annualEl && cfg.planAnnual) {
        paypal.Buttons({
          ...common,
          createSubscription: (_d, actions) => actions.subscription.create({ plan_id: cfg.planAnnual }),
          onApprove: (d) => { console.log('[payments] annual OK', d); annualEl.innerHTML = '✅ Suscrito (anual)'; },
          onError: (err) => console.error('[payments] annual error', err)
        }).render('#pp-annual');
      }

    } catch (e) {
      console.error('[payments] Error cargando SDK (suscripciones)', e);
    }
  }

  // Render de PAGO ÚNICO (Lifetime 100 €)
  async function renderLifetime() {
    const cfg = getCfg();
    if (!cfg.clientId) { await sleep(50); Object.assign(cfg, getCfg()); }
    if (!cfg.clientId)  { console.warn('[payments] Falta CLIENT_ID para lifetime'); return; }

    const el = document.querySelector('#pp-lifetime');
    if (!el) return;

    try {
      const paypal = await loadPayPalSDK({ clientId: cfg.clientId, currency: cfg.currency, vault: false });

      paypal.Buttons({
        style: { label:'buynow', height:40, shape:'pill' },
        createOrder: (_d, actions)=> actions.order.create({
          purchase_units: [{ amount: { currency_code: cfg.currency, value: '100.00' } }]
        }),
        onApprove: (_d, actions)=> actions.order.capture().then(() => { el.innerHTML = '✅ Lifetime activado'; }),
        onError: (err)=> console.error('[payments] lifetime error', err)
      }).render('#pp-lifetime');

    } catch (e) {
      console.error('[payments] Error cargando SDK (lifetime)', e);
    }
  }

  // Mini botones “buy now” (fotos 0,10 / vídeos 0,30) – solo si hay contenedores
  async function renderMicropay() {
    const cfg = getCfg();
    const targets = Array.from(document.querySelectorAll('[data-pp-buy]'));
    if (!targets.length) return; // no hay nada que pintar

    if (!cfg.clientId) { await sleep(50); Object.assign(cfg, getCfg()); }
    if (!cfg.clientId)  { console.warn('[payments] Falta CLIENT_ID para micro-precios'); return; }

    try {
      const paypal = await loadPayPalSDK({ clientId: cfg.clientId, currency: cfg.currency, vault: false });

      targets.forEach((el) => {
        const amount = String(parseFloat(el.dataset.amount || '0.10').toFixed(2));
        paypal.Buttons({
          style: { label:'buynow', height: 30, shape:'pill' },
          createOrder: (_d, actions)=> actions.order.create({
            purchase_units: [{ amount: { currency_code: cfg.currency, value: amount } }]
          }),
          onApprove: (_d, actions)=> actions.order.capture().then(() => { el.innerHTML = '✅ Comprado'; }),
          onError: (err)=> console.error('[payments] micro error', amount, err)
        }).render(el);
      });

    } catch (e) {
      console.error('[payments] Error cargando SDK (micro)', e);
    }
  }

  // Auto-arranque por página
  onDomReady(() => {
    const page = (document.body.dataset.page || '').toLowerCase();
    // Estas llamadas no fallan si los contenedores no existen
    if (page === 'subscription') { renderSubscriptions(); renderLifetime(); }
    renderMicropay();
  });

  // Exponer por si queremos forzar manualmente desde consola
  window.IBG_PAYMENTS = { loadPayPalSDK, renderSubscriptions, renderLifetime, renderMicropay };
})();
