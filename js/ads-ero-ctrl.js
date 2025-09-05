(function(){
  var E = (window.__ENV||{});
  if(E.EROADVERTISING_ENABLE === 0 || E.EROADVERTISING_ENABLE === '0'){ return; }
  var SPACE = E.EROADVERTISING_SPACE_ID || '8182057';
  var PID   = E.EROADVERTISING_PID      || '152716';
  var CTRL  = E.EROADVERTISING_CTRL     || '798544';

  // Montamos 1 iframe dentro de #ad-right si existe; si no, al final del body
  function mount(){
    var host = document.getElementById('ad-right') || document.body;
    var iframe = document.createElement('iframe');
    iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "unsafe-url";
    // Para evitar SecurityError de sessionStorage, no ponemos allow-same-origin
    iframe.setAttribute("sandbox","allow-scripts allow-popups");
    iframe.style.cssText = "border:0; width:300px; height:250px; display:block; margin:16px auto;";
    host.appendChild(iframe);
    console.log("[ads-ero-ctrl] mounted →", iframe.src);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
