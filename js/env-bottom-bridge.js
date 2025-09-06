/* puente para asegurar EXOCLICK_BOTTOM_ZONE */
(function(){
  window.__ENV = window.__ENV || {};
  // Valor preferente: el de Vercel (compilado aquí). Si está vacío, no pisa nada.
  var VERCEL_BOTTOM = "";
  if (VERCEL_BOTTOM && !window.__ENV.EXOCLICK_BOTTOM_ZONE){
    window.__ENV.EXOCLICK_BOTTOM_ZONE = VERCEL_BOTTOM;
  }
})();
