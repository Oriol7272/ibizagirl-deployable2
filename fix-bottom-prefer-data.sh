#!/usr/bin/env bash
set -euo pipefail
STICKY_ZONE="${STICKY_ZONE:-5717078}"   # <-- zona STICKY de ExoClick

# A) Contenedor con data-zone
if grep -q 'id="ad-bottom"' index.html; then
  if grep -q 'id="ad-bottom"[^>]*data-zone=' index.html; then
    sed -E -i.bak "s|(id=\"ad-bottom\"[^>]*data-zone=\")[^\"]*|\1${STICKY_ZONE}|g" index.html
  else
    sed -E -i.bak "s|(id=\"ad-bottom\")|\1 data-zone=\"${STICKY_ZONE}\"|g" index.html
  fi
else
  awk -v div="  <div id=\"ad-bottom\" class=\"ad-bottom\" data-zone=\"${STICKY_ZONE}\"></div>" '
    /<\/body>/{print div; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

# B) CSS mínimo si no existe
if ! grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{
    css="  <style id=\"ads-bottom-css\">#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center}#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}@media(max-width:768px){#ad-bottom ins{min-height:60px}}</style>\n"
  }
  /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

# C) Loader que prioriza data-zone -> EXOCLICK_BOTTOM_ZONE -> EXOCLICK_ZONE
mkdir -p js
cat > js/ads-exo-bottom.js <<'JS'
(function(){
  if(window.__IBG_EXO_BOTTOM_MOUNTED){return;}
  window.__IBG_EXO_BOTTOM_MOUNTED=true;

  function pickZone(){
    var host=document.getElementById('ad-bottom');
    var fromData=host && host.getAttribute('data-zone');
    var fromBottom=window.__ENV && window.__ENV.EXOCLICK_BOTTOM_ZONE;
    var fromExo=window.__ENV && window.__ENV.EXOCLICK_ZONE;
    return fromData || fromBottom || fromExo || null;
  }

  function load(cb){
    if(window.AdProvider){cb&&cb();return;}
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true;
    s.onload=function(){cb&&cb();};
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(zone){
    var host=document.getElementById('ad-bottom'); if(!host) return;
    host.innerHTML='';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', zone);
    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
        (window.AdProvider=window.AdProvider||[]).push({serve:{}});
      }
    },4000);
  }

  var t=Date.now();
  (function wait(){
    var z=pickZone();
    if(!z && Date.now()-t<2000){ return setTimeout(wait,100); }
    if(!z){ console.log('[ads-exo-bottom] sin zone -> abort'); return; }
    console.log('[ads-exo-bottom] zone chosen ->', z);
    load(function(){ mount(z); });
  })();
})();
JS

# D) Referencia del loader al final del <body>
if ! grep -q '/js/ads-exo-bottom.js' index.html; then
  awk 'BEGIN{tag="  <script defer src=\"/js/ads-exo-bottom.js\"></script>"} /<\/body>/{print tag; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

git add index.html js/ads-exo-bottom.js || true
git commit -m "fix: sticky bottom prioriza data-zone; set data-zone a ${STICKY_ZONE}" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"; vercel deploy --prod --yes | tee "$LOG"
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"
echo "Hard refresh (Cmd/Ctrl+Shift+R) y busca en consola:"
echo "  [ads-exo-bottom] zone chosen -> 5717078"
echo "  IBG_ADS: EXO bottom mounted -> 5717078"
