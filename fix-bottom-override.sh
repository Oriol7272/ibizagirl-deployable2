#!/usr/bin/env bash
set -euo pipefail

STICKY_ZONE="5717078"   # <-- tu zona sticky bottom nueva

# A) Inyecta un override en <head> para EXOCLICK_BOTTOM_ZONE
if ! grep -q 'EXOCLICK_BOTTOM_ZONE' index.html; then
  awk -v inj="<script>window.__ENV=window.__ENV||{};window.__ENV.EXOCLICK_BOTTOM_ZONE=${STICKY_ZONE};</script>" '
    /<\/head>/{ print inj; print; next } { print }' index.html > .tmp && mv .tmp index.html
  echo "➕ Override de EXOCLICK_BOTTOM_ZONE=${STICKY_ZONE} inyectado en <head>"
else
  # Si ya hay un tag con EXOCLICK_BOTTOM_ZONE, lo actualizamos por si quedó el antiguo
  perl -0777 -pe "s@(window\.__ENV\.EXOCLICK_BOTTOM_ZONE\s*=\s*)['\"]?\d+['\"]?;@\${1}${STICKY_ZONE};@s" -i index.html || true
  echo "✅ Override ya existía; actualizado a ${STICKY_ZONE}"
fi

# B) (opcional) endurecer el loader para que loguee qué zona usa
if [ -f js/ads-exo-bottom.js ]; then
  sed -i.bak 's/var Z = E.EXOCLICK_BOTTOM_ZONE .*/var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE; console.log("[ads-exo-bottom] zone chosen ->", Z);/' js/ads-exo-bottom.js || true
fi

# C) Commit & deploy
git add index.html js/ads-exo-bottom.js 2>/dev/null || true
git commit -m "ads: override runtime EXOCLICK_BOTTOM_ZONE=5717078" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"; vercel deploy --prod --yes | tee "$LOG"
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo "== Comprueba =="
echo "1) Consola: debe salir 'IBG_ADS: EXO bottom mounted -> 5717078' y '[ads-exo-bottom] zone chosen -> 5717078'"
echo "2) Network: a.magsrv.com y s.magsrv.com (200)."
echo "3) DOM: #ad-bottom contiene <ins data-zoneid=\"5717078\"> con un <iframe> dentro."
