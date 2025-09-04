(function(W){
  function truthy(x){ x=String(x||'').toLowerCase(); return x==='1'||x==='true'||x==='yes'; }
  function load(src){ try{ var s=document.createElement('script'); s.src=src; s.async=true; s.onerror=function(){}; document.head.appendChild(s);}catch(_){ } }
  function initAds(){
    var E=W.__ENV||{};
    if(truthy(E.POPADS_ENABLE) && E.POPADS_SITE_ID){ load('https://cdn.popads.net/pop.js'); }
    // Aquí puedes añadir ExoClick/JuicyAds/EroAdvertising si has puesto sus zonas/snippets reales en __ENV
  }
  W.IBG_ADS={initAds};
})(window);
