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
  function ppIcon(){ return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19l1.2-8.6C8.4 8.6 9.7 8 11.3 8h4.8c.7 0 1.2.6 1.1 1.3l-.7 5c-.1.7-.7 1.2-1.4 1.2h-3.1l-.3 2.2c-.1.7-.7 1.3-1.4 1.3H7z" fill="#003087"/><path d="M8.4 19l1.2-8.6C9.8 8.6 11 8 12.6 8h3.5c.7 0 1.2.6 1.1 1.3l-.7 5c-.1.7-.7 1.2-1.4 1.2H12l-.3 2.2c-.1.7-.7 1.3-1.4 1.3H8.4z" fill="#009CDE"/></svg>'; }
  function cardHTML(item,opts){
    var classes=['card']; if(opts.locked) classes.push('locked');
    var price=opts.price||'', isNew=!!opts.isNew, title=item.title||'';
    return [
      '<div class="'+classes.join(' ')+'" data-src="'+item.src+'">',
        '<div class="thumb">',
          isNew?'<span class="badge new">Nuevo</span>':'',
          price?('<span class="badge price">'+ppIcon()+' '+price+'</span>'):'',
          (opts.locked?'<span class="lock-icon">🔒 Bloqueado</span>':''),
          (opts.video?'<video preload="metadata" muted playsinline src="'+item.src+'#t=0.1"></video>':'<img loading="lazy" src="'+item.src+'" alt="'+title+'">'),
        '</div>',
        '<div class="title">'+title+'</div>',
      '</div>'
    ].join('');
  }
  function clamp(n,max){ return Math.min(n, max||n); }
  function renderPublic(containerId,count){
    var pool = coerce(W.IBG_POOLS && W.IBG_POOLS.full);
    var n = clamp(count, pool.length);
    var pick = (U.pickN||function(a,n){return a.slice(0,n)})(pool, n, U.daySeed?U.daySeed():undefined);
    var html = pick.map(function(it){return cardHTML(it,{locked:false,price:'',isNew:false,video:false})}).join('');
    var box=document.getElementById(containerId); if(box) box.innerHTML='<div class="grid">'+html+'</div>';
    try{ console.log('🖼️ Render public', n, 'of', pool.length);}catch(_){}
  }
  function renderPremium(containerId,count,newRate,price){
    var pool = coerce(W.IBG_POOLS && W.IBG_POOLS.uncensored);
    var n = clamp(count, pool.length);
    var pick = (U.pickN||function(a,n){return a.slice(0,n)})(pool, n, U.daySeed?U.daySeed():undefined);
    var html  = pick.map(function(it,idx){return cardHTML(it,{locked:true,price:price,isNew:(idx<Math.floor(n*(newRate||0.3))),video:false})}).join('');
    var box=document.getElementById(containerId); if(box) box.innerHTML='<div class="grid">'+html+'</div>';
    try{ console.log('💎 Render premium', n, 'of', pool.length);}catch(_){}
  }
  function renderVideos(containerId,count,price){
    var pool = coerce(W.IBG_POOLS && W.IBG_POOLS.videos);
    var n = clamp(count, pool.length);
    var pick = (U.pickN||function(a,n){return a.slice(0,n)})(pool, n, U.daySeed?U.daySeed():undefined);
    var html  = pick.map(function(it){return cardHTML(it,{locked:true,price:price,isNew:false,video:true})}).join('');
    var box=document.getElementById(containerId); if(box) box.innerHTML='<div class="grid">'+html+'</div>';
    try{ console.log('🎬 Render videos', n, 'of', pool.length);}catch(_){}
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
