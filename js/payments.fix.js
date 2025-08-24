(function(){
  const CURRENCY='EUR', ENV=window.__ENV||{};
  const CLIENT_ID=ENV.PAYPAL_CLIENT_ID, PLAN_M=ENV.PAYPAL_PLAN_MONTHLY_1499, PLAN_A=ENV.PAYPAL_PLAN_ANNUAL_4999;

  function loadSDK(){
    return new Promise((res,rej)=>{
      if(window.paypal) return res();
      if(!CLIENT_ID) return rej(new Error('PAYPAL_CLIENT_ID missing'));
      const s=document.createElement('script');
      s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CLIENT_ID)}&vault=true&intent=subscription&currency=${CURRENCY}`;
      s.onload=()=>res(); s.onerror=()=>rej(new Error('PayPal SDK load error')); document.head.appendChild(s);
    });
  }
  function openModal(){
    let m=document.getElementById('pp-modal');
    if(!m){ m=document.createElement('div'); m.id='pp-modal';
      m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);display:grid;place-items:center;z-index:9999';
      m.innerHTML='<div style="background:#0b1b2a;padding:20px;border-radius:14px;min-width:320px"><div id="pp-container"></div><div style="margin-top:10px;text-align:center"><button id="pp-close" style="padding:6px 10px;border-radius:8px;border:0">Cerrar</button></div></div>';
      document.body.appendChild(m); m.querySelector('#pp-close').onclick=()=>m.remove();
    } m.style.display='grid'; return m;
  }
  async function buyMonthly(){ await loadSDK(); openModal();
    paypal.Buttons({style:{layout:'vertical',color:'blue',shape:'pill'},
      createSubscription:(d,a)=>a.subscription.create({plan_id:PLAN_M}),
      onApprove:()=>{ localStorage.setItem('IBG_PREMIUM','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso mensual activado.'); location.reload(); }
    }).render('#pp-container');
  }
  async function buyAnnual(){ await loadSDK(); openModal();
    paypal.Buttons({style:{layout:'vertical',color:'blue',shape:'pill'},
      createSubscription:(d,a)=>a.subscription.create({plan_id:PLAN_A}),
      onApprove:()=>{ localStorage.setItem('IBG_PREMIUM','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso anual activado.'); location.reload(); }
    }).render('#pp-container');
  }
  async function buyLifetime(){ await loadSDK(); openModal();
    paypal.Buttons({style:{layout:'vertical',color:'blue',shape:'pill'},
      createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{value:'100.00',currency_code:CURRENCY}}]}),
      onApprove:async(d,a)=>{ await a.order.capture(); localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); alert('Acceso de por vida activado.'); location.reload(); }
    }).render('#pp-container');
  }
  window.buyMonthly=buyMonthly; window.buyAnnual=buyAnnual; window.buyLifetime=buyLifetime;
})();
