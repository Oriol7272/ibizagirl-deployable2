(function(){
  if (window.__EXO_PROVIDER_LOADING) return;
  window.__EXO_PROVIDER_LOADING = true;
  var s = document.createElement('script');
  s.src = 'https://a.magsrv.com/ad-provider.js';
  s.async = true;
  s.onload = function(){ console.log('[exo-common] ad-provider listo'); };
  (document.head||document.documentElement).appendChild(s);
})();
