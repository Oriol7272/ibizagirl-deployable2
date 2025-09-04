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
  function ensureMin(el, h){ if(!el) return; el.style.minHeight = (h||90)+'px'; el.style.display='block'; }
  function visiblePixels(el){ try{ return el ? el.getBoundingClientRect().height|0 : 0; }catch(_){ return 0; } }
  function fallback(el,label){
    if(!el) return;
    ensureMin(el, label==='lateral'? 600 : 90);
    el.innerHTML = '<div class="box" style="height:100%;display:grid;place-items:center;text-align:center"><div style="font-weight:800;margin-bottom:6px">Patrocinado</div><div style="font-size:12px;opacity:.8">Desactiva el bloqueador para ver anuncios ('+label+')</div></div>';
  }

  // ===== JuicyAds laterales
  function mountJuicy(el, zone){
    if(!el || !zone) return false;
    ensureMin(el, 600);
    if(!W.__JUICY_LOADED__){
      load('https://adserver.juicyads.com/js/jads.js', function(){ W.__JUICY_LOADED__=true; });
    }
    var ph = document.createElement('ins');
    ph.id = 'jadsPlaceHolder' + Math.random().toString(36).slice(2);
    ph.style.width='160px'; ph.style.height='100%'; // columna
    clear(el).appendChild(ph);
    (W.adsbyjuicy = W.adsbyjuicy || []).push({ adzone: String(zone) });
    return true;
  }

  // ===== ExoClick bottom (splash.php?idzone=) — anti-CORS
  function mountExo(el, zone){
    if(!el || !zone) return false;
    ensureMin(el, 90);
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.exdynsrv.com/splash.php?idzone=' + encodeURIComponent(zone);
    clear(el).appendChild(s);
    return true;
  }

  // ===== EroAdvertising bottom (fallback si no hay Exo)
  function mountEro(el, zone){
    if(!el || !zone) return false;
    ensureMin(el, 90);
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.ero-advertising.com/splash.php?idzone=' + encodeURIComponent(zone);
    clear(el).appendChild(s);
    return true;
  }

  function initAds(){
    var E = W.__ENV || {};
    log('IBG_ADS ZONES ->', {JUICYADS_ZONE:E.JUICYADS_ZONE, EXOCLICK_ZONE:E.EXOCLICK_ZONE, EROADVERTISING_ZONE:E.EROADVERTISING_ZONE});

    var L = document.getElementById('slot-left');
    var R = document.getElementById('slot-right');
    var B = document.getElementById('slot-bottom');

    var okL = mountJuicy(L, E.JUICYADS_ZONE);
    var okR = mountJuicy(R, E.JUICYADS_ZONE);

    var okB=false;
    if (E.EXOCLICK_ZONE) okB = mountExo(B, E.EXOCLICK_ZONE);
    if (!okB && E.EROADVERTISING_ZONE) okB = mountEro(B, E.EROADVERTISING_ZONE);

    // Fallback duro por altura: si en 2800 ms el slot no muestra nada, pintamos caja
    setTimeout(function(){
      var hL = visiblePixels(L), hR = visiblePixels(R), hB = visiblePixels(B);
      log('IBG_ADS heights(px)', {left:hL, right:hR, bottom:hB});
      if(hL < 40) fallback(L,'lateral');
      if(hR < 40) fallback(R,'lateral');
      if(hB < 40) fallback(B,'inferior');
    }, 2800);
  }

  W.IBG_ADS = { initAds };
})(window);
