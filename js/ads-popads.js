(function(){
  // Espera a que __ENV esté listo y tenga POPADS_ENABLE y POPADS_SITE_ID
  var tries = 0, MAX_TRIES = 40; // ~8s
  function waitEnv(){
    var E = window.__ENV || {};
    var enabled = (E.POPADS_ENABLE === 1 || E.POPADS_ENABLE === '1');
    var sid = Number(E.POPADS_SITE_ID || 0);

    if (enabled && sid > 0){
      if (window.__IBG_POPADS_MOUNTED) return;
      window.__IBG_POPADS_MOUNTED = true;

      // Inyectamos el snippet oficial (auto-resiliente) con tu siteId
      var w = '(function(){var x=window,u="e494ffb82839a29122608e933394c091",a=[["siteId",'+sid+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],d=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==","d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz","d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM="],h=-1,w,t,f=function(){clearTimeout(t);h++;if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){w=x.document.createElement("script");w.type="text/javascript";w.async=!0;var n=x.document.getElementsByTagName("script")[0];w.src="https://"+atob(d[h]);w.crossOrigin="anonymous";w.onerror=f;w.onload=function(){clearTimeout(t);x[u.slice(0,16)+u.slice(0,16)]||f()};t=setTimeout(f,5E3);n.parentNode.insertBefore(w,n)}};if(!x[u]){try{Object.freeze(x[u]=a)}catch(e){}f()}})();';
      var s = document.createElement('script');
      s.textContent = w;
      (document.documentElement||document.head).appendChild(s);

      console.log('IBG_ADS: POP mounted ->', sid);
      return;
    }

    if (++tries < MAX_TRIES){
      setTimeout(waitEnv, 200);
    } else {
      // Silencioso: no ensuciar la consola si no hay variables aún
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitEnv);
  } else {
    waitEnv();
  }
})();
