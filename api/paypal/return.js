const PAYPAL_BASE = 'https://api-m.paypal.com';

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

function setCookie(res, name, val, days=30, {httpOnly=true} = {}){
  const max = days*24*60*60;
  const parts = [
    `${name}=${encodeURIComponent(val)}`,
    'Path=/',
    `Max-Age=${max}`,
    'SameSite=Lax',
    'Secure'
  ];
  if (httpOnly) parts.push('HttpOnly');
  res.setHeader('Set-Cookie', [...(res.getHeader('Set-Cookie')||[]), parts.join('; ')]);
}

function parseCookies(req){
  const h=req.headers.cookie||''; const out={};
  h.split(';').forEach(p=>{ const [k,...v]=p.trim().split('='); if(!k) return; out[decodeURIComponent(k)]=decodeURIComponent(v.join('=')||''); });
  return out;
}

module.exports = async (req, res) => {
  try{
    const orderId   = req.query.token || req.query.orderId;
    const resourceId= (req.query.resourceId||'').toString();
    if (!orderId) { res.status(400).end('Missing token'); return; }

    // Captura en PayPal LIVE
    const token = await getAccessToken();
    const capRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method:'POST',
      headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }
    });
    const data = await capRes.json();
    if (!capRes.ok) { res.status(500).end('Capture failed'); return; }

    // Actualiza lista de items (server y UI)
    const cookies = parseCookies(req);
    const list = new Set((cookies.ibg_items||'').split(',').map(s=>s.trim()).filter(Boolean));
    if (resourceId) list.add(resourceId);
    const value = Array.from(list).join(',');

    // Server (HttpOnly) para gate
    setCookie(res, 'ibg_items', value, 30, { httpOnly:true });
    // UI (no HttpOnly) para quitar blur en el front
    setCookie(res, 'ibg_items_ui', value, 30, { httpOnly:false });

    // Redirige a la home con flag
    res.status(302).setHeader('Location','/index.html?unlocked=1');
    res.end();
  }catch(e){
    res.status(500).end('Server error');
  }
};
