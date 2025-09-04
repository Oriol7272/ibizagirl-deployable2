(function(){
  var U=window.IBG_UTIL||{}, $=function(s){return document.querySelector(s)};
  document.addEventListener('DOMContentLoaded',function(){
    var all=(window.CONTENT_PREMIUM_1||[]).concat(window.CONTENT_PREMIUM_2||[]);
    var take=U.sample(all,100).map(function(x){return U.norm(x,'uncensored')});
    var grid=$('#grid100');
    take.forEach(function(src){
      var d=document.createElement('div'); d.className='thumb'; d.dataset.src=src;
      var img=new Image(); img.src=src; img.className='blur-locked'; d.appendChild(img);
      var p=document.createElement('div'); p.className='pay'; p.textContent='€0.10'; d.appendChild(p);
      var b=document.createElement('div'); b.className='badge'; b.textContent='PayPal'; d.appendChild(b);
      d.addEventListener('click',function(){window.IBG_PAY.openPurchase('photo',src,0.10,function(){img.classList.remove('blur-locked');});});
      grid.appendChild(d);
    });
  });
})();
