#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Patch completo del sitio + deploy"

# -------------------------------------------------------
# 0) Generar /ibg-env.js con tus variables de Vercel
# -------------------------------------------------------
mkdir -p tools
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
  CURRENCY: 'EUR'
};
writeFileSync('ibg-env.js', 'window.IBG = ' + JSON.stringify(IBG, null, 2) + ';');
console.log('[IBG] ibg-env.js generado');
EON
node tools/gen-ibg-env.mjs || true
[ -f env.js ] && mv -f env.js env.js.bak || true

# -------------------------------------------------------
# 1) i18n (5 idiomas)
# -------------------------------------------------------
mkdir -p js
cat > js/i18n.js <<'EOT'
export const T={
  ES:{home:'Home',premium:'Premium',videos:'Vídeos',subs:'Suscripciones',lifetime:'Lifetime 100€ (sin anuncios)',welcome:'Bienvenido al paraíso para tu disfrute',new:'NUEVO',buy:'Comprar',unlock:'Desbloquear',price_img:'0,10€',price_vid:'0,30€',subscribe:'Suscribirse',monthly:'Mensual 14,99€',annual:'Anual 49,99€',lifetime2:'Lifetime 100€ (sin anuncios)'},
  EN:{home:'Home',premium:'Premium',videos:'Videos',subs:'Subscriptions',lifetime:'Lifetime €100 (no ads)',welcome:'Welcome to your paradise',new:'NEW',buy:'Buy',unlock:'Unlock',price_img:'€0.10',price_vid:'€0.30',subscribe:'Subscribe',monthly:'Monthly €14.99',annual:'Annual €49.99',lifetime2:'Lifetime €100 (no ads)'},
  FR:{home:'Accueil',premium:'Premium',videos:'Vidéos',subs:'Abonnements',lifetime:'À vie 100€ (sans pubs)',welcome:'Bienvenue au paradis',new:'NOUVEAU',buy:'Acheter',unlock:'Débloquer',price_img:'0,10€',price_vid:'0,30€',subscribe:'S’abonner',monthly:'Mensuel 14,99€',annual:'Annuel 49,99€',lifetime2:'À vie 100€ (sans pubs)'},
  DE:{home:'Start',premium:'Premium',videos:'Videos',subs:'Abos',lifetime:'Lifetime 100€ (ohne Werbung)',welcome:'Willkommen im Paradies',new:'NEU',buy:'Kaufen',unlock:'Freischalten',price_img:'0,10€',price_vid:'0,30€',subscribe:'Abonnieren',monthly:'Monatlich 14,99€',annual:'Jährlich 49,99€',lifetime2:'Lifetime 100€ (ohne Werbung)'},
  IT:{home:'Home',premium:'Premium',videos:'Video',subs:'Abbonamenti',lifetime:'Per sempre 100€ (senza ads)',welcome:'Benvenuto in paradiso',new:'NUOVO',buy:'Compra',unlock:'Sblocca',price_img:'0,10€',price_vid:'0,30€',subscribe:'Abbonati',monthly:'Mensile 14,99€',annual:'Annuale 49,99€',lifetime2:'Per sempre 100€ (senza ads)'}
};
export const lang=()=>localStorage.getItem('ibg_lang')||'ES';
export const setLang=l=>(localStorage.setItem('ibg_lang',l),location.reload());
export const t=k=>(T[lang()]||T.ES)[k]||k;
EOT

