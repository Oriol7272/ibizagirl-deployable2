#!/usr/bin/env bash
set -euo pipefail

TEAM_SLUG="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

echo "==> Linkear proyecto (idempotente)"
vercel switch --scope "$TEAM_SLUG" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true

echo "==> Deploy producción"
OUT="$(vercel --prod 2>&1 | tee _vercel_out.txt)"
URL="$(printf "%s\n" "$OUT" | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1)"
if [ -z "$URL" ]; then
  URL="$(sed -nE 's/.*(https:\/\/[^[:space:]]+\.vercel\.app).*/\1/p' _vercel_out.txt | tail -n1)"
fi
[ -n "$URL" ] || { echo "❌ No pude detectar la URL del deploy"; exit 1; }
echo "    URL: $URL"

echo "==> Asignar alias del proyecto"
vercel alias set "$URL" "$PROJECT.vercel.app"

echo "==> Asignar dominio personalizado"
# si ya está en otro alias, Vercel lo reasigna aquí
vercel alias set "$URL" "$DOMAIN" || true

echo "==> Verificar huella (fingerprint.txt)"
set +e
FP_DEPLOY=$(curl -fsSL "$URL/fingerprint.txt?ts=$(date +%s)")
FP_ALIAS=$(curl -fsSL "https://$PROJECT.vercel.app/fingerprint.txt?ts=$(date +%s)")
FP_DOMAIN=$(curl -fsSL "https://$DOMAIN/fingerprint.txt?ts=$(date +%s)")
set -e

echo "    Deploy: $FP_DEPLOY"
echo "    Alias:  $FP_ALIAS"
echo "    Domain: $FP_DOMAIN"
