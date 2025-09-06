#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"

echo "== 0) Prechequeos =="
[ -f "index.html" ] || { echo "❌ Falta ./index.html"; exit 1; }
[ -d "public" ] || { echo "❌ Falta ./public"; exit 1; }
mkdir -p public/js public/css

echo "== 1) ENV anuncios en public/js/env-ads-inline.js =="
node - <<'NODE'
const fs=require('fs');
const p='public/js/env-ads-inline.js';
let s=fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
if(!/window\.__IBG_ADS/.test(s)) s+='window.__IBG_ADS=window.__IBG_ADS||{};\n';
if(!/Object\.assign\(\s*window\.__IBG_ADS/.test(s)) s+='Object.assign(window.__IBG_ADS,{});\n';
function ins(k,v){
  if(!new RegExp('\\b'+k+'\\b').test(s)){
    s=s.replace(/Object\.assign\(\s*window\.__IBG_ADS\s*,\s*\{/,
      m=>m+`\n  ${k}: ${JSON.stringify(v)},`);
  }else if(k==='POPADS_ENABLE'){
    s=s.replace(/POPADS_ENABLE\s*:\s*0/g,'POPADS_ENABLE: 1');
  }
}
ins('EXOCLICK_ZONES','5696328,5705186'); // L,R
ins('EXOCLICK_ZONE','5696328');          // fallback
ins('EXOCLICK_BOTTOM_ZONE','5717078');   // sticky bottom
ins('POPADS_SITE_ID','5226758');
ins('POPADS_ENABLE',1);
if(!/IBG_ADS ZONES/.test(s)) s+='console.log("IBG_ADS ZONES ->",window.__IBG_ADS);\n';
fs.mkdirSync('public/js',{recursive:true});
fs.writeFileSync(p,s);
NODE

echo "== 2) Hotfix CSS (artefacto header + ocultar SOLO huecos vacíos) =="
node - <<'NODE'
const fs=require('fs');
const f='index.html';
let html=fs.readFileSync(f,'utf8');
const css = `
  <style id="ibg-cleanup-css">
    /* Artefacto sobre menú (divs sueltos o líneas decorativas) */
    header + .artifact, .top-artifact, .menu-artifact,
    body > .artifact, body > .decorative-line,
    body > div[style*="height:1px"], body > div[style*="height:2px"] {
      display:none !important; visibility:hidden !important;
    }
    /* Mostrar SOLO contenedores de anuncios que sí queremos visibles */
    #ad-left, .ad-left, #ad-right, .ad-right,
    #ad-sticky-bottom, .ad-sticky-bottom {
      display:block !important; visibility:visible !important; height:auto !important;
    }
    /* Ocultar placeholders/huecos vacíos SIN tocar el sticky bueno */
    .ad-placeholder, .ad-slot-empty, .ad-empty, .dummy-ad, .ghost-ad,
    .bottom-row-ads, .ads-row {
      display:none !important; visibility:hidden !important; height:0 !important;
      margin:0 !important; padding:0 !important; border:0 !important;
    }
  </style>`;
if(!/id="ibg-cleanup-css"/i.test(html)){
  html=html.replace(/<\/head>/i, css+'\n</head>');
}
fs.writeFileSync(f,html);
NODE

echo "== 3) Normalizar rutas a /js y /css en index.html =="
node - <<'NODE'
const fs=require('fs');
const f='index.html';
let h=fs.readFileSync(f,'utf8');
const jsList=[
 'ads-popads.js','carousel.js','ads-debug.js','ads-exo-common.js',
 'ads-bottom-row.js','ads-exo-bottom.js','ads-ero-ctrl.js',
 'bootstrap.js','content-loader.js','gallery.js','decorative-manifest.js',
 'fs-pools.js','ads-exo-sides.js','env-ads-inline.js'
];
for(const name of jsList){
  const re=new RegExp(`(<script[^>]+src=")(?!https?://|/js/)(?:\\./)?${name}(")`, 'ig');
  h=h.replace(re, `$1/js/${name}$2`);
}
h=h.replace(/(<link[^>]+href=")(?!https?:\/\/|\/css\/)(?:\.\/)?ibg\.css(")/ig, `$1/css/ibg.css$2`);
fs.writeFileSync(f,h);
NODE

echo "== 4) Shims anti-404 en raíz -> /js y /css (no rompen nada) =="
shim_js(){ 
  local name="${1:-}"; local target="${2:-}";
  if [ -z "$name" ] || [ -z "$target" ]; then
    echo "⚠️  shim_js llamado sin 2 argumentos; skip."; return 0;
  fi
  [ -f "$name" ] || cat > "$name" <<JS
/*! shim:$name -> $target */
(function(){var s=document.createElement('script');s.src='$target';s.async=false;
(document.currentScript&&document.currentScript.parentNode)
? document.currentScript.parentNode.insertBefore(s,document.currentScript.nextSibling)
: document.head.appendChild(s);})();
JS
}
shim_css(){ 
  local name="${1:-}"; local target="${2:-}";
  if [ -z "$name" ] || [ -z "$target" ]; then
    echo "⚠️  shim_css llamado sin 2 argumentos; skip."; return 0;
  fi
  [ -f "$name" ] || cat > "$name" <<CSS
/* shim:$name -> $target */
@import url("$target");
CSS
}

shim_js "ads-popads.js"         "/js/ads-popads.js"
shim_js "carousel.js"           "/js/carousel.js"
shim_js "ads-debug.js"          "/js/ads-debug.js"
shim_js "ads-exo-common.js"     "/js/ads-exo-common.js"
shim_js "ads-bottom-row.js"     "/js/ads-bottom-row.js"
shim_js "ads-exo-bottom.js"     "/js/ads-exo-bottom.js"
shim_js "ads-ero-ctrl.js"       "/js/ads-ero-ctrl.js"
shim_js "bootstrap.js"          "/js/bootstrap.js"
shim_js "content-loader.js"     "/js/content-loader.js"
shim_js "gallery.js"            "/js/gallery.js"
shim_js "decorative-manifest.js" "/js/decorative-manifest.js"   # ← (espacio corregido)
shim_js "fs-pools.js"           "/js/fs-pools.js"
shim_js "ads-exo-sides.js"      "/js/ads-exo-sides.js"
shim_js "env-inline.js"         "/js/env-ads-inline.js"
shim_css "ibg.css"              "/css/ibg.css"

echo "== 5) No-op initAds si el HTML lo invoca =="
[ -f "fix-ads-noop.js" ] || cat > fix-ads-noop.js <<'JS'
/*! fix-ads-noop */ window.initAds = window.initAds || function(){ try{ console.debug('[fix-ads-noop] initAds noop'); }catch(e){} };
JS
node - <<'NODE'
const fs=require('fs');
const f='index.html'; let h=fs.readFileSync(f,'utf8');
if(!/fix-ads-noop\.js/i.test(h)){
  h=h.replace(/<\/head>/i,'  <script src="/fix-ads-noop.js"></script>\n</head>');
}
fs.writeFileSync(f,h);
NODE

echo "== 6) Git commit & push =="
git checkout main >/dev/null 2>&1 || true
git pull --rebase origin main
git add -A
git commit -m "fix(home): env ads, rutas /js|/css, shims anti-404 (fixed), hotfix css, noop initAds" || echo "ℹ️ Nada que commitear."
git push origin main

echo "== 7) Deploy producción (Vercel) =="
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "$TEAM" || true)"
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa la salida; no pude detectar la URL."

echo
echo "== 8) Checklist tras deploy =="
echo " - Sin 404: ads-*.js, env-inline.js, ibg.css, carousel.js."
echo " - Sin 'Unexpected token export' / 'import fuera de módulo'."
echo " - Logs: 'IBG_ADS: EXO bottom mounted -> 5717078' + laterales montados."
echo " - PopAds sin 'disabled or no site id'."
echo " - Sin artefacto sobre el menú ni recuadros vacíos."
