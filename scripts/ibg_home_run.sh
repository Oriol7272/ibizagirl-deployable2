#!/usr/bin/env bash
set -euo pipefail

echo "IBG: HOME patch + deploy (Bash)"

# 0) Preparación de carpetas
mkdir -p tools js js/pages css

# 1) build-env.sh -> genera env.js en la RAÍZ (sin export) usando EXACTOS nombres de Vercel
cat > tools/build-env.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

: "${PAYPAL_CLIENT_ID:=}"
: "${PAYPAL_SECRET:=}"
: "${PAYPAL_PLAN_MONTHLY_1499:=}"
: "${PAYPAL_PLAN_ANNUAL_4999:=}"
: "${PAYPAL_WEBHOOK_ID:=}"

: "${CRISP_WEBSITE_ID:=}"

: "${EXOCLICK_ZONE:=}"
: "${JUICYADS_ZONE:=}"
: "${EROADVERTISING_ZONE:=}"

: "${EXOCLICK_SNIPPET_B64:=}"
: "${JUICYADS_SNIPPET_B64:=}"
: "${EROADVERTISING_SNIPPET_B64:=}"

: "${POPADS_SITE_ID:=}"
: "${POPADS_ENABLE:=0}"

: "${IBG_ASSETS_BASE_URL:=}"
CURRENCY="EUR"

cat > "$ROOT_DIR/env.js" <<'EOM'
window.IBG = {
  PAYPAL_CLIENT_ID: "PAYPAL_CLIENT_ID",
  PAYPAL_SECRET: "PAYPAL_SECRET",
  PAYPAL_PLAN_MONTHLY_1499: "PAYPAL_PLAN_MONTHLY_1499",
  PAYPAL_PLAN_ANNUAL_4999: "PAYPAL_PLAN_ANNUAL_4999",
  PAYPAL_WEBHOOK_ID: "PAYPAL_WEBHOOK_ID",
  CRISP_WEBSITE_ID: "CRISP_WEBSITE_ID",
  EXOCLICK_ZONE: "EXOCLICK_ZONE",
  JUICYADS_ZONE: "JUICYADS_ZONE",
  EROADVERTISING_ZONE: "EROADVERTISING_ZONE",
  EXOCLICK_SNIPPET_B64: "EXOCLICK_SNIPPET_B64",
  JUICYADS_SNIPPET_B64: "JUICYADS_SNIPPET_B64",
  EROADVERTISING_SNIPPET_B64: "EROADVERTISING_SNIPPET_B64",
  POPADS_SITE_ID: "POPADS_SITE_ID",
  POPADS_ENABLE: "POPADS_ENABLE",
  IBG_ASSETS_BASE_URL: "IBG_ASSETS_BASE_URL",
  CURRENCY: "EUR"
};
EOM

# Sustituye placeholders por valores de entorno si existen
# (mantiene vacío si no están definidos en Vercel/local)
sed -i "" -e "s#PAYPAL_CLIENT_ID#${PAYPAL_CLIENT_ID}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#PAYPAL_SECRET#${PAYPAL_SECRET}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#PAYPAL_PLAN_MONTHLY_1499#${PAYPAL_PLAN_MONTHLY_1499}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#PAYPAL_PLAN_ANNUAL_4999#${PAYPAL_PLAN_ANNUAL_4999}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#PAYPAL_WEBHOOK_ID#${PAYPAL_WEBHOOK_ID}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#CRISP_WEBSITE_ID#${CRISP_WEBSITE_ID}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#EXOCLICK_ZONE#${EXOCLICK_ZONE}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#JUICYADS_ZONE#${JUICYADS_ZONE}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#EROADVERTISING_ZONE#${EROADVERTISING_ZONE}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#EXOCLICK_SNIPPET_B64#${EXOCLICK_SNIPPET_B64}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#JUICYADS_SNIPPET_B64#${JUICYADS_SNIPPET_B64}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#EROADVERTISING_SNIPPET_B64#${EROADVERTISING_SNIPPET_B64}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#POPADS_SITE_ID#${POPADS_SITE_ID}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#POPADS_ENABLE#${POPADS_ENABLE}#g" "$ROOT_DIR/env.js"
sed -i "" -e "s#IBG_ASSETS_BASE_URL#${IBG_ASSETS_BASE_URL}#g" "$ROOT_DIR/env.js"

rm -f "$ROOT_DIR/tools/env.js"
echo "OK: env.js generado en raíz"
EOS
chmod +x tools/build-env.sh
bash tools/build-env.sh

