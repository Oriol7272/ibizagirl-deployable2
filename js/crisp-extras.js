(function(){
  function boot(){
    if(!window.$crisp) return setTimeout(boot,500);
    // Atajos
    window.$crisp.push(["do", "chat:show"]);
    window.$crisp.push(["on", "chat:ready", function(){
      window.$crisp.push(["do", "message:show", ["text","Hola 💙 ¿En qué te ayudo?"]]);
    }]);
    // Macros / preguntas rápidas
    window.$crisp.push(["config", "quick-replies", [
      { content:"Precios", payload:"precios" },
      { content:"¿Qué incluye Lifetime?", payload:"lifetime" },
      { content:"Soporte PayPal", payload:"paypal" }
    ]]);
    window.$crisp.push(["on", "message:received", function(msg){
      var p=(msg.content||"").toLowerCase();
      if(p.includes("precios")) window.$crisp.push(["do","message:send",["text","Fotos €0,10 · Vídeos €0,30 · Mensual €14,99 · Anual €49,99 · Lifetime €100 (sin anuncios)."]]);
      if(p.includes("lifetime")) window.$crisp.push(["do","message:send",["text","Acceso a TODO para siempre + sin anuncios."]]);
      if(p.includes("paypal")) window.$crisp.push(["do","message:send",["text","Si tienes un problema con el pago, te ayudo por aquí."]]);
    }]);
  }
  boot();
})();
