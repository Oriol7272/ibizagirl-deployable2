(function(W){
  W.IBG_ENV = W.IBG_ENV || {};
  var E = W.IBG_ENV;
  E.EXOCLICK_ZONE = '5696328';
  E.EXOCLICK_BOTTOM_ZONE = '5717078';
  E.EXOCLICK_ZONES = '5696328,5705186';
  E.EROADVERTISING_PID = '152716';
  E.EROADVERTISING_SPACE = '8182057';

  var IBG = W.IBG_ADS = W.IBG_ADS || {};
  IBG.mount = function(zone, nodeId){
    var el = document.getElementById(nodeId);
    if(!el) return;
    // Iframe simple de ExoClick (display)
    var iframe = document.createElement('iframe');
    iframe.src = "https://syndication.exdynsrv.com/ads-iframe-display.php?idzone=" + encodeURIComponent(zone);
    iframe.width = el.getAttribute('data-w') || "728";
    iframe.height = el.getAttribute('data-h') || "90";
    iframe.setAttribute('frameborder','0');
    iframe.setAttribute('scrolling','no');
    iframe.style.border="0"; iframe.style.display="block";
    el.innerHTML = ""; el.appendChild(iframe);
  };
  IBG.initAds = function(){
    console.log("IBG_ADS ZONES ->", E);
    // Sidebars
    IBG.mount('5696328','ad-left');
    IBG.mount('5705186','ad-right');
    // Bottom row (centro)
    IBG.mount(E.EXOCLICK_BOTTOM_ZONE,'ad-bottom');
  };
})(window);
