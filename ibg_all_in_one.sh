#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] all-in-one: HOME completa (banner+idiomas+carrusel+20 fotos+ads+chat) + deploy"

# 0) carpetas
mkdir -p tools js js/pages css

# 1) Generador de entorno para Vercel y local -> crea /ibg-env.js (sin 'export')
cat > tools/gen-ibg-env.mjs <<'EON'
import { writeFileSync } from 'fs';
const v = process.env;
const IBG = {
  PAYPAL_CLIENT_ID: v.PAYPAL_CLIENT_ID || '',
  PAYPAL_SECRET: v.PAYPAL_SECRET || '',
  PAYPAL_PLAN_MONTHLY_1499: v.PAYPAL_PLAN_MONTHLY_1499 || '',
  PAYPAL_PLAN_ANNUAL_4999: v.PAYPAL_PLAN_ANNUAL_4999 || '',
  PAYPAL_WEBHOOK_ID: v.PAYPAL_WEBHOOK_ID || '',
  CRISP_WEBSITE_ID: v.CRISP_WEBSITE_ID || '',
  EXOCLICK_ZONE: v.EXOCLICK_ZONE || '',
  JUICYADS_ZONE: v.JUICYADS_ZONE || '',
  EROADVERTISING_ZONE: v.EROADVERTISING_ZONE || '',
  EXOCLICK_SNIPPET_B64: v.EXOCLICK_SNIPPET_B64 || '',
  JUICYADS_SNIPPET_B64: v.JUICYADS_SNIPPET_B64 || '',
  EROADVERTISING_SNIPPET_B64: v.EROADVERTISING_SNIPPET_B64 || '',
  POPADS_SITE_ID: v.POPADS_SITE_ID || '',
  POPADS_ENABLE: v.POPADS_ENABLE || '',
  IBG_ASSETS_BASE_URL: v.IBG_ASSETS_BASE_URL || '',
  CURRENCY: 'EUR',
};
writeFileSync('ibg-env.js', 'window.IBG = ' + JSON.stringify(IBG, null, 2) + ';');
console.log('[IBG] ibg-env.js escrito');
EON

# 1.1) generar ibg-env.js ahora (local) y dejar de usar env.js
node tools/gen-ibg-env.mjs || true
[ -f env.js ] && mv -f env.js env.js.bak || true

# 2) i18n (5 idiomas)
cat > js/i18n.js <<'EOT'
export const T={
  ES:{home:'Home',premium:'Premium',videos:'Vídeos',subs:'Suscripciones',lifetime:'Lifetime 100€ (sin anuncios)',welcome:'Bienvenido al paraíso para tu disfrute'},
  EN:{home:'Home',premium:'Premium',videos:'Videos',subs:'Subscriptions',lifetime:'Lifetime €100 (no ads)',welcome:'Welcome to your paradise'},
  FR:{home:'Accueil',premium:'Premium',videos:'Vidéos',subs:'Abonnements',lifetime:'À vie 100€ (sans pubs)',welcome:'Bienvenue au paradis'},
  DE:{home:'Start',premium:'Premium',videos:'Videos',subs:'Abos',lifetime:'Lifetime 100€ (ohne Werbung)',welcome:'Willkommen im Paradies'},
  IT:{home:'Home',premium:'Premium',videos:'Video',subs:'Abbonamenti',lifetime:'Per sempre 100€ (senza ads)',welcome:'Benvenuto in paradiso'}
};
export const lang=()=>localStorage.getItem('ibg_lang')||'ES';
export const setLang=l=>(localStorage.setItem('ibg_lang',l),location.reload());
export const t=k=>(T[lang()]||T.ES)[k]||k;
EOT

# 3) Header + idiomas
cat > js/pages-common.js <<'EOT'
import { t, lang, setLang } from './i18n.js';
export function header(){
  return `
  <div class="header">
    <a href="/index.html">${t('home')}</a>
    <a href="/premium.html">${t('premium')}</a>
    <a href="/videos.html">${t('videos')}</a>
    <a href="/subscription.html">${t('subs')}</a>
    <a href="/subscription.html" class="btn">${t('lifetime')}</a>
    <select class="lang">
      <option value="ES">ES</option><option value="EN">EN</option><option value="FR">FR</option><option value="DE">DE</option><option value="IT">IT</option>
    </select>
  </div>`;
}
export function mountHeader(){
  document.body.insertAdjacentHTML('afterbegin', header());
  const sel=document.querySelector('.lang'); sel.value=lang(); sel.addEventListener('change',e=>setLang(e.target.value));
}
EOT

