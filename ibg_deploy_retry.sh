#!/usr/bin/env bash
set -euo pipefail
TRIES=${TRIES:-4}
attempt=1
ok=0

echo "[IBG] Deploy con reintentos (hasta $TRIES)…"

while [ $attempt -le $TRIES ]; do
  echo "→ intento $attempt: vercel --prod --yes"
  if npx -y vercel --prod --yes; then
    ok=1; break
  fi
  echo "   fallo, probando build + deploy --prebuilt…"
  if npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; then
    ok=1; break
  fi
  echo "   reintentamos en $((attempt*5))s…"
  sleep $((attempt*5))
  attempt=$((attempt+1))
done

if [ $ok -eq 1 ]; then
  echo "✅ Deploy OK. Abre: https://ibizagirl.pics/index.html"
else
  echo "❌ No se pudo desplegar tras $TRIES intentos."
  echo "   Abre el panel de Vercel y pulsa **Redeploy** en el último commit."
fi
