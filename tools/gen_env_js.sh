#!/usr/bin/env bash
set -euo pipefail
mkdir -p .vercel
[ -f .vercel/.env.production.local ] || touch .vercel/.env.production.local
getv(){ grep -E "^$1=" .vercel/.env.production.local | tail -n1 | cut -d= -f2- | sed 's/\\/\\\\/g;s/"/\\"/g'; }
PAYPAL_CLIENT_ID="$(getv PAYPAL_CLIENT_ID)"
PAYPAL_PLAN_MONTHLY="$(getv PAYPAL_PLAN_MONTHLY)"
PAYPAL_PLAN_YEARLY="$(getv PAYPAL_PLAN_YEARLY)"
PAYPAL_PLAN_LIFETIME="$(getv PAYPAL_PLAN_LIFETIME)"
CRISP_WEBSITE_ID="$(getv CRISP_WEBSITE_ID)"
JUICYADS_ZONE="$(getv JUICYADS_ZONE)"
EXOCLICK_ZONE="$(getv EXOCLICK_ZONE)"
EROADVERTISING_ZONE="$(getv EROADVERTISING_ZONE)"
POPADS_SITE_ID="$(getv POPADS_SITE_ID)"
ADS_ENABLED="$(getv ADS_ENABLED)"
cat > js/env.js <<JS
window.__ENV={
  PAYPAL_CLIENT_ID:"${PAYPAL_CLIENT_ID||""}",
  PAYPAL_PLAN_MONTHLY:"${PAYPAL_PLAN_MONTHLY||""}",
  PAYPAL_PLAN_YEARLY:"${PAYPAL_PLAN_YEARLY||""}",
  PAYPAL_PLAN_LIFETIME:"${PAYPAL_PLAN_LIFETIME||""}",
  CRISP_WEBSITE_ID:"${CRISP_WEBSITE_ID||""}",
  JUICYADS_ZONE:"${JUICYADS_ZONE||""}",
  EXOCLICK_ZONE:"${EXOCLICK_ZONE||""}",
  EROADVERTISING_ZONE:"${EROADVERTISING_ZONE||""}",
  POPADS_SITE_ID:"${POPADS_SITE_ID||""}",
  ADS_ENABLED:"${ADS_ENABLED||"true"}"
};
JS
echo "OK js/env.js"
