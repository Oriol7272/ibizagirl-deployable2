#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="beachgirl-final"
DOMAIN="beachgirl.pics"

need(){ command -v "$1" >/dev/null || { echo "Falta $1"; exit 1; }; }
need curl; need sed; need awk
command -v vercel >/dev/null || npm i -g vercel@latest >/dev/null

say(){ printf "\n=== %s ===\n" "$*"; }

hdr_summary(){ # url
  local url="$1"
  local out code auth
  out="$(curl -sSIL "$url" || true)"
  code="$(printf "%s\n" "$out" | sed -n '1s|.* \([0-9][0-9][0-9]\).*|\1|p')"
  if printf "%s\n" "$out" | grep -qi "_vercel_sso_nonce"; then auth="AUTH=ON"; else auth="AUTH=OFF"; fi
  echo "$url -> HTTP $code  ($auth)"
  printf "%s\n" "$out" | sed -n '1,10p'
}

say "DNS actual (debe ser 76.76.21.21 y cname.vercel-dns.com)"
echo -n "A    $DOMAIN          : "; dig +short A "$DOMAIN" @1.1.1.1 || true
echo -n "CNAME www.$DOMAIN : "; dig +short CNAME "www.$DOMAIN" @1.1.1.1 || true

say "HEAD en dominio y subdominio"
hdr_summary "https://$DOMAIN/"
hdr_summary "https://www.$DOMAIN/"
hdr_summary "https://$PROJECT.vercel.app/"

say "Prueba directa a 76.76.21.21 con Host=$DOMAIN (para descartar cachés intermedias)"
hdr_summary "https://$DOMAIN/"
curl -sSIL --resolve "$DOMAIN:443:76.76.21.21" "https://$DOMAIN/" | sed -n '1,8p' || true

say "Si cualquiera de las líneas anteriores muestra AUTH=ON, Vercel Authentication SIGUE ACTIVA para ese host."
say "Reforzar deploy + alias por si quedó un deployment antiguo con protección"

vercel link --project "$PROJECT" --scope "$TEAM" --yes >/dev/null || true
vercel --prod --yes --scope "$TEAM" || true

# Capturar el último deployment URL por si la CLI no devuelve claramente
DEPLOY_URL="$(vercel ls --scope "$TEAM" --prod | awk '/vercel\.app/ {u=$1} END{print u}')"
[ -n "${DEPLOY_URL:-}" ] || DEPLOY_URL="https://$PROJECT.vercel.app"

say "Reasignando alias al último deploy"
vercel alias set "$DEPLOY_URL" "$DOMAIN" --scope "$TEAM" >/dev/null || true
vercel alias set "$DEPLOY_URL" "www.$DOMAIN" --scope "$TEAM" >/dev/null || true

say "Verificación final (loop hasta 200/304)"
for i in $(seq 1 20); do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || echo 000)"
  hdr="$(curl -sSIL "https://$DOMAIN/" | tr -d '\r' | head -n 5 || true)"
  printf "[%02d] %s -> %s\n" "$i" "$DOMAIN" "$code"
  printf "%s\n" "$hdr"
  if [ "$code" = "200" ] || [ "$code" = "304" ]; then
    echo "✅ Dominio público OK ($code)"
    exit 0
  fi
  sleep 6
done

echo "⚠️ Sigue sin 200. Eso significa que Vercel Authentication sigue aplicada en este proyecto o a nivel de Team."
echo "   Abre y apágala explícitamente:"
echo "     https://vercel.com/$TEAM/$PROJECT/settings/deployment-protection  (toggle 'Vercel Authentication' = Disabled)"
echo "   Si ya está en Disabled: revisa Team Security (no exigir SSO global) y pulsa Refresh en Domains."
exit 1
