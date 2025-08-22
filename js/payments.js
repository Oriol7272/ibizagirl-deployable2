(async function(){
  const C = {};
  async function loadClientId(){
    try{
      const r = await fetch('/api/config', {cache:'no-store'});
      const j = await r.json();
      return j.paypalClientId;
    }catch(e){ console.warn('config paypal error', e); return null; }
  }
  async function loadSDK(clientId, currency='EUR'){
    if (!clientId) return null;
    if (window.paypal) return window.paypal;
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&currency=${currency}`;
    s.async = true;
    document.head.appendChild(s);
    await new Promise(res=>{ s.onload=res; s.onerror=res; });
    return window.paypal||null;
  }
  C.mountButton = async (selector, amount='9.99', currency='EUR')=>{
    const clientId = await loadClientId();
    const pp = await loadSDK(clientId, currency);
    const el = document.querySelector(selector);
    if (!pp || !el) return;
    pp.Buttons({
      style:{ layout:'horizontal', height:35, label:'pay' },
      createOrder: (_data, actions)=>{
        return actions.order.create({
          intent:'CAPTURE',
          purchase_units:[{ amount:{ currency_code:currency, value:amount } }]
        });
      },
      onApprove: async (_data, actions)=>{
        try{ await actions.order.capture(); }catch(e){}
        localStorage.setItem('ibg_paid','1');
        location.href='/premium.html';
      }
    }).render(el);
  };
  C.isPaid = ()=> localStorage.getItem('ibg_paid')==='1';
  C.reset = ()=> localStorage.removeItem('ibg_paid');
  window.IBGPay = C;
})();
