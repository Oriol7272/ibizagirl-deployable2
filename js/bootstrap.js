(function(W){
  var domReady=false, decorReady=false, started=false;

  function rotateBanner(){
    var deco=(W.DECORATIVE_IMAGES||[]);
    if(!deco.length) return;
    var banner = document.getElementById('banner');
    var rot = document.getElementById('decorative-rotator');
    var idx=0;
    function apply(i){
      var src=deco[i%deco.length];
      if(banner) banner.style.backgroundImage='url('+src+')';
      if(rot) rot.style.backgroundImage='url('+src+')';
    }
    apply(0);
    setInterval(function(){ idx=(idx+1)%deco.length; apply(idx); }, 4000);
  }

  function paintHome(){
    if (document.getElementById('hero-carousel') && W.IBG_CAROUSEL && W.IBG_POOLS){
      W.IBG_CAROUSEL.mountFromPool('hero-carousel', 'full', 10);
    }
    if (document.getElementById('home-gallery') && W.IBG_GALLERY && W.IBG_POOLS){
      W.IBG_GALLERY.renderPublic('home-gallery', 40);
    }
  }

  function initAdsIfAny(){ if(W.IBG_ADS) W.IBG_ADS.initAds(); }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ domReady=true; initAdsIfAny(); if(decorReady) rotateBanner(); }); } else { domReady=true; initAdsIfAny(); }
  W.addEventListener('IBG_DECOR_READY', function(){ decorReady=true; if(domReady) rotateBanner(); });
  W.addEventListener('IBG_POOLS_READY', function(){ if(domReady && !started){ started=true; paintHome(); } });
})(window);
