(function(){
  var E = (window.__ENV||{});
  // Usa variable de entorno si existe; si no, fija 5717070 (tu nuevo zone)
  var Z = E.EXOCLICK_BOTTOM_ZONE || '5717070';
  if(window.__IBG_EXO_BOTTOM_MOUNTED){ return; }
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function loadProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[ads-exo-bottom] no #ad-bottom'); return; }
    host.innerHTML = '';
    var ins = document.createElement('ins');
    // clase habitual de Exo; ayuda a que el provider reconozca el placement
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    // opcionales (si algún día los quieres vía __ENV)
    if(E.EXOCLICK_BOTTOM_KEYWORDS) ins.setAttribute('data-keywords', E.EXOCLICK_BOTTOM_KEYWORDS);
    if(E.EXOCLICK_BOTTOM_SUB)      ins.setAttribute('data-sub', E.EXOCLICK_BOTTOM_SUB);

    ins.style.display = 'block';
    ins.style.minHeight = (window.innerWidth<=768?'60px':'90px');
    ins.style.width = 'min(100%,980px)';
    host.appendChild(ins);

    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);

    // Reintento si no aparece el iframe
    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] no iframe tras 4s, reintento');
        (window.AdProvider = window.AdProvider || []).push({serve:{}});
      }
    }, 4000);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProvider(mount); });
  } else {
    loadProvider(mount);
  }
})();
