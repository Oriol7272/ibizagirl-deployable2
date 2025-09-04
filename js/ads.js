(function(W){
  function log(){ try{ console.log.apply(console, arguments); }catch(_){ } }
  function load(src, cb){
    var s=document.createElement('script');
    s.async = true; s.defer = true; s.src = src;
    s.onerror=function(){ console.warn('ads load error', src); };
    if(cb) s.onload = cb;
    document.head.appendChild(s);
  }
  function clear(el){ if(el){ el.innerHTML=''; } return el; }
  function fallback(el,label){
    if(!el) return;
    el.innerHTML = '<div class="ad-bottom" style="min-height:90px">Publicidad ('+label+')</div>';
  }

  // JUICYADS (laterales): jads.js + push
  function mountJuicy(el, zone){
    if(!el || !zone) return false;
    if(!W.__JUICY_LOADED__){
      load('https://adserver.juicyads.com/js/jads.js', function(){ W.__JUICY_LOADED__=true; });
    }
    var ph = document.createElement('ins');
    ph.id = 'jadsPlaceHolder' + Math.random().toString(36).slice(2);
    clear(el).appendChild(ph);
    (W.adsbyjuicy = W.adsbyjuicy || []).push({ adzone: String(zone) });
    return true;
  }

  // EXOCLICK (bloque inferior): usar splash.php?idzone= (evita CORS y “idzone=null”)
  function mountExo(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.exdynsrv.com/splash.php?idzone=' + encodeURIComponent(zone);
    clear(el).appendChild(s);
    return true;
  }

  // EROADVERTISING (fallback inferior si no hay Exo)
  function mountEro(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.ero-advertising.com/splash.php?idzone=' + encodeURIComponent(zone);
    clear(el).appendChild(s);
    return true;
  }

  function initAds(){
    var E = W.__ENV || {};
    log('IBG_ADS ZONES ->', {
      JUICYADS_ZONE: E.JUICYADS_ZONE,
      EXOCLICK_ZONE: E.EXOCLICK_ZONE,
      EROADVERTISING_ZONE: E.EROADVERTISING_ZONE
    });

    var L = document.getElementById('ad-left');
    var R = document.getElementById('ad-right');
    var B = document.getElementById('ad-bottom');

    var okL = mountJuicy(L, E.JUICYADS_ZONE);
    var okR = mountJuicy(R, E.JUICYADS_ZONE);

    var okBottom = false;
    if (E.EXOCLICK_ZONE) okBottom = mountExo(B, E.EXOCLICK_ZONE);
    if (!okBottom && E.EROADVERTISING_ZONE) okBottom = mountEro(B, E.EROADVERTISING_ZONE);

    if (!okL) fallback(L, 'lateral');
    if (!okR) fallback(R, 'lateral');
    if (!okBottom) fallback(B, 'inferior');
  }

  W.IBG_ADS = { initAds };
})(window);
