export const config = { runtime: 'nodejs' };
export default async function handler(req, res) {
  const { site } = req.query;
  const siteId = String(site || process.env.POPADS_SITE_ID || '').trim();
  const up = 'https://c1.popads.net/pop.js';

  const js = `// popads loader
(function(){
  try{
    var _pop = window._pop || (window._pop=[]);
    if(${JSON.stringify(siteId)}){ _pop.push(['siteId', ${JSON.stringify(siteId)}]); }
    _pop.push(['minBid', 0]);
    _pop.push(['popundersPerIP', 1]);       // permite 1 por IP (evita bloqueos por 0)
    _pop.push(['delayBetween', 0]);
    _pop.push(['default', true]);
    _pop.push(['defaultPerDay', 10]);
    _pop.push(['topmostLayer','auto']);
    var s=document.createElement('script'); s.async=true; s.src=${JSON.stringify(up)}; s.referrerPolicy='unsafe-url';
    (document.head||document.documentElement).appendChild(s);
    console.log && console.log('IBG_ADS: POPADS injected ->', ${JSON.stringify(siteId)});
  }catch(e){ console && console.warn('POPADS error', e); }
})();`;
  res.setHeader('content-type','application/javascript; charset=utf-8');
  res.status(200).send(js);
}
