/* daily-rotator.js
   - Gallery: 20 de /full
   - Uncensored: 100 de /uncensored (30% marcadas NEW)
   - Vídeos: 20 de /uncensored-videos
   - Modo: window.__ROTATOR_MODE__ = "daily" | "reload"
   - Overlay: botón “Unlock” que llama a IBG_PAY.buyItem()
*/

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
      let s = 0;
      for (let i=0;i<key.length;i++) s = (s*31 + key.charCodeAt(i)) >>> 0;
      return s;
    }
    return (Math.random()*0xFFFFFFFF) >>> 0;
  }
  const rnd = prng(seedForMode());

  // Descubre pools desde content-data*.js
  function normalizeItem(x) {
    if (typeof x === 'string') return { src: x };
    return x && x.src ? x : null;
  }
  function discover() {
    const buckets = [];
    for (const k in window) {
      try {
        const v = window[k];
        if (Array.isArray(v) && v.length) {
          const n = normalizeItem(v[0]);
          if (n && typeof n.src === 'string') buckets.push(v.map(normalizeItem).filter(Boolean));
        }
      } catch(_) {}
    }
    const flat = buckets.flat();

    const full  = flat.filter(o => /\/full\//.test(o.src));
    const unc   = flat.filter(o => /\/uncensored\//.test(o.src));
    const vids  = flat.filter(o => /\/uncensored-videos\//.test(o.src) || /(\.mp4|\.webm)$/i.test(o.src));

    return { full, unc, vids };
  }

  function sampleN(arr, n) {
    const src = arr.slice();
    const out = [];
    n = Math.min(n, src.length);
    for (let i=0;i<n;i++) {
      const idx = Math.floor(rnd()*src.length);
      out.push(src.splice(idx,1)[0]);
    }
    return out;
  }

  function pickWithNew(arr, total, pctNew=0.3) {
    const chosen = sampleN(arr, total);
    const nNew = Math.floor(chosen.length * pctNew);
    const marks = new Set();
    while (marks.size < nNew && marks.size < chosen.length) {
      marks.add(Math.floor(rnd()*chosen.length));
    }
    return chosen.map((it, i) => ({...it, isNew: marks.has(i)}));
  }

  function euro(n) {
    return n.toLocaleString('es-ES', {style:'currency', currency:'EUR', minimumFractionDigits:2});
  }

  function renderGrid(containerId, items, opts) {
    const root = document.getElementById(containerId);
    if (!root) return;
    root.className = 'grid';
    root.innerHTML = items.map(item => {
      const isPrem = !!opts.censored;
      const price  = opts.kind === 'video' ? 0.30 : 0.10;
      const displaySrc = isPrem ? (item.preview || '/img/preview-blur.webp') : item.src;

      const priceText = euro(price).replace('€','€').replace('.',',');
      const newBadge  = item.isNew ? `<span class="badge badge-new">NEW</span>` : '';

      const lockBtn = isPrem ? `
        <button class="unlock-btn" data-kind="${opts.kind||'photo'}" data-src="${item.src}" data-amount="${price}">
          <svg class="i i-lock"><use href="#icon-lock"></use></svg>
          <span class="price">${priceText}</span>
        </button>
      ` : '';

      const media = (opts.kind === 'video')
        ? `<video class="thumb ${isPrem?'censored':''}" preload="metadata" muted playsinline poster="/img/video-poster-blur.webp"></video>`
        : `<img class="thumb ${isPrem?'censored':''}" src="${displaySrc}" loading="lazy" alt="">`;

      return `
        <div class="card">
          <div class="thumb-wrap">
            ${media}
            ${newBadge}
            ${lockBtn}
          </div>
        </div>`;
    }).join('');

    // Bind botones Unlock
    root.querySelectorAll('.unlock-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const src  = btn.getAttribute('data-src');
        const kind = btn.getAttribute('data-kind') || 'photo';
        const amt  = parseFloat(btn.getAttribute('data-amount') || '0.10');
        if (window.IBG_PAY && typeof window.IBG_PAY.buyItem === 'function') {
          window.IBG_PAY.buyItem({ src, kind, amount: amt, currency: 'EUR' });
        } else {
          alert('Pago no disponible (IBG_PAY no cargado).');
        }
      });
    });
  }

  // Ejecutar
  document.addEventListener('DOMContentLoaded', () => {
    const { full, unc, vids } = discover();

    const gallery20 = sampleN(full, 20);
    const photos100 = pickWithNew(unc, 100, 0.30);
    const videos20  = pickWithNew(vids, 20, 0.30).map(v => ({...v, kind:'video'}));

    // Guarda selección por si la quieres inspeccionar en consola
    window.IBG_CURRENT = { gallery: gallery20, uncensored: photos100, videos: videos20 };

    renderGrid('galleryGrid',   gallery20, { censored:false, kind:'photo' });
    renderGrid('uncensoredGrid',photos100, { censored:true,  kind:'photo' });
    renderGrid('videosGrid',    videos20,  { censored:true,  kind:'video' });
  });
})();

