(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  function pickN(arr, n, seedStr){
    // misma selección por día o por recarga usando seed sencilla
    const seed = (seedStr||'x').split('').reduce((a,c)=>a+c.charCodeAt(0),0) ^ Date.now();
    const tmp = arr.slice();
    for(let i=tmp.length-1;i>0;i--){
      const j = Math.floor((Math.sin(seed+i)*10000)%1 * (i+1));
      [tmp[i],tmp[j]]=[tmp[j],tmp[i]];
    }
    return tmp.slice(0, n);
  }
  function cardHTML(item){
    const src = item.thumb || item.src || item.url;
    const title = item.title || '';
    return `
      <figure class="card">
        <img loading="lazy" src="${src}" alt="${title}">
        <figcaption>${title||''}</figcaption>
      </figure>`;
  }
  document.addEventListener('DOMContentLoaded', async () => {
    const grid = $('#home-grid') || ( ()=>{ const g=document.createElement('section'); g.id='home-grid'; document.body.appendChild(g); return g; })();
    let pool = [];
    try {
      if (window.ContentAPI?.getTodaysContent) {
        const c = window.ContentAPI.getTodaysContent();
        pool = [...(c.publicPhotos||[]), ...(c.premiumPhotos||[])];
      } else if (window.FULL_IMAGES_POOL) {
        pool = window.FULL_IMAGES_POOL;
      }
    } catch(_) {}
    const items = pickN(pool, 20, 'home');
    grid.innerHTML = items.map(cardHTML).join('');
  });
})();