# -------------------------------------------------------
# 2) Utilidades + selección diaria
# -------------------------------------------------------
cat > js/utils.js <<'EOT'
export function hashSeed(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return function(){let t=(a+=0x6D2B79F5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export const getDailySeed=()=>hashSeed(new Date().toISOString().slice(0,10));
export function shuffleSeeded(arr,seed){const a=arr.slice();const rnd=mulberry32(seed>>>0);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export const sampleSeeded=(arr,n,seed)=>shuffleSeeded(arr,seed).slice(0,Math.min(n,arr.length));
export const isSubscribed=()=>{try{return localStorage.getItem('ibg_sub_active')==='1'||localStorage.getItem('ibg_lifetime')==='1'}catch{return false}};
export const b64Decode=t=>{try{return atob(t||'')}catch{return ''}};
export function imgUrl(it){return it.banner||it.cover||it.thumb||it.src||it.file||it.url||it.path}
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
  const markNewCount = Math.floor(prem100.length*0.30);
  const newSet = new Set(prem100.slice(0,markNewCount).map((x,i)=>x.id||x.file||i));
  return {home20,prem100,vids20,newSet};
}
EOT

# -------------------------------------------------------
# 3) Header común (menú + idiomas + branding)
# -------------------------------------------------------
cat > js/pages-common.js <<'EOT'
import { t, lang, setLang } from './i18n.js';
export function header(){
  return `
  <div class="header">
    <div class="brand">ibizagirl.pics</div>
    <nav>
      <a href="/index.html">${t('home')}</a>
      <a href="/premium.html">${t('premium')}</a>
      <a href="/videos.html">${t('videos')}</a>
      <a href="/subscription.html">${t('subs')}</a>
      <a href="/subscription.html" class="btn">${t('lifetime')}</a>
    </nav>
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

# -------------------------------------------------------
# 4) Integraciones: Crisp + Ads (robusto)
# -------------------------------------------------------
cat > js/integrations.js <<'EOT'
export function initCrisp(){
  const id = window.IBG?.CRISP_WEBSITE_ID; if(!id) return;
  window.$crisp=[]; window.CRISP_WEBSITE_ID=id;
  const s=document.createElement('script'); s.src='https://client.crisp.chat/l.js'; s.async=1; document.head.appendChild(s);
}
EOT

cat > js/ad-loader.js <<'EOT'
import { b64Decode, isSubscribed } from './utils.js';
function isInt(v){return /^\d+$/.test(String(v||'').trim());}
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const mount = el => el || document.body;

  // ExoClick
  try{
    if(E.EXOCLICK_SNIPPET_B64){ mount(targets.left).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64)); }
    else if(isInt(E.EXOCLICK_ZONE)){
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',String(E.EXOCLICK_ZONE)); mount(targets.left).appendChild(ins);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // JuicyAds
  try{
    if(E.JUICYADS_SNIPPET_B64){ mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64)); }
    else if(isInt(E.JUICYADS_ZONE)){
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE); ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600'); mount(targets.right).appendChild(ins);
      const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
      s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(e){ console.warn('Juicy push error:', e); } };
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // EroAdvertising
  try{
    if(E.EROADVERTISING_SNIPPET_B64){ mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64)); }
    else if(isInt(E.EROADVERTISING_ZONE)){
      const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; d.innerHTML='&nbsp;'; mount(targets.right).appendChild(d);
      const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544'; document.head.appendChild(js);
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_e){} },1000);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // PopAds (solo si ID numérico y habilitado)
  try{
    if(isInt(E.POPADS_SITE_ID) && String(E.POPADS_ENABLE)!=='0'){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; mount(targets.right).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }
}
EOT

# -------------------------------------------------------
# 5) Estilos: base + HOME (fuente + fondo paradise-beach.png)
# -------------------------------------------------------
mkdir -p css
cat > css/ibg.css <<'EOT'
:root{--gap:12px;--radius:18px;--badge:#ff3366;--shellMax:1280px;--sideAdW:160px}
*{box-sizing:border-box}
body{margin:0;background:#0e1b26 url('/decorative-images/paradise-beach.png') center/cover fixed no-repeat;color:#fff;font-family:'Sexy Beachy',-apple-system,Segoe UI,Roboto,Inter,system-ui,sans-serif}
@font-face{
  font-family:'Sexy Beachy';
  src:url('/decorative-images/Sexy%20Beachy.otf') format('opentype'),
      url('/decorative-images/Sexy%20Beachy.ttf') format('truetype');
  font-display:swap;
}
.page-shell{position:relative;max-width:var(--shellMax);margin:0 auto;z-index:2;background:rgba(10,18,30,.72);backdrop-filter:blur(2px)}
.header{position:sticky;top:0;z-index:5;display:flex;gap:12px;align-items:center;padding:10px 12px;background:rgba(0,0,0,.45);backdrop-filter:saturate(140%) blur(8px)}
.header .brand{font-weight:900;font-size:20px;margin-right:10px}
.header nav a{color:#fff;text-decoration:none;padding:.45rem .7rem;border-radius:999px;background:#16344a;white-space:nowrap;margin-right:6px}
.header .lang{margin-left:auto}
.btn{cursor:pointer;border:0;border-radius:999px;background:#1b87f3;color:#fff;padding:.5rem .8rem;font-weight:700}
.side-ad{position:fixed;top:0;bottom:0;width:var(--sideAdW);z-index:1;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
@media (min-width:1460px){.side-ad{display:flex}.page-shell{margin-left:var(--sideAdW);margin-right:var(--sideAdW)}}
EOT

cat > css/ibg-home.css <<'EOT'
.hero{position:relative;overflow:hidden}
.hero-bg{width:100%;height:46vh;min-height:280px;max-height:520px;object-fit:cover;display:block}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,16,25,.10),rgba(7,16,25,.85))}
.hero-title{position:absolute;left:12px;bottom:56px;font-size:clamp(28px,7vw,64px);font-weight:900}
.hero-sub{position:absolute;left:12px;bottom:18px;font-size:clamp(14px,2.2vw,20px);opacity:.95}
.carousel{position:relative;overflow:hidden;margin:12px}
.carousel-track{display:flex;gap:10px;scroll-snap-type:x mandatory;overflow-x:auto;padding-bottom:8px}
.carousel .slide{min-width:320px;max-width:70vw;height:220px;scroll-snap-align:start;border-radius:18px;overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:12px}
.card{position:relative;border-radius:18px;overflow:hidden;background:#0a1320}
.card img{width:100%;height:220px;object-fit:cover;display:block}
.badge{position:absolute;top:8px;left:8px;background:#ff3366;color:#fff;font-weight:700;padding:4px 8px;border-radius:999px;font-size:12px}
.small{font-size:12px;opacity:.85}
EOT

# -------------------------------------------------------
# 6) HOME (banner de /full, carrusel 20 y grid 20)
# -------------------------------------------------------
mkdir -p js/pages
cat > js/pages/home.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl } from '../utils.js';

function pickBannerFromPool(){
  try{
    const U=window.UnifiedContentAPI;
    if(U?.getPublicImages){
      const all=U.getPublicImages();
      const banners=all.filter(x=>x.isBanner||/banner/i.test(x?.tag||'')||/banner/i.test(x?.type||''));
      return (banners.length?banners[Math.floor(Math.random()*banners.length)]:all[0])||null;
    }
  }catch(_){}
  return null;
}

export async function initHome(){
  const root=document.getElementById('app');
  root.innerHTML=`
    <section class="hero" id="hero">
      <img class="hero-bg" id="heroImg" src="/decorative-images/paradise-beach.png" alt="">
      <div class="hero-overlay"></div>
      <div class="hero-title">ibizagirl.pics</div>
      <div class="hero-sub">${t('welcome')}</div>
    </section>
    <h2 style="padding:10px 12px">${t('home')}</h2>
    <section class="carousel"><div class="carousel-track" id="homeCarousel"></div></section>
    <section class="grid" id="homeGrid"></section>`;

  // banner real del pool si existe
  const b=pickBannerFromPool(); const url = b && imgUrl(b); if(url){ document.getElementById('heroImg').src=url; }

  const {home20}=getDaily();

  // carrusel
  const car=document.getElementById('homeCarousel');
  home20.forEach(it=>{ const u=imgUrl(it); const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${u}" alt="">`; car.appendChild(s); });

  // grid
  const grid=document.getElementById('homeGrid');
  home20.forEach((it,i)=>{ const id=it.id||it.file||`full-${i}`; const u=imgUrl(it);
    const c=document.createElement('div'); c.className='card'; c.dataset.id=id; c.innerHTML=`<img loading="lazy" src="${u}" alt="">`;
    grid.appendChild(c);
  });
}
EOT

# -------------------------------------------------------
# 7) PREMIUM (100 imágenes con 30% NEW, blur + paypal por imagen)
# -------------------------------------------------------
cat > js/pages/premium.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl, isSubscribed } from '../utils.js';
import { mountPayPerItem } from '../paypal.js';

