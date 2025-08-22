/* IbizaGirl.pics — ads.js (robusto, sin romper si falla un proveedor) */
(function(w, d){
  const log = (...a)=>console.log('[ads]',...a);
  const warn = (...a)=>console.warn('[ads]',...a);

  // === ExoClick (ejemplo con una zona) ===
  try {
    w.exoPlacement = w.exoPlacement || [];
    // Reemplaza por tus zonas si aquí usabas varias:
    w.exoPlacement.push({ zoneId: 5696328, adType: 'banner' });
    log('ExoClick ok (zone) 5696328');
  } catch(e){ warn('ExoClick error', e); }

  // === JuicyAds (dos zonas display de ejemplo) ===
  try {
    w.adsbyjuicy = w.adsbyjuicy || [];
    w.adsbyjuicy.push({ adzone: 2092250 });
    w.adsbyjuicy.push({ adzone: 2092251 });
    log('Juicy ok (zones) 2092250, 2092251');
  } catch(e){ warn('Juicy error', e); }

  // === EroAdvertising (usa tu snippet oficial) ===
  try {
    // Contenedor de ejemplo: <div id="sp_8177575_node"></div> en tu HTML
    if (typeof w.eaCtrl === 'undefined') {
      var eaCtrlRecs=[]; w.eaCtrl = { add: function(ag){ eaCtrlRecs.push(ag); } };
      var js = d.createElement('script');
      js.setAttribute('src','//go.easrv.cl/loadeactrl.go?pid=152716&spaceid=8177575&ctrlid=798544');
      d.head.appendChild(js);
    }
    w.eaCtrl.add({ "display": "sp_8177575_node", "sid": 8177575, "plugin": "banner" });
    log('EroAdvertising ok (space) 8177575');
  } catch(e){ warn('EroAdvertising error', e); }

  // === (opcional) Si algún pixel hace 401, lo ignoramos sin frenar el resto ===
  w.addEventListener('error', function(ev){
    const src = (ev && ev.target && ev.target.src) || '';
    if (src.includes('adsco.re')) {
      warn('adsco.re 401 ignorado:', src);
      ev.preventDefault?.();
    }
  }, true);
})(window, document);
