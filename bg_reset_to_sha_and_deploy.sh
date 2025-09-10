#!/usr/bin/env bash
set -euo pipefail

SHA="fdc87f96fcdf007c5062a225d77cdbf5a6086349"
BRANCH="main"
REMOTE="origin"

# Ajusta si tu scope/proyecto cambian
TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-deployable2"

echo "== Verificaciones previas =="
[ -d .git ] || { echo "❌ Aquí no hay un repo git."; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null

echo "• Remote actual: $(git remote get-url ${REMOTE})"
echo "• Branch actual: $(git rev-parse --abbrev-ref HEAD)"

echo "== Fetch + comprobar SHA =="
git fetch "${REMOTE}" --prune
if git cat-file -e "${SHA}^{commit}" 2>/dev/null; then
  echo "✔ Commit existe localmente."
else
  echo "ℹ️  No está local. Traigo todo por si está sólo en remoto…"
  git fetch --all --tags
  git cat-file -e "${SHA}^{commit}" 2>/dev/null || { echo "❌ El commit ${SHA} no existe en este repo."; exit 1; }
fi

echo "== Guardar referencia de seguridad (tag local) =="
SAFE_TAG="pre-reset-$(date +%Y%m%d_%H%M%S)"
git tag -f "${SAFE_TAG}" HEAD || true
echo "• Tag local creado: ${SAFE_TAG} -> $(git rev-parse --short ${SAFE_TAG})"

echo "== Reset duro a ${SHA} en ${BRANCH} =="
git checkout "${BRANCH}"
git reset --hard "${SHA}"
echo "• HEAD ahora en: $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

echo "== Push forzado con salvaguarda a ${REMOTE}/${BRANCH} =="
git push --force-with-lease "${REMOTE}" "${BRANCH}"
echo "✔ Remote actualizado a ${SHA:0:7}"

echo "== Vercel: link + pull env + deploy producción =="
# Necesitas estar logueado previamente en vercel CLI (vercel login)
vercel link --yes --project "${PROJECT}" --scope "${TEAM}" >/dev/null || true
vercel pull --yes --environment=production --scope "${TEAM}" >/dev/null || true

OUT="$(vercel deploy --prod --yes --scope "${TEAM}")"
echo "${OUT}"
URL="$(printf "%s\n" "${OUT}" | awk '/^https?:\/\/[a-zA-Z0-9\.\-]+/ {print $0}' | tail -n1)"
if [ -n "${URL:-}" ]; then
  echo "✅ Production: ${URL}"
else
  echo "⚠️  No pude extraer la URL. Abre el último deployment de Producción en Vercel para confirmar."
fi

echo "== Hecho =="
echo "• Repo local y remoto han vuelto a ${SHA:0:7}."
echo "• Revisa en incógnito la web y la consola (por si cache)."
