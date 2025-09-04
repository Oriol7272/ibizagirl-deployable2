#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-final"
DOMAIN="ibizagirl.pics"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need node; need npm; command -v vercel >/dev/null || npm i -g vercel@latest >/dev/null

echo "== 0) Link al proyecto (por si acaso) =="
vercel link --project "$PROJECT" --scope "$TEAM" --yes >/dev/null || true
echo "✓ $TEAM/$PROJECT"

open_url () {
  local url="$1"
  case "$(uname)" in
    Darwin) open "$url" >/dev/null 2>&1 || true ;;
    Linux) command -v xdg-open >/dev/null && xdg-open "$url" >/dev/null 2>&1 || true ;;
  esac
  echo "   -> $url"
}

echo
echo "== 1) Comprobar DNS actual =="
echo "Apex debe ser 76.76.21.21 y www -> cname.vercel-dns.com"
dig +short A "$DOMAIN" @1.1.1.1 || true
dig +short CNAME "www.$DOMAIN" @1.1.1.1 || true

echo
echo "== 2) Inspección de dominios en Vercel =="
vercel domains inspect "$DOMAIN" --scope "$TEAM" || true
vercel domains inspect "www.$DOMAIN" --scope "$TEAM" || true

echo
echo "== 3) Abrir páginas correctas del panel (en orden) =="
echo "A) Dashboard del Team (evita 404)"
open_url "https://vercel.com/dashboard?team=$TEAM"
read -r -p "Pulsa ENTER cuando lo veas..." _

echo "B) Vista del proyecto"
open_url "https://vercel.com/$TEAM/$PROJECT"
read -r -p "Pulsa ENTER cuando cargue..." _

echo "C) Settings > Deployment Protection"
open_url "https://vercel.com/$TEAM/$PROJECT/settings/deployment-protection"
cat <<'TXT'

En "Deployment Protection":
  - Production → Authentication: PUBLIC
  - Password Protection (Production): OFF
  - Protected Paths (Production): vacío (borra /* si aparece)
Guarda cambios.

TXT
read -r -p "Pulsa ENTER cuando hayas puesto Production = PUBLIC..." _

echo "D) Settings > Domains (refresca estado hasta 'Valid Configuration')"
open_url "https://vercel.com/$TEAM/$PROJECT/settings/domains"
echo "   Si ves 'DNS Change Recommended', pulsa 'Refresh'. Debe quedar 'Valid Configuration'."
read -r -p "Pulsa ENTER cuando ambos (apex y www) estén OK..." _

echo "E) (Opcional) Team Settings > Security (SSO Global)"
open_url "https://vercel.com/teams/$TEAM/settings/security"
echo "   Asegúrate de que NO esté activo 'Require SSO for all deployments' para Production."
read -r -p "Pulsa ENTER cuando esté confirmado..." _

echo
echo "== 4) Forzar deploy de producción (por si la protección quedaba cacheada) =="
vercel --prod --yes --scope "$TEAM" || true

echo
echo "== 5) Verificación HTTP (loop corto) =="
for U in "https://$DOMAIN/" "https://www.$DOMAIN/" "https://$PROJECT.vercel.app/"; do
  for i in $(seq 1 20); do
    CODE="$(curl -sS -o /dev/null -w '%{http_code}' "$U" || echo 000)"
    printf "[%02d] %s -> %s\n" "$i" "$U" "$CODE"
    if [ "$CODE" = "200" ] || [ "$CODE" = "304" ]; then
      echo "✅ OK en $U ($CODE)"
      break
    fi
    sleep 6
  done
done

echo
echo "Si alguno siguiera en 401:"
echo " - Revisa otra vez 'Deployment Protection' (Production = PUBLIC, sin Password ni Protected Paths)."
echo " - En 'Domains', pulsa 'Refresh' hasta ver 'Valid Configuration'."
