/**
 * payments.js — IbizaGirl.pics
 * - Carga ÚNICA y robusta del PayPal SDK (evita 400/duplicados)
 * - Suscripciones: mensual/anual (vault=true & intent=subscription)
 * - Lifetime: pedido único (intent=capture) por 100 €
 * - Mini-botones por vídeo: pedido único (0.30 €)
 * - Mini-botones por foto (si se usara): pedido único (0.10 €)
 */

(function () {
  const log = (...a) => console.log('[payments]', ...a);
  const warn = (...a) => console.warn('[payments]', ...a);
  const err = (...a) => console.error('[payments]', ...a);

  // ==== CONFIG ====
  // Estos valores se inyectan desde content-data1.js
  const CFG = (window.IBG_CONFIG && window.IBG_CONFIG.paypal) || {};
  const CLIENT_ID = CFG.clientId || window.PAYPAL_CLIENT_ID || '';
  const CURRENCY = 'EUR';

  const PLAN_IDS = {
    monthly: (window.IBG_PLANS && window.IBG_PLANS.monthly) || '',
    annual:  (window.IBG_PLANS && window.IBG_PLANS.annual)  || ''
  };

  // Lifetime amount (pago único)
  const LIFETIME_AMOUNT = '100.00';

  // Precios unitarios
  const PRICE = {
    photo: '0.10',
    video: '0.30',
    pack10Photos: '0.80',
    pack5Videos: '1.00'
  };

  // Estado interno para evitar recargar el SDK
  let sdkState = {
    loaded: false,
    url: '',
    promise: null
  };

  function buildSdkUrl(params) {
    const usp = new URLSearchParams();
    usp.set('client-id', CLIENT_ID);
    usp.set('components', 'buttons'); // NO añadir "subscriptions"
    usp.set('currency', CURRENCY);
    if (params.vault) usp.set('vault', 'true');
    if (params.intent) usp.set('intent', params.intent); // 'subscription' | 'capture'
    // Opcional: desactivar funding conflictivos
    // usp.set('disable-funding','paylater,venmo');
    return `https://www.paypal.com/sdk/js?${usp.toString()}`;
  }

  function loadPayPalSdkOnce(params) {
    if (window.paypal) {
      sdkState.loaded = true;
      return Promise.resolve(window.paypal);
    }
    const url = buildSdkUrl(params);

    // Ya solicitado con la misma URL → devolvemos la misma promesa
    if (sdkState.promise && sdkState.url === url) {
      return sdkState.promise;
    }

    // Si ya hay un <script> viejo con otra query, lo retiramos
    const prev = document.querySelector('script[src*="www.paypal.com/sdk/js"]');
    if (prev) prev.remove();

    sdkState.url = url;
    sdkState.promise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => {
        if (window.paypal) {
          sdkState.loaded = true;
          resolve(window.paypal);
        } else {
          reject(new Error('SDK cargado sin window.paypal'));
        }
      };
      s.onerror = () => {
        reject(new Error('No se pudo cargar PayPal SDK'));
      };
      document.head.appendChild(s);
    })
    .catch(async (e) => {
      // Fallback de cortesía: reintentar sin currency por si algún 400 raro
      warn('SDK error, reintentando fallback sin currency…', e);
      const usp = new URLSearchParams();
      usp.set('client-id', CLIENT_ID);
      usp.set('components', 'buttons');
      if (params.vault) usp.set('vault', 'true');
      if (params.intent) usp.set('intent', params.intent);
      const fallbackUrl = `https://www.paypal.com/sdk/js?${usp.toString()}`;

      const prev2 = document.querySelector('script[src*="www.paypal.com/sdk/js"]');
      if (prev2) prev2.remove();

      return new Promise((resolve2, reject2) => {
        const s2 = document.createElement('script');
        s2.src = fallbackUrl;
        s2.async = true;
        s2.onload = () => (window.paypal ? resolve2(window.paypal) : reject2(e));
        s2.onerror = () => reject2(e);
        document.head.appendChild(s2);
      });
    });

    return sdkState.promise;
  }

  // ---------- Suscripciones (Monthly/Annual) ----------
  async function renderSubscriptionButtons() {
    if (!CLIENT_ID) {
      warn('Falta CLIENT_ID, no se renderizan botones de suscripción');
      return;
    }
    const paypal = await loadPayPalSdkOnce({ vault: true, intent: 'subscription' });

    const mounts = [
      { sel: '#paypal-monthly', planId: PLAN_IDS.monthly },
      { sel: '#paypal-annual',  planId: PLAN_IDS.annual  }
    ];

    mounts.forEach(({ sel, planId }) => {
      const el = document.querySelector(sel);
      if (!el || !planId) return;

      paypal.Buttons({
        style: { layout: 'horizontal', color: 'gold', shape: 'pill', label: 'subscribe' },
        createSubscription: function (data, actions) {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: function (data, actions) {
          log('Sub OK', sel, data);
          alert('¡Suscripción activada correctamente!');
          try { localStorage.setItem('ibg_sub_active', '1'); } catch (_) {}
        },
        onError: function (e) {
          err('Sub error', sel, e);
          alert('Error con PayPal. Vuelve a intentarlo.');
        }
      }).render(el);
    });
  }

  // ---------- Lifetime (pago único) ----------
  async function renderLifetimeButton() {
    if (!CLIENT_ID) return;
    const paypal = await loadPayPalSdkOnce({ vault: false, intent: 'capture' });

    const mount = document.querySelector('#paypal-lifetime');
    if (!mount) return;

    paypal.Buttons({
      style: { layout: 'horizontal', color: 'blue', shape: 'pill', label: 'pay' },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { currency_code: CURRENCY, value: LIFETIME_AMOUNT } }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          log('Lifetime OK', details);
          alert('¡Pago lifetime confirmado!');
          try { localStorage.setItem('ibg_sub_active', '1'); } catch (_) {}
        });
      },
      onError: (e) => {
        err('Lifetime error', e);
        alert('Error en el pago. Vuelve a intentarlo.');
      }
    }).render(mount);
  }

  // ---------- Mini-botones por vídeo (0.30 €) ----------
  async function renderVideoMiniButtons() {
    // Render para cada contenedor con atributo data-video-price
    const conts = Array.from(document.querySelectorAll('[data-video-price="0.30"]'));
    if (!conts.length) {
      log('videos: mini-botones renderizados = 0');
      return;
    }
    const paypal = await loadPayPalSdkOnce({ vault: false, intent: 'capture' });

    conts.forEach((div) => {
      const price = div.getAttribute('data-video-price') || PRICE.video;
      const label = div.getAttribute('data-label') || 'Comprar';
      paypal.Buttons({
        style: { layout: 'horizontal', height: 30, color: 'gold', shape: 'pill', label: 'pay' },
        createOrder: (data, actions) => {
          const amount = (Number(price) || 0.30).toFixed(2);
          return actions.order.create({
            purchase_units: [{ amount: { currency_code: CURRENCY, value: amount } }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            log('Vídeo comprado', details, div);
            // Aquí podrías marcar el vídeo como desbloqueado.
            div.innerHTML = '<span class="paid">Comprado ✓</span>';
          });
        },
        onError: (e) => err('Mini vídeo error', e)
      }).render(div);
    });
    log('videos: mini-botones renderizados =', conts.length);
  }

  // ---------- Utilidades de marcado de precio en thumbs ----------
  function annotatePrices() {
    // Fotos públicas FULL: 0.10 € (si hubiera contenedores con data-photo-price)
    document.querySelectorAll('[data-photo-price]').forEach((card) => {
      const p = card.getAttribute('data-photo-price') || PRICE.photo;
      if (!card.querySelector('.price-badge')) {
        const b = document.createElement('div');
        b.className = 'price-badge';
        b.textContent = `${Number(p).toFixed(2)} €`;
        card.appendChild(b);
      }
    });
    // Vídeos premium: 0.30 €
    document.querySelectorAll('[data-video-card]').forEach((card) => {
      if (!card.querySelector('.price-badge')) {
        const b = document.createElement('div');
        b.className = 'price-badge';
        b.textContent = `${Number(PRICE.video).toFixed(2)} €`;
        card.appendChild(b);
      }
    });
  }

  // ---------- Auto-init por página ----------
  document.addEventListener('DOMContentLoaded', () => {
    try { annotatePrices(); } catch(_) {}

    const path = (location.pathname || '').toLowerCase();
    if (path.includes('/subscription')) {
      renderSubscriptionButtons().catch(err);
      renderLifetimeButton().catch(err);
    }
    if (path.includes('/videos')) {
      // Los contenedores donde montar mini-botones deben tener data-video-price="0.30"
      renderVideoMiniButtons().catch(err);
    }
  });

  // Exponer por si hace falta llamar manualmente
  window.IBG_PAY = {
    loadPayPalSdkOnce,
    renderSubscriptionButtons,
    renderLifetimeButton,
    renderVideoMiniButtons,
    PRICE
  };
})();
