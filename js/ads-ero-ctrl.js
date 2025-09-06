(function(){
  var E = (window.__ENV||{});
  if(String(E.EROADVERTISING_ENABLE||'0')!=='1'){ console.log('[ads-ero-ctrl] ERO desactivado'); return; }

  var SPACE = E.ERO_SPACE_ID, PID = E.ERO_PID, CTRL = E.ERO_CTRL_ID;
  if(!SPACE||!PID||!CTRL){ console.log('[ads-ero-ctrl] falta config ERO'); return; }

  var host = document.getElementById('ad-ero');
  if(!host){ console.log('[ads-ero-ctrl] no #ad-ero, skip'); return; }

  var iframe = document.createElement('iframe');
  iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)
             + "&pid="+encodeURIComponent(PID)
             + "&ctrl="+encodeURIComponent(CTRL);
  iframe.loading = "lazy";
  iframe.referrerPolicy = "unsafe-url";
  iframe.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups");
  iframe.style.cssText = "border:0; width:300px; height:250px; display:block; margin:16px auto;";
  host.appendChild(iframe);
  console.log("[ads-ero-ctrl] mounted →", iframe.src);
})();
