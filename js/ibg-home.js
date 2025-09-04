(function(){
  var U=window.IBG_UTIL||{}, $=function(s){return document.querySelector(s)};

  function startRotation(list){
    var bannerImg=$('.banner .img');
    if(!bannerImg) return;
    if(!list || !list.length){
      bannerImg.style.backgroundImage='url("decorative-images/paradise-beach.png")';
      bannerImg.style.opacity=.28;
      return;
    }
    var i=0;
    function rot(){
      bannerImg.style.opacity=0;
      var src=list[i%list.length];
      setTimeout(function(){
        bannerImg.style.backgroundImage='url("'+src+'")';
        bannerImg.style.opacity=.28;
      },220);
      i++;
    }
    rot();
    setInterval(rot,4000);
  }

  document.addEventListener('DOMContentLoaded',function(){
    // Banner: intenta manifest; si falla, usa paradise-beach.png
    fetch('decorative-images/manifest.json').then(function(r){
      return r.ok ? r.json() : null;
    }).then(function(j){
      var arr = j && Array.isArray(j.images) ? j.images : [];
      var list = arr.map(function(n){ return 'decorative-images/'+n; });
      if(list.length===0){ list=['decorative-images/paradise-beach.png']; }
      startRotation(list);
    }).catch(function(){
      startRotation(['decorative-images/paradise-beach.png']);
    });

    // Carrusel 30 (CONTENT_PUBLIC desde content-data2.js)
    var pub = window.CONTENT_PUBLIC || [];
    var c30 = U.sample(pub,30).map(function(x){return U.norm(x,'full')});
    var car = $('#carousel');
    if(car){ c30.forEach(function(src){ var img=new Image(); img.src=src; car.appendChild(img); }); }

    // Galería 40 sin repetir del carrusel
    var used = new Set(c30);
    var rest = pub.filter(function(x){ return !used.has(U.norm(x,'full')); });
    var g40  = U.sample(rest,40).map(function(x){return U.norm(x,'full')});
    var grid = $('#grid40');
    if(grid){ g40.forEach(function(src){ var d=document.createElement('div'); d.className='thumb'; var img=new Image(); img.src=src; d.appendChild(img); grid.appendChild(d); }); }
  });
})();
