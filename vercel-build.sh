#!/usr/bin/env bash
set -euo pipefail

# --- 1) Inyectar variables REALES en js/env-inline.js
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
echo "✅ Generado js/env-inline.js con variables de entorno"

# --- 2) Crear artefacto estático en ./public
rm -rf public && mkdir -p public

copy_dir(){ d="$1"; [ -d "$d" ] && { mkdir -p "public/$d"; cp -R "$d"/. "public/$d/" 2>/dev/null || true; echo "📁 $d -> public/$d"; }; }
copy_file(){ f="$1"; [ -f "$f" ] && { mkdir -p "public/$(dirname "$f")" 2>/dev/null || true; cp "$f" "public/$f" 2>/dev/null || true; echo "📄 $f -> public/$f"; }; }

# HTML base
copy_file index.html
copy_file premium.html
copy_file videos.html
copy_file subscription.html

# Assets y JS/CSS reales
copy_dir  js
copy_dir  css
copy_dir  decorative-images
copy_dir  full
copy_dir  uncensored
copy_dir  uncensored-videos

# Data real (todos los content-data*.js que existan)
for f in content-data*.js favicon.ico robots.txt; do copy_file "$f"; done

# --- 3) Sanity estricto (PORTABLE y NO FATAL)
for f in index.html premium.html subscription.html videos.html; do
  if [ ! -f "public/$f" ]; then
    echo "❌ Falta public/$f"
    exit 1
  fi
done

check_any(){
  d="$1"
  if [ -d "$d" ]; then
    # Si está vacío, avisamos pero NO fallamos el build
    if [ -z "$(ls -A "$d" 2>/dev/null || true)" ]; then
      echo "⚠️ Sin archivos en $d"
    fi
  fi
}
check_any public/full
check_any public/uncensored
check_any public/uncensored-videos

echo "✅ Build estático listo en ./public (outputDirectory=public)"
exit 0