export async function initPremium(){
  const root=document.getElementById('app');
  const {prem100,newSet}=getDaily();

  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('premium')}</h2>
    <section class="grid" id="premGrid"></section>
  `;
  const grid=document.getElementById('premGrid');

  prem100.forEach((it,i)=>{
    const id=it.id||it.file||`p-${i}`, u=imgUrl(it);
    const card=document.createElement('div'); card.className='card'; card.dataset.id=id;
    const isNew = newSet.has(id);
    const locked = !isSubscribed();
    card.innerHTML = `
      ${isNew?'<span class="badge">'+t('new')+'</span>':''}
      <img loading="lazy" src="${u}" alt="" style="${locked?'filter:blur(8px)':'filter:none'}">
      ${locked?`<div style="position:absolute;inset:auto 8px 8px auto;background:rgba(0,0,0,.6);padding:6px 8px;border-radius:999px;font-size:12px">${t('price_img')}</div>`:''}
      <div style="position:absolute;inset:auto 8px 8px 8px;display:flex;gap:6px;justify-content:flex-end">
        ${locked?`<button class="btn" data-buy="${id}" data-amount="0.10">${t('buy')}</button>`:''}
      </div>
    `;
    grid.appendChild(card);
  });

  if(!isSubscribed()){
    mountPayPerItem('[data-buy]'); // paypal por item
  }
}
EOT

# -------------------------------------------------------
# 8) VÍDEOS (20 con blur y paypal por vídeo)
# -------------------------------------------------------
cat > js/pages/videos.js <<'EOT'
import { t } from '../i18n.js';
import { getDaily } from '../daily-picks.js';
import { imgUrl, isSubscribed } from '../utils.js';
import { mountPayPerItem } from '../paypal.js';

export async function initVideos(){
  const root=document.getElementById('app');
  const {vids20}=getDaily();

  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('videos')}</h2>
    <section class="grid" id="vidGrid"></section>
  `;
  const grid=document.getElementById('vidGrid');

  vids20.forEach((it,i)=>{
    const id=it.id||it.file||`v-${i}`, u=imgUrl(it);
    const locked=!isSubscribed();
    const poster=u;
    const card=document.createElement('div'); card.className='card'; card.dataset.id=id;
    card.innerHTML = `
      <img loading="lazy" src="${poster}" alt="" style="${locked?'filter:blur(8px)':'filter:none'}">
      ${locked?`<div style="position:absolute;inset:auto 8px 8px auto;background:rgba(0,0,0,.6);padding:6px 8px;border-radius:999px;font-size:12px">${t('price_vid')}</div>`:''}
      <div style="position:absolute;inset:auto 8px 8px 8px;display:flex;gap:6px;justify-content:flex-end">
        ${locked?`<button class="btn" data-buy="${id}" data-amount="0.30">${t('buy')}</button>`:''}
      </div>
    `;
    grid.appendChild(card);
  });

  if(!isSubscribed()){
    mountPayPerItem('[data-buy]');
  }
}
EOT

