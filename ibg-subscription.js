(function(){
  const $ = (s)=>document.querySelector(s);
  const ENV = window.__ENV||{};
  const CID = ENV.PAYPAL_CLIENT_ID || '';
  const CUR = ENV.PAYPAL_CURRENCY || 'EUR';
  const PLAN_M = ENV.PAYPAL_PLAN_MONTHLY || '';  // 14.99
  const PLAN_Y = ENV.PAYPAL_PLAN_YEARLY  || '';  // 49.99
  const PLAN_L = ENV.PAYPAL_PLAN_LIFETIME || ''; // opcional
  const st=(m)=>{ const el=$('#sub-status'); if(el) el.textContent=m; console.log('[subscription]', m); };

  function loadSDK(params){
    return new Promise((res,rej)=>{
      const u = new URL('https://www.paypal.com/sdk/js');
      Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
      const s = document.createElement('script');
      s.src=u.toString(); s.onload=()=>res(); s.onerror=()=>rej(new Error('SDK PayPal no cargó')); document.head.appendChild(s);
    });
  }
  function sub(btn, plan){ if(!btn) return;
    paypal.Buttons({
      style:{layout:'vertical',shape:'pill',label:'subscribe',height:45},
      createSubscription:(d,a)=>a.subscription.create({ plan_id: plan }),
      onApprove:(d)=>st('✅ Suscripción activa: '+(d.subscriptionID||'')),
      onError:(e)=>{console.error(e);st('⚠️ Error: '+(e?.message||e));}
    }).render(btn);
  }
  function one(btn, amount){ if(!btn) return;
    paypal.Buttons({
      style:{layout:'vertical',shape:'pill',label:'pay',height:45},
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ value:String(amount), currency_code: CUR } }] }),
      onApprove:(d,a)=>a.order.capture().then(()=>st('✅ Pago único completado (lifetime)')),
      onError:(e)=>{console.error(e);st('⚠️ Error: '+(e?.message||e));}
    }).render(btn);
  }

  try{
    if (!CID){ st('⚠️ PAYPAL_CLIENT_ID vacío'); return; }
    // crear UI mínima si falta
    if (!document.getElementById('sub-root')){
      const sec=document.createElement('section'); sec.id='sub-root';
      sec.style.cssText='padding:16px;max-width:1100px;margin:0 auto';
      sec.innerHTML=`
        <h2 style="font:700 26px system-ui;margin:0 0 10px;">Suscripciones</h2>
        <div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
          <div style="border:1px solid #ddd;border-radius:12px;padding:16px;"><div style="font-weight:700;margin-bottom:6px;">Mensual · 14,99€</div><div id="sub-monthly"></div></div>
          <div style="border:1px solid #ddd;border-radius:12px;padding:16px;"><div style="font-weight:700;margin-bottom:6px;">Anual · 49,99€</div><div id="sub-yearly"></div></div>
          <div style="border:1px solid #ddd;border-radius:12px;padding:16px;"><div style="font-weight:700;margin-bottom:6px;">Lifetime · 100€ (pago único)</div><div id="sub-lifetime"></div></div>
        </div>
        <div id="sub-status" style="margin-top:8px;font:12px system-ui;opacity:.8;"></div>
      `;
      (document.body||document.documentElement).appendChild(sec);
    }
    st('Cargando SDK…');
    loadSDK({ 'client-id':CID, currency:CUR, intent:'subscription', vault:'true', components:'buttons' })
      .then(()=>{
        st('SDK suscripciones cargado');
        sub(document.getElementById('sub-monthly'), PLAN_M);
        sub(document.getElementById('sub-yearly'),  PLAN_Y);
        if (PLAN_L){
          sub(document.getElementById('sub-lifetime'), PLAN_L);
        } else {
          st('Cargando SDK pago único…');
          loadSDK({ 'client-id':CID, currency:CUR, intent:'capture', components:'buttons' })
            .then(()=>one(document.getElementById('sub-lifetime'), 100))
            .catch(e=>{console.error(e);st('⚠️ '+e.message);});
        }
      })
      .catch(e=>{console.error(e);st('⚠️ '+e.message);});
  }catch(e){ console.error(e); st('⚠️ '+e.message); }
})();
