#!/usr/bin/env bash
set -euo pipefail

echo "== Forzando sandbox del iframe de Ero a: allow-scripts allow-same-origin allow-popups =="

FILE="js/ads-ero-ctrl.js"
if [ ! -f "$FILE" ]; then
  echo "❌ No existe $FILE"; exit 1
fi

# 1) Cualquier setAttribute('sandbox', '...') -> valor correcto
perl -0777 -i -pe "s/setAttribute\\(\\s*(['\"])sandbox\\1\\s*,\\s*(['\"]).*?\\2\\s*\\)/setAttribute('sandbox','allow-scripts allow-same-origin allow-popups')/g" "$FILE"

# 2) Cualquier asignación directa: iframe.sandbox = '...'
perl -0777 -i -pe "s/\\.sandbox\\s*=\\s*(['\"]).*?\\1/.sandbox='allow-scripts allow-same-origin allow-popups'/g" "$FILE"

echo "== Verificación de líneas con sandbox =="
grep -n "sandbox" "$FILE" || true

echo "== Commit & Deploy =="
git add "$FILE" || true
git commit -m "ads: force Ero iframe sandbox to allow-same-origin" || true

vercel link --project ibizagirl-final --yes
LOG=$(mktemp)
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL=$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)
echo "🔗 Production: $URL"
echo "Hecho."
