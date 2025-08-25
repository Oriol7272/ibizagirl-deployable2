export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok:false, error:'method_not_allowed' });
    }
    const { orderId, sku, item } = req.body || {};
    if (!orderId) return res.status(400).json({ ok:false, error:'missing orderId' });
    if (!sku) return res.status(400).json({ ok:false, error:'missing sku' });

    // === ENV ===
    const env = (process.env.PAYPAL_ENV || 'live').toLowerCase(); // 'live' | 'sandbox'
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret   = process.env.PAYPAL_SECRET;
    if (!clientId || !secret) {
      return res.status(500).json({ ok:false, error:'missing PayPal credentials' });
    }
    const base = env === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

    // === OAuth ===
    async function getAccessToken() {
      const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
      const r = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=client_credentials'
      });
      if (!r.ok) throw new Error(`oauth ${r.status}`);
      const j = await r.json();
      return j.access_token;
    }

    // === Capture ===
    const access_token = await getAccessToken();
    const cap = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    });
    const capData = await cap.json();
    if (!cap.ok) {
      return res.status(cap.status).json({ ok:false, error:`paypal ${cap.status}`, details: capData });
    }

    // Esperamos COMPLETED para conceder acceso
    const status = capData.status || capData.result?.status;
    if (status !== 'COMPLETED') {
      return res.status(200).json({ ok:false, pending:true, status, raw: capData });
    }

    // === Emitir "grant" firmado (JWT HS256 muy simple) ===
    // - Para PPV desbloqueamos 1 ítem (el "item" recibido) durante 24h
    // - Para packs/subs cambiaremos el TTL/scope más adelante
    const ttlBySku = {
      'ppv_1': 24 * 60 * 60, // 24h
    };
    const now = Math.floor(Date.now()/1000);
    const ttl = ttlBySku[sku] || (24*60*60);
    const exp = now + ttl;

    const currency = capData?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || 'EUR';
    const value    = capData?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || null;
    const captureId= capData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

    const secretKey = process.env.IBG_GRANT_SECRET || process.env.PAYPAL_SECRET; // usa tu propia secret en prod
    if (!secretKey) {
      return res.status(500).json({ ok:false, error:'missing grant secret' });
    }

    function b64u(input) {
      return Buffer.from(input).toString('base64')
        .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    }
    const header = { alg:"HS256", typ:"JWT" };
    const payload = {
      iss: "ibizagirl.pics",
      iat: now,
      exp,
      typ: "grant",
      sku,
      scope: sku.startsWith('ppv') ? 'item' : 'all',
      item: sku.startsWith('ppv') ? (item || null) : null,
      orderId,
      captureId,
      currency,
      value
    };
    const encHeader = b64u(JSON.stringify(header));
    const encPayload= b64u(JSON.stringify(payload));
    const crypto = await import('node:crypto');
    const sig = crypto.createHmac('sha256', secretKey)
      .update(`${encHeader}.${encPayload}`)
      .digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const token = `${encHeader}.${encPayload}.${sig}`;

    return res.status(200).json({
      ok: true,
      status,
      id: capData.id,
      sku,
      grant: token,
      expiresAt: exp
    });
  } catch (e) {
    console.error('[capture] error', e);
    return res.status(500).json({ ok:false, error:'exception', details:String(e) });
  }
}