# 2) Asegura que js/pages-common.js importa ./i18n.js (evita 404)
if [ -f js/pages-common.js ]; then
  sed -i "" -e 's#\.\./i18n\.js#\./i18n.js#g' js/pages-common.js || true
fi

# 3) CSS HOME (banner/hero, carrusel, grid, laterales para ads detrás)
cat > css/ibg-home.css <<'EOS'
:root{--gap:12px;--radius:18px;--badge:#ff3366;--shellMax:1280px;--sideAdW:160px}
*{box-sizing:border-box}
body{margin:0;background:#0e1b26;color:#fff;font-family:-apple-system,Segoe UI,Roboto,Inter,system-ui,sans-serif}
@font-face{
  font-family:'IbizaDisplay';
  src: url('/decorative-images/ibiza.woff2') format('woff2'),
       url('/decorative-images/ibiza.ttf') format('truetype');
  font-display:swap;
}
.use-ibiza-font{font-family:'IbizaDisplay', -apple-system,Segoe UI,Roboto,Inter,system-ui,sans-serif}
.page-shell{position:relative;max-width:var(--shellMax);margin:0 auto;z-index:2}
.header{position:sticky;top:0;z-index:5;background:rgba(0,0,0,.45);backdrop-filter:saturate(140%) blur(8px);padding:10px 12px;display:flex;gap:12px;align-items:center}
.header a{color:#fff;text-decoration:none;padding:.45rem .7rem;border-radius:999px;background:#16344a;white-space:nowrap}
.header .lang{margin-left:auto}
.hero{position:relative;overflow:hidden}
.hero-bg{width:100%;height:44vh;min-height:280px;max-height:520px;object-fit:cover;display:block;filter:saturate(1.1) contrast(1.05)}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.25),rgba(7,16,25,.85))}
.hero-title{position:absolute;left:12px;bottom:14px;font-size:clamp(24px,5vw,44px);font-weight:800}
.hero-sub{position:absolute;left:12px;bottom:14px;transform:translateY(120%);opacity:.9;font-size:clamp(14px,2.2vw,18px)}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:220px;scroll-snap-align:start;border-radius:var(--radius);overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:var(--gap);padding:12px}
.card{position:relative;border-radius:var(--radius);overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}
.badge{position:absolute;top:8px;left:8px;background:var(--badge);color:#fff;font-weight:700;padding:4px 8px;border-radius:999px;font-size:12px}
.small{font-size:12px;opacity:.85}
.side-ad{position:fixed;top:0;bottom:0;width:var(--sideAdW);z-index:1;display:none;align-items:center;justify-content:center;pointer-events:auto}
.side-ad.left{left:0} .side-ad.right{right:0}
@media (min-width:1460px){ .side-ad{display:flex} .page-shell{margin-left:var(--sideAdW);margin-right:var(--sideAdW)} }
EOS

# 4) Home.js: banner -> menú -> carrusel(20 full) -> 20 imágenes
cat > js/pages/home.js <<'EOS'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

function pickHeroImage(){
  const c=['/decorative-images/paradise-beach.webp','/decorative-images/paradise-beach.jpg','/decorative-images/paradise-beach.png'];
  return new Promise((resolve)=>{let i=0;const probe=new Image();const next=()=>{if(i>=c.length){resolve(null);return}probe.onload=()=>resolve(c[i]);probe.onerror=()=>{i++;next()};probe.src=c[i]};next()});
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title use-ibiza-font">IbizaGirl.pics</div>
      <div class="hero-sub">Exclusive mediterranean vibes</div>
    </section>
    <div id="menuMount"></div>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>
  `;

  const heroSrc = await pickHeroImage();
  const heroImg = document.getElementById('heroImg');
  if(heroSrc){ heroImg.src = heroSrc; } else {
    try{ const {home20}=getDaily(); const f=home20[0]; const u=f?.banner||f?.cover||f?.thumb||f?.src||f?.file||f?.url||f?.path; if(u) heroImg.src=u;}catch(_){}
  }

  const {home20}=getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{ const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path; const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s); });

  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{ const id=it.id||it.file||`full-${i}`; const u=it.thumb||it.src||it.file||it.url||it.path; const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`; grid.appendChild(c); });
}
EOS

# 5) Bootstrap: en HOME primero el contenido, luego mount del header justo tras banner
cat > js/bootstrap-ibg.js <<'EOS'
import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initPremium } from './pages/premium.js';
import { initVideos } from './pages/videos.js';
import { initSubscription } from './pages/subscription.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';

const ensureApp = () => document.getElementById('app') || (()=>{const d=document.createElement('div');d.id='app';document.body.appendChild(d);return d})();
const path = (location.pathname.replace(/\/+$/,'') || '/index.html');

