#!/usr/bin/env bash
set -euo pipefail

TEAM="oriols-projects-ed6b9b04"
PROJECT="ibizagirl-deployable2"
DOMAIN="ibizagirl.pics"

command -v vercel >/dev/null || { echo "❌ Falta Vercel CLI (npm i -g vercel)"; exit 1; }

echo "== 1) Routing + fix HTML =="
# Arregla comentario roto si quedara alguno
[ -f index.html ] && perl -0777 -i -pe 's/-->>/-->/g' index.html || true
# Fuerza / -> /index.html y 404 propia
cat > vercel.json <<'JSON'
{ "cleanUrls": true, "trailingSlash": false,
  "routes": [
    { "src": "^/$", "dest": "/index.html" },
    { "src": "^/(index\\.html)?$", "dest": "/index.html" }
  ] }
JSON
cat > 404.html <<'HTML'
<!doctype html><meta charset="utf-8"><title>Not Found — ibizagirl.pics</title>
<meta http-equiv="refresh" content="0; url=/index.html">
<p>Redirigiendo a <a href="/index.html">Home</a>…</p>
HTML

git add vercel.json 404.html index.html || true
git commit -m "routing raíz -> index.html + 404 propia + fix comentario" || true
git push || true

echo "== 2) Deploy a producción + alias =="
vercel switch --scope "$TEAM" >/dev/null || true
vercel link --project "$PROJECT" --yes >/dev/null || true

OUT="$(vercel --prod --yes 2>&1 | tee _vercel_out_latest.txt)"
URL="$(printf "%s\n" "$OUT" | sed -nE 's/^✅[[:space:]]+Production:[[:space:]]+(https:\/\/[^[:space:]]+).*$/\1/p' | tail -n1)"
[ -n "$URL" ] || URL="$(sed -nE 's/.*(https:\/\/[^[:space:]]+\.vercel\.app).*/\1/p' _vercel_out_latest.txt | tail -n1)"
echo "    Deploy prod => $URL"

vercel alias set "$URL" "$PROJECT.vercel.app" || true
if vercel alias ls | grep -q "$DOMAIN"; then printf "y\n" | vercel alias rm "$DOMAIN" || true; fi
vercel alias set "$URL" "$DOMAIN" || true

echo "== 3) Verificación HTTP =="
code_depl=$(curl -fsSIL "$URL/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
code_proj=$(curl -fsSIL "https://$PROJECT.vercel.app/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
code_dom=$(curl -fsSIL "https://$DOMAIN/" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
printf "  %-30s %s\n" "DEPLOY" "$code_depl"
printf "  %-30s %s\n" "$PROJECT.vercel.app" "$code_proj"
printf "  %-30s %s\n" "$DOMAIN" "$code_dom"

if [ "$code_dom" = "401" ]; then
  echo "⚠️  $DOMAIN está protegido (401). Obtengo token de bypass…"
  vercel env pull -y .env.vercel >/dev/null || true
  if grep -q '^VERCEL_PROTECTION_BYPASS=' .env.vercel; then
    TOKEN="$(grep '^VERCEL_PROTECTION_BYPASS=' .env.vercel | sed 's/^[^=]*=//')"
    echo
    echo "👉 Abre https://$DOMAIN y pega EXACTAMENTE esto en la consola del navegador (DevTools → Console):"
    echo "document.cookie = 'vercel-protection-bypass=$TOKEN; Path=/; Max-Age=31536000; Secure; SameSite=None'; location.reload();"
    echo
    code_cookie=$(curl -fsSIL "https://$DOMAIN/" -H "Cookie: vercel-protection-bypass=$TOKEN" | awk 'BEGIN{FS=": "}/^HTTP/{c=$2} END{print c}')
    echo "  (Comprobación con cookie por curl: $code_cookie)"
    echo
    echo "Si no quieres protección: Dashboard → Project → Settings → Security → Password Protection (Production) → OFF."
  else
    echo "No encontré VERCEL_PROTECTION_BYPASS. Revisa Settings → Security en el dashboard."
  fi
fi

echo "== 4) Comprobación de referencias a content-data.js =="
# Asegura que NO se usa content-data.js legacy en los HTML
if grep -RIn --include='*.html' 'content-data.js' .; then
  echo "❌ AÚN hay referencias a content-data.js en HTML. Cámbialas a content-data1.js + content-data2.js."
else
  echo "✅ HTML sin content-data.js legacy."
fi

echo "DONE."
