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
