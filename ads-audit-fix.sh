#!/usr/bin/env bash
set -euo pipefail

echo "== IBG: auditoría y fixes de anuncios =="

# --- A) Mini-debug overlay (borde y etiqueta) para ver contenedores
mkdir -p js
cat > js/ads-debug.js <<'JS'
(function(){
  if(window.__IBG_ADS_DEBUG_APPLIED) return; window.__IBG_ADS_DEBUG_APPLIED=1;
  var css = document.createElement('style');
  css.id = 'ads-debug-css';
  css.textContent = `
    .ad-slot-debug{outline:1px dashed rgba(0,0,0,.25); position:relative}
    .ad-slot-debug::after{
      content: attr(data-name) " (" attr(data-zone) ")";
      position:absolute; top:0; left:0; font:11px/1.6 monospace;
      background:rgba(0,0,0,.55); color:#fff; padding:2px 6px; border-bottom-right-radius:6px;
    }
  `;
  document.head.appendChild(css);
  function mark(id, name, zone){
    var el = document.getElementById(id);
    if(!el) return;
    el.classList.add('ad-slot-debug');
    el.setAttribute('data-name', name||id);
    if(zone) el.setAttribute('data-zone', zone);
  }
  window.__IBG_markAd = mark;
})();
JS

# --- B) EXO bottom con passback cuando no aparece iframe
cat > js/ads-exo-bottom.js <<'JS'
(function(){
  try{
    var E = window.__ENV||{};
    var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE;
    if(!Z){ return; }
    if(window.__IBG_EXO_BOTTOM_MOUNTED) return;
    window.__IBG_EXO_BOTTOM_MOUNTED = true;

    function ensureCss(){
      if(document.getElementById('ads-bottom-css')) return;
      var st=document.createElement('style'); st.id='ads-bottom-css';
      st.textContent='#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}@media(max-width:768px){#ad-bottom ins{min-height:60px}}body{padding-bottom:90px}@media(max-width:768px){body{padding-bottom:60px}}';
      document.head.appendChild(st);
    }
    function loadProvider(cb){
      if(window.AdProvider) return cb();
      var s=document.createElement('script');
      s.src='https://a.magsrv.com/ad-provider.js'; s.async=true; s.onload=function(){cb()};
      (document.head||document.documentElement).appendChild(s);
    }
    function passback(host){
      // House ad simple
      host.innerHTML = '<a href="/" target="_top" rel="nofollow" style="display:block;width:min(100%,980px);min-height:90px;background:linear-gradient(90deg,#111,#444);color:#fff;text-decoration:none;text-align:center;line-height:90px;font:600 16px system-ui"> </a>';
    }
    function mount(){
      var host=document.getElementById('ad-bottom'); if(!host) return;
      ensureCss();
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
      // fallback si no aparece iframe
      setTimeout(function(){
        if(!host.querySelector('iframe')){ passback(host); }
      }, 4500);
      // debug mark
      if(window.__IBG_markAd) window.__IBG_markAd('ad-bottom','exo-bottom', String(Z));
    }
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded', function(){ loadProvider(mount); });
    } else { loadProvider(mount); }
  }catch(e){}
})();
JS

# --- C) EXO laterales: asegurar tamaño + passback si no hay iframe
cat > js/ads-exo-sides.js <<'JS'
(function(){
  try{
    var E = window.__ENV||{};
    var Z = E.EXOCLICK_ZONE;
    if(!Z) return;
    function ensureCss(){
      if(document.getElementById('ads-sides-css')) return;
      var st=document.createElement('style'); st.id='ads-sides-css';
      st.textContent='#ad-left,#ad-right{position:sticky;top:12px;display:block;width:300px;min-height:250px} @media(max-width:1200px){#ad-left,#ad-right{display:none}}';
      document.head.appendChild(st);
    }
    function loadProvider(cb){
      if(window.AdProvider) return cb();
      var s=document.createElement('script'); s.src='https://a.magsrv.com/ad-provider.js'; s.async=true; s.onload=function(){cb()};
      (document.head||document.documentElement).appendChild(s);
    }
    function mountOne(id){
      var host=document.getElementById(id); if(!host) return;
      host.innerHTML='';
      var ins=document.createElement('ins');
      ins.className='eas6a97888e17';
      ins.setAttribute('data-zoneid', String(Z));
      ins.setAttribute('data-block-ad-types','0');
      ins.style.display='block'; ins.style.minHeight='250px'; ins.style.width='300px';
      host.appendChild(ins);
      (window.AdProvider = window.AdProvider || []).push({serve:{}});
      setTimeout(function(){
        if(!host.querySelector('iframe')){
          host.innerHTML = '<a href="/" target="_top" rel="nofollow" style="display:block;width:300px;min-height:250px;background:#222;color:#fff;text-decoration:none;text-align:center;line-height:250px;font:600 14px system-ui"> </a>';
        }
      }, 4500);
      if(window.__IBG_markAd) window.__IBG_markAd(id,'exo-side', String(Z));
    }
    function go(){ ensureCss(); mountOne('ad-left'); mountOne('ad-right'); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ loadProvider(go); }); }
    else { loadProvider(go); }
  }catch(e){}
})();
JS

