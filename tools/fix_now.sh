#!/usr/bin/env bash
set -Eeuo pipefail
files=(index.html premium.html videos.html subscription.html)

add_head_css(){ local f="$1"
  grep -Fq 'ibg-layout.css' "$f" && return 0
  awk '{print; if(!ins && /<head[^>]*>/){ print "  <link rel=\"stylesheet\" href=\"/css/ibg-layout.css\"/>"; ins=1 }}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

append_end(){ local f="$1" payload="$2"
  grep -Fq "$payload" "$f" && return 0
  awk -v P="$payload" '{ if(!ins && /<\/body>/){ print "  " P; ins=1 } print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}

for f in "${files[@]}"; do
  [[ -f "$f" ]] || continue
  add_head_css "$f"
  append_end "$f" '<script type="module" src="/js/ads.js"></script>'
  append_end "$f" '<script type="module" src="/js/cta.js"></script>'
  # fuerza mdddulos para env/payments/page-init/storefront (cualquier ruta)
  perl -0777 -pe 's!<script((?:(?!type).)*?\bsrc="[^"]*(?:^|/)(?:env|payments|page-init|storefront)\.js(?:\?[^"]*)?")\s*>!<script type="module"$1>!gi' -i "$f"
  # usa payments.fix.js en lugar de payments.js
  perl -pi -e 's!/js/payments\.js!/js/payments.fix.js!g' "$f"
  # corrige dominio de EroAdvertising truncado
  perl -pi -e 's#https://go\./#https://go.eroadvertising.com/#g' "$f"
done

# carrusel en home
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
append_end index.html '<script type="module" src="/js/carousel.js"></script>'

echo "FIX NOW OK"
