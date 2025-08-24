#!/usr/bin/env bash
set -euo pipefail

# Detecta sed BSD (macOS) o GNU
if sed --version >/dev/null 2>&1; then
  SED_INPLACE=(-i'')
else
  SED_INPLACE=(-i '')
fi

sedi() { sed "${SED_INPLACE[@]}" "$@"; }

ensure_css() {
  f="$1"
  if ! grep -q '</head>' "$f"; then
    awk '1; END{print "<link rel=\"stylesheet\" href=\"/css/paywall.css\">"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    return
  fi
  if ! grep -q 'css/paywall.css' "$f"; then
    sedi 's#</head>#  <link rel="stylesheet" href="/css/paywall.css">\n</head>#' "$f"
  fi
}

ensure_headlibs() {
  f="$1"
  if ! grep -q '/js/env.js' "$f"; then
    awk '1;/<head[^>]*>/{print "<!--HEADLIBS-->"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    awk 'NR==FNR{a[++i]=$0;next} {print} /<!--HEADLIBS-->/{for(j=1;j<=i;j++)print a[j]}' partials/head-libs.html "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    sedi 's/<!--HEADLIBS-->//' "$f"
  fi
}

ensure_navbar() {
  f="$1"
  if ! grep -q 'lang-select' "$f"; then
    awk '1;/<body[^>]*>/{print "<!--NAVBAR-->"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    awk 'NR==FNR{a[++i]=$0;next} {print} /<!--NAVBAR-->/{for(j=1;j<=i;j++)print a[j]}' partials/navbar.html "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    sedi 's/<!--NAVBAR-->//' "$f"
  fi
}

ensure_modal() {
  f="$1"
  if ! grep -q 'id="paypal-modal"' "$f"; then
    if grep -q '</body>' "$f"; then
      sedi 's#</body>#<div id="paypal-modal" class="hidden"><div id="paypal-modal-bg"><div id="paypal-modal-card"><button id="paypal-modal-close" aria-label="Close">✕</button><div id="paypal-modal-target"></div></div></div></div>\n</body>#' "$f"
    else
      awk '1; END{print "<div id=\"paypal-modal\" class=\"hidden\"><div id=\"paypal-modal-bg\"><div id=\"paypal-modal-card\"><button id=\"paypal-modal-close\" aria-label=\"Close\">✕</button><div id=\"paypal-modal-target\"></div></div></div></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    fi
  fi
}

ensure_ads() {
  f="$1"
  if ! grep -q 'class="ad-slot"' "$f"; then
    awk '1;/<body[^>]*>/{print "<div class=\"ad-slot\" data-network=\"juicy\"></div>\n<div class=\"ad-slot\" data-network=\"exo\"></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
}

wire_index() {
  f="index.html"; [ -f "$f" ] || return 0
  ensure_css "$f"; ensure_headlibs "$f"; ensure_navbar "$f"; ensure_ads "$f"; ensure_modal "$f"
  if ! grep -q 'id="home-carousel"' "$f"; then
    awk '1;/<body[^>]*>/{print "<section style=\"padding:1rem\"><h2 data-i18n=\"gallery\">Galería</h2><div id=\"home-carousel\"></div></section>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  if ! grep -q 'daily-picks.js' "$f"; then
    cat >> "$f" <<'EOT'
<script type="module">
import {getDailySets} from '/js/daily-picks.js';
import {renderCarousel} from '/js/ui-render.js';
import {translate} from '/js/i18n.js';
import {mountAds} from '/js/ads.js';
import {wireCardPurchases} from '/js/purchase-ui.js';
window.addEventListener('DOMContentLoaded', ()=>{
  const {full20}=getDailySets({forceRefresh:new URLSearchParams(location.search).has('refresh')});
  renderCarousel(document.getElementById('home-carousel'), full20);
  translate(); mountAds(); wireCardPurchases();
});
</script>
EOT
  fi
}

wire_premium() {
  f="premium.html"; [ -f "$f" ] || return 0
  ensure_css "$f"; ensure_headlibs "$f"; ensure_navbar "$f"; ensure_ads "$f"; ensure_modal "$f"
  if ! grep -q 'id="premium-grid"' "$f"; then
    awk '1;/<body[^>]*>/{print "<section style=\"padding:1rem\"><h2 data-i18n=\"premium\">Premium</h2><div id=\"premium-grid\"></div></section>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  if ! grep -q 'payments.js' "$f"; then
    cat >> "$f" <<'EOT'
<script type="module">
import {getDailySets} from '/js/daily-picks.js';
import {renderGrid} from '/js/ui-render.js';
import {PRICES} from '/js/payments.js';
import {translate} from '/js/i18n.js';
import {mountAds} from '/js/ads.js';
import {wireCardPurchases} from '/js/purchase-ui.js';
const {premium100}=getDailySets();
const items=premium100.map(x=>({...x,priceLabel:`€${(PRICES.photo/100).toFixed(2)}`}));
renderGrid(document.getElementById('premium-grid'), items, {withPrice:true, lock:true, kind:'photo'});
translate(); mountAds(); wireCardPurchases();
</script>
EOT
  fi
}

wire_videos() {
  f="videos.html"; [ -f "$f" ] || return 0
  ensure_css "$f"; ensure_headlibs "$f"; ensure_navbar "$f"; ensure_ads "$f"; ensure_modal "$f"
  if ! grep -q 'id="videos-grid"' "$f"; then
    awk '1;/<body[^>]*>/{print "<section style=\"padding:1rem\"><h2 data-i18n=\"videos\">Vídeos</h2><div id=\"videos-grid\"></div></section>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  if ! grep -q 'payments.js' "$f"; then
    cat >> "$f" <<'EOT'
<script type="module">
import {getDailySets} from '/js/daily-picks.js';
import {renderGrid} from '/js/ui-render.js';
import {PRICES} from '/js/payments.js';
import {translate} from '/js/i18n.js';
import {mountAds} from '/js/ads.js';
import {wireCardPurchases} from '/js/purchase-ui.js';
const {vids20}=getDailySets();
const items=vids20.map(x=>({...x,priceLabel:`€${(PRICES.video/100).toFixed(2)}`}));
renderGrid(document.getElementById('videos-grid'), items, {withPrice:true, lock:true, kind:'video'});
translate(); mountAds(); wireCardPurchases();
</script>
EOT
  fi
}

wire_subscription() {
  f="subscription.html"; [ -f "$f" ] || return 0
  ensure_css "$f"; ensure_headlibs "$f"; ensure_navbar "$f"; ensure_ads "$f"; ensure_modal "$f"
  if ! grep -q 'id="plans"' "$f"; then
    awk '1;/<body[^>]*>/{print "<section id=\"plans\" style=\"padding:1rem\"><h2 data-i18n=\"prices\">Precios</h2><ul><li>€14,99 / mes <button data-sub=\"monthly\">PayPal</button></li><li>€49,99 / año <button data-sub=\"yearly\">PayPal</button></li></ul></section>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  if ! grep -q 'purchase-ui.js' "$f"; then
    cat >> "$f" <<'EOT'
<script type="module">
import {wireSubs} from '/js/purchase-ui.js';
import {translate} from '/js/i18n.js';
import {mountAds} from '/js/ads.js';
window.addEventListener('DOMContentLoaded', ()=>{ translate(); mountAds(); wireSubs(); });
</script>
EOT
  fi
}

wire_index
wire_premium
wire_videos
wire_subscription
echo OK
