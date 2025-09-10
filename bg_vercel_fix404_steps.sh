#!/usr/bin/env bash
set -euo pipefail

PROJECT="${PROJECT:-beachgirl-final}"
TEAM_SLUG="${TEAM_SLUG:-oriols-projects-ed6b9b04}"
DOMAIN="${DOMAIN:-beachgirl.pics}"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need node; need npm; command -v vercel >/dev/null || npm i -g vercel@latest >/dev/null

echo "== 0) Login y scope actual =="
vercel whoami || true
echo

echo "== 1) Asegurar link local al proyecto correcto =="
vercel link --project "$PROJECT" --scope "$TEAM_SLUG" --yes >/dev/null || true
echo "✓ Repo linkeado a $TEAM_SLUG/$PROJECT"
echo

open_url () {
  local url="$1"
  case "$(uname)" in
    Darwin) open "$url" >/dev/null 2>&1 || true ;;
    Linux) command -v xdg-open >/dev/null && xdg-open "$url" >/dev/null 2>&1 || true ;;
  esac
  echo "   -> $url"
}

echo "== 2) Abrir el dashboard del TEAM (evita 404) =="
open_url "https://vercel.com/dashboard?team=$TEAM_SLUG"
read -r -p "Pulsa ENTER cuando veas el dashboard del team '$TEAM_SLUG'... " _

echo "== 3) Abrir la vista del PROYECTO =="
open_url "https://vercel.com/$TEAM_SLUG/$PROJECT"
read -r -p "Pulsa ENTER cuando se cargue la página del proyecto... " _

echo "== 4) Abrir SETTINGS generales del proyecto (no subruta) =="
open_url "https://vercel.com/$TEAM_SLUG/$PROJECT/settings"
cat <<'TXT'

Ahora, dentro de Settings, haz esto manualmente:
  A) Menú lateral -> "Protection" (a veces está dentro de "Security" según UI).
     - Production: PUBLIC
     - Password Protection: OFF
     - Protected Paths: vacío (borra /* si existe)
     Guarda cambios.
  B) Menú lateral -> "Domains"
     - Asegúrate de que beachgirl.pics y www.beachgirl.pics están "Assigned to Production".
TXT
read -r -p "Pulsa ENTER cuando hayas aplicado A) y B)... " _

echo "== 5) Forzar un deploy de producción (opcional) =="
vercel --prod --yes --scope "$TEAM_SLUG" || true

echo "== 6) Verificación =="
for u in "https://$DOMAIN/" "https://www.$DOMAIN/" "https://$PROJECT.vercel.app/"; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "$u" || echo 000)"
  echo "   $u -> HTTP $code"
done

echo
echo "== 7) Esperar a 200 (loop corto) =="
for i in $(seq 1 20); do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || echo 000)"
  printf "[%02d] %s -> %s\n" "$i" "$DOMAIN" "$code"
  if [ "$code" = "200" ] || [ "$code" = "304" ]; then
    echo "✅ Producción pública OK ($code)"; exit 0
  fi
  sleep 6
done

echo "⚠️ Sigue sin 200: revisa Protection (Production = PUBLIC, sin Password y sin Protected Paths)."
exit 1
