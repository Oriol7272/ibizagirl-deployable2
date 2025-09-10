#!/usr/bin/env bash
set -euo pipefail

echo "== Restaurando: 2x EXO laterales + 1x ERO (iframe) + PopAds =="

mkdir -p js ads

# --- EXO laterales (magsrv) ---
cat > js/ads-exo-sides.js <<'EOF'
(function(){
  var E = window.__ENV || {};
  var Z = String(E.EXOCLICK_ZONE || '5696328'); // fallback estable
  function ensureProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    s.onerror = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }
  function mount(id){
    var host = document.getElementById(id);
    if(!host){ return; }
    if(host.__exoMounted) return; host.__exoMounted = true;
    host.innerHTML = '';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', Z);
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    host.appendChild(ins);
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
  }
  function start(){
    ensureProvider(function(){
      mount('ad-left');
      mount('ad-right');
      console.log('IBG_ADS: EXO/AP mounted (ins) ->', Z, 'on ad-left & ad-right');
    });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
EOF

# --- ERO por iframe (ctrl) ---
cat > js/ads-ero-ctrl.js <<'EOF'
(function(){
  if(window.__IBG_ERO_MOUNTED) return; window.__IBG_ERO_MOUNTED = true;
  var E = window.__ENV || {};
  if(E.EROADVERTISING_ENABLE===0 || E.EROADVERTISING_ENABLE==='0'){ console.log('[ads-ero-ctrl] disabled'); return; }
  var SPACE = String(E.EROADVERTISING_SPACE_ID || '8182057');
  var PID   = String(E.EROADVERTISING_PID || '152716');
  var CTRL  = String(E.EROADVERTISING_CTRL || '798544');

  function mount(){
    var host = document.getElementById('ad-ero');
    if(!host){ return; }
    host.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.src = "/ads/eroframe_ctrl.html?space="+encodeURIComponent(SPACE)+"&pid="+encodeURIComponent(PID)+"&ctrl="+encodeURIComponent(CTRL);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "unsafe-url";
    // Permitimos scripts + same-origin (evita SecurityError internos). La advertencia del navegador es solo un WARNING.
    iframe.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups");
    iframe.className = "adframe";
    iframe.style.cssText = "border:0;width:300px;height:250px;display:block;margin:16px auto;";
    host.appendChild(iframe);
    console.log("[ads-ero-ctrl] mounted →", iframe.src);
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', mount); } else { mount(); }
})();
EOF

# Tester/loader para ERO en iframe (si no existe)
if [ ! -f ads/eroframe_ctrl.html ]; then
cat > ads/eroframe_ctrl.html <<'EOF'
<!doctype html><html><head><meta charset="utf-8">
<meta name="referrer" content="unsafe-url"><title>Ero ctrl</title>
<style>html,body{margin:0;padding:0}#sp{display:block;width:300px;height:250px}</style>
</head><body>
<div id="sp">&nbsp;</div>
<script>
(function(){
  function get(k){ return new URLSearchParams(location.search).get(k)||""; }
  var space = get("space") || "8182057";
  var pid   = get("pid")   || "152716";
  var ctrl  = get("ctrl")  || "798544";

  if (typeof window.eaCtrl == "undefined"){
    var queue=[], eaCtrl={add:function(x){queue.push(x)}};
    window.eaCtrl = eaCtrl;
    var js = document.createElement("script");
    js.src = "//go.easrv.cl/loadeactrl.go?pid="+encodeURIComponent(pid)
           + "&spaceid="+encodeURIComponent(space)
           + "&ctrlid="+encodeURIComponent(ctrl);
    js.async = true;
    document.head.appendChild(js);
  }
  window.eaCtrl.add({"display":"sp","sid":Number(space),"plugin":"banner"});
})();
</script>
</body></html>
EOF
fi

# --- PopAds (on user interaction + fallback 5s) ---
cat > js/ads-popads.js <<'EOF'
(function(){
  var E = window.__ENV || {};
  if(E.POPADS_ENABLED===0 || E.POPADS_ENABLED==='0'){ console.log('[ads-popads] disabled'); return; }
  var SITE = Number(E.POPADS_SITE_ID || 5226758);

  function inject(){
    if(window.__POPADS_DONE) return; window.__POPADS_DONE = true;
    var code = '/*<![CDATA[/* */\n'
      + '(function(){var x=window,u="e494ffb82839a29122608e933394c091",a=[["siteId",'+SITE+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],d=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==","d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz","d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM="],h=-1,w,t,f=function(){clearTimeout(t);h++;if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){w=x.document.createElement("script");w.type="text/javascript";w.async=!0;var n=x.document.getElementsByTagName("script")[0];w.src="https://"+atob(d[h]);w.crossOrigin="anonymous";w.onerror=f;w.onload=function(){clearTimeout(t);x[u.slice(0,16)+u.slice(0,16)]||f()};t=setTimeout(f,5E3);n.parentNode.insertBefore(w,n)}};if(!x[u]){try{Object.freeze(x[u]=a)}catch(e){}f()}})();\n'
      + '/*]]>/* */';
    var s = document.createElement('script');
    s.type='text/javascript'; s.setAttribute('data-cfasync','false'); s.text = code;
    document.documentElement.appendChild(s);
    console.log('IBG_ADS: POP mounted ->', SITE);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){
      window.addEventListener('click', inject, {once:true});
      window.addEventListener('keydown', inject, {once:true});
      setTimeout(inject, 5000);
    });
  } else {
    window.addEventListener('click', inject, {once:true});
    window.addEventListener('keydown', inject, {once:true});
    setTimeout(inject, 5000);
  }
})();
EOF

