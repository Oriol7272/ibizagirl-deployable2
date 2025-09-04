#!/usr/bin/env bash
set -euo pipefail

TEAM_SLUG="oriols-projects-ed6b9b04"         # tu team
PROJECT="ibizagirl-deployable2"              # proyecto correcto
CUSTOM_DOMAIN="ibizagirl.pics"

echo "==> 0) Comprobaciones"
command -v vercel >/dev/null || { echo "Falta Vercel CLI (npm i -g vercel)"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null || { echo "No estás dentro de un repo git"; exit 1; }

echo "==> 1) Fingerprint y commit (si hay cambios)"
echo "IBG-FINGERPRINT-DEPLOYABLE2-OK" > fingerprint.txt
# marca visible en el <title>
if grep -q '<title>' index.html; then
  perl -0777 -i -pe 's#<title>.*?</title>#<title>IBIZAGIRL.PICS — vZERO</title><!-- IBG-FP: vZERO -->#' index.html
fi
git add -A || true
git diff --cached --quiet || git commit -m "fingerprint + vZERO title (verificación de dominio/deploy)"

echo "==> 2) Asegurar scope y proyecto vinculados"
# Activa el team
vercel switch --scope "$TEAM_SLUG" >/dev/null
# Vincula directorio local al proyecto si no lo está
vercel link --project "$PROJECT" --yes >/dev/null || true

echo "==> 3) Despliegue a PRODUCCIÓN"
# intentamos sacar la URL de producción del output
DEPLOY_URL=$(
  vercel --prod --yes 2>&1 | tee _vercel_out.txt \
  | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1
)
if [ -z "${DEPLOY_URL:-}" ]; then
  # fallback: busca la última línea que parezca URL de vercel en el output
  DEPLOY_URL=$(sed -nE 's/.*(https:\/\/[^[:space:]]+\.vercel\.app).*/\1/p' _vercel_out.txt | tail -n1)
fi
[ -n "$DEPLOY_URL" ] || { echo "No pude detectar la URL del deploy de producción"; exit 1; }
echo "    -> Deploy prod: $DEPLOY_URL"

echo "==> 4) Promocionar ese deploy a alias del proyecto"
# ibizagirl-deployable2.vercel.app debe apuntar a ESTE deploy
vercel alias set "$DEPLOY_URL" "$PROJECT.vercel.app" --yes >/dev/null

echo "==> 5) Asociar el dominio personalizado a ESTE deploy"
# Si el dominio está en otro proyecto, esto lo reasigna a este deploy
vercel alias set "$DEPLOY_URL" "$CUSTOM_DOMAIN" --yes >/dev/null || true

# Si fallara por "domain not added", lo añadimos al proyecto y repetimos
if ! vercel domains inspect "$CUSTOM_DOMAIN" >/dev/null 2>&1; then
  vercel domains add "$CUSTOM_DOMAIN" --yes >/dev/null || true
  vercel alias set "$DEPLOY_URL" "$CUSTOM_DOMAIN" --yes >/dev/null || true
fi

echo "==> 6) Verificación por huella (curl)"
set +e
FP_DEPLOY=$(curl -fsSL "$DEPLOY_URL/fingerprint.txt?ts=$(date +%s)")
FP_PROJECT=$(curl -fsSL "https://$PROJECT.vercel.app/fingerprint.txt?ts=$(date +%s)")
FP_DOMAIN=$(curl -fsSL "https://$CUSTOM_DOMAIN/fingerprint.txt?ts=$(date +%s)")
set -e

echo "    Deploy URL:     ${FP_DEPLOY:-<sin respuesta>}"
echo "    Project alias:  ${FP_PROJECT:-<sin respuesta>}"
echo "    Custom domain:  ${FP_DOMAIN:-<sin respuesta>}"

OK_STR="IBG-FINGERPRINT-DEPLOYABLE2-OK"
PASS_DEPLOY=$([ "$FP_DEPLOY" = "$OK_STR" ] && echo OK || echo FAIL)
PASS_PROJECT=$([ "$FP_PROJECT" = "$OK_STR" ] && echo OK || echo FAIL)
PASS_DOMAIN=$([ "$FP_DOMAIN" = "$OK_STR" ] && echo OK || echo FAIL)

echo "==> Resultado:"
printf "    %-16s %s\n" "Deploy URL"   "$PASS_DEPLOY"
printf "    %-16s %s\n" "Project alias" "$PASS_PROJECT"
printf "    %-16s %s\n" "Custom domain" "$PASS_DOMAIN"

if [ "$PASS_DEPLOY" != "OK" ] || [ "$PASS_PROJECT" != "OK" ] || [ "$PASS_DOMAIN" != "OK" ]; then
  echo
  echo "Alguna verificación FALLÓ. Recomendaciones:"
  echo "  • Abre en incógnito o DevTools → Network → Disable cache y recarga."
  echo "  • DevTools → Application → Service Workers → Unregister (si hubiese SW antiguo)."
  echo "  • Repite la verificación ejecutando:"
  echo "      curl -fsSL \"$DEPLOY_URL/fingerprint.txt?$(date +%s)\""
  echo "      curl -fsSL \"https://$PROJECT.vercel.app/fingerprint.txt?$(date +%s)\""
  echo "      curl -fsSL \"https://$CUSTOM_DOMAIN/fingerprint.txt?$(date +%s)\""
  exit 2
fi

echo "==> Todo OK: el dominio y el alias del proyecto sirven el deploy correcto."
