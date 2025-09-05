/* Mount EroAdvertising eaCtrl into #ad-bottom (300x250) */
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    var ENV = window._ENV || {};
    var space = String(ENV.EROADVERTISING_SPACE || '8182057');
    var pid   = String(ENV.EROADVERTISING_PID   || '152716');
    var ctrl  = String(ENV.EROADVERTISING_CTRL  || '798544');

    var url = '/ads/eroframe_ctrl.html'
            + '?space='+encodeURIComponent(space)
            + '&pid='+encodeURIComponent(pid)
            + '&ctrl='+encodeURIComponent(ctrl);

    var slotId = 'ad-bottom';
    var host = document.getElementById(slotId);
    if(!host){ console.warn('[ads-ero-ctrl] slot not found:', slotId); return; }

    host.innerHTML='';
    host.style.width  = '300px';
    host.style.height = '250px';

    var ifr = document.createElement('iframe');
    ifr.src = url;
    ifr.width = '300';
    ifr.height = '250';
    ifr.setAttribute('frameborder','0');
    ifr.setAttribute('scrolling','no');
    ifr.style.border = '0';
    ifr.style.display = 'block';
    host.appendChild(ifr);

    console.log('[ads-ero-ctrl] mounted →', url);
  });
})();