if(path.endsWith('/index.html')){
  await initHome();
  mountHeader();
} else {
  mountHeader();
  if(path.endsWith('/premium.html')){ await initPremium(); }
  else if(path.endsWith('/videos.html')){ await initVideos(); }
  else if(path.endsWith('/subscription.html')){ await initSubscription(); }
}

initCrisp();
initAds({ left: document.getElementById('ad-left'), right: document.getElementById('ad-right') });
EOS

# 6) Ad loader con contenedores laterales (si no hay, cae a body). No toca PopAds si POPADS_ENABLE=0
cat > js/ad-loader.js <<'EOS'
import { b64Decode, isSubscribed } from './utils.js';
export function initAds(targets={}) {
  if (isSubscribed()) { console.info('Ads disabled (subscriber/lifetime)'); return; }
  const E = window.IBG || {};
  const mount = (el) => el || document.body;

  if (E.EXOCLICK_SNIPPET_B64) { mount(targets.left).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
  else if (E.EXOCLICK_ZONE) {
    const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
    const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',E.EXOCLICK_ZONE);
    mount(targets.left).appendChild(ins);
    setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
  }

  if (E.JUICYADS_SNIPPET_B64) { mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
  else if (E.JUICYADS_ZONE) {
    const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js'; document.head.appendChild(s);
    const ins=document.createElement('ins'); ins.id=E.JUICYADS_ZONE; ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
    mount(targets.right).appendChild(ins);
    setTimeout(()=>{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone: Number(E.JUICYADS_ZONE)}) },500);
  }

  if (E.EROADVERTISING_SNIPPET_B64) { mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
  else if (E.EROADVERTISING_ZONE) {
    const d=document.createElement('div'); d.id='sp_'+E.EROADVERTISING_ZONE+'_node'; d.innerHTML='&nbsp;';
    mount(targets.right).appendChild(d);
    const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+E.EROADVERTISING_ZONE+'&ctrlid=798544'; document.head.appendChild(js);
    setTimeout(()=>{ window.eaCtrl ? eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}) : null; },1000);
  }

  if ((E.POPADS_ENABLE||'0')!=='0' && E.POPADS_SITE_ID) {
    const code = '(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+E.POPADS_SITE_ID+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
    const s=document.createElement('script'); s.text = code;
    mount(targets.right).appendChild(s);
  }
}
EOS

# 7) index.html con banner + menús + carrusel + 20 imágenes + asides para ads detrás
cat > index.html <<'EOS'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IBIZAGIRL.PICS — Home</title>
<link rel="stylesheet" href="/css/ibg.css">
<link rel="stylesheet" href="/css/ibg-home.css">
<script src="/env.js"></script>
<script src="/content-data1.js"></script>
<script src="/content-data2.js"></script>
<script src="/content-data3.js"></script>
<script src="/content-data4.js"></script>
<script src="/content-data5.js"></script>
<script src="/content-data6.js"></script>
</head><body>
<aside id="ad-left" class="side-ad left"></aside>
<aside id="ad-right" class="side-ad right"></aside>
<div class="page-shell" id="shell">
  <div id="app"></div>
</div>
<script type="module" src="/js/i18n.js"></script>
<script type="module" src="/js/bootstrap-ibg.js"></script>
</body></html>
EOS

# 8) vercel.json para que siempre se genere env.js en build
if [ ! -f vercel.json ]; then
  cat > vercel.json <<'EOS'
{
  "framework": "other",
  "buildCommand": "bash tools/build-env.sh",
  "outputDirectory": "."
}
EOS
fi

# 9) Git commit + push
git add -A
git commit -m "IBG HOME: banner+menu+carousel+20img+side-ads+crisp and env.js root build" || true
git push origin main || true

# 10) Deploy a Vercel (npx para evitar global). Si requiere login, lo pedirá 1 vez.
if ! command -v vercel >/dev/null 2>&1; then
  npx -y vercel --version >/dev/null 2>&1 || true
fi
npx -y vercel --prod --yes | tee .last_vercel_home.txt

URL="$(grep -Eo 'https://[a-z0-9.-]+\.vercel\.app' .last_vercel_home.txt | tail -n1 || true)"
if [ -n "$URL" ]; then
  echo "DEPLOY: $URL"
  curl -sI "$URL/env.js" | head -n1
  curl -sI "$URL/js/bootstrap-ibg.js" | head -n1
  echo "Abrir en incógnito y recarga forzada: $URL/index.html"
else
  echo "OJO: no se detectó URL en la salida del deploy; revisa arriba."
fi

echo "FIN HOME PATCH"
