document.addEventListener("paypal:sdk-ready", function(){
  var monthly  = (window.ENV && window.ENV.PAYPAL_PLAN_MONTHLY_1499) || "";
  var yearly   = (window.ENV && window.ENV.PAYPAL_PLAN_ANNUAL_4999) || "";
  var oneshot  = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR) || "3.00";

  if (window.paypal && monthly) {
    paypal.Buttons({
      style:{layout:"vertical",shape:"pill",label:"subscribe"},
      createSubscription:(d,a)=>a.subscription.create({ plan_id: monthly }),
      onApprove:(d)=>{ var el=document.getElementById("status-monthly"); if(el){ el.textContent="✅ Mensual activa: "+d.subscriptionID; } }
    }).render("#btn-monthly");
  }

  if (window.paypal && yearly) {
    paypal.Buttons({
      style:{layout:"vertical",shape:"pill",label:"subscribe"},
      createSubscription:(d,a)=>a.subscription.create({ plan_id: yearly }),
      onApprove:(d)=>{ var el=document.getElementById("status-yearly"); if(el){ el.textContent="✅ Anual activa: "+d.subscriptionID; } }
    }).render("#btn-yearly");
  }

  if (window.paypal) {
    paypal.Buttons({
      style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ value: oneshot, currency_code:"EUR" }, description:"Acceso Premium 24h" }] }),
      onApprove:(d,a)=>a.order.capture().then(()=>{ var el=document.getElementById("status-lifetime"); if(el){ el.textContent="✅ Pago único completado"; } }),
      onError:(err)=>{ console.error(err); var el=document.getElementById("status-lifetime"); if(el){ el.textContent="❌ Error en pago único"; } }
    }).render("#btn-lifetime");
  }
});
