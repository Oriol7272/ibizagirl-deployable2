#!/usr/bin/env bash
set -Eeuo pipefail
files=(index.html premium.html videos.html subscription.html)

add_in_head(){
  local f="$1" line="$2"
  grep -Fq "$line" "$f" && return 0
  awk -v L="$line" '{print; if(!ins && /<head[^>]*>/){ print "  " L; ins=1 }}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

append_before_body(){
  local f="$1" payload="$2"
  grep -Fq "$payload" "$f" && return 0
  awk -v P="$payload" '{ if(!ins && /<\/body>/){ print "  " P; ins=1 } print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

fix_as_module(){
  local f="$1" p="$2"
  perl -0777 -pe 's!<script(?![^>]*type="module")([^>]*\bsrc="'$p'".*?)></script>!<script type="module"$1></script>!g' -i "$f"
}

for f in "${files[@]}"; do
  [[ -f "$f" ]] || continue
  add_in_head "$f" '<link rel="stylesheet" href="/css/ibg-layout.css"/>'
  # Asegura que nuestros JS se cargan
  append_before_body "$f" '<script type="module" src="/js/ads.js"></script>'
  append_before_body "$f" '<script type="module" src="/js/cta.js"></script>'
  # Arregla scripts ES module que daban "Unexpected token export"
  fix_as_module "$f" '/js/env.js'
  fix_as_module "$f" '/js/payments.js'
  fix_as_module "$f" '/js/page-init.js'
  fix_as_module "$f" '/js/storefront.js'
done

# Carrusel solo en home (una vez)
f="index.html"
if [[ -f "$f" ]] && ! grep -q 'id="home-carousel"' "$f"; then
  awk '{
    print
    if(!ins && /<div[^>]*id="main-section"[^>]*>/){
      print "<section class=\"carousel\"><div id=\"home-carousel\"><div class=\"track\"></div></div></section>"
      ins=1
    }
  }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
fi
append_before_body index.html '<script type="module" src="/js/carousel.js"></script>'

echo "HTML PATCH OK"
