#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

echo "==> Link"
vercel switch --scope "$TEAM" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true

echo "==> Deploy prod"
OUT="$(vercel --prod 2>&1 | tee _vercel_out.txt)"
URL="$(printf "%s\n" "$OUT" | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1)"
[ -n "$URL" ] || URL="$(sed -nE 's/.*(https:\/\/[^[:space:]]+\.vercel\.app).*/\1/p' _vercel_out.txt | tail -n1)"
[ -n "$URL" ] || { echo "❌ No pude detectar URL de prod"; exit 1; }
echo "    URL: $URL"

echo "==> Limpiar alias previo del dominio (si existía)"
if vercel alias ls | grep -q "$DOMAIN"; then
  printf "y\n" | vercel alias rm "$DOMAIN" || true
fi

echo "==> Asignar alias del proyecto y dominio al deploy actual"
vercel alias set "$URL" "$PROJECT.vercel.app"
vercel alias set "$URL" "$DOMAIN" || true

echo "==> Verificación con fingerprint.txt"
for host in "$URL" "$PROJECT.vercel.app" "$DOMAIN"; do
  printf "%-28s -> " "$host"
  code=$(curl -fsSIL "https://$host/fingerprint.txt?ts=$(date +%s)" | awk 'BEGIN{FS=": "}/^HTTP/{code=$2} END{print code}')
  echo "${code:-<sin respuesta>}"
done
echo "Contenido en $DOMAIN:"
curl -fsSL "https://$DOMAIN/fingerprint.txt?ts=$(date +%s)" || true
