(function(W){
  function abs(list){ return (list||[]).map(function(n){ return '/decorative-images/'+n; }); }
  function set(list){ W.DECORATIVE_IMAGES = list; try{console.log('🖼️ DECORATIVE_IMAGES =', list.length);}catch(_){} }
  fetch('/decorative-index.json',{cache:'no-store'})
    .then(r=>r.ok?r.json():{decorative:[]})
    .then(j=>set(abs(j.decorative||[])))
    .catch(function(){ set(['/decorative-images/paradise-beach.png']); });
})(window);
