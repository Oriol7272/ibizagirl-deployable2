(function(){
  try {
    console.log("[ucapi] start");
    function toPaths(arr){
      var out=[]; var seen=new Set();
      if (!arr) return out;
      for (var i=0;i<arr.length;i++){
        var it=arr[i];
        if (typeof it==="string" && (it.includes("/full/")||it.includes("/uncensored/"))) {
          if(!seen.has(it)){ seen.add(it); out.push(it); }
        } else if (it && typeof it==="object") {
          var k = it.src || it.url || it.path || it.href || it.thumbnail || it.thumb;
          if (typeof k==="string" && (k.includes("/full/")||k.includes("/uncensored/"))) {
            if(!seen.has(k)){ seen.add(k); out.push(k); }
          }
        }
        if (out.length>=300) break;
      }
      return out;
    }
    function render(paths){
      var root=document.getElementById("ucapi-debug-grid");
      if(!root){
        root=document.createElement("section");
        root.id="ucapi-debug-grid";
        var h=document.createElement("h2");
        h.textContent="Vista rápida (UnifiedContentAPI)";
        root.appendChild(h);
        document.body.appendChild(root);
      }
      // conserva el título
      var title=root.firstChild;
      root.innerHTML="";
      if(title) root.appendChild(title);
      var c=0;
      paths.slice(0,240).forEach(function(src){
        var a=document.createElement("a");
        a.href=src; a.target="_blank"; a.rel="noopener";
        var img=document.createElement("img"); img.loading="lazy"; img.decoding="async"; img.src=src; img.alt="thumb";
        a.appendChild(img); root.appendChild(a); c++;
      });
      console.log("[ucapi] pintadas", c, "miniaturas");
    }
    function tryFromAPI(api){
      var candidatesFn=["listAll","listAllImages","list","listImages","all","getAll","getAllImages","getImages","allImages"];
      var candidatesProp=["all","allImages","images","publicImages","premiumImages","items","entries","data"];
      var acc=[];
      // probar funciones
      candidatesFn.forEach(function(name){
        try {
          if (typeof api[name]==="function") {
            var r=api[name]();
            if (Array.isArray(r)) acc=acc.concat(toPaths(r));
          }
        } catch(e){}
      });
      // probar props
      candidatesProp.forEach(function(name){
        try {
          var v=api[name];
          if (Array.isArray(v)) acc=acc.concat(toPaths(v));
        } catch(e){}
      });
      // explorar ramas obvias
      ["public","premium","videos","images","photos","content"].forEach(function(k){
        try {
          var v=api[k];
          if (Array.isArray(v)) acc=acc.concat(toPaths(v));
          else if (v && typeof v==="object") {
            Object.keys(v).forEach(function kk(s){
              try { if (Array.isArray(v[s])) acc=acc.concat(toPaths(v[s])); } catch(e){}
            });
          }
        } catch(e){}
      });
      // dedupe
      acc=[...new Set(acc)];
      return acc;
    }

    function run(){
      // loggear claves disponibles
      if (window.UnifiedContentAPI) {
        try { console.log("[ucapi] keys:", Object.keys(window.UnifiedContentAPI)); } catch(e){}
      } else {
        console.warn("[ucapi] NO existe window.UnifiedContentAPI");
      }
      var paths=[];
      // 1) usar UnifiedContentAPI si existe
      if (window.UnifiedContentAPI) {
        try { paths = tryFromAPI(window.UnifiedContentAPI); } catch(e){}
      }
      // 2) fallback: buscar en globals conocidas (por si los data-modules dejan algo)
      if (paths.length===0) {
        var names=Object.getOwnPropertyNames(window);
        for (var i=0;i<names.length;i++){
          var n=names[i]; if (/^on|webkit|moz|ms|chrome|crypto|performance|document|location|navigator|history$/i.test(n)) continue;
          try {
            var v=window[n];
            if (Array.isArray(v) && v.length>=5) {
              var got=toPaths(v); if (got.length) paths=paths.concat(got);
            } else if (v && typeof v==="object") {
              Object.keys(v).forEach(function sub(k){
                try {
                  var vv=v[k];
                  if (Array.isArray(vv) && vv.length>=5) {
                    var got=toPaths(vv); if (got.length) paths=paths.concat(got);
                  }
                } catch(e){}
              });
            }
          } catch(e){}
          if (paths.length>=240) break;
        }
        paths=[...new Set(paths)];
      }
      console.log("[ucapi] detectadas rutas:", paths.length);
      if (paths.length>0) render(paths);
    }

    // ejecutar y reintentar un poco
    run();
    var n=0, t=setInterval(function(){ n++; run(); if(n>5) clearInterval(t); }, 700);

    // por si vuestros módulos emiten eventos custom
    document.addEventListener("ibg:content-ready", run);
    window.addEventListener("load", run);
  } catch(e){
    console.error("[ucapi] error", e);
  }
})();
