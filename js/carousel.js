(function(W){
  function daySeed(){ var d=new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }
  function mulberry32(a){ return function(){ var t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; } }
  function seededShuffle(arr, seed){
    var a=arr.slice(); var rnd=mulberry32(seed|0);
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(rnd()*(i+1)); var tmp=a[i]; a[i]=a[j]; a[j]=tmp; }
    return a;
  }
  function toSrc(list){ return (list||[]).map(x=> typeof x==='string'? x : (x&&(x.src||x.url||x.path))).filter(Boolean); }
  function mountFromPool(rootId){
    var root=document.getElementById(rootId); if(!root) return;
    var track=root.querySelector('.carousel-track'); if(!track){ track=document.createElement('div'); track.className='carousel-track'; root.appendChild(track); }
    var pool=(W.IBG_POOLS && W.IBG_POOLS.full) || [];
    var imgs = seededShuffle(toSrc(pool), daySeed()+321).slice(0,10);
    if(!imgs.length){ root.style.display='none'; return; }
    track.innerHTML=''; imgs.forEach(src=>{ var img=new Image(); img.loading='lazy'; img.src=src; track.appendChild(img); });
    var i=0; setInterval(function(){ i=(i+1)%imgs.length; track.style.transform='translateX(-'+(i*100)+'%)'; }, 3500);
  }
  W.IBG_CAROUSEL={ mountFromPool };
})(window);
