#!/usr/bin/env bash
set -Eeuo pipefail

# ---------- 1) CSS paywall ----------
mkdir -p css
cat > css/paywall.css <<'CSS'
/* overlay y botones de compra */
.paywall{
  position:absolute; inset:0; display:flex; align-items:end; justify-content:space-between;
  padding:.5rem; pointer-events:none;
}
.price-pill{
  background:rgba(0,0,0,.65); color:#fff; padding:.25rem .5rem; border-radius:999px; font-size:.85rem;
  border:1px solid rgba(255,255,255,.25); pointer-events:auto
}
.buy-btn{
  background:#003087; color:#fff; border:0; padding:.4rem .7rem; border-radius:999px; font-weight:700; cursor:pointer;
  display:flex; align-items:center; gap:.4rem; pointer-events:auto
}
.buy-btn img{ height:14px; width:auto; display:inline-block }

/* modal paypal */
#pp-modal{ position:fixed; inset:0; z-index:9999; display:none }
#pp-modal.show{ display:block }
#pp-bg{ position:absolute; inset:0; background:#0008; display:flex; align-items:center; justify-content:center }
#pp-card{ position:relative; background:#fff; color:#111; border-radius:12px; min-width:320px; max-width:90vw; padding:1rem }
#pp-close{ position:absolute; top:.5rem; right:.6rem; background:none; border:0; font-size:1.2rem; cursor:pointer }

/* badge NUEVO */
.badge{ position:absolute; top:8px; left:8px; background:#0ea5e9; color:#001018; padding:.2rem .5rem; border-radius:999px; font-size:.8rem; font-weight:700 }

/* blur de premium y veos (si no hay acceso) */
.locked .thumb-media{ filter: blur(10px); }
.unlocked .thumb-media{ filter:none }

/* esconder anuncios con lifetime */
.hide-ads .ad-slot, .hide-ads iframe[src*="juicyads"], .hide-ads iframe[src*="exoclick"], .hide-ads iframe[src*="eroadvertising"]{
  display:none !important;
}
CSS

# ---------- helpers seguros para inyeccinnn ----------
append_after_head(){
  local f="$1" payload="$2"
  [[ -f "$f" ]] || { echo "skip (no existe) $f"; return 0; }
  grep -Fq "$payload" "$f" && { echo "ya estaba en <head>: $f"; return 0; }
  awk -v P="$payload" '{
    print;
    if(!ins && /<head[^>]*>/){ print "  " P; ins=1 }
  }' "$f" > "$f.tmp" || true
  if [[ -s "$f.tmp" ]]; then mv "$f.tmp" "$f" && echo "inyectado en <head>: $f"; else rm -f "$f.tmp"; echo "no se pudo inyectar en <head> (falta <head>?) $f"; fi
}

append_before_body(){
  local f="$1" payload="$2"
  [[ -f "$f" ]] || { echo "skip (no existe) $f"; return 0; }
  grep -Fq "$payload" "$f" && { echo "ya estaba antes de </body>: $f"; return 0; }
  awk -v P="$payload" '{
    if(!ins && /<\/body>/){ print "  " P; ins=1 }
    print
  }' "$f" > "$f.tmp" || true
  if [[ -s "$f.tmp" ]]; then mv "$f.tmp" "$f" && echo "inyectado antes de </body>: $f"; else rm -f "$f.tmp"; echo "no se pudo inyectar antes de </body> (falta </body>?) $f"; fi
}

ensure_block_in_index(){
  # Si no hay #gallery, inserta un contenedor de galer bajo #main-section o .page
  local f="index.html"
  [[ -f "$f" ]] || return 0
  grep -q 'id="gallery"' "$f" && return 0
  awk '{
    print
    if(!ins && /id="main-section"|<div class="page">/){
      print "<div id=\"gallery\" class=\"gallery\"></div>"; ins=1
    }
  }' "$f" > "$f.tmp" || true
  if [[ -s "$f.tmp" ]]; then mv "$f.tmp" "$f"; fi
}

ensure_block_in_premium(){
  local f="premium.html"
  [[ -f "$f" ]] || return 0
  grep -q 'id="premium-grid"' "$f" && return 0
  awk '{
    print
    if(!ins && /id="main-section"|<main[^>]*id="page-main"|<div class="page">/){
      print "<div id=\"premium-grid\"></div>"; ins=1
    }
  }' "$f" > "$f.tmp" || true
  if [[ -s "$f.tmp" ]]; then mv "$f.tmp" "$f"; fi
}

