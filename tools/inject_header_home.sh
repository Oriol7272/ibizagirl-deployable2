#!/usr/bin/env bash
set -euo pipefail

inject_top(){
  f="$1"; html="$2"
  if grep -q '<body' "$f"; then
    awk -v H="$html" '1; /<body[^>]*>/{print H}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"; printf '\n%s\n' "$html" >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}

add_if_absent(){
  f="$1"; marker="$2"; block="$3"
  grep -q "$marker" "$f" || inject_top "$f" "$block"
}

for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue

  add_if_absent "$f" 'class="langbox"' '<div class="langbox"><select id="lang-select"><option value="es">ES</option><option value="en">EN</option><option value="fr">FR</option><option value="de">DE</option><option value="it">IT</option></select></div>'

  add_if_absent "$f" 'header class="site"' '<header class="site"><div class="brand"><h1>IBIZAGIRL.PICS</h1><p data-i18n="welcome">Bienvenido al paraiso para tu disfrute</p></div><nav class="navbar"><a class="btn" href="/index.html">Home</a><a class="btn" href="/premium.html">Premium</a><a class="btn" href="/videos.html">Videos</a><a class="btn" href="/subscription.html" data-i18n="subscribe">Suscripciones</a><button id="buy-lifetime" class="btn" style="display:inline-flex;align-items:center;gap:.4rem"><span class="pp-icon"></span><span>Lifetime 100€</span></button></nav></header>'

  add_if_absent "$f" 'id="side-ads-left"' '<aside class="sidebar-fixed sidebar-left" id="side-ads-left"><div class="ad-slot" data-net="juicy"></div><div class="ad-slot" data-net="exo"></div><div class="ad-slot" data-net="ero"></div></aside><aside class="sidebar-fixed sidebar-right" id="side-ads-right"><div class="ad-slot" data-net="juicy"></div><div class="ad-slot" data-net="exo"></div><div class="ad-slot" data-net="ero"></div></aside>'

  if [ "$(basename "$f")" = "index.html" ]; then
    add_if_absent "$f" 'id="banner-rotator"' '<div id="banner-rotator" class="section"></div>'
    add_if_absent "$f" 'id="home-carousel"' '<div class="section"><section class="hbar"><h2 data-i18n="gallery">Galeria</h2></section><div id="home-carousel"></div></div>'
    add_if_absent "$f" 'id="home-premium-grid"' '<div class="section"><section class="hbar"><h2 data-i18n="premium">Premium</h2><span class="counter" id="home-premium-counter"></span></section><div id="home-premium-grid"></div></div>'
    add_if_absent "$f" 'id="home-videos-grid"' '<div class="section"><section class="hbar"><h2 data-i18n="videos">Videos</h2><span class="counter" id="home-videos-counter"></span></section><div id="home-videos-grid"></div></div>'
  fi

  if ! grep -q 'id="paypal-modal"' "$f"; then
    awk '{print} /<\/body>/{print "<div id=\"paypal-modal\" class=\"hidden\"><div id=\"paypal-modal-bg\"><div id=\"paypal-modal-card\"><button id=\"paypal-modal-close\" aria-label=\"close\">x</button><div id=\"paypal-modal-target\"></div></div></div></div>"}' "$f" > "$f.tmp" || true
    [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
  fi
done
echo OK
