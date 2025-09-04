#!/usr/bin/env sh
echo "== IBG build (safe) =="

# Inyecta env en un JS (sin inventar valores)
mkdir -p js
cat > js/env-inline.js <<JS
window.__ENV = {
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL-}",
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID-}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499-}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999-}",
  LIFETIME_PRICE_EUR: "${LIFETIME_PRICE_EUR-49.00}",
  PRICE_IMAGE_EUR: "${PRICE_IMAGE_EUR-0.10}",
  PRICE_VIDEO_EUR: "${PRICE_VIDEO_EUR-0.30}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID-}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE-}",
  JUICYADS_ZONE: "${JUICYADS_ZONE-}",
  JUICYADS_SNIPPET_B64: "${JUICYADS_SNIPPET_B64-}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE-}",
  EROADVERTISING_SNIPPET_B64: "${EROADVERTISING_SNIPPET_B64-}",
  POPADS_ENABLE: "${POPADS_ENABLE-}",
  POPADS_SITE_ID: "${POPADS_SITE_ID-}"
};
JS
echo "[build] env-inline listo"

# Artefacto estático
rm -rf public 2>/dev/null || true
mkdir -p public
cp_if(){ [ -e "$1" ] && { mkdir -p "public/$(dirname "$1")" 2>/dev/null || true; cp -R "$1" "public/$1" 2>/dev/null || true; echo "[copy] $1"; } || true; }
cp_dir(){ [ -d "$1" ] && { mkdir -p "public/$1" 2>/dev/null || true; cp -R "$1"/. "public/$1/" 2>/dev/null || true; echo "[copy] $1/"; } || true; }

# HTML + assets
cp_if index.html; cp_if premium.html; cp_if videos.html; cp_if subscription.html
cp_dir js; cp_dir css; cp_dir decorative-images; cp_dir full; cp_dir uncensored; cp_dir uncensored-videos
for f in content-data*.js favicon.ico robots.txt; do cp_if "$f"; done

# === Índice REAL del filesystem en /public ===
node - <<'NODE' || true
const fs=require('fs'), path=require('path');
const base='public';
function list(dir, exts){
  try{
    return fs.readdirSync(path.join(base,dir))
      .filter(n=>exts.includes(path.extname(n).toLowerCase()))
      .sort();
  }catch(_){ return []; }
}
const full = list('full', ['.webp','.jpg','.jpeg','.png']);
const unc  = list('uncensored', ['.webp','.jpg','.jpeg','.png']);
const vids = list('uncensored-videos', ['.mp4','.webm','.mov']);
const out  = { full, uncensored: unc, videos: vids };
fs.writeFileSync(path.join(base,'content-index.json'), JSON.stringify(out));
console.log('[fs-index] full=%d uncensored=%d videos=%d', full.length, unc.length, vids.length);
NODE

echo "[build] listo en ./public"
exit 0
