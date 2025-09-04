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
  function hasContent(el){ return !!(el && (el.children.length || el.querySelector('iframe, ins, script'))); }
  function fallback(el,label){
    if(!el) return;
    el.style.display = 'block'; // por si alguna hoja externa lo oculta
    el.innerHTML = '<div class="box" style="height:100%;display:grid;place-items:center;text-align:center"><div style="font-weight:800;margin-bottom:6px">Patrocinado</div><div style="font-size:12px;opacity:.8">Desactiva el bloqueador para ver anuncios ('+label+')</div></div>';
  }

  // ===== JuicyAds (laterales)
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

  // ===== ExoClick (inferior) por splash.php?idzone= (sin CORS)
  function mountExo(el, zone){
    if(!el || !zone) return false;
    var s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://syndication.exdynsrv.com/splash.php?idzone=' + encodeURIComponent(zone);
    clear(el).appendChild(s);
    return true;
  }

  // ===== EroAdvertising (fallback inferior si no hay Exo)
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
    log('IBG_ADS ZONES ->', {JUICYADS_ZONE:E.JUICYADS_ZONE, EXOCLICK_ZONE:E.EXOCLICK_ZONE, EROADVERTISING_ZONE:E.EROADVERTISING_ZONE});

    // IDs neutros (no contienen 'ad')
    var L = document.getElementById('slot-left');
    var R = document.getElementById('slot-right');
    var B = document.getElementById('slot-bottom');

    var okL = mountJuicy(L, E.JUICYADS_ZONE);
    var okR = mountJuicy(R, E.JUICYADS_ZONE);

    var okB=false;
    if (E.EXOCLICK_ZONE) okB = mountExo(B, E.EXOCLICK_ZONE);
    if (!okB && E.EROADVERTISING_ZONE) okB = mountEro(B, E.EROADVERTISING_ZONE);

    // Si hay bloqueador: muestra fallback tras 2.5s si no hay nada renderizado
    setTimeout(function(){
      if(!hasContent(L)) fallback(L,'lateral');
      if(!hasContent(R)) fallback(R,'lateral');
      if(!hasContent(B)) fallback(B,'inferior');
    }, 2500);
  }

  W.IBG_ADS = { initAds };
})(window);
