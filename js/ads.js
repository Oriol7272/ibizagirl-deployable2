(function (w, d) {
  const E = (w.__ENV || {});
  const Z = {
    EROADVERTISING_ZONE: E.EROADVERTISING_ZONE || null,
    EXOCLICK_ZONE: E.EXOCLICK_ZONE || null,
    JUICYADS_ZONE: E.JUICYADS_ZONE || null,
    POPADS_SITE_ID: E.POPADS_SITE_ID || null,
    POPADS_ENABLE: (E.POPADS_ENABLE || '').toString().toLowerCase() === 'true'
  };
  console.log('IBG_ADS ZONES ->', Z);

  function ensureSlots() {
    if (d.getElementById('ad-right')) return;
    const left = d.createElement('div'); left.id = 'ad-left'; left.className = 'ad ad-lateral';
    const right = d.createElement('div'); right.id = 'ad-right'; right.className = 'ad ad-lateral';
    const bottom = d.createElement('div'); bottom.id = 'ad-bottom'; bottom.className = 'ad ad-bottom';
    d.body.append(left, right, bottom);
  }

  function addScript(targetId, src) {
    const t = d.getElementById(targetId) || d.body;
    const s = d.createElement('script');
    s.src = src; s.async = true; s.referrerPolicy = 'no-referrer';
    s.onerror = () => console.warn('ad load error', src);
    t.appendChild(s);
  }

  function initAds() {
    ensureSlots();
    // === EroAdvertising: lo mostramos a la derecha con PROXY (evita CORS/SSL) ===
    if (Z.EROADVERTISING_ZONE) {
      addScript('ad-right', '/api/ads/ero?zone=' + encodeURIComponent(Z.EROADVERTISING_ZONE));
    }
    // (ExoClick y Juicy los activaremos en los siguientes pasos)
  }

  // EXPONE API GLOBAL
  w.IBG_ADS = { initAds, _ZONES: Z };
})(window, document);
