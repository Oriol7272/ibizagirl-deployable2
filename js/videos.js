(function(){
  const { RNG, UCAPI, Paywall= {hasSub:()=>false, isLifetime:()=>false} } = window;
  const POOL = window.PREMIUM_VIDEOS_POOL || [];
  function select(count){
    const seed = RNG.seedFrom(new Date().toDateString());
    const rand = RNG.xorshift32(seed + Math.floor(Math.random()*1e6));
    return RNG.pickN(POOL, count, rand).map(u=>UCAPI.normalize(u,'video'));
  }
  function renderGrid(items){
    const grid=document.querySelector('#videos-grid'); if(!grid) return;
    grid.innerHTML='';
    const frag=document.createDocumentFragment();
    const locked = !(Paywall && (Paywall.hasSub && Paywall.hasSub()) || (Paywall.isLifetime && Paywall.isLifetime()));
    items.forEach((it)=>{
      const card=UCAPI.createCard(it,{type:'video'});
      if(locked){ card.classList.add('locked'); }
      const price=document.createElement('span'); price.className='price-badge'; price.textContent='€0.30';
      (card.querySelector('.thumb')||card).appendChild(price);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    renderGrid(select(20));
    const side=document.querySelector('#side-ads'); if(window.Ads && side) window.Ads.mountSideAds(side);
  });
})();
