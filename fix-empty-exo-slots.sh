#!/usr/bin/env bash
set -euo pipefail

echo "== Parche anti-huecos: EXO laterales con reintentos + fallback de casa =="

# 1) JS con reintentos + fallback
cat > js/ads-exo-sides.js <<'EOF'
(function(){
  var E = window.__ENV || {};
  var Z = String(E.EXOCLICK_ZONE || '5696328'); // zone principal

  function ensureProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    s.onerror = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function serveInto(host){
    // limpia el contenedor
    host.innerHTML = '';
    host.style.background = 'transparent';

    // crea la etiqueta del proveedor
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', Z);
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    host.appendChild(ins);

    // hasta 2 reintentos si no aparece un iframe
    var tries = 0, maxTries = 2;

    function tryServe(){
      (window.AdProvider = window.AdProvider || []).push({serve:{}});
      tries++;
      setTimeout(function(){
        if (ins.querySelector('iframe')) return;              // ya hay anuncio
        if (tries <= maxTries) { tryServe(); return; }         // reintenta
        // fallback de casa
        host.innerHTML = '';
        var a = document.createElement('a');
        a.href = '/premium';
        a.className = 'house-ad';
        a.innerHTML = '<strong>Premium</strong><span>Sin anuncios · Acceso completo</span>';
        host.appendChild(a);
        console.log('[ads-exo-sides] fallback house ad en', host.id);
      }, 2500);
    }

    tryServe();
  }

  function mount(id){
    var host = document.getElementById(id);
    if(!host || host.__exoMounted) return;
    host.__exoMounted = true;
    ensureProvider(function(){ serveInto(host); });
  }

  function start(){
    mount('ad-left');
    mount('ad-right');
    console.log('IBG_ADS: EXO/AP mounted (iframes/fallback) ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
EOF

# 2) CSS del fallback (bonito y clicable) + detalles de slots
if ! grep -q 'ads-fallback-css' index.html; then
  awk 'BEGIN{
    css="  <style id=\"ads-fallback-css\">\\n"
    css=css "  .ad-side{min-width:300px}\\n"
    css=css "  #ad-left,#ad-right{width:300px;min-height:250px;margin:16px auto;display:block}\\n"
    css=css "  @media(max-width:1200px){#ad-left,#ad-right{display:none}}\\n"
    css=css "  .house-ad{display:flex;flex-direction:column;align-items:center;justify-content:center;width:300px;height:250px;border-radius:10px;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.15);background:linear-gradient(135deg,#0ea5e9,#6366f1);color:white;font-weight:600;gap:8px}\\n"
    css=css "  .house-ad strong{font-size:22px;letter-spacing:.3px}\\n"
    css=css "  .house-ad span{font-size:13px;opacity:.9}\\n"
    css=css "  </style>\\n"
  }
  /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

# 3) Garantizar los slots básicos (sin tocar Ero ni PopAds)
if ! grep -q 'id="ad-left"' index.html;  then awk 'f==0&&/<main/{print;print "  <aside id=\"ad-left\" class=\"ad-side\"></aside>";f=1;next}{print}' index.html > .tmp && mv .tmp index.html; fi
if ! grep -q 'id="ad-right"' index.html; then awk 'f==0&&/<\/main>/{print "  <aside id=\"ad-right\" class=\"ad-side\"></aside>";f=1}{print}' index.html > .tmp && mv .tmp index.html; fi

# 4) Commit + deploy
git add js/ads-exo-sides.js index.html 2>/dev/null || true
git commit -m "ads: EXO laterales con reintentos y fallback de casa; slots saneados" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
awk '/Production: https:\/\//{print "🔗 Production:", $3}' "$LOG" | tail -n1
echo "== Hecho. Si no llega créativo, verás el CTA de Premium en ese hueco. =="
