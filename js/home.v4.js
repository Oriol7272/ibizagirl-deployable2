(function(){
  console.log("🏠 home.v4.js cargado");
  var U=window.IBG_UTIL||{}, $=U.$;
  function startRotation(list){
    var el=document.querySelector('.banner .img'); if(!el) return;
    if(!list||!list.length){ el.style.backgroundImage='url("decorative-images/paradise-beach.png")'; el.style.opacity=.28; return; }
    var i=0; function rot(){ el.style.opacity=0; var src=list[i%list.length]; setTimeout(function(){ el.style.backgroundImage='url("'+src+'")'; el.style.opacity=.28; },220); i++; }
    rot(); setInterval(rot,4000);
  }
  function build(){
    var pub=window.CONTENT_PUBLIC||[]; if(!Array.isArray(pub)||pub.length===0){ return false; }
    var c30=(U.sample(pub,30)).map(function(x){return U.norm(x,'full')});
    var car=$("#carousel"); if(car){ car.innerHTML=""; c30.forEach(function(src){ var img=new Image(); img.loading="lazy"; img.decoding="async"; img.src=src; car.appendChild(img); }); console.log("🎠 Carrusel con",c30.length); }
    var used=new Set(c30.map(String)), rest=pub.map(function(x){return U.norm(x,'full')}).filter(function(x){return !used.has(String(x))});
    var g40=U.sample(rest,40);
    var grid=$("#grid40"); if(grid){ grid.innerHTML=""; g40.forEach(function(src){ var d=document.createElement('div'); d.className='thumb'; var img=new Image(); img.loading="lazy"; img.decoding="async"; img.src=src; d.appendChild(img); grid.appendChild(d);}); console.log("🖼️ Galería con",g40.length); }
    return true;
  }
  document.addEventListener('DOMContentLoaded',function(){
    console.log("🌅 DOM listo; Home v4");
    fetch('decorative-images/manifest.json').then(function(r){return r.ok?r.json():null}).then(function(j){
      var a=j&&Array.isArray(j.images)?j.images:[]; var list=a.map(function(n){return 'decorative-images/'+n});
      startRotation(list.length?list:['decorative-images/paradise-beach.png']);
    }).catch(function(){ startRotation(['decorative-images/paradise-beach.png']); });
    var tries=0; (function loop(){
      if((!Array.isArray(window.CONTENT_PUBLIC)||!window.CONTENT_PUBLIC.length) && U.autodetectPublicDeep){ U.autodetectPublicDeep(); }
      if (build()) return;
      if (++tries < 80) return setTimeout(loop,100);
      console.warn("⏱️ Timeout esperando CONTENT_PUBLIC");
    })();
  });
})();
