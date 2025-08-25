const fetch = global.fetch || require('node-fetch');

async function getAccessToken() {
  const client = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${client}:${secret}`).toString('base64');
  const r = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('oauth ' + r.status);
  const j = await r.json();
  return j.access_token;
}

function b64url(s) {
  return Buffer.from(s).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'method' });
    const { orderId, sku, item } = req.body || {};
    if (!orderId || !sku || !item) return res.status(400).json({ ok:false, error:'missing params' });

    const token = await getAccessToken();
    const cap = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    const data = await cap.json();
    if (!cap.ok) return res.status(cap.status).json({ ok:false, error:`paypal ${cap.status}`, details:data });

    // Validación simple
    const status = data?.status || (data?.purchase_units?.[0]?.payments?.captures?.[0]?.status);
    if (status !== 'COMPLETED') return res.status(400).json({ ok:false, error:'not completed', details: data });

    // Grant 24h para ese ítem
    const now = Math.floor(Date.now()/1000);
    const payload = {
      typ:'grant', provider:'paypal', sku, item,
      iat: now, exp: now + 24*3600, scope:'item', orderId
    };
    const header = { alg:'none', typ:'JWT' }; // sin firma (el front no valida firma)
    const grant = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}.`;

    return res.status(200).json({ ok:true, status:'COMPLETED', grant });
  } catch (e) {
    console.error('[capture] err', e);
    return res.status(500).json({ ok:false, error:String(e) });
  }
};
