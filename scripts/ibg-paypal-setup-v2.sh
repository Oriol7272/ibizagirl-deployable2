#!/usr/bin/env bash
set -euo pipefail

DOMAIN="ibizagirl.pics"     # tu dominio
CURRENCY="EUR"
BRAND="IBIZA GIRL"

echo "▶ Preparando carpetas…"
mkdir -p api/paypal public/js config

############################################
# api/paypal/_client.js
############################################
cat > api/paypal/_client.js <<'JS'
const CATALOG = require("../../config/payments.json");
const env = (k, d="") => process.env[k] ?? d;
const LIVE = (env("PAYPAL_ENV","live") || "live").toLowerCase() !== "sandbox";
const API = LIVE ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const b64 = (s) => Buffer.from(s).toString("base64");

async function getAccessToken() {
  const id = env("PAYPAL_CLIENT_ID");
  const sec = env("PAYPAL_SECRET");
  if (!id || !sec) throw new Error("Missing PAYPAL_CLIENT_ID/SECRET");
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${b64(`${id}:${sec}`)}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  if (!res.ok) throw new Error(`oauth2 ${res.status}`);
  return res.json();
}

async function paypalFetch(path, init={}) {
  const { access_token } = await getAccessToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": "application/json",
      ...(init.headers||{})
    }
  });
  const txt = await res.text();
  let json; try { json = txt ? JSON.parse(txt) : {}; } catch { json = { raw: txt }; }
  if (!res.ok) { const err = new Error(`paypal ${res.status}`); err.payload = json; throw err; }
  return json;
}

function catalog() { return CATALOG; }
function oneTimeItemOrThrow(sku){
  const item = (CATALOG.one_time||[]).find(x=>x.sku===sku);
  if (!item) throw new Error("SKU not found or not one-time");
  return item;
}
function plans() {
  return {
    monthly: process.env.PAYPAL_PLAN_MONTHLY_1499 || null,
    annual: process.env.PAYPAL_PLAN_ANNUAL_4999 || null,
  };
}

async function createOrder({ sku, quantity=1, currency="EUR", brand="IBIZA GIRL" }) {
  const it = oneTimeItemOrThrow(sku);
  const amount = (Number(it.price) * Number(quantity)).toFixed(2);
  const body = {
    intent: "CAPTURE",
    purchase_units: [{
      description: it.name,
      custom_id: it.sku,
      amount: { currency_code: currency, value: amount },
      items: [{ name: it.name, quantity: String(quantity),
        unit_amount: { currency_code: currency, value: Number(it.price).toFixed(2) } }]
    }],
    application_context: { brand_name: brand, shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" }
  };
  return paypalFetch("/v2/checkout/orders", { method:"POST", body: JSON.stringify(body) });
}

async function captureOrder(orderID){
  return paypalFetch(`/v2/checkout/orders/${orderID}/capture`, { method:"POST" });
}

async function verifyWebhookSignature(headers, event){
  const webhook_id = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhook_id) throw new Error("Missing PAYPAL_WEBHOOK_ID");
  const body = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id, webhook_event: event
  };
  const out = await paypalFetch("/v1/notifications/verify-webhook-signature", {
    method:"POST", body: JSON.stringify(body)
  });
  return out && out.verification_status === "SUCCESS";
}

module.exports = { LIVE, API, catalog, plans, createOrder, captureOrder, verifyWebhookSignature };
JS

############################################
# helper readBody (copiado en cada handler)
############################################
read_body_func='
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{
    let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d));
  });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
'

############################################
# api/paypal/health.js
############################################
cat > api/paypal/health.js <<'JS'
module.exports = async (req, res) => {
  const live = (process.env.PAYPAL_ENV||"live").toLowerCase()!=="sandbox";
  res.setHeader("Cache-Control","no-store");
  res.status(200).json({
    ok:true,
    env: live ? "live" : "sandbox",
    hasClientId: !!process.env.PAYPAL_CLIENT_ID,
    hasSecret: !!process.env.PAYPAL_SECRET,
    hasMonthlyPlan: !!process.env.PAYPAL_PLAN_MONTHLY_1499,
    hasAnnualPlan: !!process.env.PAYPAL_PLAN_ANNUAL_4999
  });
};
JS

