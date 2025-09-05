export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  const { site } = req.query;
  const siteId = String(site || process.env.POPADS_SITE_ID || '').trim();
  const up = 'https://c1.popads.net/pop.js';

  const js = `// popads loader
(function(){
  try{
    var _pop = window._pop || (window._pop=[]);
    if(${JSON.stringify(siteId)}){
      _pop.push(['siteId', ${JSON.stringify(siteId)}]);
    }
    _pop.push(['minBid', 0]);
    _pop.push(['popundersPerIP','0']);
    _pop.push(['delayBetween', 0]);
    _pop.push(['default', false]);
    _pop.push(['defaultPerDay', 0]);
    _pop.push(['topmostLayer','auto']);
    var s=document.createElement('script'); s.async=true; s.src=${JSON.stringify(up)}; s.referrerPolicy='unsafe-url';
    (document.head||document.documentElement).appendChild(s);
  }catch(e){}
})();`;

  res.setHeader('content-type','application/javascript; charset=utf-8');
  res.status(200).send(js);
}
