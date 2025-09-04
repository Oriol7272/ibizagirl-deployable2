(function(){
  var U=window.IBG_UTIL||{}, $=function(s){return document.querySelector(s)};
  document.addEventListener('DOMContentLoaded',function(){
    var vids=U.sample(window.CONTENT_VIDEOS||[],40).map(function(x){return U.norm(x,'uncensored-videos')});
    var grid=$('#grid40v');
    vids.forEach(function(src){
      var d=document.createElement('div'); d.className='thumb'; d.dataset.src=src;
      var v=document.createElement('video'); v.src=src; v.muted=true; v.loop=true; v.playsInline=true; v.className='blur-locked';
      d.appendChild(v);
      var p=document.createElement('div'); p.className='pay'; p.textContent='€0.30'; d.appendChild(p);
      var b=document.createElement('div'); b.className='badge'; b.textContent='PayPal'; d.appendChild(b);
      d.addEventListener('click',function(){window.IBG_PAY.openPurchase('video',src,0.30,function(){v.classList.remove('blur-locked'); v.play().catch(function(){});});});
      grid.appendChild(d);
    });
  });
})();
