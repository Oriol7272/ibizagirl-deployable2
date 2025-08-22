(function(){
  const IBG = window.IBG = window.IBG || {};
  // ---------- utils ----------
  IBG.seedFor = (salt='')=>{
    // fija por día para rotación diaria
    const d = new Date();
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}|${salt}`;
    let h=0; for(let i=0;i<key.length;i++) h = Math.imul(31,h) + key.charCodeAt(i) | 0;
    let s = (h>>>0) / 4294967295;
    return ()=> (s = (1103515245*s + 12345) % 2147483647) / 2147483647;
  };
  IBG.shufflePick = (arr, n, salt='')=>{
    const rnd = IBG.seedFor(salt);
    const a = [...new Set(arr)];
    for (let i=a.length-1; i>0; i--) { const j = Math.floor(rnd()* (i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a.slice(0, Math.min(n, a.length));
  };
  const isImg = f=>/\.(webp|jpe?g|png)$/i.test(f);
  const isVid = f=>/\.(mp4|webm)$/i.test(f);

  // ---------- descubrimiento de pools ----------
  function fromCatalog(obj){
    if (!obj) return null;
    const cat = obj.catalog || obj.pools || obj.data || obj;
    const full = [...new Set((cat.full||cat.public||cat.fullImages||[]).filter(isImg))];
    const unc  = [...new Set((cat.uncensored||cat.premium||cat.uncensoredImages||[]).filter(isImg))];
    const vids = [...new Set((cat.videos||cat.premiumVideos||[]).filter(isVid))];
    return (full.length+unc.length+vids.length)>0 ? {full,uncensored:unc,videos:vids} : null;
  }
  function scanGlobals(){
    // intenta APIs conocidas
    const candidates = [
      fromCatalog(window.UnifiedContentAPI),
      fromCatalog(window.ContentSystemManager),
      fromCatalog(window.ContentAPI)
    ].filter(Boolean);
    if (candidates[0]) return candidates[0];

    // fallback: buscar arrays grandes de strings por toda la ventana
    const pools = {full:[], uncensored:[], videos:[]};
    for (const [k,v] of Object.entries(window)) {
      if (!v) continue;
      if (Array.isArray(v) && v.length>10 && typeof v[0]==='string') {
        if (isVid(v[0])) {
          pools.videos.push(...v.filter(isVid));
        } else if (isImg(v[0])) {
          const key = k.toLowerCase();
          if (key.includes('uncensored') || key.includes('premium')) pools.uncensored.push(...v.filter(isImg));
          else if (key.includes('full') || key.includes('public')) pools.full.push(...v.filter(isImg));
        }
      } else if (typeof v==='object' && Array.isArray(v.list) && v.list.length>10 && typeof v.list[0]==='string') {
        const guess = (v.kind||v.type||'').toLowerCase();
        if (isVid(v.list[0])) pools.videos.push(...v.list.filter(isVid));
        else if (guess.includes('uncensored') || guess.includes('premium')) pools.uncensored.push(...v.list.filter(isImg));
        else pools.full.push(...v.list.filter(isImg));
      }
    }
    pools.full      = [...new Set(pools.full)].filter(isImg);
    pools.uncensored= [...new Set(pools.uncensored)].filter(isImg);
    pools.videos    = [...new Set(pools.videos)].filter(isVid);
    return pools;
  }

  IBG.pools = scanGlobals();
  console.log('🔎 unified-helpers: pools', { ...IBG.pools, mode:'daily' });

  // ---------- render ----------
  IBG.renderGrid = (sel, items, opts={})=>{
    const wrap = document.querySelector(sel);
    if (!wrap){ console.warn('container not found', sel); return; }
    wrap.innerHTML = '';
    const paid = localStorage.getItem('ibg_paid')==='1';
    const lockedClass = (opts.lockWhenNotPaid && !paid) ? 'locked' : '';
    for (const it of items) {
      const card = document.createElement('a');
      card.href = it.href || '#';
      card.target = it.target || '_self';
      card.className = `card ${lockedClass}`;
      if (it.type==='video') {
        const v = document.createElement('video');
        v.muted = true; v.loop = true; v.autoplay = false; v.playsInline = true;
        if (it.poster) v.poster = it.poster;
        const src = document.createElement('source');
        src.src = it.src; src.type = it.mime || 'video/mp4';
        v.appendChild(src);
        card.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = it.src;
        if (opts.blur || it.blur) img.classList.add('blur');
        card.appendChild(img);
      }
      if (it.badge){
        const b = document.createElement('div'); b.className='badge'; b.textContent=it.badge; card.appendChild(b);
      }
      if (it.showLock && (!paid)){
        const l = document.createElement('div'); l.className='lock'; l.textContent='Premium'; card.appendChild(l);
      }
      if (it.price){
        const p = document.createElement('div'); p.className='price'; p.textContent=it.price; card.appendChild(p);
      }
      if (it.payIcon){
        const i = document.createElement('div'); i.className='pay-icon';
        i.innerHTML = '<img alt="PayPal" src="https://www.paypalobjects.com/webstatic/icon/pp258.png"/>';
        card.appendChild(i);
      }
      wrap.appendChild(card);
    }
  };
})();
