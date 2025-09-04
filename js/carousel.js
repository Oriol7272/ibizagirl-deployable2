(function(W){
  function mountCarousel(rootId){
    var root=document.getElementById(rootId); if(!root) return;
    var track=root.querySelector('.carousel-track'); if(!track){track=document.createElement('div');track.className='carousel-track';root.appendChild(track)}
    var imgs=(W.DECORATIVE_IMAGES||[]);
    if(!imgs || !imgs.length){ root.style.display='none'; return; }
    try{ console.log('🎠 Carousel imgs:', imgs.length);}catch(_){}
    // Pinta hasta 10 slides
    track.innerHTML='';
    imgs.slice(0,10).forEach(function(src){var img=document.createElement('img');img.loading='lazy';img.src=src;track.appendChild(img)});
    var i=0; setInterval(function(){i=(i+1)%Math.max(1,Math.min(10,imgs.length));track.style.transform='translateX(-'+(i*100)+'%)'},3500);
  }
  W.IBG_CAROUSEL={mountCarousel};
})(window);
