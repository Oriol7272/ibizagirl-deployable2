#!/usr/bin/env bash
set -euo pipefail

TEAM_SLUG="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
CUSTOM_DOMAIN="ibizagirl.pics"

echo "==> Checks"
command -v vercel >/dev/null || { echo "Falta Vercel CLI (npm i -g vercel)"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null || { echo "No estás en un repo git"; exit 1; }

echo "==> 1) Fingerprint + commit + push (si hay cambios)"
echo "IBG-FINGERPRINT-DEPLOYABLE2-OK" > fingerprint.txt
if grep -q '<title>' index.html; then
  perl -0777 -i -pe 's#<title>.*?</title>#<title>IBIZAGIRL.PICS — vZERO</title><!-- IBG-FP: vZERO -->#' index.html
fi
git add -A || true
git diff --cached --quiet || git commit -m "fingerprint + vZERO title"
git push || true

echo "==> 2) Team + project link"
vercel switch --scope "$TEAM_SLUG" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true

echo "==> 3) Deploy producción"
DEPLOY_URL=$(
  vercel --prod --yes 2>&1 | tee _vercel_out.txt \
  | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1
)
if [ -z "${DEPLOY_URL:-}" ]; then
  DEPLOY_URL=$(sed -nE 's/.*(https:\/\/[^[:space:]]+\.vercel\.app).*/\1/p' _vercel_out.txt | tail -n1)
fi
[ -n "$DEPLOY_URL" ] || { echo "No pude detectar la URL del deploy de producción"; exit 1; }
echo "    -> $DEPLOY_URL"

echo "==> 4) Alias de proyecto -> deploy actual"
# No usar --yes: la CLI actual no lo soporta
vercel alias set "$DEPLOY_URL" "$PROJECT.vercel.app"

echo "==> 5) Reasignar dominio personalizado al deploy actual"
# 5a) Si existe un alias previo para el dominio, eliminarlo (puede pedir confirmación)
if vercel alias | grep -q "$CUSTOM_DOMAIN"; then
  printf "y\n" | vercel alias rm "$CUSTOM_DOMAIN" || true
fi
# 5b) Intentar asignarlo a este deploy
vercel alias set "$DEPLOY_URL" "$CUSTOM_DOMAIN" || {
  # Si falla porque el dominio no está agregado a este proyecto, lo añadimos y repetimos
  vercel domains add "$CUSTOM_DOMAIN" || true
  vercel alias set "$DEPLOY_URL" "$CUSTOM_DOMAIN"
}

echo "==> 6) Verificación por huella"
set +e
FP_DEPLOY=$(curl -fsSL "$DEPLOY_URL/fingerprint.txt?ts=$(date +%s)")
FP_PROJECT=$(curl -fsSL "https://$PROJECT.vercel.app/fingerprint.txt?ts=$(date +%s)")
FP_DOMAIN=$(curl -fsSL "https://$CUSTOM_DOMAIN/fingerprint.txt?ts=$(date +%s)")
set -e

OK="IBG-FINGERPRINT-DEPLOYABLE2-OK"
printf "    %-16s %s\n" "Deploy URL"   "${FP_DEPLOY:-<sin respuesta>}"
printf "    %-16s %s\n" "Project alias" "${FP_PROJECT:-<sin respuesta>}"
printf "    %-16s %s\n" "Custom domain" "${FP_DOMAIN:-<sin respuesta>}"

[ "$FP_DEPLOY" = "$OK" ] && [ "$FP_PROJECT" = "$OK" ] && [ "$FP_DOMAIN" = "$OK" ] \
  && echo "==> Todo OK: alias y dominio sirven el deploy correcto." \
  || { echo "==> Alguna verificación falló. Prueba incógnito, Disable cache y Unregister SW y reintenta curl."; exit 2; }
