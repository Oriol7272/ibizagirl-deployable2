// api/paypal/create-order.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).end("Method Not Allowed");
    }

    const { kind, items = [] } = req.body || {};
    const PRICE_MAP = {
      photo: "0.10",        // 1 imagen
      video: "0.30",        // 1 vídeo
      pack10photos: "0.80", // pack 10 fotos
      pack5videos: "1.00"   // pack 5 vídeos
    };

    const value = PRICE_MAP[kind];
    if (!value) return res.status(400).json({ error: "Invalid kind" });

    // Token
    const basic = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const tokRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tok = await tokRes.json();
    if (!tokRes.ok) return res.status(500).json(tok);

    // Orden
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tok.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "EUR", value },
            custom_id: `${kind}:${(items || []).join(",")}`.slice(0, 127),
          },
        ],
        application_context: {
          brand_name: "IbizaGirl",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: "https://ibizagirl.pics/premium.html",
          cancel_url: "https://ibizagirl.pics/premium.html",
        },
      }),
    });

    const data = await orderRes.json();
    if (!orderRes.ok) return res.status(500).json(data);

    return res.status(200).json({ id: data.id });
  } catch (e) {
    console.error("create-order error", e);
    return res.status(500).json({ error: "server_error" });
  }
}

