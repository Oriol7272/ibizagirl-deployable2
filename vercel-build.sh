#!/usr/bin/env bash
set -euo pipefail
echo "== IBG build =="
# 1) env inline
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

# 2) helpers
copy_dir(){ d="$1"; if [ -d "$d" ]; then mkdir -p "public/$d"; cp -R "$d"/. "public/$d/"; echo "[copy] $d/"; fi; }
copy_file(){ f="$1"; if [ -f "$f" ]; then mkdir -p "public/$(dirname "$f")" 2>/dev/null || true; cp "$f" "public/$f"; echo "[copy] $f"; fi; }

# 3) assemble
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
copy_dir  ads                # 👈 AQUI copiamos /ads
for f in content-data*.js favicon.ico robots.txt; do copy_file "$f"; done

# 4) index de pools (debug)
full_n=$( [ -d public/full ] && find public/full -type f | wc -l || echo 0 )
unc_n=$( [ -d public/uncensored ] && find public/uncensored -type f | wc -l || echo 0 )
vid_n=$( [ -d public/uncensored-videos ] && find public/uncensored-videos -type f | wc -l || echo 0 )
dec_n=$( [ -d public/decorative-images ] && find public/decorative-images -type f | wc -l || echo 0 )
echo "[fs-index] full=$full_n uncensored=$unc_n videos=$vid_n decorative=$dec_n"

echo "[build] listo en ./public"
