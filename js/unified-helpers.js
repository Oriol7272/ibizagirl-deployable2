/**
 * unified-helpers.js
 * - Detecta pools en content-data* (full / uncensored / videos).
 * - Selección diaria (seed por fecha).
 * - Render de cards con overlay que se desactiva al cargar (clase .is-loaded).
 * - Icono PayPal inline (sin 404).
 */
(function(global){
  'use strict';

  // RNG con seed
  function mulberry32(a){return function(){var t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}}
  function dailySeed(seedBase){
    const d=new Date(); const key=`${seedBase}:${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
    let h=0; for(let i=0;i<key.length;i++){h=Math.imul(31,h)+key.charCodeAt(i)|0;} return Math.abs(h)||1;
  }
  function sampleDaily(arr,n,tag='pool'){
    const seed=dailySeed(tag), rng=mulberry32(seed); const A=arr.slice();
    for(let i=A.length-1;i>0;i--){const j=Math.floor(rng()*(i+1)); [A[i],A[j]]=[A[j],A[i]];}
    return A.slice(0,n);
  }

  // Normalizadores
  const isImg = v => typeof v==='string' && /\.(webp|jpe?g|png)$/i.test(v);
  const isVid = v => typeof v==='string' && /\.(mp4|webm)$/i.test(v);
  const fromItemName = (it)=> typeof it==='string'? it : (it&& (it.file||it.name||it.src||it.url||it.path)||'');
  const norm = s => String(s||'').trim().replace(/^\.?\/*/,'');
  const uniq = a => Array.from(new Set(a));

  // Descubrimiento de pools (robusto)
  function detectPool(kind){
    const out=[];
    const pushList=(L)=>{ if(Array.isArray(L)&&L.length) out.push(...L); };

    try{ const IBG=global.IBG||{}; if(IBG.pools&&Array.isArray(IBG.pools[kind])) pushList(IBG.pools[kind]); }catch(e){}
    try{ const pools=global.pools||global.POOLS||{}; if(Array.isArray(pools[kind])) pushList(pools[kind]); }catch(e){}
    try{ const U=global.UnifiedContentAPI||global.unifiedContentAPI;
      if(U){ if(Array.isArray(U[kind])) pushList(U[kind]);
        if(U.pools&&Array.isArray(U.pools[kind])) pushList(U.pools[kind]);
        if(typeof U.getPool==='function'){const p=U.getPool(kind); if(Array.isArray(p)) pushList(p);}}
    }catch(e){}
    try{ const CSM=global.ContentSystemManager||{};
      if(CSM.pools&&Array.isArray(CSM.pools[kind])) pushList(CSM.pools[kind]);
      if(typeof CSM.getPool==='function'){const p=CSM.getPool(kind); if(Array.isArray(p)) pushList(p);}
    }catch(e){}
    try{ const CAP=global.ContentAPI||{};
      if(Array.isArray(CAP[kind])) pushList(CAP[kind]);
      if(CAP.public&&Array.isArray(CAP.public[kind])) pushList(CAP.public[kind]);
      if(typeof CAP.getPublic==='function'){const p=CAP.getPublic(); if(p&&Array.isArray(p[kind])) pushList(p[kind]);}
    }catch(e){}

    if(!out.length){
      const props=Object.getOwnPropertyNames(global);
      for(const key of props){
        let val; try{ val=global[key]; }catch(e){ continue; }
        if(!val) continue;

        if(Array.isArray(val)&&val.length){
          const names=val.map(fromItemName).map(norm);
          const imgs=names.filter(isImg); const vids=names.filter(isVid);
          if(kind==='videos' && vids.length>=10) pushList(vids);
          if(kind!=='videos' && imgs.length>=10) pushList(imgs);
        }
        if(typeof val==='object' && !Array.isArray(val)){
          const maybe = val[kind] || (val.public&&val.public[kind]) || (val.pools&&val.pools[kind]);
          if(Array.isArray(maybe)&&maybe.length){
            const names=maybe.map(fromItemName).map(norm);
            if(kind==='videos'? names.some(isVid) : names.some(isImg)) pushList(names);
          }
        }
      }
    }

    let names=uniq(out.map(fromItemName).map(norm).filter(Boolean));
    names = (kind==='videos')? names.filter(isVid) : names.filter(isImg);
    return names;
  }

  function pricing(){
    const cfg=(global.CONFIG&&global.CONFIG.pricing)||{};
    return { monthly: cfg.monthly||9.99, annual: cfg.annual||59.99, lifetime: cfg.lifetime||119.99 };
  }

  // SVG inline PayPal (evita 404)
  function paypalSVG(){ return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">'+
    '<path fill="#253b80" d="M6.1 25.6l2.1-13.2c.1-.5.5-.8 1-.8h6.4c4 0 6.8 2.1 6 6.1-.7 3.5-3.1 5.2-6.8 5.2h-3l-.6 3.7c-.1.5-.5.8-1 .8H7.1c-.6 0-1.1-.5-1-1.1z"/>'+
    '<path fill="#179bd7" d="M23.6 8.9c1 .9 1.4 2.5 1.1 4.4-.8 4.7-3.8 7-8.9 7H13l-.5 3.1c-.1.5-.5.8-1 .8H7.1c-.6 0-1.1-.5-1-1.1L8.6 9.8c.1-.5.5-.8 1-.8h7.4c2.7 0 4.7.5 6.6 1.9z"/></svg>'
  );}

  function badgePP(){
    const p=pricing();
    return `<span class="badge badge-pp" title="Suscríbete">
      ${paypalSVG()}<span class="pp-price">desde €${(p.monthly).toFixed(2)}</span>
    </span>`;
  }
  function badgeNew(){ return `<span class="badge badge-new">NUEVO</span>`; }

  // Render imágenes
  function renderImageCards(container, names, basePath, markNewPct=0){
    const total=names.length, newCount=Math.round(total*markNewPct);
    const rng=mulberry32(dailySeed('news:'+basePath)); const newIdx=new Set();
    while(newIdx.size<newCount && newIdx.size<total){ newIdx.add(Math.floor(rng()*total)); }

    const html = names.map((n,idx)=>{
      const file = n.replace(/^.*\//,'');
      const src  = `/${basePath}/${file}`;
      return `<a class="card" href="${src}" target="_blank" rel="noopener">
                <img loading="lazy" decoding="async" src="${src}"
                     onload="this.closest('.card').classList.add('is-loaded')"
                     onerror="this.closest('a').style.display='none'">
                ${badgePP()}
                ${newIdx.has(idx)? badgeNew():''}
              </a>`;
    }).join('');
    container.innerHTML = html;
  }

  // Render videos
  function renderVideoCards(container, names, basePath){
    const html = names.map(n=>{
      const file=n.replace(/^.*\//,''); const src=`/${basePath}/${file}`;
      return `<div class="vcard">
        <video preload="metadata" playsinline muted controls
               onloadeddata="this.closest('.vcard').classList.add('is-loaded')"
               onmouseenter="this.muted=true; this.play().catch(()=>{})"
               onmouseleave="this.pause()"
               src="${src}"
               onerror="this.closest('.vcard').style.display='none'"></video>
        ${badgePP()}
      </div>`;
    }).join('');
    container.innerHTML = html;
  }

  // Estilos para overlay y transiciones (anulan overlays antiguos del CSS si hubiera)
  const style=document.createElement('style');
  style.textContent = `
    .card,.vcard{position:relative}
    .card img{width:100%;height:200px;object-fit:cover;display:block;opacity:0;transition:opacity .25s ease}
    .vcard video{width:100%;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.35);opacity:0;transition:opacity .25s ease}
    .card.is-loaded img,.vcard.is-loaded video{opacity:1}
    .card::after,.vcard::after{
      content:'Cargando...'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      color:#bbb; font-size:12px; background:rgba(0,0,0,.25); border-radius:12px; z-index:2
    }
    .card.is-loaded::after,.vcard.is-loaded::after{display:none!important}
    .badge{position:absolute; z-index:3; display:inline-flex; align-items:center; gap:6px;
      background:rgba(0,0,0,.6); color:#fff; padding:4px 6px; border-radius:999px; font-size:11px}
    .badge-pp{top:8px; left:8px}
    .badge-pp svg{display:block}
    .badge-pp .pp-price{opacity:.9; font-size:10px}
    .badge-new{bottom:8px; right:8px; background:#e11; font-weight:600; letter-spacing:.4px}
  `;
  document.head.appendChild(style);

  // API
  global.UHelpers = { detectPool, sampleDaily, renderImageCards, renderVideoCards };
})(window);
