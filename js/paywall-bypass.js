(function(){
  try {
    console.log("[paywall-bypass] activo");
    // Flag global para que cualquier lógica condicional lo detecte
    window.IBG_PAYWALL_DISABLED = true;

    // Función que muestra todo lo marcado como premium/oculto
    function showAll(){
      var sel = [
        "[data-premium]",
        ".premium-locked",
        ".hidden-premium",
        ".paywall-locked"
      ].join(",");

      document.querySelectorAll(sel).forEach(function(el){
        el.classList.remove("premium-locked","hidden-premium","paywall-locked");
        el.style.removeProperty("display");
        el.style.removeProperty("opacity");
        el.style.removeProperty("visibility");
        el.hidden = false;
      });
    }

    // Ejecutar ahora y cuando el contenido avise que está listo
    showAll();
    document.addEventListener("DOMContentLoaded", showAll);
    document.addEventListener("ibg:content-ready", showAll);

    // Si existe un módulo de pagos que permita desactivar, intenta hacerlo
    if (window.IbgPayments && typeof window.IbgPayments.disable === "function") {
      try { window.IbgPayments.disable(); } catch(e) { /* ignore */ }
    }
  } catch(e){
    console.error("[paywall-bypass] error", e);
  }
})();
