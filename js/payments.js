/**
 * IbizaGirl.pics — Pagos (PayPal)
 * - Carga correcta del SDK (sin 400) para suscripciones y pagos únicos
 * - Mini-botones en cards de fotos/vídeos usando data-attributes
 * - Suscripciones: usa plan_ids reales que ya nos diste
 */
(function () {
  'use strict';

  // ---- Config (lee de content-data1.js si existe; con fallback) ----
  const CFG = (window.__IBG_CONFIG__ || window.__CONFIG || {}).paypal || {};
  const CLIENT_ID = CFG.clientId || (window.IBG_PAYPAL_CLIENT_ID || '');
  const CURRENCY  = CFG.currency || 'EUR';

  // Precios (también intentamos leer de content-data1.js)
  const PRICING = ((window.__IBG_CONFIG__ || window.__CONFIG || {}).pricing) || {};
  const PRICE_PHOTO = Number(PRICING.photo || 0.10);
  const PRICE_VIDEO = Number(PRICING.video || 0.30);
  const PRICE_PACK10 = Number(PRICING.pack10 || 0.80);
  const PRICE_PACK5V = Number(PRICING.pack5v || 1.00);

  // Planes reales que nos diste
  const PLANS = {
    monthly: 'P-3WE8037612641383DNCUKNJI',
    annual:  'P-43K261214Y571983RNCUKN7I'
  };

  // Evita duplicar el SDK
  let paypalReady = null;
  function loadPayPal({ forSubscriptions=false } = {}) {
    if (window.paypal) return Promise.resolve();
    if (paypalReady) return paypalReady;

    // NOTA IMPORTANTE:
    // Para suscripciones el SDK correcto es:
    //   components=buttons&vault=true&intent=subscription
    // (No usar "subscriptions" en components -> genera 400)
    const params = new URLSearchParams();
    params.set('client-id', CLIENT_ID);
    params.set('currency', CURRENCY);
    params.set('components', 'buttons');
    if (forSubscriptions) {
      params.set('vault', 'true');
      params.set('intent', 'subscription');
    } else {
      params.set('intent', 'capture');
    }

    const src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    paypalReady = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('No se pudo cargar PayPal SDK'));
      document.head.appendChild(s);
    });
    return paypalReady;
  }

  // ---- Utils ----
  function toCents(n) { return Math.round(Number(n) * 100) / 100; }

  // Render de botón de compra única dentro de un contenedor
  function renderMiniButtonCapture(el, { amount, description }) {
    if (!el || !window.paypal) return;
    el.innerHTML = ''; // limpiar

    window.paypal.Buttons({
      style: {
        layout: 'horizontal',
        height: 30,
        label: 'buynow',
        tagline: false,
        color: 'gold',
        shape: 'pill'
      },
      createOrder: (_, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { currency_code: CURRENCY, value: toCents(amount).toFixed(2) },
            description: description || 'Compra'
          }]
        });
      },
      onApprove: async (_, actions) => {
        try {
          const details = await actions.order.capture();
          console.log('[PayPal] Capturado:', details);
          el.innerHTML = '<span style="font-size:12px">✅ Pagado</span>';
        } catch (e) {
          console.warn('[PayPal] Error en capture:', e);
          el.innerHTML = '<span style="font-size:12px">⚠️ Error</span>';
        }
      }
    }).render(el);
  }

  // Render de botón de suscripción en un contenedor
  function renderSubscriptionButton(el, { planId }) {
    if (!el || !window.paypal) return;
    el.innerHTML = '';

    window.paypal.Buttons({
      style: {
        layout: 'horizontal',
        height: 40,
        label: 'subscribe',
        tagline: false,
        color: 'gold',
        shape: 'pill'
      },
      createSubscription: (_, actions) => {
        return actions.subscription.create({ plan_id: planId });
      },
      onApprove: (data) => {
        console.log('[PayPal] Subscription OK:', data);
        el.innerHTML = '<span style="font-size:12px">✅ Suscrito</span>';
      }
    }).render(el);
  }

  // ---- API pública ----
  async function mountSubscriptionButtons(map) {
    await loadPayPal({ forSubscriptions: true });
    if (map.monthly)  renderSubscriptionButton(map.monthly,  { planId: PLANS.monthly });
    if (map.annual)   renderSubscriptionButton(map.annual,   { planId: PLANS.annual  });
    // Lifetime (100€) pago único
    if (map.lifetime) renderMiniButtonCapture(map.lifetime,  { amount: 100.00, description: 'Lifetime' });
  }

  // Busca elementos con data-pp-price y les monta mini botón de compra única
  async function mountInlineBuyButtons() {
    const nodes = Array.from(document.querySelectorAll('[data-pp-price]'));
    if (!nodes.length) {
      console.log('[payments] videos/fotos: mini-botones renderizados = 0');
      return;
    }
    await loadPayPal({ forSubscriptions: false });
    nodes.forEach((el) => {
      const price = Number(el.getAttribute('data-pp-price') || '0');
      const desc  = el.getAttribute('data-pp-desc') || 'Compra';
      renderMiniButtonCapture(el, { amount: price, description: desc });
    });
  }

  // Auto-init por página (si el body marca el data-page)
  document.addEventListener('DOMContentLoaded', () => {
    const page = (document.body.getAttribute('data-page') || '').trim();
    if (page === 'subscription') {
      mountSubscriptionButtons({
        monthly : document.getElementById('pp-monthly'),
        annual  : document.getElementById('pp-annual'),
        lifetime: document.getElementById('pp-lifetime')
      });
    } else {
      // En fotos/vídeos montamos los mini-botones si existen contenedores
      mountInlineBuyButtons();
    }
  });

  // Exponer por si quieres llamar manualmente
  window.IBGPayments = {
    loadPayPal,
    mountSubscriptionButtons,
    mountInlineBuyButtons,
    PRICING: { PRICE_PHOTO, PRICE_VIDEO, PRICE_PACK10, PRICE_PACK5V }
  };
})();
