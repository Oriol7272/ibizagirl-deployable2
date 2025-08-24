#!/usr/bin/env bash
set -euo pipefail

echo "🔧 IBG: fix env.js a raíz + deploy Vercel"

# --- Reescribe build-env.sh para que env.js se genere en la RAÍZ del proyecto ---
mkdir -p tools
cat > tools/build-env.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

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

# Escribe env.js en la RAÍZ (no en tools/)
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

# Por si quedó un env.js antiguo dentro de tools, elimínalo
rm -f "$SCRIPT_DIR/env.js"

echo "✅ Generado $ROOT_DIR/env.js"
BASH
chmod +x tools/build-env.sh

# --- Genera env.js en raíz ---
bash tools/build-env.sh

# --- vercel.json para que Vercel ejecute el build de env.js ---
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

# --- Instala Vercel CLI si falta ---
if ! command -v vercel >/dev/null 2>&1; then
  echo "⬇️  Instalando Vercel CLI..."
  npm i -g vercel
fi

# --- Git push (dispara CI) ---
git add -A
git commit -m "IBG: env.js en raíz + vercel.json + deploy" || true
git push origin main || true

# --- Login/link si hace falta ---
if ! vercel whoami >/dev/null 2>&1; then
  echo "🔐 Abriendo login de Vercel..."
  vercel login
fi
if [ ! -f .vercel/project.json ]; then
  vercel link --yes
fi

# --- Deploy producción ---
echo "🚀 Deployando a producción..."
vercel --prod --yes ${VERCEL_TOKEN:+--token "$VERCEL_TOKEN"} | tee .last_vercel.txt

# --- Extrae URL y hace checks ---
URL="$(grep -Eo 'https://[a-z0-9.-]+\.vercel\.app' .last_vercel.txt | tail -n1 || true)"
if [ -n "$URL" ]; then
  echo "✅ Deploy URL: $URL"
  printf "HEAD /env.js -> "; curl -sI "$URL/env.js" | head -n1
  printf "HEAD /js/bootstrap-ibg.js -> "; curl -sI "$URL/js/bootstrap-ibg.js" | head -n1
  echo "📍 Comprueba en incógnito:"
  echo "  $URL/index.html"
  echo "  $URL/premium.html"
  echo "  $URL/videos.html"
  echo "  $URL/subscription.html"
else
  echo "⚠️ No pude detectar la URL de deploy en la salida del CLI; revisa la consola de arriba."
fi

echo "✅ Done."
