(function(){
  try {
    console.log("[force-grid-v2] activo");

    function mkContainer(){
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
        h.textContent = "Vista rápida (emergencia)";
        h.style.gridColumn = "1 / -1";
        h.style.fontFamily = "system-ui, sans-serif";
        h.style.fontSize = "18px";
        h.style.margin = "0 0 10px 0";
        root.appendChild(h);
        document.body.appendChild(root);
      }
      return root;
    }

    function looksLikePath(x){
      return typeof x === "string" && (x.indexOf("/full/")>=0 || x.indexOf("/uncensored/")>=0);
    }

    function collectFromValue(val, bucket, seen, depth){
      if (!val || depth>2) return;
      if (Array.isArray(val)) {
        if (val.length >= 10) {
          for (var i=0;i<val.length;i++){
            var it = val[i];
            if (typeof it === "string") {
              if (looksLikePath(it) && !seen.has(it)) { seen.add(it); bucket.push(it); }
            } else if (it && typeof it === "object") {
              var cands = ["src","url","path","href","thumbnail","thumb"];
              for (var k=0;k<cands.length;k++){
                var key = cands[k];
                if (typeof it[key] === "string" && looksLikePath(it[key])) {
                  var p = it[key];
                  if(!seen.has(p)){ seen.add(p); bucket.push(p); }
                }
              }
            }
          }
        }
      } else if (typeof val === "object") {
        // Explora solo objetos con muchas claves (posibles APIs unificadas)
        var keys = Object.keys(val);
        if (keys.length >= 3) {
          for (var j=0;j<keys.length;j++){
            var k = keys[j];
            try { collectFromValue(val[k], bucket, seen, depth+1); } catch(e){}
          }
        }
      }
    }

    function collectPathsDeep(){
      var paths = [];
      var seen  = new Set();

      // 1) Objetos globales grandes (incluye UnifiedContentAPI si existe)
      var names = Object.getOwnPropertyNames(window);
      for (var i=0;i<names.length;i++){
        var name = names[i];
        // saltar cosas obvias del navegador
        if (/^on|webkit|moz|ms|chrome/i.test(name)) continue;
        try { collectFromValue(window[name], paths, seen, 0); } catch(e){}
      }
      return paths;
    }

    function render(paths){
      var root = mkContainer();
      // limpiar miniaturas previas manteniendo el <h2>
      var keep = root.firstChild;
      root.innerHTML = "";
      if (keep) root.appendChild(keep);

      var count = 0;
      paths.slice(0, 240).forEach(function(src){
        var a = document.createElement("a");
        a.href = src; a.target="_blank"; a.rel="noopener";
        a.style.display="block";
        var img = document.createElement("img");
        img.loading="lazy"; img.decoding="async";
        img.src = src; img.alt = "thumb";
        img.style.width="100%"; img.style.height="auto";
        img.style.borderRadius="8px";
        img.style.boxShadow="0 1px 4px rgba(0,0,0,.15)";
        a.appendChild(img);
        root.appendChild(a);
        count++;
      });
      console.log("[force-grid-v2] pintadas", count, "miniaturas");
    }

    function attempt(){
      var list = collectPathsDeep();
      console.log("[force-grid-v2] detectadas rutas:", list.length);
      if (list.length > 0) render(list);
    }

    attempt();
    var tries = 0;
    var t = setInterval(function(){
      tries++;
      attempt();
      if (tries > 6) clearInterval(t);
    }, 600);
  } catch(e){
    console.error("[force-grid-v2] error", e);
  }
})();
