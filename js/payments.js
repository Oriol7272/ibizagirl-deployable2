/**
 * Payments SDK wrapper (estable).
 * Expone window.Payments con:
 *   - renderSubscriptions({ monthly, annual, lifetime, currency, clientId, selectors })
 *   - renderMiniBuyButton({ selector, clientId, currency, amount, onApprove })
 *
 * Notas importantes:
 *   - Suscripciones: require vault=true & intent=subscription
 *   - Pagos puntuales: intent=capture (NO vault)
 *   - components=buttons SIEMPRE (NO añadir "subscriptions")
 */

(function () {
  const log = (...args) => console.log('[payments]', ...args);
  const warn = (...args) => console.warn('[payments]', ...args);
  const err = (...args) => console.error('[payments]', ...args);

  const DEFAULTS = {
    currency: 'EUR',
  };

  // Carga única de SDK, cacheada por combinación importante de params
  let _sdkPromise = null;
  let _sdkKey = null;

  function buildSdkUrl({ clientId, currency, vault, intent }) {
    // components=buttons siempre; funding opcional
    const base = 'https://www.paypal.com/sdk/js';
    const params = new URLSearchParams();
    params.set('client-id', clientId);
    params.set('components', 'buttons');
    if (currency) params.set('currency', currency);
    if (vault) params.set('vault', 'true');
    if (intent) params.set('intent', intent);
    // evita parámetros no válidos que causan 400
    return `${base}?${params.toString()}`;
  }

  function loadSdkOnce({ clientId, currency, vault, intent }) {
    const key = JSON.stringify({ clientId, currency, vault: !!vault, intent: intent || '' });
    if (_sdkPromise && _sdkKey === key && window.paypal) return _sdkPromise;

    _sdkKey = key;
    _sdkPromise = new Promise((resolve, reject) => {
      // ¿ya cargado con mismo id?
      if (window.paypal) return resolve(window.paypal);

      const src = buildSdkUrl({ clientId, currency, vault, intent });
      const id = 'paypal-sdk';
      let script = document.getElementById(id);

      if (script) {
        // Si hay un script con otro src que no coincide, lo reemplazamos
        if (script.getAttribute('src') !== src) {
          script.parentNode.removeChild(script);
          script = null;
        }
      }

      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => {
          if (window.paypal) resolve(window.paypal);
          else {
            warn('sdk load ok pero window.paypal no está. Reintentando…');
            setTimeout(() => (window.paypal ? resolve(window.paypal) : reject(new Error('paypal not available'))), 100);
          }
        };
        script.onerror = () => reject(new Error('No se pudo cargar PayPal SDK'));
        document.head.appendChild(script);
      } else {
        // ya existe con el src correcto; esperar a que esté window.paypal
        const check = () => (window.paypal ? resolve(window.paypal) : setTimeout(check, 50));
        check();
      }
    });

    return _sdkPromise.catch((e) => {
      err('sdk load error', e);
      throw e;
    });
  }

  // ---------- Suscripciones ----------
  async function renderSubscriptions(opts) {
    const {
      clientId,
      currency = DEFAULTS.currency,
      monthly, // { planId, selector }
      annual,  // { planId, selector }
      lifetime, // { selector, amount } (pago único)
      onApproveSubscription, // (data, actions) => {}
      onApproveOneTime, // (details) => {}
    } = opts || {};

    if (!clientId) {
      warn('Falta CLIENT_ID, no se renderizan botones de suscripción');
      return;
    }

    // 1) Buttons de suscripción (vault + intent=subscription)
    const paypal = await loadSdkOnce({
      clientId,
      currency,
      vault: true,
      intent: 'subscription',
    });

    function mountSubscription({ planId, selector }) {
      if (!planId || !selector) return;
      const el = document.querySelector(selector);
      if (!el) return warn('Contenedor no encontrado para', selector);
      el.innerHTML = ''; // limpia "Cargando…"

      paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'subscribe' },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: (data, actions) => {
          log('Subscription approved', data);
          if (typeof onApproveSubscription === 'function') onApproveSubscription(data, actions);
          alert('¡Suscripción activada! Si no ves todo desbloqueado, refresca la página.');
        },
      }).render(el);
    }

    if (monthly) mountSubscription(monthly);
    if (annual) mountSubscription(annual);

    // 2) Botón de pago único (lifetime) – se requiere SDK sin vault + intent=capture
    if (lifetime && lifetime.selector && lifetime.amount) {
      // Cargamos SDK con parámetros de pago puntual (puede coexistir; PayPal soporta que ambos botones funcionen)
      const paypalOneTime = await loadSdkOnce({
        clientId,
        currency,
        vault: false,
        intent: 'capture',
      });

      const elL = document.querySelector(lifetime.selector);
      if (elL) {
        elL.innerHTML = '';
        paypalOneTime.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{ amount: { currency_code: currency, value: String(lifetime.amount) } }],
            }),
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            log('One-time approved', details);
            if (typeof onApproveOneTime === 'function') onApproveOneTime(details);
            alert('¡Compra completada! Tu cuenta ya es lifetime.');
          },
        }).render(elL);
      }
    }
  }

  // ---------- Botoncito de compra puntual (mini) ----------
  async function renderMiniBuyButton({
    selector,
    clientId,
    currency = DEFAULTS.currency,
    amount = '0.30',
    onApprove,
    label = 'pay',
  }) {
    if (!clientId) {
      warn('Falta CLIENT_ID, no se renderiza mini botón');
      return;
    }
    const el = document.querySelector(selector);
    if (!el) return;

    const paypal = await loadSdkOnce({ clientId, currency, intent: 'capture', vault: false });
    el.innerHTML = '';

    return paypal.Buttons({
      style: { layout: 'horizontal', tagline: false, label },
      createOrder: (data, actions) =>
        actions.order.create({
          purchase_units: [{ amount: { currency_code: currency, value: String(amount) } }],
        }),
      onApprove: async (data, actions) => {
        const details = await actions.order.capture();
        log('mini-buy approved', details);
        if (typeof onApprove === 'function') onApprove(details);
      },
    }).render(el);
  }

  // Exponer API estable
  window.Payments = {
    renderSubscriptions,
    renderMiniBuyButton,
  };
})();
