(function(){
  function pickRandom(arr, n){
    const a=[...arr]; const out=[];
    while (a.length && out.length<n){ out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]); }
    return out;
  }
  function premiumPool(){
    const p1 = window.PREMIUM_IMAGES_PART1 || [];
    const p2 = window.PREMIUM_IMAGES_PART2 || [];
    return [...p1, ...p2];
  }
  function renderPremium(selector, items){
    const grid = document.querySelector(selector);
    if(!grid) return;
    grid.innerHTML = '';
    const nNew = Math.floor(items.length * 0.30);
    const newIdx = new Set(pickRandom(items.map((_,i)=>i), nNew));
    items.forEach((src, i)=>{
      const card = document.createElement('div');
      card.className = 'card premium';
      const a = document.createElement('a');
      a.href = src; a.target='_blank'; a.rel='noopener';
      const img = document.createElement('img'); img.loading='lazy'; img.src=src; img.alt='img';
      a.appendChild(img);
      if(newIdx.has(i)){
        const badge=document.createElement('span');
        badge.className='badge-new'; badge.textContent='Nuevo';
        a.appendChild(badge);
      }
      card.appendChild(a);
      grid.appendChild(card);
    });
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    const pool = premiumPool();
    if (pool.length) {
      renderPremium('.gallery, .grid, .premium-grid', pickRandom(pool, 100));
    }
  });
})();
