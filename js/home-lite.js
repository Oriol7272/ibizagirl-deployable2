(function(g,d){
  function pick(arr,n){ arr=(arr||[]).slice(); for(let i=arr.length-1;i>0;i--){ const r=Math.floor(Math.random()*(i+1)); [arr[i],arr[r]]=[arr[r],arr[i]]; } return arr.slice(0,n); }
  function ensureImg(url){ const img=d.createElement('img'); img.loading='lazy'; img.src=url; return img; }
  function renderCarousel(host, items){
    if(!host||!items||!items.length) return;
    host.innerHTML='';
    const track=d.createElement('div'); track.className='carousel-track';
    items.forEach(u=>{ const s=d.createElement('div'); s.className='carousel-slide'; s.appendChild(ensureImg(typeof u==='string'?u:(u.thumb||u.url))); track.appendChild(s); });
    host.appendChild(track);
    let i=0; setInterval(()=>{ i=(i+1)%items.length; track.style.transform='translateX(' + (i*-100) + '%)'; }, 4000);
  }
  function renderGrid(host, items){
    if(!host) return;
    host.innerHTML='';
    const frag=d.createDocumentFragment();
    (items||[]).forEach(u=>{
      const card=d.createElement('div'); card.className='card is-locked';
      const a=d.createElement('a'); a.href='#';
      const t=d.createElement('div'); t.className='thumb';
      t.appendChild(ensureImg(typeof u==='string'?u:(u.thumb||u.url)));
      a.appendChild(t); card.appendChild(a); frag.appendChild(card);
    });
    host.appendChild(frag);
  }
  d.addEventListener('DOMContentLoaded', function(){
    const fullPool=(g.ContentAPI && ContentAPI.getAllPublicImages)? ContentAPI.getAllPublicImages() : (g.FULL_IMAGES_POOL||g.FULL_POOL||[]);
    const top20 = pick(fullPool, 20);
    renderCarousel(d.getElementById('home-carousel'), top20);
    renderGrid(d.getElementById('home-gallery-grid'), top20);
  });
})(window,document);
