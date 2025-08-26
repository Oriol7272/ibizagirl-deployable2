(function(){
  try {
    console.log("[fallback-render] activo");

    function ensureContainer(){
      var root = document.getElementById("ibg-fallback-grid");
      if (!root) {
        root = document.createElement("section");
        root.id = "ibg-fallback-grid";
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
      return root;
    }

    function isPath(s){
      return typeof s === "string" && (s.indexOf("/full/")>=0 || s.indexOf("/uncensored/")>=0);
    }

    function collectFrom(val, out, seen, depth){
      if (!val || depth>3) return;
      if (Array.isArray(val)) {
        if (val.length >= 5) {
          for (var i=0;i<val.length;i++){
            var it = val[i];
            if (typeof it === "string") {
              if (isPath(it) && !seen.has(it)) { seen.add(it); out.push(it); }
            } else if (it && typeof it === "object") {
              ["src","url","path","href","thumbnail","thumb"].forEach(function(k){
                var v = it[k];
                if (typeof v === "string" && isPath(v) && !seen.has(v)) { seen.add(v); out.push(v); }
              });
            }
          }
        }
      } else if (typeof val === "object") {
        var keys;
        try { keys = Object.keys(val); } catch(e){ keys = []; }
        if (keys.length === 0) return;
        for (var j=0;j<keys.length;j++){
          var k = keys[j];
          if (/^on|webkit|moz|ms|chrome|crypto|performance|document|location|navigator|history$/i.test(k)) continue;
          try { collectFrom(val[k], out, seen, depth+1); } catch(e){}
        }
      }
    }

    function collectPaths(){
      var out = [], seen = new Set();

      // 1) UnifiedContentAPI si existe
      if (window.UnifiedContentAPI) {
        try { collectFrom(window.UnifiedContentAPI, out, seen, 0); } catch(e){}
      }
      // 2) Globals
      var names = [];
      try { names = Object.getOwnPropertyNames(window); } catch(e){}
      for (var i=0;i<names.length;i++){
        var n = names[i];
        if (/^on|webkit|moz|ms|chrome|crypto|performance|document|location|navigator|history$/i.test(n)) continue;
        try { collectFrom(window[n], out, seen, 0); } catch(e){}
        if (out.length >= 300) break;
      }
      return out;
    }

    function render(paths){
      var root = ensureContainer();
      // mantiene el h2
      var title = root.firstChild;
      root.innerHTML = "";
      if (title) root.appendChild(title);

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
      console.log("[fallback-render] pintadas", count, "miniaturas");
    }

    function tick(){
      var list = collectPaths();
      console.log("[fallback-render] detectadas rutas:", list.length);
      if (list.length > 0) {
        render(list);
        return true;
      }
      return false;
    }

    // Reintentos + eventos
    var ok = tick();
    var tries = 0;
    var t = setInterval(function(){
      if (ok) { clearInterval(t); return; }
      tries++;
      ok = tick();
      if (tries > 8) clearInterval(t);
    }, 600);

    document.addEventListener("ibg:content-ready", function(){
      if (!ok) ok = tick();
    });
    window.addEventListener("load", function(){
      if (!ok) ok = tick();
    });
  } catch(e){
    console.error("[fallback-render] error", e);
  }
})();
