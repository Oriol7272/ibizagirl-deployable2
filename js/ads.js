/**
 * IbizaGirl.pics — Ads bootstrap seguro.
 * No lanza excepciones aunque un proveedor falle (CORS, 401, etc.)
 */
(function () {
  'use strict';

  function safe(fn) { try { fn(); } catch (e) { console.debug('[ads] silenciado:', e && e.message); } }

  // ExoClick (ejemplo con zona)
  safe(() => {
    if (!window.mgads) {
      const s = document.createElement('script');
      s.src = 'https://a.magsrv.com/js/ad-provider.js';
      s.async = true;
      s.onload = () => {
        try {
          (window.mgads = window.mgads || []).push({ zoneid: 5696328 });
          console.log('ads: ExoClick ok (zone) 5696328');
        } catch (_) {}
      };
      document.head.appendChild(s);
    }
  });

  // EroAdvertising (usa tu snippet tal cual, pero dentro de try)
  safe(() => {
    const div = document.getElementById('sp_8177575_node');
    if (div) {
      if (typeof window.eaCtrl === 'undefined') {
        window.eaCtrlRecs = [];
        window.eaCtrl = { add: ag => window.eaCtrlRecs.push(ag) };
        const js = document.createElement('script');
        js.src = '//go.easrv.cl/loadeactrl.go?pid=152716&spaceid=8177575&ctrlid=798544';
        document.head.appendChild(js);
      }
      window.eaCtrl.add({ display: 'sp_8177575_node', sid: 8177575, plugin: 'banner' });
      console.log('ads: EroAdvertising ok (space) 8177575');
    }
  });

  // JuicyAds (con guardas para que no falle si bloquea CORS)
  safe(() => {
    const s = document.createElement('script');
    s.src = 'https://adserver.juicyads.com/js/jads.js';
    s.async = true;
    s.onload = () => { console.log('ads: Juicy loaded'); };
    s.onerror = () => { console.log('ads: Juicy bloqueado (CORS)'); };
    document.head.appendChild(s);
  });
})();
