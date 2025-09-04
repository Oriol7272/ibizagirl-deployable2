(function(W){
  function load(src){
    try{
      var s=document.createElement('script'); s.src=src; s.async=true; s.referrerPolicy='no-referrer-when-downgrade'; s.crossOrigin='anonymous';
      // silenciar errores de red en consola
      s.onerror=function(){ /* silencio */ };
      document.head.appendChild(s);
    }catch(_){}
  }
  function truthy(x){ return String(x||'').toLowerCase()==='1' || String(x||'').toLowerCase()==='true'; }
  function initAds(){
    var E=W.__ENV||{};
    // PopAds: SOLO si está explicitamente activado Y con SITE_ID. Si no, no cargamos nada.
    if(truthy(E.POPADS_ENABLE) && E.POPADS_SITE_ID){
      load('https://cdn.popads.net/pop.js');
    }
    // Exoclick / JuicyAds / EroAdvertising -> respeta si pones sus snippets/zone IDs
    // (de momento no cargamos nada más para evitar ruido; añade tus tags cuando quieras)
  }
  W.IBG_ADS={initAds};
})(window);
