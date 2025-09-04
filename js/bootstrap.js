(function(W){
  var domReady=false, decorReady=false, started=false;

  function rotateBanner(){
    var deco=(W.DECORATIVE_IMAGES||[]);
    if(!deco.length) return;
    var banner = document.getElementById('banner');
    var rot = document.getElementById('decorative-rotator');
    var i=0;
    function apply(k){ var src=deco[k%deco.length]; if(banner) banner.style.backgroundImage='url('+src+')'; if(rot) rot.style.backgroundImage='url('+src+')'; }
    apply(0);
    setInterval(function(){ i=(i+1)%deco.length; apply(i); }, 4000);
  }

  function paintHome(){
    if (document.getElementById('hero-carousel') && W.IBG_CAROUSEL && W.IBG_POOLS){
      W.IBG_CAROUSEL.mountFromPool('hero-carousel');
    }
    if (document.getElementById('home-gallery') && W.IBG_GALLERY && W.IBG_POOLS){
      W.IBG_GALLERY.renderPublic('home-gallery', 40);
    }
    if (W.IBG_ADS) W.IBG_ADS.initAds();
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ domReady=true; if(decorReady) rotateBanner(); }); } else { domReady=true; }
  W.addEventListener('IBG_DECOR_READY', function(){ decorReady=true; if(domReady) rotateBanner(); });
  W.addEventListener('IBG_POOLS_READY', function(){ if(domReady && !started){ started=true; paintHome(); } });
})(window);
