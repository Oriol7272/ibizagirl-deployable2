(function(){
  // PopAds: carga bajo interacción o al cabo de unos segundos
  var E = (window.__ENV||{});
  var SITE = E.POPADS_SITE_ID; // e.g. 5226758
  if(!SITE){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }

  function inject(){
    if(document.querySelector('script[data-popads="1"]')) return;
    var s = document.createElement('script');
    // Proxy propio que te entregamos para evitar CORS/UA issues
    s.src = '/api/ads/popjs?site='+encodeURIComponent(SITE);
    s.async = true;
    s.dataset.popads = '1';
    (document.head||document.documentElement).appendChild(s);
    console.log('IBG_ADS: POPADS injected ->', SITE);
  }

  // Primer clic del usuario
  window.addEventListener('click', function once(){
    inject(); window.removeEventListener('click', once);
  }, {once:true});

  // O a los 7–10s aleatorios
  var delay = 7000 + Math.floor(Math.random()*3000);
  setTimeout(inject, delay);
})();
