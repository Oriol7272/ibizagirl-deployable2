/* IbizaGirl - Payments front */
(function(){
  async function postJSON(url, data){
    const r = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const j = await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(j.error || 'Request failed');
    return j;
  }

  async function buyItem({ src, amount=0.10, currency='EUR', kind='photo' }){
    try{
      const resourceId = (src||'').split('/').pop();
      const res = await postJSON('/api/paypal/create-order', { amount, currency, resourceId });
      if (res.approveUrl) window.location.href = res.approveUrl;
      else alert('No se recibió approveUrl de PayPal.');
    }catch(e){
      console.error('buyItem error', e);
      alert('Error creando el pago.');
    }
  }

  async function subscribe({ planId, tier }){
    try{
      const res = await postJSON('/api/paypal/create-subscription', { planId, tier });
      if (res.approveUrl) window.location.href = res.approveUrl;
      else alert('No se recibió approveUrl de PayPal (subs).');
    }catch(e){
      console.error('subscribe error', e);
      alert('Error creando la suscripción.');
    }
  }

  window.IBG_PAY = { buyItem, subscribe };
})();
