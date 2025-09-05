(function(){
  if(window.__IBG_EXO_BOTTOM_MOUNTED){return;}
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function getZone(){
    var host = document.getElementById('ad-bottom');
    var z = (window.__ENV && (window.__ENV.EXOCLICK_BOTTOM_ZONE || window.__ENV.EXOCLICK_ZONE)) || null;
    if(!z && host){ z = host.getAttribute('data-zone'); }
    return z;
  }

  function loadProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function mountWith(zone){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[ads-exo-bottom] no #ad-bottom'); return; }
    host.innerHTML = '';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    ins.style.minHeight = (window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);

    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', zone);

    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
        (window.AdProvider = window.AdProvider || []).push({serve:{}});
      }
    }, 4000);
  }

  // Espera breve a que __ENV llegue; si no, usa data-zone
  var t0 = Date.now();
  (function waitZone(){
    var z = getZone();
    if(!z && Date.now()-t0 < 2000){ return setTimeout(waitZone, 100); }
    if(!z){ console.log('[ads-exo-bottom] usando fallback data-zone/const'); z = getZone(); }
    if(!z){ console.log('[ads-exo-bottom] sin zone -> abort'); return; }
    console.log('[ads-exo-bottom] zone chosen ->', z);
    loadProvider(function(){ mountWith(z); });
  })();
})();