ensure_block_in_videos(){
  local f="videos.html"
  [[ -f "$f" ]] || return 0
  grep -q 'id="videos-grid"' "$f" && return 0
  awk '{
    print
    if(!ins && /id="main-section"|<main[^>]*id="page-main"|<div class="page">/){
      print "<div id=\"videos-grid\"></div>"; ins=1
    }
  }' "$f" > "$f.tmp" || true
  if [[ -s "$f.tmp" ]]; then mv "$f.tmp" "$f"; fi
}

ensure_sub_buttons(){
  local f="subscription.html"
  [[ -f "$f" ]] || return 0
  grep -q 'id="pp-monthly"' "$f" && grep -q 'id="pp-annual"' "$f" && grep -q 'id="pp-lifetime"' "$f" && return 0
  awk '{
    print
    if(!ins && /id="main-section"|<main[^>]*id="page-main"|<div class="page">/){
      print "<div class=\"subs-cta\" style=\"display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;justify-content:center;margin:1rem auto;max-width:800px\">";
      print "  <button id=\"pp-monthly\">Suscripcinnn mensual (14,)</button>";99
      print "  <button id=\"pp-annual\">Suscripcinnn anual (49,)</button>";99
      print "  <button id=\"pp-lifetime\">Lifetime ()</button>";100
      print "</div>";
      ins=1
    }
  }' "$f" > "$f.tmp" || true
  if [[ -s "$f.tmp" ]]; then mv "$f.tmp" "$f"; fi
}

# ---------- 2) Inyectar link CSS paywall ----------
for f in index.html premium.html videos.html subscription.html; do
  append_after_head "$f" '<link rel="stylesheet" href="/css/paywall.css"/>'
done

# ---------- 3) JS de pagos + storefront ----------
mkdir -p js

