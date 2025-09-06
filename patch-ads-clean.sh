#!/usr/bin/env bash
set -euo pipefail

echo "== Limpieza y baseline: 2x Exo (laterales, aislados), 1x Ero (slot propio), PopAds estable =="

# --- 1) Asegurar contenedores: laterales y uno dedicado a Ero
if ! grep -q 'id="ad-left"' index.html; then
  awk '/<main/{print; print "  <aside id=\"ad-left\" class=\"ad-side\"></aside>"; next}1' index.html > .tmp && mv .tmp index.html
  echo "➕ ad-left"
fi
if ! grep -q 'id="ad-right"' index.html; then
  awk '/<\/main>/{print "  <aside id=\"ad-right\" class=\"ad-side\"></aside>"; print; next}1' index.html > .tmp && mv .tmp index.html
  echo "➕ ad-right"
fi
# Slot propio para Ero, justo tras abrir <main>
if ! grep -q 'id="ad-ero"' index.html; then
  awk 'f==0 && /<main/{print; print "  <div id=\"ad-ero\" class=\"ad-box\"></div>"; f=1; next} {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ ad-ero"
fi

# --- 2) CSS para laterales + caja Ero
if ! grep -q 'ads-sides-css' index.html; then
  awk 'BEGIN{
    css="  <style id=\"ads-sides-css\">\n"
    css=css "  .ad-side{position:fixed;top:90px;z-index:9998;width:320px;min-height:250px}\n"
    css=css "  #ad-left{left:0}\n  #ad-right{right:0}\n"
    css=css "  .ad-box{display:block;width:300px;min-height:250px;margin:16px auto;}\n"
    css=css "  iframe.adframe{display:block;border:0;width:300px;height:250px;overflow:hidden;margin:0 auto}\n"
    css=css "  @media(max-width:1200px){#ad-left,#ad-right{display:none}}\n"
    css=css "  </style>\n"
  }
  /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ CSS laterales/ad-ero"
fi

# --- 3) Eliminar restos del banner inferior (si quedaron)
#   - contenedor
if grep -q 'id="ad-bottom"' index.html; then
  sed -E 's@[[:space:]]*<div id="ad-bottom"[^>]*></div>@@' -i '' index.html 2>/dev/null || true
  sed -E 's@[[:space:]]*<div id="ad-bottom"[^>]*></div>@@' -i index.html 2>/dev/null || true
  echo "🧹 quitado #ad-bottom"
fi
#   - CSS
if grep -q 'ads-bottom-css' index.html; then
  awk 'BEGIN{skip=0}
       /<style id="ads-bottom-css">/{skip=1}
       { if(!skip) print }
       /<\/style>/{ if(skip){skip=0} }' index.html > .tmp && mv .tmp index.html
  echo "🧹 quitado CSS bottom"
fi
#   - script antiguo
if grep -q 'ads-exo-bottom.js' index.html; then
  sed -E 's@[[:space:]]*<script[^>]+/js/ads-exo-bottom\.js[^>]*></script>@@' -i '' index.html 2>/dev/null || true
  sed -E 's@[[:space:]]*<script[^>]+/js/ads-exo-bottom\.js[^>]*></script>@@' -i index.html 2>/dev/null || true
  echo "🧹 quitado script ads-exo-bottom.js del HTML"
fi

mkdir -p js api/ads ads