# --- Garantizar slots y <script> en index.html ---
# Inserta slots si faltan
if ! grep -q 'id="ad-left"' index.html; then
  awk 'f==0 && /<main/{print; print "  <aside id=\"ad-left\" class=\"ad-side\"></aside>"; f=1; next} {print}' index.html > .tmp && mv .tmp index.html
fi
if ! grep -q 'id="ad-right"' index.html; then
  awk 'f==0 && /<\/main>/{print "  <aside id=\"ad-right\" class=\"ad-side\"></aside>"; f=1} {print}' index.html > .tmp && mv .tmp index.html
fi
if ! grep -q 'id="ad-ero"' index.html; then
  awk 'f==0 && /<main/{print; print "  <div id=\"ad-ero\" class=\"ad-box\"></div>"; f=1; next} {print}' index.html > .tmp && mv .tmp index.html
fi

# CSS mínimo (no sticky bottom)
if ! grep -q 'ads-core-css' index.html; then
  awk 'BEGIN{
    css="  <style id=\"ads-core-css\">.ad-side{min-width:300px}.ad-box{width:300px;min-height:250px;margin:16px auto;display:block}@media(max-width:1200px){.ad-side{display:none}}</style>\n"
  }
  /<\/head>/{print css; print; next} {print}' index.html > .tmp && mv .tmp index.html
fi

# Referenciar scripts (al final de <head>)
add_script () {
  local file="$1"
  if ! grep -q "/js/$file" index.html; then
    awk -v tag="  <script defer src=\"/js/$file\"></script>" '
      /<\/head>/{ print tag; print; next } { print }' index.html > .tmp && mv .tmp index.html
    echo "➕ /js/$file"
  else
    echo "✅ /js/$file ya referenciado"
  fi
}
add_script "ads-exo-sides.js"
add_script "ads-ero-ctrl.js"
add_script "ads-popads.js"

# --- Commit & Deploy ---
git add index.html js/ads-exo-sides.js js/ads-ero-ctrl.js js/ads-popads.js ads/eroframe_ctrl.html 2>/dev/null || true
git commit -m "restore: 2x EXO sides (magsrv) + ERO iframe ctrl + PopAds on interaction; no bottom" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
awk '/Production: https:\/\//{print "🔗 Production:", $3}' "$LOG" | tail -n1
echo "== Listo. Recarga con Ctrl+F5. =="
