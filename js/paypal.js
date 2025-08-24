(function(){
  const IBG = window.IBG || {};
  const STATE = { sdkLoaded:false, loading:false };

  function ensureModal(){
    let m = document.getElementById('pp-modal');
    if(!m){
      m = document.createElement('div');
      m.id = 'pp-modal';
      m.innerHTML = '<div class="box"><div id="paypal-container"></div><div style="margin-top:8px;text-align:center"><button id="pp-close" style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#0f1b2d;color:#fff;cursor:pointer">Cancelar</button></div></div>';
      document.body.appendChild(m);
      m.addEventListener('click', (e)=>{ if(e.target.id==='pp-modal' || e.target.id==='pp-close') hideModal(); });
    }
    return m;
  }
  function showModal(){ ensureModal().style.display='flex'; }
  function hideModal(){ const m=document.getElementById('pp-modal'); if(m) m.style.display='none'; const c=document.getElementById('paypal-container'); if(c) c.innerHTML=''; }

  function ensureSDK(){
    return new Promise((resolve,reject)=>{
      if(STATE.sdkLoaded){ return resolve(); }
      const cid = IBG.PAYPAL_CLIENT_ID;
      if(!cid){ console.warn('PAYPAL_CLIENT_ID ausente'); return reject('no-client-id'); }
      const src = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent=capture&components=buttons,hosted-fields,marks,subscriptions';
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = ()=>{ STATE.sdkLoaded=true; resolve(); };
      s.onerror=()=>reject('sdk-load-error');
      document.head.appendChild(s);
    });
  }

  async function pay(amount, onApprove){
    await ensureSDK();
    showModal();
    window.paypal.Buttons({
      createOrder: (data, actions)=>actions.order.create({
        purchase_units:[{amount:{value: amount.toFixed(2), currency_code:'EUR'}}]
      }),
      onApprove: async (data, actions)=>{
        try{ await actions.order.capture(); }catch(_){}
        hideModal();
        onApprove && onApprove(data);
      },
      onError: (err)=>{ console.warn('PayPal error', err); hideModal(); }
    }).render('#paypal-container');
  }

  async function subscribe(planId, onApprove){
    await ensureSDK();
    showModal();
    window.paypal.Buttons({
      style:{shape:'pill',color:'gold',layout:'vertical'},
      createSubscription: (data, actions)=> actions.subscription.create({ plan_id: planId }),
      onApprove: (data)=>{
        hideModal();
        onApprove && onApprove(data);
      },
      onError: (err)=>{ console.warn('PayPal sub error', err); hideModal(); }
    }).render('#paypal-container');
  }

  window.IBGPay = { pay, subscribe };
})();
