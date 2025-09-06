/* ads-exo-bottom.js - Exo sticky bottom (3ª posición)
   Requiere: window.__ENV.EXOCLICK_BOTTOM_ZONE (p.ej. 5717078) y https://a.magsrv.com/ad-provider.js
   Comportamiento:
   - Si hay zone -> monta <ins> y lanza AdProvider.
   - Si en ~4s no aparece iframe de la creativa -> oculta el contenedor (nada de "pill" gris).
*/
(function(){
  try{
    var Z = (window.__ENV && window.__ENV.EXOCLICK_BOTTOM_ZONE) ? String(window.__ENV.EXOCLICK_BOTTOM_ZONE).trim() : "";
    var host = document.getElementById("ad-bottom") || (function(){
      // crea contenedor si no existe
      var h = document.createElement("div");
      h.id = "ad-bottom";
      h.style.cssText = "width:100%;max-width:1200px;margin:16px auto 0 auto;padding:0;";
      // intenta insertarlo debajo del header si existe, si no al principio del body
      var hdr = document.querySelector("header") || document.body.firstElementChild;
      (hdr && hdr.parentNode ? hdr.parentNode.insertBefore(h, hdr.nextSibling) : document.body.insertBefore(h, document.body.firstChild));
      return h;
    })();

    // Limpieza de cualquier relleno/house anterior
    host.innerHTML = "";
    host.style.display = "block";
    host.style.minHeight = "0"; // sin pill

    if(!Z){
      console.log("[exo-bottom] missing EXOCLICK_BOTTOM_ZONE");
      host.style.display = "none";
      return;
    }

    // Carga provider si no está
    if(!document.querySelector('script[src*="a.magsrv.com/ad-provider.js"]')){
      var p = document.createElement("script");
      p.async = true;
      p.src = "https://a.magsrv.com/ad-provider.js";
      document.head.appendChild(p);
    }

    // Nodo del anuncio
    var ins = document.createElement("ins");
    ins.className = "eas6a97888e17";
    ins.setAttribute("data-zoneid", Z);
    ins.setAttribute("data-block-ad-types", "0");
    host.appendChild(ins);

    // Solicitud
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log("IBG_ADS: EXO bottom mounted ->", Z);

    // Supervisa si hubo fill real; si no, oculta
    var t0 = Date.now();
    var tries = 0, maxTries = 40; // ~4s @100ms
    var iv = setInterval(function(){
      tries++;
      var iframe = host.querySelector("iframe");
      if (iframe && iframe.width && iframe.height) {
        clearInterval(iv);
      } else if (tries >= maxTries) {
        clearInterval(iv);
        console.log("[exo-bottom] no fill → hide (", (Date.now()-t0), "ms )");
        host.style.display = "none";
      }
    }, 100);

  }catch(e){
    console.error("[exo-bottom] error:", e);
    var h = document.getElementById("ad-bottom");
    if (h) h.style.display = "none";
  }
})();
