(function(){(functst $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const ENV = window.__ENV || {};
  const CID = ENV.PAYPAL_CLIENT_ID || '';
  const CUR = ENV.PAYPAL_CURRENCY || 'EUR';
  const PLAN_M = ENV.PAYPAL_PLAN_MONTHLY || '';   // 14.99
  const PLAN_Y = ENV.PAYPAL_PLAN_YEARLY  || '';   // 49.99
  const PLAN_L = ENV.PAYPAL_PLAN_LIFETIME || '';  // opcional (si existiera)
  const STATUS = $('#paypal-status');

  const say = (m)=>{ console.log('[premium/paypal]', m); if(STATUS) STATUS.textContent=m; };

  function loadSDK(params){
    return new Promise((res,rej)=>{
      const u = new URL('https://www.paypal.com/sdk/js');
      Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
      const s = document.createElement('script');
      s.src = u.toString();
      s.onload = ()=>res();
      s.onerror = ()=>rej(new Error('Fallo al cargar SDK PayPal'));
      document.head.appendChild(s);
    });
  }

  function renderSubscription(selector, planId){
    const el = $(selector);
    if (!el) return;
    if (!planId) { el.innerHTML = '<small>Falta plan_id</small>'; return; }
    paypal.Buttons({
      style:{layout:'vertical',shape:'pill',label:'subscribe',height:45},
      createSubscription:(data,actions)=>actions.subscription.create({ plan_id: planId }),
      onApprove:(data)=> say('✅ Suscripción aprobada: '+(data.subscriptionID||'')),
      onError:(err)=>{ console.error(err); say('⚠️ Error PayPal (sub): '+(err?.message||err)); }
    }).render(el);
  }

  function renderOneTime(selector, amount){
    const el = $(selector);
    if (!el) return;
    paypal.Buttons({
      style:{layout:'vertical',shape:'pill',label:'pay',height:45},
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ value:String(amount), currency_code: CUR } }] }),
      onApprove:(d,a)=>a.order.capture().then(() => say('✅ Pago único completado. Acceso lifetime activado.')),
      onError:(err)=>{ console.error(err); say('⚠️ Error PayPal (one‑time): '+(err?.message||err)); }
    }).render(el);
  }

  function annotatePremiumThumbs(){
    // Añade cartela de precio en cada thumb premium
    // Detecta elementos comunes: .premium-thumb o [data-premium="true"] o .uncensored-thumb
    const thumbs = $$('.premium-thumb, [data-premium="true"], .uncensored-thumb, .thumb-premium');
    thumbs.forEach(t=>{
      if (t.dataset._priced) return;
      t.dataset._priced = '1';
      const badge = document.createElement('div');
      badge.style.position = 'absolute';
      badge.style.left='8px'; badge.style.bottom='8px';
      badge.style.background='rgba(0,0,0,.75)';
      badge.style.color='#fff';
      badge.style.font='600 12px/1.2 system-ui,Arial';
      badge.style.padding='6px 8px';
      badge.style.borderRadius='10px';
      badge.style.backdropFilter='blur(2px)';
      badge.style.zIndex='5';
      badge.innerHTML = '💎 0,10€/img • Pack 10 → 0,80€<br><span style="opacity:.85">o Suscripción: 14,99€/49,99€</span>';
      // contenedor posicionado
      const host = t.querySelector('.thumb-wrap, .card, .img-wrap, .thumb') || t;
      host.style.position = host.style.position || 'relative';
      host.appendChild(badge);
    });
  }

  function ensurePremiumOffersSection(){
    let sec = $('#premium-offers');
    if (!sec) {
      sec = document.createElement('section');
      sec.id='premium-offers';
      sec.style.cssText='padding:16px;max-width:1100px;margin:0 auto;';
      sec.innerHTML = `
        <h2 style="font:600 24px system-ui,Arial;margin:0 0 8px;">Ofertas premium</h2>
        <div style="margin-bottom:12px;color:#222;font:14px/1.5 system-ui,Arial">
          <strong>Micropagos:</strong> 0,10€ por imagen individual · <strong>Pack 10</strong> → 0,80€<br>
          <strong>Suscripciones:</strong> Mensual 14,99€ · Anual 49,99€ (acceso ilimitado mientras dure la suscripción) · <strong>Lifetime</strong> 100€ (pago único, acceso vitalicio)
        </div>
        <div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
          <div style="border:1px solid #ddd;border-radius:12px;padding:16px;">
            <div style="font-weight:700;margin-bottom:6px;">Mensual · 14,99€</div>
            <div id="paypal-monthly"></div>
          </div>
          <div style="border:1px solid #ddd;border-radius:12px;padding:16px;">
            <div style="font-weight:700;margin-bottom:6px;">Anual · 49,99€</div>
            <div id="paypal-yearly"></div>
          </div>
          <div style="border:1px solid #ddd;border-radius:12px;padding:16px;">
            <div style="font-weight:700;margin-bottom:6px;">Lifetime · pago único 100€</div>
            <div id="paypal-lifetime"></div>
          </div>
        </div>
        <div id="paypal-status" style="margin-top:8px;font:12px system-ui,Arial;opacity:.8;"></div>
      `;
      const mount = document.body || document.documentElement;
      mount.appendChild(sec);
    }
  }

  // === Inicio ===
  try{
    ensurePremiumOffersSection();
    annotatePremiumThumbs();

    if (!CID) { say('⚠️ PAYPAL_CLIENT_ID vacío'); return; }

    // SDK para suscripción
    say('Cargando SDK suscripciones…');
    loadSDK({ 'client-id': CID, currency: CUR, intent: 'subscription', vault: 'true', components: 'buttons' })
      .then(()=>{
        say('SDK suscripciones cargado');
        renderSubscription('#paypal-monthly', PLAN_M);
        renderSubscription('#paypal-yearly',  PLAN_Y);

        // Lifetime: si hay plan_id lo tratamos como sub; si no, pago único 100€
        if (PLAN_L) {
          renderSubscription('#paypal-lifetime', PLAN_L);
          say('Lifetime por suscripción (plan_id) listo');
        } else {
          say('Cargando SDK pago único (lifetime 100€)…');
          loadSDK({ 'client-id': CID, currency: CUR, intent: 'capture', components: 'buttons' })
            .then(()=>{ renderOneTime('#paypal-lifetime', 100); say('Lifetime (pago único) listo'); })
            .catch(e=>{ console.error(e); say('⚠️ '+e.message); });
        }
      })
      .catch(e=>{ console.error(e); say('⚠️ '+e.message); });
  }catch(e){
    console.error(e);
    say('⚠️ Error inesperado: '+e.message);
  }
})();
