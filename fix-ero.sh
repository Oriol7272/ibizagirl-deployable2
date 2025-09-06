#!/usr/bin/env bash
set -euo pipefail

echo "== Ero: desactivar en Home y cargar por iframe en otras páginas =="

mkdir -p js ads

# 1) Loader que respeta bandera EROADVERTISING_ENABLE y NO carga en Home
cat > js/ads-ero-ctrl.js <<'JS'
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
JS

# 2) Tester/loader en iframe (mismo que antes, pero asegurado)
cat > ads/eroframe_ctrl.html <<'HTML'
<!doctype html><html><head><meta charset="utf-8">
<meta name="referrer" content="unsafe-url">
<title>Ero ctrl</title>
<style>html,body{margin:0;padding:0}#sp{display:block;width:300px;height:250px}</style>
</head><body>
<div id="sp">&nbsp;</div>
<script>
(function(){
  function get(k){ return new URLSearchParams(location.search).get(k)||""; }
  var space = get("space") || "8182057";
  var pid   = get("pid")   || "152716";
  var ctrl  = get("ctrl")  || "798544";

  if (typeof window.eaCtrl == "undefined"){
    var queue=[], eaCtrl={add:function(x){queue.push(x)}};
    window.eaCtrl = eaCtrl;
    var js = document.createElement("script");
    js.src = "//go.easrv.cl/loadeactrl.go?pid="+encodeURIComponent(pid)
           + "&spaceid="+encodeURIComponent(space)
           + "&ctrlid="+encodeURIComponent(ctrl);
    js.async = true;
    document.head.appendChild(js);
  }
  window.eaCtrl.add({"display":"sp","sid":Number(space),"plugin":"banner"});
})();
</script>
</body></html>
HTML

# 3) Forzar bandera OFF en Home dentro del inline env (si existe)
if [ -f js/env-inline.js ]; then
  node -e '
    const fs=require("fs");
    let s=fs.readFileSync("js/env-inline.js","utf8");
    if(!/EROADVERTISING_ENABLE/.test(s)){
      s=s.replace(/(window\.__ENV\s*=\s*\{)/, "$1 EROADVERTISING_ENABLE:\"0\", ");
    }else{
      s=s.replace(/EROADVERTISING_ENABLE\s*:\s*"?[01]"?/, "EROADVERTISING_ENABLE:\"0\"");
    }
    fs.writeFileSync("js/env-inline.js",s);
  '
fi

# 4) Asegurar referencia al script (harmless en Home porque sale al inicio)
if ! grep -q '/js/ads-ero-ctrl.js' index.html; then
  awk 'BEGIN{ins=0}
       /<\/head>/ && !ins { print "  <script defer src=\"/js/ads-ero-ctrl.js\"></script>"; ins=1 }
       { print }' index.html > .tmp && mv .tmp index.html
fi

git add js/ads-ero-ctrl.js ads/eroframe_ctrl.html js/env-inline.js index.html || true
git commit -m "ads: Ero por iframe; desactivado en Home con EROADVERTISING_ENABLE=0" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL=$(awk "/Production: https:\/\//{print \$3}" "$LOG" | tail -n1)
echo "🔗 Production: $URL"
echo "✔ Listo"
