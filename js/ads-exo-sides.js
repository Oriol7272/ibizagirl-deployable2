(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE;            // usa tu zona de DISPLAY si tienes; si es sticky, quedará contenido en el iframe
  if(!Z) return;
  if(window.__IBG_EXO_SIDES_MOUNTED) return;
  window.__IBG_EXO_SIDES_MOUNTED = true;

  function makeFrame(hostId){
    var host = document.getElementById(hostId);
    if(!host) return;
    host.innerHTML='';
    var html = '<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="unsafe-url"></head>'
             + '<body style="margin:0;padding:0;overflow:hidden">'
             + '<ins class="eas6a97888e17" data-zoneid="'+String(Z)+'" data-block-ad-types="0" style="display:block;width:300px;min-height:250px"></ins>'
             + '<script async src="https://a.magsrv.com/ad-provider.js"><\/script>'
             + '<script>(AdProvider=window.AdProvider||[]).push({serve:{}});<\/script>'
             + '</body></html>';
    var f = document.createElement('iframe');
    f.className = 'adframe';
    f.sandbox = 'allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation';
    f.referrerPolicy = 'unsafe-url';
    f.loading = 'lazy';
    // srcdoc confina el sticky al interior del iframe, no a la página
    f.srcdoc = html;
    host.appendChild(f);
  }

  function mount(){
    makeFrame('ad-left');
    makeFrame('ad-right');
    console.log('IBG_ADS: EXO/AP mounted (iframes) ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
