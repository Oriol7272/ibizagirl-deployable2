(function(){
  if(window.__IBG_EXO_BOTTOM_IFRAME_MOUNTED) return;
  window.__IBG_EXO_BOTTOM_IFRAME_MOUNTED = true;

  function pickZone(){
    var host = document.getElementById('ad-bottom');
    var dz = host && host.getAttribute('data-zone');
    var e  = window.__ENV||{};
    return dz || e.EXOCLICK_BOTTOM_ZONE || e.EXOCLICK_ZONE || null;
  }

  function mount(zone){
    var host = document.getElementById('ad-bottom');
    if(!host){ console.log('[exo-bottom-iframe] no #ad-bottom'); return; }

    // Limpia y crea iframe aislado
    host.innerHTML = '';
    var ifr = document.createElement('iframe');
    ifr.setAttribute('referrerpolicy','unsafe-url');
    ifr.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups');
    ifr.style.border = '0';
    ifr.style.width  = '100%';
    ifr.style.height = (window.innerWidth<=768?'60px':'90px'); // alto mínimo
    ifr.style.display = 'block';
    host.appendChild(ifr);

    var html = '<!doctype html><html><head><meta charset="utf-8">\
<style>html,body{margin:0;padding:0} ins{display:block;min-height:'+ (window.innerWidth<=768?'60px':'90px') +';width:100%}</style>\
<script async src="https://a.magsrv.com/ad-provider.js"><\/script>\
</head><body>\
<ins class="eas6a97888e17" data-zoneid="'+ String(zone) +'" data-block-ad-types="0"></ins>\
<script>(window.AdProvider=window.AdProvider||[]).push({serve:{}});<\/script>\
</body></html>';

    // Escribe el HTML dentro del iframe
    var doc = ifr.contentDocument || ifr.contentWindow.document;
    doc.open(); doc.write(html); doc.close();

    // Intento de ajuste de altura por si el creativo cambia
    var tries = 0;
    var timer = setInterval(function(){
      try{
        var h = doc.documentElement.scrollHeight || doc.body.scrollHeight || 0;
        if(h && Math.abs(ifr.clientHeight - h) > 10){
          ifr.style.height = h + 'px';
        }
      }catch(_){}
      if(++tries > 50) clearInterval(timer);  // ~10s
    }, 200);

    console.log('IBG_ADS: EXO bottom (iframe) mounted ->', zone);
  }

  function go(){
    var z = pickZone();
    if(!z){ console.log('[exo-bottom-iframe] sin zone -> abort'); return; }
    mount(z);
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else {
    go();
  }
})();
