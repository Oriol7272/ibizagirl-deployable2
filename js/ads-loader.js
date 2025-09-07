(function(){
  function loadExo(){
    try{
      var A = window.IBG_ADS || {}, exo = (A.exoclick||{});
      var zones = exo.zones || [];
      var left = zones[0], right = zones[1] || zones[0], bottom = exo.bottomZone || exo.zone;
      if(!left && !right && !bottom){ console.info("[ads] No exoclick zones"); return; }

      // Cargar provider una sola vez
      if(!window.__EXO_LOADED__){
        var s=document.createElement('script');
        s.src='https://a.exdynsrv.com/ad-provider.js';
        s.async=true;
        s.onload=function(){ window.__EXO_LOADED__=true; render(); };
        document.head.appendChild(s);
      }else{
        render();
      }

      function render(){
        if(left) mountExo('ad-left', left);
        if(right) mountExo('ad-right', right);
        if(bottom) mountExo('ad-bottom', bottom);
      }
      function mountExo(id, zone){
        var host=document.getElementById(id);
        if(!host) return;
        host.innerHTML='';
        var ins=document.createElement('ins');
        ins.className='adsbyexoclick';
        ins.setAttribute('data-zoneid', String(zone));
        host.appendChild(ins);
        (window.AdProvider = window.AdProvider || []).push({"serve": {}}); // API habitual de ExoClick
      }
    }catch(e){ console.warn("[ads] exo error", e); }
  }

  function init(){
    loadExo();
    // hooks para otros: juicy/ero/popads (activaremos luego)
  }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
