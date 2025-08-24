(function(){
  const ENV = (window.__ENV||{});
  const CLIENT_ID = ENV.PAYPAL_CLIENT_ID;
  const CURRENCY = 'EUR';
  const PLAN_MONTHLY = ENV.PAYPAL_PLAN_MONTHLY_1499;
  const PLAN_ANNUAL  = ENV.PAYPAL_PLAN_ANNUAL_4999;

  let loadedMode = null;
  function loadSDK(mode){
    if(!CLIENT_ID) { console.error('PAYPAL_CLIENT_ID faltante'); return Promise.reject('NO_CLIENT'); }
    if(loadedMode === mode && window.paypal) return Promise.resolve();
    [...document.querySelectorAll('script[src*="paypal.com/sdk/js"]')].forEach(s=>s.remove());
    delete window.paypal;

    const base = 'https://www.paypal.com/sdk/js';
    const common = `client-id=${encodeURIComponent(CLIENT_ID)}&currency=${CURRENCY}&components=buttons,marks`;
    const extra = (mode==='subscription') ? '&intent=subscription&vault=true' : '&intent=capture';
    const src = `${base}?${common}${extra}`;

    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src; s.async=true; s.onload=()=>{ loadedMode=mode; resolve(); };
      s.onerror=()=>reject(new Error('PayPal SDK load error'));
      document.head.appendChild(s);
    });
  }

  function ensureModal(){
    if(document.getElementById('pp-modal')) return;
    const html = `
      <div id="pp-modal"><div id="pp-bg"><div id="pp-card">
        <button id="pp-close"></button>
        <div id="pp-container"></div>
      </div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('pp-close').onclick = ()=> document.getElementById('pp-modal').classList.remove('show');
  }
  function openModal(){ ensureModal(); const m=document.getElementById('pp-modal'); m.classList.add('show'); return m; }

  function markAccess(type){
    if(type==='lifetime'){ localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); }
    if(type==='monthly'){ localStorage.setItem('IBG_SUB_MONTHLY','1'); }
    if(type==='annual'){  localStorage.setItem('IBG_SUB_ANNUAL','1'); }
    document.dispatchEvent(new CustomEvent('ibg:access-granted'));
  }

  function buySingle(kind, ref){
    const amount = (kind==='video') ? '0.30' : '0.10';
    loadSDK('order').then(()=>{
      openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder: (_,actions)=>actions.order.create({
          purchase_units:[{description:`${kind}:${ref}`, amount:{value:amount,currency_code:CURRENCY}}]
        }),
        onApprove: async (_,actions)=>{
          await actions.order.capture();
          const key = `IBG_UNLOCK_${kind}_${btoa(unescape(encodeURIComponent(ref))).replace(/=+$/,'')}`;
          localStorage.setItem(key, '1');
          Contenido desbloqueado!');alert('
          document.getElementById('pp-modal').classList.remove('show');
          document.dispatchEvent(new CustomEvent('ibg:item-unlocked', {detail:{kind,ref}}));
        }
      }).render('#pp-container');
    }).catch(console.error);
  }

  function subscribe(plan, label){
    loadSDK('subscription').then(()=>{
      openModal();
      const planId = plan==='monthly' ? PLAN_MONTHLY : PLAN_ANNUAL;
      if(!planId){ alert('Falta planId en ENV'); return; }
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createSubscription: (_,actions)=> actions.subscription.create({ plan_id: planId }),
        onApprove: async ()=>{
          markAccess(plan);
          SuscripciAlertnnn ${label} activada!`);(`
          document.getElementById('pp-modal').classList.remove('show');
        }
      }).render('#pp-container');
    }).catch(console.error);
  }

  function buyLifetime(){
    loadSDK('order').then(()=>{
      openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder: (_,actions)=>actions.order.create({
          purchase_units:[{description:'lifetime', amount:{value:'100.00',currency_code:'EUR'}}]
        }),
        onApprove: async (_,actions)=>{
          await actions.order.capture();
          markAccess('lifetime');
          Acceso de por vida activado y sin anuncios!');alert('
          document.getElementById('pp-modal').classList.remove('show');
          location.reload();
        }
      }).render('#pp-container');
    }).catch(console.error);
  }

  window.IBGPay = { buySingle, subscribeMonthly:()=>subscribe('monthly','mensual'), subscribeAnnual:()=>subscribe('annual','anual'), buyLifetime };
})();
