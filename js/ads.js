(function(W){
  function load(src, cb){
    var s=document.createElement('script');
    s.async = true; s.src = src; s.onerror=function(){console.warn('ads load error', src)};
    if(cb) s.onload = cb; document.head.appendChild(s);
  }
  function clear(el){ if(el){ el.innerHTML=''; } return el; }
  function fallbackBox(el,label){
    if(!el) return;
    el.innerHTML = '<div class="ad-bottom" style="min-height:90px">Publicidad ('+label+')</div>';
  }

  // ---- JUICYADS (laterales)
  function mountJuicy(el, zone){
    if(!el || !zone) return false;
    // Carga jads.js una sola vez
    if(!W.__JUICY_LOADED__){
      load('https://adserver.juicyads.com/js/jads.js', function(){ W.__JUICY_LOADED__=true; });
    }
    var ph = document.createElement('ins');
    // cualquier id que empiece por jadsPlaceHolder funciona
    ph.id = 'jadsPlaceHolder' + Math.random().toString(36).slice(2);
    clear(el).appendChild(ph);
    (W.adsbyjuicy = W.adsbyjuicy || []).push({ adzone: String(zone) });
    return true;
  }

  // ---- EXOCLICK (bloque inferior preferente)
  function mountExo(el, zone){
    if(!el || !zone) return false;
    if(!W.__EXO_LOADED__){
      load('https://a.exdynsrv.com/nativeads.js', function(){ W.__EXO_LOADED__=true; });
    }
    var ins = document.createElement('ins');
    ins.className = 'adsbyexoclick';
    ins.setAttribute('data-zoneid', String(zone));
    clear(el).appendChild(ins);
    (W.AdProvider = W.AdProvider || []).push({ serve: {} });
    return true;
  }

  // ---- EROADVERTISING (si no hay Exo)
  function mountEro(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://syndication.ero-advertising.com/script.js?idzone=' + encodeURIComponent(zone);
    clear(el).appendChild(s);
    return true;
  }

  function initAds(){
    var E = W.__ENV || {};
    // Debug rápido
    try{ console.log('IBG_ADS ZONES', {juicy:E.JUICYADS_ZONE, exo:E.EXOCLICK_ZONE, ero:E.EROADVERTISING_ZONE}); }catch(_){}

    var L = document.getElementById('ad-left');
    var R = document.getElementById('ad-right');
    var B = document.getElementById('ad-bottom');

    var anyL = mountJuicy(L, E.JUICYADS_ZONE);
    var anyR = mountJuicy(R, E.JUICYADS_ZONE);

    var bottomOK = false;
    if (E.EXOCLICK_ZONE) bottomOK = mountExo(B, E.EXOCLICK_ZONE);
    if (!bottomOK && E.EROADVERTISING_ZONE) bottomOK = mountEro(B, E.EROADVERTISING_ZONE);

    if (!anyL) fallbackBox(L, 'lateral');
    if (!anyR) fallbackBox(R, 'lateral');
    if (!bottomOK) fallbackBox(B, 'inferior');
  }

  W.IBG_ADS = { initAds };
})(window);
