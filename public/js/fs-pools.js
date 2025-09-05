(function(W){
  function toObjs(list, base){
    base = '/'+String(base||'').replace(/^\/+|\/+$/g,'')+'/';
    return (list||[]).map(function(n){
      var t = (n||'').split('/').pop();
      return { src: (/^https?:\/\//.test(n) || (n||'').startsWith('/')) ? n : (base+n), title: t };
    });
  }
  function ready(pools){
    var F = toObjs(pools.full||[], 'full');
    var U = toObjs(pools.uncensored||[], 'uncensored');
    var V = toObjs(pools.videos||[], 'uncensored-videos');
    W.IBG_POOLS = { full:F, uncensored:U, videos:V };
    try{ console.log('✅ IBG_POOLS_READY -> full=%d uncensored=%d videos=%d', F.length, U.length, V.length); }catch(_){}
    try{ W.dispatchEvent(new CustomEvent('IBG_POOLS_READY')); }catch(_){}
  }
  fetch('/content-index.json',{cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('index not found'); return r.json(); })
    .then(ready)
    .catch(function(e){
      console.warn('⚠️ No hay content-index.json o error:', e && e.message);
      ready({full:[],uncensored:[],videos:[]});
    });
})(window);
