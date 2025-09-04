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
    el.dataset.fallback = '1';
    el.innerHTML = '<div data-role="fallback" class="box" style="height:100%;display:grid;place-items:center;text-align:center">'
      + '<div style="font-weight:800;margin-bottom:6px">Patrocinado</div>'
      + '<div style="font-size:12px;opacity:.8">Desactiva el bloqueador para ver anuncios ('+label+')</div>'
      + '</div>';
  }
  function removeFallback(el){
    if(!el) return;
    var fb = el.querySelector('[data-role="fallback"]');
    if(fb) fb.remove();
    delete el.dataset.fallback;
  }
  function hasVisibleIframe(el){
    if(!el) return false;
    var ifr = el.querySelector('iframe');
    if(!ifr) return false;
    var r = ifr.getBoundingClientRect();
    return (r.width >= 40 && r.height >= 40); // umbral razonable
  }
  // Vigila hasta 12s; solo retira fallback si aparece un iframe real
  function watchRealAd(el,label){
    if(!el) return;
    var t0 = Date.now();
    function check(){
      var ok = hasVisibleIframe(el);
      if(ok){ removeFallback(el); return true; }
      if(Date.now() - t0 > 12000){ return true; } // dejar fallback para siempre
      return false;
    }
    // Primeras comprobaciones por sondeo
    var tries = 0;
    var poll = setInterval(function(){
      tries++;
      if(check()){ clearInterval(poll); if(obs) obs.disconnect(); }
      if(tries > 24){ clearInterval(poll); if(obs) obs.disconnect(); } // ~12s
    }, 500);
    // Además, observar mutaciones del slot
    var obs = new MutationObserver(function(){ check(); });
    obs.observe(el, {childList:true, subtree:true});
  }

  // ===== JuicyAds (laterales)
  function mountJuicy(el, zone){
    if(!el || !zone) return false;
    if(!W.__JUICY_LOADED__){
      load('https://adserver.juicyads.com/js/jads.js', function(){ W.__JUICY_LOADED__=true; });
    }
    // No limpiamos: mantenemos el fallback, añadimos el placeholder
    var ph = document.createElement('ins');
    ph.id = 'jadsPlaceHolder' + Math.random().toString(36).slice(2);
    ph.style.width='160px'; ph.style.height='100%';
    el.appendChild(ph);
    (W.adsbyjuicy = W.adsbyjuicy || []).push({ adzone: String(zone) });
    return true;
  }

  // ===== ExoClick (inferior) por splash (evita CORS)
  function mountExo(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.exdynsrv.com/splash.php?idzone=' + encodeURIComponent(zone);
    el.appendChild(s);
    return true;
  }

  // ===== EroAdvertising (inferior) por splash
  function mountEro(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.ero-advertising.com/splash.php?idzone=' + encodeURIComponent(zone);
    el.appendChild(s);
    return true;
  }

  function initAds(){
    var E = W.__ENV || {};
    // Log con valores legibles
    try{ console.log('IBG_ADS ZONES ->', JSON.stringify({JUICYADS_ZONE:E.JUICYADS_ZONE, EXOCLICK_ZONE:E.EXOCLICK_ZONE, EROADVERTISING_ZONE:E.EROADVERTISING_ZONE})); }catch(_){}

    var L = document.getElementById('slot-left');
    var R = document.getElementById('slot-right');
    var B = document.getElementById('slot-bottom');

    // 1) Fallback primero
    showFallback(L,'lateral'); showFallback(R,'lateral'); showFallback(B,'inferior');

    // 2) Intentar redes
    if (E.JUICYADS_ZONE){ mountJuicy(L, E.JUICYADS_ZONE); mountJuicy(R, E.JUICYADS_ZONE); }
    var bottomOK = false;
    if (E.EXOCLICK_ZONE){ bottomOK = mountExo(B, E.EXOCLICK_ZONE); }
    if (!bottomOK && E.EROADVERTISING_ZONE){ bottomOK = mountEro(B, E.EROADVERTISING_ZONE); }

    // 3) Vigilar si aparece un iframe real; si sí, retiramos fallback
    watchRealAd(L,'lateral');
    watchRealAd(R,'lateral');
    watchRealAd(B,'inferior');
  }

  W.IBG_ADS = { initAds };
})(window);
