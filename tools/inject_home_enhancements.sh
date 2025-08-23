#!/usr/bin/env bash
set -euo pipefail
f="index.html"
[ -f "$f" ] || exit 0
# Sección carrusel justo al inicio del .page
if ! grep -q 'id="home-carousel"' "$f"; then
  awk '1; /<div class="page">/{print "<section class=\"carousel\"><div id=\"home-carousel\"></div></section>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
fi
# Imports de los módulos (una vez)
for s in "/js/carousel.js" "/js/cta.js" "/js/ads.js"; do
  grep -q "$s" "$f" || awk -v S="$s" '1; /<\/body>/{print "  <script type=\"module\" src=\""S"\"></script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
# En las demás páginas inyectamos CTA + ads si faltan
for f in premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  for s in "/js/cta.js" "/js/ads.js"; do
    grep -q "$s" "$f" || awk -v S="$s" '1; /<\/body>/{print "  <script type=\"module\" src=\""S"\"></script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  done
done
echo "Home + CTA + Ads OK"
