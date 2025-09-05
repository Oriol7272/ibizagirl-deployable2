(function(){
  var E = window.__ENV || {};
  // bandera global (0 = off)
  if (E.EROADVERTISING_ENABLE === "0") { return; }
  // no cargar en Home
  var p = location.pathname.replace(/\/+$/,'');
  if (p === '' || p === '/' || p === '/index' || p === '/index.html') { return; }

  var SPACE = E.EROADVERTISING_SPACEID || E.EROADVERTISING_ZONE || "8182057";
  var PID   = E.EROADVERTISING_PID     || "152716";
  var CTRL  = E.EROADVERTISING_CTRLID  || "798544";

  var host = document.getElementById('ad-right') || document.body;
  var iframe = document.createElement('iframe');
  iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
  iframe.loading = "lazy";
  iframe.referrerPolicy = "unsafe-url";
  // sandbox sin same-origin para evitar warnings/errores
  iframe.setAttribute("sandbox","allow-scripts allow-popups");
  iframe.style.cssText = "border:0;width:300px;height:250px;display:block;margin:16px auto;";
  host.appendChild(iframe);
})();
