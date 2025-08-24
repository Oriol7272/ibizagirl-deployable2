(function(){
  const ready = (fn)=> (document.readyState!=='loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);

  ready(()=>{
    // Forzar 4 columnas centradas
    document.querySelectorAll('#gallery,.gallery,.gallery-grid,#premium-grid,#videos-grid,.section-grid')
      .forEach(g=>{ g.classList.add('gallery-grid'); g.style.margin='1rem auto'; });

    // Inyectar CSS si la página no tenía el <link>
    if (!document.querySelector('link[href$="ibg-layout.css"]')){
      const l=document.createElement('link'); l.rel='stylesheet'; l.href='/ibg-layout.css'; document.head.appendChild(l);
    }

    // Carrusel mínimo
    let wrap = document.querySelector('#home-carousel');
    if (!wrap){
      const after = document.querySelector('.page') || document.querySelector('main') || document.body;
      const sec = document.createElement('section'); sec.className='carousel';
      wrap = document.createElement('div'); wrap.id='home-carousel';
      sec.appendChild(wrap);
      after.parentNode.insertBefore(sec, after.nextSibling);
    }
    if (!wrap.dataset.built){
      const track = document.createElement('div'); track.className='track';
      const fall = ['/full/01.jpg','/full/02.jpg','/full/03.jpg','/full/04.jpg'];
      const list = (window.PublicImages && window.PublicImages.slice(0,8)) || fall;
      list.forEach(u=>{
        const s=document.createElement('div'); s.className='slide';
        const im=document.createElement('img'); im.loading='lazy'; im.decoding='async'; im.src=u;
        s.appendChild(im); track.appendChild(s);
      });
      wrap.appendChild(track);
      wrap.dataset.built='1';
    }

    // Paywall: aplicar clases si ya es premium
    try{
      if (localStorage.getItem('IBG_LIFETIME')==='1' || localStorage.getItem('IBG_USER')==='premium'){
        document.documentElement.classList.add('hide-ads','is-premium');
      }
    }catch(e){}
  });
})();
