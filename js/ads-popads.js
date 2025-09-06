(function(){
  var E = (window.__ENV||{});
  var SID = E.POPADS_SITE_ID;
  if(!SID){ console.log('[ads-popads] disabled or no site id'); return; }

  // Config PopAds
  window._pop = window._pop || [];
  window._pop.push(['siteId', SID]);
  //window._pop.push(['minBid', 0.000001]); // opcional

  function tryLoad(url, next){
    var s = document.createElement('script');
    s.async = true;
    s.src = url;
    s.onerror = function(){ next && next(); };
    s.onload = function(){ console.log('IBG_ADS: POP mounted ->', SID); };
    (document.head||document.documentElement).appendChild(s);
  }

  // Orden de intentos (algunos DNS bloquean cdn.*)
  tryLoad(('https:'===location.protocol?'https':'http')+'://popads.net/pop.js', function(){
    tryLoad(('https:'===location.protocol?'https':'http')+'://c1.popads.net/pop.js', function(){
      tryLoad(('https:'===location.protocol?'https':'http')+'://cdn.popads.net/pop.js', function(){
        console.log('[ads-popads] no pudo cargar ningún endpoint PopAds');
      });
    });
  });
})();
