#!/usr/bin/env bash
set -euo pipefail

inject_top(){ f="$1"; html="$2"
  if grep -q '<body' "$f"; then awk -v H="$html" '1; /<body[^>]*>/{print H}' "$f" > "$f.tmp" || true
  else cp "$f" "$f.tmp"; printf '\n%s\n' "$html" >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}

ensure_header(){ f="$1"
  grep -q 'header class="site"' "$f" || inject_top "$f" '<header class="site"><div class="brand"><h1>IBIZAGIRL.PICS</h1><p data-i18n="welcome">Bienvenido al paraiso para tu disfrute</p></div><div class="langbox"><select id="lang-select"><option value="es">ES</option><option value="en">EN</option><option value="fr">FR</option><option value="de">DE</option><option value="it">IT</option></select></div><nav class="navbar"><a class="btn" href="/index.html"><span class="ico ico-home"></span>Home</a><a class="btn" href="/premium.html"><span class="ico ico-prem"></span>Premium</a><a class="btn" href="/videos.html"><span class="ico ico-vid"></span>Videos</a><a class="btn" href="/subscription.html" data-i18n="subscribe"><span class="ico ico-sub"></span>Suscripciones</a><button id="buy-lifetime" class="btn" style="display:inline-flex;align-items:center;gap:.4rem"><span class="ico ico-life"></span><span>Lifetime 100€</span></button></nav></header>'
}

ensure_home_sections(){ f="index.html"; [ -f "$f" ] || return 0
  grep -q 'id="banner-rotator"' "$f" || inject_top "$f" '<div id="banner-rotator" class="section"></div>'
  grep -q 'id="home-carousel"' "$f" || inject_top "$f" '<div class="section"><section class="hbar"><h2 data-i18n="gallery">Galeria</h2></section><div id="home-carousel"></div></div>'
  grep -q 'id="home-premium-grid"' "$f" || inject_top "$f" '<div class="section"><section class="hbar"><h2 data-i18n="premium">Premium</h2><span class="counter" id="home-premium-counter"></span></section><div id="home-premium-grid"></div></div>'
  grep -q 'id="home-videos-grid"' "$f" || inject_top "$f" '<div class="section"><section class="hbar"><h2 data-i18n="videos">Videos</h2><span class="counter" id="home-videos-counter"></span></section><div id="home-videos-grid"></div></div>'
}

clean_legacy(){ f="$1"
  perl -0777 -pe 's#<script type="module">.*?(wireCardPurchases|mountAds|currentLang).*?</script>##gs' -i "$f" 2>/dev/null || true
  sed -i '' '/<script src="\/js\/i18n\.js"><\/script>/d' "$f" 2>/dev/null || true
  sed -i '' '/<script src="\/js\/ads\.js"><\/script>/d' "$f" 2>/dev/null || true
}

wire_runtime(){ f="$1"
  grep -q 'js/page-init.js' "$f" && return 0
  if grep -q '</body>' "$f"; then awk '{print} /<\/body>/{print "  <script type=\"module\" src=\"/js/page-init.js\"></script>"}' "$f" > "$f.tmp" || true
  else cp "$f" "$f.tmp"; printf '\n  <script type="module" src="/js/page-init.js"></script>\n' >> "$f.tmp"
  fi
  [ -f "$f.tmp" ] && mv "$f.tmp" "$f"
}

for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  ensure_header "$f"
  clean_legacy "$f"
  wire_runtime "$f"
done
ensure_home_sections
echo "OK layout home y header"
