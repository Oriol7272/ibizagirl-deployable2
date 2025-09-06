(function(W){
  // PRNG determinista por día (para reparto estable)
  function daySeed(){ var d=new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }
  function mulberry32(a){ return function(){ var t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; } }
  function seededShuffle(arr, seed){
    var a=arr.slice(); var rnd=mulberry32(seed|0);
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(rnd()*(i+1)); var tmp=a[i]; a[i]=a[j]; a[j]=tmp; }
    return a;
  }
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
        (opts.showTitle?('<div class="title">'+title+'</div>'):''),
      '</div>'
    ].join('');
  }
  function clampN(list, n){ return list.slice(0, Math.min(n, list.length)); }

  // Galería aleatoria de N (estable por día)
  function renderPublic(containerId,count){
    var src = coerce(W.IBG_POOLS && W.IBG_POOLS.full);
    var shuffled = seededShuffle(src, daySeed());
    var pick = clampN(shuffled, count||40);
    var box=document.getElementById(containerId); if(!box) return;
    box.innerHTML='<div class="grid">'+ pick.map(function(it){return cardHTML(it,{locked:false,price:'',isNew:false,video:false,showTitle:false})}).join('') +'</div>';
    try{ console.log('🖼️ Render public', pick.length, 'of', src.length);}catch(_){}
  }

  // Galería rotativa de N: recorre el pool completo en ventanas de N cada X ms
  function renderPublicRotating(containerId, count, intervalMs){
    var src = coerce(W.IBG_POOLS && W.IBG_POOLS.full);
    var cycle = seededShuffle(src, daySeed()+77); // orden diario distinto al de la fija
    var N = Math.min(count||40, cycle.length);
    var box=document.getElementById(containerId); if(!box) return;
    var idx = 0;
    function paint(){
      var slice = [];
      for(var i=0;i<N;i++){ slice.push(cycle[(idx+i) % cycle.length]); }
      box.innerHTML='<div class="grid">'+ slice.map(function(it){return cardHTML(it,{locked:false,showTitle:false})}).join('') +'</div>';
      idx = (idx + N) % cycle.length;
    }
    paint();
    var ms = Math.max(1500, intervalMs||4000);
    setInterval(paint, ms);
    try{ console.log('🔁 Render public ROTATING', N, 'every', ms,'ms over', cycle.length);}catch(_){}
  }

  // Paywall helper (por si después lo usas en premium/videos)
  function wirePaywall(modalId){
    var modal=document.getElementById(modalId); if(!modal) return;
    function openModal(src,type){
      modal.classList.add('show');
      modal.querySelector('.preview').innerHTML=(type==='video')?('<video controls playsinline src="'+src+'"></video>'):('<img src="'+src+'"/>');
      modal.dataset.src=src;
    }
    function close(){modal.classList.remove('show')}
    modal.addEventListener('click',function(e){if(e.target===modal) close()});
    document.addEventListener('click',function(e){
      var el=e.target.closest('.card.locked'); if(!el) return;
      openModal(el.getAttribute('data-src'), el.querySelector('video')?'video':'img');
    });
    var x=document.getElementById('modal-close'); if(x) x.onclick=close;
  }

  W.IBG_GALLERY={renderPublic,renderPublicRotating,wirePaywall};
})(window);
