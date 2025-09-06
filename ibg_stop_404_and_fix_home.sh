#!/usr/bin/env bash
# Arregla 404 de JS/CSS, crea env inline, quita módulos ES problemáticos,
# y despliega en Vercel sin step de build.
set -euo pipefail

ROOT="$(pwd)"

echo "== 0) Prechequeos =="
[ -f "$ROOT/index.html" ] || { echo "❌ No encuentro index.html en $ROOT"; exit 1; }
mkdir -p public/js public/css tools

# ---------- helpers ----------
copy_or_noop () {
  # $1 = destino relativo en raíz (p.ej. ads-exo-common.js)
  # $2 = posible fuente (p.ej. public/js/ads-exo-common.js)
  local dest="$1"; local src="$2"
  if [ -f "$src" ]; then
    cp -f "$src" "$dest"
    echo "✔ copiado $src -> $dest"
  else
    # no-op seguro
    cat > "$dest" <<EOF
// noop shim for $dest (fuente no encontrada: $src)
console.log('[shim]', '$dest', 'noop');
EOF
    echo "• shim (noop) -> $dest"
  fi
}

# ---------- 1) Asegurar env-ads-inline.js ----------
echo "== 1) env-ads-inline.js =="
: "${EXOCLICK_ZONES:=5696328,5705186}"
: "${EXOCLICK_ZONE:=5696328}"
: "${EXOCLICK_BOTTOM_ZONE:=5717078}"
: "${POPADS_SITE_ID:=5226758}"
: "${POPADS_ENABLE:=1}"

cat > public/js/env-ads-inline.js <<EOF
/* generated inline */
window.__IBG_ADS = Object.assign(window.__IBG_ADS||{}, {
  EXOCLICK_ZONES: "${EXOCLICK_ZONES}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE}",
  EXOCLICK_BOTTOM_ZONE: "${EXOCLICK_BOTTOM_ZONE}",
  POPADS_SITE_ID: "${POPADS_SITE_ID}",
  POPADS_ENABLE: ${POPADS_ENABLE}
});
console.log('IBG_ADS ZONES ->', window.__IBG_ADS);
EOF

# Copia a la raíz con el mismo nombre que pide el navegador si lo pide así:
# (según tus logs, se pide env-ads-inline.js en raíz)
cp -f public/js/env-ads-inline.js env-ads-inline.js || true

# ---------- 2) Shims / copias para todos los que dan 404 ----------
echo "== 2) Shims/copias anti-404 =="
JS_LIST=(
  "ads-exo-common.js"
  "ads-exo-sides.js"
  "ads-exo-bottom.js"
  "ads-ero-ctrl.js"
  "ads-popads.js"
  "ads-bottom-row.js"
  "ads-debug.js"
  "bootstrap.js"
  "content-loader.js"
  "fs-pools.js"
  "gallery.js"
  "carousel.js"
  "decorative-manifest.js"
  "env-inline.js"
)
CSS_LIST=(
  "ibg.css"
)

for f in "${JS_LIST[@]}"; do
  copy_or_noop "$f" "public/js/$f"
done

for f in "${CSS_LIST[@]}"; do
  if [ -f "public/css/$f" ]; then
    cp -f "public/css/$f" "$f"
    echo "✔ copiado public/css/$f -> $f"
  else
    cat > "$f" <<'EOF'
/* css shim minimo para evitar 404 y limpiar artefacto/huecos */
:root{--bg:#0a0e27}
header + .artifact, .top-artifact, .menu-artifact {display:none !important;}
.ad-slot, .ad-placeholder, .ad-empty, .adbox, .ad-rect {
  min-height:0 !important; height:0 !important; margin:0 !important; padding:0 !important;
  border:0 !important; visibility:hidden !important; display:none !important;
}
#ad-left, .ad-left, #ad-right, .ad-right { display:block !important; visibility:visible !important; }
#ad-bottom, .ad-bottom, #ad-sticky-bottom, .ad-sticky-bottom { display:block !important; visibility:visible !important; }
EOF
    echo "• shim (css) -> $f"
  fi
done

# ---------- 3) Generar índices decorativos si faltan ----------
echo "== 3) decorative/content index (evitar 404 de decorative-manifest.js) =="
# Si tienes 'public/decorative', construimos manifest.json y un JS compatible.
node - <<'NODE'
const fs=require('fs'), p=require('path');
function list(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f=>fs.statSync(p.join(dir,f)).isFile())
         .map(f=>`/decorative/${f}`);
}
const decoDir = 'public/decorative';
const images = list(decoDir);
fs.writeFileSync('public/decorative-index.json', JSON.stringify({images}, null, 2));
fs.writeFileSync('decorative-manifest.js', `window.DECORATIVE_IMAGES=${JSON.stringify(images)};console.log('DECORATIVE_IMAGES =', window.DECORATIVE_IMAGES.length);`);
console.log('[decorative] images:', images.length);
NODE

# ---------- 4) Quitar módulos ES que rompen (utils.js, ads.js, banner-rotator.js si usan import/export) ----------
echo "== 4) Desactivar imports ES problemáticos en index.html =="
cp index.html index.html.bak_$(date +%Y%m%d_%H%M%S)
# Elimina líneas que incluyan utils.js o ads.js (no los necesitas para montar Exo/Pop/galería base)
# y banner-rotator.js si es módulo.
awk 'BEGIN{IGNORECASE=1}
!($0 ~ /<script[^>]+(utils\.js|ads\.js|banner-rotator\.js)/){print $0}' index.html > index.html.__tmp && mv index.html.__tmp index.html

# Asegura que cargamos env-ads-inline.js MUY arriba (justo después de <head>):
awk 'BEGIN{IGNORECASE=1}
{
  print $0;
  if (!ins && $0 ~ /<head[^>]*>/) {
    print "  <link rel=\"stylesheet\" href=\"/ibg.css\">";
    print "  <script src=\"/env-ads-inline.js\"></script>";
    ins=1;
  }
}' index.html > index.html.__tmp && mv index.html.__tmp index.html

# ---------- 5) vercel.json y package.json seguros (sin build) ----------
echo "== 5) vercel.json & package.json (sin build) =="
cat > vercel.json <<'JSON'
{
  "framework": null,
  "buildCommand": ":",
  "outputDirectory": "."
}
JSON

if [ -f package.json ]; then
  node - <<'NODE'
const fs=require('fs'); const p='package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8')); j.scripts=j.scripts||{};
j.scripts.build=":";
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log('[ok] scripts.build set to noop');
NODE
fi

# ---------- 6) Git & Deploy ----------
echo "== 6) Commit & push =="
git checkout main >/dev/null 2>&1 || true
git pull --rebase origin main
git add -A
git commit -m "fix: stop 404 (copy/shim js&css), env inline, disable ES modules, add decorative manifest" || echo "ℹ️ Nada que commitear."
git push origin main

echo "== 7) Deploy producción (Vercel) =="
TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true
OUT="$(vercel deploy --prod --yes --scope "$TEAM" || true)"
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
[ -n "${URL:-}" ] && echo "✅ Production: $URL" || echo "⚠️ Revisa la salida; no pude detectar la URL."

echo
echo "== 8) Checklist =="
echo " • No deben aparecer 404 de: env-ads-inline.js, ibg.css, ads-*.js, gallery.js, fs-pools.js, carousel.js, decorative-manifest.js."
echo " • No deben aparecer 'Unexpected token export' ni 'Cannot use import outside a module'."
echo " • Deben seguir saliendo: laterales L/R y sticky inferior; PopAds sin 'disabled'."
echo " • El artefacto sobre el menú debe desaparecer."
