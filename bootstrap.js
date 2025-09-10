/*! shim:bootstrap.js -> /js/bootstrap.js */
(function(){
  var s=document.createElement('script'); s.src='/js/bootstrap.js'; s.async=false;
  (document.currentScript && document.currentScript.parentNode)
    ? document.currentScript.parentNode.insertBefore(s, document.currentScript.nextSibling)
    : document.head.appendChild(s);
})();
