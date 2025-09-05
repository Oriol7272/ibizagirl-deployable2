(function(){
  var E = window.__ENV||{};
  var SID = E.POPADS_SITE_ID;
  if(!SID){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }
  if(window.__IBG_POPADS_MOUNTED) return; window.__IBG_POPADS_MOUNTED = true;

  // Config requerido por su loader (clave estable que usan en su snippet).
  var k = "e494ffb82839a29122608e933394c091";
  try{ Object.freeze(window[k] = [
    ["siteId", Number(SID)],
    ["minBid",0],
    ["popundersPerIP","0"],
    ["delayBetween",0],
    ["default",false],
    ["defaultPerDay",0],
    ["topmostLayer","auto"]
  ]);}catch(e){}

  // Cargar su JS principal; si el CDN no resuelve, no hacemos ruido.
  var s=document.createElement('script');
  s.src='https://cdn.popads.net/pop.js';
  s.async=true;
  s.onerror=function(){ /* DNS/Net error: lo dejamos pasar sin rojo extra */ };
  (document.head||document.documentElement).appendChild(s);

  console.log('IBG_ADS: POP mounted ->', SID);
})();