cat > js/payments.js <<'JS'
(function(){
  const ENV = (window.__ENV||{});
  const CLIENT_ID = ENV.PAYPAL_CLIENT_ID;
  const CURRENCY = 'EUR';
  const PLAN_MONTHLY = ENV.PAYPAL_PLAN_MONTHLY_1499;
  const PLAN_ANNUAL  = ENV.PAYPAL_PLAN_ANNUAL_4999;

  let loadedMode = null;
  function loadSDK(mode){
    if(!CLIENT_ID) { console.error('PAYPAL_CLIENT_ID faltante'); return Promise.reject('NO_CLIENT'); }
    if(loadedMode === mode && window.paypal) return Promise.resolve();
    [...document.querySelectorAll('script[src*="paypal.com/sdk/js"]')].forEach(s=>s.remove());
    delete window.paypal;

    const base = 'https://www.paypal.com/sdk/js';
    const common = `client-id=${encodeURIComponent(CLIENT_ID)}&currency=${CURRENCY}&components=buttons,marks`;
    const extra = (mode==='subscription') ? '&intent=subscription&vault=true' : '&intent=capture';
    const src = `${base}?${common}${extra}`;

    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src; s.async=true; s.onload=()=>{ loadedMode=mode; resolve(); };
      s.onerror=()=>reject(new Error('PayPal SDK load error'));
      document.head.appendChild(s);
    });
  }

  function ensureModal(){
    if(document.getElementById('pp-modal')) return;
    const html = `
      <div id="pp-modal"><div id="pp-bg"><div id="pp-card">
        <button id="pp-close"></button>
        <div id="pp-container"></div>
      </div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('pp-close').onclick = ()=> document.getElementById('pp-modal').classList.remove('show');
  }
  function openModal(){ ensureModal(); const m=document.getElementById('pp-modal'); m.classList.add('show'); return m; }

  function markAccess(type){
    if(type==='lifetime'){ localStorage.setItem('IBG_LIFETIME','1'); document.documentElement.classList.add('hide-ads'); }
    if(type==='monthly'){ localStorage.setItem('IBG_SUB_MONTHLY','1'); }
    if(type==='annual'){  localStorage.setItem('IBG_SUB_ANNUAL','1'); }
    document.dispatchEvent(new CustomEvent('ibg:access-granted'));
  }

  function buySingle(kind, ref){
    const amount = (kind==='video') ? '0.30' : '0.10';
    loadSDK('order').then(()=>{
      openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder: (_,actions)=>actions.order.create({
          purchase_units:[{description:`${kind}:${ref}`, amount:{value:amount,currency_code:CURRENCY}}]
        }),
        onApprove: async (_,actions)=>{
          await actions.order.capture();
          const key = `IBG_UNLOCK_${kind}_${btoa(unescape(encodeURIComponent(ref))).replace(/=+$/,'')}`;
          localStorage.setItem(key, '1');
          Contenido desbloqueado!');alert('
          document.getElementById('pp-modal').classList.remove('show');
          document.dispatchEvent(new CustomEvent('ibg:item-unlocked', {detail:{kind,ref}}));
        }
      }).render('#pp-container');
    }).catch(console.error);
  }

  function subscribe(plan, label){
    loadSDK('subscription').then(()=>{
      openModal();
      const planId = plan==='monthly' ? PLAN_MONTHLY : PLAN_ANNUAL;
      if(!planId){ alert('Falta planId en ENV'); return; }
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createSubscription: (_,actions)=> actions.subscription.create({ plan_id: planId }),
        onApprove: async ()=>{
          markAccess(plan);
          SuscripciAlertnnn ${label} activada!`);(`
          document.getElementById('pp-modal').classList.remove('show');
        }
      }).render('#pp-container');
    }).catch(console.error);
  }

  function buyLifetime(){
    loadSDK('order').then(()=>{
      openModal();
      window.paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill'},
        createOrder: (_,actions)=>actions.order.create({
          purchase_units:[{description:'lifetime', amount:{value:'100.00',currency_code:'EUR'}}]
        }),
        onApprove: async (_,actions)=>{
          await actions.order.capture();
          markAccess('lifetime');
          Acceso de por vida activado y sin anuncios!');alert('
          document.getElementById('pp-modal').classList.remove('show');
          location.reload();
        }
      }).render('#pp-container');
    }).catch(console.error);
  }

  window.IBGPay = { buySingle, subscribeMonthly:()=>subscribe('monthly','mensual'), subscribeAnnual:()=>subscribe('annual','anual'), buyLifetime };
})();
JS

cat > js/storefront.js <<'JS'
(function(){
  function makeDailyRNG(seedStr){ let h=0; for(let i=0;i<seedStr.length;i++) h = Math.imul(31,h)+seedStr.charCodeAt(i)|0; return ()=> (h = Math.imul(48271,h) % 0x7fffffff) / 0x7fffffff; }
  function todaySeed(){ const d=new Date(); return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`; }
  function pickN(arr,n,seed=todaySeed()){ const rng = makeDailyRNG(seed), a=arr.slice(), out=[]; for(let i=0;i<a.length && out.length<n;i++){ const j = Math.floor(rng()*a.length); out.push(a.splice(j,1)[0]); } return out; }

  function findUrls(regex){
    const out = new Set();
    document.querySelectorAll('img[src],source[src],video[src]').forEach(el=>{ const u = el.getAttribute('src'); if(u && regex.test(u)) out.add(u); });
    for (const k in window){
      const v = window[k];
      if(Array.isArray(v)){
        v.forEach(x=>{
          if(typeof x==='string' && regex.test(x)) out.add(x);
          else if(x && typeof x==='object'){
            const u = x.src||x.url||x.path; if(u && regex.test(u)) out.add(u);
          }
        });
      }
    }
    return Array.from(out);
  }

  const Pools = {
    full:    ()=> findUrls(/\/full\/.+\.(?:jpe?g|png|webp)$/i),
    premium: ()=> findUrls(/\/uncensored\/.+\.(?:jpe?g|png|webp)$/i),
    videos:  ()=> findUrls(/\/uncensored-videos\/.+\.(?:mp4|webm)$/i),
  };

  function hasGlobalAccess(){
    return localStorage.getItem('IBG_LIFETIME')==='1'
        || localStorage.getItem('IBG_SUB_MONTHLY')==='1'
        || localStorage.getItem('IBG_SUB_ANNUAL')==='1';
  }
  function hasItemAccess(kind, ref){
    if(hasGlobalAccess()) return true;
    const key = `IBG_UNLOCK_${kind}_${btoa(unescape(encodeURIComponent(ref))).replace(/=+$/,'')}`;
    return localStorage.getItem(key)==='1';
  }

  function cardHTML(kind, url, isNew, locked){
    const price = (kind==='video') ? '0,' : '0,';1030
    const buyCall = (kind==='video') ? `IBGPay.buySingle('video','${url}')` : `IBGPay.buySingle('image','${url}')`;
    const btn = locked ? `<button class="buy-btn" onclick="${buyCall}"><img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal"> Comprar ${price}</button>` : '';
    const badge = isNew ? `<span class="badge">NUEVO</span>` : '';
    const cls = locked ? 'locked' : 'unlocked';
    const media = (kind==='video')
      ? `<video class="thumb-media" src="${url}" muted playsinline preload="metadata"></video>`
      : `<img class="thumb-media" src="${url}" loading="lazy" />`;
    return `
      <div class="tile ${cls}" style="position:relative">
        ${badge}
        ${media}
        <div class="paywall">
          <span class="price-pill">${price}</span>
          ${btn}
        </div>
      </div>`;
  }

  function renderGrid(el, kind, urls, newCount){
    if(!el) return;
    const setNew = new Set(urls.slice(0,newCount));
    el.innerHTML = urls.map(u => cardHTML(kind, u, setNew.has(u), !hasItemAccess(kind,u))).join('');
  }

  function renderHome(){
    const host = document.getElementById('gallery') || document.querySelector('#main-section .gallery') || document.getElementById('page-main');
    if(!host) return;
    const urls = pickN(Pools.full(), 20);
    host.innerHTML = urls.map(u => `<div class="tile" style="position:relative"><img class="thumb-media" src="${u}" loading="lazy" /></div>`).join('');
  }

  function renderPremium(){
    const host = document.getElementById('premium-grid') || document.querySelector('#premium-grid') || document.getElementById('page-main');
    if(!host) return;
    const urls = pickN(Pools.premium(), 100);
    const news = Math.floor(urls.length * 0.30);
    renderGrid(host, 'image', urls, news);
  }

  function renderVideos(){
    const host = document.getElementById('videos-grid') || document.querySelector('#videos-grid') || document.getElementById('page-main');
    if(!host) return;
    const urls = pickN(Pools.videos(), 20);
    const news = Math.floor(urls.length * 0.30);
    renderGrid(host, 'video', urls, news);
  }

  document.addEventListener('ibg:access-granted', ()=>{ renderPremium(); renderVideos(); });
  document.addEventListener('ibg:item-unlocked', (e)=>{ const k=e.detail?.kind; if(k==='image') renderPremium(); if(k==='video') renderVideos(); });

  window.IBGStore = { renderHome, renderPremium, renderVideos };
})();
JS

