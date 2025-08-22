/**
 * IbizaGirl.pics - Payments SDK helper (subscripciones y compras sueltas)
 * Expone exactamente:
 *   - Payments.init(config?)
 *   - Payments.renderSubscriptions(opts?)
 *   - Payments.renderMiniBuyButton(container, opts)
 *   - Payments.renderImageBuyButton(container, opts)
 *
 * Requisitos:
 *   - window.IBG?.paypal?.clientId  (o IBG.PAYPAL_CLIENT_ID / PAYPAL_CLIENT_ID global)
 *   - window.IBG?.paypal?.plans?.monthly / .annual (opcional; se pueden pasar por parámetro)
 *
 * Notas:
 *   - Moneda por defecto: EUR
 *   - Intent para subscripciones: 'subscribe' (con components=subscriptions&vault=true)
 *   - Intent para compras sueltas: 'capture' (components=buttons)
 */
(function () {
  const LOG_PREFIX = '[payments]';
  const DEFAULT_CURRENCY = 'EUR';

  /** Lee el CLIENT_ID desde varias fuentes */
  function getClientId(override) {
    if (override) return override;
    if (window.IBG?.paypal?.clientId) return window.IBG.paypal.clientId;
    if (window.IBG?.PAYPAL_CLIENT_ID) return window.IBG.PAYPAL_CLIENT_ID;
    if (window.PAYPAL_CLIENT_ID) return window.PAYPAL_CLIENT_ID;
    const meta = document.querySelector('meta[name="paypal-client-id"]');
    if (meta?.content) return meta.content;
    return '';
  }

  /** Estado interno del loader del SDK */
  const sdkState = {
    loading: false,
    loaded: false,
    components: new Set(), // p.ej. 'buttons', 'subscriptions'
    clientId: '',
    currency: DEFAULT_CURRENCY,
  };

  /** Carga el SDK de PayPal (evita duplicados). Devuelve Promise<void> */
  function loadPayPalSDK({ clientId, currency = DEFAULT_CURRENCY, needSubscriptions = false } = {}) {
    return new Promise((resolve, reject) => {
      const cid = getClientId(clientId);
      if (!cid) {
        console.warn(`${LOG_PREFIX} Falta CLIENT_ID; no se renderizan botones`);
        return reject(new Error('CLIENT_ID missing'));
      }

      // Si ya hay script y cubre componentes necesarios, resolvemos.
      if (sdkState.loaded) {
        // Si el script previo no traía subscriptions y ahora sí las necesitamos, recargamos.
        const hasSubs = sdkState.components.has('subscriptions');
        if (needSubscriptions && !hasSubs) {
          // recarga forzada con subscriptions
        } else {
          return resolve();
        }
      }

      // Construir parámetros
      const components = new Set(['buttons']);
      if (needSubscriptions) components.add('subscriptions');

      const params = new URLSearchParams();
      params.set('client-id', cid);
      params.set('currency', currency);
      params.set('components', Array.from(components).join(','));
      if (needSubscriptions) {
        params.set('vault', 'true');
      } else {
        // compras sueltas
        params.set('intent', 'capture');
      }

      const src = `https://www.paypal.com/sdk/js?${params.toString()}`;

      // Si ya existe un <script> con mismo src, esperamos a que termine
      const existing = Array.from(document.scripts).find(s => s.src && s.src.startsWith('https://www.paypal.com/sdk/js?'));
      if (existing && existing.src === src) {
        // Esperar a que paypal esté disponible
        const waitReady = () => {
          if (window.paypal && typeof window.paypal.Buttons === 'function') {
            sdkState.loaded = true;
            sdkState.components = components;
            sdkState.clientId = cid;
            sdkState.currency = currency;
            resolve();
          } else {
            setTimeout(waitReady, 50);
          }
        };
        return waitReady();
      }

      // Insertar script nuevo
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        if (window.paypal && typeof window.paypal.Buttons === 'function') {
          sdkState.loaded = true;
          sdkState.components = components;
          sdkState.clientId = cid;
          sdkState.currency = currency;
          console.debug(`${LOG_PREFIX} SDK cargado (${params.get('components')})`);
          resolve();
        } else {
          reject(new Error('PayPal SDK loaded but paypal.Buttons is undefined'));
        }
      };
      script.onerror = (e) => {
        reject(new Error('No se pudo cargar PayPal SDK'));
      };
      document.head.appendChild(script);
    });
  }

  /** Utilidad genérica para renderizar botones con Buttons */
  async function renderButtons(container, configLoader) {
    const el = (typeof container === 'string') ? document.querySelector(container) : container;
    if (!el) {
      console.warn(`${LOG_PREFIX} contenedor no encontrado`, container);
      return;
    }
    const cfg = await configLoader();
    if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
      console.error(`${LOG_PREFIX} paypal.Buttons no disponible`);
      return;
    }
    const btn = window.paypal.Buttons(cfg);
    btn.render(el);
  }

  /** --------- API PÚBLICA --------- **/

  /** Inicializa (opcional). Puedes pasar {clientId, currency} */
  async function init(opts = {}) {
    try {
      await loadPayPalSDK({ clientId: opts.clientId, currency: opts.currency || DEFAULT_CURRENCY, needSubscriptions: !!opts.needSubscriptions });
    } catch (e) {
      console.warn(`${LOG_PREFIX} Init warning`, e);
    }
  }

  /**
   * Renderiza los tres planes:
   *   - mensual (plan_id)
   *   - anual (plan_id)
   *   - lifetime (importe único, por defecto 100€)
   *
   * Si no pasas contenedores, usará (si existen):
   *   #pp-sub-monthly, #pp-sub-annual, #pp-lifetime
   *
   * opts:
   * {
   *   clientId?: string,
   *   currency?: 'EUR'|'USD'|...,
   *   monthlyPlanId?: string,
   *   annualPlanId?: string,
   *   lifetimeAmount?: string|'100.00',
   *   containers?: { monthly?: selector|Element, annual?: selector|Element, lifetime?: selector|Element }
   * }
   */
  async function renderSubscriptions(opts = {}) {
    const plans = {
      monthly: opts.monthlyPlanId || window.IBG?.paypal?.plans?.monthly || '',
      annual:  opts.annualPlanId  || window.IBG?.paypal?.plans?.annual  || '',
    };
    const lifetimeAmount = (opts.lifetimeAmount || window.IBG?.paypal?.lifetimeAmount || '100.00').toString();

    await loadPayPalSDK({
      clientId: opts.clientId,
      currency: opts.currency || DEFAULT_CURRENCY,
      needSubscriptions: true
    });

    // Mensual
    if (plans.monthly) {
      await renderButtons(opts.containers?.monthly || '#pp-sub-monthly', async () => ({
        style: { layout: 'vertical', color: 'gold', height: 45 },
        createSubscription: (_d, actions) => actions.subscription.create({ plan_id: plans.monthly }),
        onApprove: (data, actions) => {
          console.log(`${LOG_PREFIX} mensual OK`, data);
          try { alert('¡Suscripción mensual activada!'); } catch(e){}
        },
        onError: (err) => console.error(`${LOG_PREFIX} mensual error`, err),
      }));
    }

    // Anual
    if (plans.annual) {
      await renderButtons(opts.containers?.annual || '#pp-sub-annual', async () => ({
        style: { layout: 'vertical', color: 'gold', height: 45 },
        createSubscription: (_d, actions) => actions.subscription.create({ plan_id: plans.annual }),
        onApprove: (data, actions) => {
          console.log(`${LOG_PREFIX} anual OK`, data);
          try { alert('¡Suscripción anual activada!'); } catch(e){}
        },
        onError: (err) => console.error(`${LOG_PREFIX} anual error`, err),
      }));
    }

    // Lifetime (compra suelta)
    await loadPayPalSDK({
      clientId: opts.clientId,
      currency: opts.currency || DEFAULT_CURRENCY,
      needSubscriptions: false
    });

    await renderButtons(opts.containers?.lifetime || '#pp-lifetime', async () => ({
      style: { layout: 'vertical', color: 'blue', height: 45 },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          amount: { currency_code: opts.currency || DEFAULT_CURRENCY, value: lifetimeAmount },
          description: 'IbizaGirl.pics — Acceso Lifetime',
        }]
      }),
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order.capture();
          console.log(`${LOG_PREFIX} lifetime OK`, details);
          try { alert('¡Compra lifetime completada!'); } catch(e){}
        } catch (e) {
          console.error(`${LOG_PREFIX} lifetime capture error`, e);
        }
      },
      onError: (err) => console.error(`${LOG_PREFIX} lifetime error`, err),
    }));
  }

  /**
   * Botón mini de compra (para vídeos a 0,30€ etc.)
   * container: selector o Element donde renderizar el botón
   * opts: { amount: '0.30', currency?: 'EUR', description?: 'Video XYZ' }
   */
  async function renderMiniBuyButton(container, opts = {}) {
    const amount = (opts.amount || window.IBG?.prices?.video || '0.30').toString();
    const currency = opts.currency || DEFAULT_CURRENCY;

    await loadPayPalSDK({ clientId: opts.clientId, currency, needSubscriptions: false });

    await renderButtons(container, async () => ({
      style: { layout: 'horizontal', color: 'gold', height: 35, label: 'buynow' },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          amount: { currency_code: currency, value: amount },
          description: opts.description || 'Compra de vídeo',
        }]
      }),
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order.capture();
          console.log(`${LOG_PREFIX} mini buy OK`, details);
          try { alert('¡Gracias! Compra realizada.'); } catch(e){}
        } catch (e) {
          console.error(`${LOG_PREFIX} mini buy capture error`, e);
        }
      },
      onError: (err) => console.error(`${LOG_PREFIX} mini buy error`, err),
    }));
  }

  /**
   * Botón de compra para imágenes sueltas (0,10 € por defecto)
   * opts: { amount?: '0.10', currency?: 'EUR', description?: string }
   */
  async function renderImageBuyButton(container, opts = {}) {
    const amount = (opts.amount || window.IBG?.prices?.image || '0.10').toString();
    await renderMiniBuyButton(container, { ...opts, amount, description: opts.description || 'Compra de imagen' });
  }

  // Exponer en window con las firmas que usan tus páginas
  window.Payments = {
    init,
    renderSubscriptions,
    renderMiniBuyButton,
    renderImageBuyButton,
  };
})();
