/*! shim:ads-debug.js -> /js/ads-debug.js */
(function(){
  var s=document.createElement('script'); s.src='/js/ads-debug.js'; s.async=false;
  (document.currentScript && document.currentScript.parentNode)
    ? document.currentScript.parentNode.insertBefore(s, document.currentScript.nextSibling)
    : document.head.appendChild(s);
})();
