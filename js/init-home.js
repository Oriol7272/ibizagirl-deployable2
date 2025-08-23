(function(){
  function pickRandom(arr, n){
    const a=[...arr]; const out=[];
    while (a.length && out.length<n){ out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]); }
    return out;
  }
  function unifyFullPool(){
    if (window.FULL_IMAGES_POOL) return [...window.FULL_IMAGES_POOL];
    if (window.ContentAPI && ContentAPI.getFullImages) return ContentAPI.getFullImages();
    return [];
  }
  function renderGallery(selector, items){
    const grid = document.querySelector(selector);
    if(!grid) return;
    grid.innerHTML = '';
    items.forEach(src=>{
      const card = document.createElement('div');
      card.className = 'card';
      const a = document.createElement('a');
      a.href = src; a.target = '_blank'; a.rel='noopener';
      const img = document.createElement('img');
      img.loading='lazy'; img.src = src; img.alt='img';
      a.appendChild(img);
      card.appendChild(a);
      grid.appendChild(card);
    });
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    const pool = unifyFullPool();
    if (pool.length) {
      renderGallery('.gallery, .grid, .home-grid', pickRandom(pool, 20));
    }
  });
})();
