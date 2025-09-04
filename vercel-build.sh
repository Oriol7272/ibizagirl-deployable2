#!/usr/bin/env bash
set -euo pipefail

# 1) Inyectar variables reales en js/env-inline.js
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

# 2) Crear artefacto estático en /public (lo que Vercel espera)
rm -rf public
mkdir -p public

# Copiar TODO salvo metadatos y el propio public
rsync -a --delete \
  --exclude '.git' --exclude '.vercel' --exclude 'node_modules' \
  --exclude '_backup_*' --exclude '.env*' \
  --exclude 'scripts' --exclude 'tools' \
  --exclude 'vercel-build.sh' \
  --exclude 'public' \
  ./ public/

# 3) Sanity mínimo
for f in index.html premium.html subscription.html videos.html; do
  if [ ! -f "public/$f" ]; then
    echo "❌ Falta public/$f"; exit 1
  fi
done

echo "📦 Artefacto estático en ./public listo"
