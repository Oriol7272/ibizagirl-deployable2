#!/usr/bin/env bash
set -euo pipefail
inject_head(){
  f="$1"
  grep -q '/js/env.js' "$f" || awk '1; /<\/head>/{print "  <script src=\"/js/env.js\"></script>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
inject_strip(){
  f="$1"
  grep -q 'class="top-strip"' "$f" || awk '1; /<body[^>]*>/{print "<div class=\"top-strip\"><span class=\"plan-pill\">Lifetime 100€</span><span class=\"plan-pill\">Anual 49,99€</span><span class=\"plan-pill\">Mensual 14,99€</span><span>Todo el contenido visible mientras esté activo. Lifetime también elimina anuncios.</span></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
inject_modal(){
  f="$1"
  grep -q 'id="paypal-modal"' "$f" || awk '1; /<\/body>/{print "<div id=\"paypal-modal\" class=\"hidden\"><div id=\"paypal-modal-bg\"><div id=\"paypal-modal-card\"><button id=\"paypal-modal-close\" aria-label=\"cerrar\">✕</button><div id=\"paypal-modal-target\"></div></div></div></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
inject_home(){
  f=index.html; [ -f "$f" ] || return 0
  grep -q 'id="banner-rotator"' "$f" || awk '1; /<body[^>]*>/{print "<div id=\"banner-rotator\"></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  grep -q 'id="home-carousel"' "$f" || awk '1; /<div id="banner-rotator"><\/div>/{print "<section class=\"hbar\"><h2>Galería</h2></section><div id=\"home-carousel\"></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
inject_premium(){
  f=premium.html; [ -f "$f" ] || return 0
  grep -q 'id="premium-grid"' "$f" || awk '1; /<body[^>]*>/{print "<section class=\"hbar\"><h2>Premium</h2><span class=\"counter\" id=\"premium-counter\"></span></section><div id=\"premium-grid\"></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
inject_videos(){
  f=videos.html; [ -f "$f" ] || return 0
  grep -q 'id="videos-grid"' "$f" || awk '1; /<body[^>]*>/{print "<section class=\"hbar\"><h2>Vídeos</h2><span class=\"counter\" id=\"videos-counter\"></span></section><div id=\"videos-grid\"></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
inject_head index.html; inject_head premium.html; inject_head videos.html; inject_head subscription.html
inject_strip index.html; inject_strip premium.html; inject_strip videos.html; inject_strip subscription.html
inject_modal index.html; inject_modal premium.html; inject_modal videos.html; inject_modal subscription.html
inject_home
inject_premium
inject_videos
echo OK
