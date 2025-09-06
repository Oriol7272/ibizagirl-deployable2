(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE;
  if(!Z){ console.log('[exo-bottom] missing EXOCLICK_BOTTOM_ZONE'); return; }

  function mount(){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[exo-bottom] no #ad-bottom'); return; }
    host.innerHTML = '';
    // INS de Exo
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minHeight = (window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);
    // Sirve
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', Z);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
