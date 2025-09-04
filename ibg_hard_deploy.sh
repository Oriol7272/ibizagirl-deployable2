#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

command -v vercel >/dev/null || { echo "❌ Falta Vercel CLI (npm i -g vercel)"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null || { echo "❌ No estás en un repo git"; exit 1; }

echo "== 0) Enlazar proyecto y team =="
vercel switch --scope "$TEAM" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true

echo "== 1) Routing básico (si falta) y pequeños fixes =="
# corrige comentarios HTML rotos si quedaron
[ -f index.html ] && perl -0777 -i -pe 's/-->>/-->/g' index.html || true
# vercel.json mínimo para / -> /index.html
if [ ! -f vercel.json ]; then
  cat > vercel.json <<'JSON'
{ "cleanUrls": true, "trailingSlash": false,
  "routes": [
    { "src": "^/$", "dest": "/index.html" },
    { "src": "^/(index\\.html)?$", "dest": "/index.html" }
  ] }
JSON
fi
# 404 que redirige a Home (evita 404 de Vercel)
if [ ! -f 404.html ]; then
  cat > 404.html <<'HTML'
<!doctype html><meta charset="utf-8"><title>Not Found — ibizagirl.pics</title>
<meta http-equiv="refresh" content="0; url=/index.html">
<p>Redirigiendo a <a href="/index.html">Home</a>…</p>
HTML
fi

# favicon para evitar 404 ruidoso
[ -f favicon.ico ] || : > favicon.ico

git add -A || true
git diff --cached --quiet || (git commit -m "routing + 404 + fixes previos" && git push || true)

echo "== 2) Build y deploy NO interactivo =="
# Build local y deploy prebuilt (evita prompts)
vercel build --prod --yes > _vercel_build.txt 2>&1
vercel deploy --prebuilt --prod --yes > _vercel_deploy.txt 2>&1 || {
  echo "⚠️  Fallback: usando 'vercel --prod' directo…"
  vercel --prod --yes > _vercel_deploy.txt 2>&1
}

# Extraer URL de producción de forma robusta
DEPLOY_URL="$(grep -Eo 'https://[^[:space:]]+\.vercel\.app' _vercel_deploy.txt | tail -n1)"
[ -n "${DEPLOY_URL:-}" ] || DEPLOY_URL="$(grep -Eo 'https://[^[:space:]]+\.vercel\.app' _vercel_build.txt | tail -n1)"
[ -n "${DEPLOY_URL:-}" ] || { echo "❌ No pude detectar la URL del deploy. Muestra _vercel_deploy.txt"; exit 2; }
echo "    Deploy prod => $DEPLOY_URL"

echo "== 3) Alias (proyecto y dominio) -> deploy actual =="
# Alias del proyecto
vercel alias set "$DEPLOY_URL" "$PROJECT.vercel.app" || true
# Quitar alias previo del dominio si existiera y reasignarlo
if vercel alias ls | grep -q "$DOMAIN"; then
  printf "y\n" | vercel alias rm "$DOMAIN" || true
fi
vercel alias set "$DEPLOY_URL" "$DOMAIN" || true

echo "== 4) Verificación HTTP HEAD =="
check_code () { curl -fsSIL "$1" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}'; }
CODE_DEPLOY=$(check_code "$DEPLOY_URL/")
CODE_PROJ=$(check_code "https://$PROJECT.vercel.app/")
CODE_DOMN=$(check_code "https://$DOMAIN/")

printf "  %-30s %s\n" "DEPLOY" "$CODE_DEPLOY"
printf "  %-30s %s\n" "$PROJECT.vercel.app" "$CODE_PROJ"
printf "  %-30s %s\n" "$DOMAIN" "$CODE_DOMN"

if [ "$CODE_DOMN" = "401" ]; then
  echo "⚠️  $DOMAIN está protegido (401). Sacando token de bypass…"
  vercel env pull -y .env.vercel >/dev/null || true
  if grep -q '^VERCEL_PROTECTION_BYPASS=' .env.vercel; then
    TOKEN="$(grep '^VERCEL_PROTECTION_BYPASS=' .env.vercel | sed 's/^[^=]*=//')"
    echo
    echo "👉 En el navegador (DevTools → Console) pega EXACTAMENTE:"
    echo "document.cookie = 'vercel-protection-bypass=$TOKEN; Path=/; Max-Age=31536000; Secure; SameSite=None'; location.reload();"
    echo
    echo "Comprobación por curl con cookie:"
    curl -fsSIL "https://$DOMAIN/" -H "Cookie: vercel-protection-bypass=$TOKEN" | awk 'BEGIN{FS=": "}/^HTTP/{print "  ",$0}'
  else
    echo "No hay VERCEL_PROTECTION_BYPASS en .env.vercel. Revisa Settings → Security."
  fi
fi

echo "== 5) Comprobaciones rápidas de código servido =="
# Busca huella y referencias básicas en el HTML real
for host in "$DEPLOY_URL" "https://$PROJECT.vercel.app" "https://$DOMAIN"; do
  echo "— $host"
  (curl -fsSL "$host/index.html" || curl -fsSL "$host/") | sed -n '1,40p' | sed -n '1,4p'
  (curl -fsSL "$host/index.html" || curl -fsSL "$host/") | grep -E 'IBG-FP|content-data1\.js|content-data2\.js|home\.v4\.js' || true
done

echo "== 6) Sanidad del repo (referencias legacy) =="
if grep -RIn --include='*.html' 'content-data.js' .; then
  echo "❌ Sigue habiendo content-data.js en HTML. Sustituye por content-data1.js y content-data2.js."
else
  echo "✅ HTML sin content-data.js legacy."
fi

echo "DONE."
