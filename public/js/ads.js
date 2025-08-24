(function (g) {
  const ENV = g.ENV || {};

  function mountSideAds() {
    try {
      // TODO: coloca aquí tu implementación real de banners laterales si aplica.
      // Dejamos no-op seguro para evitar errores en consola.
    } catch (e) { console.warn('Ads side error', e); }
  }

  function mountPopAds() {
    try {
      // TODO: coloca aquí tu implementación real de pop/interstitial si aplica.
    } catch (e) { console.warn('Ads pop error', e); }
  }

  g.Ads = { mountSideAds, mountPopAds };
})(window);
