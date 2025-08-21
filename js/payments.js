/* payments.js
   - IBG_PAY.buyItem({src, kind, amount, currency})
   - Usa /api/paypal/create-order -> redirige a PayPal (approve)
   - /api/paypal/return captura, set-cookie y redirige a index
*/
(function(){
  function basename(p){ return (p||'').split('/').pop(); }
  async function createOrder({amount, currency, resourceId}) {
    const r = await fetch('/api/paypal/create-order', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ amount, currency, resourceId })
    });
    if (!r.ok) throw new Error('No se pudo crear el pedido');
    return await r.json();
  }

  async function buyItem({src, kind='photo', amount=0.10, currency='EUR'}) {
    try{
      const resourceId = basename(src);
      const data = await createOrder({amount, currency, resourceId});
      const approve = (data.links||[]).find(l => l.rel === 'approve')?.href || data.approveUrl;
      if (!approve) throw new Error('No se recibió enlace de aprobación');
      // Redirige a PayPal
      window.location.href = approve;
    }catch(err){
      alert('Error iniciando pago: '+ (err?.message||err));
    }
  }

  window.IBG_PAY = { buyItem };
})();

