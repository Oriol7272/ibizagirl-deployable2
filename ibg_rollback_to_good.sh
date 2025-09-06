#!/usr/bin/env bash
# ibg_rollback_to_good.sh — Vuelve EXACTO a un commit bueno y despliega en Vercel.
# - Crea un tag de rescate de tu estado actual por si quieres volver.
# - Resetea 'main' al commit indicado.
# - Empuja con --force-with-lease.
# - Despliega a producción en Vercel.
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
BRANCH="main"
COMMIT="db8c40ef634741f841b94edaa3a5988b09086c28"   # <- cámbialo si quieres otro

echo "== 0) Pre-chequeos =="
[ -d .git ] || { echo "❌ Aquí no hay repo git."; exit 1; }

# Evita perder cambios locales por accidente
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "⚠️  Hay cambios sin commit en tu copia local."
  read -r -p "Descartar TODO y continuar? (y/N): " ans
  [[ "${ans:-N}" =~ ^[Yy]$ ]] || { echo "Abortado."; exit 1; }
fi

echo "== 1) Guardar estado actual por seguridad (tag de rescate) =="
TS=$(date +%Y%m%d_%H%M%S)
RESCUE_TAG="rescue-pre-rollback-${TS}"
git tag -f "$RESCUE_TAG" HEAD
echo "   → Tag creado: $RESCUE_TAG (apunta a $(git rev-parse --short HEAD))"

echo "== 2) Traer remoto y comprobar commit bueno =="
git fetch origin --prune
if ! git cat-file -e "$COMMIT^{commit}" 2>/dev/null; then
  echo "❌ El commit '$COMMIT' no existe en este repo."
  exit 1
fi

echo "== 3) Resetear main EXACTO a $COMMIT =="
git checkout "$BRANCH"
git reset --hard "$COMMIT"

echo "== 4) Empujar a GitHub (origin/main) con --force-with-lease =="
git push --force-with-lease origin "$BRANCH"

echo "== 5) Despliegue producción (Vercel) =="
# No tocamos código ni variables; solo deploy.
vercel link --yes --project "$PROJECT" --scope "$TEAM" >/dev/null || true
vercel pull --yes --environment=production --scope "$TEAM" >/dev/null || true

OUT="$(vercel deploy --prod --yes --scope "$TEAM")" || true
echo "$OUT"
URL="$(printf "%s\n" "$OUT" | awk '/^https?:\/\//{print $0}' | tail -n1)"
if [ -n "${URL:-}" ]; then
  echo "✅ Production: $URL"
else
  echo "⚠️ Revisa la salida anterior; no pude detectar la URL."
fi

echo
echo "== 6) Hecho =="
echo " - HEAD ahora es: $(git rev-parse --short HEAD)"
echo " - Si quieres volver al estado previo:  git reset --hard $RESCUE_TAG && git push --force-with-lease origin $BRANCH"
echo " - Abre en incógnito y verifica que ves: laterales L+R, sticky inferior y SIN artefacto ni recuadros vacíos."
