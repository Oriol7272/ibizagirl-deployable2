/**
 * ads.js — carga defensiva de proveedores (ExoClick, JuicyAds, EroAdvertising)
 * Evita tocar window.adsbyjuicy hasta que la librería esté lista.
 */
(function () {
  const log = (...a) => console.log('[ads]', ...a);

  // ExoClick lo estás cargando con el provider (deja igual)

  // JuicyAds (zones que uses)
  const JUICY_ZONES = [2092250, 2092251];

  function loadJuicy() {
    return new Promise((resolve) => {
      if (window.juicyads) return resolve();
      const s = document.createElement('script');
      s.src = 'https://adserver.juicyads.com/js/jads.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => resolve(); // no bloqueamos
      document.head.appendChild(s);
    });
  }

  async function initJuicy() {
    await loadJuicy();
    try {
      window.juicyads = window.juicyads || {};
      window.juicyads.requestAds = window.juicyads.requestAds || function(){};
      JUICY_ZONES.forEach((zone) => {
        try {
          // Creamos el div si no existe
          const id = `juicy_${zone}`;
          if (!document.getElementById(id)) {
            const d = document.createElement('div');
            d.id = id;
            document.body.appendChild(d);
          }
          // jads requiere este formato de push
          (window.adsbyjuicy = window.adsbyjuicy || []).push({ adzone: zone });
        } catch (_) {}
      });
      log('Juicy ok (zones)', JUICY_ZONES.join(', '));
    } catch (_e) {}
  }

  // EroAdvertising: pega tu snippet exactamente; se carga solo en donde pongas el <div>

  document.addEventListener('DOMContentLoaded', () => {
    initJuicy();
  });
})();
