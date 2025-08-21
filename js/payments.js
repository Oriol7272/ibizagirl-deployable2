cat > js/payments.js <<'JS'
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

  async function buyItem({src, amount=0.10, currency='EUR'}) {
    const resourceId = basename(src);
    const data = await createOrder({amount, currency, resourceId});
    const approve = (data.links||[]).find(l=>l.rel==='approve')?.href || data.approveUrl;
    if (!approve) throw new Error('Sin enlace de aprobación');
    window.location.href = approve;
  }

  async function createSubscription(planId, tier){
    const r = await fetch('/api/paypal/create-subscription', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ planId, tier })
    });
    const j = await r.json();
    if(!r.ok || !j.approveUrl) throw new Error('No se pudo iniciar suscripción');
    window.location.href = j.approveUrl;
  }

  function makeBtn(targetId, label, onClick){
    const el = document.getElementById(targetId);
    if(!el) return;
    el.innerHTML = '';
    const b = document.createElement('button');
    b.textContent = label;
    b.style = 'padding:10px 14px;border-radius:999px;border:1px solid #333;background:#111;color:#fff;cursor:pointer;font-weight:700;font-size:14px';
    b.addEventListener('click', onClick);
    el.appendChild(b);
  }

  function renderSubscriptionButtons({ monthlyPlanId, annualPlanId, lifetimePlanId }){
    if (monthlyPlanId)  makeBtn('pp-sub-monthly',  'Suscribirme (Mensual)',  ()=>createSubscription(monthlyPlanId,'monthly'));
    if (annualPlanId)   makeBtn('pp-sub-annual',   'Suscribirme (Anual)',    ()=>createSubscription(annualPlanId,'annual'));
    if (lifetimePlanId) makeBtn('pp-sub-lifetime', 'Suscribirme (Lifetime)', ()=>createSubscription(lifetimePlanId,'lifetime'));
  }

  window.IBG_PAY = { buyItem };
  window.renderSubscriptionButtons = renderSubscriptionButtons;
})();
JS

