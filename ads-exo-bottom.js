/* ads-exo-bottom.js  —  Sticky Exo (3ª posición)
   Usa: window.__ENV.EXOCLICK_BOTTOM_ZONE (si no, cae a __ENV.EXOCLICK_ZONE).
   Si no hay fill real en ~4s, elimina el host (nada de "pill" gris).
*/
(function(){
  try{
    var E = window.__ENV || {};
    var Z = (E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE || "").toString().trim();
    if(!Z){ console.log("[exo-bottom] no zone (need EXOCLICK_BOTTOM_ZONE or EXOCLICK_ZONE)"); return; }

    // Carga provider si no está
    if(!document.querySelector('script[src*="a.magsrv.com/ad-provider.js"]')){
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://a.magsrv.com/ad-provider.js";
      document.head.appendChild(s);
    }

    // Contenedor mínimo y sin estilos visibles
    var host = document.getElementById("exo-bottom");
    if(!host){
      host = document.createElement("div");
      host.id = "exo-bottom";
      host.style.cssText = "width:0;height:0;overflow:visible";
      document.body.appendChild(host);
    } else {
      host.innerHTML = "";
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

    // Si no hay iframe tras ~4s, elimina host
    var tries = 0, max = 40;
    var t = setInterval(function(){
      tries++;
      var ifr = host.querySelector("iframe");
      if (ifr) { clearInterval(t); }
      else if (tries >= max) {
        clearInterval(t);
        host.remove();
        console.log("[exo-bottom] no fill -> removed");
      }
    }, 100);
  }catch(e){
    console.error("[exo-bottom] error:", e);
  }
})();
