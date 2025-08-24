const PAYPAL = 'https://api-m.paypal.com';

async function token(){
  const id=process.env.PAYPAL_CLIENT_ID, se=process.env.PAYPAL_SECRET;
  const r = await fetch(`${PAYPAL}/v1/oauth2/token`, {
    method:'POST',
    headers:{ 'Authorization':'Basic '+Buffer.from(`${id}:${se}`).toString('base64'),
              'Content-Type':'application/x-www-form-urlencoded' },
    body:'grant_type=client_credentials'
  });
  if(!r.ok) throw new Error('oauth failed');
  return (await r.json()).access_token;
}
function baseUrl(req){
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host  = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}
module.exports = async (req,res)=>{
  try{
    if(req.method!=='POST'){ res.status(405).end('Method Not Allowed'); return; }
    const { planId, tier } = req.body||{};
    if(!planId || !tier){ res.status(400).json({error:'planId and tier required'}); return; }

    const t = await token();
    const base = baseUrl(req);
    const return_url = `${base}/api/paypal/sub-return?tier=${encodeURIComponent(tier)}`;
    const cancel_url = `${base}/premium.html?sub_canceled=1`;

    const r = await fetch(`${PAYPAL}/v1/billing/subscriptions`, {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${t}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'IbizaGirl.pics',
          user_action: 'SUBSCRIBE_NOW',
          return_url, cancel_url
        }
      })
    });
    const j = await r.json();
    if(!r.ok){ res.status(500).json({error:'create sub failed', j}); return; }

    const approve = (j.links||[]).find(l=>l.rel==='approve')?.href;
    res.status(200).json({ id:j.id, approveUrl: approve || null });
  }catch(e){
    res.status(500).json({error:e.message||'server error'});
  }
};
