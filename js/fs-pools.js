(function(W){
  function toObjs(list, base){
    base = '/'+String(base||'').replace(/^\/+|\/+$/g,'')+'/';
    return (list||[]).map(function(n){
      var t = (n||'').split('/').pop();
      return { src: (/^https?:\/\//.test(n) || n.startsWith('/')) ? n : (base+n), title: t };
    });
  }
  function ready(pools){
    W.IBG_POOLS = {
      full:       toObjs(pools.full, 'full'),
      uncensored: toObjs(pools.uncensored, 'uncensored'),
      videos:     toObjs(pools.videos, 'uncensored-videos')
    };
    try{ console.log('✅ IBG_POOLS_READY ->', {full:IBG_POOLS.full.length, uncensored:IBG_POOLS.uncensored.length, videos:IBG_POOLS.videos.length}); }catch(_){}
    W.dispatchEvent(new CustomEvent('IBG_POOLS_READY'));
  }
  // Cargar índice real
  fetch('/content-index.json',{cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('index not found'); return r.json(); })
    .then(ready)
    .catch(function(){
      console.warn('⚠️ No hay content-index.json; no se puede pintar.');
      ready({full:[],uncensored:[],videos:[]}); // evita que reviente la página
    });
})(window);
