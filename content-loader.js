/*! shim:content-loader.js -> /js/content-loader.js */
(function(){
  var s=document.createElement('script'); s.src='/js/content-loader.js'; s.async=false;
  (document.currentScript && document.currentScript.parentNode)
    ? document.currentScript.parentNode.insertBefore(s, document.currentScript.nextSibling)
    : document.head.appendChild(s);
})();
