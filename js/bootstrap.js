(function(W){
  var domReady=false, poolsReady=false, decorReady=false, started=false;
  function mountBanner(){
    var deco=(W.DECORATIVE_IMAGES||[]);
    var bg = deco.find(function(p){ return /paradise-beach/i.test(p); }) || deco[0];
    var banner = document.getElementById('banner'); if(bg && banner) banner.style.backgroundImage='url('+bg+')';
    var el=document.getElementById('decorative-rotator');
    if(el && deco.length){var i=0;(function tick(){el.style.backgroundImage='url('+deco[i%deco.length]+')';i++;setTimeout(tick,3500);})(); }
  }
  function paint(){
    if(started) return; started=true;
    if (document.getElementById('home-carousel') && W.IBG_CAROUSEL) W.IBG_CAROUSEL.mountCarousel('home-carousel');
    if (document.getElementById('home-gallery') && W.IBG_GALLERY && W.IBG_POOLS){ W.IBG_GALLERY.renderPublic('home-gallery', 40); }
    if (document.getElementById('premium-gallery') && W.IBG_GALLERY && W.IBG_POOLS){ W.IBG_GALLERY.renderPremium('premium-gallery', 100, 0.30, (W.__ENV&&__ENV.PRICE_IMAGE_EUR)||"0.10€"); W.IBG_GALLERY.wirePaywall('paywall-modal'); }
    if (document.getElementById('videos-grid') && W.IBG_GALLERY && W.IBG_POOLS){ W.IBG_GALLERY.renderVideos('videos-grid', 20, (W.__ENV&&__ENV.PRICE_VIDEO_EUR)||"0.30€"); W.IBG_GALLERY.wirePaywall('paywall-modal'); }
    if (W.IBG_PAYMENTS){ W.IBG_PAYMENTS.loadPayPal(); W.IBG_PAYMENTS.initPaywallUnlockButton(); var t=setInterval(function(){ if(W.paypal){ clearInterval(t); if (document.getElementById('paypal-monthly')) W.IBG_PAYMENTS.mountSubButtons(); }}, 300); }
    if (W.IBG_ADS)  W.IBG_ADS.initAds();
    if (W.IBG_CHAT) W.IBG_CHAT.initCrisp();
  }
  // DOM
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ domReady=true; if(decorReady) mountBanner(); }); } else { domReady=true; }
  // Eventos
  W.addEventListener('IBG_DECOR_READY', function(){ decorReady=true; if(domReady) mountBanner(); });
  W.addEventListener('IBG_POOLS_READY', function(){ poolsReady=true; if(domReady) paint(); });
})(window);
