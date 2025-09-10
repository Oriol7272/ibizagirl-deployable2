#!/usr/bin/env bash
set -euo pipefail
BOTTOM="${BOTTOM_ZONE:-5717078}"   # <-- tu zona sticky nueva

# A) Inyectar override justo tras <head> (antes de cualquier <script defer ...ads-*.js>)
#    y eliminar overrides antiguos si los hubiera
perl -0777 -pe 's@<script>window\.__ENV=.*?EXOCLICK_BOTTOM_ZONE=.*?</script>\n?@@s' -i index.html 2>/dev/null || true
awk -v inj="<script>window.__ENV=window.__ENV||{};window.__ENV.EXOCLICK_BOTTOM_ZONE=${BOTTOM};</script>" '
  BEGIN{done=0}
  /<head[^>]*>/{print; if(!done){print inj; done=1}; next} {print}
' index.html > .tmp && mv .tmp index.html
echo "✓ Inyectado EXOCLICK_BOTTOM_ZONE=${BOTTOM} tras <head>"

# B) Asegurar contenedor y CSS mínimos
grep -q 'id="ad-bottom"' index.html || awk '/<\/body>/{print "  <div id=\"ad-bottom\" class=\"ad-bottom\"></div>";print;next}{print}' index.html > .tmp && mv .tmp index.html && echo "✓ Añadido <div id=ad-bottom>"
grep -q 'ads-bottom-css' index.html || awk 'BEGIN{css="  <style id=\"ads-bottom-css\">#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center}#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}@media(max-width:768px){#ad-bottom ins{min-height:60px}}</style>"} /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html && echo "✓ CSS bottom"

# C) Endurecer loader: sólo usa EXOCLICK_BOTTOM_ZONE (evita fallback al lateral)
mkdir -p js
if [ -f js/ads-exo-bottom.js ]; then
  perl -0777 -pe 's/var Z\s*=\s*[^;]+;/var Z = (window.__ENV||{}).EXOCLICK_BOTTOM_ZONE;/' -i js/ads-exo-bottom.js || true
  # Log visible:
  grep -q 'zone chosen' js/ads-exo-bottom.js || sed -i.bak '1i console.log("[ads-exo-bottom] zone chosen ->", (window.__ENV||{}).EXOCLICK_BOTTOM_ZONE);' js/ads-exo-bottom.js
fi

git add index.html js/ads-exo-bottom.js || true
git commit -m "fix: EXO sticky bottom -> use EXOCLICK_BOTTOM_ZONE (5717078) and load env first" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"; vercel deploy --prod --yes | tee "$LOG"
URL="$(awk "/Production: https:\/\//{print \$3}" "$LOG" | tail -n1)"
echo "🔗 Production: $URL"
echo "✔ Abre la home y comprueba que los logs muestran: 'zone chosen -> 5717078' y 'EXO bottom mounted -> 5717078'."
