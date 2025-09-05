(function(){
  if(window.__IBG_EXO_BOTTOM_IFRAME_MOUNTED) return;
  window.__IBG_EXO_BOTTOM_IFRAME_MOUNTED = true;

  // <- ajusta si cambian tus IDs de ERO fallback:
  var ERO_SPACE = '8182057', ERO_PID='152716', ERO_CTRL='798544';

  function pickZone(){
    var host = document.getElementById('ad-bottom');
    var dz = host && host.getAttribute('data-zone');
    var E  = window.__ENV||{};
    return dz || E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE || null;
  }

  function fallbackERO(host){
    host.innerHTML = '';
    var ifr = document.createElement('iframe');
    ifr.src = '/ads/eroframe_ctrl.html?space='+encodeURIComponent(ERO_SPACE)
            +'&pid='+encodeURIComponent(ERO_PID)
            +'&ctrl='+encodeURIComponent(ERO_CTRL);
    ifr.referrerPolicy = 'unsafe-url';
    ifr.sandbox = 'allow-scripts allow-popups';
    ifr.style.cssText = 'border:0;width:100%;height:'+ (window.innerWidth<=768?'60px':'90px') + 'px;display:block';
    host.appendChild(ifr);
    console.log('IBG_ADS: ERO bottom fallback mounted ->', ERO_SPACE);
  }

  function mountEXO(zone){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[exo-bottom-iframe] no #ad-bottom'); return; }

    host.innerHTML = '';
    var ifr = document.createElement('iframe');
    ifr.referrerPolicy='unsafe-url';
    // quitamos same-origin para evitar el warning del navegador
    ifr.sandbox='allow-scripts allow-popups';
    ifr.style.border='0';
    ifr.style.width='100%';
    ifr.style.height=(window.innerWidth<=768?'60px':'90px');
    ifr.style.display='block';
    host.appendChild(ifr);

    var html = '<!doctype html><html><head><meta charset="utf-8">\
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">\
<style>html,body{margin:0;padding:0} ins{display:block;min-height:'+ (window.innerWidth<=768?'60px':'90px') +';width:100%}</style>\
<link rel="preload" as="script" href="https://a.magsrv.com/ad-provider.js">\
<script async src="https://a.magsrv.com/ad-provider.js"><\/script>\
</head><body>\
<ins class="eas6a97888e17" data-zoneid="'+ String(zone) +'" data-block-ad-types="0"></ins>\
<script>(window.AdProvider=window.AdProvider||[]).push({serve:{}});<\/script>\
</body></html>';

    var doc = ifr.contentDocument || ifr.contentWindow.document;
    doc.open(); doc.write(html); doc.close();

    console.log('IBG_ADS: EXO bottom (iframe) mounted ->', zone);

    // Si en ~5s no hay nada visible, hacemos fallback a ERO
    setTimeout(function(){
      try{
        var h = doc.documentElement.scrollHeight || doc.body.scrollHeight || 0;
        var hasFrame = doc.querySelector('iframe');
        var hasImg   = doc.querySelector('img');
        if(!hasFrame && !hasImg && (!h || h < 40)){
          console.log('[exo-bottom-iframe] sin render tras 5s -> fallback ERO');
          fallbackERO(host);
        }
      }catch(_){
        // Si no podemos leer doc (por sandbox), asumimos fallo y hacemos fallback
        console.log('[exo-bottom-iframe] acceso doc fallido -> fallback ERO');
        fallbackERO(host);
      }
    }, 5000);
  }

  function go(){
    var z = pickZone();
    if(!z){ console.log('[exo-bottom-iframe] sin zone -> fallback ERO'); return fallbackERO(document.getElementById('ad-bottom')||document.body); }
    mountEXO(z);
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else {
    go();
  }
})();
