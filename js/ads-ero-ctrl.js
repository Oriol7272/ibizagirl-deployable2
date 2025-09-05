(function(){
  var E = (window.__ENV||{});
  if(String(E.EROADVERTISING_ENABLE||'1')==='0'){ return; }

  var SPACE = E.ERO_CONTROL_SPACE || '8182057';
  var PID   = E.ERO_CONTROL_PID   || '152716';
  var CTRL  = E.ERO_CONTROL_ID    || '798544';

  function mount(){
    var host = document.getElementById('ad-ero');
    if(!host){ 
      // si no existe, lo colgamos bajo #ad-right por defecto
      host = document.getElementById('ad-right') || document.body;
    }
    var iframe = document.createElement('iframe');
    iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "unsafe-url";
    iframe.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups");
    iframe.style.cssText = "border:0; width:300px; height:250px; display:block; margin:16px auto;";
    host.appendChild(iframe);
    console.log("[ads-ero-ctrl] mounted →", iframe.src);
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', mount); }
  else { mount(); }
})();
