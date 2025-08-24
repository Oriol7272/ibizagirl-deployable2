#!/usr/bin/env bash
set -euo pipefail

# 1) Genera un NUEVO archivo de entorno sin 'export' y con nombre distinto: ibg-env.js
node - <<'NODE'
const fs=require('fs');
const v=process.env;
const IBG={
  PAYPAL_CLIENT_ID: v.PAYPAL_CLIENT_ID||'',
  PAYPAL_SECRET: v.PAYPAL_SECRET||'',
  PAYPAL_PLAN_MONTHLY_1499: v.PAYPAL_PLAN_MONTHLY_1499||'',
  PAYPAL_PLAN_ANNUAL_4999: v.PAYPAL_PLAN_ANNUAL_4999||'',
  PAYPAL_WEBHOOK_ID: v.PAYPAL_WEBHOOK_ID||'',
  CRISP_WEBSITE_ID: v.CRISP_WEBSITE_ID||'',
  EXOCLICK_ZONE: v.EXOCLICK_ZONE||'',
  JUICYADS_ZONE: v.JUICYADS_ZONE||'',
  EROADVERTISING_ZONE: v.EROADVERTISING_ZONE||'',
  EXOCLICK_SNIPPET_B64: v.EXOCLICK_SNIPPET_B64||'',
  JUICYADS_SNIPPET_B64: v.JUICYADS_SNIPPET_B64||'',
  EROADVERTISING_SNIPPET_B64: v.EROADVERTISING_SNIPPET_B64||'',
  POPADS_SITE_ID: v.POPADS_SITE_ID||'',
  POPADS_ENABLE: v.POPADS_ENABLE||'',
  IBG_ASSETS_BASE_URL: v.IBG_ASSETS_BASE_URL||'',
  CURRENCY: 'EUR'
};
fs.writeFileSync('ibg-env.js','window.IBG = '+JSON.stringify(IBG,null,2)+';');
NODE

# 2) Guarda el env.js viejo para que no vuelva a colarse
[ -f env.js ] && mv -f env.js env.js.bak || true

# 3) Actualiza TODAS las páginas para que carguen el nuevo archivo ibg-env.js
for f in index.html premium.html videos.html subscription.html; do
  if [ -f "$f" ]; then
    sed -i "" -e 's#/env\.js#/ibg-env.js#g' "$f"
  fi
done

# 4) Corrige import de i18n por si acaso (evita 404)
[ -f js/pages-common.js ] && sed -i "" -e 's#\.\./i18n\.js#\./i18n.js#g' js/pages-common.js || true

# 5) Commit + push + deploy
git add -A
git commit -m "fix: swap env.js -> ibg-env.js (window.IBG) + i18n path" || true
git push origin main || true

# 6) Deploy a producción (usando npx para no depender de instalación global)
npx -y vercel --prod --yes
