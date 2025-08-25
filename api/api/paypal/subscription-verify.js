const fetch = require('node-fetch');
const PP_BASE = (process.env.PAYPAL_ENV || 'live') === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const sec = process.env.PAYPAL_CLIENT_SECRET;
  const r = await fetch(PP_BASE + '/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + Buffer.from(id + ':' + sec).toString('base64') },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });
  const j = await r.json();
  if (!r.ok) throw new Error('oauth ' + r.status + ': ' + JSON.stringify(j));
  return j.access_token;
}

const b64u = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
  .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

module.exports = async (req, res) => {
  try{
    if (req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
    const { subscriptionID } = req.body||{};
    if (!subscriptionID) return res.status(400).json({ok:false,error:'missing subscriptionID'});

    const at = await getAccessToken();
    const r  = await fetch(`${PP_BASE}/v1/billing/subscriptions/${encodeURIComponent(subscriptionID)}`,{
      headers:{'Authorization':`Bearer ${at}`}
    });
    const j = await r.json();
    if(!r.ok) return res.status(r.status).json({ok:false,error:`paypal ${r.status}`,details:j});

    if(j.status!=='ACTIVE') return res.status(400).json({ok:false,error:'subscription_not_active',details:j.status});

    const now=Math.floor(Date.now()/1000);
    // 30 días de acceso total (ajústalo a tu lógica)
    const header=b64u({alg:'none',typ:'JWT'});
    const payload=b64u({typ:'grant',scope:'all',iat:now,exp:now+30*24*3600,subid:subscriptionID});
    const grant=`${header}.${payload}.`;

    res.status(200).json({ok:true,grant,status:j.status,subscriptionID});
  }catch(e){
    console.error('[subscription-verify]',e);
    res.status(500).json({ok:false,error:'exception',details:String(e)});
  }
};
