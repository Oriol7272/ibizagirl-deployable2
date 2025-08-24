(() => {
  const CURRENCY='EUR';
  function openModal(){
    let m=document.getElementById('pp-modal');
    if(!m){
      m=document.createElement('div');
      m.id='pp-modal';
      m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999';
      m.innerHTML='<div style="background:#111;color:#fff;padding:20px;border-radius:12px;min-width:320px"><h3>Pago seguro</h3><div id="pp-container"></div><button id="pp-close" style="margin-top:12px">Cerrar</button></div>';
      document.body.appendChild(m);
      m.querySelector('#pp-close').onclick=()=>m.classList.add('hidden');
    }
    m.classList.remove('hidden'); return m;
  }
  async function ensureSDK(){
    if(window.paypal) return;
    const clientId=(window.__ENV&&window.__ENV.PAYPAL_CLIENT_ID)||'test';
    const s=document.createElement('script');
    s.src=`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${CURRENCY}&intent=capture`;
    s.async=true; await new Promise((res,rej)=>{s.onload=res;s.onerror=rej;document.head.appendChild(s);});
  }
  async function buyMonthly(){
    try{ await ensureSDK(); const m=openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder:(_,a)=>a.order.create({purchase_units:[{amount:{value:'9.99',currency_code:CURRENCY}}]}),
        onApprove:async(_,a)=>{await a.order.capture(); localStorage.setItem('IBG_SUB','1'); document.documentElement.classList.add('hide-ads'); alert('Suscripción activada. ¡Gracias!'); m.classList.add('hidden'); location.reload();}
      }).render('#pp-container');
    }catch(e){console.error(e)}
  }
  async function buyLifetime(){
    try{ await ensureSDK(); const m=openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder:(_,a)=>a.order.create({purchase_units:[{amount:{value:'100.00',currency_code:CURRENCY}}]}),
        onApprove:async(_,a)=>{await a.order.capture(); localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso de por vida activado y sin anuncios!'); m.classList.add('hidden'); location.reload();}
      }).render('#pp-container');
    }catch(e){console.error(e)}
  }
  window.IBGPayments={buyMonthly,buyLifetime};
})();