# 4) utils + daily picks (20 full / 100 premium / 20 videos, aunque en HOME sólo usamos full)
cat > js/utils.js <<'EOT'
export function hashSeed(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return function(){let t=(a+=0x6D2B79F5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export const getDailySeed=()=>hashSeed(new Date().toISOString().slice(0,10));
export function shuffleSeeded(arr,seed){const a=arr.slice();const rnd=mulberry32(seed>>>0);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export const sampleSeeded=(arr,n,seed)=>shuffleSeeded(arr,seed).slice(0,Math.min(n,arr.length));
export const isSubscribed=()=>{try{return localStorage.getItem('ibg_sub_active')==='1'||localStorage.getItem('ibg_lifetime')==='1'}catch{return false}};
export const b64Decode=t=>{try{return atob(t||'')}catch{return ''}};
EOT

cat > js/daily-picks.js <<'EOT'
import { getDailySeed, sampleSeeded } from './utils.js';
function pool(){
  const U = window.UnifiedContentAPI || {};
  const full = (U.getPublicImages && U.getPublicImages()) || (window.ContentData2?.publicImages||[]);
  const prem = (U.getPremiumImages && U.getPremiumImages()) || []
    .concat(window.ContentData3?.premiumImages||[], window.ContentData4?.premiumImages||[]);
  const vids = (U.getPremiumVideos && U.getPremiumVideos()) || (window.ContentData5?.premiumVideos||[]);
  return {full,prem,vids};
}
export function getDaily(){
  const s=getDailySeed(); const {full,prem,vids}=pool();
  const home20 = sampleSeeded(full,20,s);
  const prem100 = sampleSeeded(prem,100,s^0x9e3779b1);
  const vids20 = sampleSeeded(vids,20,s^0x1337c0de);
  return {home20,prem100,vids20};
}
EOT

# 5) Integraciones: Crisp
cat > js/integrations.js <<'EOT'
export function initCrisp(){
  const id = window.IBG?.CRISP_WEBSITE_ID; if(!id) return;
  window.$crisp=[]; window.CRISP_WEBSITE_ID=id;
  const s=document.createElement('script'); s.src='https://client.crisp.chat/l.js'; s.async=1; document.head.appendChild(s);
}
EOT

# 6) Ads loader (ExoClick + JuicyAds + Eroadvertising + PopAds opcional)
cat > js/ad-loader.js <<'EOT'
import { b64Decode, isSubscribed } from './utils.js';
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const mount = el => el || document.body;

  // ExoClick
  if(E.EXOCLICK_SNIPPET_B64){ mount(targets.left).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
  else if(E.EXOCLICK_ZONE){
    const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
    const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',E.EXOCLICK_ZONE); mount(targets.left).appendChild(ins);
    setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
  }

  // JuicyAds (orden exacto del snippet para evitar "Cannot set properties of undefined (setting 'adsbyjuicy')")
  if(E.JUICYADS_SNIPPET_B64){ mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
  else if(E.JUICYADS_ZONE){
    const ins=document.createElement('ins'); ins.id=E.JUICYADS_ZONE; ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600'); mount(targets.right).appendChild(ins);
    const s=document.createElement('script'); s.src='https://poweredby.jads.co/js/jads.js'; s.async=true; document.head.appendChild(s);
    const k=document.createElement('script'); k.textContent="(window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:"+Number(E.JUICYADS_ZONE)+"});"; mount(targets.right).appendChild(k);
  }

  // EroAdvertising
  if(E.EROADVERTISING_SNIPPET_B64){ mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
  else if(E.EROADVERTISING_ZONE){
    const d=document.createElement('div'); d.id='sp_'+E.EROADVERTISING_ZONE+'_node'; d.innerHTML='&nbsp;'; mount(targets.right).appendChild(d);
    const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+E.EROADVERTISING_ZONE+'&ctrlid=798544'; document.head.appendChild(js);
    setTimeout(()=>{ window.eaCtrl ? eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}) : null; },1000);
  }

  // PopAds (opcional)
  if((E.POPADS_ENABLE||'0')!=='0' && E.POPADS_SITE_ID){
    const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+E.POPADS_SITE_ID+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
    const s=document.createElement('script'); s.text=code; mount(targets.right).appendChild(s);
  }
}
EOT

# 7) HOME: banner (decorative cover + banner real), carrusel 20, grid 20
cat > js/pages/home.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';

function pickBannerFromPool(){
  try{
    const U = window.UnifiedContentAPI;
    if(U?.getPublicImages){
      const all=U.getPublicImages();
      const b=all.filter(x=>x.isBanner||/banner/i.test(x?.tag||'')||/banner/i.test(x?.type||'')); 
      return (b.length?b[Math.floor(Math.random()*b.length)]:all[0])||null;
    }
  }catch(_){}
  return null;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero" style="background-image:url('/decorative-images/cover.png');background-size:cover;background-position:center;">
      <img class="hero-bg" id="heroImg" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title" style="font-family:'Sexy Beachy',system-ui">IbizaGirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  const b=pickBannerFromPool();
  const url=b?.banner||b?.cover||b?.thumb||b?.src||b?.file||b?.url||b?.path;
  if(url){ const img=document.getElementById('heroImg'); img.src=url; img.style.width='100%'; img.style.height='44vh'; img.style.objectFit='cover'; }

  const {home20}=getDaily();
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{
    const u=it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path;
    const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s);
  });

  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{
    const id=it.id||it.file||`full-${i}`;
    const u=it.thumb||it.src||it.file||it.url||it.path;
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
EOT

# 8) Bootstrap: HOME primero contenido y luego header; activa chat y ads laterales
cat > js/bootstrap-ibg.js <<'EOT'
import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';
(async ()=>{
  await initHome();
  mountHeader();            // menú pegado al banner
  initCrisp();              // chatbot
  initAds({left:document.getElementById('ad-left'), right:document.getElementById('ad-right')}); // anuncios
})();
EOT

# 9) Estilos base + home
cat > css/ibg.css <<'EOT'
:root{--gap:12px;--radius:18px;--badge:#ff3366;--shellMax:1280px;--sideAdW:160px}
*{box-sizing:border-box}
body{margin:0;background:#0e1b26;color:#fff;font-family:-apple-system,Segoe UI,Roboto,Inter,system-ui,sans-serif}
.btn{cursor:pointer;border:0;border-radius:999px;background:#1b87f3;color:#fff;padding:.5rem .8rem;font-weight:700}
.page-shell{position:relative;max-width:var(--shellMax);margin:0 auto;z-index:2}
.header{position:sticky;top:0;z-index:5;background:rgba(0,0,0,.45);backdrop-filter:saturate(140%) blur(8px);padding:10px 12px;display:flex;gap:12px;align-items:center}
.header a{color:#fff;text-decoration:none;padding:.45rem .7rem;border-radius:999px;background:#16344a;white-space:nowrap}
.header .lang{margin-left:auto}
.hero{position:relative;overflow:hidden}
.hero-bg{display:block;opacity:1}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.15),rgba(7,16,25,.85))}
.hero-title{position:absolute;left:12px;bottom:14px;font-size:clamp(26px,5vw,48px);font-weight:800}
.hero-sub{position:absolute;left:12px;bottom:14px;transform:translateY(120%);opacity:.9;font-size:clamp(14px,2.2vw,18px)}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:220px;scroll-snap-align:start;border-radius:var(--radius);overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:var(--gap);padding:12px}
.card{position:relative;border-radius:var(--radius);overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}
.side-ad{position:fixed;top:0;bottom:0;width:var(--sideAdW);z-index:1;display:none;align-items:center;justify-content:center;pointer-events:auto}
.side-ad.left{left:0} .side-ad.right{right:0}
@media (min-width:1460px){ .side-ad{display:flex} .page-shell{margin-left:var(--sideAdW);margin-right:var(--sideAdW)} }
EOT

# 10) index.html (HOME) — usa ibg-env.js + datasets + módulos
cat > index.html <<'EOT'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IBIZAGIRL.PICS — Home</title>
<link rel="stylesheet" href="/css/ibg.css">
<script src="/ibg-env.js"></script>
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
EOT

# 11) vercel.json — asegurar creación de ibg-env.js en cada build
cat > vercel.json <<'EOT'
{
  "framework": "other",
  "buildCommand": "node tools/gen-ibg-env.mjs",
  "outputDirectory": "."
}
EOT

# 12) commit + push + deploy (npx vercel)
git add -A
git commit -m "IBG HOME: banner+menu/idiomas+carrusel+20fotos+ads+crisp + ibg-env.js build" || true
git push origin main || true

# No requiere vercel instalado global
npx -y vercel --prod --yes
