(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE;
  if(!Z){ console.log('[exo-sides] sin EXOCLICK_ZONE'); return; }

  function serve(containerId){
    var host = document.getElementById(containerId);
    if(!host){ console.log('[exo-sides] no', containerId); return; }
    host.innerHTML = '';

    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minWidth = '300px';
    ins.style.minHeight = '250px';
    host.appendChild(ins);

    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO/AP mounted (pure) ->', Z, 'on', containerId);
  }

  function go(){ serve('ad-left'); serve('ad-right'); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else {
    go();
  }
})();
