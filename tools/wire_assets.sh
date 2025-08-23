#!/usr/bin/env bash
set -euo pipefail

inject_once() {
  local file="$1"
  local needle="$2"
  local payload="$3"
  if ! grep -q "$needle" "$file"; then
    awk -v P="$payload" '1; /<\/body>/{print P}' "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
  fi
}

# Inyecta ads y cta en todas las páginas
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  inject_once "$f" '/js/ads.js' '  <script type="module" src="/js/ads.js"></script>'
  inject_once "$f" '/js/cta.js'  '  <script type="module" src="/js/cta.js"></script>'
done

# Carrusel solo en home (después de <div class="page">)
f="index.html"
if [ -f "$f" ] && ! grep -q 'id="home-carousel"' "$f"; then
  awk '1; /<div class="page">/{print "<section class=\\"carousel\\"><div id=\\"home-carousel\\"></div></section>"}' "$f" > "$f.tmp"
  mv "$f.tmp" "$f"
fi

# Asegura el import del carrusel en home
if [ -f "$f" ] && ! grep -q '/js/carousel.js' "$f"; then
  awk '1; /<\/body>/{print "  <script type=\\"module\\" src=\\"/js/carousel.js\\"></script>"}' "$f" > "$f.tmp"
  mv "$f.tmp" "$f"
fi

echo "OK"
