#!/usr/bin/env bash
set -euo pipefail

echo "== 1) Arreglar sandbox de Ero (allow-same-origin) =="
if [ -f js/ads-ero-ctrl.js ]; then
  # Reemplaza cualquier setAttribute('sandbox', '...') para incluir allow-same-origin
  perl -0777 -pe 's@setAttribute\(\s*"sandbox"\s*,\s*"([^"]*)"\s*\)@my $v=$1; $v=~s/\s+/ /g; $v=~s/\ballow-same-origin\b//g; my $nv=($v=~/\S/?$v." ":"")."allow-same-origin"; "setAttribute(\"sandbox\",\"$nv\")"@ge' -i js/ads-ero-ctrl.js
else
  echo "⚠️  js/ads-ero-ctrl.js no existe. (Se omite este paso)"
fi

echo "== 2) PopAds robusto: esperar __ENV y montar una sola vez =="
mkdir -p js
cat > js/ads-popads.js <<'POPJS'
(function(){
  // Espera a que __ENV esté listo y tenga POPADS_ENABLE y POPADS_SITE_ID
  var tries = 0, MAX_TRIES = 40; // ~8s
  function waitEnv(){
    var E = window.__ENV || {};
    var enabled = (E.POPADS_ENABLE === 1 || E.POPADS_ENABLE === '1');
    var sid = Number(E.POPADS_SITE_ID || 0);

    if (enabled && sid > 0){
      if (window.__IBG_POPADS_MOUNTED) return;
      window.__IBG_POPADS_MOUNTED = true;

      // Inyectamos el snippet oficial (auto-resiliente) con tu siteId
      var w = '(function(){var x=window,u="e494ffb82839a29122608e933394c091",a=[["siteId",'+sid+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],d=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==","d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz","d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM="],h=-1,w,t,f=function(){clearTimeout(t);h++;if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){w=x.document.createElement("script");w.type="text/javascript";w.async=!0;var n=x.document.getElementsByTagName("script")[0];w.src="https://"+atob(d[h]);w.crossOrigin="anonymous";w.onerror=f;w.onload=function(){clearTimeout(t);x[u.slice(0,16)+u.slice(0,16)]||f()};t=setTimeout(f,5E3);n.parentNode.insertBefore(w,n)}};if(!x[u]){try{Object.freeze(x[u]=a)}catch(e){}f()}})();';
      var s = document.createElement('script');
      s.textContent = w;
      (document.documentElement||document.head).appendChild(s);

      console.log('IBG_ADS: POP mounted ->', sid);
      return;
    }

    if (++tries < MAX_TRIES){
      setTimeout(waitEnv, 200);
    } else {
      // Silencioso: no ensuciar la consola si no hay variables aún
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitEnv);
  } else {
    waitEnv();
  }
})();
POPJS

echo "== 3) Commit =="
git add js/ads-popads.js js/ads-ero-ctrl.js 2>/dev/null || true
git commit -m "ads: PopAds robusto (espera __ENV; una sola inyección) + Ero sandbox allow-same-origin" || true

echo "== 4) Deploy =="
vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo "== 5) Qué debes ver en consola (Home) =="
echo "• ads-exo-sides.js: 'mounted -> 5696328 on ad-left & ad-right'"
echo "• [ads-ero-ctrl] mounted → /ads/eroframe_ctrl.html?... (sin errores rojos)"
echo "• IBG_ADS: POP mounted -> 5226758 (sin 'disabled or no site id')"
