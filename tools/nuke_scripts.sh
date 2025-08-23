#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
for f in *.html _head_common.html; do
  [ -f "$f" ] || continue
  # Quita cualquier <script ...paypal.com/sdk/js...>
  perl -0777 -pe "s#<script[^>]*paypal\.com/sdk/js[^>]*></script>##gis" -i "$f" || true
  # Quita cualquier <script ... src="/js/payments.js"...> (clásico)
  perl -0777 -pe "s#<script[^>]*src=[\"']/js/payments\.js[^>]*></script>##gis" -i "$f" || true
  # Quita cualquier <script ... src="/js/init-*.js"...>
  perl -0777 -pe "s#<script[^>]*src=[\"']/js/init-[^\"']+\.js[^>]*></script>##gis" -i "$f" || true
  # Quita cualquier bloque <script type="module"> ... /js/i18n.js ... </script>
  perl -0777 -pe "s#<script[^>]*type=['\"]module['\"][^>]*>.*?/js/i18n\.js.*?</script>##gis" -i "$f" || true
  # Quita cualquier bloque <script ...> que contenga 'paypal.' global antes de cargar nuestro payments
  perl -0777 -pe "s#<script[^>]*>[^<]*?paypal\.[^<]*?</script>##gis" -i "$f" || true
  # Asegura runtime moderno page-init.js
  if ! grep -q 'js/page-init.js' "$f"; then
    if grep -q '</body>' "$f"; then
      awk '{print} /<\/body>/{print "  <script type=\"module\" src=\"/js/page-init.js\"></script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    else
      printf '\n  <script type="module" src="/js/page-init.js"></script>\n' >> "$f"
    fi
  fi
done
echo "Nuke OK"
