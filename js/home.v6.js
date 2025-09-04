(function(){
  const log=(...a)=>console.log("[HOME v6]",...a);
  const isArray=(x)=>Array.isArray(x)&&x.length>0&&typeof x[0]==='string';
  const pick=(arr,n)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n);};
  const el=(t,p={},c=[])=>{const e=document.createElement(t);Object.assign(e,p);(Array.isArray(c)?c:[c]).forEach(k=>{if(typeof k==='string')e.appendChild(document.createTextNode(k));else if(k)e.appendChild(k)});return e;}

  function nav(){return el('header',{className:'header'},
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
  );}
  const hero=()=>el('section',{className:'hero'},
    el('div',{className:'container'},[el('h1',{},'ibizagirl.pics'),el('p',{},'Bienvenidos al paraíso')])
  );
  const ads=()=>el('aside',{className:'sidebar'},el('div',{className:'box ads-slot'},'Ad slot'));

  function main(images){
    const left=ads(), right=ads();
    const car=el('div',{className:'carousel'});
    for(const src of pick(images, Math.min(8, images.length))){ car.appendChild(el('img',{src,loading:'lazy',decoding:'async',alt:'preview'})); }
    const grid=el('div',{className:'grid'});
    for(const src of pick(images, Math.min(40, images.length))){ grid.appendChild(el('img',{src,loading:'lazy',decoding:'async',alt:'gallery'})); }
    const center=el('main',{},el('div',{className:'container'},[
      el('section',{className:'section'},[el('h2',{},'Explora'),car]),
      el('section',{className:'section'},[el('h2',{},'Galería'),grid]),
    ]));
    return el('div',{className:'main-grid'},[left,center,right]);
  }

  async function waitList(ms=5000){
    const t0=Date.now();
    while(Date.now()-t0<ms){
      const arr = window.CONTENT_PUBLIC_IMAGES || window.CONTENT_PUBLIC;
      if(isArray(arr)) return arr;
      await new Promise(r=>setTimeout(r,120));
    }
    return null;
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    log("DOM listo");
    let mount=document.getElementById('app-home'); if(!mount){mount=document.createElement('div');mount.id='app-home';document.body.prepend(mount);}
    mount.appendChild(nav()); mount.appendChild(hero());
    const list = await waitList(6000);
    if(!isArray(list)){ console.warn("[HOME v6] no hay lista /full/ (CONTENT_PUBLIC)"); return; }
    mount.appendChild(main(list));
    log("render con", list.length, "imágenes");
  });
})();
