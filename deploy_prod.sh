#!/usr/bin/env bash
set -euo pipefail

SCOPE="oriols-projects-ed6b9b04"
DOMAIN_APEX="ibizagirl.pics"
DOMAIN_WWW="www.ibizagirl.pics"

cd ~/ibizagirl-deployable2

git fetch origin
git checkout main
git reset --hard origin/main

vercel login >/dev/null 2>&1 || true
vercel switch --scope "$SCOPE" >/dev/null 2>&1 || true
vercel link --yes >/dev/null 2>&1 || true

vercel pull --yes --environment=production >/dev/null

set +u
if [ -f ".vercel/.env.production.local" ]; then
  set -a
  . .vercel/.env.production.local
  set +a
fi
set -u

rm -rf .vercel/output
mkdir -p .vercel/output/static/js

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

rsync -a --delete --exclude '.git' --exclude '.vercel' --exclude 'node_modules' ./ .vercel/output/static/

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

for f in index.html premium.html; do
  [ -f ".vercel/output/static/$f" ] || { echo "FALTA $f"; exit 1; }
done

DEPLOY_URL="$(vercel deploy --prebuilt --prod --yes --archive=tgz .vercel/output | sed -n 's/^Production: //p' | tail -n1)"
[ -n "$DEPLOY_URL" ] || { echo "No se obtuvo URL de producción"; exit 1; }
echo "Production = $DEPLOY_URL"

ok=0
for i in $(seq 1 40); do
  s1="$(curl -sI "$DEPLOY_URL/"        | awk 'NR==1{print $2}')"
  s2="$(curl -sI "$DEPLOY_URL/premium" | awk 'NR==1{print $2}')"
  echo "try $i  /:$s1  /premium:$s2"
  if [ "$s1" = "200" ] && [ "$s2" = "200" ]; then ok=1; break; fi
  sleep 2
done
[ "$ok" = "1" ] || { echo "Deploy no responde 200"; exit 1; }

vercel alias set "$DEPLOY_URL" "$DOMAIN_APEX" || true
vercel alias set "$DEPLOY_URL" "$DOMAIN_WWW"  || true

curl -sI "https://$DOMAIN_APEX/"        | head -n1
curl -sI "https://$DOMAIN_APEX/premium" | head -n1
