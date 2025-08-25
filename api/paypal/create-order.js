// Hotfix: crear pedido sin items[] para evitar ITEM_TOTAL_REQUIRED.
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok:false, error:'Method Not Allowed' });
    }

    const { sku } = req.body || {};
    if (!sku) return res.status(400).json({ ok:false, error:'Missing sku' });

    // Mapa de precios base (ajusta a tus importes reales):
    const PRICES = {
      ppv_1:   '2.99',
      pack10:  '9.99',
      pack50:  '29.99'
    };
    const price = PRICES[sku];
    if (!price) return res.status(400).json({ ok:false, error:'Unknown sku' });

    // Entorno PayPal
    const env = (process.env.PAYPAL_ENV || 'live').toLowerCase();
    const base = env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const client = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    if (!client || !secret) return res.status(500).json({ ok:false, error:'Missing PayPal credentials' });

    // Token
    const basic = Buffer.from(`${client}:${secret}`).toString('base64');
    const tokRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });
    if (!tokRes.ok) {
      const t = await tokRes.text();
      return res.status(500).json({ ok:false, error:'oauth_fail', details:t });
    }
    const { access_token } = await tokRes.json();

    const currency = process.env.IBG_CURRENCY || process.env.CURRENCY || 'EUR';
    const returnUrl = process.env.IBG_RETURN_URL || 'https://ibizagirl.pics/premium.html?paypalReturn=1';
    const cancelUrl = process.env.IBG_CANCEL_URL || 'https://ibizagirl.pics/premium.html?paypalCancel=1';
    const brand = process.env.IBG_BRAND || 'IBIZA GIRL';

    // Pedido SIN items[] => solo amount.value
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: sku,
        description: `IBG ${sku}`,
        amount: {
          currency_code: currency,
          value: price
        }
      }],
      application_context: {
        brand_name: brand,
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        return_url: returnUrl,
        cancel_url: cancelUrl
      }
    };

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
      body: JSON.stringify(payload)
    });

    const data = await orderRes.json();
    if (!orderRes.ok) {
      return res.status(orderRes.status).json({ ok:false, error:`paypal ${orderRes.status}`, details:data });
    }
    return res.status(200).json({ ok:true, id:data.id, status:data.status, sku, currency, value:price });
  } catch (e) {
    console.error('[create-order] error', e);
    return res.status(500).json({ ok:false, error:'exception', details: String(e) });
  }
}
