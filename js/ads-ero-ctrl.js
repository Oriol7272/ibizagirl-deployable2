(function(){
  if(window.__IBG_ERO_MOUNTED) return;
  window.__IBG_ERO_MOUNTED = true;

  var E = (window.__ENV||{});
  if(E.EROADVERTISING_ENABLE===0 || E.EROADVERTISING_ENABLE==='0') return;

  var SPACE = E.EROADVERTISING_SPACE_ID || '8182057';
  var PID   = E.EROADVERTISING_PID      || '152716';
  var CTRL  = E.EROADVERTISING_CTRL     || '798544';

  function mount(){
    var host = document.getElementById('ad-ero') || document.body;
    host.innerHTML='';
    var iframe = document.createElement('iframe');
    iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "unsafe-url";
    iframe.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups");
    iframe.className = "adframe";
    host.appendChild(iframe);
    console.log("[ads-ero-ctrl] mounted →", iframe.src);
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', mount); }
  else { mount(); }
})();
