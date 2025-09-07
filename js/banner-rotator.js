(function(){
  function getPool(){
    var pool = (window.DECORATIVE_IMAGES||window.IBG_DECOR||[]);
    if(!Array.isArray(pool) || !pool.length) return [];
    return pool.map(function(n){
      if(!n) return null;
      if(/^https?:\/\//i.test(n)) return n;
      if(n.startsWith('/')) return n;
      return '/decorative-images/'+n;
    }).filter(Boolean);
  }
  function start(){
    var hero=document.querySelector('.hero');
    if(!hero) return;
    var imgs=getPool(); if(!imgs.length) return;
    var i=0;
    function tick(){
      var u=imgs[i%imgs.length];
      hero.style.backgroundImage='url("'+u+'")';
      i++;
    }
    tick();
    setInterval(tick, 5000);
  }
  if(document.readyState!=='loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
