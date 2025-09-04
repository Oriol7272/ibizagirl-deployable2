(function(){
  const log = (...a)=>console.log("[HOME v6]", ...a);

  function pickRandom(arr, n){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];}
    return a.slice(0, n);
  }
  const el=(t,p={},c=[])=>{const e=document.createElement(t);Object.assign(e,p);(Array.isArray(c)?c:[c]).forEach(k=>{if(typeof k==='string')e.appendChild(document.createTextNode(k));else if(k)e.appendChild(k)});return e;}

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
  const buildHero=()=>el('section',{className:'hero'},el('div',{className:'container'},[el('h1',{},'ibizagirl.pics'),el('p',{},'Bienvenidos al paraíso')]));
  const buildAds=()=>el('aside',{className:'sidebar'},el('div',{className:'box ads-slot'},'Ad slot'));

  function buildMain(images){
    const left=buildAds(), right=buildAds();
    const carousel=el('div',{className:'carousel'});
    for(const src of pickRandom(images, Math.min(8, images.length))){
      carousel.appendChild(el('img',{loading:'lazy',decoding:'async',src,alt:'preview'}));
    }
    const grid=el('div',{className:'grid'});
    for(const src of pickRandom(images, Math.min(40, images.length))){
      grid.appendChild(el('img',{loading:'lazy',decoding:'async',src,alt:'gallery'}));
    }
    const center = el('main',{},el('div',{className:'container'},[
      el('section',{className:'section'},[el('h2',{},'Explora'),carousel]),
      el('section',{className:'section'},[el('h2',{},'Galería'),grid]),
    ]));
    return el('div',{className:'main-grid'},[left,center,right]);
  }

  async function waitForImages(ms=1200){
    const start=Date.now();
    while(Date.now()-start < ms){
      const arr = window.CONTENT_PUBLIC_IMAGES || window.CONTENT_PUBLIC;
      if(Array.isArray(arr) && arr.length) return arr;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    log("DOM listo; esperando imágenes del bridge…");
    let mount = document.getElementById('app-home');
    if(!mount){ mount=document.createElement('div'); mount.id='app-home'; document.body.prepend(mount); }

    mount.appendChild(buildNav());
    mount.appendChild(buildHero());

    const images = await waitForImages(3000);
    if(!images){ console.warn("No hay CONTENT_PUBLIC_IMAGES; se muestra layout sin imágenes."); return; }
    mount.appendChild(buildMain(images));
    log("Montado con", images.length, "imágenes");
  });
})();
