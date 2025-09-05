export const config = { runtime: 'edge' };

function sendJS(code, body) {
  return new Response(body, {
    status: code,
    headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'public, max-age=300' }
  });
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');
  if (!zone) return sendJS(400, '/* missing zone */');
  const upstream = `https://syndication.exdynsrv.com/splash.php?idzone=${encodeURIComponent(zone)}`;

  // Intento proxy del JS (algunos entornos devuelven 403/5xx por TLS/CORS)
  try {
    const r = await fetch(upstream, { headers: { 'user-agent':'Mozilla/5.0' } });
    if (r.ok) {
      const txt = await r.text();
      return sendJS(200, txt);
    }
    // fallback: inyectar loader directo en el navegador
    const fb = `/* exo fallback (${r.status}) */(function(){try{var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;(document.currentScript||document.scripts[document.scripts.length-1]).parentNode.insertBefore(s,document.currentScript);}catch(e){}})();`;
    return sendJS(200, fb);
  } catch (e) {
    const fb = `/* exo proxy error: ${String(e&&e.message||e)} */(function(){try{var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;(document.currentScript||document.scripts[document.scripts.length-1]).parentNode.insertBefore(s,document.currentScript);}catch(e){}})();`;
    return sendJS(200, fb);
  }
}
