// api/paypal/capture-order.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).end("Method Not Allowed");
    }
    const { orderID } = req.body || {};
    if (!orderID) return res.status(400).json({ error: "missing orderID" });

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

    // Captura
    const capRes = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`,
      { method: "POST", headers: { Authorization: `Bearer ${tok.access_token}` } }
    );

    const data = await capRes.json();
    if (!capRes.ok) return res.status(500).json(data);

    return res.status(200).json({ ok: true, data });
  } catch (e) {
    console.error("capture-order error", e);
    return res.status(500).json({ error: "server_error" });
  }
}

