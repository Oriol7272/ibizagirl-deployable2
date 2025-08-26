#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Sincronizando 'main' con remoto y desplegando…"

# Asegura rebase por defecto y autostash
git config pull.rebase true
git config rebase.autoStash true

# Cambiar/crear rama main si hace falta
git checkout main 2>/dev/null || git checkout -b main

# Traer últimos cambios del remoto
git fetch origin

# Rebase de tu trabajo local encima de origin/main
git pull origin main --rebase --autostash || {
  echo "⚠️ Rebase automático falló, intentando merge con preferencia a remoto (theirs)…"
  git merge -X theirs origin/main || true
}

# Verificación de conflictos
if ! git diff --check --quiet 2>/dev/null; then
  echo "❌ Quedan conflictos. Resuélvelos y vuelve a ejecutar este script."
  exit 1
fi

# Empujar cambios
git push origin main

# Desplegar a producción con Vercel
npx -y vercel --prod --yes

echo "✅ Listo."
