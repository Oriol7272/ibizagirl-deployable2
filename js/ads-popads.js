(function(){
  var E = window.__ENV||{};
  var SID = E.POPADS_SITE_ID;
  if(!SID){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }
  if(window.__IBG_POPADS_MOUNTED) return; window.__IBG_POPADS_MOUNTED = true;

  var k="e494ffb82839a29122608e933394c091";
  try{ Object.freeze(window[k]=[
    ["siteId", Number(SID)],["minBid",0],["popundersPerIP","0"],
    ["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]
  ]);}catch(e){}

  var s=document.createElement('script');
  s.src='https://cdn.popads.net/pop.js';
  s.async=true;
  s.onerror=function(){}; // evita rojos si el CDN no resuelve en tu red
  (document.head||document.documentElement).appendChild(s);

  console.log('IBG_ADS: POP mounted ->', SID);
})();
