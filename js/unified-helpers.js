'use strict';

// ===== Utilidades =====
(function (global) {
  const isImg = f => /\.(webp|png|jpe?g)$/i.test(f || '');
  const isVid = f => /\.(mp4|webm)$/i.test(f || '');

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const normalizeFull = (p) => {
    if (!p) return p;
    if (p.startsWith('full/')) return '/' + p;
    if (isImg(p)) return '/full/' + p;
    return p.startsWith('/') ? p : '/' + p;
  };

  const normalizeUncensored = (p) => {
    if (!p) return p;
    if (p.startsWith('uncensored/')) return '/' + p;
    if (isImg(p)) return '/uncensored/' + p;
    return p.startsWith('/') ? p : '/' + p;
  };

  const normalizeVideo = (p) => {
    if (!p) return p;
    if (p.startsWith('uncensored-videos/')) return '/' + p;
    if (isVid(p)) return '/uncensored-videos/' + p;
    return p.startsWith('/') ? p : '/' + p;
  };

  // Valida existencia con HEAD (misma procedencia → sin CORS)
  async function pickExisting(paths, want = 20, normalizer = (x)=>x, concurrency = 8) {
    const res = [];
    const all = (paths || []).map(normalizer).filter(Boolean);
    let idx = 0;

    async function worker() {
      while (idx < all.length && res.length < want) {
        const i = idx++;
        const url = all[i];
        try {
          const r = await fetch(url, { method: 'HEAD', cache: 'no-store' });
          if (r.ok) res.push(url);
        } catch (_) { /* ignore */ }
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    return res.slice(0, want);
  }

  function markNew(arr, ratio = 0.3) {
    const n = Math.max(1, Math.floor(arr.length * ratio));
    const idxs = new Set();
    while (idxs.size < n && idxs.size < arr.length) {
      idxs.add(Math.floor(Math.random() * arr.length));
    }
    return arr.map((x, i) => ({ url: x, isNew: idxs.has(i) }));
  }

  function createCard(imgUrl, linkUrl, isNew = false) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = linkUrl || imgUrl;
    a.target = '_blank';
    a.rel = 'noopener';

    a.innerHTML = `
      <div class="thumb">
        <img loading="lazy" decoding="async" src="${imgUrl}" alt="IbizaGirl"/>
        <div class="skeleton"></div>
        ${isNew ? '<span class="badge-new">Nuevo</span>' : ''}
      </div>
    `;
    const img = a.querySelector('img');
    img.addEventListener('load', () => a.querySelector('.skeleton').style.opacity = '0', { once:true });
    img.addEventListener('error', () => { a.style.display = 'none'; }, { once:true });
    return a;
  }

  function createBlurCard(imgUrl, linkUrl) {
    const a = createCard(imgUrl, linkUrl, false);
    a.querySelector('img').classList.add('blurred');
    return a;
  }

  function createVideoCard(videoUrl) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = videoUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <div class="thumb thumb-16x9">
        <video preload="metadata" playsinline muted>
          <source src="${videoUrl}" type="${/\.webm$/i.test(videoUrl) ? 'video/webm' : 'video/mp4'}">
        </video>
        <div class="skeleton"></div>
        <span class="badge-play">▶</span>
      </div>
    `;
    const v = a.querySelector('video');
    v.addEventListener('loadeddata', () => {
      a.querySelector('.skeleton').style.opacity = '0';
      v.muted = true;
    }, { once: true });
    v.addEventListener('error', () => { a.style.display = 'none'; }, { once:true });
    return a;
  }

  global.U = {
    shuffle,
    normalizeFull, normalizeUncensored, normalizeVideo,
    pickExisting, markNew,
    createCard, createBlurCard, createVideoCard
  };
})(window);
