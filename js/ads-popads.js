(function(){
  if(window.__IBG_POPADS_MOUNTED) return;
  window.__IBG_POPADS_MOUNTED = true;

  function start(siteId){
    var KEY='e494ffb82839a29122608e933394c091';
    var cfg=[["siteId",Number(siteId)],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]];
    try{ Object.freeze(window[KEY]=cfg); }catch(e){ window[KEY]=cfg; }

    var s=document.createElement('script');
    s.src='/api/ads/popjs'; s.async=true;
    s.onload=function(){ console.log('IBG_ADS: POP mounted ->', siteId); };
    s.onerror=function(){
      var f=document.createElement('script'); f.src='https://cdn.popads.net/pop.js'; f.async=true;
      (document.head||document.documentElement).appendChild(f);
    };
    (document.head||document.documentElement).appendChild(s);
  }

  function waitEnv(maxTries){
    var c=0; (function tick(){
      var E=window.__ENV||{};
      var SID=E.POPADS_SITE_ID;
      if(SID){ start(SID); }
      else if(c++<50){ setTimeout(tick,100); }
      else { console.log('[ads-popads] disabled or no site id'); }
    })();
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ waitEnv(50); }); }
  else { waitEnv(50); }
})();
