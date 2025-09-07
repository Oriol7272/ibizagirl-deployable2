(function(){
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function pickPool(){
    var W=window;
    var arr=(W.PUBLIC_IMAGES||W.FULL||W.FULL_IMAGES||W.CONTENT_PUBLIC||[]).slice();
    if(!arr.length){
      for(var k in W){try{var v=W[k];if(Array.isArray(v)&&v.length&&/\.webp(\?|$)/i.test(String(v[0])))return v.slice();}catch(_){}}}
    return arr;
  }
  function prefix(v){return v.map(function(n){if(/^https?:\/\//.test(n))return n;return (n[0]==='/'?n:'/full/'+n).replace('//','/');});}
  function renderCarousel(urls){
    var w=document.getElementById('carousel'); w.innerHTML='';
    var track=document.createElement('div'); track.className='carousel-track';
    urls.forEach(function(u){var it=document.createElement('div'); it.className='carousel-item'; var img=new Image(); img.loading='lazy'; img.decoding='async'; img.src=u; it.appendChild(img); track.appendChild(it);});
    w.appendChild(track); var i=0; setInterval(function(){i=(i+1)%urls.length; track.style.transform='translateX('+(-i*260)+'px)';},2500);
  }
  function renderGallery(urls){
    var g=document.getElementById('gallery'); g.innerHTML='';
    urls.forEach(function(u){var a=document.createElement('a'); a.className='g-item'; a.href=u; var img=new Image(); img.loading='lazy'; img.decoding='async'; img.src=u; a.appendChild(img); g.appendChild(a);});
  }
  function init(){
    var pool=prefix(shuffle(pickPool()).slice(0,40));
    if(pool.length){ renderCarousel(pool); renderGallery(pool); }
  }
  document.readyState!=='loading'?init():document.addEventListener('DOMContentLoaded',init);
})();
