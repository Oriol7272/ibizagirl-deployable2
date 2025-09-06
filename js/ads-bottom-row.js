(function(){
  var E = window.__ENV || {};
  var exoList = ((E.EXOCLICK_ZONES || E.EXOCLICK_ZONE || '')+'').split(/\s*,\s*/).filter(Boolean);
  var hasEro = !!(E.ERODVERTISING_SPACE && E.ERODVERTISING_PID && E.ERODVERTISING_CTRL);

  function pickExo(){ return exoList[(Math.random()*exoList.length)|0]; }

  function loadAdProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true; s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mountExo(boxId){
    if(!exoList.length){ console.log('[ads-bottom] no EXOCLICK_ZONES/ZONE'); return; }
    var host=document.getElementById(boxId); if(!host) return;
    host.innerHTML='';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(pickExo()));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block'; ins.style.width='300px'; ins.style.height='250px';
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO bottom content ->', ins.getAttribute('data-zoneid'), 'on', boxId);
  }

  function mountEro(boxId){
    if(!hasEro){ console.log('[ads-bottom] no ERO vars'); return; }
    var host=document.getElementById(boxId); if(!host) return;
    host.innerHTML='';
    var iframe=document.createElement('iframe');
    var u='/ads/eroframe_ctrl.html'
      + '?space='+encodeURIComponent(E.ERODVERTISING_SPACE)
      + '&pid='+encodeURIComponent(E.ERODVERTISING_PID)
      + '&ctrl='+encodeURIComponent(E.ERODVERTISING_CTRL);
    iframe.src=u;
    iframe.loading='lazy';
    iframe.referrerPolicy='unsafe-url';
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups');
    iframe.style.cssText='border:0;width:300px;height:250px;display:block;';
    host.appendChild(iframe);
    console.log('[ads-bottom] ERO bottom content ->', u, 'on', boxId);
  }

  function hideIfEmpty(boxId, ms){
    setTimeout(function(){
      var el=document.getElementById(boxId);
      if(!el) return;
      var hasFrame=!!el.querySelector('iframe');
      if(!hasFrame){ el.style.display='none'; console.log('[ads-bottom] oculto', boxId, '(sin creativo)'); }
    }, ms||6000);
  }

  function start(){
    // Asignación aleatoria: una caja EXO, la otra ERO (si hay ERO).
    var order = Math.random()<0.5 ? ['exo','ero'] : ['ero','exo'];
    if(!hasEro) order=['exo','exo'];
    var ids=['ad-bottom-1','ad-bottom-2'];

    loadAdProvider(function(){
      order.forEach(function(kind, i){
        if(kind==='exo') mountExo(ids[i]); else mountEro(ids[i]);
        hideIfEmpty(ids[i], 6000);
      });
    });
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); }
  else { start(); }
})();
