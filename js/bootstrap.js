(function(W){
  var domReady=false, poolsReady=false;
  function log(){ try{ console.log.apply(console, arguments); }catch(_){}

  }
  function tryStart(){
    if(!(domReady && poolsReady)) return;
    log('🚀 IBG_BOOT start');

    // Carousel en Home
    if (document.getElementById('home-carousel') && W.IBG_CAROUSEL){
      W.IBG_CAROUSEL.mountCarousel('home-carousel');
    }
    // Galería pública (Home)
    if (document.getElementById('home-gallery') && W.IBG_GALLERY && W.IBG_POOLS){
      log('🖼️ Home gallery: full=', (W.IBG_POOLS.full||[]).length);
      W.IBG_GALLERY.renderPublic('home-gallery', 40);
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
    // PayPal (Premium/Videos/Suscripciones)
    if (W.IBG_PAYMENTS){
      W.IBG_PAYMENTS.loadPayPal();
      W.IBG_PAYMENTS.initPaywallUnlockButton();
      var t=setInterval(function(){ if(W.paypal){ clearInterval(t); if (document.getElementById('paypal-monthly')) W.IBG_PAYMENTS.mountSubButtons(); }}, 300);
    }
    // Ads + Chat (si hay variables)
    if (W.IBG_ADS)  W.IBG_ADS.initAds();
    if (W.IBG_CHAT) W.IBG_CHAT.initCrisp();
  }

  // 1) DOM listo
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ domReady=true; tryStart(); });
  } else { domReady=true; }

  // 2) Pools listos (fs-pools.js dispara este evento)
  if (W.IBG_POOLS){ poolsReady=true; }
  W.addEventListener('IBG_POOLS_READY', function(){ poolsReady=true; tryStart(); });

  // 3) Por si ambas condiciones ya se cumplieron
  tryStart();
})(window);
