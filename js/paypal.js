(function(){
  const IBG = window.IBG || {};
  const STATE = { sdkLoaded:false };

  function ensureModal(){
    let m = document.getElementById('pp-modal');
    if(!m){
      m = document.createElement('div');
      m.id = 'pp-modal';
      m.style.display = 'none';
      m.innerHTML = '<div class="box" style="background:#0b1422;border:1px solid rgba(255,255,255,.1);padding:18px;border-radius:14px;min-width:320px;margin:auto"><div id="paypal-container"></div><div style="margin-top:8px;text-align:center"><button id="pp-close" style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#0f1b2d;color:#fff;cursor:pointer">Cancelar</button></div></div>';
      const backdrop = document.createElement('div');
      backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center';
      backdrop.id = 'pp-backdrop';
      backdrop.appendChild(m);
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click',(e)=>{ if(e.target.id==='pp-backdrop'||e.target.id==='pp-close'){ hideModal(); }});
    }
    return m;
  }
  function showModal(){ ensureModal().parentElement.style.display='flex'; }
  function hideModal(){
    const bd=document.getElementById('pp-backdrop'); if(bd){ bd.style.display='none'; }
    const c=document.getElementById('paypal-container'); if(c) c.innerHTML='';
  }

  function ensureSDK(){
    return new Promise((resolve,reject)=>{
      if(STATE.sdkLoaded) return resolve();
      const cid = (window.IBG||{}).PAYPAL_CLIENT_ID;
      if(!cid){ console.warn('PAYPAL_CLIENT_ID ausente'); return reject('no-client-id'); }
      const s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)+'&currency=EUR&intent=capture&components=buttons,subscriptions';
      s.async = true;
      s.onload = ()=>{ STATE.sdkLoaded=true; resolve(); };
      s.onerror = ()=> reject('sdk-load-error');
      document.head.appendChild(s);
    });
  }

  async function _renderButtons(opts){
    const { inContainer, create, onApprove, onError } = opts;
    await ensureSDK();
    const target = inContainer || '#paypal-container';
    return window.paypal.Buttons({
      style:{ shape:'pill', layout:'vertical' },
      ...create,
      onApprove: (data, actions)=>Promise.resolve(onApprove && onApprove(data, actions)),
      onError: (err)=>{ console.warn('PayPal error', err); onError && onError(err); }
    }).render(target);
  }

  // ——— Public APIs ———
  async function mountPayPerItem({ amount, onApprove, container }){
    if(!container){ showModal(); }
    return _renderButtons({
      inContainer: container,
      create:{
        createOrder: (data, actions)=>actions.order.create({
          purchase_units: [{ amount:{ value: Number(amount||0).toFixed(2), currency_code:'EUR' } }]
        }),
        onApprove: async (data, actions)=>{
          try{ await actions.order.capture(); }catch(_){}
          if(!container){ hideModal(); }
          onApprove && onApprove(data);
        }
      }
    });
  }

  async function mountSubscription({ planId, onApprove, container }){
    if(!container){ showModal(); }
    return _renderButtons({
      inContainer: container,
      create:{
        createSubscription: (data, actions)=> actions.subscription.create({ plan_id: planId }),
        onApprove: (data)=>{
          if(!container){ hideModal(); }
          onApprove && onApprove(data);
        }
      }
    });
  }

  // Helpers de conveniencia
  async function pay(amount, onApprove){ return mountPayPerItem({ amount, onApprove, container:null }); }
  async function subscribe(planId, onApprove){ return mountSubscription({ planId, onApprove, container:null }); }

  // Export ESM y Global
  if (typeof window !== 'undefined') {
    window.IBGPay = { pay, subscribe, mountPayPerItem, mountSubscription };
  }
  try{
    // ESM exports (no-op si no hay module system)
    // eslint-disable-next-line no-undef
    if (typeof exportFunction !== 'function'){}
  }catch(_){}

  // UMD-lite: define exports cuando sea importado como módulo
  // (el bundler nativo del navegador lo recogerá)
  // Nota: esta sección no hace nada en IIFE puro.
})();
export async function mountPayPerItem(opts){ return window.IBGPay.mountPayPerItem(opts); }
export async function mountSubscription(opts){ return window.IBGPay.mountSubscription(opts); }
export async function pay(amount, onApprove){ return window.IBGPay.pay(amount, onApprove); }
export async function subscribe(planId, onApprove){ return window.IBGPay.subscribe(planId, onApprove); }
