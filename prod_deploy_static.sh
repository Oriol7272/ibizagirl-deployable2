#!/usr/bin/env bash
set -euo pipefail
set -x

DOMAIN_APEX="ibizagirl.pics"
DOMAIN_WWW="www.ibizagirl.pics"

# 1) main limpio
git fetch origin
git checkout main
git reset --hard origin/main

# 2) Trae variables de PRODUCCIÓN a .vercel/.env.production.local
vercel pull --yes --environment=production

# 3) Exporta esas variables al entorno de este proceso (sin romper si faltan)
set +u
if [ -f ".vercel/.env.production.local" ]; then
  set -a
  . .vercel/.env.production.local
  set +a
fi
set -u

# 4) Construye artefacto estático Vercel v3 (.vercel/output)
rm -rf .vercel/output
mkdir -p .vercel/output/static/js

# Rutas limpias para /premium /subscription /videos
cat > .vercel/output/config.json <<'JSON'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "^/premium/?$",      "dest": "/premium.html" },
    { "src": "^/subscription/?$", "dest": "/subscription.html" },
    { "src": "^/videos/?$",       "dest": "/videos.html" }
  ]
}
JSON

# Copia del sitio
rsync -a --delete \
  --exclude '.git' --exclude '.vercel' --exclude 'node_modules' \
  ./ .vercel/output/static/

# Inyección de ENV para el frontend
cat > .vercel/output/static/js/env.js <<EOF
window.ENV = {
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID:-}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499:-}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999:-}",
  PAYPAL_ONESHOT_PRICE_EUR: "${PAYPAL_ONESHOT_PRICE_EUR:-3.00}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE:-}",
  JUICYADS_ZONE: "${JUICYADS_ZONE:-}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
  POPADS_SITE_ID: "${POPADS_SITE_ID:-}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID:-}",
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL:-}"
};
EOF

# Sanidad mínima
for f in index.html premium.html; do
  [ -f ".vercel/output/static/$f" ] || { echo "FALTA $f"; exit 1; }
done

# 5) Deploy prebuilt a PRODUCCIÓN (sin builds adicionales)
DEPLOY_URL="$(vercel deploy --prebuilt --prod --yes --archive=tgz .vercel/output | sed -n 's/^Production: //p' | tail -n1)"
[ -n "$DEPLOY_URL" ] || { echo "No se obtuvo URL de producción"; exit 1; }
echo "PRODUCTION_URL=$DEPLOY_URL"

# 6) Espera a 200 en / y /premium
ok=0
for i in $(seq 1 40); do
  s1="$(curl -sI "$DEPLOY_URL/"        | awk 'NR==1{print $2}')"
  s2="$(curl -sI "$DEPLOY_URL/premium" | awk 'NR==1{print $2}')"
  echo "try $i  /:$s1  /premium:$s2"
  if [ "$s1" = "200" ] && [ "$s2" = "200" ]; then ok=1; break; fi
  sleep 2
done
[ "$ok" = "1" ] || { echo "Deploy no responde 200"; exit 1; }

# 7) Alias
vercel alias set "$DEPLOY_URL" "$DOMAIN_APEX" || true
vercel alias set "$DEPLOY_URL" "$DOMAIN_WWW"  || true

# 8) Verificación CDN
curl -sI "https://$DOMAIN_APEX/"        | head -n1
curl -sI "https://$DOMAIN_APEX/premium" | head -n1
