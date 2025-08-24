#!/usr/bin/env bash
set -euo pipefail

echo "[IBG] Patch subscription.js para usar { pay, subscribe } y dejar subscripción con anuncios; lifetime quita anuncios."

# CSS simple para la página de suscripción (reutiliza laterales)
mkdir -p css
cat > css/ibg-subscription.css <<'CSS'
:root{ --side:164px }
.side-ad{position:fixed;top:0;bottom:0;width:var(--side);z-index:50;display:none;align-items:center;justify-content:center}
.side-ad.left{left:0}.side-ad.right{right:0}
.ad-box{width:160px;height:600px;display:flex;align-items:center;justify-content:center;overflow:hidden}
@media (min-width:1200px){ body{padding-left:var(--side);padding-right:var(--side)} .side-ad{display:flex} }
.page-shell,#app{width:100%;max-width:calc(100vw - (var(--side) * 2));margin:0 auto}

.sub-hero{padding:18px 12px 8px}
.sub-hero h1{font-family:'Sexy Beachy',system-ui;font-size:clamp(36px,4vw,54px);margin:0 0 8px}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;padding:0 12px 28px}
.plan{background:#0b1422;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px}
.plan h3{margin:0 0 4px}
.plan .price{font-weight:900;font-size:22px;margin:6px 0 10px}
.plan .desc{opacity:.85;font-size:14px;margin-bottom:12px}
.plan button{display:inline-flex;align-items:center;gap:8px;background:#111827;border:1px solid rgba(255,255,255,.18);
  padding:9px 12px;border-radius:10px;font-size:14px;cursor:pointer}
.plan button .pp{width:20px;height:20px;background:url('/assets/paypal-mark.svg') no-repeat center/contain;display:inline-block}
.note{opacity:.75;font-size:13px;margin:0 12px 16px}
CSS

# JS de la página de suscripción
mkdir -p js/pages
cat > js/pages/subscription.js <<'JS'
import { pay, subscribe } from '../paypal.js';

function ensureCss(){
  if(!document.getElementById('css-ibg-sub')){
    const l=document.createElement('link'); l.id='css-ibg-sub'; l.rel='stylesheet'; l.href='/css/ibg-subscription.css';
    document.head.appendChild(l);
  }
}
export async function initSubscription(){
  ensureCss();

  // anuncios laterales (subs mantienen anuncios)
  function ensure(id,cls,host){ let el=document.getElementById(id); if(!el){el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el);} return el; }
  ensure('ad-left','side-ad left',document.body).innerHTML='<div class="ad-box" id="ad-left-box"></div>';
  ensure('ad-right','side-ad right',document.body).innerHTML='<div class="ad-box" id="ad-right-box"></div>';

  const app=document.getElementById('app');
  app.innerHTML = `
    <div class="sub-hero">
      <h1>Suscripciones</h1>
      <p class="note">Mensual y Anual <b>con anuncios</b>. La opción <b>Lifetime</b> desbloquea todo y <b>elimina anuncios</b>.</p>
    </div>
    <section class="plans">
      <div class="plan" id="plan-month">
        <h3>Mensual</h3>
        <div class="price">14,99 € / mes</div>
        <div class="desc">Acceso a TODO el contenido mientras esté activa (con anuncios).</div>
        <button id="btn-month"><span class="pp"></span><span>Suscribirme</span></button>
      </div>
      <div class="plan" id="plan-year">
        <h3>Anual</h3>
        <div class="price">49,99 € / año</div>
        <div class="desc">Acceso a TODO el contenido durante un año (con anuncios).</div>
        <button id="btn-year"><span class="pp"></span><span>Suscribirme</span></button>
      </div>
      <div class="plan" id="plan-life">
        <h3>Lifetime</h3>
        <div class="price">100 € único</div>
        <div class="desc">Acceso a TODO para siempre y <b>sin anuncios</b>.</div>
        <button id="btn-life"><span class="pp"></span><span>Comprar Lifetime</span></button>
      </div>
    </section>
  `;

  const IBG = window.IBG || {};

  // Mensual
  document.getElementById('btn-month').addEventListener('click', ()=>{
    const plan = IBG.PAYPAL_PLAN_MONTHLY_1499;
    if(!plan){ console.warn('PAYPAL_PLAN_MONTHLY_1499 ausente'); return; }
    subscribe(plan, ()=>{
      localStorage.setItem('ibg_subscribed','1');
      alert('¡Suscripción mensual activa!');
    });
  });

  // Anual
  document.getElementById('btn-year').addEventListener('click', ()=>{
    const plan = IBG.PAYPAL_PLAN_ANNUAL_4999;
    if(!plan){ console.warn('PAYPAL_PLAN_ANNUAL_4999 ausente'); return; }
    subscribe(plan, ()=>{
      localStorage.setItem('ibg_subscribed','1');
      alert('¡Suscripción anual activa!');
    });
  });

  // Lifetime (100 €) — quita anuncios
  document.getElementById('btn-life').addEventListener('click', ()=>{
    pay(100.00, ()=>{
      localStorage.setItem('ibg_lifetime','1');
      localStorage.setItem('ibg_no_ads','1');
      alert('¡Lifetime activado! Anuncios deshabilitados.');
      location.reload();
    });
  });
}
JS

# Commit + push + deploy
git add -A
git commit -m "subscription: usar {pay,subscribe} (sin anuncios solo en lifetime); estilos + laterales" || true
git push origin main || true
npx -y vercel --prod --yes || { npx -y vercel build && npx -y vercel deploy --prebuilt --prod --yes; }
