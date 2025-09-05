(function(){
  var E     = (window.__ENV||{});
  var SPACE = E.EROADVERTISING_SPACE || '8182057';
  var PID   = E.EROADVERTISING_PID   || '152716';
  var CTRL  = E.EROADVERTISING_CTRL  || '798544';

  var host = document.getElementById('ad-ero') || document.body;
  var iframe = document.createElement('iframe');
  iframe.src = '/ads/eroframe_ctrl.html'
            + '?space='+encodeURIComponent(SPACE)
            + '&pid='+encodeURIComponent(PID)
            + '&ctrl='+encodeURIComponent(CTRL);
  iframe.loading='lazy';
  iframe.referrerPolicy='unsafe-url';
  iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups');
  iframe.style.cssText='border:0;width:300px;height:250px;display:block;margin:16px auto;';
  host.appendChild(iframe);
  console.log('[ads-ero-ctrl] mounted →', iframe.src);
})();
