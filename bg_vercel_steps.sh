#!/usr/bin/env bash
set -euo pipefail

PROJECT="${PROJECT:-beachgirl-final}"
TEAM_SLUG="${TEAM_SLUG:-oriols-projects-ed6b9b04}"
DOMAIN="${DOMAIN:-beachgirl.pics}"

command -v node >/dev/null || { echo "Falta node"; exit 1; }
command -v npm  >/dev/null || { echo "Falta npm"; exit 1; }
if ! command -v vercel >/dev/null; then npm i -g vercel@latest >/dev/null; fi

vercel link --project "$PROJECT" --scope "$TEAM_SLUG" --yes >/dev/null || true

open_url () {
  local url="$1"
  case "$(uname)" in
    Darwin) open "$url" >/dev/null 2>&1 || true ;;
    Linux) command -v xdg-open >/dev/null && xdg-open "$url" >/dev/null 2>&1 || true ;;
  esac
  echo "   $url"
}

echo
echo "== PASO 1 · Desproteger PRODUCTION =="
echo "   Entra en Settings → Protection y deja PRODUCTION como PUBLIC (sin auth)."
echo "   Password Protection: OFF · Protected Paths: vacío (borra /* si existe)."
open_url "https://vercel.com/$TEAM_SLUG/$PROJECT/settings/protection"
read -r -p "Pulsa ENTER cuando hayas guardado PRODUCTION = PUBLIC... " _

echo
echo "== PASO 2 · Revisar DOMAINS asignados =="
echo "   Ambos dominios deben estar 'Assigned to Production'."
open_url "https://vercel.com/$TEAM_SLUG/$PROJECT/settings/domains"
read -r -p "Pulsa ENTER tras confirmar que beachgirl.pics y www.beachgirl.pics están asignados... " _

echo
echo "== PASO 3 · (Opcional) Forzar nuevo deploy de producción =="
vercel --prod --yes --scope "$TEAM_SLUG" || true

echo
echo "== PASO 4 · Verificación rápida =="
for u in "https://$DOMAIN/" "https://www.$DOMAIN/"; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "$u" || echo 000)"
  echo "   $u -> HTTP $code"
done

echo
echo "== PASO 5 · Espera hasta HTTP 200 (loop corto) =="
for i in $(seq 1 20); do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || echo 000)"
  printf "[%02d] %s -> %s\n" "$i" "$DOMAIN" "$code"
  if [ "$code" = "200" ] || [ "$code" = "304" ]; then
    echo "✅ Producción pública OK ($code)"; exit 0
  fi
  sleep 6
done

echo "⚠️ Sigue sin 200: revisa que PRODUCTION esté en PUBLIC y sin Password/Protected Paths."
exit 1
