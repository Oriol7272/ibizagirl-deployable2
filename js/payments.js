/* ibizagirl.pics — payments.js (estable)
   - Soporta: Suscripciones (mensual/anual) y Lifetime (pago único)
   - Carga segura del SDK (una sola vez), logs claros y fallbacks
*/
(function (w, d) {
  const STATE = {
    clientId: null,
    currency: 'EUR',
    monthlyPlanId: null,
    annualPlanId: null,
    lifetimePrice: '100.00',
    sdkLoading: null,
    sdkLoaded: false,
    sdkScriptId: 'paypal-sdk',
  };

  function log(...args){ console.log('[payments]', ...args); }
  function warn(...args){ console.warn('[payments]', ...args); }
  function error(...args){ console.error('[payments]', ...args); }

  function buildSdkUrl(opts){
    const p = new URLSearchParams();
    p.set('client-id', opts.clientId);
    p.set('components', 'buttons');
    p.set('currency', opts.currency || 'EUR');
    // Para suscripciones
    if (opts.vault) p.set('vault', 'true');
    if (opts.intent) p.set('intent', opts.intent); // 'subscription' o 'capture'
    // Evita funding que no queremos
    p.set('disable-funding', 'card,credit,paylater');
    return 'https://www.paypal.com/sdk/js?' + p.toString();
  }

  function loadSdkOnce(config){
    if (STATE.sdkLoaded) return Promise.resolve(true);
    if (STATE.sdkLoading) return STATE.sdkLoading;

    if (!STATE.clientId || STATE.clientId.length < 50) {
      warn('CLIENT_ID ausente o inválido. No se pueden renderizar botones.');
      return Promise.resolve(false);
    }

    // Por defecto cargamos con intent=capture; para suscripción volvemos a cargar con vault más abajo si hace falta
    const url = buildSdkUrl({ clientId: STATE.clientId, currency: STATE.currency, intent: 'capture' });

    STATE.sdkLoading = new Promise((resolve) => {
      // Si ya existe el script, resolvemos
      if (d.getElementById(STATE.sdkScriptId)) {
        STATE.sdkLoaded = !!w.paypal;
        return resolve(STATE.sdkLoaded);
      }
      const s = d.createElement('script');
      s.id = STATE.sdkScriptId;
      s.src = url;
      s.onload = () => { STATE.sdkLoaded = !!w.paypal; resolve(STATE.sdkLoaded); };
      s.onerror = () => { error('SDK load error'); resolve(false); };
      d.head.appendChild(s);
    });

    return STATE.sdkLoading;
  }

  function loadSdkForSubscriptions(){
    // Si ya hay paypal cargado sirve igual, pero garantizamos parámetros de subs si aún no cargó
    if (STATE.sdkLoaded) return Promise.resolve(true);

    const url = buildSdkUrl({ clientId: STATE.clientId, currency: STATE.currency, vault: true, intent: 'subscription' });

    return new Promise((resolve) => {
      if (d.getElementById(STATE.sdkScriptId)) {
        // ya hay script (otra carga en progreso). Espera a que termine.
        const wait = () => {
          if (STATE.sdkLoaded || w.paypal) return resolve(true);
          setTimeout(wait, 50);
        };
        return wait();
      }
      const s = d.createElement('script');
      s.id = STATE.sdkScriptId;
      s.src = url;
      s.onload = () => { STATE.sdkLoaded = !!w.paypal; resolve(STATE.sdkLoaded); };
      s.onerror = () => { error('SDK load error'); resolve(false); };
      d.head.appendChild(s);
    });
  }

  // ---------- RENDERIZADORES ----------
  function renderSubscriptionButton(selector, planId){
    if (!w.paypal) return warn('paypal no disponible todavía');
    try{
      w.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'subscribe' },
        createSubscription: function(data, actions){
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: function(data, actions){
          log('Suscripción aprobada', data);
          alert('¡Suscripción activada! ID: ' + (data.subscriptionID || data.orderID));
          try { localStorage.setItem('premium_full_access', '1'); } catch(e){}
        },
        onError: function(err){ error('PayPal onError', err); alert('Error con PayPal. Inténtalo de nuevo.'); }
      }).render(selector);
      return true;
    } catch(e){ error('renderSubscriptionButton', e); return false; }
  }

  function renderLifetimeButton(selector){
    if (!w.paypal) return warn('paypal no disponible todavía');
    try{
      w.paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'checkout' },
        createOrder: function(data, actions){
          return actions.order.create({
            purchase_units: [{
              amount: { currency_code: STATE.currency, value: STATE.lifetimePrice },
              description: 'Acceso Lifetime a ibizagirl.pics'
            }]
          });
        },
        onApprove: function(data, actions){
          return actions.order.capture().then(function(details){
            log('Pago lifetime capturado', details);
            alert('¡Compra completada! Disfruta del acceso ilimitado.');
            try { localStorage.setItem('premium_full_access', '1'); } catch(e){}
          });
        },
        onError: function(err){ error('PayPal onError', err); alert('Error con PayPal. Inténtalo de nuevo.'); }
      }).render(selector);
      return true;
    } catch(e){ error('renderLifetimeButton', e); return false; }
  }

  // ---------- API PÚBLICA ----------
  const Payments = {
    init: function(cfg){
      STATE.clientId = (cfg && cfg.clientId) || STATE.clientId;
      STATE.currency = (cfg && cfg.currency) || 'EUR';
      STATE.monthlyPlanId = (cfg && cfg.monthlyPlanId) || null;
      STATE.annualPlanId  = (cfg && cfg.annualPlanId) || null;
      STATE.lifetimePrice = (cfg && cfg.lifetimePrice) || '100.00';
      log('config', { clientId: !!STATE.clientId, currency: STATE.currency, monthly: STATE.monthlyPlanId, annual: STATE.annualPlanId, lifetime: STATE.lifetimePrice });
      return this;
    },

    // Página /subscription
    async renderSubscriptions(opts){
      const o = Object.assign({
        monthlySel: '#paypal-monthly',
        annualSel:  '#paypal-annual',
        lifetimeSel:'#paypal-lifetime'
      }, opts||{});

      // 1) SDK para suscripciones
      const okSub = await loadSdkForSubscriptions();
      if (!okSub){ warn('No se pudo cargar PayPal SDK para suscripciones'); return; }

      // 2) Render mensual / anual
      if (STATE.monthlyPlanId) renderSubscriptionButton(o.monthlySel, STATE.monthlyPlanId);
      if (STATE.annualPlanId)  renderSubscriptionButton(o.annualSel,  STATE.annualPlanId);

      // 3) Lifetime usa intent=capture; si el SDK ya está cargado sirve igual
      if (!STATE.sdkLoaded || !w.paypal){
        const ok = await loadSdkOnce({});
        if (!ok) warn('No se pudo cargar PayPal SDK (lifetime).');
      }
      renderLifetimeButton(o.lifetimeSel);
    },

    // Mini botón para compras sueltas (si lo necesitáis más adelante)
    async renderMiniBuyButton(selector, priceStr){
      if (!STATE.sdkLoaded || !w.paypal){
        const ok = await loadSdkOnce({});
        if (!ok) return warn('No se pudo cargar PayPal SDK (mini).');
      }
      const saved = STATE.lifetimePrice;
      STATE.lifetimePrice = priceStr || '0.30';
      renderLifetimeButton(selector);
      STATE.lifetimePrice = saved;
    }
  };

  w.Payments = Payments;
})(window, document);
