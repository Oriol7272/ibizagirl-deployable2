#!/usr/bin/env bash
set -euo pipefail

echo "== EXO sticky bottom (magsrv) – reparación sin srcdoc =="

# 0) Zona bottom que quieres usar (cámbiala aquí si hace falta)
BOTTOM_ZONE="5717078"

# --- A) Forzar EXOCLICK_BOTTOM_ZONE en el inline env
if [ -f js/env-inline.js ]; then
  node -e '
    const fs=require("fs");
    let z=process.env.BOTTOM_ZONE||"";
    let s=fs.readFileSync("js/env-inline.js","utf8");
    if(!/EXOCLICK_BOTTOM_ZONE/.test(s)){
      s=s.replace(/(window\.__ENV\s*=\s*\{)/, `$1 EXOCLICK_BOTTOM_ZONE:"${z}", `);
    }else{
      s=s.replace(/EXOCLICK_BOTTOM_ZONE\s*:\s*"?\d+"?/, `EXOCLICK_BOTTOM_ZONE:"${z}"`);
    }
    fs.writeFileSync("js/env-inline.js", s);
  ' BOTTOM_ZONE="$BOTTOM_ZONE"
else
  echo "⚠️  No encuentro js/env-inline.js (no pasa nada, el script hará fallback a EXOCLICK_ZONE)."
fi

# --- B) Asegurar contenedor y CSS del bottom
if ! grep -q 'id="ad-bottom"' index.html; then
  awk 'BEGIN{ins=0} /<\/body>/{ if(!ins){print "  <div id=\"ad-bottom\" class=\"ad-bottom\"></div>"; ins=1} } {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ Insertado <div id=\"ad-bottom\">"
else
  echo "✅ #ad-bottom ya existe"
fi

if ! grep -q 'id="ads-bottom-css"' index.html; then
  awk 'BEGIN{
         css="  <style id=\"ads-bottom-css\">\n"
         css=css"  #ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}\n"
         css=css"  #ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}\n"
         css=css"  body{padding-bottom:calc(90px + env(safe-area-inset-bottom))}\n"
         css=css"  @media (max-width:768px){#ad-bottom ins{min-height:60px} body{padding-bottom:calc(60px + env(safe-area-inset-bottom))}}\n"
         css=css"  </style>\n"
       }
       /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ CSS del bottom insertado"
else
  echo "✅ CSS del bottom ya está"
fi

# --- C) Ads bottom sin iframes/srcdoc (snippet oficial de Exo)
mkdir -p js
cat > js/ads-exo-bottom.js <<'JS'
(function(){
  try{
    var E = window.__ENV||{};
    var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE;
    if(!Z){ if(window.__IBG_DEBUG_ADS) console.warn('[ads-exo-bottom] sin zone id'); return; }
    if(window.__IBG_EXO_BOTTOM_MOUNTED) return;
    window.__IBG_EXO_BOTTOM_MOUNTED = true;

    // Asegura CSS por si falta
    if(!document.getElementById('ads-bottom-css')){
      var st=document.createElement('style'); st.id='ads-bottom-css';
      st.textContent='#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}@media(max-width:768px){#ad-bottom ins{min-height:60px}}';
      document.head.appendChild(st);
      document.body.style.paddingBottom='90px';
    }

    function load(cb){
      if(window.AdProvider) return cb();
      var s=document.createElement('script');
      s.src='https://a.magsrv.com/ad-provider.js';
      s.async=true;
      s.onload=function(){ cb(); };
      (document.head||document.documentElement).appendChild(s);
    }

    function mount(){
      var host=document.getElementById('ad-bottom');
      if(!host){ if(window.__IBG_DEBUG_ADS) console.warn('[ads-exo-bottom] no #ad-bottom'); return; }
      host.innerHTML='';
      var ins=document.createElement('ins');
      ins.className='eas6a97888e17';
      ins.setAttribute('data-zoneid', String(Z));
      ins.setAttribute('data-block-ad-types','0');
      ins.style.display='block';
      ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
      ins.style.width='min(100%,980px)';
      host.appendChild(ins);

      (window.AdProvider = window.AdProvider || []).push({serve:{}});
      if(window.__IBG_DEBUG_ADS) console.log('IBG_ADS: EXO bottom mounted ->', Z);

      // Reintento único si no aparece iframe
      setTimeout(function(){
        if(!host.querySelector('iframe')){
          if(window.__IBG_DEBUG_ADS) console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
          (window.AdProvider = window.AdProvider || []).push({serve:{}});
        }
      }, 4000);
    }

    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded', function(){ load(mount); });
    } else {
      load(mount);
    }
  }catch(e){
    console && console.warn && console.warn('[ads-exo-bottom] error:', e);
  }
})();
JS

# --- D) Referenciar el módulo en <head> (idempotente)
if ! grep -q '/js/ads-exo-bottom.js' index.html; then
  awk 'BEGIN{ins=0} /<\/head>/{ if(!ins){ print "  <script defer src=\"/js/ads-exo-bottom.js\"></script>"; ins=1 } } { print }' index.html > .tmp && mv .tmp index.html
  echo "➕ Referencia a /js/ads-exo-bottom.js"
else
  echo "✅ /js/ads-exo-bottom.js ya referenciado"
fi

# --- E) Commit + Deploy
git add js/ads-exo-bottom.js js/env-inline.js index.html || true
git commit -m "ads: EXO sticky bottom (sin srcdoc), env EXOCLICK_BOTTOM_ZONE=5717078" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL=$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)
echo "🔗 Production: $URL"
echo "✔ Deploy listo. Abre Home y revisa consola."
