#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-final"
DOMAIN="ibizagirl.pics"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need node; need npm; command -v vercel >/dev/null || npm i -g vercel@latest >/dev/null

open_url(){ case "$(uname)" in
  Darwin) open "$1" >/dev/null 2>&1 || true ;;
  Linux) command -v xdg-open >/dev/null && xdg-open "$1" >/dev/null 2>&1 || true ;;
esac; echo " -> $1"; }

echo "== 1) Comprobación DNS (ok si ves 76.76.21.21 y cname.vercel-dns.com) =="
dig +short A "$DOMAIN" @1.1.1.1 || true
dig +short CNAME "www.$DOMAIN" @1.1.1.1 || true

echo
echo "== 2) Refrescar estado en Vercel (UI) =="
open_url "https://vercel.com/dashboard?team=$TEAM"
open_url "https://vercel.com/$TEAM/$PROJECT/settings/domains"
echo "En esa pantalla, pulsa 'Refresh' en:"
echo "  • ibizagirl.pics"
echo "  • www.ibizagirl.pics"
echo "hasta que marque 'Valid Configuration'."
read -r -p "Pulsa ENTER cuando lo hayas hecho... " _

echo
echo "== 3) Desactivar Vercel Authentication (quita el 401) =="
open_url "https://vercel.com/$TEAM/$PROJECT/settings/deployment-protection"
echo "• En 'Vercel Authentication' pon el toggle en: Disabled (y guarda si pide)."
echo "• Password Protection: Disabled."
read -r -p "Pulsa ENTER cuando Vercel Authentication esté 'Disabled'... " _

echo
echo "== 4) (Opcional) Redeploy de producción =="
vercel --prod --yes --scope "$TEAM" || true

echo
echo "== 5) Verificación HTTP (debe ser 200 o 304) =="
for U in "https://$DOMAIN/" "https://www.$DOMAIN/" "https://$PROJECT.vercel.app/"; do
  CODE="$(curl -sS -o /dev/null -w '%{http_code}' "$U" || echo 000)"
  echo "   $U -> $CODE"
done

echo
echo "== 6) Espera a 200/304 (loop corto) =="
for i in $(seq 1 20); do
  CODE="$(curl -sS -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || echo 000)"
  printf "[%02d] %s -> %s\n" "$i" "$DOMAIN" "$CODE"
  [[ "$CODE" = "200" || "$CODE" = "304" ]] && { echo "✅ Público OK ($CODE)"; exit 0; }
  sleep 6
done

echo "⚠️ Si sigue sin 200/304:"
echo "   • Revisa que 'Vercel Authentication' está realmente en Disabled."
echo "   • En Domains vuelve a pulsar 'Refresh' hasta 'Valid Configuration'."
exit 1
