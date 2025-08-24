(function(g){
  const UCAPI = g.UCAPI || {};
  const I18N = g.I18N || { t:(x)=>x };

  function seedShuffle(arr, salt){
    if(!arr) return [];
    if(UCAPI.dailyShuffle) return UCAPI.dailyShuffle(arr, salt);
    return [...arr].sort(()=>Math.random()-0.5);
  }

  function mountCarousel(el, items){
    el.innerHTML = '';
    if(!items || !items.length) return;
    const track = document.createElement('div');
    track.className = 'carousel-track';
    items.forEach((it)=>{
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = (typeof it === 'string') ? it : (it.thumb || it.url || it.src);
      img.alt = 'IbizaGirl';
      slide.appendChild(img);
      track.appendChild(slide);
    });
    el.appendChild(track);
    let idx = 0;
    setInterval(()=>{ idx = (idx + 1) % items.length; track.style.transform = 'translateX(-'+(idx*100)+'%)'; }, 4000);
  }

  function markNewBadges(cardElems, ratio){
    const total = cardElems.length;
    const count = Math.max(1, Math.floor(total*ratio));
    const picked = new Set();
    while(picked.size < count){ picked.add(Math.floor(Math.random()*total)); }
    [...picked].forEach(i=>{
      const el = cardElems[i];
      const b = document.createElement('span');
      b.className = 'badge new';
      b.textContent = I18N.t('new') || 'NEW';
      el.querySelector('.thumb')?.appendChild(b);
    });
  }

  function renderCards(gridEl, items, type){
    gridEl.innerHTML='';
    const frag = document.createDocumentFragment();
    (items||[]).forEach((raw)=>{
      const item = (typeof raw==='string') ? {url:raw, thumb:raw, type} : {...raw, type};
      const card = (UCAPI.createCard) ? UCAPI.createCard(item, {type}) : document.createElement('div');
      if(!card.classList.contains('card')) card.classList.add('card');
      try{
        const locked = card.classList.contains('is-locked') || !(g.Paywall && (Paywall.hasSub && Paywall.hasSub()));
        if(locked){
          const price=document.createElement('span');
          price.className='price-badge';
          price.textContent = (type==='video') ? '€0.30' : '€0.10';
          (card.querySelector('.thumb')||card).appendChild(price);
        }
      }catch(e){}
      frag.appendChild(card);
    });
    gridEl.appendChild(frag);
    return Array.from(gridEl.children);
  }

  function init(){
    const fullPool = (UCAPI.getFullPool) ? UCAPI.getFullPool() : [];
    const day20 = seedShuffle(fullPool, 'home:full').slice(0,20);
    mountCarousel(document.getElementById('home-carousel'), day20);
    renderCards(document.getElementById('home-gallery-grid'), day20, 'image');

    const premiumPool = (UCAPI.getPremiumImagesPool) ? UCAPI.getPremiumImagesPool() : [];
    const img100 = seedShuffle(premiumPool, 'home:premium').slice(0,100);
    const imgCards = renderCards(document.getElementById('premium-images-grid'), img100, 'image');
    markNewBadges(imgCards, 0.30);

    const videoPool = (UCAPI.getPremiumVideosPool) ? UCAPI.getPremiumVideosPool() : [];
    const vid20 = seedShuffle(videoPool, 'home:videos').slice(0,20);
    renderCards(document.getElementById('premium-videos-grid'), vid20, 'video');
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
