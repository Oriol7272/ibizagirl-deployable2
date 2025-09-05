(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE;
  if(!Z){ console.log('[ads-exo-sides] no EXOCLICK_ZONE en __ENV'); return; }

  function loadProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true; s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mountOne(hostId){
    var host = document.getElementById(hostId);
    if(!host){ console.log('[ads-exo-sides] no host #'+hostId); return; }
    host.innerHTML = '';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minHeight = '600px';
    ins.style.width = '160px';
    host.appendChild(ins);
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
  }

  function go(){
    mountOne('ad-left');
    mountOne('ad-right');
    console.log('IBG_ADS: EXO/AP mounted ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProvider(go); });
  } else { loadProvider(go); }
})();
