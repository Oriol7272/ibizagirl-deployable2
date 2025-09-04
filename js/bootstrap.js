(function(W){
  var domReady=false, decorReady=false, poolsReady=false, started=false;

  function mountBanner(){
    var deco=(W.DECORATIVE_IMAGES||[]);
    if(!deco.length) return;
    // Fondo actual
    var banner = document.getElementById('banner');
    var rot = document.getElementById('decorative-rotator');
    var idx=0;
    function apply(i){
      var src=deco[i%deco.length];
      if(banner) banner.style.backgroundImage='url('+src+')';
      if(rot) rot.style.backgroundImage='url('+src+')';
    }
    apply(0);
    // Rotación periódica
    setInterval(function(){ idx=(idx+1)%deco.length; apply(idx); }, 4000);

    // Carrusel bajo el banner
    if (W.IBG_CAROUSEL && document.getElementById('hero-carousel')){
      W.IBG_CAROUSEL.mountCarousel('hero-carousel');
    }
  }

  function paintHome(){
    if (document.getElementById('home-gallery') && W.IBG_GALLERY && W.IBG_POOLS){
      W.IBG_GALLERY.renderPublic('home-gallery', 40); // 40 del pool full
    }
  }

  // Eventos
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ domReady=true; if(decorReady) mountBanner(); }); } else { domReady=true; }
  W.addEventListener('IBG_DECOR_READY', function(){ decorReady=true; if(domReady) mountBanner(); });
  W.addEventListener('IBG_POOLS_READY', function(){ poolsReady=true; if(domReady && !started){ started=true; paintHome(); } });
})(window);
