(function(w,d){
  async function loadList(){
    try{
      const r = await fetch('/decorative-index.json',{cache:'no-cache'});
      if(!r.ok) throw new Error('index not found');
      const arr = await r.json();
      return Array.isArray(arr) ? arr.filter(f=>/\.(jpg|jpeg|png|webp|gif)$/i.test(f)) : [];
    }catch(e){ return []; }
  }
  function mountRotation(list){
    const el = d.getElementById('banner');
    if(!el || !list.length) return;
    let i=0;
    const urls = list.map(f=>'/decorative-images/'+f);
    // preload
    urls.slice(0,5).forEach(u=>{const img=new Image(); img.src=u;});
    const tick = ()=>{ el.style.backgroundImage = `url(${urls[i%urls.length]})`; i++; };
    tick(); setInterval(tick, 4000);
  }
  (async function(){
    const list = await loadList();
    w.DECORATIVE_IMAGES = (list||[]).map(f=>'/decorative-images/'+f);
    // Fallback si no hay lista
    if(!w.DECORATIVE_IMAGES.length){
      w.DECORATIVE_IMAGES = ['/decorative-images/paradise-beach.png'];
    }
    mountRotation(list);
    console.log('🖼️ DECORATIVE_IMAGES =', w.DECORATIVE_IMAGES.length);
  })();
})(window,document);
