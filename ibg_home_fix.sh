#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Manifest para banner decorativo"
python3 - <<'PY' > decorative-images/manifest.json
import os, json
p="decorative-images"
exts=('.jpg','.jpeg','.png','.webp')
imgs=sorted([f for f in os.listdir(p) if f.lower().endswith(exts)]) if os.path.isdir(p) else []
# deja fuera el fondo por defecto si existe
imgs=[f for f in imgs if not f.lower().startswith('paradise-beach')]
print(json.dumps({"images":imgs}, ensure_ascii=False, indent=2))
PY

echo "==> 2) Utilidades JS"
mkdir -p js css
cat > js/utils.js <<'JS'
(function(){
  console.log("🧩 utils.js cargado");
  var W=window;
  // Arrays globales que vienen de content-data*.js
  W.CONTENT_PUBLIC = Array.isArray(W.CONTENT_PUBLIC)?W.CONTENT_PUBLIC:[];
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function sample(arr,n){arr=arr.slice();shuffle(arr);return arr.slice(0,Math.min(n,arr.length))}
  function norm(src,base){if(!src) return ""; if(src.includes("/")) return src; return base.replace(/\/?$/,"/")+src}
  function $ (s,root){return (root||document).querySelector(s)}
  function $$ (s,root){return Array.from((root||document).querySelectorAll(s))}
  W.IBG_UTIL={shuffle:shuffle,sample:sample,norm:norm,$:$,$$:$$};
})();
JS

echo "==> 3) JS de Home (banner + carrusel 30 + grid 40)"
cat > js/home.min.js <<'JS'
(function(){
  console.log("🏠 home.min.js cargado");
  var U=window.IBG_UTIL||{}, $=U.$;
  function startRotation(list){
    var bannerImg=$('.banner .img'); if(!bannerImg) return;
    if(!list || !list.length){
      bannerImg.style.backgroundImage='url("decorative-images/paradise-beach.png")';
      bannerImg.style.opacity=.28; return;
    }
    var i=0; function rot(){
      bannerImg.style.opacity=0;
      var src=list[i%list.length];
      setTimeout(function(){
        bannerImg.style.backgroundImage='url("'+src+'")';
        bannerImg.style.opacity=.28;
      },220); i++;
    }
    rot(); setInterval(rot,4000);
  }
  document.addEventListener('DOMContentLoaded',function(){
    console.log("🌅 DOM listo; construyendo Home…");
    // Rotación banner
    fetch('decorative-images/manifest.json').then(r=>r.ok?r.json():null).then(j=>{
      var arr=j&&Array.isArray(j.images)?j.images:[]; var list=arr.map(n=>'decorative-images/'+n);
      startRotation(list.length?list:['decorative-images/paradise-beach.png']);
    }).catch(()=>startRotation(['decorative-images/paradise-beach.png']));

    // Carrusel 30
    var pub=window.CONTENT_PUBLIC||[];
    if(!Array.isArray(pub) || pub.length===0){
      console.warn("⚠️ CONTENT_PUBLIC vacío; ¿carga content-data2.js?");
      return;
    }
    var c30=(U.sample(pub,30)).map(x=>U.norm(x,'full'));
    var car=$('#carousel');
    if(car){
      c30.forEach(src=>{
        var img=new Image(); img.loading="lazy"; img.decoding="async"; img.src=src; car.appendChild(img);
      });
      console.log("🎠 Carrusel creado con", c30.length, "imágenes");
    }
    // Grid 40 sin repetir
    var used=new Set(c30.map(String));
    var rest=pub.map(x=>U.norm(x,'full')).filter(x=>!used.has(String(x)));
    var g40=U.sample(rest,40);
    var grid=$('#grid40');
    if(grid){
      g40.forEach(src=>{
        var d=document.createElement('div'); d.className='thumb';
        var img=new Image(); img.loading="lazy"; img.decoding="async"; img.src=src;
        d.appendChild(img); grid.appendChild(d);
      });
      console.log("🖼️ Galería creada con", g40.length, "imágenes");
    }
  });
})();
JS

echo "==> 4) CSS: fuente + pequeños ajustes (no pisa si ya existen reglas)"
# añade la fuente decorativa si está en la carpeta
if ! grep -q "font-family: 'Sexy Beachy'" css/ibg.css 2>/dev/null; then
cat >> css/ibg.css <<'CSS'

/* === Fuente decorativa del banner, si existe === */
@font-face{
  font-family: 'Sexy Beachy';
  src: url('/decorative-images/Sexy Beachy.ttf') format('truetype'),
       url('/decorative-images/Sexy Beachy.otf') format('opentype');
  font-weight: normal; font-style: normal; font-display: swap;
}
.banner h1{ font-family:'Sexy Beachy', system-ui, sans-serif; letter-spacing:.5px; }
.banner p{ font-style: italic; opacity:.9 }
#carousel img{height:140px;width:auto;border-radius:12px;background:#000;display:block}
#grid40 .thumb{aspect-ratio:1/1}
CSS
fi

echo "==> 5) Asegurar index.html con las secciones"
cat > index.html <<'HTML'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta http-equiv="Cache-Control" content="no-store, must-revalidate">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IBIZAGIRL.PICS — vZERO</title><!-- IBG-FP: vZERO -->
<link rel="stylesheet" href="css/ibg.css">
<script defer src="content-data2.js"></script>
<script defer src="js/utils.js"></script>
<script defer src="js/home.min.js"></script>
</head><body>
<div class="nav"><div class="row container">
  <a href="index.html" class="active">Home</a>
  <a href="premium.html">Premium</a>
  <a href="videos.html">Vídeos</a>
  <a href="subscription.html">Subscriptions</a>
</div></div>

<div class="banner">
  <div class="img"></div>
  <div class="title"><h1>ibizagirl.pics</h1><p>bienvenidos al paraiso</p></div>
</div>

<div class="container layout" style="margin-top:12px">
  <div class="ad card section" id="ad-left">AD</div>
  <div>
    <div class="card section">
      <h3 style="margin:0 0 10px">Carrusel (30)</h3>
      <div id="carousel" class="carousel"></div>
    </div>
    <div class="card section" style="margin-top:12px">
      <h3 style="margin:0 0 10px">Galería (40)</h3>
      <div id="grid40" class="grid"></div>
    </div>
  </div>
  <div class="ad card section" id="ad-right">AD</div>
</div>

<div class="footer container">© IbizaGirl.pics</div>
</body></html>
HTML

echo "==> 6) Commit + Deploy"
git add -A
git commit -m "Home: banner rotatorio + carrusel 30 + galería 40; utils/home.js; manifest decorativo; fuente"
git push

# Deploy producción y fijar alias del proyecto
vercel switch --scope "oriols-projects-ed6b9b04" >/dev/null || true
vercel link --project "ibizagirl-deployable2" --yes >/dev/null || true
DEPLOY_URL=$(vercel --prod --yes 2>&1 | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1)
[ -n "${DEPLOY_URL:-}" ] || DEPLOY_URL="https://ibizagirl-deployable2.vercel.app"
vercel alias set "$DEPLOY_URL" "ibizagirl-deployable2.vercel.app" >/dev/null || true

echo "==> 7) Hecho. Abre la consola del navegador: verás logs 🧩/🏠/🎠/🖼️ si todo cargó."
