(function(){
  var E=(window.__ENV||{});
  if(!E.POPADS_ENABLE){ console.log('[ads-popads] POPADS_ENABLE off'); return; }
  var SITE = E.POPADS_SITE_ID || E.POPADS_SITE;
  if(!SITE){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }
  if(window.__IBG_POPADS_MOUNTED) return; window.__IBG_POPADS_MOUNTED=true;

  // Evita bloquear la UI
  function inject(){
    // Integración oficial “rotatoria” que se auto-recupera si un host falla.
    // Solo cambiamos el siteId dinámico.
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.setAttribute('data-cfasync','false');
    s.text = [
      '(function(){var x=window,u="e494ffb82839a29122608e933394c091",',
      'a=[["siteId",'+ String(SITE) +'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],',
      'd=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz",',
      '"ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==",',
      '"d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz",',
      '"d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM="],',
      'h=-1,w,t,f=function(){clearTimeout(t);h++;if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){',
      'w=x.document.createElement("script");w.type="text/javascript";w.async=!0;',
      'var n=x.document.getElementsByTagName("script")[0];w.src="https://"+atob(d[h]);w.crossOrigin="anonymous";',
      'w.onerror=f;w.onload=function(){clearTimeout(t);x[u.slice(0,16)+u.slice(0,16)]||f()};t=setTimeout(f,5E3);',
      'n.parentNode.insertBefore(w,n)}};if(!x[u]){try{Object.freeze(x[u]=a)}catch(e){}f()}})();'
    ].join('');
    (document.head||document.documentElement).appendChild(s);
    console.log('IBG_ADS: POPADS injected ->', SITE);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();