# -------------------------------------------------------
# 9) SUSCRIPCIONES (mensual, anual, lifetime)
# -------------------------------------------------------
cat > js/pages/subscription.js <<'EOT'
import { t } from '../i18n.js';
import { mountSubscriptions, mountLifetime } from '../paypal.js';
export async function initSubscription(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('subs')}</h2>
    <div style="padding:12px;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
      <div style="background:#0a1320;border-radius:18px;padding:16px">
        <h3>${t('monthly')}</h3>
        <div id="paypal-monthly"></div>
      </div>
      <div style="background:#0a1320;border-radius:18px;padding:16px">
        <h3>${t('annual')}</h3>
        <div id="paypal-annual"></div>
      </div>
      <div style="background:#0a1320;border-radius:18px;padding:16px">
        <h3>${t('lifetime2')}</h3>
        <div id="paypal-lifetime"></div>
        <p class="small">Acceso total + sin anuncios.</p>
      </div>
    </div>
  `;
  mountSubscriptions('#paypal-monthly','#paypal-annual');
  mountLifetime('#paypal-lifetime');
}
EOT

# -------------------------------------------------------
# 10) PayPal (buttons de suscripción/compra suelta/lifetime)
# -------------------------------------------------------
cat > js/paypal.js <<'EOT'
import { isSubscribed } from './utils.js';
function loadPaypal(){ return new Promise(res=>{ if(window.paypal){res();return;} const c=window.IBG?.PAYPAL_CLIENT_ID||''; const s=document.createElement('script'); s.src=`https://www.paypal.com/sdk/js?client-id=${c}&components=buttons,hosted-buttons,subscriptions&vault=true&intent=capture&currency=EUR`; s.onload=()=>res(); document.head.appendChild(s); }); }
export async function mountSubscriptions(selMonthly,selAnnual){
  await loadPaypal();
  const m = document.querySelector(selMonthly), a = document.querySelector(selAnnual);
  const mid = window.IBG?.PAYPAL_PLAN_MONTHLY_1499||'', aid = window.IBG?.PAYPAL_PLAN_ANNUAL_4999||'';
  if(m && mid){ paypal.Buttons({style:{shape:'pill',label:'subscribe'},createSubscription:(d,a)=>a.subscription.create({plan_id:mid}),onApprove:()=>{ localStorage.setItem('ibg_sub_active','1'); location.href='/index.html'; }}).render(m); }
  if(a && aid){ paypal.Buttons({style:{shape:'pill',label:'subscribe'},createSubscription:(d,a)=>a.subscription.create({plan_id:aid}),onApprove:()=>{ localStorage.setItem('ibg_sub_active','1'); location.href='/index.html'; }}).render(a); }
}
export async function mountLifetime(sel){
  await loadPaypal();
  const host=document.querySelector(sel);
  if(!host) return;
  paypal.Buttons({
    style:{shape:'pill',label:'pay'},
    createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:'100.00'},description:'IBIZAGIRL.PICS Lifetime'}]}),
    onApprove:async(d,a)=>{ await a.order.capture(); localStorage.setItem('ibg_lifetime','1'); localStorage.setItem('ibg_sub_active','1'); location.href='/index.html'; }
  }).render(host);
}
export async function mountPayPerItem(selector){
  await loadPaypal();
  document.querySelectorAll(selector).forEach(btn=>{
    const amount = btn.getAttribute('data-amount') || '0.10';
    const host = document.createElement('div'); host.style.marginTop='6px'; btn.parentElement.appendChild(host);
    paypal.Buttons({
      style:{shape:'pill',label:'pay'},
      createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:amount},description:'IBIZAGIRL.PICS item'}]}),
      onApprove:async(d,a)=>{ await a.order.capture(); /* aquí podrías desbloquear el item si quisieras; guardamos sub_active para UX */ localStorage.setItem('ibg_sub_active','1'); location.reload(); }
    }).render(host);
  });
}
EOT

