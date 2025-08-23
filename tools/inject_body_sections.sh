#!/usr/bin/env bash
set -euo pipefail

inject_after_body(){
  f="$1"; html="$2"
  if grep -q '<body' "$f"; then
    awk -v H="$html" '1; /<body[^>]*>/{print H}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"; printf '\n%s\n' "$html" >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}

inject_before_body_end(){
  f="$1"; html="$2"
  if grep -q '</body>' "$f"; then
    awk -v H="$html" '{print} /<\/body>/{print H}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"; printf '\n%s\n' "$html" >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}

for f in *.html; do
  [ -f "$f" ] || continue

  if ! grep -q 'class="top-strip"' "$f"; then
    inject_after_body "$f" '<div class="top-strip"><span class="plan-pill">Lifetime 100 EUR</span><span class="plan-pill">Anual 49.99 EUR</span><span class="plan-pill">Mensual 14.99 EUR</span><span>Todo el contenido visible mientras este activo. Lifetime ademas elimina anuncios.</span><button id="buy-lifetime" class="buy-btn" style="position:static;transform:none"><span class="pp-icon"></span><span>PayPal</span></button></div>'
  fi

  if ! grep -q 'id="side-ads-left"' "$f"; then
    inject_after_body "$f" '<aside class="sidebar-fixed sidebar-left" id="side-ads-left"><div class="ad-slot" data-net="juicy"></div><div class="ad-slot" data-net="exo"></div><div class="ad-slot" data-net="ero"></div></aside><aside class="sidebar-fixed sidebar-right" id="side-ads-right"><div class="ad-slot" data-net="juicy"></div><div class="ad-slot" data-net="exo"></div><div class="ad-slot" data-net="ero"></div></aside>'
  fi

  base="$(basename "$f")"
  if [ "$base" = "index.html" ]; then
    if ! grep -q 'id="banner-rotator"' "$f"; then
      inject_after_body "$f" '<div id="banner-rotator"></div>'
    fi
    if ! grep -q 'id="home-carousel"' "$f"; then
      inject_after_body "$f" '<section class="hbar"><h2>Galeria</h2></section><div id="home-carousel"></div>'
    fi
  fi

  if [ "$base" = "premium.html" ] && ! grep -q 'id="premium-grid"' "$f"; then
    inject_after_body "$f" '<section class="hbar"><h2>Premium</h2><span class="counter" id="premium-counter"></span></section><div id="premium-grid"></div>'
  fi

  if [ "$base" = "videos.html" ] && ! grep -q 'id="videos-grid"' "$f"; then
    inject_after_body "$f" '<section class="hbar"><h2>Videos</h2><span class="counter" id="videos-counter"></span></section><div id="videos-grid"></div>'
  fi

  if ! grep -q 'id="paypal-modal"' "$f"; then
    inject_before_body_end "$f" '<div id="paypal-modal" class="hidden"><div id="paypal-modal-bg"><div id="paypal-modal-card"><button id="paypal-modal-close" aria-label="close">x</button><div id="paypal-modal-target"></div></div></div></div>'
  fi
done
echo "OK body sections"
