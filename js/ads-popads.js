(function(){
  var E = (window.__ENV||{});
  var SITE = Number(E.POPADS_SITE_ID||0);
  if(!SITE){ console.log('[ads-popads] disabled or no site id'); return; }

  var KEY = 'e494ffb82839a29122608e933394c091';
  var cfg = [
    ["siteId", SITE],
    ["minBid",0],
    ["popundersPerIP","0"],
    ["delayBetween",0],
    ["default",false],
    ["defaultPerDay",0],
    ["topmostLayer","auto"]
  ];
  try{ Object.freeze(window[KEY]=cfg); }catch(e){ window[KEY]=cfg; }

  function inject(src, onok){
    var s=document.createElement('script');
    s.src=src; s.async=true;
    s.onload=function(){ onok&&onok(); };
    s.onerror=function(){
      // Fallback directo al CDN original
      var s2=document.createElement('script');
      s2.src='https://cdn.popads.net/pop.js';
      s2.async=true;
      (document.head||document.documentElement).appendChild(s2);
    };
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(){
    inject('/api/ads/popjs', function(){
      console.log('IBG_ADS: POP mounted ->', SITE);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
