(function(){
  function exo(){
    var A=window.IBG_ADS||{}, exo=A.exoclick||{}, Z=exo.zones||[];
    var left=Z[0]||exo.zone, right=Z[1]||Z[0]||exo.zone;
    var STICKY_FALLBACK=5716852; // de tu captura (Sticky Banner 300x250)
    var under=exo.stickyZone||STICKY_FALLBACK||exo.zone;
    var bottom=exo.bottomZone||exo.zone;

    function ensure(cb){
      if(window.__EXO_LOADED__) return cb();
      var s=document.createElement('script'); s.src='https://a.exdynsrv.com/ad-provider.js'; s.async=true;
      s.onload=function(){window.__EXO_LOADED__=true; cb();}; document.head.appendChild(s);
    }
    function mount(id, zone){
      var host=document.getElementById(id); if(!host||!zone) return;
      host.innerHTML='';
      var ins=document.createElement('ins'); ins.className='adsbyexoclick'; ins.setAttribute('data-zoneid', String(zone));
      host.appendChild(ins); (window.AdProvider=window.AdProvider||[]).push({"serve":{}});
    }
    function relocateFloating(){
      try{
        var underBox=document.getElementById('ad-under-hero'); if(!underBox) return;
        var cand=[].slice.call(document.querySelectorAll('ins.adsbyexoclick,div[id*="exo"],div[class*="exo"]'));
        cand.forEach(function(n){
          var inSlot=n.closest('#ad-left,#ad-right,#ad-under-hero,#ad-bottom,#ad-bottom-2,#ad-bottom-ero,#ad-bottom-ero-2');
          if(!inSlot){
            var cs=getComputedStyle(n);
            if((cs.position==='fixed'||cs.position==='absolute') && cs.top==='0px' && cs.left==='0px'){
              underBox.innerHTML=''; underBox.appendChild(n); n.style.position='static';
            }
          }
        });
      }catch(_){}
    }

    ensure(function(){
      mount('ad-left',left);
      mount('ad-right',right);
      mount('ad-under-hero',under);
      mount('ad-bottom',bottom);
      mount('ad-bottom-2',right||left);
      setTimeout(relocateFloating,1200);
      setInterval(relocateFloating,4000);
    });
  }

  function ero(){
    var e=(window.IBG_ADS&&window.IBG_ADS.eroadvertising)||{};
    if(!e.zone||!e.space||!e.pid||!e.ctrl) return;
    function mount(id, spaceId){
      var host=document.getElementById(id); if(!host) return;
      host.innerHTML='';
      var s=document.createElement('script');
      s.src='https://go.ero-advertising.com/loadeactrl.go?pid='+encodeURIComponent(e.pid)+'&spaceid='+encodeURIComponent(spaceId||e.space)+'&ctrlid='+encodeURIComponent(e.ctrl);
      s.async=true; document.body.appendChild(s);
    }
    mount('ad-bottom-ero', e.space);     // 300x250 (8182057)
    mount('ad-bottom-ero-2', e.zone);    // 80x468 (8177575) como segunda caja
  }

  function pop(){
    var p=(window.IBG_ADS&&window.IBG_ADS.popads)||{};
    if(!p.enabled||!p.siteId||!p.siteHash) return;
    if(window.__POP_LOADED__) return; window.__POP_LOADED__=true;
    window._pop={popunder:false,siteId:parseInt(p.siteId,10),hash:p.siteHash};
    var s=document.createElement('script'); s.async=true; s.src='//c2.popads.net/pop.js'; document.head.appendChild(s);
  }

  function init(){ exo(); ero(); pop(); }
  document.readyState!=='loading'?init():document.addEventListener('DOMContentLoaded',init);
})();
