(function(){
  try {
    console.log("[force-grid] activo");
    // Crea contenedor si no existe
    var root = document.getElementById("ibg-force-grid");
    if (!root) {
      root = document.createElement("section");
      root.id = "ibg-force-grid";
      root.style.margin = "20px auto";
      root.style.maxWidth = "1200px";
      root.style.display = "grid";
      root.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";
      root.style.gap = "10px";
      var h = document.createElement("h2");
      h.textContent = "Vista rápida";
      h.style.gridColumn = "1 / -1";
      h.style.fontFamily = "system-ui, sans-serif";
      h.style.fontSize = "18px";
      h.style.margin = "0 0 10px 0";
      root.appendChild(h);
      document.body.appendChild(root);
    }

    // Heurística: recopilar rutas de imágenes ya cargadas en globals
    function collectPaths(){
      var paths = [];
      var seen = new Set();
      // Recorre todas las props globales y arrays grandes con strings de rutas
      for (var k in window){
        try {
          var v = window[k];
          if (Array.isArray(v) && v.length >= 20) {
            for (var i=0;i<v.length;i++){
              var s = v[i];
              if (typeof s === "string" && (s.indexOf("/full/")>=0 || s.indexOf("/uncensored/")>=0)) {
                if(!seen.has(s)){ seen.add(s); paths.push(s); }
              }
            }
          }
        } catch(e){}
      }
      return paths;
    }

    function renderThumbs(list){
      root.innerHTML = root.innerHTML; // mantiene el h2
      var added = 0;
      list.slice(0, 200).forEach(function(src){
        var a = document.createElement("a");
        a.href = src; a.target="_blank"; a.rel="noopener";
        a.style.display="block";
        var img = document.createElement("img");
        img.loading="lazy";
        img.decoding="async";
        img.src = src;
        img.alt = "thumb";
        img.style.width="100%";
        img.style.height="auto";
        img.style.borderRadius="8px";
        img.style.boxShadow="0 1px 4px rgba(0,0,0,.15)";
        a.appendChild(img);
        root.appendChild(a);
        added++;
      });
      console.log("[force-grid] pintadas", added, "miniaturas");
    }

    function tryRender(){
      var paths = collectPaths();
      console.log("[force-grid] detectadas rutas:", paths.length);
      if (paths.length > 0) {
        renderThumbs(paths);
      }
    }

    // Intenta varias veces por si los content-data llegan asíncronos
    tryRender();
    var tries = 0;
    var t = setInterval(function(){
      tries++;
      tryRender();
      if (tries > 5) clearInterval(t);
    }, 500);
  } catch(e){
    console.error("[force-grid] error", e);
  }
})();