# -------------------------------------------------------
# 11) Bootstrap de páginas + Crisp + Ads
# -------------------------------------------------------
cat > js/bootstrap-ibg.js <<'EOT'
import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initPremium } from './pages/premium.js';
import { initVideos } from './pages/videos.js';
import { initSubscription } from './pages/subscription.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';

(async ()=>{
  const path = location.pathname.replace(/\/+$/,'') || '/index.html';
  mountHeader();
  if(path.endsWith('/index.html')) await initHome();
  else if(path.endsWith('/premium.html')) await initPremium();
  else if(path.endsWith('/videos.html')) await initVideos();
  else if(path.endsWith('/subscription.html')) await initSubscription();

  initCrisp();
  initAds({left:document.getElementById('ad-left'),right:document.getElementById('ad-right')});
})();
EOT

# -------------------------------------------------------
# 12) HTMLs
# -------------------------------------------------------
cat > index.html <<'EOT'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IBIZAGIRL.PICS — Home</title>
<link rel="stylesheet" href="/css/ibg.css">
<link rel="stylesheet" href="/css/ibg-home.css">
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
<div class="page-shell"><div id="app"></div></div>
<script type="module" src="/js/i18n.js"></script>
<script type="module" src="/js/bootstrap-ibg.js"></script>
</body></html>
EOT

cat > premium.html <<'EOT'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IBIZAGIRL.PICS — Premium</title>
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
<div class="page-shell"><div id="app"></div></div>
<script type="module" src="/js/i18n.js"></script>
<script type="module" src="/js/bootstrap-ibg.js"></script>
</body></html>
EOT

cat > videos.html <<'EOT'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IBIZAGIRL.PICS — Videos</title>
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
<div class="page-shell"><div id="app"></div></div>
<script type="module" src="/js/i18n.js"></script>
<script type="module" src="/js/bootstrap-ibg.js"></script>
</body></html>
EOT

cat > subscription.html <<'EOT'
<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IBIZAGIRL.PICS — Suscripciones</title>
<link rel="stylesheet" href="/css/ibg.css">
<script src="/ibg-env.js"></script>
</head><body>
<aside id="ad-left" class="side-ad left"></aside>
<aside id="ad-right" class="side-ad right"></aside>
<div class="page-shell"><div id="app"></div></div>
<script type="module" src="/js/i18n.js"></script>
<script type="module" src="/js/bootstrap-ibg.js"></script>
</body></html>
EOT

# -------------------------------------------------------
# 13) vercel.json (framework permitido + build env)
# -------------------------------------------------------
cat > vercel.json <<'EOT'
{
  "framework": "vite",
  "buildCommand": "node tools/gen-ibg-env.mjs",
  "outputDirectory": "."
}
EOT

# -------------------------------------------------------
# 14) Commit + push + deploy
# -------------------------------------------------------
git add -A
git commit -m "IBG full: home carousel+20, premium 100(30% NEW) blurred, videos 20 blurred, paypal (subs+lifetime+item), ads, crisp, i18n, paradise beach bg" || true
git push origin main || true
npx -y vercel --prod --yes
