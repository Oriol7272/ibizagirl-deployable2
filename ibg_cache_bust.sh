#!/usr/bin/env bash
set -euo pipefail

echo "==> 0) Generar manifest para banner"
python3 - <<'PY' > decorative-images/manifest.json
import os, json
p="decorative-images"; exts=('.jpg','.jpeg','.png','.webp')
imgs=sorted([f for f in os.listdir(p) if f.lower().endswith(exts)]) if os.path.isdir(p) else []
imgs=[f for f in imgs if not f.lower().startswith('paradise-beach')]
print(json.dumps({"images":imgs}, ensure_ascii=False, indent=2))
PY

echo "==> 1) Escribir utils v3 (deep-scan)"
mkdir -p js
cat > js/utils.v3.js <<'JS'
(function(){
  console.log("🧩 utils.js (deep-scan v3) cargado");
  var W=window;
  function isImg(s){ return typeof s==='string' && /\.(jpe?g|png|webp|gif)$/i.test(s); }
  function autodetectPublicDeep(){
    if (Array.isArray(W.CONTENT_PUBLIC) && W.CONTENT_PUBLIC.length) return true;
    var seen=new Set(), best=null; const MAX=5000;
    function score(arr){
      if (!Array.isArray(arr) || arr.length<20) return -1;
      var L=Math.min(arr.length,150), img=0, full=0, nos=0;
      for (var i=0;i<L;i++){ var s=arr[i]; if(isImg(s)) img++; if(/^full\//i.test(s)) full++; if(typeof s==='string' && s.indexOf('/')===-1) nos++; }
      var ratio=img/L; if (ratio<0.7) return -1;
      return img + full*3 + nos + arr.length*0.02;
    }
    function walk(o, path, d){
      if(!o||d>4||seen.has(o)) return; seen.add(o); if(seen.size>MAX) return;
      if(Array.isArray(o)){ var sc=score(o); if(sc>(best?best.sc:-1)) best={sc:sc,arr:o,path:path}; return; }
      var t=Object.prototype.toString.call(o); if(typeof o==='function'||/Window|Document|Element|HTML/.test(t)) return;
      var ks; try{ ks=Object.keys(o); }catch(e){ return; }
      for (var i=0;i<ks.length;i++){ var k=ks[i], v; try{ v=o[k]; }catch(e){ continue; }
        if(Array.isArray(v)){ var sc=score(v); if(sc>(best?best.sc:-1)) best={sc:sc,arr:v,path:path+"."+k}; }
        else if(v && typeof v==='object'){ walk(v, path+"."+k, d+1); }
      }
    }
    try{ walk(W, "window", 0); }catch(e){}
    if(best&&best.arr){ W.CONTENT_PUBLIC=best.arr; console.log("🔎 CONTENT_PUBLIC autodetectado en",best.path,"("+best.arr.length+" items)"); return true; }
    console.warn("⚠️ No se pudo autodetectar CONTENT_PUBLIC"); W.CONTENT_PUBLIC=W.CONTENT_PUBLIC||[]; return false;
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src}
  function $ (s,r){return (r||document).querySelector(s)}
  function $$ (s,r){return Array.from((r||document).querySelectorAll(s))}
  if (!Array.isArray(W.CONTENT_PUBLIC) || !W.CONTENT_PUBLIC.length){ autodetectPublicDeep(); }
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$,autodetectPublicDeep:autodetectPublicDeep};
})();
JS

echo "==> 2) Escribir home v3 (espera y reintenta)"
cat > js/home.v3.js <<'JS'
(function(){
  console.log("🏠 home.v3.js cargado");
  var U=window.IBG_UTIL||{}, $=U.$;
  function startRotation(list){
    var el=document.querySelector('.banner .img'); if(!el) return;
    if(!list||!list.length){ el.style.backgroundImage='url("decorative-images/paradise-beach.png")'; el.style.opacity=.28; return; }
    var i=0; function rot(){ el.style.opacity=0; var src=list[i%list.length]; setTimeout(function(){ el.style.backgroundImage='url("'+src+'")'; el.style.opacity=.28; },220); i++; }
    rot(); setInterval(rot,4000);
  }
  function build(){
    var pub=window.CONTENT_PUBLIC||[]; if(!Array.isArray(pub)||pub.length===0){ return false; }
    var c30=(U.sample(pub,30)).map(function(x){return U.norm(x,'full')});
    var car=document.getElementById('carousel'); if(car){ car.innerHTML=""; c30.forEach(function(src){ var img=new Image(); img.loading="lazy"; img.decoding="async"; img.src=src; car.appendChild(img); }); console.log("🎠 Carrusel con",c30.length); }
    var used=new Set(c30.map(String)), rest=pub.map(function(x){return U.norm(x,'full')}).filter(function(x){return !used.has(String(x))});
    var g40=U.sample(rest,40); var grid=document.getElementById('grid40'); if(grid){ grid.innerHTML=""; g40.forEach(function(src){ var d=document.createElement('div'); d.className='thumb'; var img=new Image(); img.loading="lazy"; img.decoding="async"; img.src=src; d.appendChild(img); grid.appendChild(d);}); console.log("🖼️ Galería con",g40.length); }
    return true;
  }
  document.addEventListener('DOMContentLoaded',function(){
    console.log("🌅 DOM listo; Home v3");
    fetch('decorative-images/manifest.json').then(function(r){return r.ok?r.json():null}).then(function(j){ var a=j&&Array.isArray(j.images)?j.images:[]; var list=a.map(function(n){return 'decorative-images/'+n}); startRotation(list.length?list:['decorative-images/paradise-beach.png']); }).catch(function(){ startRotation(['decorative-images/paradise-beach.png']); });
    var tries=0; (function loop(){ if((!Array.isArray(window.CONTENT_PUBLIC)||!window.CONTENT_PUBLIC.length)&&U.autodetectPublicDeep){ U.autodetectPublicDeep(); }
      if(build()) return; if(++tries<60) return setTimeout(loop,100); console.warn("⏱️ Timeout esperando CONTENT_PUBLIC");
    })();
  });
})();
JS

echo "==> 3) Killer SW inline + cache-busting en index.html"
perl -0777 -i -pe 's#<script defer src="content-data2\.js"></script>#<script defer src="content-data1.js"></script>\n<script defer src="content-data2.js"></script>#' index.html || true
perl -0777 -i -pe 's#js/utils\.js#js/utils.v3.js?v='"$(date +%s)"'#' index.html || true
perl -0777 -i -pe 's#js/home\.min\.js#js/home.v3.js?v='"$(date +%s)"'#' index.html || true

# Inserta un killer SW inline (desregistra service workers y limpia caches)
perl -0777 -i -pe '
  s#</body>#<script>(function(){if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();}); if(window.caches){caches.keys().then(function(keys){keys.forEach(function(k){caches.delete(k);});});} setTimeout(function(){ try{localStorage.clear(); sessionStorage.clear();}catch(e){}; location.reload();}, 100);}}})();</script></body>#;
' index.html

echo "==> 4) Commit + push + deploy"
git add -A
git commit -m "Cache-busting: utils.v3 + home.v3 + content-data1 antes que 2 + killer SW inline"
git push

vercel switch --scope "oriols-projects-ed6b9b04" >/dev/null || true
vercel link --project "ibizagirl-deployable2" --yes >/dev/null || true
DEPLOY_URL=$(vercel --prod --yes 2>&1 | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1)
[ -n "${DEPLOY_URL:-}" ] || DEPLOY_URL="https://ibizagirl-deployable2.vercel.app"
vercel alias set "$DEPLOY_URL" "ibizagirl-deployable2.vercel.app" >/dev/null || true

echo "==> 5) Verifica en una ventana normal (no incognito): el propio killer SW limpia y recarga una vez."
