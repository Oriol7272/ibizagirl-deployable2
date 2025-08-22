/**
 * payments.js — Versión estable
 * - Expone window.Payments.{renderSubscriptions, renderMiniBuyButton, loadSdk}
 * - Si falta clientId, no rompe: muestra "Cargando..." y loguea aviso.
 * - Los mini-botones (compras sueltas) funcionan como placeholder: llevan a /subscription.
 */
;(() => {
  const IBG = (window.IBG_CONFIG || window.IBG || {});
  const PAY = IBG.payments || {};

  const CLIENT_ID = PAY.clientId || PAY.clientID || '';                  // <-- tu client id live aquí
  const PLAN_MONTHLY = PAY.planMonthly || PAY.monthlyPlanId || '';       // p.ej. "P-3WE8037612641383DNCUKNJI"
  const PLAN_ANNUAL  = PAY.planAnnual  || PAY.annualPlanId  || '';       // p.ej. "P-43K261214Y571983RNCUKN7I"
  const CURRENCY     = PAY.currency || 'EUR';

  // Carga el SDK de PayPal (una sola vez).
  let sdkLoading = null;
  function loadSdk(params = {}) {
    if (document.querySelector('script[data-ibg-paypal-sdk]')) {
      return Promise.resolve();
    }
    if (!CLIENT_ID) {
      console.warn('[payments] Falta CLIENT_ID; no se cargará el SDK de PayPal.');
      return Promise.resolve(); // No rompemos la página.
    }
    const search = new URLSearchParams({
      'client-id': CLIENT_ID,
      components: 'buttons',
      intent: params.intent || 'subscription',
      vault: params.vault === false ? 'false' : 'true',
      currency: CURRENCY,
      'disable-funding': 'card,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa',
    });
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?${search.toString()}`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-ibg-paypal-sdk', '1');

    sdkLoading = sdkLoading || new Promise((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar el PayPal SDK'));
    });

    document.head.appendChild(script);
    return sdkLoading;
  }

  // Render de las tres tarjetas de suscripción.
  async function renderSubscriptions(opts) {
    const {
      selMonthly = '#sub-monthly-btn',
      selAnnual  = '#sub-annual-btn',
      selLifetime = '#sub-lifetime-btn', // Lifetime abre checkout "manual" (no suscripción)
      onSubscribed = () => location.reload(),
    } = opts || {};

    // Si falta clientId o planes, dejamos las tarjetas con el "Cargando..." pero sin romper nada.
    if (!CLIENT_ID) {
      console.warn('[payments] Falta CLIENT_ID, no se renderizan botones de suscripción');
      return;
    }

    await loadSdk({ intent: 'subscription', vault: true }).catch((e) => {
      console.error('[payments] SDK error', e);
    });

    // Puede que el SDK no cargue (si hubo error o adblock). Protegemos referencias.
    const PP = window.paypal;
    if (!PP || !PP.Buttons) {
      console.warn('[payments] paypal.Buttons no disponible (adblock/SDK).');
      return;
    }

    // Mensual
    if (PLAN_MONTHLY && document.querySelector(selMonthly)) {
      PP.Buttons({
        style: { layout: 'horizontal', height: 40, color: 'gold', shape: 'pill', label: 'subscribe' },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: PLAN_MONTHLY }),
        onApprove: () => onSubscribed('monthly'),
      }).render(selMonthly).catch((err) => console.error('paypal monthly render', err));
    }

    // Anual
    if (PLAN_ANNUAL && document.querySelector(selAnnual)) {
      PP.Buttons({
        style: { layout: 'horizontal', height: 40, color: 'gold', shape: 'pill', label: 'subscribe' },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: PLAN_ANNUAL }),
        onApprove: () => onSubscribed('annual'),
      }).render(selAnnual).catch((err) => console.error('paypal annual render', err));
    }

    // Lifetime (pago único): por ahora botón que conduce a /subscription (o a tu pasarela de pago única si la añades)
    if (document.querySelector(selLifetime)) {
      const n = document.querySelector(selLifetime);
      n.innerHTML = '';
      const a = document.createElement('a');
      a.href = '/subscription#lifetime';
      a.className = 'pp-fake-btn';
      a.textContent = 'Pagar con PayPal';
      Object.assign(a.style, {
        display: 'inline-block', padding: '10px 16px', borderRadius: '24px',
        background: '#ffc439', color: '#082', fontWeight: '600', textDecoration: 'none'
      });
      n.appendChild(a);
    }
  }

  /**
   * Mini botón de compra (imágenes 0,10€ / vídeos 0,30€).
   * Placeholder: no captura todavía, abre /subscription. Así evitamos errores "is not a function".
   */
  function renderMiniBuyButton({ selector, label = 'Comprar', href = '/subscription' } = {}) {
    const node = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!node) return;
    const btn = document.createElement('a');
    btn.href = href;
    btn.textContent = label;
    btn.className = 'pp-mini-btn';
    Object.assign(btn.style, {
      display: 'inline-block', padding: '6px 10px', borderRadius: '16px',
      background: '#0ea5e9', color: '#fff', fontSize: '12px', textDecoration: 'none'
    });
    node.innerHTML = '';
    node.appendChild(btn);
  }

  window.Payments = { loadSdk, renderSubscriptions, renderMiniBuyButton };
})();
