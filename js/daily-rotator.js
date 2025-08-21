// js/daily-rotator.js
(() => {
  // 1) Unimos los pools de content-data*.js (debes cargarlos antes en <script>).
  // Admite arrays de strings (rutas) o de objetos { id, kind, src }.
  const all = [];
  for (const k of Object.keys(window)) {
    if (/^CONTENT_DATA/i.test(k) && Array.isArray(window[k])) all.push(...window[k]);
  }
  if (!all.length) { console.warn('No se detectaron pools en content-data*.js'); return; }

  const normItem = (x) => {
    if (typeof x === 'string') {
      const src = x;
      const id = src.split('/').pop();
      const kind = /\.(mp4|webm)$/i.test(src) ? 'video' : 'image';
      const price = kind === 'image' ? 0.10 : 0.30; // precios por defecto
      return { id, kind, src, price };
    }
    // objeto ya formado
    const price = x.price ?? (x.kind === 'video' ? 0.30 : 0.10);
    return { ...x, price };
  };

  const pool = all.map(normItem);

  // 2) Semilla diaria (YYYY-MM-DD) o aleatoria por recarga
  const mode = window.__ROTATOR_MODE__ || 'daily'; // 'daily' | 'reload'
  const seedStr = mode === 'daily'
    ? new Date().toISOString().slice(0,10)
    : String(Math.random());

  // PRNG determinista
  function xmur3(str){for(var i=0,h=1779033703^str.length;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),3432918353),h=h<<13|h>>>19;return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0}}
  function mulberry32(a){return function(){var t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
  const rand = mulberry32(xmur3(seedStr)());

  function shuffled(arr) {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--) {
      const j = Math.floor(rand()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  const s = shuffled(pool);

  // 3) Selecciones
  const gallery = s.filter(o => /\/full\//i.test(o.src)).slice(0,20);
  const uncensored = s.filter(o => /\/uncensored\//i.test(o.src)).slice(0,100);
  const videos = s.filter(o => /\/uncensored-videos\//i.test(o.src)).slice(0,20);

  // 30% NEW en uncensored
  const newCount = Math.floor(uncensored.length * 0.30);
  for (let i=0;i<newCount;i++) uncensored[i].isNew = true;

  // 4) Render helpers
  const money = (n) => (Number(n).toFixed(2)).replace('.', ',') + '€';

  const cardHTML = (o) => {
    const isPay = /\/uncensored(-videos)?\//i.test(o.src);
    const cls = ['thumb', isPay ? 'censored' : ''].join(' ').trim();
    const pay = isPay ? `
      <div class="badges">
        <span class="badge price">${money(o.price)}</span>
        <button class="badge pay" onclick="window.renderPayButton('${o.id}','${o.kind}','${o.src}', ${o.price})">
          <svg class="icon" viewBox="0 0 24 24"><use href="#icon-lock"/></svg> Pagar
        </button>
      </div>
      <div id="pp-${o.id}" class="paypal-ctr"></div>
    ` : '';
    const ribbon = o.isNew ? `<span class="new-ribbon">NEW</span>` : '';
    return `
      <div class="card">
        ${ribbon}
        <img class="${cls}" src="${o.src}" alt="${o.id}" loading="lazy">
        ${pay}
      </div>
    `;
  };

  const byId = (id) => document.getElementById(id);
  const inject = (id, items) => {
    const el = byId(id);
    if (!el) return;
    el.classList.add('grid');
    el.innerHTML = items.map(cardHTML).join('');
  };

  // 5) Pintar en contenedores (crea divs con estos IDs en tus páginas)
  inject('galleryGrid', gallery);         // 20 de /full/
  inject('uncensoredGrid', uncensored);   // 100 de /uncensored/ (30% NEW)
  inject('videosGrid', videos);           // 20 de /uncensored-videos/

  // Exponer por si necesitas depurar
  window.IBG_CURRENT = { gallery, uncensored, videos, seed: seedStr, mode };
})();

