/**
 * unified-helpers.js
 * - Detecta pools desde content-data* (FULL / UNCENSORED / VIDEOS).
 * - Selección diaria (seed por fecha) estable, cambia al día siguiente o al recargar.
 * - Render helpers (cards con overlay de iconos/precio/NEW).
 */

(function(global){
  'use strict';

  // ---------- RNG con seed (mulberry32) ----------
  function mulberry32(a){ return function(){ var t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; } }
  function dailySeed(seedBase){
    const d = new Date();
    const key = `${seedBase}:${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
    let h=0; for(let i=0;i<key.length;i++){ h = Math.imul(31, h) + key.charCodeAt(i) | 0; }
    return Math.abs(h) || 1;
  }
  function sampleDaily(arr, n, tag='pool'){
    const seed = dailySeed(tag);
    const rng  = mulberry32(seed);
    const A = arr.slice();
    for(let i=A.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [A[i],A[j]]=[A[j],A[i]]; }
    return A.slice(0, n);
  }

  // ---------- helpers nombre/normalización ----------
  const isImg = v => typeof v === 'string' && /\.(webp|jpe?g|png)$/i.test(v);
  const isVid = v => typeof v === 'string' && /\.(mp4|webm)$/i.test(v);
  const fromItemName = (it) => {
    if (typeof it === 'string') return it;
    if (!it || typeof it !== 'object') return '';
    return it.file || it.name || it.src || it.url || it.path || '';
  };
  const norm = (s) => String(s||'').trim().replace(/^\.?\/*/,'');
  const uniq = (a) => Array.from(new Set(a));

  // ---------- detección robusta de pools ----------
  function detectPool(kind){ // 'full' | 'uncensored' | 'videos'
    const out = [];

    function pushList(list){ if (Array.isArray(list) && list.length) out.push(...list); }

    // Rutas típicas por tus content-data*
    try {
      const IBG = global.IBG || {};
      if (IBG.pools && Array.isArray(IBG.pools[kind])) pushList(IBG.pools[kind]);
    } catch(e){}
    try {
      const pools = global.pools || global.POOLS || {};
      if (Array.isArray(pools[kind])) pushList(pools[kind]);
    } catch(e){}
    try {
      const U = global.UnifiedContentAPI || global.unifiedContentAPI;
      if (U) {
        if (Array.isArray(U[kind])) pushList(U[kind]);
        if (U.pools && Array.isArray(U.pools[kind])) pushList(U.pools[kind]);
        if (typeof U.getPool === 'function'){ const p=U.getPool(kind); if (Array.isArray(p)) pushList(p); }
      }
    } catch(e){}
    try {
      const CSM = global.ContentSystemManager || {};
      if (CSM.pools && Array.isArray(CSM.pools[kind])) pushList(CSM.pools[kind]);
      if (typeof CSM.getPool === 'function'){ const p=CSM.getPool(kind); if (Array.isArray(p)) pushList(p); }
    } catch(e){}
    try {
      const CAP = global.ContentAPI || {};
      if (Array.isArray(CAP[kind])) pushList(CAP[kind]);
      if (CAP.public && Array.isArray(CAP.public[kind])) pushList(CAP.public[kind]);
      if (typeof CAP.getPublic === 'function'){ const p=CAP.getPublic(); if (p && Array.isArray(p[kind])) pushList(p[kind]); }
    } catch(e){}

    // Si sigue vacío, escaneo global (por si cambiase el nombre)
    if (!out.length){
      const props = Object.getOwnPropertyNames(global);
      for (const key of props){
        let val; try { val = global[key]; } catch(e){ continue; }
        if (!val) continue;

        // arrays con nombres válidos
        if (Array.isArray(val) && val.length){
          const names = val.map(fromItemName).map(norm);
          const imgs = names.filter(isImg);
          const vids = names.filter(isVid);
          if (kind==='videos' && vids.length >= 10) { pushList(vids); }
          if (kind!=='videos' && imgs.length >= 10) { pushList(imgs); }
        }

        // objetos con possible .full / .uncensored / .videos
        if (typeof val === 'object' && !Array.isArray(val)){
          const maybe = val[kind] || (val.public && val.public[kind]) || (val.pools && val.pools[kind]);
          if (Array.isArray(maybe) && maybe.length){
            const names = maybe.map(fromItemName).map(norm);
            if (kind==='videos' ? names.some(isVid) : names.some(isImg)) pushList(names);
          }
        }
      }
    }

    // Normalización
    let names = uniq(out.map(fromItemName).map(norm).filter(Boolean));
    if (kind==='videos') names = names.filter(isVid); else names = names.filter(isImg);
    return names;
  }

  // ---------- render cards ----------
  function priceFromConfig(){
    const cfg = (global.CONFIG && global.CONFIG.pricing) || {};
    return {
      monthly: cfg.monthly || 9.99,
      annual:  cfg.annual  || 59.99,
      life:    cfg.lifetime|| 119.99
    };
  }
  function planBadgeHTML(){
    const p = priceFromConfig();
    // Precio pequeño dentro de la chapita PayPal
    return `<span class="badge badge-pp" title="Suscríbete en PayPal">
      <img src="/assets/icons/paypal.svg" alt="PayPal" aria-hidden="true"/>
      <span class="pp-price">desde €${(p.monthly).toFixed(2)}</span>
    </span>`;
  }
  function newBadgeHTML(){ return `<span class="badge badge-new">NUEVO</span>`; }

  function renderImageCards(container, names, basePath, markNewPct=0){
    const pick = names;
    const total = pick.length;
    const newCount = Math.round(total * markNewPct);
    const rng = mulberry32(dailySeed('news:'+basePath));
    const newIdx = new Set();
    while(newIdx.size < newCount && newIdx.size < total){
      newIdx.add(Math.floor(rng()*total));
    }
    const html = pick.map((n,idx)=>{
      const src = `/${basePath}/${n.replace(/^.*\//,'')}`;
      return `<a class="card" href="${src}" target="_blank" rel="noopener">
                <img loading="lazy" decoding="async" src="${src}" onerror="this.closest('a').style.display='none'">
                ${planBadgeHTML()}
                ${newIdx.has(idx) ? newBadgeHTML() : ''}
              </a>`;
    }).join('');
    container.innerHTML = html;
  }

  function renderVideoCards(container, names, basePath){
    const pick = names;
    const html = pick.map(n=>{
      const file = n.replace(/^.*\//,'');
      const src = `/${basePath}/${file}`;
      return `<div class="vcard">
        <video preload="metadata" playsinline muted controls
               onmouseenter="this.muted=true; this.play().catch(()=>{})"
               onmouseleave="this.pause()"
               src="${src}" onerror="this.closest('.vcard').style.display='none'"></video>
        ${planBadgeHTML()}
      </div>`;
    }).join('');
    container.innerHTML = html;
  }

  // estilos mínimos para badges si el CSS del proyecto no los tuviera
  const style = document.createElement('style');
  style.textContent = `
    .card,.vcard{position:relative}
    .badge{position:absolute; z-index:3; display:inline-flex; align-items:center; gap:6px;
           background:rgba(0,0,0,.6); color:#fff; padding:4px 6px; border-radius:999px; font-size:11px}
    .badge-pp{top:8px; left:8px}
    .badge-pp img{width:16px; height:16px; display:block}
    .badge-pp .pp-price{opacity:.9; font-size:10px}
    .badge-new{bottom:8px; right:8px; background:#e11; font-weight:600; letter-spacing:.4px}
    .vgrid{display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
    .vgrid video{width:100%; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.35)}
  `;
  document.head.appendChild(style);

  // API pública
  global.UHelpers = {
    detectPool, sampleDaily, renderImageCards, renderVideoCards
  };
})(window);
