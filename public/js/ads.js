(function(W){
  var E = (W.__ENV||{});
  function injectFrame(targetId, zone, w, h){
    var el = document.getElementById(targetId);
    if(!el || !zone) return;
    el.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = '/ads/ero-frame.html?zone=' + encodeURIComponent(zone);
    f.width = w||300; f.height = h||250;
    f.loading = 'lazy';
    f.setAttribute('frameborder','0');
    f.setAttribute('scrolling','no');
    f.setAttribute('title','ad');
    f.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    f.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox');
    el.appendChild(f);
  }

  function initEro(){
    var z = E.EROADVERTISING_ZONE;
    if(!z) return false;
    injectFrame('ad-bottom', z, 300, 250);
    injectFrame('ad-left',   z, 300, 600);
    injectFrame('ad-right',  z, 300, 600);
    console.log('IBG_ADS: ERO mounted ->', z);
    return true;
  }

  W.IBG_ADS = { initAds: function(){ initEro(); } };
})(window);
