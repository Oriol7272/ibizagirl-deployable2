(function(){
  "use strict";
  const HERO = document.getElementById('hero');
  const HERO_BG = HERO ? HERO.querySelector('.hero-bg') : null;
  const STRIP = document.getElementById('carousel-strip');
  const GALLERY = document.getElementById('gallery');

  function heroRotation(){
    const base = '/decorative-images/';
    const list = [];
    try{
      const M = window.__DECORATIVE_MANIFEST || {};
      if(Array.isArray(M.items)){ M.items.forEach(x=>{ if(typeof x==='string') list.push(base+encodeURIComponent(x).replace(/%2F/g,'/')); }); }
      else if (M.bg){ list.push(base+encodeURIComponent(M.bg).replace(/%2F/g,'/')); }
    }catch(e){}
    if(!list.length){ list.push(base+'paradise-beach.png'); }
    if(!HERO) return;
    let i=0;
    const apply = ()=>{ HERO.style.background = `url("${list[i]}") center/cover no-repeat`; i=(i+1)%list.length; };
    apply(); setInterval(apply,8000);
  }

  const sample=(a,n)=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a.slice(0,n); };

  async function getFullList(){
    try{
      const res = await fetch('/content-data2.js', {cache:'no-store'});
      if(!res.ok) throw 0;
      const txt = await res.text();
      const m = txt.match(/\/full\/[A-Za-z0-9._-]+\.webp/gi) || [];
      return Array.from(new Set(m)).map(s=>s.replace(/["'`]/g,''));
    }catch(e){ console.warn('[home] sin content-data2'); return []; }
  }

  function paintCarousel(urls){
    if(!STRIP) return;
    STRIP.innerHTML='';
    urls.forEach(u=>{ const img=new Image(); img.decoding='async'; img.loading='lazy'; img.src=u; STRIP.appendChild(img); });
    const prev=document.querySelector('.carousel .prev');
    const next=document.querySelector('.carousel .next');
    const step=()=>Math.max(200, STRIP.clientWidth*.5);
    prev && prev.addEventListener('click', ()=>STRIP.scrollBy({left:-step(),behavior:'smooth'}));
    next && next.addEventListener('click', ()=>STRIP.scrollBy({left:+step(),behavior:'smooth'}));
  }

  function paintGallery(urls){
    if(!GALLERY) return;
    GALLERY.innerHTML='';
    urls.forEach(u=>{ const img=new Image(); img.decoding='async'; img.loading='lazy'; img.src=u; GALLERY.appendChild(img); });
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    heroRotation();
    const pool = await getFullList();
    const c = sample(pool,40);
    const g = sample(pool.filter(x=>!c.includes(x)),40);
    paintCarousel(c.length?c:pool.slice(0,40));
    paintGallery(g.length?g:(pool.length?sample(pool,40):[]));
  });
})();
