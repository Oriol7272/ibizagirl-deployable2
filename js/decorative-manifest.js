(function(W){
  function abs(list){ return (list||[]).map(function(n){ return '/decorative-images/'+n; }); }
  function set(list){
    W.DECORATIVE_IMAGES = list;
    try{ console.log('🖼️ DECORATIVE_IMAGES =', list.length); }catch(_){}
    try{ W.dispatchEvent(new CustomEvent('IBG_DECOR_READY')); }catch(_){}
  }
  fetch('/decorative-index.json',{cache:'no-store'})
    .then(function(r){ return r.ok ? r.json() : {decorative:[]}; })
    .then(function(j){ var a=abs(j.decorative||[]); if(!a.length) a=['/decorative-images/paradise-beach.png']; set(a); })
    .catch(function(){ set(['/decorative-images/paradise-beach.png']); });
})(window);
