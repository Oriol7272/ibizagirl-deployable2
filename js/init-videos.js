(function(){
  function pickRandom(arr, n){
    const a=[...arr]; const out=[];
    while (a.length && out.length<n){ out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]); }
    return out;
  }
  function videosPool(){
    return (window.PREMIUM_VIDEOS_POOL || window.VIDEOS_POOL || []);
  }
  function render(selector, items){
    const grid = document.querySelector(selector);
    if(!grid) return;
    grid.innerHTML='';
    items.forEach(src=>{
      const card=document.createElement('div');
      card.className='card video';
      const video=document.createElement('video');
      video.src=src; video.controls=true; video.preload='metadata';
      const price=document.createElement('div');
      price.className='price-badge'; price.textContent='0,30 €';
      const btn=document.createElement('div');
      btn.className='mini-pp';
      const container=document.createElement('div'); container.className='pp-container';
      btn.appendChild(container);
      card.appendChild(video); card.appendChild(price); card.appendChild(btn);
      grid.appendChild(card);
      // botón PayPal pequeño
      if(window.Payments){
        Payments.renderCheckout({ container, amount: 0.30, description: 'Vídeo IbizaGirl' }).catch(()=>{});
      }
    });
  }
  document.addEventListener('DOMContentLoaded', async ()=>{
    try { await (window.Payments && Payments.init()); } catch(_){}
    const pool=videosPool();
    if(pool.length){ render('.gallery, .grid, .videos-grid', pickRandom(pool, 20)); }
  });
})();
