#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  if ! grep -q 'id="lifetime-strip"' "$f"; then
    awk '1;/<body[^>]*>/{print "<div id=\"lifetime-strip\" style=\"background:#00457C;color:#fff;padding:.5rem 1rem;display:flex;gap:.75rem;align-items:center;justify-content:center;flex-wrap:wrap\"><strong>Lifetime</strong> — desbloquea todo y sin anuncios por <strong>100,00€</strong> <button id=\"buy-lifetime\" class=\"buy-btn\" style=\"position:static;transform:none\"><span class=\"pp-icon\"></span><span class=\"buy-label\">Comprar</span></button></div>"}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  if ! grep -q 'buyLifetime' "$f"; then
    cat >> "$f" <<'EOT'
<script type="module">
import {buyLifetime} from '/js/payments.js';
import {mountAds} from '/js/ads.js';
import {wireCardPurchases, wireSubs} from '/js/purchase-ui.js';
import {translate} from '/js/i18n.js';
window.addEventListener('DOMContentLoaded', ()=>{
  const btn=document.getElementById('buy-lifetime'); if(btn){ btn.addEventListener('click', ()=>{ const m=document.getElementById('paypal-modal'); if(m) m.classList.remove('hidden'); buyLifetime(); }); }
});
</script>
EOT
  fi
done
echo OK