############################################
# api/paypal/public-keys.js
############################################
cat > api/paypal/public-keys.js <<'JS'
const { plans } = require("./_client");
module.exports = async (req,res)=>{
  res.setHeader("Cache-Control","public, max-age=300, must-revalidate");
  res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID || "", currency: "EUR", plans: plans() });
};
JS

############################################
# api/paypal/create-order.js
############################################
cat > api/paypal/create-order.js <<'JS'
const { createOrder } = require("./_client");
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d)); });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
module.exports = async (req,res)=>{
  try{
    const { sku, quantity=1, currency="EUR", brand="IBIZA GIRL" } = await readBody(req);
    if (!sku) return res.status(400).json({ok:false,error:"Missing sku"});
    const out = await createOrder({ sku, quantity, currency, brand });
    res.status(201).json({ ok:true, id: out.id });
  }catch(e){
    res.status(500).json({ ok:false, error:e.message, details:e.payload||null });
  }
};
JS

############################################
# api/paypal/capture-order.js
############################################
cat > api/paypal/capture-order.js <<'JS'
const { captureOrder } = require("./_client");
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d)); });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
module.exports = async (req,res)=>{
  try{
    const { orderID } = await readBody(req);
    if (!orderID) return res.status(400).json({ok:false,error:"Missing orderID"});
    const out = await captureOrder(orderID);
    res.status(200).json({ ok:true, result: out });
  }catch(e){
    res.status(500).json({ ok:false, error:e.message, details:e.payload||null });
  }
};
JS

############################################
# api/paypal/webhook.js
############################################
cat > api/paypal/webhook.js <<'JS'
const { verifyWebhookSignature } = require("./_client");
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d)); });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
module.exports = async (req,res)=>{
  try{
    const headers = Object.fromEntries(Object.entries(req.headers).map(([k,v])=>[k.toLowerCase(),v]));
    const body = await readBody(req);
    const valid = await verifyWebhookSignature(headers, body);
    if (!valid) return res.status(400).json({ ok:false, error:"Invalid signature" });
    console.log("[PAYPAL WEBHOOK]", body?.event_type);
    res.status(200).json({ ok:true });
  }catch(e){
    console.error("webhook error", e);
    res.status(500).json({ ok:false, error:e.message });
  }
};
JS

############################################
# Catálogo de pagos
############################################
cat > config/payments.json <<'JSON'
{
  "currency": "EUR",
  "one_time": [
    { "sku": "ppv_1",   "name": "Pay Per View (1 imagen)",   "price": 0.99 },
    { "sku": "pack10",  "name": "Pack 10 imágenes",          "price": 4.99 },
    { "sku": "pack50",  "name": "Pack 50 imágenes",          "price": 14.99 }
  ]
}
JSON

############################################
# Frontend: public/js/ibg-payments.js
############################################
cat > public/js/ibg-payments.js <<'JS'
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
JS

############################################
# Inyectar el script en premium.html (si no existe)
############################################
for F in premium.html public/premium.html; do
  if [ -f "$F" ] && ! grep -q "ibg-payments.js" "$F"; then
    cp "$F" "$F.bak"
    printf '\n  <script defer src="/js/ibg-payments.js"></script>\n' >> "$F"
    echo "✓ Script inyectado en $F"
  fi
done

############################################
# Git + Deploy + Smoke test
############################################
echo "▶ Commit & push…"
git add -A
git commit -m "IBG: PayPal backend (orders+subs) + frontend" || true
git push

echo "▶ Deploy Vercel (prod)…"
vercel --prod

echo "── Smoke tests (dominio custom) ──"
echo "GET /api/paypal/health:" && curl -sS "https://${DOMAIN}/api/paypal/health" && echo
echo "POST /api/paypal/create-order (ppv_1):" && \
curl -sS -X POST "https://${DOMAIN}/api/paypal/create-order" \
  -H "content-type: application/json" --data '{"sku":"ppv_1"}' && echo

echo "✅ Abre premium.html y comprueba que salen los botones."
