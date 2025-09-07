(function(){
  function exoRender(){
    var A=window.IBG_ADS||{}, exo=A.exoclick||{};
    var zones = exo.zones||[];
    var left = zones[0]||exo.zone, right = zones[1]||zones[0]||exo.zone;
    var underHero = exo.zone;           // usaremos el zone general aquí
    var bottom = exo.bottomZone||exo.zone;

    function ensureLib(cb){
      if(window.__EXO_LOADED__) return cb();
      var s=document.createElement('script');
      s.src='https://a.exdynsrv.com/ad-provider.js';
      s.async=true;
      s.onload=function(){ window.__EXO_LOADED__=true; cb(); };
      document.head.appendChild(s);
    }
    function mount(id, zone){
      var host=document.getElementById(id); if(!host||!zone) return;
      host.innerHTML='';
      var ins=document.createElement('ins');
      ins.className='adsbyexoclick';
      ins.setAttribute('data-zoneid', String(zone));
      host.appendChild(ins);
      (window.AdProvider = window.AdProvider || []).push({"serve": {}});
    }
    ensureLib(function(){
      mount('ad-left', left);
      mount('ad-right', right);
      mount('ad-under-hero', underHero);
      mount('ad-bottom', bottom);
    });
  }

  function eroRender(){
    try{
      var e=(window.IBG_ADS&&window.IBG_ADS.eroadvertising)||{};
      if(!e.zone||!e.space||!e.pid||!e.ctrl) return;
      var host=document.getElementById('ad-bottom-ero'); if(!host) return;
      // snippet estándar
      host.innerHTML='';
      var s=document.createElement('script');
      s.src='https://go.ero-advertising.com/loadeactrl.go?pid='+encodeURIComponent(e.pid)+'&spaceid='+encodeURIComponent(e.space)+'&ctrlid='+encodeURIComponent(e.ctrl);
      s.async=true;
      document.body.appendChild(s);
    }catch(_){}
  }

  function popadsRender(){
    try{
      var p=(window.IBG_ADS&&window.IBG_ADS.popads)||{};
      if(!p.enabled||!p.siteId||!p.siteHash) return;
      if(window.__POPADS_LOADED__) return;
      window.__POPADS_LOADED__=true;
      window._pop={popunder:false,siteId:p.siteId,hash:p.siteHash};
      var s=document.createElement('script');
      s.async=true;
      s.src='//c2.popads.net/pop.js';
      document.head.appendChild(s);
    }catch(_){}
  }

  function init(){
    exoRender();
    eroRender();
    popadsRender();
  }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
