#!/usr/bin/env sh
echo "== IBG build (safe) =="
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

rm -rf public 2>/dev/null || true; mkdir -p public || true
cp_if(){ [ -e "$1" ] && { mkdir -p "public/$(dirname "$1")" 2>/dev/null || true; cp -R "$1" "public/$1" 2>/dev/null || true; echo "[copy] $1"; } || true; }
cp_dir(){ [ -d "$1" ] && { mkdir -p "public/$1" 2>/dev/null || true; cp -R "$1"/. "public/$1/" 2>/dev/null || true; echo "[copy] $1/"; } || true; }

cp_if index.html; cp_if premium.html; cp_if videos.html; cp_if subscription.html
cp_dir js; cp_dir css; cp_dir decorative-images; cp_dir full; cp_dir uncensored; cp_dir uncensored-videos
for f in content-data*.js favicon.ico robots.txt; do cp_if "$f"; done

# Índices reales
node - <<'NODE' || true
const fs=require('fs'), path=require('path');
const base='public';
function ls(d, exts){
  try{
    const p=path.join(base,d);
    return fs.existsSync(p)?fs.readdirSync(p).filter(n=>exts.includes(path.extname(n).toLowerCase())).sort():[];
  }catch(_){return[]}
}
const full = ls('full',['.webp','.jpg','.jpeg','.png']);
const unc  = ls('uncensored',['.webp','.jpg','.jpeg','.png']);
const vids = ls('uncensored-videos',['.mp4','.webm','.mov']);
fs.writeFileSync(path.join(base,'content-index.json'), JSON.stringify({full,uncensored:unc,videos:vids}));

const deco = ls('decorative-images',['.png','.jpg','.jpeg','.webp']);
fs.writeFileSync(path.join(base,'decorative-index.json'), JSON.stringify({decorative:deco}));

console.log('[fs-index] full=%d uncensored=%d videos=%d decorative=%d', full.length, unc.length, vids.length, deco.length);
NODE

echo "[build] listo en ./public"; exit 0
