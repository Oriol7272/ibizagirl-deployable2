#!/usr/bin/env bash
set -euo pipefail

SHA_TARGET="db8c40ef634741f841b94edaa3a5988b09086c28"
BRANCH="main"
REMOTE="origin"

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-deployable2"

echo "== 1) Verificaciones =="
[ -d .git ] || { echo "❌ No veo .git aquí. Sitúate en la carpeta del repo."; exit 1; }

echo "== 2) Traer todo el historial remoto (por si el SHA no está local) =="
git fetch --all --tags --prune

echo "== 3) Cambiar a rama ${BRANCH} y resetear al SHA =="
git checkout "${BRANCH}"
git reset --hard "${SHA_TARGET}"

echo "== 4) Forzar ${REMOTE}/${BRANCH} a este estado (push --force-with-lease) =="
git push --force-with-lease "${REMOTE}" "${BRANCH}"

echo "== 5) Linkear proyecto Vercel y traer settings/env de producción =="
vercel link --yes --project "${PROJECT}" --scope "${TEAM}" >/dev/null || true
vercel pull --yes --environment=production --scope "${TEAM}" >/dev/null || true

echo "== 6) Desplegar a PRODUCCIÓN con Project Settings =="
OUT="$(vercel deploy --prod --yes --scope "${TEAM}")" || true
echo "${OUT}"
URL="$(printf "%s\n" "${OUT}" | awk '/^https?:\/\/[a-zA-Z0-9\.\-]+/ {print $0}' | tail -n1)"
if [ -n "${URL:-}" ]; then
  echo "✅ Production: ${URL}"
else
  echo "⚠️  Revisa la salida anterior; no se pudo detectar la URL automáticamente."
fi

echo
echo "== 7) Estado final =="
echo "- HEAD local:  $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"
echo "- HEAD remoto: $(git rev-parse --short ${REMOTE}/${BRANCH}) — $(git log -1 --pretty=%s ${REMOTE}/${BRANCH})"
echo "Listo."
