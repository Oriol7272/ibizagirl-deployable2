#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  if ! grep -q 'id="paypal-modal"' "$f"; then
    if grep -q '</body>' "$f"; then awk '{print} /<\/body>/{print "<div id=\"paypal-modal\" class=\"hidden\"><div id=\"paypal-modal-bg\"><div id=\"paypal-modal-card\"><button id=\"paypal-modal-close\" aria-label=\"close\">x</button><div id=\"paypal-modal-target\"></div></div></div></div>"}' "$f" > "$f.tmp" || true
    else cp "$f" "$f.tmp"; printf '\n<div id="paypal-modal" class="hidden"><div id="paypal-modal-bg"><div id="paypal-modal-card"><button id="paypal-modal-close" aria-label="close">x</button><div id="paypal-modal-target"></div></div></div></div>\n' >> "$f.tmp"
    fi
    [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
  fi
  if ! grep -q 'id="side-ads-left"' "$f"; then
    awk '1; /<body[^>]*>/{print "<aside class=\"sidebar-fixed sidebar-left\" id=\"side-ads-left\"><div class=\"ad-slot\" data-net=\"juicy\"></div><div class=\"ad-slot\" data-net=\"exo\"></div><div class=\"ad-slot\" data-net=\"ero\"></div></aside><aside class=\"sidebar-fixed sidebar-right\" id=\"side-ads-right\"><div class=\"ad-slot\" data-net=\"juicy\"></div><div class=\"ad-slot\" data-net=\"exo\"></div><div class=\"ad-slot\" data-net=\"ero\"></div></aside>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done
echo OK
