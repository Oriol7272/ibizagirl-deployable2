(function(){
  function pool(){
    var P=(window.DECORATIVE_IMAGES||[]);
    return P.map(function(n){
      if(!n) return null;
      if(/^https?:\/\//i.test(n)) return n;
      if(n.startsWith('/')) return n;
      return '/decorative-images/'+n;
    }).filter(Boolean);
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
