(function(){
  console.log("🏠 home.v4.js cargado");

  function pickSrc(item){
    if(!item) return null;
    if (typeof item === 'string') return item.startsWith('/')?item:('/'+item);
    if (typeof item === 'object') {
      const cands = [item.url, item.src, item.path, item.file, item.href];
      for (const c of cands) if (c) return c.startsWith('/')?c:('/'+c);
    }
    return null;
  }

  function getPublicImages(){
    // Intenta múltiples nombres por si el dataset usa otro key
    const pools = [
      (typeof CONTENT_PUBLIC!=='undefined' && CONTENT_PUBLIC),
      (window.IBG && (IBG.public || IBG.PUBLIC)),
      (window.CONTENT && (CONTENT.public || CONTENT.PUBLIC)),
      (window.__IBG && (__IBG.PUBLIC || __IBG.public)),
      (window.PUBLIC_CONTENT)
    ].filter(Boolean);

    const first = pools[0] || [];
    const srcs = [];
    for (const it of first){
      const s = pickSrc(it);
      if (s && /\/full\//i.test(s)) srcs.push(s);
    }
    return srcs;
  }

  function sampleUnique(arr, n){
    const a = arr.slice();
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a.slice(0, Math.min(n, a.length));
  }

  function el(tag, cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }

  function buildBanner(){
    const ban = document.getElementById('banner');
    if(!ban) return;
    const imgBox = ban.querySelector('.img');
    // Rotación del fondo a partir de manifest.json (si existe)
    fetch('decorative-images/manifest.json', {cache:'no-store'})
      .then(r=>r.ok?r.json():{images:[]})
      .then(j=>{
        const imgs = (j && j.images && j.images.length? j.images: []).map(x=>'decorative-images/'+x);
        let idx = 0;
        function setBg(){
          const src = imgs.length ? imgs[idx % imgs.length] : 'decorative-images/paradise-beach.jpg';
          imgBox.style.backgroundImage = 'url("'+src+'")';
          idx++;
        }
        setBg();
        if (imgs.length>1) setInterval(setBg, 4000);
      })
      .catch(()=>{ imgBox.style.backgroundImage='url("decorative-images/paradise-beach.jpg")'; });
  }

  function buildCarouselAndGrid(){
    const all = getPublicImages();
    if(!all.length){
      console.warn("⚠️ No hay CONTENT_PUBLIC visible para Home");
      return;
    }
    const car = document.getElementById('carousel30');
    const grid = document.getElementById('grid40');

    const thirty = sampleUnique(all, 30);
    const forty  = sampleUnique(all.filter(x=>!thirty.includes(x)), 40);

    // carrusel
    const track = el('div','track');
    for (const src of thirty){
      const img = el('img'); img.loading='lazy'; img.src = src; img.alt='photo';
      track.appendChild(img);
    }
    car.appendChild(track);
    // auto-scroll simple
    let scrollX = 0;
    setInterval(()=>{
      scrollX = (scrollX + 1) % (track.scrollWidth - car.clientWidth + 1 || 1);
      car.scrollTo(scrollX,0);
    }, 30);

    // grid
    for (const src of forty){
      const a = el('a','grid-item'); a.href=src; a.target='_blank';
      const img = el('img'); img.loading='lazy'; img.src=src; img.alt='photo';
      a.appendChild(img);
      grid.appendChild(a);
    }
  }

  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }

  ready(function(){
    console.log("🌅 DOM listo; Home v4");
    buildBanner();
    buildCarouselAndGrid();
    // anuncios laterales si existe ads.min.js
    if (window.IBG_ADS && typeof IBG_ADS.init==='function') {
      IBG_ADS.init();
    }
  });
})();
