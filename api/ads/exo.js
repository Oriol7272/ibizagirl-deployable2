export const config = { runtime: 'nodejs' };
export default async function handler(req, res) {
  const { zone } = req.query;
  const z = String(zone || process.env.EXOCLICK_ZONE || '').trim();
  const upstream = 'https://a.exosrv.com/serve/v3.js'; // variante habitual; si tu cuenta usa a.exoclick.com, cámbialo

  if (!z) {
    res.status(200).setHeader('content-type','application/javascript; charset=utf-8')
      .send('// exo: missing zone (no __ENV.EXOCLICK_ZONE)\n');
    return;
  }
  const js = `// exo loader
(function(){
  try{
    var s=document.createElement('script');
    s.src=${JSON.stringify(upstream)};
    s.async=true;
    s.setAttribute('data-idzone', ${JSON.stringify(z)});
    s.referrerPolicy='unsafe-url';
    var p=(document.currentScript||document.scripts[document.scripts.length-1]);
    (p.parentNode||document.head).insertBefore(s,p);
    console.log && console.log('IBG_ADS: EXO loader injected ->', ${JSON.stringify(z)});
  }catch(e){ console && console.warn('EXO error', e); }
})();`;
  res.setHeader('content-type','application/javascript; charset=utf-8');
  res.status(200).send(js);
}
