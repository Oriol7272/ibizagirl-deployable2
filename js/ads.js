// Carga simple y robusta de anuncios.
// Requiere __ENV con: EXOCLICK_ZONE, EROADVERTISING_ZONE, JUICYADS_ZONE, POPADS_ENABLE, POPADS_SITE_ID
(function(W,D){
  const E=W.__ENV||{};
  const Z={
    JUICYADS_ZONE: E.JUICYADS_ZONE,
    EXOCLICK_ZONE: E.EXOCLICK_ZONE,
    EROADVERTISING_ZONE: E.EROADVERTISING_ZONE,
    POPADS: (E.POPADS_ENABLE===true || E.POPADS_ENABLE==='true') && E.POPADS_SITE_ID
  };
  console.log("IBG_ADS ZONES ->", Z);

  const slots={
    L: D.getElementById('ad-left'),
    R: D.getElementById('ad-right'),
    B: D.getElementById('ad-bottom')
  };

  function inject(slot, html){
    const c = slots[slot] || D.body;
    const d = D.createElement('div');
    d.className='ibg-ad';
    d.innerHTML = html;
    c.appendChild(d);
  }
  function addScript(slot, src, attrs={}){
    const c = slots[slot] || D.body;
    const s = D.createElement('script');
    s.async = true;
    s.src = src;
    for (const k in attrs) s.setAttribute(k, attrs[k]);
    s.onerror = ()=>console.warn('ad load error', src);
    c.appendChild(s);
  }

  // LATERALES 300x250: izquierda Ero, derecha Exo (si hay zonas)
  if (Z.EROADVERTISING_ZONE) {
    // EroAdvertising: banner / splash.php?idzone=...
    addScript('L', `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(Z.EROADVERTISING_ZONE)}`);
  }
  if (Z.EXOCLICK_ZONE) {
    // ExoClick: banner / splash.php?idzone=...
    addScript('R', `https://syndication.exdynsrv.com/splash.php?idzone=${encodeURIComponent(Z.EXOCLICK_ZONE)}`);
  }

  // JUICY (solo si no está suspendido). Si tu sitio está “SUSPENDED” no verás nada aunque cargue.
  if (Z.JUICYADS_ZONE) {
    // Colócalo en el bottom como tercer intento
    // Nota: muchas integraciones de Juicy usan <script src="https://juicyads.in/js/jads.js"></script> + unit;
    // este loader básico sirve para zonas "js" modernas (si tu zona requiere unit HTML, pégalo en ads/test).
    addScript('B', `https://juicyads.in/js/jads.js?zone=${encodeURIComponent(Z.JUICYADS_ZONE)}`);
  }

  // POPADS (opcional; overlay)
  if (Z.POPADS) {
    // Snippet PopAds mínimo; usa el SITE_ID desde env
    (function(){
      var _pop = window._pop || {};
      _pop.siteId = E.POPADS_SITE_ID;
      _pop.popundersPerIP = 0; _pop.default = false; _pop.topmostLayer="auto";
      window._pop = _pop;
      var s = D.createElement('script');
      s.async = true;
      s.src = 'https://cdn.popads.net/pop.js';
      s.onerror = ()=>console.warn('PopAds bloqueado por navegador/ETP');
      (D.head||D.documentElement).appendChild(s);
    })();
  }

  // Fallback “Patrocinado” si en 3s no hay nada dentro de cada contenedor
  setTimeout(()=>{
    ['L','R','B'].forEach(k=>{
      const c=slots[k];
      if(!c) return;
      const hasContent = c.querySelector('iframe, ins, script, img, a');
      if(!hasContent) c.innerHTML = '<div class="ad-fallback">Patrocinado</div>';
    });
  }, 3000);
})(window,document);
