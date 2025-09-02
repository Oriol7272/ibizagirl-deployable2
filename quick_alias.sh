#!/usr/bin/env bash
set -euo pipefail
set -x

# Muestra últimos 10 deploys de producción
vercel list --prod --limit 10

# Pega aquí el vercel.app "Ready" que quieras usar:
GOOD_URL="${GOOD_URL:-}"

if [ -z "$GOOD_URL" ]; then
  echo "Falta GOOD_URL. Ejemplo:"
  echo "GOOD_URL=https://ibizagirl-deployable2-xxxxx.vercel.app /bin/bash quick_alias.sh"
  exit 1
fi

vercel alias set "$GOOD_URL" ibizagirl.pics  || true
vercel alias set "$GOOD_URL" www.ibizagirl.pics || true

curl -sI https://ibizagirl.pics/ | head -n1
curl -sI https://ibizagirl.pics/premium | head -n1
