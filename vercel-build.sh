#!/usr/bin/env bash
set -euo pipefail

# --- 1) Inyectar variables REALES de Vercel en js/env-inline.js
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
echo "✅ Generado js/env-inline.js desde variables de Vercel/local"

# --- 2) Crear artefacto estático en ./public (lo que espera Vercel)
rm -rf public && mkdir -p public

copy_dir(){ d="$1"; [ -d "$d" ] && { mkdir -p "public/$d"; cp -R "$d"/. "public/$d/"; echo "📁 $d -> public/$d"; }; }
copy_file(){ f="$1"; [ -f "$f" ] && { mkdir -p "public/$(dirname "$f")" 2>/dev/null || true; cp "$f" "public/$f"; echo "📄 $f -> public/$f"; }; }

# Copiar SOLO lo que servimos
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
for f in content-data*.js favicon.ico robots.txt; do copy_file "$f"; done

# --- 3) Sanity
for f in index.html premium.html subscription.html videos.html; do
  [ -f "public/$f" ] || { echo "❌ Falta public/$f"; exit 1; }
done
echo "📦 Artefacto estático listo en ./public"
