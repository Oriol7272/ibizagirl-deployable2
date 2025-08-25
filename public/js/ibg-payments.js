(async function(){
  const keys = await fetch("/api/paypal/public-keys").then(r=>r.json());
  if (!keys.clientId) { console.warn("[IBG] PayPal clientId missing"); return; }

  let root = document.getElementById("ibg-payments");
  if (!root) {
    root = document.createElement("div");
    root.id = "ibg-payments";
    root.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:9999;background:#111;color:#fff;padding:12px;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,.25);max-width:320px";
    root.innerHTML = `
      <div style="font-weight:700;margin-bottom:8px">Acceso Premium</div>
      <div id="ibg-ppv" style="margin:8px 0"></div>
      <div id="ibg-pack10" style="margin:8px 0"></div>
      <div id="ibg-pack50" style="margin:8px 0"></div>
      <hr style="border:none;border-top:1px solid #333;margin:10px 0">
      <div id="ibg-sub-monthly" style="margin:8px 0"></div>
      <div id="ibg-sub-annual" style="margin:8px 0"></div>
    `;
    document.body.appendChild(root);
  }

  function loadSDK(params){
    return new Promise((resolve, reject)=>{
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(keys.clientId)}&${params}`;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  await loadSDK("components=buttons&intent=capture&currency=EUR&data-namespace=paypalOrders");
  await loadSDK("components=buttons&vault=true&intent=subscription&currency=EUR&data-namespace=paypalSubs");

  async function createOrder(sku, qty=1){
    const r = await fetch("/api/paypal/create-order", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ sku, quantity: qty, currency:"EUR", brand:"IBIZA GIRL" })
    }).then(r=>r.json());
    if (!r.ok) throw new Error(r.error||"create-order failed");
    return r.id;
  }
  async function capture(orderID){
    const r = await fetch("/api/paypal/capture-order", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ orderID })
    }).then(r=>r.json());
    if (!r.ok) throw new Error(r.error||"capture failed");
    return r.result;
  }
  function afterGrant(type, payload){
    try {
      const grants = JSON.parse(localStorage.getItem("ibg_grants")||"{}");
      grants[type] = { at: Date.now(), payload };
      localStorage.setItem("ibg_grants", JSON.stringify(grants));
    } catch {}
    alert("✅ Pago correcto. ¡Disfruta del contenido!");
  }

  paypalOrders.Buttons({
    style: { layout:"horizontal", shape:"pill", label:"pay" },
    createOrder: () => createOrder("ppv_1"),
    onApprove: async (data) => { const r = await capture(data.orderID); afterGrant("ppv_1", r); },
    onError: (err) => alert("Error: "+err.message)
  }).render("#ibg-ppv");

  paypalOrders.Buttons({
    style: { layout:"horizontal", shape:"pill", label:"pay" },
    createOrder: () => createOrder("pack10"),
    onApprove: async (data) => { const r = await capture(data.orderID); afterGrant("pack10", r); },
    onError: (err) => alert("Error: "+err.message)
  }).render("#ibg-pack10");

  paypalOrders.Buttons({
    style: { layout:"horizontal", shape:"pill", label:"pay" },
    createOrder: () => createOrder("pack50"),
    onApprove: async (data) => { const r = await capture(data.orderID); afterGrant("pack50", r); },
    onError: (err) => alert("Error: "+err.message)
  }).render("#ibg-pack50");

  if (keys.plans?.monthly) {
    paypalSubs.Buttons({
      style: { layout:"horizontal", shape:"pill", label:"subscribe" },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: keys.plans.monthly }),
      onApprove: (data) => { afterGrant("sub_monthly", { subscriptionID: data.subscriptionID }); },
      onError: (err) => alert("Error: "+err.message)
    }).render("#ibg-sub-monthly");
  }
  if (keys.plans?.annual) {
    paypalSubs.Buttons({
      style: { layout:"horizontal", shape:"pill", label:"subscribe" },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: keys.plans.annual }),
      onApprove: (data) => { afterGrant("sub_annual", { subscriptionID: data.subscriptionID }); },
      onError: (err) => alert("Error: "+err.message)
    }).render("#ibg-sub-annual");
  }
})();
