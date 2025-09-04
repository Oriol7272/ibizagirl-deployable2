#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

command -v vercel >/dev/null || { echo "❌ Falta Vercel CLI: npm i -g vercel"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ No estás en un repo git"; exit 1; }

echo "== 0) Limpieza de ruido =="
# No queremos temporales ni .env en el repo
rm -f index.html.__tmp__ _vercel_out.txt _vercel_out_latest.txt _vercel_build.txt _vercel_deploy.txt || true
printf '%s\n' '.env*' '_vercel_*' '*.tmp' '_snips/' >> .gitignore 2>/dev/null || true
git rm -f --cached .env* _vercel_* 2>/dev/null || true

add_if_missing () { local p="$1"; shift; local c="${*:-}"; [[ -f "$p" ]] || { mkdir -p "$(dirname "$p")"; printf "%s\n" "$c" > "$p"; echo "🆕 $p"; }; }

echo "== 1) Archivos base (routing/404/favicon/fingerprint) =="
add_if_missing vercel.json $'{ "cleanUrls": true, "trailingSlash": false,\n  "routes":[{"src":"^/$","dest":"/index.html"},{"src":"^/(index\\\\.html)?$","dest":"/index.html"}] }\n'
add_if_missing 404.html $'<!doctype html>\n<meta charset="utf-8"><title>Not Found</title>\n<meta http-equiv="refresh" content="0; url=/index.html">\n<p>Redirigiendo…</p>\n'
add_if_missing favicon.ico ""
add_if_missing fingerprint.txt "$(date -u +'%Y-%m-%dT%H:%M:%SZ') | $(git rev-parse --short HEAD || echo LOCAL) | IBG-FP:vZERO"

echo "== 2) JS base (sw-kill + home) =="
mkdir -p js decorative-images _snips
add_if_missing js/sw-kill-once.js $'(function(){try{if(localStorage.getItem("IBG_SW_KILLED"))return;if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(r=>r.unregister());if(window.caches){caches.keys().then(keys=>keys.forEach(k=>caches.delete(k)))};setTimeout(function(){try{localStorage.setItem("IBG_SW_KILLED","1")}catch(e){};location.reload()},50)})}}catch(e){}})();\n'
add_if_missing js/home.v4.js $'(function(){function p(i){if(!i)return null;if(typeof i==="string")return i.startsWith("/")?i:"/"+i;if(typeof i==="object"){const c=[i.url,i.src,i.path,i.file,i.href];for(const x of c)if(x)return x.startsWith("/")?x:"/"+x}return null}function pool(){const k=[(typeof CONTENT_PUBLIC!=="undefined"&&CONTENT_PUBLIC),(window.IBG&&(IBG.public||IBG.PUBLIC)),(window.CONTENT&&(CONTENT.public||CONTENT.PUBLIC)),(window.__IBG&&(__IBG.PUBLIC||__IBG.public)),(window.PUBLIC_CONTENT)].filter(Boolean);const a=k[0]||[];const out=[];for(const it of a){const s=p(it);if(s&&/\\/full\\//i.test(s))out.push(s)}return out}function pick(a,n){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b.slice(0,Math.min(n,b.length))}function el(t,c){const e=document.createElement(t);if(c)e.className=c;return e}function banner(){const ban=document.getElementById("banner");if(!ban)return;const box=ban.querySelector(".img");fetch("decorative-images/manifest.json",{cache:"no-store"}).then(r=>r.ok?r.json():{images:[]}).then(j=>{const imgs=(j&&j.images&&j.images.length?j.images:[]).map(x=>"decorative-images/"+x);let i=0;function setBg(){const src=imgs.length?imgs[i%imgs.length]:"decorative-images/paradise-beach.jpg";box.style.backgroundImage=`url("${src}")`;i++}setBg();if(imgs.length>1)setInterval(setBg,4000)}).catch(()=>{box.style.backgroundImage=\'url("decorative-images/paradise-beach.jpg")\'})}function ui(){const all=pool();if(!all.length){console.warn("⚠️ sin CONTENT_PUBLIC");return}const car=document.getElementById("carousel30");const grid=document.getElementById("grid40");const a30=pick(all,30);const a40=pick(all.filter(x=>!a30.includes(x)),40);const track=el("div","track");for(const src of a30){const img=el("img");img.loading="lazy";img.src=src;img.alt="photo";track.appendChild(img)}car.appendChild(track);let x=0;setInterval(()=>{const w=track.scrollWidth-car.clientWidth;x=w>0?(x+1)%(w+1):0;car.scrollTo(x,0)},30);for(const src of a40){const a=el("a","grid-item");a.href=src;a.target="_blank";const img=el("img");img.loading="lazy";img.src=src;img.alt="photo";a.appendChild(img);grid.appendChild(a)}}function ready(f){document.readyState!=="loading"?f():document.addEventListener("DOMContentLoaded",f)}ready(function(){banner();ui();if(window.IBG_ADS&&typeof IBG_ADS.init==="function"){IBG_ADS.init()}})();\n'

[[ -f decorative-images/manifest.json ]] || python3 - <<'PY' > decorative-images/manifest.json
import os, json
p="decorative-images"; exts=('.jpg','.jpeg','.png','.webp')
imgs=sorted([f for f in os.listdir(p) if f.lower().endswith(exts)]) if os.path.isdir(p) else []
imgs=[f for f in imgs if not f.lower().startswith('paradise-beach')]
print(json.dumps({"images":imgs}, ensure_ascii=False, indent=2))
PY

echo "== 3) Limpieza HTML e inyección del bloque canónico (sin awk) =="
remove_dupes () {
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
make_block () {
  cat > _snips/_block.html <<'HTML'
    <!-- SCRIPTS CANÓNICOS -->
    <script src="js/sw-kill-once.js"></script>
    <script src="content-data1.js"></script>
    <script src="content-data2.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/home.v4.js" defer></script>
HTML
  [[ -f js/ads.min.js ]] && sed -i '' -e '5a\'$'\n''    <script src="js/ads.min.js"></script>' _snips/_block.html 2>/dev/null || true
}
insert_block () {
  local f="$1"; grep -qi '</body>' "$f" || { echo "⚠️  $f sin </body>"; return 0; }
  grep -Fq 'js/home.v4.js' "$f" && return 0
  perl -0777 -i -pe '
    BEGIN{ local $/; open my $fh,"<","_snips/_block.html" or die $!; our $blk=<$fh>; }
    s{</body>}{\n$blk\n</body>}i;
  ' "$f"
}
make_block
for f in index.html premium.html videos.html subscription.html; do
  [[ -f "$f" ]] || continue
  remove_dupes "$f"
  insert_block "$f"
done

echo "== 4) Sanidad rápida =="
if grep -RIn --include='*.html' 'content-data.js' .; then
  echo "❌ Quedan referencias a content-data.js"; exit 2
fi
echo "✅ HTML limpio de legacy"

echo "== 5) Commit + push =="
git add -A || true
git diff --cached --quiet || git commit -m "ONE-SHOT: routing/404/favicon/fingerprint + home.v4 + sw-kill + bloque canónico + limpieza"
git push || true

echo "== 6) Deploy prod + alias =="
vercel switch --scope "$TEAM" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true
OUT="$(vercel --prod --yes 2>&1 || true)"
echo "$OUT" > _vercel_latest.txt
URL="$(printf "%s\n" "$OUT" | grep -Eo 'https://[^[:space:]]+\.vercel\.app' | tail -n1 || true)"
[[ -n "${URL:-}" ]] || URL="https://$PROJECT.vercel.app"
echo "Deploy => $URL"

vercel alias set "$URL" "$PROJECT.vercel.app" >/dev/null || true
if vercel alias ls | grep -q "$DOMAIN"; then printf "y\n" | vercel alias rm "$DOMAIN" >/dev/null || true; fi
vercel alias set "$URL" "$DOMAIN" >/dev/null || true

echo "== 7) Verificación HEAD =="
code () { curl -fsSIL "$1" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}'; }
printf "%-28s -> %s\n" "DEPLOY" "$(code "$URL/")"
printf "%-28s -> %s\n" "$PROJECT.vercel.app" "$(code "https://$PROJECT.vercel.app/")"
printf "%-28s -> %s\n" "$DOMAIN" "$(code "https://$DOMAIN/" || true)"

echo "== 8) Fingerprint =="
for h in "$URL" "https://$PROJECT.vercel.app" "https://$DOMAIN"; do
  printf "%-28s -> " "$h"
  curl -fsSL "$h/fingerprint.txt?ts=$(date +%s)" 2>/dev/null | sed -e 's/[^[:print:]]//g' -e 's/$/ /'; echo
done

echo
echo "Si $DOMAIN sigue en 401:"
echo "  • Es la protección por contraseña de Vercel (PRODUCTION)."
echo "  • Desactívala en: Project → Settings → Security → Password Protection (Production) → OFF"
echo "  • O usa cookie de bypass si tienes el token:  document.cookie = 'vercel-protection-bypass=TOKEN; Path=/; Max-Age=31536000; Secure; SameSite=None'; location.reload();"
echo "    (el token se crea en ese mismo panel de Security → Protection Bypass for All Visitors)"
echo "✅ Listo."
