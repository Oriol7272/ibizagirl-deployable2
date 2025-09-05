(function(){
  try{
    var E = window.__ENV||{};
    var SID = E.POPADS_SITE_ID;
    if(!SID) return;
    // Loader oficial; si el CDN está bloqueado, no podemos forzarlo
    window.POPADS = window.POPADS || [];
    window.POPADS.push(["siteId", Number(SID)]);
    window.POPADS.push(["popundersPerIP","0"]);
    window.POPADS.push(["delayBetween", 0]);
    var s=document.createElement('script'); s.async=true;
    s.src='https://cdn.popads.net/pop.js';
    s.onerror=function(){ console.log('[popads] CDN bloqueado o no resolvible'); };
    (document.head||document.documentElement).appendChild(s);
  }catch(e){}
})();
