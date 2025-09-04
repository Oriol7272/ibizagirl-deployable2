(function(W){
  function load(src){ var s=document.createElement('script'); s.src=src; s.async=true; s.referrerPolicy='no-referrer-when-downgrade'; s.crossOrigin='anonymous'; s.onerror=function(){console.warn('ads load error', src)}; document.head.appendChild(s); }
  function initAds(){
    var E=W.__ENV||{};
    // PopAds (solo si está explícitamente activado)
    if(String(E.POPADS_ENABLE).toLowerCase()==='1' || String(E.POPADS_ENABLE).toLowerCase()==='true'){
      if(E.POPADS_SITE_ID){ load('https://cdn.popads.net/pop.js'); }
    }
    // ExoClick / JuicyAds / EroAdvertising: respeta tus zones/snippets si existen
    if(E.EXOCLICK_ZONE){ /* load el tag si lo proves */ }
    if(E.JUICYADS_ZONE || E.JUICYADS_SNIPPET_B64){ /* idem */ }
    if(E.EROADVERTISING_ZONE || E.EROADVERTISING_SNIPPET_B64){ /* idem */ }
  }
  W.IBG_ADS={initAds};
})(window);
