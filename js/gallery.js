(function(W){
  var U=W.IBG_UTILS||{
    daySeed:function(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()},
    seededShuffle:function(a){return a.slice()},
    pickN:function(a,n){return a.slice(0,n)}
  };
  function coerce(items){
    return (items||[]).map(function(it){
      if(typeof it==='string'){ return {src:it,title:(it.split('/').pop()||'')} }
      if(it && typeof it==='object'){ return {src: it.src || it.url || it.path, title: it.title || it.name || (it.src||'').split('/').pop()} }
      return null;
    }).filter(function(x){return x && x.src});
  }
  function cardHTML(item,opts){
    var classes=['card']; if(opts.locked) classes.push('locked');
    var price=opts.price||'', isNew=!!opts.isNew, title=item.title||'';
    return [
      '<div class="'+classes.join(' ')+'" data-src="'+item.src+'">',
        '<div class="thumb">',
          isNew?'<span class="badge new">Nuevo</span>':'',
          price?'<span class="badge price">'+price+'</span>':'',
          (opts.locked?'<span class="lock-icon">🔒 Bloqueado</span>':''),
          (opts.video?'<video preload="metadata" muted playsinline src="'+item.src+'#t=0.1"></video>':'<img loading="lazy" src="'+item.src+'" alt="'+title+'">'),
        '</div>',
        '<div class="title">'+title+'</div>',
      '</div>'
    ].join('');
  }
  function renderPublic(containerId,count){
    var pool = coerce(W.IBG_POOLS && W.IBG_POOLS.full);
    var pick = (U.pickN||function(a,n){return a.slice(0,n)})(pool, count, U.daySeed?U.daySeed():undefined);
    var html = pick.map(function(it){return cardHTML(it,{locked:false,price:'',isNew:false,video:false})}).join('');
    var box=document.getElementById(containerId); if(box) box.innerHTML='<div class="grid">'+html+'</div>';
  }
  function renderPremium(containerId,count,newRate,price){
    var pool = coerce(W.IBG_POOLS && W.IBG_POOLS.uncensored);
    var pick = (U.pickN||function(a,n){return a.slice(0,n)})(pool, count, U.daySeed?U.daySeed():undefined);
    var html  = pick.map(function(it,idx){return cardHTML(it,{locked:true,price:price,isNew:(idx<Math.floor(count*(newRate||0.3))),video:false})}).join('');
    var box=document.getElementById(containerId); if(box) box.innerHTML='<div class="grid">'+html+'</div>';
  }
  function renderVideos(containerId,count,price){
    var pool = coerce(W.IBG_POOLS && W.IBG_POOLS.videos);
    var pick = (U.pickN||function(a,n){return a.slice(0,n)})(pool, count, U.daySeed?U.daySeed():undefined);
    var html  = pick.map(function(it){return cardHTML(it,{locked:true,price:price,isNew:false,video:true})}).join('');
    var box=document.getElementById(containerId); if(box) box.innerHTML='<div class="grid">'+html+'</div>';
  }
  function wirePaywall(modalId){
    var modal=document.getElementById(modalId); if(!modal) return;
    function openModal(src,type){
      modal.classList.add('show');
      modal.querySelector('.preview').innerHTML=type==='video'?('<video controls playsinline src="'+src+'"></video>'):('<img src="'+src+'"/>');
      modal.dataset.src=src;
    }
    function close(){modal.classList.remove('show')}
    modal.addEventListener('click',function(e){if(e.target===modal) close()});
    document.addEventListener('click',function(e){
      var el=e.target.closest('.card.locked'); if(!el) return;
      openModal(el.getAttribute('data-src'), !!el.querySelector('video')?'video':'img');
    });
    var x=document.getElementById('modal-close'); if(x) x.onclick=close;
    W.IBG_UNLOCK=function(){
      var src=modal.dataset.src; if(!src) return;
      localStorage.setItem('ibg_unlock_'+src,'1');
      document.querySelectorAll('.card.locked').forEach(function(card){
        if(card.getAttribute('data-src')===src){ card.classList.remove('locked'); var lk=card.querySelector('.lock-icon'); if(lk) lk.remove(); }
      });
      close();
    }
  }
  W.IBG_GALLERY={renderPublic,renderPremium,renderVideos,wirePaywall};
})(window);
