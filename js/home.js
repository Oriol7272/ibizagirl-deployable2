(function(){
  const { RNG, UCAPI } = window;
  const POOL = (window.FULL_IMAGES_POOL || window.FULL || []);
  function select(count){
    const seed = RNG.seedFrom(new Date().toDateString());
    const rand = RNG.xorshift32(seed + Math.floor(Math.random()*1e6)); // cambia en recarga
    return RNG.pickN(POOL, count, rand).map(u=>UCAPI.normalize(u,'image'));
  }
  function renderCarousel(items){
    const root=document.querySelector('#home-carousel'); if(!root) return;
    root.innerHTML='';
    const track=document.createElement('div'); track.className='carousel-track';
    items.forEach(it=>{
      const slide=document.createElement('div'); slide.className='slide';
      const img=document.createElement('img'); img.src=it.thumb; img.loading='lazy'; img.decoding='async';
      slide.appendChild(img); track.appendChild(slide);
    });
    root.appendChild(track);
    // auto-scroll simple
    let i=0; setInterval(()=>{ i=(i+1)%items.length; track.style.transform=`translateX(-${i*100}%)`; }, 3000);
  }
  function renderGrid(items){
    const grid=document.querySelector('#home-grid'); if(!grid) return;
    grid.innerHTML='';
    const frag=document.createDocumentFragment();
    items.forEach(it=>{
      const card=UCAPI.createCard(it,{type:'image'});
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    const chosen = select(20);
    renderCarousel(chosen);
    renderGrid(chosen);
    // monta ads laterales si existe contenedor
    const side=document.querySelector('#side-ads'); if(window.Ads && side) window.Ads.mountSideAds(side);
  });
})();
