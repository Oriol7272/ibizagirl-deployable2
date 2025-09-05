(function(){
  var mounted = false;
  function mountPopads(SID){
    if(mounted) return; mounted = true;
    var k="e494ffb82839a29122608e933394c091";
    try{ Object.freeze(window[k]=[
      ["siteId", Number(SID)],["minBid",0],["popundersPerIP","0"],
      ["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]
    ]);}catch(e){}
    var s=document.createElement('script');
    s.src='https://cdn.popads.net/pop.js';
    s.async=true;
    s.onerror=function(){}; // no ensuciar la consola si el CDN no resuelve
    (document.head||document.documentElement).appendChild(s);
    console.log('IBG_ADS: POP mounted ->', SID);
  }

  function tryMount(){
    var E = window.__ENV||{};
    var SID = E.POPADS_SITE_ID;
    if(SID){ mountPopads(SID); return true; }
    return false;
  }

  // 30 intentos cada 100ms (~3s) esperando a que __ENV esté listo
  if(!tryMount()){
    let n=30, iv=setInterval(function(){
      if(tryMount()){ clearInterval(iv); }
      else if(--n<=0){ clearInterval(iv); console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); }
    }, 100);
  }
})();