cat > js/page-init.js <<'JS'
(function(){
  function onReady(fn){ document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }
  onReady(()=>{
    if(document.getElementById('home-carousel') || /index\.html?$/.test(location.pathname)){
      window.IBGStore && window.IBGStore.renderHome();
    }
    if(document.getElementById('premium-grid')) window.IBGStore && window.IBGStore.renderPremium();
    if(document.getElementById('videos-grid'))  window.IBGStore && window.IBGStore.renderVideos();

    const btnM = document.getElementById('pp-monthly');
    const btnA = document.getElementById('pp-annual');
    const btnL = document.getElementById('pp-lifetime');
    if(btnM) btnM.addEventListener('click', ()=> window.IBGPay && window.IBGPay.subscribeMonthly());
    if(btnA) btnA.addEventListener('click', ()=> window.IBGPay && window.IBGPay.subscribeAnnual());
    if(btnL) btnL.addEventListener('click', ()=> window.IBGPay && window.IBGPay.buyLifetime());
  });
})();
JS

# ---------- 4) asegurar contenedores ----------
ensure_block_in_index
ensure_block_in_premium
ensure_block_in_videos
ensure_sub_buttons

# ---------- 5) inyectar enlaces y scripts ----------
for f in index.html premium.html videos.html subscription.html; do
  append_before_body "$f" '<script src="/js/payments.js"></script>'
  append_before_body "$f" '<script src="/js/storefront.js"></script>'
  append_before_body "$f" '<script src="/js/page-init.js"></script>'
done

echo "PUNTO 3 SAFE OK"
