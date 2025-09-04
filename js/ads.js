(function(W){
  function log(){ try{ console.log.apply(console, arguments); }catch(_){ } }
  function load(src, cb){
    var s=document.createElement('script');
    s.async = true; s.defer = true; s.src = src;
    s.onerror=function(){ console.warn('ads load error', src); };
    if(cb) s.onload = cb;
    document.head.appendChild(s);
  }
  function showFallback(el,label){
    if(!el) return;
    if(!el.querySelector('[data-role="fallback"]')){
      el.innerHTML = '<div data-role="fallback" class="box" style="height:100%;display:grid;place-items:center;text-align:center">'
        + '<div style="font-weight:800;margin-bottom:6px">Patrocinado</div>'
        + '<div style="font-size:12px;opacity:.8">Desactiva el bloqueador para ver anuncios ('+label+')</div>'
        + '</div>';
    }
  }
  function removeFallback(el){
    if(!el) return;
    var fb = el.querySelector('[data-role="fallback"]');
    if(fb) fb.remove();
  }
  function hasVisibleIframe(el){
    if(!el) return false;
    var ifr = el.querySelector('iframe');
    if(!ifr) return false;
    var r = ifr.getBoundingClientRect();
    return (r.width >= 40 && r.height >= 40);
  }
  function watchRealAd(el,label,timeoutMs){
    if(!el) return;
    var t0 = Date.now();
    function check(){
      var ok = hasVisibleIframe(el);
      if(ok){ removeFallback(el); return true; }
      if(Date.now() - t0 > (timeoutMs||12000)){ return true; }
      return false;
    }
    var tries = 0;
    var poll = setInterval(function(){
      tries++; if(check()){ clearInterval(poll); if(obs) obs.disconnect(); }
      if(tries > (timeoutMs? timeoutMs/500 : 24)){ clearInterval(poll); if(obs) obs.disconnect(); }
    }, 500);
    var obs = new MutationObserver(function(){ check(); });
    obs.observe(el, {childList:true, subtree:true});
  }

  // ===== JuicyAds (laterales) por proxy
  function mountJuicy(el, zone){
    if(!el || !zone) return false;
    showFallback(el,'lateral');
    // Cargar librería proxificada
    if(!W.__JUICY_LOADED__){ load('/api/ads/juicy'); W.__JUICY_LOADED__=true; }
    // Placeholder + push
    var ph = document.createElement('ins');
    ph.id = 'jadsPlaceHolder' + Math.random().toString(36).slice(2);
    ph.style.width='160px'; ph.style.height='100%';
    el.appendChild(ph);
    (W.adsbyjuicy = W.adsbyjuicy || []).push({ adzone: String(zone) });
    watchRealAd(el,'lateral',12000);
    return true;
  }

  // ===== ExoClick (inferior) por proxy splash
  function mountExo(el, zone){
    if(!el || !zone) return false;
    showFallback(el,'inferior');
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = '/api/ads/exo?zone=' + encodeURIComponent(zone);
    el.appendChild(s);
    watchRealAd(el,'inferior',12000);
    return true;
  }

  // ===== EroAdvertising (inferior) por proxy splash
  function mountEro(el, zone){
    if(!el || !zone) return false;
    showFallback(el,'inferior');
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = '/api/ads/ero?zone=' + encodeURIComponent(zone);
    el.appendChild(s);
    watchRealAd(el,'inferior',12000);
    return true;
  }

  // ===== PopAds opcional (popunder)
  function mountPopAds(siteId){
    if(!siteId) return false;
    // PopAds usa una config global; la proxificamos también
    W.PopAdsStart = { siteId: siteId, minBid: 0 };
    load('/api/ads/popads');
    return true;
  }

  function initAds(){
    var E = W.__ENV || {};
    log('IBG_ADS ZONES ->', { JUICYADS_ZONE:E.JUICYADS_ZONE, EXOCLICK_ZONE:E.EXOCLICK_ZONE, EROADVERTISING_ZONE:E.EROADVERTISING_ZONE, POPADS: !!E.POPADS_ENABLE });

    var L = document.getElementById('slot-left');
    var R = document.getElementById('slot-right');
    var B = document.getElementById('slot-bottom');

    var okL = mountJuicy(L, E.JUICYADS_ZONE);
    var okR = mountJuicy(R, E.JUICYADS_ZONE);

    var okB=false;
    if (E.EXOCLICK_ZONE) okB = mountExo(B, E.EXOCLICK_ZONE);
    if (!okB && E.EROADVERTISING_ZONE) okB = mountEro(B, E.EROADVERTISING_ZONE);

    if (E.POPADS_ENABLE && E.POPADS_SITE_ID) { mountPopAds(E.POPADS_SITE_ID); }
  }

  W.IBG_ADS = { initAds };
})(window);
