#!/usr/bin/env bash
set -Eeuo pipefail

files=(index.html premium.html videos.html subscription.html)

append_before_body() {
  local f="$1" payload="$2"
  # si ya existe el payload, no tocamos el archivo
  if grep -Fq "$payload" "$f"; then return 0; fi
  awk -v P="$payload" '{
    if(!ins && /<\/body>/){ print P; ins=1 }
    print
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

insert_home_carousel() {
  local f="index.html"
  [[ -f "$f" ]] || return 0
  if grep -q 'id="home-carousel"' "$f"; then return 0; fi
  awk '{
    print
    if(!ins && /<div class="page">/){
      print "<section class=\"carousel\"><div id=\"home-carousel\"></div></section>"
      ins=1
    }
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

# 1) Inyecta ads.js y cta.js en todas las pginas (una sola vez)
for f in "${files[@]}"; do
  [[ -f "$f" ]] || continue
  append_before_body "$f" '  <script type="module" src="/js/ads.js"></script>'
  append_before_body "$f" '  <script type="module" src="/js/cta.js"></script>'
done

# 2) Carrusel SOLO en home (y su import)
insert_home_carousel
append_before_body index.html '  <script type="module" src="/js/carousel.js"></script>'

echo "OK"
