export const config = { runtime: 'nodejs' };

export default async function handler(req, res){
  const upstream = 'https://cdn.popads.net/pop.js';
  try{
    const r = await fetch(upstream, {
      headers:{
        'user-agent':'Mozilla/5.0',
        'accept':'*/*'
      }
    });
    if(!r.ok){
      res.setHeader('content-type','application/javascript; charset=utf-8');
      return res.status(200).send(`// upstream non-OK ${r.status}
(function(){var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;document.head.appendChild(s);})();`);
    }
    const js = await r.text();
    res.setHeader('content-type','application/javascript; charset=utf-8');
    res.setHeader('cache-control','public, max-age=300');
    return res.status(200).send(js);
  }catch(e){
    res.setHeader('content-type','application/javascript; charset=utf-8');
    return res.status(200).send(`// proxy error: ${String(e&&e.message||e)}
(function(){var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;document.head.appendChild(s);})();`);
  }
}
