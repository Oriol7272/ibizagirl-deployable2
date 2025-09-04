/* Home v5: navbar + hero + carrusel + grid aleatorio + laterales ads */
(function(){
  const log = (...a)=>console.log("[HOME]", ...a);

  // Robust fetch of public image list (from content-data2.js)
  function findPublicImages(){
    // 1) Ideal: window.CONTENT_PUBLIC with a property that is an array of '/full/' images
    const cand = (typeof window!=='undefined' ? window.CONTENT_PUBLIC : null) || {};
    const scanObj = (obj)=>{
      for(const k of Object.keys(obj||{})){
        const v = obj[k];
        if(Array.isArray(v) && v.length && typeof v[0]==='string' && v[0].includes('/full/')) return v;
        if(v && typeof v==='object'){
          const inner = scanObj(v); if(inner) return inner;
        }
      }
      return null;
    };
    let arr = scanObj(cand);
    if(arr) return arr;

    // 2) Fallback: scan window for any array of '/full/' strings
    try{
      for(const k of Object.getOwnPropertyNames(window)){
        const v = window[k];
        if(Array.isArray(v) && v.length && typeof v[0]==='string' && v[0].includes('/full/')) return v;
        if(v && typeof v==='object'){
          const inner = scanObj(v); if(inner) return inner;
        }
      }
    }catch{}
    return null;
  }

  function pickRandom(arr, n){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];}
    return a.slice(0, n);
  }

  function el(tag, props={}, children=[]){
    const e = document.createElement(tag);
    Object.assign(e, props);
    for(const c of (Array.isArray(children)?children:[children])){
      if(typeof c==='string') e.appendChild(document.createTextNode(c));
      else if(c) e.appendChild(c);
    }
    return e;
  }

  function buildNav(){
    return el('header',{className:'header'},
      el('div',{className:'container'},
        el('nav',{className:'nav'},[
          el('div',{className:'brand'},'ibizagirl.pics'),
          el('div',{className:'menu'},[
            el('a',{href:'/'},'Home'),
            el('a',{href:'/premium.html'},'Premium'),
            el('a',{href:'/videos.html'},'Videos'),
            el('a',{href:'/subscriptions.html'},'Subscriptions'),
          ])
        ])
      )
    );
  }

  function buildHero(){
    return el('section',{className:'hero'},
      el('div',{className:'container'},[
        el('h1',{},'ibizagirl.pics'),
        el('p',{},'Bienvenidos al paraíso')
      ])
    );
  }

  function buildAdsBox(){
    const box = el('div',{className:'box'});
    // Inyección simple de redes (si existen en env.js)
    const E = (window.IBG_ENV||{});
    const frag = document.createElement('div');

    // JuicyAds (banner vertical)
    if(E.JUICYADS_ZONE){
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://poweredby.jads.co/js/jads.js`;
      s.onload = ()=>{ try{
        const d=document.createElement('ins');
        d.className="jads-cid";
        d.setAttribute('data-cid', E.JUICYADS_ZONE);
        d.setAttribute('data-target','_blank');
        d.style.display='block';
        frag.appendChild(d);
        if(window.jads) window.jads.initAds();
      }catch{} };
      frag.appendChild(s);
    }

    // ExoClick (fallback)
    if(E.EXOCLICK_ZONE){
      const s=document.createElement('script');
      s.async=true;
      s.src='https://a.exoclick.com/tag.php';
      s.setAttribute('data-zoneid', E.EXOCLICK_ZONE);
      frag.appendChild(s);
    }

    box.appendChild(frag);
    return box;
  }

  function buildMain(images){
    const left = el('aside',{className:'sidebar'}, buildAdsBox());
    const right = el('aside',{className:'sidebar'}, buildAdsBox());

    // Carrusel (8 imágenes)
    const carousel = el('div',{className:'carousel'});
    for(const src of pickRandom(images, Math.min(8, images.length))){
      const img = el('img',{loading:'lazy', decoding:'async'});
      img.src = src;
      img.alt = 'preview';
      carousel.appendChild(img);
    }

    // Grid aleatoria (40 imágenes)
    const grid = el('div',{className:'grid'});
    for(const src of pickRandom(images, Math.min(40, images.length))){
      const img = el('img',{loading:'lazy', decoding:'async'});
      img.src = src;
      img.alt = 'gallery';
      grid.appendChild(img);
    }

    const center = el('main',{},
      el('div',{className:'container'},[
        el('section',{className:'section'},[ el('h2',{},'Explora'), carousel ]),
        el('section',{className:'section'},[ el('h2',{},'Galería'), grid ])
      ])
    );

    const wrapper = el('div',{className:'main-grid'},[ left, center, right ]);
    return wrapper;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    log("DOM listo; montando Home v5");
    const imgs = findPublicImages();
    if(!imgs || !imgs.length){
      console.warn("No se detectó CONTENT_PUBLIC; Home mostrará layout sin imágenes.");
    }

    // Punto de montaje (creamos un contenedor arriba del body si no existe)
    let mount = document.getElementById('app-home');
    if(!mount){
      mount = document.createElement('div'); mount.id='app-home';
      document.body.prepend(mount);
    }

    mount.appendChild(buildNav());
    mount.appendChild(buildHero());
    if(imgs && imgs.length){
      mount.appendChild(buildMain(imgs));
    }
  });
})();
