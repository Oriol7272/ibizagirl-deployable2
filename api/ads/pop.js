export const config = { runtime: 'edge' };

function sendJS(code, body) {
  return new Response(body, {
    status: code,
    headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'public, max-age=300' }
  });
}

// Nota: u es la clave que usa PopAds en su snippet ofuscado.
// La dejamos fija como en tu snippet original.
const UKEY = 'e494ffb82839a29122608e933394c091';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const site = searchParams.get('site');
  if (!site) return sendJS(400, '/* missing site */');

  // Upstream principal (si PopAds cambia, el fallback igual lo inyecta)
  const upstream = 'https://cdn.popads.net/pop.js';

  // Script que replica el comportamiento mínimo del snippet original:
  // define window[UKEY] con los parámetros y carga el pop.js desde cdn.
  const loader = `/* popads proxy loader */
(function(){
  try {
    var W=window,U='${UKEY}', cfg=[["siteId",${Number(site)}],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]];
    if(!W[U]){ try{ Object.freeze(W[U] = cfg); }catch(e){ W[U]=cfg; } }
    var s=document.createElement('script');
    s.src=${JSON.stringify(upstream)};
    s.async=true;
    s.crossOrigin='anonymous';
    (document.currentScript||document.scripts[document.scripts.length-1]).parentNode.insertBefore(s,document.currentScript);
  } catch(e){}
})();`;

  // Intentamos un HEAD al upstream para decidir si servimos directo.
  try {
    const r = await fetch(upstream, { method: 'HEAD' });
    if (r.ok) return sendJS(200, loader);
    // si no ok, igual devolvemos loader (el navegador lo intentará)
    return sendJS(200, loader);
  } catch(e) {
    // fallback agresivo: devolvemos igual el loader
    return sendJS(200, loader);
  }
}
