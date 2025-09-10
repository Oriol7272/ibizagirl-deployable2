#!/usr/bin/env bash
set -euo pipefail

echo "== EXO sides: solo anuncios reales con variables existentes =="

# 1) JS puro para laterales (lee EXOCLICK_ZONES / EXOCLICK_ZONE)
mkdir -p js
cat > js/ads-exo-sides.js <<'EOF'
(function(){
  var E = window.__ENV || {};
  var list = ((E.EXOCLICK_ZONES || E.EXOCLICK_ZONE || '').toString())
              .split(/\s*,\s*/).filter(Boolean);
  if(!list.length){ console.log('[ads-exo-sides] sin EXOCLICK_ZONES/ZONE'); return; }

  function load(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true; s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }
  function pick(){ return list[(Math.random()*list.length)|0]; }

  function mount(id){
    var host=document.getElementById(id);
    if(!host || host.__mounted) return;
    host.__mounted=true;
    host.innerHTML='';
    var zone=pick();
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.width='300px';
    ins.style.height='250px';
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO/AP mounted (pure) ->', zone, 'on', id);
  }
  function start(){ load(function(){ mount('ad-left'); mount('ad-right'); }); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
EOF

# 2) Asegura contenedores y CSS mínimo (no relleno, solo tamaño)
if ! grep -q 'id="ad-left"' index.html; then
  awk 'f==0 && /<main/{print;print "  <aside id=\"ad-left\" class=\"ad-side\"></aside>";f=1;next}{print}' index.html > .tmp && mv .tmp index.html
fi
if ! grep -q 'id="ad-right"' index.html; then
  awk 'f==0 && /<\/main>/{print "  <aside id=\"ad-right\" class=\"ad-side\"></aside>";f=1}{print}' index.html > .tmp && mv .tmp index.html
fi
if ! grep -q 'ads-sides-css' index.html; then
  awk 'BEGIN{
    css="  <style id=\"ads-sides-css\">\\n"
    css=css "  #ad-left,#ad-right{width:300px;min-height:250px;margin:16px auto;display:block}\\n"
    css=css "  @media(max-width:1200px){#ad-left,#ad-right{display:none}}\\n"
    css=css "  </style>\\n"
  }
  /<\/head>/{print css; print; next}{print}' index.html > .tmp && mv .tmp index.html
fi

# 3) Asegura que cargamos el módulo en <head>
if ! grep -q '/js/ads-exo-sides.js' index.html; then
  awk ' /<\/head>/{print "  <script defer src=\"/js/ads-exo-sides.js\"></script>"; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

# 4) Commit + deploy
git add js/ads-exo-sides.js index.html 2>/dev/null || true
git commit -m "ads: EXO laterales (usa EXOCLICK_ZONES/ZONE, sin fallback)" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
awk '/Production: https:\/\//{print "🔗 Production:", $3}' "$LOG" | tail -n1
echo "OK."
