export const config = { runtime: "edge" };

function env() {
  const cid = process.env.PAYPAL_CLIENT_ID || "";
  const sec = process.env.PAYPAL_SECRET || "";
  if (!cid || !sec) {
    return null;
  }
  return { cid, sec };
}

async function getAccessToken({ cid, sec }) {
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");
  const r = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${cid}:${sec}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!r.ok) throw new Error("paypal_oauth_failed");
  return r.json();
}

function skuToPurchaseUnit(sku, meta) {
  // Precios fijos
  const PRICES = {
    "photo_single": "0.10",
    "video_single": "0.30",
    "photo_pack10": "0.80",
    "video_pack5": "1.00",
    "lifetime": "100.00",
  };
  const AMOUNT = PRICES[sku];
  if (!AMOUNT) throw new Error("invalid_sku");

  const description = (() => {
    switch (sku) {
      case "photo_single": return `Foto individual ${meta?.item||""}`.trim();
      case "video_single": return `Vídeo individual ${meta?.item||""}`.trim();
      case "photo_pack10": return "Pack 10 fotos";
      case "video_pack5": return "Pack 5 vídeos";
      case "lifetime": return "Acceso lifetime (pago único)";
      default: return sku;
    }
  })();

  return [{
    amount: { currency_code: "EUR", value: AMOUNT },
    description,
    custom_id: JSON.stringify({ sku, ...meta }),
  }];
}

export default async function handler(req) {
  try {
    const E = env();
    if (!E) {
      return new Response(JSON.stringify({ error: "missing_paypal_env" }), { status: 500 });
    }
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "create"; // create|capture
    const token = await getAccessToken(E);

    if (action === "create") {
      const body = await req.json();
      const { sku, meta } = body || {};
      const purchase_units = skuToPurchaseUnit(sku, meta);
      const r = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units,
          application_context: {
            brand_name: "IbizaGirl.pics",
            user_action: "PAY_NOW",
            return_url: "https://ibizagirl.pics/premium.html?paid=1",
            cancel_url: "https://ibizagirl.pics/subscription.html?cancel=1",
          },
        }),
      });
      const data = await r.json();
      if (!r.ok) return new Response(JSON.stringify(data), { status: 400 });
      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (action === "capture") {
      const { orderId } = await req.json();
      if (!orderId) return new Response(JSON.stringify({ error: "missing_orderId" }), { status: 400 });
      const r = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const data = await r.json();
      if (!r.ok) return new Response(JSON.stringify(data), { status: 400 });
      return new Response(JSON.stringify(data), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "bad_action" }), { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
