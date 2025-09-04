(function(W){
  var domReady=false, poolsReady=false, decorReady=false, started=false;

  function mountBanner(){
    var deco=(W.DECORATIVE_IMAGES||[]);
    var bg = deco.find(function(p){ return /paradise-beach/i.test(p); }) || deco[0];
    var banner = document.getElementById('banner'); if(bg && banner) banner.style.backgroundImage='url('+bg+')';
    var el=document.getElementById('decorative-rotator');
    if(el && deco.length){var i=0;(function tick(){el.style.backgroundImage='url('+deco[i%deco.length]+')';i++;setTimeout(tick,3500);})(); }
  }

  function paintHome(){
    // Galería rotativa (40)
    if (document.getElementById('home-rotating') && W.IBG_GALLERY && W.IBG_POOLS){
      W.IBG_GALLERY.renderPublicRotating('home-rotating', 40, 4000);
    }
    // Galería aleatoria (40)
    if (document.getElementById('home-random') && W.IBG_GALLERY && W.IBG_POOLS){
      W.IBG_GALLERY.renderPublic('home-random', 40);
    }
  }

  // DOM listo
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ domReady=true; if(decorReady) mountBanner(); }); } else { domReady=true; }

  // Eventos de índices
  W.addEventListener('IBG_DECOR_READY', function(){ decorReady=true; if(domReady) mountBanner(); });
  W.addEventListener('IBG_POOLS_READY', function(){
    poolsReady=true;
    if(domReady && !started){
      started=true;
      paintHome();
      // (Premium y Videos los dejamos para el siguiente paso si lo necesitas)
    }
  });
})(window);
