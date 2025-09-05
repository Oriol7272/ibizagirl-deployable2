(function(){
  if(window.__IBG_EXO_BOTTOM_IFRAME_MOUNTED) return;
  window.__IBG_EXO_BOTTOM_IFRAME_MOUNTED = true;

  // Fallback ERO (ajusta si cambian)
  var ERO = {space:'8182057', pid:'152716', ctrl:'798544'};

  function log(){ if(window.__ENV && __ENV.DEBUG_ADS) try{ console.log.apply(console, arguments);}catch(_){} }

  function pickZone(){
    var host = document.getElementById('ad-bottom');
    var dz   = host && host.getAttribute('data-zone');
    var E    = window.__ENV||{};
    return dz || E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE || null;
  }

  function fallbackERO(host){
    if(!host) return;
    host.innerHTML = '';
    var ifr = document.createElement('iframe');
    ifr.src = '/ads/eroframe_ctrl.html?space='+encodeURIComponent(ERO.space)
             +'&pid='+encodeURIComponent(ERO.pid)
             +'&ctrl='+encodeURIComponent(ERO.ctrl);
    ifr.referrerPolicy = 'unsafe-url';
    ifr.sandbox = 'allow-scripts allow-popups';
    ifr.style.cssText = 'border:0;width:100%;height:'+(window.innerWidth<=768?'60px':'90px')+'px;display:block';
    host.appendChild(ifr);
    log('IBG_ADS: ERO bottom fallback mounted ->', ERO.space);
  }

  function mountEXO(zone){
    var host = document.getElementById('ad-bottom');
    if(!host){ log('[exo-bottom] no #ad-bottom'); return; }

    host.innerHTML = '';
    var ifr = document.createElement('iframe');
    ifr.referrerPolicy='unsafe-url';
    // sin allow-same-origin para evitar cualquier acceso cross-origin
    ifr.sandbox='allow-scripts allow-popups';
    ifr.style.border='0';
    ifr.style.width='100%';
    ifr.style.height=(window.innerWidth<=768?'60px':'90px');
    ifr.style.display='block';
    host.appendChild(ifr);

    var html = '<!doctype html><html><head><meta charset="utf-8">\
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">\
<style>html,body{margin:0;padding:0} ins{display:block;min-height:'+(window.innerWidth<=768?'60px':'90px')+';width:100%}</style>\
<script>('+function(){
  // Avisamos al parent cuando aparezca contenido publicitario
  var ok=false;
  try{
    var mo=new MutationObserver(function(m){
      for(var i=0;i<m.length;i++){
        var a=m[i].addedNodes||[];
        for(var j=0;j<a.length;j++){
          var n=a[j];
          if(n && ( (n.tagName && (n.tagName.toLowerCase()==='iframe' || n.tagName.toLowerCase()==='img'))
                    || (n.querySelector && n.querySelector('iframe,img')) )){
            ok=true;
            try{ parent.postMessage({type:"IBG_EXO_OK"}, "*"); }catch(e){}
            try{ mo.disconnect(); }catch(e){}
            return;
          }
        }
      }
    });
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(function(){ if(!ok){ try{ parent.postMessage({type:"IBG_EXO_NOAD"}, "*"); }catch(e){} }, 3500);
  }catch(e){}
}.toString()+')();<\/script>\
<script async src="https://a.magsrv.com/ad-provider.js"><\/script>\
</head><body>\
<ins class="eas6a97888e17" data-zoneid="'+ String(zone) +'" data-block-ad-types="0"></ins>\
<script>(window.AdProvider=window.AdProvider||[]).push({serve:{}});<\/script>\
</body></html>';

    // Escribimos contenido con srcdoc (no tocamos .document para evitar SecurityError)
    ifr.srcdoc = html;

    // Escuchamos confirmación desde el iframe
    var confirmed=false, timed=false;
    function onMsg(ev){
      var d = ev && ev.data;
      if(d && d.type==='IBG_EXO_OK'){ confirmed=true; window.removeEventListener('message', onMsg); }
      if(d && d.type==='IBG_EXO_NOAD' && !confirmed && !timed){
        timed=true; fallbackERO(host);
      }
    }
    window.addEventListener('message', onMsg);

    // Salvaguarda: si en 5s nadie confirmó, hacemos fallback
    setTimeout(function(){
      if(!confirmed && !timed){ timed=true; fallbackERO(host); }
    }, 5000);

    log('IBG_ADS: EXO bottom (iframe) mounted ->', zone);
  }

  function go(){
    var z = pickZone();
    if(!z){ log('[exo-bottom] sin zone -> fallback ERO'); return fallbackERO(document.getElementById('ad-bottom')); }
    mountEXO(z);
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', go); }
  else { go(); }
})();
