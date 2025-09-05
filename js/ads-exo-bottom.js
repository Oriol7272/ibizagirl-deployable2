(function(){
  // EXO sticky bottom mediante AdProvider (magsrv)
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE;
  if(!Z){ console.log('[ads-exo-bottom] no EXOCLICK_BOTTOM_ZONE en __ENV'); return; }

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
    // Limpia e inserta <ins> fresh
    host.innerHTML = '';
    var ins = document.createElement('ins');
    // Usa tu zoneid real en EXOCLICK_BOTTOM_ZONE (ej. 5716852)
    ins.className = 'eas_shim';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    host.appendChild(ins);
    // Sirve el anuncio
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);
  }

  // Espera al DOM
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProvider(mount); });
  } else {
    loadProvider(mount);
  }
})();
