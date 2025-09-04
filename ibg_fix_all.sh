#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

command -v vercel >/dev/null || { echo "❌ Falta Vercel CLI (npm i -g vercel)"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ No estás en un repo git"; exit 1; }

add_if_missing () {
  local path="$1"; shift
  local content="${*:-}"
  if [[ ! -f "$path" ]]; then
    mkdir -p "$(dirname "$path")"
    printf "%s\n" "$content" > "$path"
    echo "🆕 Creado $path"
  fi
}

echo "== Archivos base =="
add_if_missing vercel.json $'\
{ "cleanUrls": true, "trailingSlash": false,\n\
  "headers":[{ "source":"/(fingerprint\\\\.txt|js/sw-kill-once\\\\.js)", "headers":[{"key":"Cache-Control","value":"no-store"}]}],\n\
  "routes":[ { "src":"^/$", "dest":"/index.html" }, { "src":"^/(index\\\\.html)?$", "dest":"/index.html" } ] }'

add_if_missing 404.html $'<!doctype html>\n<meta charset="utf-8">\n<title>Not Found — ibizagirl.pics</title>\n<meta http-equiv="refresh" content="0; url=/index.html">\n<p>Redirigiendo a <a href="/index.html">Home</a>…</p>'
add_if_missing favicon.ico ""
add_if_missing fingerprint.txt "$(date -u +'%Y-%m-%dT%H:%M:%SZ') | $(git rev-parse --short HEAD || echo LOCAL) | IBG-FP: vZERO"

# SW killer (1 vez)
add_if_missing js/sw-kill-once.js $'\
(function(){try{if(localStorage.getItem("IBG_SW_KILLED"))return;if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()});if(window.caches){caches.keys().then(function(keys){keys.forEach(function(k){caches.delete(k)})})}setTimeout(function(){try{localStorage.setItem("IBG_SW_KILLED","1")}catch(e){};location.reload()},50)})}}catch(e){}})();'

# Home v4
add_if_missing js/home.v4.js $'\
(function(){function p(i){if(!i)return null;if(typeof i==="string")return i.startsWith("/")?i:"/"+i;if(typeof i==="object"){const c=[i.url,i.src,i.path,i.file,i.href];for(const x of c)if(x)return x.startsWith("/")?x:"/"+x}return null}function pool(){const k=[(typeof CONTENT_PUBLIC!=="undefined"&&CONTENT_PUBLIC),(window.IBG&&(IBG.public||IBG.PUBLIC)),(window.CONTENT&&(CONTENT.public||CONTENT.PUBLIC)),(window.__IBG&&(__IBG.PUBLIC||__IBG.public)),(window.PUBLIC_CONTENT)].filter(Boolean);const a=k[0]||[];const out=[];for(const it of a){const s=p(it);if(s&&/\\/full\\//i.test(s))out.push(s)}return out}function pick(a,n){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b.slice(0,Math.min(n,b.length))}function el(t,c){const e=document.createElement(t);if(c)e.className=c;return e}function banner(){const ban=document.getElementById("banner");if(!ban)return;const box=ban.querySelector(".img");fetch("decorative-images/manifest.json",{cache:"no-store"}).then(r=>r.ok?r.json():{images:[]}).then(j=>{const imgs=(j&&j.images&&j.images.length?j.images:[]).map(x=>"decorative-images/"+x);let i=0;function setBg(){const src=imgs.length?imgs[i%imgs.length]:"decorative-images/paradise-beach.jpg";box.style.backgroundImage=`url("${src}")`;i++}setBg();if(imgs.length>1)setInterval(setBg,4000)}).catch(()=>{box.style.backgroundImage=\'url("decorative-images/paradise-beach.jpg")\'})}function ui(){const all=pool();if(!all.length){console.warn("⚠️ sin CONTENT_PUBLIC");return}const car=document.getElementById("carousel30");const grid=document.getElementById("grid40");const a30=pick(all,30);const a40=pick(all.filter(x=>!a30.includes(x)),40);const track=el("div","track");for(const src of a30){const img=el("img");img.loading="lazy";img.src=src;img.alt="photo";track.appendChild(img)}car.appendChild(track);let x=0;setInterval(()=>{const w=track.scrollWidth-car.clientWidth;x=w>0?(x+1)%(w+1):0;car.scrollTo(x,0)},30);for(const src of a40){const a=el("a","grid-item");a.href=src;a.target="_blank";const img=el("img");img.loading="lazy";img.src=src;img.alt="photo";a.appendChild(img);grid.appendChild(a)}}function ready(f){document.readyState!=="loading"?f():document.addEventListener("DOMContentLoaded",f)}ready(function(){banner();ui();if(window.IBG_ADS&&typeof IBG_ADS.init==="function"){IBG_ADS.init()}})})();'

# Manifest decorativo si falta
mkdir -p decorative-images
[[ -f decorative-images/manifest.json ]] || python3 - <<'PY' > decorative-images/manifest.json
import os, json
p="decorative-images"; exts=('.jpg','.jpeg','.png','.webp')
imgs=sorted([f for f in os.listdir(p) if f.lower().endswith(exts)]) if os.path.isdir(p) else []
imgs=[f for f in imgs if not f.lower().startswith('paradise-beach')]
print(json.dumps({"images":imgs}, ensure_ascii=False, indent=2))
PY

echo "== Limpieza HTML y bloque canónico (sin awk) =="
remove_dupes () { # elimina scripts viejos/duplicados
  local f="$1"; [[ -f "$f" ]] || return 0
  perl -0777 -i -pe '
    s#\s*<script[^>]*src="[^"]*sw-kill-once\.js"[^>]*></script>##igs;
    s#\s*<script[^>]*src="content-data1\.js"[^>]*></script>##igs;
    s#\s*<script[^>]*src="content-data2\.js"[^>]*></script>##igs;
    s#\s*<script[^>]*src="js/utils(?:\.v3)?\.js[^"]*"[^>]*></script>##igs;
    s#\s*<script[^>]*src="js/ads\.min\.js"[^>]*></script>##igs;
    s#\s*<script[^>]*src="js/home\.v4\.js"[^>]*></script>##igs;
    s#\s*<script[^>]*src="content-data\.js"[^>]*></script>##igs;
    s/-->>/-->/g;
  ' "$f"
}
make_block_file () { # crea snippet dinámico
  local file="$1"; : > "$file"
  {
    echo '    <!-- SCRIPTS CANÓNICOS -->'
    echo '    <script src="js/sw-kill-once.js"></script>'
    echo '    <script src="content-data1.js"></script>'
    echo '    <script src="content-data2.js"></script>'
    echo '    <script src="js/utils.js"></script>'
    [[ -f js/ads.min.js ]] && echo '    <script src="js/ads.min.js"></script>'
    echo '    <script src="js/home.v4.js" defer></script>'
  } >> "$file"
}
insert_block () { # inserta 1 vez antes de </body> con Perl leyendo fichero
  local f="$1"; local blk="$2"
  [[ -f "$f" ]] || return 0
  grep -qi '</body>' "$f" || { echo "⚠️  $f no tiene </body>; me lo salto"; return 0; }
  grep -Fq 'js/home.v4.js' "$f" && return 0
  perl -0777 -i -pe '
    BEGIN{
      my $path = $ENV{IBG_BLK_PATH} // "_snips/_block.html";
      local $/; open my $fh,"<",$path or die $!;
      our $blk = <$fh>;
    }
    if (index($_,"js/home.v4.js") < 0) {
      s{</body>}{\n$blk\n</body>}i;
    }
  ' "$f"
}

mkdir -p _snips
make_block_file "_snips/_block.html"
export IBG_BLK_PATH="_snips/_block.html"

for f in index.html premium.html videos.html subscription.html; do
  [[ -f "$f" ]] || continue
  remove_dupes "$f"
  insert_block "$f" "_snips/_block.html"
done

echo "== Sanidad del repo =="
if grep -RIn --include='*.html' 'content-data.js' .; then
  echo "❌ Quedan referencias a content-data.js en HTML. Cámbialas a content-data1.js + content-data2.js."
  exit 2
fi
echo "✅ HTML sin content-data.js legacy."

echo "== Commit + push =="
git add -A || true
git diff --cached --quiet || git commit -m "FIX ALL: routing/404/favicon/fingerprint, SW killer once, home.v4, orden scripts, limpieza legacy"
git push || true

echo "== Deploy + alias =="
vercel switch --scope "$TEAM" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true
OUT="$(vercel --prod --yes 2>&1 || true)"
echo "$OUT" > _vercel_out.txt
DEPLOY_URL="$(printf "%s\n" "$OUT" | grep -Eo 'https://[^[:space:]]+\.vercel\.app' | tail -n1 || true)"
[[ -n "${DEPLOY_URL:-}" ]] || DEPLOY_URL="https://$PROJECT.vercel.app"
echo "Deploy => $DEPLOY_URL"

vercel alias set "$DEPLOY_URL" "$PROJECT.vercel.app" >/dev/null || true
if vercel alias ls | grep -q "$DOMAIN"; then printf "y\n" | vercel alias rm "$DOMAIN" >/dev/null || true; fi
vercel alias set "$DEPLOY_URL" "$DOMAIN" >/dev/null || true

echo "== Verificación =="
code () { curl -fsSIL "$1" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}'; }
C_DEPLOY=$(code "$DEPLOY_URL/")
C_PROJ=$(code "https://$PROJECT.vercel.app/")
C_DOMN=$(code "https://$DOMAIN/" || true)
printf "DEPLOY                 -> %s\n" "$C_DEPLOY"
printf "%-22s -> %s\n" "$PROJECT.vercel.app" "$C_PROJ"
printf "%-22s -> %s\n" "$DOMAIN" "${C_DOMN:-<sin-resp>}"

echo "Fingerprint:"
for h in "$DEPLOY_URL" "https://$PROJECT.vercel.app" "https://$DOMAIN"; do
  printf "  %-32s -> " "$h"
  curl -fsSL "$h/fingerprint.txt?ts=$(date +%s)" 2>/dev/null | sed -e 's/[^[:print:]]//g' -e 's/$/ /'
  echo
done

if [[ "${C_DOMN:-}" == "401" ]]; then
  echo
  echo "⚠️  $DOMAIN devuelve 401 (Password Protection en producción)."
  # Intento leer token de producción (si existe)
  vercel env pull .env.production --environment=production >/dev/null || true
  TOKEN="$(grep -E '^VERCEL_PROTECTION_BYPASS=' .env.production | sed 's/^[^=]*=//')" || true
  if [[ -n "${TOKEN:-}" ]]; then
    echo "👉 En el navegador (DevTools → Console) pega y recarga:"
    echo "document.cookie = 'vercel-protection-bypass=$TOKEN; Path=/; Max-Age=31536000; Secure; SameSite=None'; location.reload();"
  else
    echo "No pude leer VERCEL_PROTECTION_BYPASS (production)."
    echo "Desactívalo en Dashboard → Project → Settings → Security → Password Protection (Production) → OFF."
  fi
fi

echo "✅ DONE"
