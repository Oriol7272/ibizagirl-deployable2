(function(W){
  var domReady=false, poolsReady=!!W.IBG_POOLS, decorReady=!!(W.DECORATIVE_IMAGES&&(W.DECORATIVE_IMAGES.length));
  function log(){ try{ console.log.apply(console, arguments); }catch(_){} }
  function mountBanner(){
    var deco=(W.DECORATIVE_IMAGES||[]);
    var bg = deco.find(function(p){ return /paradise-beach/i.test(p); }) || deco[0];
    var banner = document.getElementById('banner'); if(bg && banner) banner.style.backgroundImage='url('+bg+')';
    var el=document.getElementById('decorative-rotator');
    if(el && deco.length){var i=0;(function tick(){el.style.backgroundImage='url('+deco[i%deco.length]+')';i++;setTimeout(tick,3500);})();}
  }
  function paintMedia(){
    // Home
    if (document.getElementById('home-gallery') && W.IBG_GALLERY && W.IBG_POOLS){
      log('🖼️ Home gallery: full=', (W.IBG_POOLS.full||[]).length);
      W.IBG_GALLERY.renderPublic('home-gallery', 40);
    }
    if (document.getElementById('home-carousel') && W.IBG_CAROUSEL){
      W.IBG_CAROUSEL.mountCarousel('home-carousel');
    }
    // Premium
    if (document.getElementById('premium-gallery') && W.IBG_GALLERY && W.IBG_POOLS){
      log('💎 Premium: uncensored=', (W.IBG_POOLS.uncensored||[]).length);
      W.IBG_GALLERY.renderPremium('premium-gallery', 100, 0.30, (W.__ENV&&__ENV.PRICE_IMAGE_EUR)||"0.10€");
      W.IBG_GALLERY.wirePaywall('paywall-modal');
    }
    // Videos
    if (document.getElementById('videos-grid') && W.IBG_GALLERY && W.IBG_POOLS){
      log('🎬 Videos: count=', (W.IBG_POOLS.videos||[]).length);
      W.IBG_GALLERY.renderVideos('videos-grid', 20, (W.__ENV&&__ENV.PRICE_VIDEO_EUR)||"0.30€");
      W.IBG_GALLERY.wirePaywall('paywall-modal');
    }
    // PayPal + Ads + Chat
    if (W.IBG_PAYMENTS){ W.IBG_PAYMENTS.loadPayPal(); W.IBG_PAYMENTS.initPaywallUnlockButton(); var t=setInterval(function(){ if(W.paypal){ clearInterval(t); if (document.getElementById('paypal-monthly')) W.IBG_PAYMENTS.mountSubButtons(); }}, 300); }
    if (W.IBG_ADS)  W.IBG_ADS.initAds();
    if (W.IBG_CHAT) W.IBG_CHAT.initCrisp();
  }
  function tryStart(){
    if(domReady && decorReady){ mountBanner(); if (W.IBG_CAROUSEL && document.getElementById('home-carousel')) W.IBG_CAROUSEL.mountCarousel('home-carousel'); }
    if(domReady && poolsReady){ log('🚀 IBG_BOOT start'); paintMedia(); }
  }
  // DOM
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ domReady=true; tryStart(); }); } else { domReady=true; }
  // Eventos
  W.addEventListener('IBG_DECOR_READY', function(){ decorReady=true; tryStart(); });
  W.addEventListener('IBG_POOLS_READY', function(){ poolsReady=true; tryStart(); });
  tryStart();
})(window);
