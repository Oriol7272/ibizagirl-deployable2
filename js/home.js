(function(){
  var W=window,D=document;
  function pickPool(){
    try{
      var candidates=[];
      for(var k in W){
        try{
          var v=W[k];
          if(Array.isArray(v) && v.length){
            var s=v.slice(0,5).map(x=>typeof x==='string'?x:(x&&x.file)||x?.src||x?.path||x?.name||'');
            var hits=s.filter(x=>typeof x==='string' && /\.webp(\?|$)/i.test(x));
            if(hits.length>=Math.min(3,v.length)) candidates.push(v);
          }
        }catch(_){}
      }
      var best=null;
      for(var i=0;i<candidates.length;i++){
        var a=candidates[i];
        if(!best || a.length>best.length) best=a;
      }
      if(best) return best.map(x=>typeof x==='string'?x:(x&&x.file)||x?.src||x?.path||x?.name).filter(Boolean);
    }catch(_){}
    var guess=(W.CONTENT_PUBLIC||W.FULL_IMAGES||W.PUBLIC_IMAGES||W.FULL||[]);
    return (guess||[]).map(x=>typeof x==='string'?x:(x&&x.file)||x?.src||x?.path||x?.name).filter(Boolean);
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function ensurePrefix(p){
    if(!p) return [];
    return p.map(function(n){
      if(!n) return null;
      if(/^https?:\/\//i.test(n)) return n;
      if(n.startsWith('/')) return n;
      if(n.startsWith('full/')) return '/'+n;
      return '/full/'+n;
    }).filter(Boolean);
  }

  function renderCarousel(urls){
    var wrap=D.getElementById('carousel');
    wrap.innerHTML='';
    var track=D.createElement('div');
    track.className='carousel-track';
    urls.forEach(function(u){
      var it=D.createElement('div');
      it.className='carousel-item';
      var img=D.createElement('img');
      img.loading='lazy';
      img.decoding='async';
      img.src=u;
      img.alt='carousel';
      it.appendChild(img);
      track.appendChild(it);
    });
    wrap.appendChild(track);
    var idx=0;
    function tick(){
      idx=(idx+1)%urls.length;
      track.style.transform='translateX(' + (-idx*260) + 'px)';
    }
    setInterval(tick, 2500);
  }

  function renderGallery(urls){
    var grid=D.getElementById('gallery');
    grid.innerHTML='';
    urls.forEach(function(u){
      var a=D.createElement('a');
      a.href=u;
      a.className='g-item';
      var img=D.createElement('img');
      img.loading='lazy';
      img.decoding='async';
      img.src=u;
      img.alt='gallery';
      a.appendChild(img);
      grid.appendChild(a);
    });
  }

  function rotateBannerBg(){
    try{
      var pool=(W.DECORATIVE_IMAGES||W.DECORATIVE||W.IBG_DECOR||[]);
      if(!Array.isArray(pool) || !pool.length) return;
      var hero=D.querySelector('.hero');
      var i=0;
      function setBg(){
        var src=pool[i%pool.length];
        if(src && typeof src==='string'){
          var url = src.startsWith('/')?src:'/decorative-images/'+src;
          hero.style.backgroundImage='url("'+url+'")';
        }
        i++;
      }
      setBg();
      setInterval(setBg, 5000);
    }catch(_){}
  }

  function paradiseBg(){
    var hero=D.querySelector('.page-bg');
    if(!hero) return;
    var candidates=[
      'paradise-beach.png','paradise-beach.webp','paradise_beach.png','paradise.png','paradise.webp'
    ];
    for(var i=0;i<candidates.length;i++){
      var p='/decorative-images/'+candidates[i];
      var img=new Image();
      img.onload=(function(url){return function(){hero.style.backgroundImage='url("'+url+'")';};})(p);
      img.src=p;
    }
  }

  function init(){
    paradiseBg();
    rotateBannerBg();
    var pool=ensurePrefix(shuffle(pickPool()).slice(0,40));
    if(pool.length<1){ console.warn('[home] no pool'); return; }
    renderCarousel(pool);
    renderGallery(pool);
  }

  if(document.readyState==='complete'||document.readyState==='interactive'){
    setTimeout(init,0);
  }else{
    document.addEventListener('DOMContentLoaded',init);
  }
})();
