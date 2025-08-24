(function(){
  const { RNG, UCAPI, Paywall= {hasSub:()=>false, isLifetime:()=>false} } = window;
  const P1 = window.PREMIUM_IMAGES_PART1 || []; const P2 = window.PREMIUM_IMAGES_PART2 || [];
  const POOL = [...P1, ...P2];
  function select(count){
    const seed = RNG.seedFrom(new Date().toDateString());
    const rand = RNG.xorshift32(seed + Math.floor(Math.random()*1e6));
    return RNG.pickN(POOL, count, rand).map(u=>UCAPI.normalize(u,'image'));
  }
  function renderGrid(items){
    const grid=document.querySelector('#premium-grid'); if(!grid) return;
    grid.innerHTML='';
    const frag=document.createDocumentFragment();
    const locked = !(Paywall && (Paywall.hasSub && Paywall.hasSub()) || (Paywall.isLifetime && Paywall.isLifetime()));
    const newCount=Math.floor(items.length*0.30);
    const markNewIdx=new Set(); while(markNewIdx.size<newCount) markNewIdx.add(Math.floor(Math.random()*items.length));
    items.forEach((it,idx)=>{
      const card=UCAPI.createCard(it,{type:'image'});
      if(locked){ card.classList.add('locked'); }
      if(markNewIdx.has(idx)){
        const b=document.createElement('span'); b.className='badge-new'; b.textContent='NEW';
        (card.querySelector('.thumb')||card).appendChild(b);
      }
      const price=document.createElement('span'); price.className='price-badge'; price.textContent='€0.10';
      (card.querySelector('.thumb')||card).appendChild(price);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    renderGrid(select(100));
    const side=document.querySelector('#side-ads'); if(window.Ads && side) window.Ads.mountSideAds(side);
  });
})();
