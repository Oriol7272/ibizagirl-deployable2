#!/usr/bin/env bash
set -euo pipefail
echo "== IBG build =="

# 1) env inline (variables reales de Vercel)
mkdir -p js
cat > js/env-inline.js <<JS
window.__ENV = {
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL:-}",
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID:-}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499:-}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999:-}",
  LIFETIME_PRICE_EUR: "${LIFETIME_PRICE_EUR:-49.00}",
  PRICE_IMAGE_EUR: "${PRICE_IMAGE_EUR:-0.10}",
  PRICE_VIDEO_EUR: "${PRICE_VIDEO_EUR:-0.30}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID:-}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE:-}",
  JUICYADS_ZONE: "${JUICYADS_ZONE:-}",
  JUICYADS_SNIPPET_B64: "${JUICYADS_SNIPPET_B64:-}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
  EROADVERTISING_SNIPPET_B64: "${EROADVERTISING_SNIPPET_B64:-}",
  POPADS_ENABLE: "${POPADS_ENABLE:-}",
  POPADS_SITE_ID: "${POPADS_SITE_ID:-}"
};
JS
echo "[env] js/env-inline.js"

# 2) helpers de copia
copy_dir(){ d="$1"; if [ -d "$d" ]; then mkdir -p "public/$d"; cp -R "$d"/. "public/$d/"; echo "[copy] $d/"; fi; }
copy_file(){ f="$1"; if [ -f "$f" ]; then mkdir -p "public/$(dirname "$f")" 2>/dev/null || true; cp "$f" "public/$f"; echo "[copy] $f"; fi; }

# 3) ensamblado
rm -rf public && mkdir -p public
copy_file index.html
copy_file premium.html
copy_file videos.html
copy_file subscription.html
copy_dir  js
copy_dir  css
copy_dir  decorative-images
copy_dir  full
copy_dir  uncensored
copy_dir  uncensored-videos
copy_dir  ads
for f in content-data*.js favicon.ico robots.txt; do copy_file "$f"; done

# 4) generar índices JSON que espera el frontend
node <<'NODE'
const fs=require('fs'), path=require('path');
function listFiles(dir){
  const p = path.join('public',dir);
  if(!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter(f=>{
    try{ return fs.statSync(path.join(p,f)).isFile(); }catch{ return false; }
  }).sort();
}
const content = {
  full: listFiles('full'),
  uncensored: listFiles('uncensored'),
  videos: listFiles('uncensored-videos')
};
fs.writeFileSync('public/content-index.json', JSON.stringify(content));
const decorative = { images: listFiles('decorative-images') };
fs.writeFileSync('public/decorative-index.json', JSON.stringify(decorative));
console.log('[index] content-index.json:', content.full.length,'/ uncensored:',content.uncensored.length,'/ videos:',content.videos.length);
console.log('[index] decorative-index.json:', decorative.images.length);
NODE

# 5) log de sanity
full_n=$( [ -d public/full ] && find public/full -type f | wc -l || echo 0 )
unc_n=$( [ -d public/uncensored ] && find public/uncensored -type f | wc -l || echo 0 )
vid_n=$( [ -d public/uncensored-videos ] && find public/uncensored-videos -type f | wc -l || echo 0 )
dec_n=$( [ -d public/decorative-images ] && find public/decorative-images -type f | wc -l || echo 0 )
echo "[fs-index] full=$full_n uncensored=$unc_n videos=$vid_n decorative=$dec_n"

echo "[build] listo en ./public"

### DECORATIVE_MANIFEST ###
# Genera public/js/decorative-manifest.js con la lista de imágenes del banner
mkdir -p public/js
if [ -d "decorative-images" ]; then
  echo "window.DECORATIVE_IMAGES = [" > public/js/decorative-manifest.js
  first=1
  # extensiones típicas
  for p in $(find decorative-images -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | sort); do
    url="/$p"
    if [ $first -eq 1 ]; then
      printf "\"%s\"" "$url" >> public/js/decorative-manifest.js; first=0
    else
      printf ",\"%s\"" "$url" >> public/js/decorative-manifest.js
    fi
  done
  echo "];" >> public/js/decorative-manifest.js
  echo "[decorative] manifest listo: $(grep -o '\"/' public/js/decorative-manifest.js | wc -l | awk '{print $1}') imágenes"
else
  echo "window.DECORATIVE_IMAGES = [];" > public/js/decorative-manifest.js
  echo "[decorative] carpeta decorative-images no existe"
fi
### /DECORATIVE_MANIFEST ###
