const PAYPAL_BASE = 'https://api-m.paypal.com'; // LIVE

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const se = process.env.PAYPAL_SECRET;
  const r = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:'POST',
    headers:{
      'Authorization':'Basic ' + Buffer.from(`${id}:${se}`).toString('base64'),
      'Content-Type':'application/x-www-form-urlencoded'
    },
    body:'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('paypal oauth failed');
  const j = await r.json();
  return j.access_token;
}
function getBaseUrl(req){
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host  = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}
module.exports = async (req, res) => {
  try{
    if (req.method !== 'POST') { res.status(405).end('Method Not Allowed'); return; }
    const { amount, currency='EUR', resourceId } = req.body || {};
    if (!amount || !resourceId) { res.status(400).json({error:'amount and resourceId required'}); return; }

    const token = await getAccessToken();
    const base  = getBaseUrl(req);
    const return_url = `${base}/api/paypal/return?resourceId=${encodeURIComponent(resourceId)}`;
    const cancel_url = `${base}/premium.html?canceled=1`;

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:'POST',
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: currency, value: amount.toFixed(2) } }],
        application_context: {
          brand_name: 'IbizaGirl.pics',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url,
          cancel_url
        }
      })
    });
    const data = await orderRes.json();
    if (!orderRes.ok) { res.status(500).json({error:'create order failed', data}); return; }

    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({
      id: data.id,
      status: data.status,
      links: data.links,
      approveUrl: (data.links||[]).find(l => l.rel==='approve')?.href || null
    }));
  }catch(e){
    res.status(500).json({error:e.message||'server error'});
  }
};
