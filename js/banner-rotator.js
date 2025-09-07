(function(){
  function pool(){
    var P=(window.DECORATIVE_IMAGES||[]);
    return P.map(function(n){return n? (n.startsWith('/')?n:'/decorative-images/'+n):null}).filter(Boolean);
  }
  function start(){
    var hero=document.querySelector('.hero'); if(!hero) return;
    var imgs=pool(); if(!imgs.length) return;
    var i=0;
    function tick(){
      var u=imgs[i%imgs.length];
      hero.style.setProperty('background-image','url("'+u+'")','important');
      i++;
    }
    tick();
    setInterval(tick,5000);
  }
  document.readyState!=='loading'?start():document.addEventListener('DOMContentLoaded',start);
})();
