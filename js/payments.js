(function(){
  const IBG = window.IBG_Pay = window.IBG_Pay || {};
  let _clientId = null;
  let _sdkLoaded = false;

  async function getClientId(){
    if (_clientId) return _clientId;
    try{
      const r = await fetch('/api/config', {cache:'no-store'});
      const j = await r.json();
      _clientId = j.paypalClientId || j.PAYPAL_CLIENT_ID || null;
    }catch(_){}
    return _clientId;
  }

  function loadSDK(clientId){
    if (window.paypal) { _sdkLoaded = true; return Promise.resolve(); }
    return new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&components=buttons&currency=EUR`;
      s.onload=()=>{_sdkLoaded=true;res();};
      s.onerror=()=>res(); // no bloquear UI
      document.head.appendChild(s);
    });
  }

  function ensureModal(){
    let wrap = document.getElementById('pp-modal');
    if (wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id='pp-modal';
    wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:9999;';
    wrap.innerHTML = `
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:16px;max-width:420px;width:92%">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong>Unlock Premium</strong>
          <button id="pp-close" style="border:none;background:#222;color:#eee;border-radius:8px;padding:4px 8px">Cerrar</button>
        </div>
        <div id="pp-plans" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          <button data-plan="monthly"  style="flex:1;border:1px solid #444;background:#1a1a1a;color:#eee;border-radius:10px;padding:8px">Monthly<br><small>€14.99</small></button>
          <button data-plan="annual"   style="flex:1;border:1px solid #444;background:#1a1a1a;color:#eee;border-radius:10px;padding:8px">Annual<br><small>€59.99</small></button>
          <button data-plan="lifetime" style="flex:1;border:1px solid #444;background:#1a1a1a;color:#eee;border-radius:10px;padding:8px">Lifetime<br><small>€149</small></button>
        </div>
        <div id="pp-slot"></div>
        <p id="pp-msg" style="font-size:12px;opacity:.7;margin-top:8px"></p>
      </div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('#pp-close').onclick=()=>wrap.remove();
    wrap.querySelectorAll('#pp-plans [data-plan]').forEach(b=>{
      b.onclick=()=>IBG.open(b.dataset.plan);
    });
    return wrap;
  }

  const PLAN_AMOUNTS = { monthly:'14.99', annual:'59.99', lifetime:'149.00' };

  IBG.open = async function(plan='monthly', description='Premium Access'){
    const wrap = ensureModal();
    const msg = wrap.querySelector('#pp-msg');
    msg.textContent = 'Cargando PayPal…';

    const clientId = await getClientId();
    if (!clientId){ msg.textContent='No se pudo cargar PayPal (client-id).'; return; }

    await loadSDK(clientId);
    if (!window.paypal){ msg.textContent='SDK PayPal no disponible.'; return; }

    const slot = wrap.querySelector('#pp-slot');
    slot.innerHTML='';
    const amount = PLAN_AMOUNTS[plan] || PLAN_AMOUNTS.monthly;

    paypal.Buttons({
      style:{ layout:'vertical', color:'gold', shape:'pill', label:'paypal' },
      createOrder: (data, actions)=>{
        return actions.order.create({
          purchase_units:[{
            amount:{ value: amount, currency_code:'EUR' },
            description
          }]
        });
      },
      onApprove: async (data, actions)=>{
        try{ await actions.order.capture(); }catch(_){}
        slot.innerHTML = '<div style="padding:8px;background:#0f5132;color:#d1e7dd;border-radius:8px">✅ Pago completado. ¡Gracias!</div>';
      },
      onError: ()=>{ slot.innerHTML='<div style="padding:8px;background:#51210f;color:#f7d7cd;border-radius:8px">❌ Error en el pago.</div>'; }
    }).render(slot);

    msg.textContent='';
  };
})();
