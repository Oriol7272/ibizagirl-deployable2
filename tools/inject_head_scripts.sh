#!/usr/bin/env bash
set -euo pipefail
add_head_once(){ f="$1"; src="$2"; if grep -q "$src" "$f"; then return; fi
  if grep -q '</head>' "$f"; then
    awk -v S="$src" '{print} /<\/head>/{print "  <script src=\"" S "\"></script>"}' "$f" > "$f.tmp" || true
  else
    cp "$f" "$f.tmp"; printf '\n  <script src="%s"></script>\n' "$src" >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}
for f in *.html; do
  [ -f "$f" ] || continue
  add_head_once "$f" "/js/env.js"
  add_head_once "$f" "/js/decorative-list.js"
  add_head_once "$f" "/js/ads.js"
  for s in $(ls -1 content-data*.js 2>/dev/null | sort); do
    base="/$s"; add_head_once "$f" "$base"
  done
  if ! grep -qi 'client.crisp.chat' "$f"; then
    if grep -q '</head>' "$f"; then
      awk '{print} /<\/head>/{print "  <script>window.$crisp=[];window.CRISP_WEBSITE_ID=(window.__ENV&&window.__ENV.CRISP_WEBSITE_ID)||\"\";(function(){var d=document;var s=d.createElement(\"script\");s.src=\"https://client.crisp.chat/l.js\";s.async=1;d.getElementsByTagName(\"head\")[0].appendChild(s);})();</script>"}' "$f" > "$f.tmp" || true
      [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
    else
      printf '\n<script>window.$crisp=[];window.CRISP_WEBSITE_ID=(window.__ENV&&window.__ENV.CRISP_WEBSITE_ID)||"";(function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>\n' >> "$f"
    fi
  fi
done
echo "OK head scripts"
