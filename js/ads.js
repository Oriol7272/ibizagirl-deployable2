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
  function hasRealAd(el){
    if(!el) return false;
    // Si existen iframes, imágenes, o <ins> específicos de redes, consideramos “real ad”
    if(el.querySelector('iframe, img, ins.adsbyexoclick, ins[id^="jadsPlaceHolder"]')) return true;
    // Si alguna red inyectó un DIV con estilos inline
    if(el.children.length && el.textContent.trim().length > 0) return true;
    return false;
  }

  // ===== Red: Juicy (laterales)
  function mountJuicy(el, zone){
    if(!el || !zone) return false;
    if(!W.__JUICY_LOADED__){
      load('https://adserver.juicyads.com/js/jads.js', function(){ W.__JUICY_LOADED__=true; });
    }
    var ph = document.createElement('ins');
    ph.id = 'jadsPlaceHolder' + Math.random().toString(36).slice(2);
    ph.style.width='160px'; ph.style.height='100%';
    // NO limpiamos: dejamos fallback y añadimos ad; si aparece ad real, quitamos fallback
    el.appendChild(ph);
    (W.adsbyjuicy = W.adsbyjuicy || []).push({ adzone: String(zone) });
    return true;
  }

  // ===== Red: Exo (inferior) por splash (evita CORS)
  function mountExo(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.exdynsrv.com/splash.php?idzone=' + encodeURIComponent(zone);
    el.appendChild(s);
    return true;
  }

  // ===== Red: Ero (inferior) por splash
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
    log('IBG_ADS ZONES ->', {JUICYADS_ZONE:E.JUICYADS_ZONE, EXOCLICK_ZONE:E.EXOCLICK_ZONE, EROADVERTISING_ZONE:E.EROADVERTISING_ZONE});

    var L = document.getElementById('slot-left');
    var R = document.getElementById('slot-right');
    var B = document.getElementById('slot-bottom');

    // 1) Fallback primero (siempre visible)
    showFallback(L,'lateral'); showFallback(R,'lateral'); showFallback(B,'inferior');

    // 2) Intentar redes
    if (E.JUICYADS_ZONE){ mountJuicy(L, E.JUICYADS_ZONE); mountJuicy(R, E.JUICYADS_ZONE); }
    var bottomOK = false;
    if (E.EXOCLICK_ZONE){ bottomOK = mountExo(B, E.EXOCLICK_ZONE); }
    if (!bottomOK && E.EROADVERTISING_ZONE){ bottomOK = mountEro(B, E.EROADVERTISING_ZONE); }

    // 3) Revisión tras 3.2s: si hay “ad real”, quitamos fallback
    setTimeout(function(){
      var hadL = hasRealAd(L), hadR = hasRealAd(R), hadB = hasRealAd(B);
      log('IBG_ADS detect real ->', {left:hadL, right:hadR, bottom:hadB});
      if(hadL) removeFallback(L);
      if(hadR) removeFallback(R);
      if(hadB) removeFallback(B);
    }, 3200);
  }

  W.IBG_ADS = { initAds };
})(window);
