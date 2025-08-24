#!/usr/bin/env bash
set -euo pipefail

echo "🔧 IBG: Hotfix env.js + i18n import + Deploy"

# 0) Asegurar build-env.sh correcto (escribe env.js en la RAIZ)
mkdir -p tools
cat > tools/build-env.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

PAYPAL_CLIENT_ID="${PAYPAL_CLIENT_ID:-}"
PAYPAL_SECRET="${PAYPAL_SECRET:-}"
PAYPAL_PLAN_MONTHLY_1499="${PAYPAL_PLAN_MONTHLY_1499:-}"
PAYPAL_PLAN_ANNUAL_4999="${PAYPAL_PLAN_ANNUAL_4999:-}"
PAYPAL_WEBHOOK_ID="${PAYPAL_WEBHOOK_ID:-}"
CRISP_WEBSITE_ID="${CRISP_WEBSITE_ID:-}"
EXOCLICK_ZONE="${EXOCLICK_ZONE:-}"
JUICYADS_ZONE="${JUICYADS_ZONE:-}"
EROADVERTISING_ZONE="${EROADVERTISING_ZONE:-}"
EXOCLICK_SNIPPET_B64="${EXOCLICK_SNIPPET_B64:-}"
JUICYADS_SNIPPET_B64="${JUICYADS_SNIPPET_B64:-}"
EROADVERTISING_SNIPPET_B64="${EROADVERTISING_SNIPPET_B64:-}"
POPADS_SITE_ID="${POPADS_SITE_ID:-}"
POPADS_ENABLE="${POPADS_ENABLE:-0}"
IBG_ASSETS_BASE_URL="${IBG_ASSETS_BASE_URL:-}"
CURRENCY="EUR"

cat > "$ROOT_DIR/env.js" <<JS
window.IBG = {
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID}",
  PAYPAL_SECRET: "${PAYPAL_SECRET}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999}",
  PAYPAL_WEBHOOK_ID: "${PAYPAL_WEBHOOK_ID}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE}",
  JUICYADS_ZONE: "${JUICYADS_ZONE}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE}",
  EXOCLICK_SNIPPET_B64: "${EXOCLICK_SNIPPET_B64}",
  JUICYADS_SNIPPET_B64: "${JUICYADS_SNIPPET_B64}",
  EROADVERTISING_SNIPPET_B64: "${EROADVERTISING_SNIPPET_B64}",
  POPADS_SITE_ID: "${POPADS_SITE_ID}",
  POPADS_ENABLE: "${POPADS_ENABLE}",
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL}",
  CURRENCY: "${CURRENCY}"
};
JS

# Por si existe el antiguo env en tools, elimínalo
rm -f "$ROOT_DIR/tools/env.js"

echo "✅ Generado $ROOT_DIR/env.js"
BASH
chmod +x tools/build-env.sh

# 1) Generar env.js y verificar que NO empieza por 'export'
bash tools/build-env.sh
FIRST_WORD="$(head -c 6 env.js || true)"
if [ "$FIRST_WORD" = "export" ]; then
  echo "⚠️ env.js contenía 'export'. Reescribiendo..."
  bash tools/build-env.sh
fi

# 2) Arreglar import de i18n (../i18n.js -> ./i18n.js) SOLO si existe el patrón
if [ -f js/pages-common.js ]; then
  if grep -q "\.\./i18n\.js" js/pages-common.js; then
    # sed compatible con macOS
    sed -i '' -e 's#\.\./i18n\.js#\./i18n.js#g' js/pages-common.js
    echo "✅ Arreglado import en js/pages-common.js"
  else
    echo "ℹ️ Import i18n ya era correcto en js/pages-common.js"
  fi
fi

# 3) vercel.json para ejecutar build-env.sh en cada build
if [ ! -f vercel.json ]; then
  cat > vercel.json <<'JSON'
{
  "framework": "other",
  "buildCommand": "bash tools/build-env.sh",
  "outputDirectory": "."
}
JSON
  echo "📝 creado vercel.json"
fi

# 4) Instalar Vercel CLI si hace falta
if ! command -v vercel >/dev/null 2>&1; then
  echo "⬇️  Instalando Vercel CLI..."
  npm i -g vercel
fi

# 5) Commit + push
git add -A
git commit -m "IBG hotfix: env.js (no export) + i18n import + vercel.json" || true
git push origin main || true

# 6) Login y link si procede
if ! vercel whoami >/dev/null 2>&1; then
  echo "🔐 Abriendo login de Vercel..."
  vercel login
fi
if [ ! -f .vercel/project.json ]; then
  vercel link --yes
fi

# 7) Deploy producción
echo "🚀 Deploy a producción..."
vercel --prod --yes ${VERCEL_TOKEN:+--token "$VERCEL_TOKEN"} | tee .last_vercel.txt

# 8) URL + checks HTTP
URL="$(grep -Eo 'https://[a-z0-9.-]+\.vercel\.app' .last_vercel.txt | tail -n1 || true)"
if [ -n "$URL" ]; then
  echo "✅ Deploy URL: $URL"
  printf "HEAD /env.js -> "; curl -sI "$URL/env.js" | head -n1
  printf "HEAD /js/bootstrap-ibg.js -> "; curl -sI "$URL/js/bootstrap-ibg.js" | head -n1
  echo "⏩ Abre en incógnito y recarga forzada (Cmd+Shift+R):"
  echo "   $URL/index.html"
  echo "   $URL/premium.html"
  echo "   $URL/videos.html"
  echo "   $URL/subscription.html"
else
  echo "⚠️ No pude detectar la URL del deploy en la salida del CLI; revisa la salida arriba."
fi
echo "✅ Hotfix + Deploy completado."