# --- 4) Exo (laterales) dentro de IFRAME sandbox (con srcdoc) para que no saque sticky al viewport
cat > js/ads-exo-sides.js <<'EOF'
(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE;            // usa tu zona de DISPLAY si tienes; si es sticky, quedará contenido en el iframe
  if(!Z) return;
  if(window.__IBG_EXO_SIDES_MOUNTED) return;
  window.__IBG_EXO_SIDES_MOUNTED = true;

  function makeFrame(hostId){
    var host = document.getElementById(hostId);
    if(!host) return;
    host.innerHTML='';
    var html = '<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="unsafe-url"></head>'
             + '<body style="margin:0;padding:0;overflow:hidden">'
             + '<ins class="eas6a97888e17" data-zoneid="'+String(Z)+'" data-block-ad-types="0" style="display:block;width:300px;min-height:250px"></ins>'
             + '<script async src="https://a.magsrv.com/ad-provider.js"><\/script>'
             + '<script>(AdProvider=window.AdProvider||[]).push({serve:{}});<\/script>'
             + '</body></html>';
    var f = document.createElement('iframe');
    f.className = 'adframe';
    f.sandbox = 'allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation';
    f.referrerPolicy = 'unsafe-url';
    f.loading = 'lazy';
    // srcdoc confina el sticky al interior del iframe, no a la página
    f.srcdoc = html;
    host.appendChild(f);
  }

  function mount(){
    makeFrame('ad-left');
    makeFrame('ad-right');
    console.log('IBG_ADS: EXO/AP mounted (iframes) ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
EOF

# --- 5) Ero en su slot dedicado (#ad-ero) con iframe sandbox (sin same-origin para evitar errores)
cat > js/ads-ero-ctrl.js <<'EOF'
(function(){
  if(window.__IBG_ERO_MOUNTED) return;
  window.__IBG_ERO_MOUNTED = true;

  var E = (window.__ENV||{});
  if(E.EROADVERTISING_ENABLE===0 || E.EROADVERTISING_ENABLE==='0') return;

  var SPACE = E.EROADVERTISING_SPACE_ID || '8182057';
  var PID   = E.EROADVERTISING_PID      || '152716';
  var CTRL  = E.EROADVERTISING_CTRL     || '798544';

  function mount(){
    var host = document.getElementById('ad-ero') || document.body;
    host.innerHTML='';
    var iframe = document.createElement('iframe');
    iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "unsafe-url";
    iframe.setAttribute("sandbox","allow-scripts allow-popups");
    iframe.className = "adframe";
    host.appendChild(iframe);
    console.log("[ads-ero-ctrl] mounted →", iframe.src);
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', mount); }
  else { mount(); }
})();
EOF

cat > ads/eroframe_ctrl.html <<'EOF'
<!doctype html><html><head><meta charset="utf-8">
<meta name="referrer" content="unsafe-url"><title>Ero ctrl</title>
<style>html,body{margin:0;padding:0}#sp{display:block;width:300px;height:250px}</style>
</head><body>
<div id="sp">&nbsp;</div>
<script>
(function(){
  function get(k){return new URLSearchParams(location.search).get(k)||"";}
  var space=get("space")||"8182057", pid=get("pid")||"152716", ctrl=get("ctrl")||"798544";
  if(typeof window.eaCtrl=="undefined"){
    var q=[], eaCtrl={add:function(x){q.push(x)}}; window.eaCtrl=eaCtrl;
    var js=document.createElement("script");
    js.src="//go.easrv.cl/loadeactrl.go?pid="+encodeURIComponent(pid)+"&spaceid="+encodeURIComponent(space)+"&ctrlid="+encodeURIComponent(ctrl);
    js.async=true; document.head.appendChild(js);
  }
  window.eaCtrl.add({"display":"sp","sid":Number(space),"plugin":"banner"});
})();
</script>
</body></html>
EOF

# --- 6) PopAds: espera a __ENV y usa proxy /api/ads/popjs
cat > api/ads/popjs.js <<'EOF'
export const config = { runtime: 'nodejs' };
export default async function handler(req, res){
  const upstream = 'https://cdn.popads.net/pop.js';
  try{
    const r = await fetch(upstream, { headers:{'user-agent':'Mozilla/5.0','accept':'*/*'} });
    res.setHeader('content-type','application/javascript; charset=utf-8');
    if(!r.ok){
      return res.status(200).send(`// upstream non-OK ${r.status}
(function(){var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;document.head.appendChild(s);})();`);
    }
    const js = await r.text();
    res.setHeader('cache-control','public, max-age=300');
    return res.status(200).send(js);
  }catch(e){
    res.setHeader('content-type','application/javascript; charset=utf-8');
    return res.status(200).send(`// proxy error: ${String(e&&e.message||e)}
(function(){var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;document.head.appendChild(s);})();`);
  }
}
EOF

cat > js/ads-popads.js <<'EOF'
(function(){
  if(window.__IBG_POPADS_MOUNTED) return;
  window.__IBG_POPADS_MOUNTED = true;

  function start(siteId){
    var KEY='e494ffb82839a29122608e933394c091';
    var cfg=[["siteId",Number(siteId)],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]];
    try{ Object.freeze(window[KEY]=cfg); }catch(e){ window[KEY]=cfg; }

    var s=document.createElement('script');
    s.src='/api/ads/popjs'; s.async=true;
    s.onload=function(){ console.log('IBG_ADS: POP mounted ->', siteId); };
    s.onerror=function(){
      var f=document.createElement('script'); f.src='https://cdn.popads.net/pop.js'; f.async=true;
      (document.head||document.documentElement).appendChild(f);
    };
    (document.head||document.documentElement).appendChild(s);
  }

  function waitEnv(maxTries){
    var c=0; (function tick(){
      var E=window.__ENV||{};
      var SID=E.POPADS_SITE_ID;
      if(SID){ start(SID); }
      else if(c++<50){ setTimeout(tick,100); }
      else { console.log('[ads-popads] disabled or no site id'); }
    })();
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ waitEnv(50); }); }
  else { waitEnv(50); }
})();
EOF

# --- 7) Orden de scripts en <head>
add_script () {
  local file="$1"
  if ! grep -q "/js/$file" index.html; then
    awk -v tag="  <script defer src=\"/js/$file\"></script>" '/<\/head>/{print tag; print; next} {print}' index.html > .tmp && mv .tmp index.html
    echo "➕ /js/$file"
  else
    echo "✅ /js/$file ya está"
  fi
}
# Mantén env-inline.js si existe
if grep -q "/js/env-inline.js" index.html; then echo "ℹ️ env-inline.js detectado"; fi
add_script "ads-exo-sides.js"
add_script "ads-ero-ctrl.js"
add_script "ads-popads.js"

# --- 8) Commit + Deploy
git add index.html js/*.js api/ads/popjs.js ads/eroframe_ctrl.html || true
git commit -m "ads clean: Exo in sandboxed iframes (no sticky bottom), Ero in its own slot, PopAds proxy & wait env, removed bottom leftovers" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo ""
echo "== Verificación rápida =="
echo "• Consola (3 líneas):"
echo "  - IBG_ADS: EXO/AP mounted (iframes) -> <zone> on ad-left & ad-right"
echo "  - [ads-ero-ctrl] mounted → https://.../ads/eroframe_ctrl.html?..."
echo "  - IBG_ADS: POP mounted -> <siteId>   (si no, revisa POPADS_SITE_ID)"
echo "• Network:"
echo "  - a.magsrv.com/ad-provider.js (200) cargado dentro de iframes"
echo "  - /api/ads/popjs (200)"
echo "  - //go.easrv.cl/loadeactrl.go?... (200) dentro del iframe de Ero"
echo "• Visual: sin barra gris 'patrocinado' pegada al borde inferior y sin slots transparentes."
