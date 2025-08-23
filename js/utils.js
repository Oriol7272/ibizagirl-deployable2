/* utils.js */
window.AppUtils = (() => {
  // Semilla diaria estable (cambia cada día)
  const todaySeed = () => {
    const d = new Date(); return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  };
  // PRNG simple basado en xmur3 + sfc32
  const xmur3 = (str) => { for(var i=0,h=1779033703^str.length;i<str.length;i++) h=Math.imul(h^str.charCodeAt(i),3432918353),h=h<<13|h>>>19; return ()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0} };
  const sfc32 = (a,b,c,d)=>()=>{a|=0;b|=0;c|=0;d|=0;var t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=(c<<21|c>>>11);c=c+t|0;return (t>>>0)/4294967296};
  const rngFrom = (seedStr) => { const seed = xmur3(seedStr); return sfc32(seed(),seed(),seed(),seed()); };

  const pickN = (arr, n, seedStr=null) => {
    const r = seedStr ? rngFrom(seedStr) : Math.random;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor((r() || Math.random()) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, Math.min(n, a.length));
  };

  // Encuentra thumbs que tienen <a href="..."> y mete <img> real (arregla "Cargando...")
  const hydrateAnchorsToImgs = (root=document) => {
    const anchors = root.querySelectorAll('.card a[href]');
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      if (!/\.(jpg|jpeg|png|webp|gif|mp4|m3u8|webm)$/i.test(href)) return;
      const card = a.closest('.card') || a.parentElement;
      if (!card) return;
      let img = card.querySelector('img.thumb');
      if (!img) {
        img = document.createElement('img');
        img.className = 'thumb';
        img.loading = 'lazy';
        a.prepend(img);
      }
      img.src = href;
      img.alt = a.getAttribute('title') || 'image';
      img.onerror = () => { card.classList.add('thumb-error'); card.classList.remove('loading'); };
      img.onload  = () => { card.classList.remove('loading'); };
    });
  };

  return { todaySeed, pickN, hydrateAnchorsToImgs };
})();