# --- D) PopAds: mantener loader; si CDN bloquea, sólo dejamos log amable
cat > js/ads-popads.js <<'JS'
(function(){
  try{
    var E = window.__ENV||{};
    var SID = E.POPADS_SITE_ID;
    if(!SID) return;
    // Loader oficial; si el CDN está bloqueado, no podemos forzarlo
    window.POPADS = window.POPADS || [];
    window.POPADS.push(["siteId", Number(SID)]);
    window.POPADS.push(["popundersPerIP","0"]);
    window.POPADS.push(["delayBetween", 0]);
    var s=document.createElement('script'); s.async=true;
    s.src='https://cdn.popads.net/pop.js';
    s.onerror=function(){ console.log('[popads] CDN bloqueado o no resolvible'); };
    (document.head||document.documentElement).appendChild(s);
  }catch(e){}
})();
JS

# --- E) Testers /ads/selftest (laterales + bottom) en una sola página
mkdir -p ads
cat > ads/selftest.html <<'HTML'
<!doctype html><meta charset="utf-8">
<title>IBG Ads Selftest</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://a.magsrv.com">
<style>
  body{font:14px/1.4 system-ui,Segoe UI,Roboto,Arial;margin:0;padding:16px 320px;background:#fafafa}
  #ad-left{position:fixed;left:8px;top:16px;width:300px;min-height:250px}
  #ad-right{position:fixed;right:8px;top:16px;width:300px;min-height:250px}
  #ad-bottom{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center}
  .card{background:#fff;border:1px solid #eee;border-radius:12px;padding:16px;margin:16px auto;max-width:980px;box-shadow:0 1px 10px rgba(0,0,0,.04)}
  h1{margin:0 0 12px}
  .muted{color:#555}
  @media(max-width:1200px){ #ad-left,#ad-right{display:none} body{padding:16px} }
</style>
<div id="ad-left"></div>
<div id="ad-right"></div>
<div class="card"><h1>IBG Ads Selftest</h1>
<p class="muted">Comprueba que se cargan <b>laterales (EXO)</b> y <b>bottom sticky (EXO)</b>. Si no aparece iframe en 4-5s, verás un passback “ </p>
</div>
<div style="height:2000px" class="card">Scroll area</div>
<div id="ad-bottom"></div>
<script src="/js/env-inline.js"></script>
<script src="/js/ads-debug.js"></script>
<script src="/js/ads-exo-sides.js" defer></script>
<script src="/js/ads-exo-bottom.js" defer></script>
HTML

# --- F) Asegurar referencias en Home (index.html)
if ! grep -q '/js/ads-debug.js' index.html; then
  awk 'BEGIN{ins=0} /<\/head>/{ if(!ins){ print "  <script defer src=\"/js/ads-debug.js\"></script>"; ins=1 } } { print }' index.html > .tmp && mv .tmp index.html
fi
if ! grep -q '/js/ads-exo-sides.js' index.html; then
  awk 'BEGIN{ins=0} /<\/head>/{ if(!ins){ print "  <script defer src=\"/js/ads-exo-sides.js\"></script>"; ins=1 } } { print }' index.html > .tmp && mv .tmp index.html
fi
if ! grep -q '/js/ads-exo-bottom.js' index.html; then
  awk 'BEGIN{ins=0} /<\/head>/{ if(!ins){ print "  <script defer src=\"/js/ads-exo-bottom.js\"></script>"; ins=1 } } { print }' index.html > .tmp && mv .tmp index.html
fi
# contenedor bottom en Home
if ! grep -q 'id="ad-bottom"' index.html; then
  awk 'BEGIN{ins=0} /<\/body>/{ if(!ins){ print "  <div id=\"ad-bottom\"></div>"; ins=1 } } { print }' index.html > .tmp && mv .tmp index.html
fi

# --- G) Commit + Deploy
git add js/*.js ads/selftest.html index.html || true
git commit -m "ads: auditoría y passbacks (EXO sides+bottom), testers y debug overlay" || true

vercel link --project beachgirl-final --yes
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG" >/dev/null
URL=$(awk '/Production: https:\/\//{print $3}' "$LOG" | tail -n1)
echo "🔗 Production: $URL"
echo "➡️  Test rápido: $URL/ads/selftest"
