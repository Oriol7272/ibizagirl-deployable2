#!/usr/bin/env bash
set -euo pipefail

echo "== Baseline: 2x Exo (lateral) + 1x Ero + PopAds con proxy =="

# --- A) Contenedores laterales (id=ad-left/ad-right)
if ! grep -q 'id="ad-left"' index.html; then
  awk '/<main/{print; print "  <aside id=\"ad-left\" class=\"ad-side\"></aside>"; next}1' index.html > .tmp && mv .tmp index.html
  echo "➕ Insertado <aside id=\"ad-left\">"
fi
if ! grep -q 'id="ad-right"' index.html; then
  awk '/<\/main>/{print "  <aside id=\"ad-right\" class=\"ad-side\"></aside>"; print; next}1' index.html > .tmp && mv .tmp index.html
  echo "➕ Insertado <aside id=\"ad-right\">"
fi

# --- B) CSS mínimo para laterales (si no existe)
if ! grep -q 'ads-sides-css' index.html; then
  awk 'BEGIN{
     css="  <style id=\"ads-sides-css\">\n"
     css=css "  .ad-side{position:fixed;top:90px;width:320px;min-height:250px;z-index:9998}\n"
     css=css "  #ad-left{left:0}\n  #ad-right{right:0}\n"
     css=css "  @media(max-width:1200px){#ad-left,#ad-right{display:none}}\n"
     css=css "  </style>\n"
   }
   /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html
  echo "➕ CSS lateral"
fi

mkdir -p js api/ads ads

# --- C) EXO laterales (magsrv) robusto, una sola llamada
cat > js/ads-exo-sides.js <<'EOF'
(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE;
  if(!Z){ return; }
  if(window.__IBG_EXO_SIDES_MOUNTED){ return; }
  window.__IBG_EXO_SIDES_MOUNTED = true;

  function loadProv(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function place(hostId){
    var host = document.getElementById(hostId);
    if(!host) return;
    host.innerHTML='';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types', '0');
    ins.style.display='block';
    ins.style.minHeight='250px';
    ins.style.width='300px';
    host.appendChild(ins);
  }

  function mount(){
    place('ad-left');
    place('ad-right');
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO/AP mounted ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProv(mount); });
  } else {
    loadProv(mount);
  }
})();
EOF

# --- D) ERO por iframe (como lo tenías), sandbox seguro y sin errores de sessionStorage
cat > js/ads-ero-ctrl.js <<'EOF'
(function(){
  var E = (window.__ENV||{});
  if(E.EROADVERTISING_ENABLE === 0 || E.EROADVERTISING_ENABLE === '0'){ return; }
  var SPACE = E.EROADVERTISING_SPACE_ID || '8182057';
  var PID   = E.EROADVERTISING_PID      || '152716';
  var CTRL  = E.EROADVERTISING_CTRL     || '798544';

  // Montamos 1 iframe dentro de #ad-right si existe; si no, al final del body
  function mount(){
    var host = document.getElementById('ad-right') || document.body;
    var iframe = document.createElement('iframe');
    iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "unsafe-url";
    // Para evitar SecurityError de sessionStorage, no ponemos allow-same-origin
    iframe.setAttribute("sandbox","allow-scripts allow-popups");
    iframe.style.cssText = "border:0; width:300px; height:250px; display:block; margin:16px auto;";
    host.appendChild(iframe);
    console.log("[ads-ero-ctrl] mounted →", iframe.src);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
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

# --- E) PopAds: proxy del pop.js para evitar ERR_NAME_NOT_RESOLVED
cat > api/ads/popjs.js <<'EOF'
export const config = { runtime: 'nodejs' };

export default async function handler(req, res){
  const upstream = 'https://cdn.popads.net/pop.js';
  try{
    const r = await fetch(upstream, {
      headers:{
        'user-agent':'Mozilla/5.0',
        'accept':'*/*'
      }
    });
    if(!r.ok){
      res.setHeader('content-type','application/javascript; charset=utf-8');
      return res.status(200).send(`// upstream non-OK ${r.status}
(function(){var s=document.createElement('script');s.src=${JSON.stringify(upstream)};s.async=true;document.head.appendChild(s);})();`);
    }
    const js = await r.text();
    res.setHeader('content-type','application/javascript; charset=utf-8');
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
  var E = (window.__ENV||{});
  var SITE = Number(E.POPADS_SITE_ID||0);
  if(!SITE){ console.log('[ads-popads] disabled or no site id'); return; }

  var KEY = 'e494ffb82839a29122608e933394c091';
  var cfg = [
    ["siteId", SITE],
    ["minBid",0],
    ["popundersPerIP","0"],
    ["delayBetween",0],
    ["default",false],
    ["defaultPerDay",0],
    ["topmostLayer","auto"]
  ];
  try{ Object.freeze(window[KEY]=cfg); }catch(e){ window[KEY]=cfg; }

  function inject(src, onok){
    var s=document.createElement('script');
    s.src=src; s.async=true;
    s.onload=function(){ onok&&onok(); };
    s.onerror=function(){
      // Fallback directo al CDN original
      var s2=document.createElement('script');
      s2.src='https://cdn.popads.net/pop.js';
      s2.async=true;
      (document.head||document.documentElement).appendChild(s2);
    };
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(){
    inject('/api/ads/popjs', function(){
      console.log('IBG_ADS: POP mounted ->', SITE);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
EOF

# --- F) Asegurar orden de scripts (env primero)
ensure_script () {
  local file="$1"
  if ! grep -q "/js/$file" index.html; then
    awk -v tag="  <script defer src=\"/js/$file\"></script>" '
      /<\/head>/{print tag; print; next} {print}' index.html > .tmp && mv .tmp index.html
    echo "➕ Añadido /js/$file"
  else
    echo "✅ /js/$file ya referenciado"
  fi
}

# Colocar env primero si existe
if grep -q "/js/env-inline.js" index.html; then
  echo "ℹ️ Manteniendo /js/env-inline.js primero"
else
  echo "ℹ️ (opcional) Si tienes env-inline.js, ponlo antes que el resto."
fi
ensure_script "ads-exo-sides.js"
ensure_script "ads-ero-ctrl.js"
ensure_script "ads-popads.js"

echo "== Commit & Deploy =="
git add index.html js/ads-*.js api/ads/popjs.js ads/eroframe_ctrl.html || true
git commit -m "baseline ads: EXO sides + ERO iframe + PopAds via proxy; clean logs/order" || true

vercel link --project ibizagirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL="$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)"
echo "🔗 Production: $URL"

echo ""
echo "== Checklist en el navegador =="
echo "1) window.__ENV debe tener: EXOCLICK_ZONE=5696328 (o el tuyo), POPADS_SITE_ID=5226758,"
echo "   EROADVERTISING_ENABLE=1, EROADVERTISING_SPACE_ID=8182057, PID=152716, CTRL=798544."
echo "2) Consola:"
echo "   - 'IBG_ADS: EXO/AP mounted -> ... on ad-left & ad-right'"
echo "   - '[ads-ero-ctrl] mounted → https://.../ads/eroframe_ctrl.html?...'"
echo "   - 'IBG_ADS: POP mounted -> 5226758'"
echo "3) Network:"
echo "   - Carga de https://a.magsrv.com/ad-provider.js (200)."
echo "   - Carga de /api/ads/popjs (200) y luego sin errores rojos."
echo "   - Carga de //go.easrv.cl/loadeactrl.go?... (200) dentro del iframe."
echo "4) Visual: ver creatividades en left/right y el slot de Ero mostrando banner."
