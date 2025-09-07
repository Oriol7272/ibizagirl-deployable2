(function(){
  function getAssetsBase(){
    try{
      if (window.IBG_ENV && window.IBG_ENV.ASSETS_BASE_URL) return window.IBG_ENV.ASSETS_BASE_URL;
      if (window.IBG_ASSETS_BASE_URL) return window.IBG_ASSETS_BASE_URL;
      if (window.process && window.process.env && window.process.env.IBG_ASSETS_BASE_URL) return window.process.env.IBG_ASSETS_BASE_URL;
    }catch(_){}
    return ""; // si vacío, caerá a /full
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function pickPool(){
    // Busca en globals cualquier array de nombres .webp que ya carga content-data2.js
    var found=null;
    Object.keys(window).forEach(function(k){
      var v=window[k];
      if(!found && Array.isArray(v) && v.length && typeof v[0]==='string' && /\.webp(\?|$)/i.test(v[0])) found=v;
    });
    return found||[];
  }
  function toUrl(name, base){
    if(/^https?:\/\//i.test(name)) return name;
    if(name.startsWith('/full/')) return (base?base.replace(/\/$/,''):'') + name;
    return (base?base.replace(/\/$/,''):'') + '/full/' + name;
  }
  function renderCarousel(urls){
    var w=document.getElementById('carousel'); if(!w) return; w.innerHTML='';
    var track=document.createElement('div'); track.className='carousel-track';
    urls.forEach(function(u){
      var it=document.createElement('div'); it.className='carousel-item';
      var img=new Image(); img.loading='lazy'; img.decoding='async'; img.src=u;
      it.appendChild(img); track.appendChild(it);
    });
    w.appendChild(track);
    var i=0; setInterval(function(){ i=(i+1)%urls.length; track.style.transform='translateX('+(-i*260)+'px)'; }, 2500);
  }
  function renderGallery(urls){
    var g=document.getElementById('gallery'); if(!g) return; g.innerHTML='';
    urls.forEach(function(u){
      var a=document.createElement('a'); a.className='g-item'; a.href=u; a.target='_blank';
      var img=new Image(); img.loading='lazy'; img.decoding='async'; img.src=u; a.appendChild(img); g.appendChild(a);
    });
  }
  function init(){
    var base=getAssetsBase();
    var pool=pickPool();
    if(!pool.length){ console.warn('[home] No hay pool de imágenes'); return; }
    pool=shuffle(pool).slice(0,40).map(function(n){ return toUrl(n, base); });
    renderCarousel(pool);
    renderGallery(pool);
  }
  document.readyState!=='loading'?init():document.addEventListener('DOMContentLoaded',init);
})();
