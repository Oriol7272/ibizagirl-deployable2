(function(W){
  W.DECORATIVE_IMAGES = [];
  function setList(list){
    if(Array.isArray(list)){ W.DECORATIVE_IMAGES = list.map(String); }
  }
  // 1) Si existe manifest.json, úsalo
  fetch('/decorative-images/manifest.json').then(r=>r.ok?r.json():[]).then(setList).catch(function(){
    // 2) Fallback con nombres comunes si no hay manifest
    setList([
      '/decorative-images/paradise-beach.png'
    ]);
  });
})(window);
