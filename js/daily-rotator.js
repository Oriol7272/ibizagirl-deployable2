(function() {
  const MODE = (window.__ROTATOR_MODE__ || 'daily').toLowerCase();

  // PRNG determinista por día (o aleatorio por recarga)
  function prng(seed) {
    let a = seed >>> 0;
    return function() {
      a += 0x6D2B79F5;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedForMode() {
    if (MODE === 'daily') {
      const now = new Date();
      const key = `${now.getUTCFullYear()}-${now.getUTCMonth()+1}-${now.getUTCDate()}`;
      let s = 0; for (let i=0;i<key.length;i++) s = (s*31 + key.charCodeAt(i)) >>> 0;
      return s;
    }
    return (Math.random()*0xFFFFFFFF) >>> 0;
  }
  const rnd = prng(seedForMode());

  function euro(n) { return n.toLocaleString('es-ES',{style:'currency',currency:'EUR',minimumFractionDigits:2}); }
  function base(p){ return (p||'').split('/').pop(); }

  // Cookies
  function readCookies(){
    const h=document.cookie||'', out={};
    h.split(';').forEach(p=>{ const [k,...v]=p.trim().split('='); if(!k) return; out[decodeURIComponent(k)]=decodeURIComponent(v.join('=')||''); });
    return out;
  }
  function hasAccess(src){
    const c = readCookies();
    if (c.ibg_sub_ui && /^(monthly|annual|lifetime)$/.test(c.ibg_sub_ui)) return true;
    const list = (c.ibg_items_ui||'').split(',').map(s=>s.trim()).filter(Boolean);
    return list.includes(base(src));
  }

  // Pools desde content-data*.js
  function normalizeItem(x){ return (typeof x==='string') ? {src:x} : (x && x.src ? x : null); }
  function discover() {
    const buckets=[];
    for (const k in window){
      try {
        const v = window[k];
        if (Array.isArray(v) && v.length){
          const n = normalizeItem(v[0]);
          if (n && typeof n.src==='string') buckets.push(v.map(normalizeItem).filter(Boolean));
        }
      } catch(_){}
    }
    const flat = buckets.flat();
    const full  = flat.filter(o => /\/full\//.test(o.src));
    const unc   = flat.filter(o => /\/uncensored\//.test(o.src));
    const vids  = flat.filter(o => /\/uncensored-videos\//.test(o.src) || /\.(mp4|webm)$/i.test(o.src));
    return { full, unc, vids };
  }

  function sampleN(arr,n){
    const src=arr.slice(), out=[];
    n=Math.min(n,src.length);
    for(let i=0;i<n;i++){ const idx=Math.floor(rnd()*src.length); out.push(src.splice(idx,1)[0]); }
    return out;
  }
  function pickWithNew(arr,total,pctNew=0.3){
    const chosen=sampleN(arr,total);
    const target=Math.floor(chosen.length*pctNew);
    const marks=new Set();
    while(marks.size<target && marks.size<chosen.length) marks.add(Math.floor(rnd()*chosen.length));
    return chosen.map((it,i)=>({...it,isNew:marks.has(i)}));
  }

  function renderGrid(containerId, items, opts){
    const root=document.getElementById(containerId); if(!root) return;
    root.className='grid';
    root.innerHTML = items.map(item=>{
      const unlocked = hasAccess(item.src);
      const isVideo  = (opts.kind==='video');
      const price    = isVideo ? 0.30 : 0.10;
      const priceText= euro(price).replace('.',',');

      const mediaLocked = isVideo
        ? `<video class="thumb censored" preload="metadata" muted playsinline poster="/img/video-poster-blur.svg"></video>`
        : `<img class="thumb censored" src="${item.preview || '/img/preview-blur.webp'}" loading="lazy" alt="">`;

      const mediaUnlocked = isVideo
        ? `<video class="thumb" src="${item.src}" preload="metadata" playsinline controls poster="" onmouseenter="this.play()" onmouseleave="this.pause()"></video>`
        : `<img class="thumb" src="${item.src}" loading="lazy" alt="">`;

      const newBadge = item.isNew ? `<span class="badge badge-new">NEW</span>` : '';
      const lockBtn  = unlocked ? '' : `
        <button class="unlock-btn" data-kind="${opts.kind||'photo'}" data-src="${item.src}" data-amount="${price}">
          <svg class="i i-lock"><use href="#icon-lock"></use></svg>
          <span class="price">${priceText}</span>
        </button>`;

      return `
        <div class="card">
          <div class="thumb-wrap">
            ${unlocked ? mediaUnlocked : mediaLocked}
            ${newBadge}
            ${lockBtn}
          </div>
        </div>`;
    }).join('');

    // Bind pagos
    root.querySelectorAll('.unlock-btn').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        const src = btn.getAttribute('data-src');
        const amt = parseFloat(btn.getAttribute('data-amount')||'0.10');
        if (window.IBG_PAY?.buyItem) window.IBG_PAY.buyItem({ src, amount: amt, currency:'EUR', kind: opts.kind||'photo' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const { full, unc, vids } = discover();
    const gallery20 = sampleN(full, 20);
    const photos100 = pickWithNew(unc, 100, 0.30);
    const videos20  = pickWithNew(vids, 20, 0.30).map(v=>({...v, kind:'video'}));

    window.IBG_CURRENT = { gallery:gallery20, uncensored:photos100, videos:videos20 };

    renderGrid('galleryGrid',    gallery20, { censored:false, kind:'photo' });
    renderGrid('uncensoredGrid', photos100, { censored:true,  kind:'photo' });
    renderGrid('videosGrid',     videos20,  { censored:true,  kind:'video' });
  });
})();
